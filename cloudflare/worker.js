/**
 * Cloudflare Worker: Real-Time Notification & WebSocket Hub
 * 
 * Provides global, ultra-low latency real-time notifications for RecTracker:
 * - Server-Sent Events (SSE) stream (/sse)
 * - WebSocket duplex messaging (/ws)
 * - HTTP broadcast webhook (/notify)
 * - Web Push subscription store and dispatcher (/push/*)
 * 
 * Deploy via Wrangler:
 *   npx wrangler deploy
 */

// In-memory active connection pools (per edge pop)
const sseClients = new Set();
const wsClients = new Set();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 1. Health & Info
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "online",
          service: "RecTracker Cloudflare Real-Time Notification Engine",
          activeSseClients: sseClients.size,
          activeWsClients: wsClients.size,
          endpoints: {
            sse: "/sse",
            ws: "/ws",
            broadcast: "/notify",
            pushSubscribe: "/push/subscribe",
          },
          timestamp: Date.now(),
        }),
        {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Server-Sent Events (SSE) Stream
    if (url.pathname === "/sse" || url.pathname === "/events") {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // Send initial connection event
      writer.write(
        encoder.encode(
          `event: connected\ndata: ${JSON.stringify({
            message: "Connected to Cloudflare Global Edge Notification Hub",
            timestamp: Date.now(),
          })}\n\n`
        )
      );

      // Keep connection reference
      const client = { writer, encoder };
      sseClients.add(client);

      // Heartbeat interval to keep connection alive through edge proxies
      const heartbeat = setInterval(() => {
        try {
          writer.write(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
          sseClients.delete(client);
        }
      }, 25000);

      // Cleanup when stream closes
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        sseClients.delete(client);
        try {
          writer.close();
        } catch (_) {}
      });

      return new Response(readable, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    // 3. WebSocket Endpoint
    if (url.pathname === "/ws") {
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
        return new Response("Expected WebSocket Upgrade", { status: 426 });
      }

      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();
      wsClients.add(server);

      server.send(
        JSON.stringify({
          type: "welcome",
          message: "Connected to Cloudflare WebSocket Notification Edge",
          timestamp: Date.now(),
        })
      );

      server.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          // Ping/pong heartbeat
          if (data.type === "ping") {
            server.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          }
        } catch (_) {}
      });

      server.addEventListener("close", () => {
        wsClients.delete(server);
      });

      server.addEventListener("error", () => {
        wsClients.delete(server);
      });

      return new Response(null, {
        status: 101,
        webSocket: client,
        headers: CORS_HEADERS,
      });
    }

    // 4. Broadcast Notification Endpoint (HTTP POST)
    // Called by Python scripts (realtime_server.py, due_for_verification.py, etc.)
    if (url.pathname === "/notify" || url.pathname === "/broadcast") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
      }

      // Optional Bearer token validation
      const auth = request.headers.get("Authorization");
      const expectedSecret = env.CF_NOTIFY_SECRET;
      if (expectedSecret && auth !== `Bearer ${expectedSecret}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      let payload = {};
      try {
        payload = await request.json();
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      const notification = {
        id: payload.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: payload.title || "Notification Alert",
        message: payload.message || payload.body || "New update received",
        type: payload.type || "info", // 'info' | 'success' | 'warning' | 'alert' | 'video'
        timestamp: payload.timestamp || Date.now(),
        url: payload.url || null,
        metadata: payload.metadata || {},
      };

      // Broadcast to all active SSE clients
      let sseDelivered = 0;
      const sseMsg = `event: notification\ndata: ${JSON.stringify(notification)}\n\n`;
      for (const client of sseClients) {
        try {
          client.writer.write(client.encoder.encode(sseMsg));
          sseDelivered++;
        } catch (_) {
          sseClients.delete(client);
        }
      }

      // Broadcast to all active WebSocket clients
      let wsDelivered = 0;
      const wsMsg = JSON.stringify({ type: "notification", notification });
      for (const ws of wsClients) {
        try {
          ws.send(wsMsg);
          wsDelivered++;
        } catch (_) {
          wsClients.delete(ws);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          delivered: {
            sse: sseDelivered,
            ws: wsDelivered,
            total: sseDelivered + wsDelivered,
          },
          notification,
        }),
        {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Web Push Subscription Store (KV or Memory)
    if (url.pathname === "/push/subscribe" && request.method === "POST") {
      try {
        const sub = await request.json();
        // If Cloudflare KV is bound as env.PUSH_SUBSCRIPTIONS, store it
        if (env.PUSH_SUBSCRIPTIONS && sub.endpoint) {
          const key = `sub_${btoa(sub.endpoint).substring(0, 32)}`;
          await env.PUSH_SUBSCRIPTIONS.put(key, JSON.stringify(sub), {
            expirationTtl: 30 * 24 * 3600, // 30 days
          });
        }
        return new Response(JSON.stringify({ success: true, message: "Subscription saved" }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }
    }

    // 6. Serve Static Assets (Vite React Frontend)
    if (env.ASSETS) {
      try {
        return await env.ASSETS.fetch(request);
      } catch (_) {}
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
};



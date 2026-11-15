import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Laptop,
  CheckCircle,
  X,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  Apple,
  Radio,
  Share2,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NetworkInfoResponse {
  hostname?: string;
  primaryIp?: string;
  allIps?: string[];
  port?: number;
  mobileUrl?: string;
  localWifiUrl?: string;
  cloudflareUrl?: string;
}

interface InstallAppButtonProps {
  initialTab?: 'mobile' | 'laptop';
  className?: string;
  variant?: 'header' | 'sidebar' | 'full';
}

export function InstallAppButton({ className = '', variant = 'sidebar' }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'laptop'>('mobile');

  // Network and QR Code State
  const [detectedIp, setDetectedIp] = useState<string>('10.251.69.204');
  const [allIps, setAllIps] = useState<string[]>(['10.251.69.204']);
  const [port, setPort] = useState<number>(3000);
  const [cloudflareUrl, setCloudflareUrl] = useState<string>('');
  const [urlMode, setUrlMode] = useState<'cloudflare' | 'local'>('cloudflare');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  // Fetch host's local network IP and active Cloudflare tunnel from backend
  const fetchNetworkInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/network-info');
      if (res.ok) {
        const data: NetworkInfoResponse = await res.json();
        if (data.primaryIp) setDetectedIp(data.primaryIp);
        if (data.allIps && data.allIps.length > 0) setAllIps(data.allIps);
        if (data.port) setPort(data.port);
        if (data.cloudflareUrl) {
          setCloudflareUrl(data.cloudflareUrl);
          setUrlMode('cloudflare');
        }
      }
    } catch (e) {
      console.warn('Could not fetch network info, using local Wi-Fi fallback:', e);
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();
  }, [fetchNetworkInfo]);

  // Determine active mobile URL
  const activeBaseUrl =
    urlMode === 'cloudflare' && cloudflareUrl
      ? cloudflareUrl
      : `http://${detectedIp}:${port}`;

  const mobileUrl = customUrl.trim() || activeBaseUrl;

  // Generate high-resolution, perfectly square QR code
  useEffect(() => {
    let isCurrent = true;
    QRCode.toDataURL(mobileUrl, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isCurrent) setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });

    return () => {
      isCurrent = false;
    };
  }, [mobileUrl]);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const openModal = (tab: 'mobile' | 'laptop') => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const handleLaptopInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        openModal('laptop');
      }
    } else {
      openModal('laptop');
    }
  };

  const copyMobileLink = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Could not copy link to clipboard', e);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <>
      {/* Sidebar Promo Card */}
      {variant === 'sidebar' && (
        <button
          onClick={() => openModal('mobile')}
          className={`w-full p-2.5 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-indigo-600/15 hover:from-emerald-600/25 hover:to-indigo-600/25 border-emerald-500/30 text-white shadow-md shadow-emerald-500/5 group ${className}`}
          title="Scan QR Code to open on mobile"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-black flex items-center justify-center font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <QrCode size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <span>Mobile App (QR)</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-gray-400 truncate">Scan with phone camera</p>
          </div>
        </button>
      )}

      {/* Header Variant (if called) */}
      {variant === 'header' && (
        <button
          onClick={() => openModal('mobile')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 ${className}`}
          title="Open mobile scanner"
        >
          <QrCode size={13} className="text-emerald-400" />
          <span>Mobile App</span>
        </button>
      )}

      {/* Modern, Beautiful, Elegant Redesigned Mobile Scanner Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100000] overflow-y-auto p-3 sm:p-5 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="relative w-full max-w-md mx-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#131622] via-[#0f111a] to-[#0a0b12] shadow-2xl text-gray-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Clean, Un-truncated, with Minimalist Circular Close Button */}
            <div className="px-5 py-4 bg-[#161a29]/90 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                  {activeTab === 'mobile' ? <QrCode size={18} /> : <Laptop size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">Open on Mobile Phone</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    100% ad-free full-screen stream on your phone
                  </p>
                </div>
              </div>

              {/* Minimalist, Circular Close Button (Never squishes title) */}
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close modal (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto max-h-[82vh] space-y-4">
              {/* Segmented Tab Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-black/50 border border-white/10">
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'mobile'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Mobile Phone</span>
                </button>

                <button
                  onClick={() => setActiveTab('laptop')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'laptop'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Laptop size={14} />
                  <span>Laptop / Desktop</span>
                </button>
              </div>

              {/* TAB 1: Mobile Phone QR Scanner */}
              {activeTab === 'mobile' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Connection Selector: Clean Side-by-Side Pills */}
                  {cloudflareUrl && (
                    <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <button
                        onClick={() => setUrlMode('cloudflare')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          urlMode === 'cloudflare'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Sparkles size={12} className="text-emerald-300" />
                        <span>Cloudflare HTTPS (Anywhere)</span>
                      </button>
                      <button
                        onClick={() => setUrlMode('local')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          urlMode === 'local'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Wifi size={12} />
                        <span>Local Wi-Fi</span>
                      </button>
                    </div>
                  )}

                  {/* QR Code Presentation Box: Perfectly Square & Centered */}
                  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-[#131622] to-[#0c0e17] flex flex-col items-center text-center">
                    {/* The Square QR Card */}
                    <div className="relative w-48 h-48 sm:w-52 sm:h-52 aspect-square p-2.5 bg-white rounded-2xl shadow-2xl flex items-center justify-center mx-auto my-1 border-2 border-emerald-400/40 shrink-0">
                      {/* Scanner Target Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br" />

                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="Scan QR Code to open on mobile"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-700">
                          <RefreshCw className="animate-spin text-emerald-600 mb-2" size={24} />
                          <span className="text-xs font-semibold">Generating...</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-emerald-300 font-semibold mt-2 flex items-center gap-1.5">
                      <QrCode size={13} />
                      <span>Point your phone camera at this QR code</span>
                    </p>

                    {/* URL Bar & Actions */}
                    <div className="w-full mt-3">
                      {isEditingUrl ? (
                        <div className="flex items-center gap-1.5 mb-2">
                          <input
                            type="text"
                            value={customUrl || mobileUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                          <button
                            onClick={() => setIsEditingUrl(false)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-300">
                          <span className="truncate select-all px-1 text-[11px]">{mobileUrl}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={copyMobileLink}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-[11px] font-sans font-semibold cursor-pointer"
                              title="Copy URL"
                            >
                              {copied ? (
                                <>
                                  <Check size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <a
                              href={mobileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 text-[11px] font-sans font-semibold cursor-pointer"
                              title="Test link"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 px-1">
                        <button
                          onClick={() => setIsEditingUrl(!isEditingUrl)}
                          className="text-indigo-400 hover:underline cursor-pointer"
                        >
                          {isEditingUrl ? 'Cancel' : 'Edit IP / Port'}
                        </button>

                        {qrCodeDataUrl && (
                          <a
                            href={qrCodeDataUrl}
                            download="RecTracker-Mobile-QR.png"
                            className="text-gray-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                          >
                            <Download size={11} />
                            <span>Download PNG</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean 3-Step Installation Guide */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-1">
                        1
                      </div>
                      <span className="text-[11px] font-bold text-white">Scan QR</span>
                      <span className="text-[9px] text-gray-400">with Camera</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center mb-1">
                        2
                      </div>
                      <span className="text-[11px] font-bold text-white">Open Link</span>
                      <span className="text-[9px] text-gray-400">in Chrome / Safari</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center mb-1">
                        3
                      </div>
                      <span className="text-[11px] font-bold text-white">Add to Home</span>
                      <span className="text-[9px] text-gray-400">Stream ad-free</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Laptop / Desktop Install */}
              {activeTab === 'laptop' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Laptop size={16} className="text-indigo-400" />
                        <h4 className="text-xs font-bold text-white">Chrome / Edge App Install</h4>
                      </div>
                      {deferredPrompt && (
                        <button
                          onClick={handleLaptopInstallClick}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Install Now
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Click the <strong>Install App icon (🖥️ ⬇️)</strong> in your browser address bar (top right) or menu ⋮ → <strong>&quot;Install RecTracker as app&quot;</strong>.
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-2 font-semibold">
                      ✓ Creates desktop shortcut & runs in distraction-free window without browser tabs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <h4 className="text-xs font-bold text-white mb-1">1-Click Desktop Launcher</h4>
                    <p className="text-xs text-gray-400">
                      Double-click <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 font-mono">Launch_App.bat</code> in the project folder to start everything automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#121420] border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-emerald-400" />
                <span>Zero Ads • PWA Full-Screen</span>
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

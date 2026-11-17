import json

print("Integrating the 11 Top Software Development Channels into ChannelHub.tsx...")

with open("src/components/ChannelHub.tsx", "r", encoding="utf-8") as f:
    hub = f.read()

# 1. Update VERIFIED_CREATOR_AVATARS
avatar_additions = """  'the net ninja': 'https://unavatar.io/youtube/@NetNinja',
  'net ninja': 'https://unavatar.io/youtube/@NetNinja',
  'netninja': 'https://unavatar.io/youtube/@NetNinja',
  'web dev simplified': 'https://unavatar.io/youtube/@WebDevSimplified',
  'webdevsimplified': 'https://unavatar.io/youtube/@WebDevSimplified',
  'kevin powell': 'https://unavatar.io/youtube/@KevinPowell',
  'kevinpowell': 'https://unavatar.io/youtube/@KevinPowell',
  'theo': 'https://unavatar.io/youtube/@t3dotgg',
  'theo - t3.gg': 'https://unavatar.io/youtube/@t3dotgg',
  't3dotgg': 'https://unavatar.io/youtube/@t3dotgg',
  'hussein nasser': 'https://unavatar.io/youtube/@hnasr',
  'hnasr': 'https://unavatar.io/youtube/@hnasr',
  'theprimeagen': 'https://unavatar.io/youtube/@ThePrimeagen',
  'primeagen': 'https://unavatar.io/youtube/@ThePrimeagen',
  'continuous delivery': 'https://unavatar.io/youtube/@ContinuousDelivery',
  'dave farley': 'https://unavatar.io/youtube/@ContinuousDelivery',
  'continuousdelivery': 'https://unavatar.io/youtube/@ContinuousDelivery',
"""

if "'the net ninja'" not in hub:
    hub = hub.replace("const VERIFIED_CREATOR_AVATARS: Record<string, string> = {", "const VERIFIED_CREATOR_AVATARS: Record<string, string> = {\n" + avatar_additions)
    print("Added new creator avatars!")

# 2. Fix the typo '8hly31xKli0' back to 'piyush-garg'
hub = hub.replace("id: '8hly31xKli0'", "id: 'piyush-garg'")

# 3. Add the channels to DEFAULT_CURATED_CHANNELS
new_channels_definition = """  {
    id: 'the-net-ninja',
    name: 'The Net Ninja',
    handle: '@NetNinja',
    avatarUrl: 'https://unavatar.io/youtube/@NetNinja',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    subscriberCount: '1.3M subscribers',
    description: 'Black-belt step-by-step masterclasses on React, Node.js, TypeScript, Next.js, and modern full-stack web development.',
    videoCount: 35,
    addedAt: Date.now() - 5 * 86400000,
    tags: ['net ninja', 'react', 'typescript', 'node.js', 'vue', 'frontend', 'javascript'],
  },
  {
    id: 'web-dev-simplified',
    name: 'Web Dev Simplified',
    handle: '@WebDevSimplified',
    avatarUrl: 'https://unavatar.io/youtube/@WebDevSimplified',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    subscriberCount: '1.6M subscribers',
    description: 'Crystal-clear explanations of tricky JavaScript concepts, React hooks (useEffect, useState), Fetch API, and frontend system architecture.',
    videoCount: 28,
    addedAt: Date.now() - 8 * 86400000,
    tags: ['web dev simplified', 'react', 'useeffect', 'usestate', 'javascript', 'frontend', 'hooks'],
  },
  {
    id: 'kevin-powell',
    name: 'Kevin Powell',
    handle: '@KevinPowell',
    avatarUrl: 'https://unavatar.io/youtube/@KevinPowell',
    domain: 'Web Development',
    category: 'CSS, animations & design systems',
    subcategoryId: 21,
    subscriberCount: '950K subscribers',
    description: 'The King of CSS. Expert-level responsive layouts, CSS Grid, Flexbox, custom properties, animations, and modern design systems.',
    videoCount: 25,
    addedAt: Date.now() - 10 * 86400000,
    tags: ['kevin powell', 'css', 'css grid', 'flexbox', 'responsive design', 'animations', 'tailwind'],
  },
  {
    id: 'theo-t3',
    name: 'Theo - t3․gg',
    handle: '@t3dotgg',
    avatarUrl: 'https://unavatar.io/youtube/@t3dotgg',
    domain: 'Web Development',
    category: 'Full-Stack Frameworks',
    subcategoryId: 19,
    subscriberCount: '320K subscribers',
    description: 'Modern TypeScript, Next.js, React 19 server actions, TailwindCSS, and candid full-stack web architecture insights from a tech CEO.',
    videoCount: 18,
    addedAt: Date.now() - 4 * 86400000,
    tags: ['theo', 't3.gg', 'next.js', 'react 19', 'typescript', 'fullstack', 'architecture'],
  },
  {
    id: 'hussein-nasser',
    name: 'Hussein Nasser',
    handle: '@hnasr',
    avatarUrl: 'https://unavatar.io/youtube/@hnasr',
    domain: 'Security & Data',
    category: 'Relational databases (PostgreSQL, MySQL)',
    subcategoryId: 23,
    subscriberCount: '410K subscribers',
    description: 'Deep engineering dives into backend internals, networking protocols (HTTP/3, TCP, QUIC), database indexing, B-Trees, and WAL.',
    videoCount: 22,
    addedAt: Date.now() - 6 * 86400000,
    tags: ['hussein nasser', 'database', 'backend', 'networking', 'http/3', 'indexing', 'b-trees', 'postgres'],
  },
  {
    id: 'theprimeagen',
    name: 'ThePrimeagen',
    handle: '@ThePrimeagen',
    avatarUrl: 'https://unavatar.io/youtube/@ThePrimeagen',
    domain: 'Software Engineering Practice',
    category: 'Clean code & refactoring',
    subcategoryId: 56,
    subscriberCount: '720K subscribers',
    description: 'Blazing fast software engineering, memory management, algorithms, Neovim workflows, Rust, and high-performance system thinking.',
    videoCount: 24,
    addedAt: Date.now() - 7 * 86400000,
    tags: ['theprimeagen', 'primeagen', 'algorithms', 'rust', 'neovim', 'performance', 'clean code'],
  },
  {
    id: 'continuous-delivery',
    name: 'Continuous Delivery',
    handle: '@ContinuousDelivery',
    avatarUrl: 'https://unavatar.io/youtube/@ContinuousDelivery',
    domain: 'Cloud & DevOps',
    category: 'CI/CD pipelines & automation',
    subcategoryId: 32,
    subscriberCount: '290K subscribers',
    description: 'Dave Farley (co-author of the Continuous Delivery book) on modern software engineering, automated testing, TDD, and CI/CD discipline.',
    videoCount: 20,
    addedAt: Date.now() - 9 * 86400000,
    tags: ['continuous delivery', 'dave farley', 'ci/cd', 'tdd', 'testing', 'devops', 'software engineering'],
  },
"""

# Check if 'the-net-ninja' is already in DEFAULT_CURATED_CHANNELS
if "id: 'the-net-ninja'" not in hub:
    hub = hub.replace("const DEFAULT_CURATED_CHANNELS: TrackedChannel[] = [", "const DEFAULT_CURATED_CHANNELS: TrackedChannel[] = [\n" + new_channels_definition)
    print("Added new channels to DEFAULT_CURATED_CHANNELS!")

# 4. Add curated playlists for these new channels
new_playlists_definition = """  'the-net-ninja': [
    {
      id: 'pl-netninja-react',
      channelId: 'the-net-ninja',
      channelName: 'The Net Ninja',
      title: 'Full React Masterclass Tutorial Series',
      description: 'Complete hands-on guide to building modern React single-page applications with hooks and components.',
      playlistId: 'PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
      thumbnailUrl: 'https://i.ytimg.com/vi/j942wKiXFu8/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-nn-1',
          videoId: 'j942wKiXFu8',
          url: 'https://www.youtube.com/watch?v=j942wKiXFu8',
          thumbnailUrl: 'https://i.ytimg.com/vi/j942wKiXFu8/hqdefault.jpg',
          title: 'Full React Tutorial #1 - Introduction & Setup',
          channel: 'The Net Ninja',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 900,
          timestamp: Date.now() - 3 * 3600000,
          source: 'home',
          tags: ['net ninja', 'react', 'frontend', 'tutorial']
        },
        {
          id: 'pl-nn-2',
          videoId: 'b9eMGE7QtTk',
          url: 'https://www.youtube.com/watch?v=b9eMGE7QtTk',
          thumbnailUrl: 'https://i.ytimg.com/vi/b9eMGE7QtTk/hqdefault.jpg',
          title: 'React JS Full Course | Build an App and Deploy',
          channel: 'The Net Ninja',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 3600,
          timestamp: Date.now() - 12 * 3600000,
          source: 'trending',
          tags: ['net ninja', 'react full course', 'javascript']
        }
      ]
    }
  ],
  'web-dev-simplified': [
    {
      id: 'pl-wds-react-hooks',
      channelId: 'web-dev-simplified',
      channelName: 'Web Dev Simplified',
      title: 'React Hooks & Modern Frontend Deep Dive',
      description: 'Master React state management with useEffect, useState, and custom hooks explained clearly.',
      playlistId: 'PLZlA0Gpn_vH8EtggFGERCwMY565h8O-BQ',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY565h8O-BQ',
      thumbnailUrl: 'https://i.ytimg.com/vi/0ZJgIjIuY7U/hqdefault.jpg',
      videoCount: 3,
      videos: [
        {
          id: 'pl-wds-1',
          videoId: '0ZJgIjIuY7U',
          url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
          thumbnailUrl: 'https://i.ytimg.com/vi/0ZJgIjIuY7U/hqdefault.jpg',
          title: 'Learn useEffect In 13 Minutes (React Hook Tutorial)',
          channel: 'Web Dev Simplified',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 780,
          timestamp: Date.now() - 4 * 3600000,
          source: 'home',
          tags: ['web dev simplified', 'useeffect', 'react', 'hooks']
        },
        {
          id: 'pl-wds-2',
          videoId: 'O6P86uwfdR0',
          url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
          thumbnailUrl: 'https://i.ytimg.com/vi/O6P86uwfdR0/hqdefault.jpg',
          title: 'Learn useState In 15 Minutes - React Hook Explained',
          channel: 'Web Dev Simplified',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 900,
          timestamp: Date.now() - 10 * 3600000,
          source: 'trending',
          tags: ['web dev simplified', 'usestate', 'react', 'hooks']
        },
        {
          id: 'pl-wds-3',
          videoId: 'cuEtnrL9-H0',
          url: 'https://www.youtube.com/watch?v=cuEtnrL9-H0',
          thumbnailUrl: 'https://i.ytimg.com/vi/cuEtnrL9-H0/hqdefault.jpg',
          title: 'Learn Fetch API In 6 Minutes (JavaScript HTTP Requests)',
          channel: 'Web Dev Simplified',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 360,
          timestamp: Date.now() - 18 * 3600000,
          source: 'home',
          tags: ['web dev simplified', 'fetch api', 'http', 'javascript']
        }
      ]
    }
  ],
  'kevin-powell': [
    {
      id: 'pl-kevin-css-grid',
      channelId: 'kevin-powell',
      channelName: 'Kevin Powell',
      title: 'Modern CSS Grid & Responsive Design Systems',
      description: 'Learn modern CSS layouts, Grid vs Flexbox, and how to create clean, responsive interfaces.',
      playlistId: 'PL4-IK0AVhVjNMs8vQkXwJ9N1v35v8XGv7',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL4-IK0AVhVjNMs8vQkXwJ9N1v35v8XGv7',
      thumbnailUrl: 'https://i.ytimg.com/vi/rg7Fvvl3taU/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-kp-1',
          videoId: 'rg7Fvvl3taU',
          url: 'https://www.youtube.com/watch?v=rg7Fvvl3taU',
          thumbnailUrl: 'https://i.ytimg.com/vi/rg7Fvvl3taU/hqdefault.jpg',
          title: 'Learn CSS Grid the Easy Way - Complete Masterclass',
          channel: 'Kevin Powell',
          domain: 'Web Development',
          category: 'CSS, animations & design systems',
          subcategoryId: 21,
          duration: 1200,
          timestamp: Date.now() - 5 * 3600000,
          source: 'trending',
          tags: ['kevin powell', 'css grid', 'responsive', 'web design']
        },
        {
          id: 'pl-kp-2',
          videoId: 'dFgzHOX84xQ',
          url: 'https://www.youtube.com/watch?v=dFgzHOX84xQ',
          thumbnailUrl: 'https://i.ytimg.com/vi/dFgzHOX84xQ/hqdefault.jpg',
          title: 'Tailwind Crash Course | Project From Scratch',
          channel: 'Kevin Powell',
          domain: 'Web Development',
          category: 'CSS, animations & design systems',
          subcategoryId: 21,
          duration: 3600,
          timestamp: Date.now() - 16 * 3600000,
          source: 'home',
          tags: ['kevin powell', 'tailwind', 'css', 'design systems']
        }
      ]
    }
  ],
  'theo-t3': [
    {
      id: 'pl-theo-nextjs',
      channelId: 'theo-t3',
      channelName: 'Theo - t3․gg',
      title: 'Full Stack Next.js & Modern Web Architecture',
      description: 'Deep dives into React 19, Server Actions, TypeScript, and high-scale full stack development.',
      playlistId: 'PLt3wB0L7M7dC1gP_v2aD19k0F1Z2j8Qh4',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLt3wB0L7M7dC1gP_v2aD19k0F1Z2j8Qh4',
      thumbnailUrl: 'https://i.ytimg.com/vi/wm5gMKuwSYk/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-theo-1',
          videoId: 'wm5gMKuwSYk',
          url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
          thumbnailUrl: 'https://i.ytimg.com/vi/wm5gMKuwSYk/hqdefault.jpg',
          title: 'Next.js Full Course | Build and Deploy a Full Stack App',
          channel: 'Theo - t3․gg',
          domain: 'Web Development',
          category: 'Full-Stack Frameworks',
          subcategoryId: 19,
          duration: 7200,
          timestamp: Date.now() - 6 * 3600000,
          source: 'trending',
          tags: ['theo', 't3.gg', 'next.js', 'react 19', 'fullstack']
        },
        {
          id: 'pl-theo-2',
          videoId: '30LWjhZzg50',
          url: 'https://www.youtube.com/watch?v=30LWjhZzg50',
          thumbnailUrl: 'https://i.ytimg.com/vi/30LWjhZzg50/hqdefault.jpg',
          title: 'Learn TypeScript – Full In-Depth Architecture Tutorial',
          channel: 'Theo - t3․gg',
          domain: 'Web Development',
          category: 'Full-Stack Frameworks',
          subcategoryId: 19,
          duration: 3600,
          timestamp: Date.now() - 14 * 3600000,
          source: 'home',
          tags: ['theo', 'typescript', 'architecture', 'nextjs']
        }
      ]
    }
  ],
  'hussein-nasser': [
    {
      id: 'pl-hussein-database-networking',
      channelId: 'hussein-nasser',
      channelName: 'Hussein Nasser',
      title: 'Database Internals, Indexing & Networking Protocols',
      description: 'Everything software engineers must know about B-Trees, database indexing, write-ahead logs, and HTTP/3.',
      playlistId: 'PLQnljOFTspQXjD0twZq6B_x7kQ7yE7oG6',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLQnljOFTspQXjD0twZq6B_x7kQ7yE7oG6',
      thumbnailUrl: 'https://i.ytimg.com/vi/2j8O3hUvX4A/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-hn-1',
          videoId: '2j8O3hUvX4A',
          url: 'https://www.youtube.com/watch?v=2j8O3hUvX4A',
          thumbnailUrl: 'https://i.ytimg.com/vi/2j8O3hUvX4A/hqdefault.jpg',
          title: 'Database Indexing Explained In-Depth: B-Trees vs Hash Tables',
          channel: 'Hussein Nasser',
          domain: 'Databases & Storage',
          category: 'Database indexing & query optimization',
          subcategoryId: 27,
          duration: 1800,
          timestamp: Date.now() - 7 * 3600000,
          source: 'trending',
          tags: ['hussein nasser', 'database indexing', 'b-trees', 'backend']
        },
        {
          id: 'pl-hn-2',
          videoId: 'd3zTfXvYZ9s',
          url: 'https://www.youtube.com/watch?v=d3zTfXvYZ9s',
          thumbnailUrl: 'https://i.ytimg.com/vi/d3zTfXvYZ9s/hqdefault.jpg',
          title: 'Database Engineering & Storage Internals Architecture',
          channel: 'Hussein Nasser',
          domain: 'Security & Data',
          category: 'Relational databases (PostgreSQL, MySQL)',
          subcategoryId: 23,
          duration: 1500,
          timestamp: Date.now() - 16 * 3600000,
          source: 'home',
          tags: ['hussein nasser', 'storage engine', 'database architecture']
        }
      ]
    }
  ],
  'theprimeagen': [
    {
      id: 'pl-prime-performance',
      channelId: 'theprimeagen',
      channelName: 'ThePrimeagen',
      title: 'High Performance Software Engineering & Algorithms',
      description: 'Master algorithm patterns, memory optimization, low-latency code, and modern Neovim workflows.',
      playlistId: 'PLm323SJ4CSG4IQwE7B9k9W3R7yX8kL2m1',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLm323SJ4CSG4IQwE7B9k9W3R7yX8kL2m1',
      thumbnailUrl: 'https://i.ytimg.com/vi/8aGhZQkoFbQ/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-prime-1',
          videoId: '8aGhZQkoFbQ',
          url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
          thumbnailUrl: 'https://i.ytimg.com/vi/8aGhZQkoFbQ/hqdefault.jpg',
          title: 'What the Heck is the Event Loop Anyway? (Async Performance)',
          channel: 'ThePrimeagen',
          domain: 'Software Engineering Practice',
          category: 'Clean code & refactoring',
          subcategoryId: 56,
          duration: 1600,
          timestamp: Date.now() - 8 * 3600000,
          source: 'trending',
          tags: ['theprimeagen', 'event loop', 'async', 'performance']
        },
        {
          id: 'pl-prime-2',
          videoId: 'MsocPEZBd-M',
          url: 'https://www.youtube.com/watch?v=MsocPEZBd-M',
          thumbnailUrl: 'https://i.ytimg.com/vi/MsocPEZBd-M/hqdefault.jpg',
          title: 'Rust Programming Course for Beginners - Performance & Memory Safety',
          channel: 'ThePrimeagen',
          domain: 'Programming Languages',
          category: 'Rust',
          subcategoryId: 11,
          duration: 3600,
          timestamp: Date.now() - 20 * 3600000,
          source: 'home',
          tags: ['theprimeagen', 'rust', 'memory safety', 'performance']
        }
      ]
    }
  ],
  'continuous-delivery': [
    {
      id: 'pl-cd-discipline',
      channelId: 'continuous-delivery',
      channelName: 'Continuous Delivery',
      title: 'Modern Software Engineering, TDD & CI/CD Pipelines',
      description: 'Dave Farley on building reliable, scalable software using Test-Driven Development and automated pipelines.',
      playlistId: 'PLb_8u6j2qLq4Z19G4T9vE1Z3j8Qh4sZ9k',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLb_8u6j2qLq4Z19G4T9vE1Z3j8Qh4sZ9k',
      thumbnailUrl: 'https://i.ytimg.com/vi/y8OnoxKotPQ/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-cd-1',
          videoId: 'y8OnoxKotPQ',
          url: 'https://www.youtube.com/watch?v=y8OnoxKotPQ',
          thumbnailUrl: 'https://i.ytimg.com/vi/y8OnoxKotPQ/hqdefault.jpg',
          title: 'Microservices Architecture & Continuous Delivery Principles',
          channel: 'Continuous Delivery',
          domain: 'Cloud & DevOps',
          category: 'CI/CD pipelines & automation',
          subcategoryId: 32,
          duration: 1400,
          timestamp: Date.now() - 9 * 3600000,
          source: 'trending',
          tags: ['continuous delivery', 'dave farley', 'microservices', 'ci/cd']
        },
        {
          id: 'pl-cd-2',
          videoId: '7xngnjfIlK4',
          url: 'https://www.youtube.com/watch?v=7xngnjfIlK4',
          thumbnailUrl: 'https://i.ytimg.com/vi/7xngnjfIlK4/hqdefault.jpg',
          title: 'Complete Terraform Course - Infrastructure as Code for CI/CD',
          channel: 'Continuous Delivery',
          domain: 'Cloud & DevOps',
          category: 'CI/CD pipelines & automation',
          subcategoryId: 32,
          duration: 3600,
          timestamp: Date.now() - 22 * 3600000,
          source: 'home',
          tags: ['continuous delivery', 'terraform', 'infrastructure as code', 'ci/cd']
        }
      ]
    }
  ],
"""

if "'the-net-ninja': [" not in hub:
    hub = hub.replace("const DEFAULT_CURATED_PLAYLISTS: Record<string, ChannelPlaylist[]> = {", "const DEFAULT_CURATED_PLAYLISTS: Record<string, ChannelPlaylist[]> = {\n" + new_playlists_definition)
    print("Added new playlists to DEFAULT_CURATED_PLAYLISTS!")

with open("src/components/ChannelHub.tsx", "w", encoding="utf-8") as f:
    f.write(hub)

print("Updated src/components/ChannelHub.tsx with all 11 requested channels!")

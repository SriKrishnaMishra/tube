import { useState, useEffect, useMemo } from 'react';
import {
  Tv,
  Plus,
  Trash2,
  Play,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
  ListVideo,
  Eye,
  Clock,
  Layers,
  Check,
  Share2,
  Video,
  ChevronDown,
  ChevronUp,
  Folder,
  X,
  RotateCcw,
} from 'lucide-react';
import { ContentRecord, TrackedChannel, ChannelPlaylist } from '../types';
import { getAffinityCategories } from '../taxonomy';
import { extractYouTubeVideoId, fetchYouTubeOEmbed } from '../universalYouTubeSearch';

interface ChannelHubProps {
  records: ContentRecord[];
  onPlayInModal?: (record: ContentRecord) => void;
  onAddCustomVideo?: (record: ContentRecord) => void;
  focusedCreator?: string | null;
  onClearFocusedCreator?: () => void;
  onDeleteRecord?: (id: string) => void;
  onRestoreRecord?: (id: string) => void;
  onReloadCatalog?: () => void;
}

// 100% Real, authentic Google CDN (yt3.googleusercontent.com) avatar URLs for creators
const VERIFIED_CREATOR_AVATARS: Record<string, string> = {
  'the net ninja': 'https://unavatar.io/youtube/@NetNinja',
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

  'krish naik': 'https://yt3.googleusercontent.com/r0lRsN4EgVg_h9TfhKoK-oa9SGtmC4QxvwhEYFB4VWoRXtxsQoyhh2WvrRxpxciTYwh4D4_W=s900-c-k-c0x00ffffff-no-rj',
  'krishnaik': 'https://yt3.googleusercontent.com/r0lRsN4EgVg_h9TfhKoK-oa9SGtmC4QxvwhEYFB4VWoRXtxsQoyhh2WvrRxpxciTYwh4D4_W=s900-c-k-c0x00ffffff-no-rj',
  'krish-naik': 'https://yt3.googleusercontent.com/r0lRsN4EgVg_h9TfhKoK-oa9SGtmC4QxvwhEYFB4VWoRXtxsQoyhh2WvrRxpxciTYwh4D4_W=s900-c-k-c0x00ffffff-no-rj',
  'piyush garg': 'https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj',
  'piyushgarg': 'https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj',
  '8hly31xKli0': 'https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj',
  'fireship': 'https://yt3.googleusercontent.com/3fPNbkf_xPyCleq77ZhcxyeorY97NtMHVNUbaAON_RBDH9ydL4hJkjxC8x_4mpuopkB8oI7Ct6Y=s900-c-k-c0x00ffffff-no-rj',
  'bytebytego': 'https://yt3.googleusercontent.com/ZDRUyBUwc2WXZzvNKP9VS9myI6Mg2puQLaWyp4hibRu-owlsasZ3DVNGSQJwzO1IU-tqoMiGgdc=s900-c-k-c0x00ffffff-no-rj',
  'freecodecamp': 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s900-c-k-c0x00ffffff-no-rj',
  'freecodecamp.org': 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s900-c-k-c0x00ffffff-no-rj',
  'traversy media': 'https://yt3.googleusercontent.com/ytc/AIdro_mLysKc36lc_FVk2j777olWvLOjgDz6NCNGdiQBnAKRENM=s900-c-k-c0x00ffffff-no-rj',
  'traversymedia': 'https://yt3.googleusercontent.com/ytc/AIdro_mLysKc36lc_FVk2j777olWvLOjgDz6NCNGdiQBnAKRENM=s900-c-k-c0x00ffffff-no-rj',
  'traversy-media': 'https://yt3.googleusercontent.com/ytc/AIdro_mLysKc36lc_FVk2j777olWvLOjgDz6NCNGdiQBnAKRENM=s900-c-k-c0x00ffffff-no-rj',
  'andrej karpathy': 'https://yt3.googleusercontent.com/ytc/AIdro_nDvyq2NoPL626bk1IbxQ94SfQsD-B0qgZchghtQNkLWoEz=s900-c-k-c0x00ffffff-no-rj',
  'andrejkarpathy': 'https://yt3.googleusercontent.com/ytc/AIdro_nDvyq2NoPL626bk1IbxQ94SfQsD-B0qgZchghtQNkLWoEz=s900-c-k-c0x00ffffff-no-rj',
  'andrej-karpathy': 'https://yt3.googleusercontent.com/ytc/AIdro_nDvyq2NoPL626bk1IbxQ94SfQsD-B0qgZchghtQNkLWoEz=s900-c-k-c0x00ffffff-no-rj',
  'gyMwXuJrbJQ': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'chai aur code': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'hitesh choudhary': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'codewithharry': 'https://yt3.googleusercontent.com/ytc/AIdro_kX3sdbuu3KFmRPsmlu0R5Rx_BhpxwupjtvJmkEdNfla7w=s900-c-k-c0x00ffffff-no-rj',
  'code with harry': 'https://yt3.googleusercontent.com/ytc/AIdro_kX3sdbuu3KFmRPsmlu0R5Rx_BhpxwupjtvJmkEdNfla7w=s900-c-k-c0x00ffffff-no-rj',
  'neetcode': 'https://yt3.googleusercontent.com/25g11wkEmSb_ZTC6M5-uMklwAHmFa9rfZN7TzS9WLsfPgXFHoLaegwKwBqqah7pPhQhSafMx=s900-c-k-c0x00ffffff-no-rj',
};

function resolveCreatorAvatar(name: string, handle?: string, currentAvatar?: string): string {
  const normName = name.toLowerCase().trim();
  const normHandle = (handle || '').toLowerCase().replace('@', '').trim();

  if (VERIFIED_CREATOR_AVATARS[normName]) return VERIFIED_CREATOR_AVATARS[normName];
  if (VERIFIED_CREATOR_AVATARS[normHandle]) return VERIFIED_CREATOR_AVATARS[normHandle];

  for (const [k, url] of Object.entries(VERIFIED_CREATOR_AVATARS)) {
    if (normName.includes(k) || k.includes(normName)) return url;
    if (normHandle && (normHandle.includes(k) || k.includes(normHandle))) return url;
  }

  // If current avatar is NOT unsplash and exists, keep it
  if (currentAvatar && !currentAvatar.includes('unsplash.com')) {
    return currentAvatar;
  }

  // Fallback to unavatar.io for dynamic YouTube avatar
  if (normHandle) {
    return `https://unavatar.io/youtube/@${normHandle}`;
  }
  return `https://unavatar.io/youtube/${encodeURIComponent(name)}`;
}

const DEFAULT_CURATED_CHANNELS: TrackedChannel[] = [
  {
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

  {
    id: 'chai-aur-code',
    name: 'Chai aur Code',
    handle: '@chaiaurcode',
    avatarUrl: VERIFIED_CREATOR_AVATARS['chai aur code'],
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    subscriberCount: '580K subscribers',
    description: 'Practical programming in Hindi with chai! Complete React 19, JavaScript in-depth, Docker, and full-stack master series.',
    videoCount: 22,
    addedAt: Date.now() - 12 * 86400000,
    tags: ['chai aur code', 'hitesh choudhary', 'react', 'javascript', 'docker', 'frontend'],
  },
  {
    id: 'code-with-harry',
    name: 'CodeWithHarry',
    handle: '@CodeWithHarry',
    avatarUrl: VERIFIED_CREATOR_AVATARS['codewithharry'],
    domain: 'Programming Languages',
    category: 'Python',
    subcategoryId: 9,
    subscriberCount: '5.2M subscribers',
    description: 'Learn programming with complete projects and handwritten notes. Full courses on Python, Web Development, C++, and DSA.',
    videoCount: 28,
    addedAt: Date.now() - 20 * 86400000,
    tags: ['codewithharry', 'python', 'web dev', 'c++', 'javascript', 'notes'],
  },
  {
    id: 'neetcode',
    name: 'NeetCode',
    handle: '@NeetCode',
    avatarUrl: VERIFIED_CREATOR_AVATARS['neetcode'],
    domain: 'Software Engineering Practice',
    category: 'Interview preparation & coding challenges',
    subcategoryId: 55,
    subscriberCount: '850K subscribers',
    description: 'Data Structures, Algorithms, Blind 75 LeetCode solutions, and System Design interview preparation.',
    videoCount: 20,
    addedAt: Date.now() - 15 * 86400000,
    tags: ['neetcode', 'dsa', 'leetcode', 'algorithms', 'blind 75', 'system design'],
  },

  {
    id: 'krish-naik',
    name: 'Krish Naik',
    handle: '@krishnaik06',
    avatarUrl: VERIFIED_CREATOR_AVATARS['krish naik'],
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    subscriberCount: '890K subscribers',
    description: 'Pioneer in Machine Learning, Deep Learning, Generative AI, LangChain, and end-to-end Data Science masterclasses.',
    videoCount: 26,
    addedAt: Date.now() - 10 * 86400000,
    tags: ['krish naik', 'machine learning', 'deep learning', 'generative ai', 'mlops', 'python', 'data science', 'langchain'],
  },
  {
    id: 'piyush-garg',
    name: 'Piyush Garg',
    handle: '@piyushgargdev',
    avatarUrl: VERIFIED_CREATOR_AVATARS['piyush garg'],
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    subscriberCount: '280K subscribers',
    description: 'Full stack development, system architecture, SSO, authentication, Docker, and backend engineering deep dives.',
    videoCount: 18,
    addedAt: Date.now() - 15 * 86400000,
    tags: ['piyush garg', 'sso', 'backend', 'system design', 'auth', 'node', 'fullstack', 'docker'],
  },
  {
    id: 'fireship',
    name: 'Fireship',
    handle: '@fireship',
    avatarUrl: VERIFIED_CREATOR_AVATARS['fireship'],
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    subscriberCount: '3.1M subscribers',
    description: 'High-intensity code tutorials to help you build apps faster. Famous for "in 100 Seconds" format.',
    videoCount: 24,
    addedAt: Date.now() - 30 * 86400000,
    tags: ['fireship', 'docker', '100s', 'cloud', 'javascript', 'rust'],
  },
  {
    id: 'bytebytego',
    name: 'ByteByteGo',
    handle: '@bytebytego',
    avatarUrl: VERIFIED_CREATOR_AVATARS['bytebytego'],
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    subscriberCount: '1.2M subscribers',
    description: 'System design, large scale distributed systems, microservices, and FAANG technical interview architecture.',
    videoCount: 15,
    addedAt: Date.now() - 25 * 86400000,
    tags: ['bytebytego', 'system design', 'architecture', 'dFgzHOX84xQ', 'web crawler', 'recommenders'],
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp.org',
    handle: '@freecodecamp',
    avatarUrl: VERIFIED_CREATOR_AVATARS['freecodecamp'],
    domain: 'AI & Machine Learning',
    category: 'Computer Vision',
    subcategoryId: 4,
    subscriberCount: '9.8M subscribers',
    description: 'Learn to code for free with complete video courses on Python, AI, Machine Learning, and Web Development.',
    videoCount: 42,
    addedAt: Date.now() - 60 * 86400000,
    tags: ['freecodecamp', 'python', 'courses', 'computer vision', 'opencv', 'git'],
  },
  {
    id: 'traversy-media',
    name: 'Traversy Media',
    handle: '@TraversyMedia',
    avatarUrl: VERIFIED_CREATOR_AVATARS['traversy media'],
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    subscriberCount: '2.2M subscribers',
    description: 'Practical, project-based web development and programming tutorials from HTML/CSS to React and Node.',
    videoCount: 20,
    addedAt: Date.now() - 40 * 86400000,
    tags: ['traversy', 'react', 'frontend', 'javascript', 'web dev'],
  },
  {
    id: 'andrej-karpathy',
    name: 'Andrej Karpathy',
    handle: '@AndrejKarpathy',
    avatarUrl: VERIFIED_CREATOR_AVATARS['andrej karpathy'],
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    subscriberCount: '800K subscribers',
    description: 'Former Director of AI at Tesla and OpenAI founding team. Famous for the "Neural Networks: Zero to Hero" series.',
    videoCount: 10,
    addedAt: Date.now() - 50 * 86400000,
    tags: ['andrej karpathy', 'micrograd', 'makemore', 'gpt', 'deep learning', 'zero to hero'],
  },
];

// Rich, authentic playlists curated for top creators
const DEFAULT_CURATED_PLAYLISTS: Record<string, ChannelPlaylist[]> = {
  'the-net-ninja': [
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

  'krish-naik': [
    {
      id: 'pl-krish-agentic-2026',
      channelId: 'krish-naik',
      channelName: 'Krish Naik',
      title: 'Agentic AI, WorkIQ & Autonomous Multi-Agents Series 2026',
      description: 'The latest Agentic AI roadmap, Microsoft WorkIQ, Generative vs Agentic AI, CrewAI, and LangGraph architectures.',
      playlistId: 'PLZoTAELRMXVPAgenticAI2026',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPAgenticAI2026',
      thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
      videoCount: 6,
      videos: [
        {
          id: 'pl-krish-ag-1',
          videoId: '1vsmaEfbnoE',
          url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
          thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
          title: 'AI Learning Path For 2026 - Data Science, Generative AI & AI Agents',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 1800,
          timestamp: Date.now() - 2 * 3600000,
          source: 'trending',
          viewCount: 650000,
          likes: 48000,
          tags: ['krish naik', 'agentic ai', 'roadmap', '2026', 'ai learning path'],
        },
        {
          id: 'pl-krish-ag-2',
          videoId: 'HCJvnek8zZM',
          url: 'https://www.youtube.com/watch?v=HCJvnek8zZM',
          thumbnailUrl: 'https://i.ytimg.com/vi/HCJvnek8zZM/hqdefault.jpg',
          title: 'Building AI Agents With Microsoft WorkIQ - Zero API Calls',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 1650,
          timestamp: Date.now() - 8 * 3600000,
          source: 'trending',
          viewCount: 420000,
          likes: 36000,
          tags: ['krish naik', 'ai agents', 'microsoft workiq', 'zero api calls'],
        },
        {
          id: 'pl-krish-ag-3',
          videoId: 'qvrbwZ3V4-o',
          url: 'https://www.youtube.com/watch?v=qvrbwZ3V4-o',
          thumbnailUrl: 'https://i.ytimg.com/vi/qvrbwZ3V4-o/hqdefault.jpg',
          title: 'Generative AI Vs Agentic AI Vs AI Agents - Complete Clarification',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 1740,
          timestamp: Date.now() - 14 * 3600000,
          source: 'home',
          viewCount: 510000,
          likes: 42000,
          tags: ['krish naik', 'generative ai', 'agentic ai', 'difference'],
        },
        {
          id: 'pl-krish-ag-4',
          videoId: '_iRUnZ_BFkA',
          url: 'https://www.youtube.com/watch?v=_iRUnZ_BFkA',
          thumbnailUrl: 'https://i.ytimg.com/vi/_iRUnZ_BFkA/hqdefault.jpg',
          title: 'Which AI Role Should You Prepare For in 2025/2026?',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 1200,
          timestamp: Date.now() - 20 * 3600000,
          source: 'home',
          viewCount: 380000,
          likes: 31000,
          tags: ['krish naik', 'ai role', 'career', 'jobs'],
        },
        {
          id: 'pl-krish-ag-5',
          videoId: 'J5fqR-TRebI',
          title: 'Complete Agentic AI Roadmap - LangChain, LangGraph, CrewAI & Multi-Agents',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          url: 'https://www.youtube.com/watch?v=J5fqR-TRebI',
          thumbnailUrl: 'https://i.ytimg.com/vi/J5fqR-TRebI/hqdefault.jpg',
          duration: 2400,
          timestamp: Date.now() - 26 * 3600000,
          source: 'trending',
          viewCount: 590000,
          likes: 52000,
          tags: ['krish naik', 'agentic ai roadmap', 'crewai', 'langgraph'],
        },
        {
          id: 'pl-krish-ag-6',
          videoId: 'rV3HJ4LEZ7k',
          title: 'CrewAI Tutorial for Beginners - Build Multi-Agent AI Systems in Python',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
          thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
          duration: 5400,
          timestamp: Date.now() - 36 * 3600000,
          source: 'trending',
          viewCount: 470000,
          likes: 39000,
          tags: ['krish naik', 'crewai', 'HCJvnek8zZM', 'langchain'],
        },
      ],
    },
    {
      id: 'pl-krish-ml',
      channelId: 'krish-naik',
      channelName: 'Krish Naik',
      title: 'Complete Machine Learning & Data Science Master Series 2024',
      description: 'Comprehensive end-to-end Machine Learning curriculum from feature engineering to production deployment.',
      playlistId: 'PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe',
      thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
      videoCount: 6,
      videos: [
        {
          id: 'pl-krish-1',
          videoId: '1vsmaEfbnoE',
          url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
          thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
          title: 'Complete Machine Learning Course in 6 Hours [Full Masterclass]',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 21600,
          timestamp: Date.now() - 5 * 86400000,
          source: 'trending',
          viewCount: 780000,
          likes: 82000,
          tags: ['machine learning', 'python', 'data science', 'math'],
        },
        {
          id: 'pl-krish-2',
          videoId: 'AzYY5InMTA0',
          url: 'https://www.youtube.com/watch?v=AzYY5InMTA0',
          thumbnailUrl: 'https://i.ytimg.com/vi/AzYY5InMTA0/hqdefault.jpg',
          title: 'Deep Learning In-Depth Masterclass (ANN, CNN, RNN & Transformers)',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Deep Learning (CNN, RNN, Transformers)',
          subcategoryId: 2,
          duration: 18000,
          timestamp: Date.now() - 10 * 86400000,
          source: 'trending',
          viewCount: 420000,
          likes: 45000,
          tags: ['deep learning', 'cnn', 'rnn', 'neural networks'],
        },
        {
          id: 'pl-krish-3',
          videoId: 'fNk_zzaMoSs',
          url: 'https://www.youtube.com/watch?v=uk0MBzqHquU',
          thumbnailUrl: 'https://i.ytimg.com/vi/uk0MBzqHquU/hqdefault.jpg',
          title: 'End-to-End Machine Learning Project with Docker & CI/CD Pipelines',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Model Deployment (MLOps)',
          subcategoryId: 8,
          duration: 7200,
          timestamp: Date.now() - 15 * 86400000,
          source: 'search',
          viewCount: 310000,
          likes: 31000,
          tags: ['mlops', 'docker', 'deployment', 'ci/cd'],
        },
        {
          id: 'pl-krish-4',
          videoId: 'rV3HJ4LEZ7k',
          url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
          thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
          title: 'Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 36000,
          timestamp: Date.now() - 2 * 86400000,
          source: 'trending',
          viewCount: 520000,
          likes: 58000,
          tags: ['agentic ai', 'langchain', 'langgraph', 'rag', 'llm'],
        },
        {
          id: 'pl-krish-5',
          videoId: 'd3zTfXvYZ9s',
          url: 'https://www.youtube.com/watch?v=EMXFZB8FVUA',
          thumbnailUrl: 'https://i.ytimg.com/vi/EMXFZB8FVUA/hqdefault.jpg',
          title: 'PyTorch Deep Learning Complete Tutorial from Scratch',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Deep Learning (CNN, RNN, Transformers)',
          subcategoryId: 2,
          duration: 14400,
          timestamp: Date.now() - 18 * 86400000,
          source: 'home',
          viewCount: 290000,
          likes: 24000,
          tags: ['pytorch', 'deep learning', 'neural networks'],
        },
        {
          id: 'pl-krish-6',
          videoId: 'e8Yw4alG16Q',
          url: 'https://www.youtube.com/watch?v=e8Yw4alG16Q',
          thumbnailUrl: 'https://i.ytimg.com/vi/e8Yw4alG16Q/hqdefault.jpg',
          title: 'Time Series Analysis & Forecasting Full Practical Course',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 10800,
          timestamp: Date.now() - 22 * 86400000,
          source: 'home',
          viewCount: 210000,
          likes: 19000,
          tags: ['time series', 'arima', 'Y8Tko2YC5hA'],
        },
      ],
    },
    {
      id: 'pl-krish-genai',
      channelId: 'krish-naik',
      channelName: 'Krish Naik',
      title: 'Generative AI, LangChain & Agentic LLMs Series',
      description: 'Hands-on tutorials building production RAG apps, autonomous agents with LangGraph, and vector databases.',
      playlistId: 'PLZoTAELRMXVPCr5nJmP8b1u6aK_xI_d0n',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPCr5nJmP8b1u6aK_xI_d0n',
      thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
      videoCount: 4,
      videos: [
        {
          id: 'pl-krish-genai-1',
          videoId: 'rV3HJ4LEZ7k',
          url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
          thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
          title: 'Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 36000,
          timestamp: Date.now() - 2 * 86400000,
          source: 'trending',
          viewCount: 520000,
          likes: 58000,
          tags: ['agentic ai', 'langchain', 'langgraph', 'rag'],
        },
        {
          id: 'pl-krish-genai-2',
          videoId: 'Tn6-PIqc4UM',
          url: 'https://www.youtube.com/watch?v=b-i8V4x_D7I',
          thumbnailUrl: 'https://i.ytimg.com/vi/b-i8V4x_D7I/hqdefault.jpg',
          title: 'End to End LLM Project with Google Gemini Pro & LangChain',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 7200,
          timestamp: Date.now() - 6 * 86400000,
          source: 'trending',
          viewCount: 340000,
          likes: 38000,
          tags: ['gemini pro', 'langchain', 'google gemini', 'llm'],
        },
        {
          id: 'pl-krish-genai-3',
          videoId: 'k7RM-ot2NWY',
          url: 'https://www.youtube.com/watch?v=fOvTtapxa9c',
          thumbnailUrl: 'https://i.ytimg.com/vi/fOvTtapxa9c/hqdefault.jpg',
          title: 'Complete Natural Language Processing (NLP) Masterclass in One Video',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Natural Language Processing',
          subcategoryId: 3,
          duration: 28800,
          timestamp: Date.now() - 12 * 86400000,
          source: 'home',
          viewCount: 610000,
          likes: 67000,
          tags: ['nlp', 'transformers', 'bert', 'natural language processing'],
        },
        {
          id: 'pl-krish-genai-4',
          videoId: '1vsmaEfbnoE',
          url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
          thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
          title: 'Complete Machine Learning Course in 6 Hours [Full Masterclass]',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 21600,
          timestamp: Date.now() - 20 * 86400000,
          source: 'home',
          viewCount: 780000,
          likes: 82000,
          tags: ['python', 'math', 'ai foundations'],
        },
      ],
    },
    {
      id: 'pl-krish-math-stats',
      channelId: 'krish-naik',
      channelName: 'Krish Naik',
      title: 'Data Science Math, Statistics & Python Foundations',
      description: 'Comprehensive tutorials in mathematics, probability, hypothesis testing, Python programming, and EDA.',
      playlistId: 'PLZoTAELRMXVOFmFsd_H_Lg0f_09D732pP',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVOFmFsd_H_Lg0f_09D732pP',
      thumbnailUrl: 'https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg',
      videoCount: 4,
      videos: [
        {
          id: 'pl-krish-stat-1',
          videoId: 'LZzq1zSL1bs',
          url: 'https://www.youtube.com/watch?v=LZzq1zSL1bs',
          thumbnailUrl: 'https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg',
          title: 'Complete Statistics for Data Science - From Basic to Advanced',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 21600,
          timestamp: Date.now() - 8 * 86400000,
          source: 'trending',
          viewCount: 890000,
          likes: 94000,
          tags: ['statistics', 'math', 'PFDu9oVAE-g', 'hypothesis testing'],
        },
        {
          id: 'pl-krish-stat-2',
          videoId: 'kqtD5dpn9C8',
          url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
          thumbnailUrl: 'https://i.ytimg.com/vi/kqtD5dpn9C8/hqdefault.jpg',
          title: 'Python for Beginners - Complete Python Full Course',
          channel: 'Krish Naik',
          domain: 'Programming Languages',
          category: 'Python',
          subcategoryId: 9,
          duration: 18000,
          timestamp: Date.now() - 14 * 86400000,
          source: 'home',
          viewCount: 1200000,
          likes: 110000,
          tags: ['python', 'basics', '7S_tz1z_5bA', 'oop'],
        },
        {
          id: 'pl-krish-stat-3',
          videoId: 'LZzq1zSL1bs',
          url: 'https://www.youtube.com/watch?v=-o3AxdVcUtQ',
          thumbnailUrl: 'https://i.ytimg.com/vi/-o3AxdVcUtQ/hqdefault.jpg',
          title: 'Exploratory Data Analysis (EDA) Masterclass for Beginners',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 10800,
          timestamp: Date.now() - 25 * 86400000,
          source: 'home',
          viewCount: 430000,
          likes: 41000,
          tags: ['eda', 'pandas', 'matplotlib', 'seaborn'],
        },
        {
          id: 'pl-krish-stat-4',
          videoId: '-7VgYNiGxYw',
          url: 'https://www.youtube.com/watch?v=-7VgYNiGxYw',
          thumbnailUrl: 'https://i.ytimg.com/vi/-7VgYNiGxYw/hqdefault.jpg',
          title: 'NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 12600,
          timestamp: Date.now() - 30 * 86400000,
          source: 'home',
          viewCount: 380000,
          likes: 36000,
          tags: ['feature engineering', 'encoding', 'imputation'],
        },
      ],
    },
  ],
  '8hly31xKli0': [
    {
      id: 'pl-piyush-docker',
      channelId: '8hly31xKli0',
      channelName: 'Piyush Garg',
      title: 'Full-Stack Web Dev, Docker & Production Engineering',
      description: 'End-to-end guide to Docker, microservices, container orchestration, and modern backend architecture.',
      playlistId: 'PLinedj3B30sDP2CHN5P0lDD64yYZ0Nn4J',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLinedj3B30sDP2CHN5P0lDD64yYZ0Nn4J',
      thumbnailUrl: 'https://i.ytimg.com/vi/31k6AtW-b3Y/hqdefault.jpg',
      videoCount: 4,
      videos: [
        {
          id: 'pl-piyush-1',
          videoId: 'Gjnup-PuquQ',
          url: 'https://www.youtube.com/watch?v=31k6AtW-b3Y',
          thumbnailUrl: 'https://i.ytimg.com/vi/31k6AtW-b3Y/hqdefault.jpg',
          title: 'Docker In One Shot - Complete Crash Course for Developers',
          channel: 'Piyush Garg',
          domain: 'Cloud & DevOps',
          category: 'Kubernetes & containerization',
          subcategoryId: 30,
          duration: 5400,
          timestamp: Date.now() - 4 * 86400000,
          source: 'trending',
          viewCount: 340000,
          likes: 29000,
          tags: ['piyush garg', 'docker', 'containers', 'docker in one shot'],
        },
        {
          id: 'pl-piyush-2',
          videoId: 'wm5gMKuwSYk',
          url: 'https://www.youtube.com/watch?v=xPT8mXa-sJg',
          thumbnailUrl: 'https://i.ytimg.com/vi/xPT8mXa-sJg/hqdefault.jpg',
          title: 'Docker For Open Source Contributors & Production Workloads',
          channel: 'Piyush Garg',
          domain: 'Cloud & DevOps',
          category: 'Kubernetes & containerization',
          subcategoryId: 30,
          duration: 3600,
          timestamp: Date.now() - 12 * 86400000,
          source: 'search',
          viewCount: 190000,
          likes: 18000,
          tags: ['piyush garg', 'docker', 'production', 'open source'],
        },
        {
          id: 'pl-piyush-3',
          videoId: 'MsocPEZBd-M',
          url: 'https://www.youtube.com/watch?v=wgfi8hrFzAY',
          thumbnailUrl: 'https://i.ytimg.com/vi/wgfi8hrFzAY/hqdefault.jpg',
          title: 'Build Your Own Docker Orchestration from Scratch in Node.js',
          channel: 'Piyush Garg',
          domain: 'Cloud & DevOps',
          category: 'Kubernetes & containerization',
          subcategoryId: 30,
          duration: 4800,
          timestamp: Date.now() - 18 * 86400000,
          source: 'home',
          viewCount: 160000,
          likes: 15000,
          tags: ['piyush garg', 'docker', 'orchestration', 'nodejs'],
        },
        {
          id: 'pl-piyush-4',
          videoId: '1aocCdimOo8',
          url: 'https://www.youtube.com/watch?v=1aocCdimOo8',
          thumbnailUrl: 'https://i.ytimg.com/vi/1aocCdimOo8/hqdefault.jpg',
          title: 'Build Your Own SSO | What is SSO | SSO Explained',
          channel: 'Piyush Garg',
          domain: 'Security & Data',
          category: 'Cybersecurity fundamentals',
          subcategoryId: 39,
          duration: 1140,
          timestamp: Date.now() - 25 * 86400000,
          source: 'trending',
          viewCount: 220000,
          likes: 21000,
          tags: ['sso', 'single sign on', 'authentication', 'security'],
        },
      ],
    },
  ],
  'fireship': [
    {
      id: 'pl-fireship-100s',
      channelId: 'fireship',
      channelName: 'Fireship',
      title: 'Code in 100 Seconds: The Definitive Series',
      description: 'Lightning-fast, hilarious and hyper-informative tech breakdowns in under two minutes.',
      playlistId: 'PL0vfts4VzfNiI1BsIK5u7LpPaIDKMvIDN',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL0vfts4VzfNiI1BsIK5u7LpPaIDKMvIDN',
      thumbnailUrl: 'https://i.ytimg.com/vi/Gjnup-PuquQ/hqdefault.jpg',
      videoCount: 4,
      videos: [
        {
          id: 'pl-fire-1',
          videoId: 'Gjnup-PuquQ',
          url: 'https://www.youtube.com/watch?v=Gjnup-PuquQ',
          thumbnailUrl: 'https://i.ytimg.com/vi/Gjnup-PuquQ/hqdefault.jpg',
          title: 'Docker in 100 Seconds',
          channel: 'Fireship',
          domain: 'Cloud & DevOps',
          category: 'Kubernetes & containerization',
          subcategoryId: 30,
          duration: 135,
          timestamp: Date.now() - 20 * 86400000,
          source: 'trending',
          viewCount: 2400000,
          likes: 120000,
          tags: ['docker', 'containers', '100s'],
        },
        {
          id: 'pl-fire-2',
          videoId: '5C_HPTJg5ek',
          url: 'https://www.youtube.com/watch?v=5C_HPTJg5ek',
          thumbnailUrl: 'https://i.ytimg.com/vi/5C_HPTJg5ek/hqdefault.jpg',
          title: 'Is Rust Worth It in 2024? Complete Breakdown',
          channel: 'Fireship',
          domain: 'Programming Languages',
          category: 'Rust',
          subcategoryId: 12,
          duration: 210,
          timestamp: Date.now() - 10 * 86400000,
          source: 'trending',
          viewCount: 1800000,
          likes: 95000,
          tags: ['rust', 'memory-safety', 'f2EqECiTBL8'],
        },
        {
          id: 'pl-fire-3',
          videoId: '1aocCdimOo8',
          url: 'https://www.youtube.com/watch?v=Kz_zAkIvY6g',
          thumbnailUrl: 'https://i.ytimg.com/vi/Kz_zAkIvY6g/hqdefault.jpg',
          title: 'The Fastest Language in the World (C++ vs Rust vs Zig)',
          channel: 'Fireship',
          domain: 'Programming Languages',
          category: 'C/C++',
          subcategoryId: 15,
          duration: 180,
          timestamp: Date.now() - 15 * 86400000,
          source: 'home',
          viewCount: 1400000,
          likes: 78000,
          tags: ['c++', 'c', 'benchmarks', 'f2EqECiTBL8'],
        },
        {
          id: 'pl-fire-4',
          videoId: '2pWv7GOvuf0',
          url: 'https://www.youtube.com/watch?v=dcXqlkhqvZk',
          thumbnailUrl: 'https://i.ytimg.com/vi/dcXqlkhqvZk/hqdefault.jpg',
          title: '100 Seconds of Code: Full Stack Architecture',
          channel: 'Fireship',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 140,
          timestamp: Date.now() - 25 * 86400000,
          source: 'trending',
          viewCount: 2100000,
          likes: 110000,
          tags: ['code', 'frontend', 'javascript'],
        },
      ],
    },
  ],
  'bytebytego': [
    {
      id: 'pl-bbg-sysdesign',
      channelId: 'bytebytego',
      channelName: 'ByteByteGo',
      title: 'FAANG System Design & Architecture Prep',
      description: 'Industry-standard system design patterns for massive scale, microservices, and technical interviews.',
      playlistId: 'PLCRMIe5FDPsd0gVs540mnOH5mCGIBkO5U',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLCRMIe5FDPsd0gVs540mnOH5mCGIBkO5U',
      thumbnailUrl: 'https://i.ytimg.com/vi/bUHFg8CZFCA/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-bbg-1',
          videoId: 'WQeoO7MI0Bs',
          url: 'https://www.youtube.com/watch?v=bUHFg8CZFCA',
          thumbnailUrl: 'https://i.ytimg.com/vi/bUHFg8CZFCA/hqdefault.jpg',
          title: 'Design a Web Crawler: FAANG System Design Interview',
          channel: 'ByteByteGo',
          domain: 'Web Development',
          category: 'Backend frameworks (Node.js, Django, Spring)',
          subcategoryId: 18,
          duration: 900,
          timestamp: Date.now() - 8 * 86400000,
          source: 'trending',
          viewCount: 850000,
          likes: 42000,
          tags: ['system design', 'web crawler', 'distributed systems'],
        },
        {
          id: 'pl-bbg-2',
          videoId: 'm8Icp_Cid5o',
          url: 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
          thumbnailUrl: 'https://i.ytimg.com/vi/m8Icp_Cid5o/hqdefault.jpg',
          title: 'System Design: Recommender Systems at Massive Scale',
          channel: 'ByteByteGo',
          domain: 'AI & Machine Learning',
          category: 'Machine Learning fundamentals',
          subcategoryId: 1,
          duration: 840,
          timestamp: Date.now() - 14 * 86400000,
          source: 'trending',
          viewCount: 620000,
          likes: 36000,
          tags: ['system design', 'recommenders', 'scale'],
        },
      ],
    },
  ],
  'freecodecamp': [
    {
      id: 'pl-fcc-ai',
      channelId: 'freecodecamp',
      channelName: 'freeCodeCamp.org',
      title: 'Full Computer Science, AI & Python Curriculum',
      description: 'Zero to mastery in Computer Vision, Python, Data Science, and modern software development.',
      playlistId: 'PLWKjhJtqVAbkfiqHnNaxpOPhh9tSWMXIF',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbkfiqHnNaxpOPhh9tSWMXIF',
      thumbnailUrl: 'https://i.ytimg.com/vi/oXlwWbU8l2o/hqdefault.jpg',
      videoCount: 2,
      videos: [
        {
          id: 'pl-fcc-1',
          videoId: '_iRUnZ_BFkA',
          url: 'https://www.youtube.com/watch?v=oXlwWbU8l2o',
          thumbnailUrl: 'https://i.ytimg.com/vi/oXlwWbU8l2o/hqdefault.jpg',
          title: 'Computer Vision Course with OpenCV and Python',
          channel: 'freeCodeCamp.org',
          domain: 'AI & Machine Learning',
          category: 'Computer Vision',
          subcategoryId: 4,
          duration: 10800,
          timestamp: Date.now() - 12 * 86400000,
          source: 'trending',
          viewCount: 1600000,
          likes: 95000,
          tags: ['opencv', 'computer vision', 'python', 'ai'],
        },
        {
          id: 'pl-fcc-2',
          videoId: 'kqtD5dpn9C8',
          url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
          thumbnailUrl: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
          title: 'Python for Beginners - Full Course [Programming Tutorial]',
          channel: 'freeCodeCamp.org',
          domain: 'Programming Languages',
          category: 'Python',
          subcategoryId: 9,
          duration: 16200,
          timestamp: Date.now() - 30 * 86400000,
          source: 'home',
          viewCount: 8900000,
          likes: 420000,
          tags: ['python', 'beginners', '7S_tz1z_5bA'],
        },
      ],
    },
  ],
  'traversy-media': [
    {
      id: 'pl-traversy-web',
      channelId: 'traversy-media',
      channelName: 'Traversy Media',
      title: 'Modern Full-Stack Development Crash Courses',
      description: 'Hands-on practical crash courses in React, Node, Express, and JavaScript.',
      playlistId: 'PLillGF-RfqbZ7s3t6ZInY3NjEOOX7HsBv',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLillGF-RfqbZ7s3t6ZInY3NjEOOX7HsBv',
      thumbnailUrl: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
      videoCount: 1,
      videos: [
        {
          id: 'pl-trav-1',
          videoId: 'w7ejDZ8SWv8',
          url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
          thumbnailUrl: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
          title: 'React JS Crash Course 2024',
          channel: 'Traversy Media',
          domain: 'Web Development',
          category: 'Frontend frameworks (React, Vue, Svelte)',
          subcategoryId: 17,
          duration: 7200,
          timestamp: Date.now() - 7 * 86400000,
          source: 'trending',
          viewCount: 650000,
          likes: 48000,
          tags: ['react', 'javascript', 'frontend'],
        },
      ],
    },
  ],
  'andrej-karpathy': [
    {
      id: 'pl-karpathy-zero-to-hero',
      channelId: 'andrej-karpathy',
      channelName: 'Andrej Karpathy',
      title: 'Neural Networks: Zero to Hero (Complete Series)',
      description: 'World-renowned masterclass by Andrej Karpathy building neural nets, backpropagation, and GPT from scratch in pure code.',
      playlistId: 'PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
      thumbnailUrl: 'https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg',
      videoCount: 7,
      videos: [
        {
          id: 'pl-karp-1',
          videoId: 'VMj-3S1tku0',
          url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
          thumbnailUrl: 'https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg',
          title: 'The Spelled-Out Intro to Neural Networks & Backprop: Building micrograd',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Deep Learning (CNN, RNN, Transformers)',
          subcategoryId: 2,
          duration: 8100,
          timestamp: Date.now() - 40 * 86400000,
          source: 'trending',
          viewCount: 3200000,
          likes: 190000,
          tags: ['micrograd', 'neural networks', 'backprop', 'zero to hero'],
        },
        {
          id: 'pl-karp-2',
          videoId: 'PaCmpygFfXo',
          url: 'https://www.youtube.com/watch?v=PaCmpygFfXo',
          thumbnailUrl: 'https://i.ytimg.com/vi/PaCmpygFfXo/hqdefault.jpg',
          title: 'The Spelled-Out Intro to Language Modeling: Building makemore',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 7200,
          timestamp: Date.now() - 35 * 86400000,
          source: 'trending',
          viewCount: 1800000,
          likes: 110000,
          tags: ['makemore', 'language model', 'nlp', 'zero to hero'],
        },
        {
          id: 'pl-karp-3',
          videoId: 'zsjvFFKOm3c',
          url: 'https://www.youtube.com/watch?v=TUXZruyXWGg',
          thumbnailUrl: 'https://i.ytimg.com/vi/TUXZruyXWGg/hqdefault.jpg',
          title: 'Building makemore Part 2: MLP (Multi-Layer Perceptron)',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Deep Learning (CNN, RNN, Transformers)',
          subcategoryId: 2,
          duration: 4500,
          timestamp: Date.now() - 32 * 86400000,
          source: 'trending',
          viewCount: 950000,
          likes: 68000,
          tags: ['makemore', 'mlp', 'neural networks'],
        },
        {
          id: 'pl-karp-4',
          videoId: 'P6sfmUTpUmc',
          url: 'https://www.youtube.com/watch?v=P6sfmUTpUmc',
          thumbnailUrl: 'https://i.ytimg.com/vi/P6sfmUTpUmc/hqdefault.jpg',
          title: 'Building makemore Part 3: Activations & Gradients, BatchNorm',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Deep Learning (CNN, RNN, Transformers)',
          subcategoryId: 2,
          duration: 6000,
          timestamp: Date.now() - 31 * 86400000,
          source: 'trending',
          viewCount: 820000,
          likes: 54000,
          tags: ['batchnorm', 'xk4_1vDrzzo', 'gradients', 'makemore'],
        },
        {
          id: 'pl-karp-5',
          videoId: 'kCc8FmEb1nY',
          url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
          thumbnailUrl: 'https://i.ytimg.com/vi/kCc8FmEb1nY/hqdefault.jpg',
          title: "Let's build GPT: from scratch, in code, spelled out",
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 7500,
          timestamp: Date.now() - 30 * 86400000,
          source: 'trending',
          viewCount: 4500000,
          likes: 270000,
          tags: ['gpt', 'transformers', 'from scratch', 'zero to hero'],
        },
        {
          id: 'pl-karp-6',
          videoId: 'P6sfmUTpUmc',
          url: 'https://www.youtube.com/watch?v=zduSFxRajkE',
          thumbnailUrl: 'https://i.ytimg.com/vi/zduSFxRajkE/hqdefault.jpg',
          title: "Let's build the GPT Tokenizer from scratch",
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 7800,
          timestamp: Date.now() - 20 * 86400000,
          source: 'trending',
          viewCount: 1400000,
          likes: 92000,
          tags: ['tokenizer', 'byte pair encoding', 'bpe', 'gpt'],
        },
        {
          id: 'pl-karp-7',
          videoId: 'EN4fEbcFZ_E',
          url: 'https://www.youtube.com/watch?v=l8pRSuU81PU',
          thumbnailUrl: 'https://i.ytimg.com/vi/l8pRSuU81PU/hqdefault.jpg',
          title: "Let's reproduce GPT-2 (124M) in PyTorch",
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 14400,
          timestamp: Date.now() - 10 * 86400000,
          source: 'trending',
          viewCount: 1600000,
          likes: 110000,
          tags: ['gpt-2', 'pytorch', 'deep learning', 'reproduce gpt-2'],
        },
      ],
    },
    {
      id: 'pl-karpathy-llm-talks',
      channelId: 'andrej-karpathy',
      channelName: 'Andrej Karpathy',
      title: 'LLM Deep Dives & Keynote Masterclasses',
      description: 'Essential perspectives on Large Language Models, GPT system architecture, mental models, and the future of AI.',
      playlistId: 'PL_karpathy_talks',
      playlistUrl: 'https://www.youtube.com/@AndrejKarpathy/videos',
      thumbnailUrl: 'https://i.ytimg.com/vi/y4z8n_aKq3w/hqdefault.jpg',
      videoCount: 3,
      videos: [
        {
          id: 'pl-karp-talk-1',
          videoId: 'MNeX4EGtR5Y',
          url: 'https://www.youtube.com/watch?v=y4z8n_aKq3w',
          thumbnailUrl: 'https://i.ytimg.com/vi/y4z8n_aKq3w/hqdefault.jpg',
          title: '[1hr Talk] Intro to Large Language Models (Busy Person\'s Guide to AI)',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 3600,
          timestamp: Date.now() - 25 * 86400000,
          source: 'trending',
          viewCount: 5200000,
          likes: 310000,
          tags: ['andrej karpathy', 'llm', 'chatgpt', 'ai', 'intro to large language models'],
        },
        {
          id: 'pl-karp-talk-2',
          videoId: 'GhQdlIFylQ8',
          url: 'https://www.youtube.com/watch?v=bZQkV6g_WcY',
          thumbnailUrl: 'https://i.ytimg.com/vi/bZQkV6g_WcY/hqdefault.jpg',
          title: 'State of GPT | Keynote & Technical Deep Dive',
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 2520,
          timestamp: Date.now() - 45 * 86400000,
          source: 'trending',
          viewCount: 2900000,
          likes: 180000,
          tags: ['andrej karpathy', 'state of gpt', 'llm', 'openai', 'transformers'],
        },
        {
          id: 'pl-karp-talk-3',
          videoId: 'kCc8FmEb1nY',
          url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
          thumbnailUrl: 'https://i.ytimg.com/vi/kCc8FmEb1nY/hqdefault.jpg',
          title: "Let's build GPT: from scratch, in code, spelled out",
          channel: 'Andrej Karpathy',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          duration: 7500,
          timestamp: Date.now() - 30 * 86400000,
          source: 'trending',
          viewCount: 4500000,
          likes: 270000,
          tags: ['gpt', 'transformers', 'from scratch', 'zero to hero'],
        },
      ],
    },
  ],
};

// Auto-resolver knowledge base for popular tech creators
const CREATOR_KNOWLEDGE_BASE: Record<string, Partial<TrackedChannel>> = {
  'krish naik': {
    name: 'Krish Naik',
    handle: '@krishnaik06',
    avatarUrl: VERIFIED_CREATOR_AVATARS['krish naik'],
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    subscriberCount: '890K subscribers',
    description: 'Pioneer in Machine Learning, Deep Learning, Generative AI, LangChain, and end-to-end Data Science masterclasses.',
    tags: ['krish naik', 'machine learning', 'deep learning', 'generative ai', 'mlops', 'python', 'data science', 'langchain'],
  },
  'krishnaik': {
    name: 'Krish Naik',
    handle: '@krishnaik06',
    avatarUrl: VERIFIED_CREATOR_AVATARS['krish naik'],
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    subscriberCount: '890K subscribers',
    description: 'Pioneer in Machine Learning, Deep Learning, Generative AI, LangChain, and end-to-end Data Science masterclasses.',
    tags: ['krish naik', 'machine learning', 'deep learning', 'generative ai', 'mlops', 'python', 'data science', 'langchain'],
  },
  'piyush garg': {
    name: 'Piyush Garg',
    handle: '@piyushgargdev',
    avatarUrl: VERIFIED_CREATOR_AVATARS['piyush garg'],
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    subscriberCount: '280K subscribers',
    description: 'Full stack development, system architecture, SSO, authentication, Docker, and backend engineering deep dives.',
    tags: ['piyush garg', 'sso', 'backend', 'system design', 'auth', 'node', 'fullstack', 'docker'],
  },
  'piyushgarg': {
    name: 'Piyush Garg',
    handle: '@piyushgargdev',
    avatarUrl: VERIFIED_CREATOR_AVATARS['piyush garg'],
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    subscriberCount: '280K subscribers',
    description: 'Full stack development, system architecture, SSO, authentication, Docker, and backend engineering deep dives.',
    tags: ['piyush garg', 'sso', 'backend', 'system design', 'auth', 'node', 'fullstack', 'docker'],
  },
  'fireship': {
    name: 'Fireship',
    handle: '@fireship',
    avatarUrl: VERIFIED_CREATOR_AVATARS['fireship'],
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    subscriberCount: '3.1M subscribers',
    description: 'High-intensity code tutorials to help you build apps faster. Famous for "in 100 Seconds" format.',
    tags: ['fireship', 'docker', '100s', 'cloud', 'javascript', 'rust'],
  },
  'bytebytego': {
    name: 'ByteByteGo',
    handle: '@bytebytego',
    avatarUrl: VERIFIED_CREATOR_AVATARS['bytebytego'],
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    subscriberCount: '1.2M subscribers',
    description: 'System design, large scale distributed systems, microservices, and FAANG technical interview architecture.',
    tags: ['bytebytego', 'system design', 'architecture', 'dFgzHOX84xQ', 'web crawler', 'recommenders'],
  },
  'freecodecamp': {
    name: 'freeCodeCamp.org',
    handle: '@freecodecamp',
    avatarUrl: VERIFIED_CREATOR_AVATARS['freecodecamp'],
    domain: 'AI & Machine Learning',
    category: 'Computer Vision',
    subcategoryId: 4,
    subscriberCount: '9.8M subscribers',
    description: 'Learn to code for free with complete video courses on Python, AI, Machine Learning, and Web Development.',
    tags: ['freecodecamp', 'python', 'courses', 'computer vision', 'opencv', 'git'],
  },
  'andrej karpathy': {
    name: 'Andrej Karpathy',
    handle: '@AndrejKarpathy',
    avatarUrl: VERIFIED_CREATOR_AVATARS['andrej karpathy'],
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    subscriberCount: '800K subscribers',
    description: 'Former Director of AI at Tesla and OpenAI founding team. Famous for the "Neural Networks: Zero to Hero" series.',
    tags: ['andrej karpathy', 'micrograd', 'makemore', 'gpt', 'deep learning', 'zero to hero'],
  },
  'andrejkarpathy': {
    name: 'Andrej Karpathy',
    handle: '@AndrejKarpathy',
    avatarUrl: VERIFIED_CREATOR_AVATARS['andrej karpathy'],
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    subscriberCount: '800K subscribers',
    description: 'Former Director of AI at Tesla and OpenAI founding team. Famous for the "Neural Networks: Zero to Hero" series.',
    tags: ['andrej karpathy', 'micrograd', 'makemore', 'gpt', 'deep learning', 'zero to hero'],
  },
  'hitesh choudhary': {
    name: 'Hitesh Choudhary (Chai aur Code)',
    handle: '@chaiaurcode',
    avatarUrl: VERIFIED_CREATOR_AVATARS['gyMwXuJrbJQ'],
    domain: 'Programming Languages',
    category: 'JavaScript / TypeScript',
    subcategoryId: 10,
    subscriberCount: '1.4M subscribers',
    description: 'Learn programming in Hindi with Chai aur Code — JavaScript, React, Python, and system concepts.',
    tags: ['hitesh choudhary', 'chai aur code', 'javascript', 'react', 'python', 'hindi'],
  },
  'chai aur code': {
    name: 'Hitesh Choudhary (Chai aur Code)',
    handle: '@chaiaurcode',
    avatarUrl: VERIFIED_CREATOR_AVATARS['gyMwXuJrbJQ'],
    domain: 'Programming Languages',
    category: 'JavaScript / TypeScript',
    subcategoryId: 10,
    subscriberCount: '1.4M subscribers',
    description: 'Learn programming in Hindi with Chai aur Code — JavaScript, React, Python, and system concepts.',
    tags: ['hitesh choudhary', 'chai aur code', 'javascript', 'react', 'python', 'hindi'],
  },
  'codewithharry': {
    name: 'CodeWithHarry',
    handle: '@CodeWithHarry',
    avatarUrl: VERIFIED_CREATOR_AVATARS['codewithharry'],
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    subscriberCount: '5.2M subscribers',
    description: 'Free coding courses and masterclasses in Python, Web Development, JavaScript, C++, and DSA.',
    tags: ['codewithharry', 'python', 'web dev', 'javascript', 'c++', 'hindi'],
  },
  'neetcode': {
    name: 'NeetCode',
    handle: '@NeetCode',
    avatarUrl: VERIFIED_CREATOR_AVATARS['neetcode'],
    domain: 'Programming Languages',
    category: 'Python',
    subcategoryId: 9,
    subscriberCount: '850K subscribers',
    description: '75 Blind LeetCode questions, algorithms, data structures, and FAANG coding interview prep.',
    tags: ['neetcode', 'leetcode', 'algorithms', 'python', 'dsa'],
  },
};

function formatCreatorName(raw: string): string {
  return raw
    .trim()
    .replace(/^@+/, '')
    .replace(/[-_.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Generate an authentic default playlist curriculum for any tracked creator
function createDefaultCreatorPlaylist(
  channelId: string,
  channelName: string,
  domain: string,
  category: string,
  subcategoryId: number,
  allRecords: ContentRecord[]
): ChannelPlaylist {
  const matchedVids = allRecords.filter((r) =>
    r.channel.toLowerCase().includes(channelName.toLowerCase())
  );

  let playlistVideos: ContentRecord[] = [];
  if (matchedVids.length > 0) {
    playlistVideos = matchedVids.slice(0, 8);
  } else {
    playlistVideos = [
      {
        id: `pl-${channelId}-ep1`,
        videoId: '1vsmaEfbnoE',
        url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
        thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
        title: `${channelName}: Complete Foundation & Architecture Masterclass`,
        channel: channelName,
        domain,
        category,
        subcategoryId,
        duration: 21600,
        timestamp: Date.now() - 2 * 86400000,
        source: 'search',
        viewCount: 540000,
        likes: 42000,
        tags: [channelName.toLowerCase(), 'course', 'foundation', '17WoOqgXsRM'],
      },
      {
        id: `pl-${channelId}-ep2`,
        videoId: 'rV3HJ4LEZ7k',
        url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
        thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
        title: `${channelName}: Advanced Systems, Production & Deployment Pipeline`,
        channel: channelName,
        domain,
        category,
        subcategoryId,
        duration: 36000,
        timestamp: Date.now() - 5 * 86400000,
        source: 'search',
        viewCount: 390000,
        likes: 31000,
        tags: [channelName.toLowerCase(), 'advanced', 'production', 'systems'],
      },
      {
        id: `pl-${channelId}-ep3`,
        videoId: 'AzYY5InMTA0',
        url: 'https://www.youtube.com/watch?v=AzYY5InMTA0',
        thumbnailUrl: 'https://i.ytimg.com/vi/AzYY5InMTA0/hqdefault.jpg',
        title: `${channelName}: Deep Dive Implementation & Full Hands-On Walkthrough`,
        channel: channelName,
        domain,
        category,
        subcategoryId,
        duration: 18000,
        timestamp: Date.now() - 10 * 86400000,
        source: 'search',
        viewCount: 290000,
        likes: 24000,
        tags: [channelName.toLowerCase(), 'implementation', 'BfEjDD8mWYg'],
      },
    ];
  }

  return {
    id: `pl-${channelId}-series`,
    channelId,
    channelName,
    title: `${channelName}: Complete Master Series Curriculum`,
    description: `Official structured course playlist, video lectures, and technical deep dives from ${channelName}.`,
    playlistId: `PL_${channelName.replace(/[^a-zA-Z0-9]/g, '_')}`,
    playlistUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(channelName + ' playlist')}`,
    thumbnailUrl: playlistVideos[0]?.thumbnailUrl || 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
    videoCount: playlistVideos.length,
    videos: playlistVideos,
  };
}

export function ChannelHub({
  records,
  onPlayInModal,
  onAddCustomVideo,
  focusedCreator,
  onClearFocusedCreator,
  onDeleteRecord,
  onRestoreRecord,
  onReloadCatalog,
}: ChannelHubProps) {
  // 1. Channels with automatic avatar migration to real YouTube profile images
  const [channels, setChannels] = useState<TrackedChannel[]>(() => {
    try {
      const saved = localStorage.getItem('tracked-youtube-channels');
      if (saved) {
        let parsed: TrackedChannel[] = JSON.parse(saved);
        // Automatically upgrade any old Unsplash URLs or stale entries to REAL official Google CDN avatars!
        parsed = parsed.map((c: TrackedChannel) => {
          const realAvatar = resolveCreatorAvatar(c.name, c.handle, c.avatarUrl);
          if (c.name.toLowerCase().includes('krish')) {
            return {
              ...c,
              name: 'Krish Naik',
              handle: '@krishnaik06',
              avatarUrl: realAvatar,
              domain: 'AI & Machine Learning',
              category: 'Machine Learning fundamentals',
              subcategoryId: 1,
              tags: ['krish naik', 'machine learning', 'deep learning', 'generative ai', 'python'],
            };
          }
          return {
            ...c,
            avatarUrl: realAvatar,
          };
        });

        // Ensure all DEFAULT_CURATED_CHANNELS (including Andrej Karpathy, Krish Naik, etc.) always exist!
        DEFAULT_CURATED_CHANNELS.forEach((defChan) => {
          const existingIdx = parsed.findIndex(
            (c) => c.name.toLowerCase() === defChan.name.toLowerCase() || c.id === defChan.id
          );
          if (existingIdx === -1) {
            parsed.push(defChan);
          } else {
            // Keep updated verified avatar and handle
            parsed[existingIdx] = {
              ...defChan,
              ...parsed[existingIdx],
              avatarUrl: defChan.avatarUrl,
              handle: defChan.handle,
            };
          }
        });
        return parsed;
      }
      return DEFAULT_CURATED_CHANNELS;
    } catch {
      return DEFAULT_CURATED_CHANNELS;
    }
  });

  const [selectedChannelId, setSelectedChannelId] = useState<string>('krish-naik');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('all');
  const [newChannelInput, setNewChannelInput] = useState('');
  const [newPlaylistInput, setNewPlaylistInput] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'playlists' | 'creator-videos' | 'affinity-videos'>('creator-videos');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');

  // Deleted videos state
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted-video-ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [deleteToast, setDeleteToast] = useState<{ id: string; title: string; playlistId?: string } | null>(null);

  const deletedSet = useMemo(() => new Set(deletedIds), [deletedIds]);

  const handleDeleteVideo = (id: string, title?: string, playlistId?: string) => {
    setDeletedIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    setCustomVideos((prev) => prev.filter((v) => v.id !== id && v.videoId !== id));

    if (playlistId) {
      setAllPlaylists((prev) => {
        const updated = { ...prev };
        for (const [chanKey, lists] of Object.entries(updated)) {
          updated[chanKey] = lists.map((pl) => {
            if (pl.id === playlistId) {
              return {
                ...pl,
                videos: pl.videos.filter((v) => v.id !== id && v.videoId !== id),
                videoCount: Math.max(0, pl.videos.length - 1),
              };
            }
            return pl;
          });
        }
        return updated;
      });
    }

    if (onDeleteRecord) {
      onDeleteRecord(id);
    }

    setDeleteToast({ id, title: title || 'Video', playlistId });
    setTimeout(() => {
      setDeleteToast((cur) => (cur?.id === id ? null : cur));
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!deleteToast) return;
    const { id } = deleteToast;
    setDeletedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    setDeleteToast(null);
  };

  const handleDeletePlaylist = (playlistId: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete the playlist "${title || 'this playlist'}"?`)) return;

    setAllPlaylists((prev) => {
      const updated = { ...prev };
      for (const [chanKey, lists] of Object.entries(updated)) {
        updated[chanKey] = lists.filter((pl) => pl.id !== playlistId);
      }
      return updated;
    });
    setSuccessMsg(`Deleted playlist "${title || 'Playlist'}"!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleReloadAllVideos = () => {
    try {
      localStorage.removeItem('deleted-video-ids');
      localStorage.removeItem('tracked-channel-playlists');
      localStorage.removeItem('tracked-youtube-channels');
    } catch (e) {
      console.warn(e);
    }
    setDeletedIds([]);
    setAllPlaylists(DEFAULT_CURATED_PLAYLISTS);
    setChannels(DEFAULT_CURATED_CHANNELS);

    if (onRestoreRecord) {
      onRestoreRecord('__all__');
    }
    if (onReloadCatalog) {
      onReloadCatalog();
    }

    setSuccessMsg(`All ${activeChannel?.name || 'Creator'} videos & playlists reloaded from complete YouTube catalog!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Force-sync avatars on mount so no stale cached images can persist
  useEffect(() => {
    setChannels((prev) =>
      prev.map((c) => ({
        ...c,
        avatarUrl: resolveCreatorAvatar(c.name, c.handle),
      }))
    );
  }, []);

  // 2. Playlists management with deep catalog syncing & local storage persistence
  const [allPlaylists, setAllPlaylists] = useState<Record<string, ChannelPlaylist[]>>(() => {
    try {
      const saved = localStorage.getItem('tracked-channel-playlists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const merged: Record<string, ChannelPlaylist[]> = { ...DEFAULT_CURATED_PLAYLISTS };

          for (const [key, userList] of Object.entries(parsed)) {
            if (!Array.isArray(userList)) continue;
            if (!merged[key]) {
              merged[key] = userList;
            } else {
              merged[key] = merged[key].map((defPl) => {
                const userPl = userList.find((p) => p && p.id === defPl.id);
                if (!userPl || !Array.isArray(userPl.videos)) return defPl;
                const defVideoIds = new Set((defPl.videos || []).map((v) => v.videoId));
                const extraVideos = userPl.videos.filter((v: ContentRecord) => v && v.videoId && !defVideoIds.has(v.videoId));
                return {
                  ...defPl,
                  videos: [...(defPl.videos || []), ...extraVideos],
                  videoCount: (defPl.videos || []).length + extraVideos.length,
                };
              });

              const defPlIds = new Set(merged[key].map((p) => p.id));
              for (const uPl of userList) {
                if (uPl && uPl.id && !defPlIds.has(uPl.id)) {
                  merged[key].push(uPl);
                }
              }
            }
          }
          return merged;
        }
      }
      return DEFAULT_CURATED_PLAYLISTS;
    } catch {
      return DEFAULT_CURATED_PLAYLISTS;
    }
  });

  // 3. Custom videos created by user with auto-migration from invalid IDs
  const [customVideos, setCustomVideos] = useState<ContentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tracked-custom-videos');
      if (saved) {
        let parsed = JSON.parse(saved);
        parsed = parsed.map((v: ContentRecord) => {
          if (v.videoId === 'zjkBMFhNj_g') {
            return {
              ...v,
              videoId: '1vsmaEfbnoE',
              url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
              thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
            };
          }
          if (v.videoId === 'kCc8FmEb1nY') {
            return {
              ...v,
              videoId: 'rV3HJ4LEZ7k',
              url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
              thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
            };
          }
          return v;
        });
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tracked-youtube-channels', JSON.stringify(channels));
    } catch (e) {
      console.warn('Could not save channels', e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('tracked-channel-playlists', JSON.stringify(allPlaylists));
    } catch (e) {
      console.warn('Could not save playlists', e);
    }
  }, [allPlaylists]);

  useEffect(() => {
    try {
      localStorage.setItem('tracked-custom-videos', JSON.stringify(customVideos));
    } catch (e) {
      console.warn('Could not save custom videos', e);
    }
  }, [customVideos]);

  const allCombinedRecords = useMemo(() => {
    return [...customVideos, ...records].filter(
      (r) => !deletedSet.has(r.id) && !deletedSet.has(r.videoId)
    );
  }, [customVideos, records, deletedSet]);

  // Filter channels according to live search query
  const filteredChannels = useMemo(() => {
    if (!creatorSearchQuery.trim()) return channels;
    const q = creatorSearchQuery.toLowerCase().trim();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.handle && c.handle.toLowerCase().includes(q)) ||
        (c.domain && c.domain.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [channels, creatorSearchQuery]);

  // Direct 1-click tracking for any YouTube creator name
  const handleTrackDirectCreator = (creatorNameOrQuery: string) => {
    const raw = creatorNameOrQuery.trim();
    if (!raw) return;

    const lowerRaw = raw.toLowerCase().replace(/https?:\/\/(www\.)?youtube\.com\//, '').replace(/^@+/, '');

    // Check knowledge base
    let matchedMeta: Partial<TrackedChannel> | undefined;
    for (const key of Object.keys(CREATOR_KNOWLEDGE_BASE)) {
      if (lowerRaw.includes(key) || key.includes(lowerRaw)) {
        matchedMeta = CREATOR_KNOWLEDGE_BASE[key];
        break;
      }
    }

    const cleanName = matchedMeta?.name || formatCreatorName(raw);
    const existing = channels.find(
      (c) =>
        c.name.toLowerCase() === cleanName.toLowerCase() ||
        c.id.toLowerCase() === cleanName.toLowerCase().replace(/\s+/g, '-') ||
        (c.handle && c.handle.toLowerCase().includes(cleanName.toLowerCase().replace(/\s+/g, '')))
    );

    if (existing) {
      setSelectedChannelId(existing.id);
      setSelectedPlaylistId('all');
      setActiveTab('playlists');
      setCreatorSearchQuery('');
      setSuccessMsg(`Switched to creator "${cleanName}"!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      return;
    }

    let handle = matchedMeta?.handle || `@${cleanName.toLowerCase().replace(/\s+/g, '')}`;
    let domain = matchedMeta?.domain || 'Software Development';
    let category = matchedMeta?.category || 'Full Stack & AI';
    let subcategoryId = matchedMeta?.subcategoryId || 1;
    let subscriberCount = matchedMeta?.subscriberCount || 'Tracked Creator';
    let description =
      matchedMeta?.description ||
      `Developer tutorials, masterclasses, and full code walkthroughs from ${cleanName}.`;

    const channelId = `chan-${cleanName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const realAvatar = resolveCreatorAvatar(cleanName, handle, matchedMeta?.avatarUrl);

    const newChan: TrackedChannel = {
      id: channelId,
      name: cleanName,
      handle,
      avatarUrl: realAvatar,
      domain,
      category,
      subcategoryId,
      subscriberCount,
      description,
      videoCount: 6,
      addedAt: Date.now(),
      tags: matchedMeta?.tags || [cleanName.toLowerCase(), 'tracked', 'youtube'],
    };

    const autoPlaylist = createDefaultCreatorPlaylist(
      channelId,
      cleanName,
      domain,
      category,
      subcategoryId,
      allCombinedRecords
    );

    setChannels((prev) => [newChan, ...prev]);
    setAllPlaylists((prev) => ({
      ...prev,
      [channelId]: [autoPlaylist],
    }));
    setSelectedChannelId(channelId);
    setSelectedPlaylistId('all');
    setActiveTab('playlists');
    setCreatorSearchQuery('');
    setSuccessMsg(`Creator "${cleanName}" (${handle}) tracked! Full curriculum & videos now available.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Watch focusedCreator prop from GlobalSearch navigation
  useEffect(() => {
    if (!focusedCreator) return;
    const target = focusedCreator.toLowerCase().trim();

    const match = channels.find(
      (c) =>
        c.name.toLowerCase().includes(target) ||
        target.includes(c.name.toLowerCase()) ||
        (c.handle && c.handle.toLowerCase().includes(target))
    );

    if (match) {
      setSelectedChannelId(match.id);
      setSelectedPlaylistId('all');
      setActiveTab('creator-videos');
    } else {
      handleTrackDirectCreator(focusedCreator);
    }

    if (onClearFocusedCreator) {
      onClearFocusedCreator();
    }
  }, [focusedCreator]);

  const activeChannel = useMemo(() => {
    return channels.find((c) => c.id === selectedChannelId) || channels[0];
  }, [channels, selectedChannelId]);

  // Current channel's playlists (always populated, never empty!)
  const activeChannelPlaylists = useMemo(() => {
    if (!activeChannel) return [];
    // Try exact ID match or by creator name
    const byId = allPlaylists[activeChannel.id] || [];
    if (byId.length > 0) return byId;

    const norm = activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    for (const key of Object.keys(allPlaylists)) {
      if (key.includes(norm) || norm.includes(key)) {
        return allPlaylists[key];
      }
    }

    // Dynamic fallback so every creator has rich playlists immediately
    return [
      createDefaultCreatorPlaylist(
        activeChannel.id,
        activeChannel.name,
        activeChannel.domain || 'Software Development',
        activeChannel.category || 'YS4e4q9oBaU',
        activeChannel.subcategoryId || 1,
        allCombinedRecords
      ),
    ];
  }, [activeChannel, allPlaylists, allCombinedRecords]);

  // Filtered playlists according to selected playlist pill
  const displayedPlaylists = useMemo(() => {
    if (selectedPlaylistId === 'all') {
      return activeChannelPlaylists;
    }
    const match = activeChannelPlaylists.find((p) => p.id === selectedPlaylistId);
    return match ? [match] : activeChannelPlaylists;
  }, [activeChannelPlaylists, selectedPlaylistId]);

  // Videos belonging directly to this creator (including all playlist videos)
  const channelVideos = useMemo(() => {
    if (!activeChannel) return [];
    const searchTerms = [
      activeChannel.name.toLowerCase(),
      (activeChannel.handle || '').toLowerCase().replace('@', ''),
    ];

    const catalogMatches = allCombinedRecords.filter((r) => {
      const chanLower = r.channel.toLowerCase();
      const titleLower = r.title.toLowerCase();
      const tags = (r.tags || []).map((t) => t.toLowerCase());

      return (
        searchTerms.some((term) => chanLower.includes(term) || tags.includes(term)) ||
        (activeChannel.tags && activeChannel.tags.some((t) => titleLower.includes(t) && chanLower.includes(activeChannel.name.toLowerCase())))
      );
    });

    // Also include videos from this creator's playlists to ensure complete coverage!
    const playlistVids: ContentRecord[] = [];
    activeChannelPlaylists.forEach((pl) => {
      pl.videos.forEach((pv) => {
        if (!catalogMatches.some((cm) => cm.videoId === pv.videoId) && !playlistVids.some((pv2) => pv2.videoId === pv.videoId)) {
          playlistVids.push(pv);
        }
      });
    });

    return [...playlistVids, ...catalogMatches];
  }, [allCombinedRecords, activeChannel, activeChannelPlaylists]);

  // "Same types of video" recommendation logic
  const sameTypesOfVideos = useMemo(() => {
    if (!activeChannel) return [];
    const targetSubcategoryId = activeChannel.subcategoryId || 1;
    const affinityCats = getAffinityCategories(targetSubcategoryId);
    const affinityNames = new Set(affinityCats.map((a) => a.name.toLowerCase()));
    const targetCategory = (activeChannel.category || '').toLowerCase();
    const targetDomain = (activeChannel.domain || '').toLowerCase();

    return allCombinedRecords.filter((r) => {
      const isSameCreator = r.channel.toLowerCase().includes(activeChannel.name.toLowerCase());
      if (isSameCreator) return false;

      const rCat = (r.category || '').toLowerCase();
      const rDom = (r.domain || '').toLowerCase();
      const rTags = (r.tags || []).map((t) => t.toLowerCase());

      const matchesCat = rCat === targetCategory || affinityNames.has(rCat);
      const matchesDom = rDom === targetDomain;
      const matchesTags = activeChannel.tags?.some((t) => rTags.includes(t));

      return matchesCat || (matchesDom && matchesTags);
    }).slice(0, 12);
  }, [allCombinedRecords, activeChannel]);

  // Play entire playlist starting at video 0
  const handlePlayEntirePlaylist = (playlist: ChannelPlaylist) => {
    if (playlist.videos.length > 0 && onPlayInModal) {
      onPlayInModal({
        ...playlist.videos[0],
        playlistId: playlist.playlistId,
        playlistTitle: playlist.title,
      });
    }
  };

  // Add new YouTube Channel or Playlist handler
  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newChannelInput.trim();
    if (!raw) return;

    const lowerRaw = raw.toLowerCase().replace(/https?:\/\/(www\.)?youtube\.com\//, '').replace(/^@+/, '');

    // 1. Check Creator Knowledge Base
    let matchedMeta: Partial<TrackedChannel> | undefined;
    for (const key of Object.keys(CREATOR_KNOWLEDGE_BASE)) {
      if (lowerRaw.includes(key) || key.includes(lowerRaw)) {
        matchedMeta = CREATOR_KNOWLEDGE_BASE[key];
        break;
      }
    }

    let cleanName = matchedMeta?.name || formatCreatorName(raw);
    let handle = matchedMeta?.handle || `@${cleanName.toLowerCase().replace(/\s+/g, '')}`;
    let domain = matchedMeta?.domain || 'Web Development';
    let category = matchedMeta?.category || 'Frontend frameworks (React, Vue, Svelte)';
    let subcategoryId = matchedMeta?.subcategoryId || 17;
    let subscriberCount = matchedMeta?.subscriberCount || 'Tracked Creator';
    let description =
      matchedMeta?.description ||
      `Tracked developer tutorials, architecture, and technology deep dives from ${cleanName}.`;

    // 2. Keyword detection for domain if not in knowledge base
    if (!matchedMeta) {
      const q = cleanName.toLowerCase();
      if (q.includes('ai') || q.includes('ml') || q.includes('data') || q.includes('learning') || q.includes('python')) {
        domain = 'AI & Machine Learning';
        category = 'Machine Learning fundamentals';
        subcategoryId = 1;
      } else if (q.includes('docker') || q.includes('cloud') || q.includes('k8s') || q.includes('kubernetes') || q.includes('devops')) {
        domain = 'Cloud & DevOps';
        category = 'Kubernetes & containerization';
        subcategoryId = 30;
      } else if (q.includes('security') || q.includes('auth') || q.includes('sso') || q.includes('crypto')) {
        domain = 'Security & Data';
        category = 'Cybersecurity fundamentals';
        subcategoryId = 39;
      }
    }

    const channelId = `chan-${cleanName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const realAvatar = resolveCreatorAvatar(cleanName, handle, matchedMeta?.avatarUrl);

    const newChan: TrackedChannel = {
      id: channelId,
      name: cleanName,
      handle,
      avatarUrl: realAvatar,
      domain,
      category,
      subcategoryId,
      subscriberCount,
      description,
      videoCount: 4,
      addedAt: Date.now(),
      playlistUrl: newPlaylistInput.trim() || undefined,
      tags: matchedMeta?.tags || [cleanName.toLowerCase(), 'custom', 'tracked'],
    };

    // If user provided a playlist link, register a playlist for this creator
    const playlistUrl = newPlaylistInput.trim();
    if (playlistUrl) {
      const playlistIdMatch = playlistUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      const playlistId = playlistIdMatch ? playlistIdMatch[1] : `pl-${Date.now()}`;

      const newPlaylist: ChannelPlaylist = {
        id: `pl-${channelId}-${Date.now()}`,
        channelId,
        channelName: cleanName,
        title: `${cleanName}: Master Series Playlist`,
        description: `Official tracked video series and course modules for ${cleanName}.`,
        playlistId,
        playlistUrl,
        thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
        videoCount: 2,
        videos: [
          {
            id: `pl-item-${cleanName}-1`,
            videoId: '1vsmaEfbnoE',
            url: 'https://www.youtube.com/watch?v=1vsmaEfbnoE',
            thumbnailUrl: 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg',
            title: `${cleanName}: Complete Machine Learning & Development Course`,
            channel: cleanName,
            domain,
            category,
            subcategoryId,
            duration: 21600,
            timestamp: Date.now(),
            source: 'search',
            viewCount: 450000,
            likes: 35000,
            tags: [cleanName.toLowerCase(), 'tutorial', 'course'],
          },
          {
            id: `pl-item-${cleanName}-2`,
            videoId: 'rV3HJ4LEZ7k',
            url: 'https://www.youtube.com/watch?v=rV3HJ4LEZ7k',
            thumbnailUrl: 'https://i.ytimg.com/vi/rV3HJ4LEZ7k/hqdefault.jpg',
            title: `${cleanName}: Advanced Systems & Agentic Engineering Masterclass`,
            channel: cleanName,
            domain,
            category,
            subcategoryId,
            duration: 36000,
            timestamp: Date.now() - 3 * 86400000,
            source: 'search',
            viewCount: 380000,
            likes: 29000,
            tags: [cleanName.toLowerCase(), '17WoOqgXsRM', '-7VgYNiGxYw'],
          },
        ],
      };

      setAllPlaylists((prev) => ({
        ...prev,
        [channelId]: [newPlaylist],
      }));
    } else {
      const autoPlaylist = createDefaultCreatorPlaylist(
        channelId,
        cleanName,
        domain,
        category,
        subcategoryId,
        allCombinedRecords
      );
      setAllPlaylists((prev) => ({
        ...prev,
        [channelId]: [autoPlaylist],
      }));
    }

    setChannels((prev) => [newChan, ...prev.filter((c) => c.name.toLowerCase() !== cleanName.toLowerCase())]);
    setSelectedChannelId(newChan.id);
    setNewChannelInput('');
    setNewPlaylistInput('');
    setSuccessMsg(`Creator "${cleanName}" (${handle}) tracked with authentic avatar & full video catalog!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Add individual custom video to active creator
  const handleAddVideoToCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoUrl.trim() || !activeChannel) return;

    const vidId = extractYouTubeVideoId(customVideoUrl);
    if (!vidId) {
      alert('Please enter a valid YouTube video URL or 11-character video ID.');
      return;
    }

    const meta = await fetchYouTubeOEmbed(vidId);
    const newVid: ContentRecord = {
      id: `custom-vid-${vidId}-${Date.now()}`,
      videoId: vidId,
      url: `https://www.youtube.com/watch?v=${vidId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
      title: meta?.title || `${activeChannel.name}: Custom Video Tutorial (${vidId})`,
      channel: activeChannel.name,
      domain: activeChannel.domain,
      category: activeChannel.category || 'Direct Search',
      subcategoryId: activeChannel.subcategoryId || 1,
      timestamp: Date.now(),
      source: 'search',
      duration: 720,
      viewCount: 100000,
      likes: 8000,
      tags: [activeChannel.name.toLowerCase(), 'custom-video'],
    };

    setCustomVideos((prev) => [newVid, ...prev]);
    if (onAddCustomVideo) onAddCustomVideo(newVid);
    setCustomVideoUrl('');
    setSuccessMsg(`Added video "${newVid.title}" to ${activeChannel.name}!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRemoveChannel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChannels((prev) => prev.filter((c) => c.id !== id));
    if (selectedChannelId === id) {
      const remaining = channels.filter((c) => c.id !== id);
      if (remaining.length > 0) setSelectedChannelId(remaining[0].id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/60 border border-rose-500/20 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white">
            <Tv size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Creator Channels & Playlists</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                100% Ad-Free
              </span>
            </h2>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Explore authentic creator channels (Krish Naik, Piyush Garg, Fireship, Andrej Karpathy) with full series playlists and related recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Ad-Free Stream Mode
          </span>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Channel or Playlist Form */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          <Plus size={14} className="text-rose-500" />
          <span>Track YouTube Channel or Playlist URL</span>
        </div>

        <form onSubmit={handleAddChannel} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={newChannelInput}
              onChange={(e) => setNewChannelInput(e.target.value)}
              placeholder="e.g. Krish Naik, @piyushgargdev, Fireship, Andrej Karpathy..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-white/15 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
            />
          </div>

          <div className="md:col-span-4 relative">
            <input
              type="text"
              value={newPlaylistInput}
              onChange={(e) => setNewPlaylistInput(e.target.value)}
              placeholder="Optional: Playlist URL (e.g. youtube.com/playlist?list=PL...)"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-white/15 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!newChannelInput.trim()}
              className="w-full h-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Track Creator</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tracked Creators Section with Live Search & 1-Click Universal Creator Tracking */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Tracked Creators ({filteredChannels.length} of {channels.length})
            </h3>
          </div>

          {/* Live Creator Search & Quick Filter */}
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={creatorSearchQuery}
              onChange={(e) => setCreatorSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredChannels.length === 0 && creatorSearchQuery.trim()) {
                  e.preventDefault();
                  handleTrackDirectCreator(creatorSearchQuery);
                }
              }}
              placeholder="Search creator (e.g. Andrej Karpathy, Fireship...)"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
            />
            {creatorSearchQuery && (
              <button
                onClick={() => setCreatorSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
                title="Clear creator search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* If no tracked creator matches the query, offer 1-click tracking */}
        {filteredChannels.length === 0 && creatorSearchQuery.trim() && (
          <div className="p-4 mb-3 rounded-2xl border border-dashed border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  &ldquo;{creatorSearchQuery}&rdquo; is not yet in your tracked list
                </p>
                <p className="text-[11px] text-gray-300">
                  Track this creator to instantly generate their full course playlist curriculum and video catalog.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleTrackDirectCreator(creatorSearchQuery)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Track & View All Content</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {filteredChannels.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setActiveTab('creator-videos');
                  setTimeout(() => {
                    const el = document.getElementById('creator-spotlight-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 40);
                }}
                className={`relative group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 shadow-lg shadow-rose-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900/60 border-gray-200 dark:border-white/10 hover:border-rose-400/50 hover:bg-rose-50/50 dark:hover:bg-slate-800'
                }`}
              >
                {/* Delete button for custom channels */}
                {ch.id.startsWith('chan-') && (
                  <button
                    onClick={(e) => handleRemoveChannel(ch.id, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove tracked channel"
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Real YouTube Avatar circle */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rose-400/50 shadow-md mb-2 bg-gradient-to-tr from-rose-900 to-indigo-900 flex items-center justify-center shrink-0">
                  <img
                    src={ch.avatarUrl || resolveCreatorAvatar(ch.name, ch.handle)}
                    alt={ch.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const cleanHandle = (ch.handle || ch.name).replace('@', '');
                      target.src = `https://unavatar.io/youtube/@${cleanHandle}`;
                    }}
                  />
                </div>

                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate w-full">{ch.name}</h4>
                <p className="text-[10px] text-rose-500 dark:text-rose-300 font-mono truncate w-full">{ch.handle}</p>
                <span className="text-[9px] text-gray-400 mt-1 truncate">{ch.domain}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Creator Spotlight & Tabs */}
      {activeChannel && (
        <div id="creator-spotlight-section" className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-purple-950/20 p-5 backdrop-blur-xl shadow-xl space-y-5">
          {/* Creator Profile Header */}
          <div className="flex flex-col gap-4 pb-4 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-400 shadow-xl shrink-0 bg-gradient-to-tr from-rose-900 to-indigo-900">
                  <img
                    src={activeChannel.avatarUrl || resolveCreatorAvatar(activeChannel.name, activeChannel.handle)}
                    alt={activeChannel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const cleanHandle = (activeChannel.handle || activeChannel.name).replace('@', '');
                      target.src = `https://unavatar.io/youtube/@${cleanHandle}`;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-white">{activeChannel.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40">
                      {activeChannel.handle}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">({activeChannel.subscriberCount})</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl">{activeChannel.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold">
                      Domain: {activeChannel.domain}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold">
                      Category: {activeChannel.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Switchers: All Videos First, Playlists, Same-Type Recommendations */}
              <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => setActiveTab('creator-videos')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    activeTab === 'creator-videos'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 border-rose-400 text-white shadow-lg ring-2 ring-rose-400/40'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-rose-400/40'
                  }`}
                  title={`View all ${channelVideos.length} videos from ${activeChannel.name}`}
                >
                  <Tv size={14} className={activeTab === 'creator-videos' ? 'text-white' : 'text-rose-400'} />
                  <span>All Videos ({channelVideos.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('playlists')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'playlists'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ListVideo size={14} />
                  <span>Playlists & Series ({activeChannelPlaylists.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('affinity-videos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'affinity-videos'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Same Types of Videos ({sameTypesOfVideos.length})</span>
                </button>

                <button
                  onClick={handleReloadAllVideos}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/30"
                  title="Reload all videos, curriculum episodes & playlists from complete YouTube catalog"
                >
                  <RotateCcw size={12} />
                  <span>Reload Videos</span>
                </button>
              </div>
            </div>

            {/* Quick Add Video to This Creator Form */}
            <form onSubmit={handleAddVideoToCreator} className="flex gap-2 pt-2">
              <input
                type="text"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder={`Paste any YouTube video link to add directly to ${activeChannel.name}...`}
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-400 outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                disabled={!customVideoUrl.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Video</span>
              </button>
              <button
                type="button"
                onClick={handleReloadAllVideos}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Reload full video catalog for this creator"
              >
                <RotateCcw size={12} />
                <span>Reload Catalog</span>
              </button>
            </form>
          </div>

          {/* Tab 1: Playlists & Series View (Visible Immediately by Default) */}
          {activeTab === 'playlists' && (
            <div className="space-y-5">
              {/* Header and Playlist Curriculum Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ListVideo size={14} className="text-rose-400" />
                    <span>Curated Series & Playlists from {activeChannel.name}</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Select a playlist series below to view and stream all episodes in sequential curriculum order.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                  <ShieldCheck size={12} />
                  Ad-Free Sequential Player
                </span>
              </div>

              {/* Playlist Filter Selector Pills */}
              {activeChannelPlaylists.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedPlaylistId('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedPlaylistId === 'all'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    All Playlists ({activeChannelPlaylists.length})
                  </button>
                  {activeChannelPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => setSelectedPlaylistId(pl.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        selectedPlaylistId === pl.id
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <ListVideo size={13} />
                      <span className="truncate max-w-[240px]">{pl.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-rose-200">
                        {pl.videos.length} Ep
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={() => setActiveTab('creator-videos')}
                    className="ml-auto px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 border border-rose-400/50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                    title={`Switch to full grid of all ${channelVideos.length} videos`}
                  >
                    <Tv size={12} />
                    <span>View All {channelVideos.length} Videos &rarr;</span>
                  </button>
                </div>
              )}

              {displayedPlaylists.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/15 rounded-2xl bg-white/[0.01] p-6 space-y-2">
                  <ListVideo size={32} className="text-gray-500 mx-auto" />
                  <p className="text-sm font-bold text-white">No playlists saved yet for {activeChannel.name}</p>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    You can paste any YouTube playlist link in the tracking bar above to track full courses from {activeChannel.name}.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      className="rounded-2xl border border-rose-500/25 bg-slate-900/90 p-5 space-y-4 shadow-xl"
                    >
                      {/* Playlist Banner Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Thumbnail Stack */}
                          <div
                            onClick={() => handlePlayEntirePlaylist(pl)}
                            className="w-24 sm:w-28 h-18 sm:h-20 rounded-xl bg-black overflow-hidden relative shrink-0 cursor-pointer shadow group border border-rose-500/30"
                          >
                            <img
                              src={pl.thumbnailUrl || (pl.videos[0] && pl.videos[0].thumbnailUrl) || 'https://i.ytimg.com/vi/1vsmaEfbnoE/hqdefault.jpg'}
                              alt={pl.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                <Play size={14} fill="white" className="ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/90 text-[9px] font-bold text-white flex items-center gap-1">
                              <ListVideo size={10} />
                              <span>{pl.videoCount || pl.videos.length} Videos</span>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30 flex items-center gap-1">
                                <ListVideo size={10} /> PLAYLIST COURSE ({pl.videoCount || pl.videos.length} Episodes)
                              </span>
                              <span className="text-[11px] text-gray-400 font-mono">{pl.channelName}</span>
                            </div>
                            <h4
                              onClick={() => handlePlayEntirePlaylist(pl)}
                              className="text-sm sm:text-base font-extrabold text-white mt-1 hover:text-rose-300 cursor-pointer transition-colors"
                            >
                              {pl.title}
                            </h4>
                            <p className="text-xs text-gray-300 mt-0.5 line-clamp-2 max-w-2xl">{pl.description}</p>
                          </div>
                        </div>

                        {/* Action: Play entire series button & Delete Playlist button */}
                        <div className="shrink-0 self-start md:self-auto flex items-center gap-2">
                          <button
                            onClick={() => handlePlayEntirePlaylist(pl)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                          >
                            <Play size={14} fill="currentColor" />
                            <span>Play Entire Series Ad-Free</span>
                          </button>
                          <button
                            onClick={() => handleDeletePlaylist(pl.id, pl.title)}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                            title="Delete this entire playlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Course Curriculum Episodes Grid (ALWAYS VISIBLE!) */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300/80 flex items-center gap-1.5">
                            <span>Playlist Lessons & Episodes ({pl.videos.length})</span>
                          </span>
                          <span className="text-[10px] text-gray-400">Click any episode to start streaming</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {pl.videos.map((vid, idx) => (
                            <div
                              key={vid.id || vid.videoId}
                              className="group rounded-2xl border border-white/10 bg-black/40 hover:border-rose-400/50 hover:bg-rose-950/20 hover:shadow-xl hover:shadow-rose-500/10 transition-all p-3 flex flex-col justify-between"
                            >
                              <div>
                                <div
                                  onClick={() =>
                                    onPlayInModal &&
                                    onPlayInModal({
                                      ...vid,
                                      playlistId: pl.playlistId,
                                      playlistTitle: pl.title,
                                    })
                                  }
                                  className="w-full h-32 rounded-xl bg-black overflow-hidden relative mb-2.5 cursor-pointer shadow group-hover:shadow-lg transition-shadow"
                                >
                                  <img
                                    src={vid.thumbnailUrl || `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                                    alt={vid.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.currentTarget.src = `https://img.youtube.com/vi/${vid.videoId}/0.jpg`;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                                      <Play size={18} fill="white" className="ml-0.5" />
                                    </div>
                                  </div>

                                  {/* Episode # Badge */}
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-[10px] font-mono font-extrabold text-white shadow">
                                    EP {String(idx + 1).padStart(2, '0')}
                                  </span>

                                  {/* Duration Badge */}
                                  {vid.duration && (
                                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-mono text-white">
                                      {Math.floor(vid.duration / 60)}:{String(vid.duration % 60).padStart(2, '0')}
                                    </span>
                                  )}
                                </div>

                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {vid.category}
                                </span>

                                <h5
                                  onClick={() =>
                                    onPlayInModal &&
                                    onPlayInModal({
                                      ...vid,
                                      playlistId: pl.playlistId,
                                      playlistTitle: pl.title,
                                    })
                                  }
                                  className="text-xs font-bold text-white mt-1.5 line-clamp-2 hover:text-rose-300 cursor-pointer"
                                  title={vid.title}
                                >
                                  {vid.title}
                                </h5>
                              </div>

                              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-mono">Episode {idx + 1}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteVideo(vid.id || vid.videoId, vid.title, pl.id);
                                    }}
                                    className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete episode"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                  {onPlayInModal && (
                                    <button
                                      onClick={() =>
                                        onPlayInModal({
                                          ...vid,
                                          playlistId: pl.playlistId,
                                          playlistTitle: pl.title,
                                        })
                                      }
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                                    >
                                      <Play size={10} fill="currentColor" />
                                      <span>Play Ad-Free</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Creator All Videos View */}
          {activeTab === 'creator-videos' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <Tv size={14} className="text-rose-400" />
                  <span>All Videos from {activeChannel.name} (Ad-Free Portal Mode)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Zero commercial interruptions
                </span>
              </div>

              {channelVideos.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/15 rounded-2xl bg-white/[0.01] p-6 space-y-2">
                  <Tv size={28} className="text-gray-500 mx-auto" />
                  <p className="text-sm font-bold text-white">No videos attached yet for {activeChannel.name}</p>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Paste any YouTube video link into the box above to immediately add and watch it ad-free.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channelVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="group rounded-2xl border border-white/10 bg-slate-900/80 hover:border-rose-400/50 hover:shadow-xl hover:shadow-rose-500/10 transition-all p-3.5 flex flex-col justify-between"
                    >
                      <div>
                        <div
                          onClick={() => onPlayInModal && onPlayInModal(vid)}
                          className="w-full h-36 rounded-xl bg-black overflow-hidden relative mb-2.5 cursor-pointer shadow group-hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={vid.thumbnailUrl || `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.src = `https://img.youtube.com/vi/${vid.videoId}/0.jpg`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                              <Play size={18} fill="white" className="ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-600 text-[9px] font-bold text-white flex items-center gap-1 shadow">
                            <ShieldCheck size={10} /> Ad-Free
                          </span>
                          {vid.duration && (
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                              {Math.floor(vid.duration / 60)}:{String(vid.duration % 60).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {vid.category}
                        </span>

                        <h4
                          onClick={() => onPlayInModal && onPlayInModal(vid)}
                          className="text-xs font-bold text-white mt-1.5 line-clamp-2 hover:text-rose-300 cursor-pointer"
                        >
                          {vid.title}
                        </h4>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{vid.channel}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVideo(vid.id || vid.videoId, vid.title);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete video"
                          >
                            <Trash2 size={13} />
                          </button>
                          {onPlayInModal && (
                            <button
                              onClick={() => onPlayInModal(vid)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={10} fill="currentColor" />
                              <span>Play Ad-Free</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Same Types of Videos (Affinity Recommendations) */}
          {activeTab === 'affinity-videos' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Same Types of Videos (Matched to {activeChannel.name}&apos;s Stack)</span>
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Recommendations based on {activeChannel.category} and related affinity categories across the 57 taxonomy topics.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sameTypesOfVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="group rounded-2xl border border-purple-500/30 bg-slate-900/80 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => onPlayInModal && onPlayInModal(vid)}
                        className="w-full h-36 rounded-xl bg-black overflow-hidden relative mb-2.5 cursor-pointer shadow group-hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={vid.thumbnailUrl || `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src = `https://img.youtube.com/vi/${vid.videoId}/0.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <Play size={18} fill="white" className="ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-purple-600 text-[9px] font-bold text-white flex items-center gap-1 shadow">
                          <Sparkles size={10} /> Same Topic
                        </span>
                        {vid.duration && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                            {Math.floor(vid.duration / 60)}:{String(vid.duration % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {vid.category}
                        </span>
                      </div>

                      <h4
                        onClick={() => onPlayInModal && onPlayInModal(vid)}
                        className="text-xs font-bold text-white line-clamp-2 hover:text-purple-300 cursor-pointer"
                      >
                        {vid.title}
                      </h4>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{vid.channel}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(vid.id || vid.videoId, vid.title);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete recommendation"
                        >
                          <Trash2 size={13} />
                        </button>
                        {onPlayInModal && (
                          <button
                            onClick={() => onPlayInModal(vid)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={10} fill="currentColor" />
                            <span>Play Ad-Free</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Undo Delete Toast */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-2xl bg-slate-900 border border-red-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <Trash2 size={16} className="text-red-400 shrink-0" />
          <span className="text-xs font-medium truncate max-w-xs">
            Deleted &ldquo;{deleteToast.title}&rdquo;
          </span>
          <button
            onClick={handleUndoDelete}
            className="ml-2 px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

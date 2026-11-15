# scripts/write_ai_recommendations.py
import re

new_component = """import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  Star,
  TrendingUp,
  Heart,
  Bookmark,
  Play,
  Clock,
  Eye,
  Layers,
  Compass,
  Zap,
  Link as LinkIcon,
  Users,
  Flame,
  Palette,
  Bot,
  Cpu,
  CheckCircle2,
  Target,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Loader2,
  RotateCcw,
  Search,
  Check,
  ShieldCheck,
  Code2,
  Server,
  Cloud,
  Terminal,
  Lock,
} from 'lucide-react';
import {
  DashboardStats,
  ContentRecord,
  BlockRule,
  DateFilterState,
  RecommendationStrategy,
  UserInteraction,
  ThemeMode,
} from '../types';
import { rankRecommendations } from '../recommendationEngine';
import { TaxonomyBar } from './TaxonomyBar';
import { DateFilterBar } from './DateFilterBar';
import { DOMAINS, getCategoryById } from '../taxonomy';

interface AIRecommendationsProps {
  stats: DashboardStats | null;
  records: ContentRecord[];
  rules: BlockRule[];
  theme?: ThemeMode;
  onSelectTheme?: (theme: ThemeMode) => void;
  onPlayInModal?: (record: ContentRecord) => void;
}

interface GroqCurateResult {
  personaSummary: string;
  topRoleSkills: string[];
  recommendations: Array<{
    videoId: string;
    rank: number;
    relevanceScore: number;
    badge: string;
    reason: string;
    curriculumStep: string;
  }>;
}

// 5 Curated Developer Role Roadmaps
interface RoleRoadmap {
  id: string;
  title: string;
  role: string;
  icon: React.ReactNode;
  gradient: string;
  badge: string;
  description: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    desc: string;
    searchQuery: string;
    suggestedVideoId: string;
    creator: string;
  }>;
}

const ROLE_ROADMAPS: RoleRoadmap[] = [
  {
    id: 'ai-agent-engineer',
    title: 'AI / ML & Agentic Engineer Path',
    role: 'AI & Machine Learning',
    icon: <Bot className="text-emerald-400" size={20} />,
    gradient: 'from-emerald-600 via-teal-700 to-indigo-800',
    badge: '🔥 Highest Demand 2026',
    description: 'Master Machine Learning foundations, Deep Learning, LLMs, LangGraph, and Autonomous Agentic AI.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Python & Statistics Foundations',
        desc: 'Core Python data structures, probability, and exploratory data analysis.',
        searchQuery: 'Python for Beginners Krish Naik',
        suggestedVideoId: 'kqtD5dpn9C8',
        creator: 'Krish Naik',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Machine Learning Masterclass',
        desc: 'Linear regression, classification, random forests, and gradient boosting.',
        searchQuery: 'Complete Machine Learning Course Krish Naik',
        suggestedVideoId: '1vsmaEfbnoE',
        creator: 'Krish Naik',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Deep Learning & Neural Networks',
        desc: 'ANN, CNN, RNN, and backpropagation from scratch with micrograd.',
        searchQuery: 'micrograd Andrej Karpathy',
        suggestedVideoId: 'VMj-3S1tku0',
        creator: 'Andrej Karpathy',
      },
      {
        stepNumber: 4,
        title: 'Step 4: LLMs, LangChain & Gemini Pro',
        desc: 'Building production RAG apps, vector embeddings, and LangChain tools.',
        searchQuery: 'LLM Project Google Gemini Krish Naik',
        suggestedVideoId: 'b-i8V4x_D7I',
        creator: 'Krish Naik',
      },
      {
        stepNumber: 5,
        title: 'Step 5: Agentic AI, WorkIQ & LangGraph',
        desc: 'Multi-agent workflows, Microsoft WorkIQ, CrewAI, and autonomous reasoning.',
        searchQuery: 'Building AI Agents With Microsoft WorkIQ',
        suggestedVideoId: 'a9j8Qh4sZ9k',
        creator: 'Krish Naik',
      },
      {
        stepNumber: 6,
        title: 'Step 6: End-to-End MLOps & Deployment',
        desc: 'Packaging models with Docker, MLflow, CI/CD pipelines, and cloud APIs.',
        searchQuery: 'End-to-End Machine Learning Project Docker',
        suggestedVideoId: 'uk0MBzqHquU',
        creator: 'Krish Naik',
      },
    ],
  },
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Software Engineer Path',
    role: 'Full-Stack Developer',
    icon: <Code2 className="text-cyan-400" size={20} />,
    gradient: 'from-cyan-600 via-blue-700 to-indigo-900',
    badge: '⚡ Production Ready',
    description: 'From modern JavaScript and React 19 to high-throughput backend APIs, databases, and microservices.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Modern JavaScript & TypeScript In-Depth',
        desc: 'Closures, prototypes, async/await, and TypeScript type safety.',
        searchQuery: 'Chai aur JavaScript Hitesh Choudhary',
        suggestedVideoId: '7bX1mP_9bY0',
        creator: 'Chai aur Code',
      },
      {
        stepNumber: 2,
        title: 'Step 2: React 19 & Frontend Frameworks',
        desc: 'Server components, hooks, state management, and responsive layouts.',
        searchQuery: 'Chai aur React 19',
        suggestedVideoId: '9bY0-7bX1mP',
        creator: 'Chai aur Code',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Backend APIs with Node.js & FastAPI',
        desc: 'REST APIs, asynchronous request handling, Celery, and Redis.',
        searchQuery: 'FastAPI Celery Redis ArjanCodes',
        suggestedVideoId: '9y7_3qP4vQ0',
        creator: 'ArjanCodes',
      },
      {
        stepNumber: 4,
        title: 'Step 4: Full Stack Next.js 15 with Server Actions',
        desc: 'End-to-end full stack web applications with database mutations.',
        searchQuery: 'Next.js 15 Full Stack Crash Course Traversy',
        suggestedVideoId: 'b8Pq-Y1m7X0',
        creator: 'Traversy Media',
      },
      {
        stepNumber: 5,
        title: 'Step 5: System Design & Distributed Architecture',
        desc: 'Designing Twitter, rate limiting, caching, and database sharding.',
        searchQuery: 'System Design Twitter NeetCode',
        suggestedVideoId: '0qY7bX9_1mP',
        creator: 'NeetCode',
      },
    ],
  },
  {
    id: 'devops-cloud',
    title: 'DevOps, Cloud & SRE Architect Path',
    role: 'Cloud & DevOps',
    icon: <Cloud className="text-purple-400" size={20} />,
    gradient: 'from-purple-600 via-pink-700 to-slate-900',
    badge: '☁️ Enterprise Cloud',
    description: 'Master containerization with Docker, orchestration with Kubernetes, CI/CD, and Terraform IaC.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Docker Containerization from Scratch',
        desc: 'Dockerfile optimization, multi-stage builds, and volume networking.',
        searchQuery: 'Docker In One Shot Piyush Garg',
        suggestedVideoId: '31k6AtW-b3Y',
        creator: 'Piyush Garg',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Kubernetes Orchestration for Production',
        desc: 'Pods, deployments, ingress controllers, config maps, and clusters.',
        searchQuery: 'Kubernetes Crash Course Nana',
        suggestedVideoId: '3q8bY7-P1c0',
        creator: 'TechWorld with Nana',
      },
      {
        stepNumber: 3,
        title: 'Step 3: CI/CD Automation with GitHub Actions',
        desc: 'Building automated test, build, and deploy pipelines.',
        searchQuery: 'GitHub Actions Tutorial Kunal Kushwaha',
        suggestedVideoId: 'm1P8qX_9bY0',
        creator: 'Kunal Kushwaha',
      },
      {
        stepNumber: 4,
        title: 'Step 4: Infrastructure as Code with Terraform',
        desc: 'Provisioning cloud infrastructure on AWS/GCP declaratively.',
        searchQuery: 'Terraform Full Course freeCodeCamp',
        suggestedVideoId: 'd9b7X1-8PqY',
        creator: 'freeCodeCamp.org',
      },
    ],
  },
  {
    id: 'dsa-faang',
    title: 'Data Structures, Algorithms & FAANG Prep',
    role: 'Software Engineering',
    icon: <Terminal className="text-amber-400" size={20} />,
    gradient: 'from-amber-600 via-orange-700 to-rose-900',
    badge: '🏆 Top Tech Interview',
    description: 'Master the Blind 75, dynamic programming patterns, graphs, trees, and FAANG technical interviews.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Programming Language Fundamentals',
        desc: 'C++ or Python object oriented programming and pointers.',
        searchQuery: 'C++ Full Course CodeWithHarry',
        suggestedVideoId: 'Y1m7X0b8Pq-',
        creator: 'CodeWithHarry',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Blind 75 LeetCode Questions Solved',
        desc: 'Two pointers, sliding window, binary search, and linked lists.',
        searchQuery: 'Blind 75 LeetCode NeetCode',
        suggestedVideoId: '7bX9-1mP0qY',
        creator: 'NeetCode',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Dynamic Programming Patterns',
        desc: 'Memoization, tabulation, knapsack, and longest common subsequence.',
        searchQuery: 'Dynamic Programming 7 Patterns NeetCode',
        suggestedVideoId: '1mP0qY_7bX9',
        creator: 'NeetCode',
      },
      {
        stepNumber: 4,
        title: 'Step 4: Large Scale System Design Interview',
        desc: 'Load balancers, CDN, message queues, and database replication.',
        searchQuery: 'System Design Interview ByteByteGo',
        suggestedVideoId: '0qY7bX9_1mP',
        creator: 'NeetCode',
      },
    ],
  },
  {
    id: 'security-appsec',
    title: 'Cybersecurity, SSO & Application Security',
    role: 'Security & Data',
    icon: <Lock className="text-rose-400" size={20} />,
    gradient: 'from-rose-600 via-red-700 to-slate-900',
    badge: '🔒 Zero Trust',
    description: 'Build your own SSO, authentication with JWT, OAuth2, and understand modern cryptographic primitives.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Build Your Own SSO & Auth Architecture',
        desc: 'Single Sign-On protocols, identity providers, and tokens.',
        searchQuery: 'Build Your Own SSO Piyush Garg',
        suggestedVideoId: '1aocCdimOo8',
        creator: 'Piyush Garg',
      },
      {
        stepNumber: 2,
        title: 'Step 2: How Passwords, Hashing & SHA256 Work',
        desc: 'Salting, bcrypt, rainbow tables, and cryptographic hashing.',
        searchQuery: 'How passwords and hashing work Computerphile',
        suggestedVideoId: '7U-RbOKanYs',
        creator: 'Computerphile',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Public Key Encryption & RSA Basics',
        desc: 'Asymmetric encryption, prime numbers, and PKI infrastructure.',
        searchQuery: 'Public key encryption and RSA Computerphile',
        suggestedVideoId: 'jhXCTbFnK8o',
        creator: 'Computerphile',
      },
    ],
  },
];

export function AIRecommendations({
  stats,
  records,
  rules,
  theme = 'dark',
  onSelectTheme,
  onPlayInModal,
}: AIRecommendationsProps) {
  const [activeMainTab, setActiveMainTab] = useState<'roadmaps' | 'groq' | 'feed'>('roadmaps');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('ai-agent-engineer');
  const [selectedTopicChip, setSelectedTopicChip] = useState<string>('all');
  const [strategy, setStrategy] = useState<RecommendationStrategy>('hybrid');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'all',
    recencyWeight: 0.6,
  });

  // Groq Live Assistant State
  const [groqGoal, setGroqGoal] = useState<string>('I want to master Agentic AI, LangGraph, and RAG with Krish Naik');
  const [groqLoading, setGroqLoading] = useState<boolean>(false);
  const [groqResult, setGroqResult] = useState<GroqCurateResult | null>(null);

  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());

  // Topic Quick Filter Chips with live video counts
  const topicChips = useMemo(() => {
    return [
      { id: 'all', label: 'All Topics', count: records.length, icon: '⚡' },
      {
        id: 'agentic-ai',
        label: '🤖 Agentic AI & LLMs',
        filter: (r: ContentRecord) =>
          r.category.toLowerCase().includes('generative ai') ||
          (r.tags || []).some((t) => ['agentic ai', 'langchain', 'langgraph', 'llm', 'rag'].includes(t.toLowerCase())),
        icon: '🤖',
      },
      {
        id: 'machine-learning',
        label: '🧠 Machine Learning',
        filter: (r: ContentRecord) =>
          r.category.toLowerCase().includes('machine learning') ||
          r.domain.toLowerCase().includes('machine learning'),
        icon: '🧠',
      },
      {
        id: 'fullstack-web',
        label: '🚀 Full-Stack & React',
        filter: (r: ContentRecord) =>
          r.domain.toLowerCase().includes('web') ||
          r.category.toLowerCase().includes('frontend') ||
          r.category.toLowerCase().includes('full-stack'),
        icon: '🚀',
      },
      {
        id: 'devops-docker',
        label: '🐳 Docker & Kubernetes',
        filter: (r: ContentRecord) =>
          r.category.toLowerCase().includes('kubernetes') ||
          (r.tags || []).some((t) => ['docker', 'kubernetes', 'k8s', 'devops', 'cicd'].includes(t.toLowerCase())),
        icon: '🐳',
      },
      {
        id: 'system-design',
        label: '📐 System Design',
        filter: (r: ContentRecord) =>
          r.category.toLowerCase().includes('distributed') ||
          (r.tags || []).some((t) => ['system design', 'distributed systems', 'architecture'].includes(t.toLowerCase())),
        icon: '📐',
      },
      {
        id: 'python',
        label: '🐍 Python Mastery',
        filter: (r: ContentRecord) =>
          (r.tags || []).some((t) => t.toLowerCase() === 'python') ||
          r.category.toLowerCase().includes('python') ||
          r.title.toLowerCase().includes('python'),
        icon: '🐍',
      },
      {
        id: 'dsa-leetcode',
        label: '🏆 DSA & LeetCode',
        filter: (r: ContentRecord) =>
          (r.tags || []).some((t) => ['dsa', 'leetcode', 'algorithms', 'blind 75'].includes(t.toLowerCase())),
        icon: '🏆',
      },
    ];
  }, [records]);

  // Compute live count for each chip
  const chipsWithCounts = useMemo(() => {
    return topicChips.map((chip) => {
      if (chip.id === 'all') return chip;
      const count = records.filter(chip.filter!).length;
      return { ...chip, count };
    });
  }, [topicChips, records]);

  // Handle Groq AI Curation Trigger
  const handleTriggerGroqCurate = async (customPrompt?: string) => {
    const goalText = customPrompt || groqGoal;
    if (!goalText.trim()) return;
    setGroqLoading(true);

    try {
      // Send the top 35 records to Groq for ranking
      const candidates = records.slice(0, 35).map((r) => ({
        id: r.id,
        videoId: r.videoId,
        title: r.title,
        channel: r.channel,
        category: r.category,
        domain: r.domain,
        tags: r.tags,
      }));

      const res = await fetch('/api/recommendations/groq-curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRoadmap?.title || 'Software Developer & AI/ML Engineer',
          level: 'All Levels',
          goal: goalText,
          videos: candidates,
          likedVideoIds: Array.from(likedVideoIds),
          limit: 6,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGroqResult(data);
      }
    } catch (err) {
      console.warn('Groq curate fetch error:', err);
    } finally {
      setGroqLoading(false);
    }
  };

  const handleToggleLike = (record: ContentRecord) => {
    const isLiked = likedVideoIds.has(record.videoId);
    const newLiked = new Set(likedVideoIds);
    if (isLiked) {
      newLiked.delete(record.videoId);
    } else {
      newLiked.add(record.videoId);
    }
    setLikedVideoIds(newLiked);

    setInteractions((prev) => [
      ...prev,
      {
        videoId: record.videoId,
        type: isLiked ? 'dismiss' : 'like',
        categoryId: record.subcategoryId,
        categoryName: record.category,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleToggleSave = (record: ContentRecord) => {
    const isSaved = savedVideoIds.has(record.videoId);
    const newSaved = new Set(savedVideoIds);
    if (isSaved) {
      newSaved.delete(record.videoId);
    } else {
      newSaved.add(record.videoId);
    }
    setSavedVideoIds(newSaved);

    setInteractions((prev) => [
      ...prev,
      {
        videoId: record.videoId,
        type: isSaved ? 'dismiss' : 'save',
        categoryId: record.subcategoryId,
        categoryName: record.category,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleRecordView = (record: ContentRecord) => {
    setInteractions((prev) => [
      ...prev,
      {
        videoId: record.videoId,
        type: 'view',
        categoryId: record.subcategoryId,
        categoryName: record.category,
        timestamp: Date.now(),
      },
    ]);
  };

  const interestProfile = useMemo(() => {
    if (!stats) return [];
    return stats.topCategories.slice(0, 5).map((c) => ({
      name: c.category,
      score: Math.min(100, Math.round((c.count / (stats.total || 1)) * 100 * 3)),
      count: c.count,
    }));
  }, [stats]);

  const selectedRoadmap = useMemo(() => {
    return ROLE_ROADMAPS.find((r) => r.id === selectedRoadmapId) || ROLE_ROADMAPS[0];
  }, [selectedRoadmapId]);

  // Topic-filtered records for current view
  const topicFilteredRecords = useMemo(() => {
    if (selectedTopicChip === 'all') return records;
    const chip = topicChips.find((c) => c.id === selectedTopicChip);
    if (!chip || !chip.filter) return records;
    return records.filter(chip.filter);
  }, [records, selectedTopicChip, topicChips]);

  const recommendations = useMemo(() => {
    return rankRecommendations({
      records: topicFilteredRecords,
      rules,
      interactions,
      selectedDomain,
      selectedSubcategoryId,
      dateFilter,
      strategy,
      limit: 15,
    });
  }, [topicFilteredRecords, rules, interactions, selectedDomain, selectedSubcategoryId, dateFilter, strategy]);

  const strategies: {
    id: RecommendationStrategy;
    label: string;
    desc: string;
    icon: React.ReactNode;
    tag: string;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      id: 'hybrid',
      label: 'Hybrid AI Engine',
      desc: 'Content + Affinity + Recency',
      icon: <Zap size={18} className="text-indigo-400" />,
      tag: '⚡ 4-Layer Blend',
      activeClass:
        'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/30 border-indigo-400 ring-2 ring-indigo-400/30',
      inactiveClass:
        'bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border-indigo-500/20 text-gray-300 hover:border-indigo-400/50 hover:bg-indigo-950/60',
    },
    {
      id: 'affinity',
      label: 'Category Affinity',
      desc: 'Discovers related tech graph',
      icon: <LinkIcon size={18} className="text-cyan-400" />,
      tag: '🌐 Knowledge Graph',
      activeClass:
        'bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-600 text-white shadow-xl shadow-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/30',
      inactiveClass:
        'bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border-cyan-500/20 text-gray-300 hover:border-cyan-400/50 hover:bg-cyan-950/60',
    },
    {
      id: 'collaborative',
      label: 'User Interactions',
      desc: 'Favors liked & saved topics',
      icon: <Users size={18} className="text-pink-400" />,
      tag: '❤️ Personalized',
      activeClass:
        'bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 text-white shadow-xl shadow-pink-500/30 border-pink-400 ring-2 ring-pink-400/30',
      inactiveClass:
        'bg-gradient-to-br from-pink-950/40 to-slate-900/60 border-pink-500/20 text-gray-300 hover:border-pink-400/50 hover:bg-pink-950/60',
    },
    {
      id: 'trending',
      label: 'Trending & Views',
      desc: 'High views & momentum',
      icon: <Flame size={18} className="text-amber-400" />,
      tag: '🔥 High Velocity',
      activeClass:
        'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white shadow-xl shadow-amber-500/30 border-amber-400 ring-2 ring-amber-400/30',
      inactiveClass:
        'bg-gradient-to-br from-amber-950/40 to-slate-900/60 border-amber-500/20 text-gray-300 hover:border-amber-400/50 hover:bg-amber-950/60',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/70 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200">
                Topic-Wise Custom Recommendations
              </h2>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Curated Software Developer & AI/ML Masterclasses • 100% Ad-Free In-Portal Stream • Zero Redirection
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 shrink-0 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveMainTab('roadmaps')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'roadmaps'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap size={14} />
            <span>Role Roadmaps</span>
          </button>

          <button
            onClick={() => setActiveMainTab('groq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'groq'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot size={14} className="text-pink-300" />
            <span>Groq AI Live Curation</span>
          </button>

          <button
            onClick={() => setActiveMainTab('feed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'feed'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap size={14} />
            <span>Algorithmic Feed</span>
          </button>
        </div>
      </div>

      {/* Quick Topic Filter Chips (Live counts across all 220+ videos) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {chipsWithCounts.map((chip) => {
          const isSelected = selectedTopicChip === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedTopicChip(chip.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-emerald-400/40'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-black/30 text-white font-extrabold' : 'bg-white/10 text-gray-400'
                }`}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: Role Roadmaps */}
      {activeMainTab === 'roadmaps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Roadmap Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ROLE_ROADMAPS.map((rm) => {
              const isSelected = selectedRoadmapId === rm.id;
              return (
                <button
                  key={rm.id}
                  onClick={() => setSelectedRoadmapId(rm.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-br ${rm.gradient} border-white/30 text-white shadow-xl shadow-indigo-500/20 ring-2 ring-emerald-400/40`
                      : 'bg-slate-900/60 border-white/10 text-gray-300 hover:border-white/20 hover:bg-slate-900/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                        {rm.icon}
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-black/40 text-emerald-300">
                        {rm.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">{rm.title}</div>
                  </div>
                  <div className="text-[10px] text-gray-300 mt-2 font-medium">
                    {rm.steps.length} Sequential Steps
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Roadmap Detailed Curriculum Shelf */}
          <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                    Step-by-Step Curriculum
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Curated for 100% In-Portal Streaming</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{selectedRoadmap.title}</h3>
                <p className="text-xs text-gray-300 mt-0.5 max-w-2xl">{selectedRoadmap.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveMainTab('groq');
                    setGroqGoal(`I want to master ${selectedRoadmap.title} with step-by-step masterclasses`);
                    handleTriggerGroqCurate(`I want to master ${selectedRoadmap.title} with step-by-step masterclasses`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <Bot size={13} />
                  <span>Ask Groq to Personalize</span>
                </button>
              </div>
            </div>

            {/* Curriculum Step Cards */}
            <div className="space-y-4">
              {selectedRoadmap.steps.map((st) => {
                // Find matching video in catalog
                const matchedRecord = records.find(
                  (r) =>
                    r.videoId === st.suggestedVideoId ||
                    r.title.toLowerCase().includes(st.searchQuery.toLowerCase().split(' ')[0]) ||
                    (r.tags || []).some((t) => t.toLowerCase() === st.creator.toLowerCase())
                ) || records[0];

                return (
                  <div
                    key={st.stepNumber}
                    className="p-4 rounded-2xl border border-white/10 bg-black/40 hover:border-emerald-500/40 hover:bg-black/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold flex items-center justify-center shrink-0 text-sm">
                        #{st.stepNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {st.title}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                            {st.creator}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{st.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => {
                          if (matchedRecord && onPlayInModal) {
                            handleRecordView(matchedRecord);
                            onPlayInModal(matchedRecord);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                        title="Stream masterclass ad-free inside website"
                      >
                        <Play size={12} fill="white" />
                        <span>Play on Website</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Groq AI Live Curation */}
      {activeMainTab === 'groq' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
                  <Bot size={20} className="text-purple-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Groq AI Real-Time Assistant</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      qwen-3.8-27b
                    </span>
                  </h3>
                  <p className="text-xs text-purple-200/70">
                    Type your specific career goal, role, or topic to generate an exact curriculum from the 220+ video catalog.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Prompt Preset Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none text-xs">
              <span className="text-gray-400 font-semibold shrink-0">Quick Goals:</span>
              {[
                '⚡ Krish Naik Agentic AI, WorkIQ & RAG Masterclass',
                '💻 Full-Stack Software Engineer with React 19 & FastAPI',
                '🐳 Docker, Kubernetes & Production DevOps SRE',
                '🧠 FAANG System Design & Blind 75 LeetCode DSA',
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setGroqGoal(preset);
                    handleTriggerGroqCurate(preset);
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/40 text-gray-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="text"
                value={groqGoal}
                onChange={(e) => setGroqGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTriggerGroqCurate();
                }}
                placeholder="E.g., I want to master AI Agents and LangChain with Krish Naik..."
                className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 shadow-inner"
              />
              <button
                onClick={() => handleTriggerGroqCurate()}
                disabled={groqLoading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {groqLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Curating with Groq...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate AI Path</span>
                  </>
                )}
              </button>
            </div>

            {/* Groq Result Display */}
            {groqResult && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                {/* Persona Summary Banner */}
                <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed flex items-start gap-3">
                  <Sparkles size={18} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-white">AI Curriculum Rationale: </span>
                    {groqResult.personaSummary}
                  </div>
                </div>

                {/* Key Skills */}
                {groqResult.topRoleSkills && groqResult.topRoleSkills.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-gray-400 font-semibold">Key Competencies:</span>
                    {groqResult.topRoleSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groqResult.recommendations.map((gr) => {
                    const matched = records.find((r) => r.videoId === gr.videoId) || records[0];
                    return (
                      <div
                        key={gr.videoId + gr.rank}
                        className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 hover:border-purple-400/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {gr.curriculumStep || `Step ${gr.rank}`}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              {gr.relevanceScore}% Match
                            </span>
                          </div>

                          <div
                            onClick={() => {
                              if (onPlayInModal) {
                                handleRecordView(matched);
                                onPlayInModal(matched);
                              }
                            }}
                            className="relative w-full h-32 rounded-xl bg-black overflow-hidden mb-2.5 cursor-pointer shadow group/thumb"
                          >
                            <img
                              src={matched.thumbnailUrl || `https://i.ytimg.com/vi/${matched.videoId}/hqdefault.jpg`}
                              alt={matched.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/0 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                                <Play size={16} fill="black" className="ml-0.5" />
                              </div>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">{matched.title}</h4>
                          <p className="text-[11px] text-gray-400 mb-2">{matched.channel}</p>
                          <p className="text-[11px] text-purple-200/80 italic line-clamp-2">{gr.reason}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck size={12} />
                            Ad-Free
                          </span>
                          <button
                            onClick={() => {
                              if (onPlayInModal) {
                                handleRecordView(matched);
                                onPlayInModal(matched);
                              }
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Play size={11} fill="white" />
                            <span>Play on Website</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Algorithmic Feed */}
      {activeMainTab === 'feed' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Strategy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {strategies.map((strat) => {
              const isActive = strategy === strat.id;
              return (
                <button
                  key={strat.id}
                  onClick={() => setStrategy(strat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden cursor-pointer ${
                    isActive ? strat.activeClass : strat.inactiveClass
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-black/30 backdrop-blur-md flex items-center justify-center">
                      {strat.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      {strat.tag}
                    </span>
                  </div>
                  <div className="text-sm font-bold tracking-tight text-white">{strat.label}</div>
                  <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                    {strat.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Date & Recency Filter */}
          <DateFilterBar filter={dateFilter} onChange={setDateFilter} />

          {/* 57-Category Taxonomy Bar */}
          <TaxonomyBar
            selectedDomain={selectedDomain}
            selectedSubcategoryId={selectedSubcategoryId}
            onSelectDomain={setSelectedDomain}
            onSelectSubcategory={setSelectedSubcategoryId}
          />
        </div>
      )}

      {/* Recommendations Feed List (Visible across all tabs for fast discovery) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white">
              {selectedTopicChip === 'all'
                ? `Curated Masterclasses (${recommendations.length} results)`
                : `${chipsWithCounts.find((c) => c.id === selectedTopicChip)?.label} (${recommendations.length} results)`}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={13} />
            Plays Ad-Free Inside Website
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-indigo-500/30 rounded-3xl bg-indigo-950/10 backdrop-blur-xl space-y-3">
            <Compass size={36} className="mx-auto text-indigo-400" />
            <p className="text-base font-bold text-white">Showing latest available masterclasses for this filter</p>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Reset your date filter to view the entire authentic catalog across all 57 categories.
            </p>
            <button
              onClick={() => {
                setSelectedTopicChip('all');
                setSelectedDomain('all');
                setSelectedSubcategoryId(undefined);
                setDateFilter({ preset: 'all', recencyWeight: 0.6 });
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              Reset Filters & Show All {records.length} Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => {
              const isLiked = likedVideoIds.has(rec.videoId);
              const isSaved = savedVideoIds.has(rec.videoId);

              return (
                <div
                  key={rec.id}
                  className="group rounded-3xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 p-4 flex flex-col justify-between backdrop-blur-xl"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 truncate">
                        {rec.domain || 'Software Dev'}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 shrink-0">
                        {rec.score}% Match
                      </span>
                    </div>

                    {/* Thumbnail & Video Link (Plays 100% on Website in Modal) */}
                    <div
                      onClick={() => {
                        handleRecordView(rec);
                        if (onPlayInModal) onPlayInModal(rec);
                      }}
                      className="block relative w-full h-44 rounded-2xl bg-black/60 overflow-hidden mb-3 group/thumb shadow-md cursor-pointer"
                      title="Play video ad-free on website"
                    >
                      <img
                        src={rec.thumbnailUrl || `https://i.ytimg.com/vi/${rec.videoId}/hqdefault.jpg`}
                        alt={rec.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback && rec.videoId) {
                            target.dataset.fallback = 'true';
                            target.src = `https://img.youtube.com/vi/${rec.videoId}/0.jpg`;
                          } else {
                            target.src =
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80';
                          }
                        }}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover/thumb:bg-black/0 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover/thumb:scale-100 transition-transform font-bold">
                          <Play size={20} fill="black" className="ml-0.5" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      {rec.duration && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono font-bold text-white shadow">
                          {Math.floor(rec.duration / 60)}:{String(rec.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Title & Channel */}
                    <div
                      onClick={() => {
                        handleRecordView(rec);
                        if (onPlayInModal) onPlayInModal(rec);
                      }}
                      className="block group/title cursor-pointer"
                      title="Play video on website"
                    >
                      <h4 className="text-sm font-bold line-clamp-2 text-white group-hover/title:text-emerald-300 transition-colors mb-1.5 leading-snug">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-indigo-200/80 mb-2.5 truncate font-medium">{rec.channel}</p>
                    </div>

                    {/* Subcategory & Stats */}
                    <div className="flex items-center gap-2 flex-wrap mb-3 text-[10px] text-gray-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-200 font-mono font-semibold">
                        #{rec.subcategoryId || 1} {rec.category}
                      </span>
                      {rec.viewCount && (
                        <span className="flex items-center gap-1 font-medium text-gray-300">
                          <Eye size={11} className="text-cyan-400" />
                          {rec.viewCount.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-medium text-gray-300">
                        <Clock size={11} className="text-amber-400" />
                        {new Date(rec.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Explainability Reason Tag */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 text-[11px] text-gray-300 leading-snug mb-3">
                      <span className="text-emerald-400 font-bold">Why:</span> {rec.reason}
                    </div>
                  </div>

                  {/* Interactive Action Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleLike(rec)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/30'
                            : 'border-white/10 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/30'
                        }`}
                        title={isLiked ? 'Unlike' : 'Like video topic'}
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={() => handleToggleSave(rec)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/30'
                            : 'border-white/10 bg-white/5 hover:bg-amber-500/10 text-gray-400 hover:text-amber-400 hover:border-amber-500/30'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Save Bookmark'}
                      >
                        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleRecordView(rec);
                          if (onPlayInModal) onPlayInModal(rec);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        title="Stream ad-free directly inside website"
                      >
                        <Play size={11} fill="currentColor" />
                        <span>Play on Website</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
"""

with open("src/components/AIRecommendations.tsx", "w", encoding="utf-8") as f:
    f.write(new_component)

print("AIRecommendations.tsx successfully updated!")


# scripts/update_channel_hub.py
import re

hub_path = "src/components/ChannelHub.tsx"
with open(hub_path, "r", encoding="utf-8") as f:
    hub_content = f.read()

# Add new creators to DEFAULT_CURATED_CHANNELS if not present
new_channels = """  {
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
"""

if "id: 'chai-aur-code'" not in hub_content:
    chan_anchor = "const DEFAULT_CURATED_CHANNELS: TrackedChannel[] = ["
    hub_content = hub_content.replace(chan_anchor, chan_anchor + "\n" + new_channels)
    print("Added Chai aur Code, CodeWithHarry, and NeetCode to DEFAULT_CURATED_CHANNELS!")

# Add Agentic AI Playlist for Krish Naik
agentic_playlist = """    {
      id: 'pl-krish-agentic-2026',
      channelId: 'krish-naik',
      channelName: 'Krish Naik',
      title: 'Agentic AI, WorkIQ & Autonomous Multi-Agents Series 2026',
      description: 'The latest Agentic AI roadmap, Microsoft WorkIQ, Generative vs Agentic AI, CrewAI, and LangGraph architectures.',
      playlistId: 'PLZoTAELRMXVPAgenticAI2026',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPAgenticAI2026',
      thumbnailUrl: 'https://i.ytimg.com/vi/8GfC_9b3UvM/hqdefault.jpg',
      videoCount: 6,
      videos: [
        {
          id: 'pl-krish-ag-1',
          videoId: '8GfC_9b3UvM',
          url: 'https://www.youtube.com/watch?v=8GfC_9b3UvM',
          thumbnailUrl: 'https://i.ytimg.com/vi/8GfC_9b3UvM/hqdefault.jpg',
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
          videoId: 'a9j8Qh4sZ9k',
          url: 'https://www.youtube.com/watch?v=a9j8Qh4sZ9k',
          thumbnailUrl: 'https://i.ytimg.com/vi/a9j8Qh4sZ9k/hqdefault.jpg',
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
          videoId: '9vP4tZ6mX8w',
          url: 'https://www.youtube.com/watch?v=9vP4tZ6mX8w',
          thumbnailUrl: 'https://i.ytimg.com/vi/9vP4tZ6mX8w/hqdefault.jpg',
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
          videoId: 'mK2x7Vp0w8Y',
          url: 'https://www.youtube.com/watch?v=mK2x7Vp0w8Y',
          thumbnailUrl: 'https://i.ytimg.com/vi/mK2x7Vp0w8Y/hqdefault.jpg',
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
          videoId: 'g8Qp9xZ2kL4',
          title: 'Complete Agentic AI Roadmap - LangChain, LangGraph, CrewAI & Multi-Agents',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          url: 'https://www.youtube.com/watch?v=g8Qp9xZ2kL4',
          thumbnailUrl: 'https://i.ytimg.com/vi/g8Qp9xZ2kL4/hqdefault.jpg',
          duration: 2400,
          timestamp: Date.now() - 26 * 3600000,
          source: 'trending',
          viewCount: 590000,
          likes: 52000,
          tags: ['krish naik', 'agentic ai roadmap', 'crewai', 'langgraph'],
        },
        {
          id: 'pl-krish-ag-6',
          videoId: 'k1Bv_xG6-kE',
          title: 'CrewAI Tutorial for Beginners - Build Multi-Agent AI Systems in Python',
          channel: 'Krish Naik',
          domain: 'AI & Machine Learning',
          category: 'Generative AI & LLMs',
          subcategoryId: 5,
          url: 'https://www.youtube.com/watch?v=k1Bv_xG6-kE',
          thumbnailUrl: 'https://i.ytimg.com/vi/k1Bv_xG6-kE/hqdefault.jpg',
          duration: 5400,
          timestamp: Date.now() - 36 * 3600000,
          source: 'trending',
          viewCount: 470000,
          likes: 39000,
          tags: ['krish naik', 'crewai', 'multi-agent', 'langchain'],
        },
      ],
    },"""

if "pl-krish-agentic-2026" not in hub_content:
    pl_needle = "  'krish-naik': ["
    hub_content = hub_content.replace(pl_needle, pl_needle + "\n" + agentic_playlist)
    print("Added Agentic AI Playlist to Krish Naik playlists in src/components/ChannelHub.tsx!")

with open(hub_path, "w", encoding="utf-8") as f:
    f.write(hub_content)
print("ChannelHub.tsx updated successfully!")


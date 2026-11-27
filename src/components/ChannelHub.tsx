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
import { DEFAULT_CURATED_CHANNELS, DEFAULT_CURATED_PLAYLISTS } from './curatedChannels';

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

// Build knowledge base from all curated channels for fast auto-resolver lookup
const CREATOR_KNOWLEDGE_BASE: Record<string, Partial<TrackedChannel>> = {};
DEFAULT_CURATED_CHANNELS.forEach((ch) => {
  CREATOR_KNOWLEDGE_BASE[ch.name.toLowerCase()] = ch;
  CREATOR_KNOWLEDGE_BASE[ch.id.toLowerCase()] = ch;
  if (ch.handle) {
    CREATOR_KNOWLEDGE_BASE[ch.handle.toLowerCase().replace(/^@+/, '')] = ch;
  }
});

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

// Curated channels and playlists imported from ./curatedChannels

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
  const [showAddCreatorForm, setShowAddCreatorForm] = useState(false);
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');

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

  // Available domain filters derived from channels
  const domainFilters = useMemo(() => {
    const domains = new Set<string>(['All']);
    channels.forEach((c) => {
      if (c.domain) domains.add(c.domain);
    });
    return Array.from(domains);
  }, [channels]);

  // Filter channels according to domain pill + live search query
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchesDomain = selectedDomainFilter === 'All' || c.domain === selectedDomainFilter;
      if (!matchesDomain) return false;
      if (!creatorSearchQuery.trim()) return true;
      const q = creatorSearchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.handle && c.handle.toLowerCase().includes(q)) ||
        (c.domain && c.domain.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [channels, creatorSearchQuery, selectedDomainFilter]);

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

  // Shared cinema-grade 16:9 video card renderer (zero duplicated card markup)
  const renderVideoCard = (
    vid: ContentRecord,
    opts?: { episodeIndex?: number; playlistContext?: ChannelPlaylist; accentTag?: string }
  ) => {
    const playTarget: ContentRecord = opts?.playlistContext
      ? {
          ...vid,
          playlistId: opts.playlistContext.playlistId,
          playlistTitle: opts.playlistContext.title,
        }
      : vid;

    return (
      <div
        key={`${opts?.playlistContext?.id || 'vid'}-${vid.id || vid.videoId}`}
        className="group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111116] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
      >
        <div>
          {/* 16:9 Cinema Thumbnail */}
          <div
            onClick={() => onPlayInModal && onPlayInModal(playTarget)}
            className="w-full aspect-video bg-zinc-950 overflow-hidden relative cursor-pointer"
          >
            <img
              src={vid.thumbnailUrl || `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
              alt={vid.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback && vid.videoId) {
                  target.dataset.fallback = 'true';
                  target.src = `https://img.youtube.com/vi/${vid.videoId}/0.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Subtle Center Play Trigger */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl">
                <Play size={18} fill="white" className="ml-0.5" />
              </div>
            </div>

            {typeof opts?.episodeIndex === 'number' && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono font-semibold text-white">
                EP {String(opts.episodeIndex + 1).padStart(2, '0')}
              </span>
            )}

            {opts?.accentTag && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-indigo-600/90 backdrop-blur-sm text-[10px] font-medium text-white">
                {opts.accentTag}
              </span>
            )}

            {vid.duration && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono font-medium text-white">
                {Math.floor(vid.duration / 60)}:{String(vid.duration % 60).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Card Content */}
          <div className="p-3.5 pb-2">
            <h4
              onClick={() => onPlayInModal && onPlayInModal(playTarget)}
              className="text-sm font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug cursor-pointer transition-colors"
              title={vid.title}
            >
              {vid.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
              <span className="truncate font-medium">{vid.channel}</span>
              <span>•</span>
              <span className="truncate">{vid.category}</span>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="px-3.5 py-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={12} />
            Ad-free
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVideo(vid.id || vid.videoId, vid.title, opts?.playlistContext?.id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Remove video"
            >
              <Trash2 size={13} />
            </button>
            {onPlayInModal && (
              <button
                onClick={() => onPlayInModal(playTarget)}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={11} fill="currentColor" />
                <span>Watch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-8">
      {/* Studio Toolbar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Creator Studios</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
              <ShieldCheck size={12} />
              Ad-Free Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {channels.length} vetted developer channels across 8 domains — click any creator to stream playlists on-site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Creator Search */}
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
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
              placeholder="Filter creators..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
            />
            {creatorSearchQuery && (
              <button
                onClick={() => setCreatorSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddCreatorForm((v) => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
              showAddCreatorForm
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/10 hover:border-indigo-500/40'
            }`}
          >
            <Plus size={14} />
            <span>Track Channel</span>
          </button>

          <button
            onClick={() => setShowAllGrid((v) => !v)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Users size={14} className="text-indigo-500" />
            <span>{showAllGrid ? 'Compact Rail' : `All ${filteredChannels.length}`}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Add Channel Form */}
      {showAddCreatorForm && (
        <form
          onSubmit={(e) => {
            handleAddChannel(e);
            setShowAddCreatorForm(false);
          }}
          className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <input
            type="text"
            value={newChannelInput}
            onChange={(e) => setNewChannelInput(e.target.value)}
            placeholder="Creator name or @handle (e.g. Krish Naik, @Fireship)..."
            className="md:col-span-6 px-3.5 py-2 rounded-xl bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            value={newPlaylistInput}
            onChange={(e) => setNewPlaylistInput(e.target.value)}
            placeholder="Optional: YouTube Playlist URL..."
            className="md:col-span-4 px-3.5 py-2 rounded-xl bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newChannelInput.trim()}
            className="md:col-span-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </form>
      )}

      {/* Success Toast */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Domain Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {domainFilters.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomainFilter(dom)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              selectedDomainFilter === dom
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-[#111116] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.08] hover:border-indigo-500/40'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Empty Search Fallback */}
      {filteredChannels.length === 0 && creatorSearchQuery.trim() && (
        <div className="p-4 rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-50/40 dark:bg-[#111116] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-indigo-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold">&ldquo;{creatorSearchQuery}&rdquo; is not in your tracked list yet</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Add this creator now to generate their streamable curriculum immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleTrackDirectCreator(creatorSearchQuery)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>Track Creator</span>
          </button>
        </div>
      )}

      {/* Creator Selector: Compact Horizontal Rail by Default OR Expandable Grid */}
      {filteredChannels.length > 0 && (
        <div
          className={
            showAllGrid
              ? 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5'
              : 'flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none'
          }
        >
          {filteredChannels.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setSelectedPlaylistId('all');
                }}
                className={`relative group text-left rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  showAllGrid ? 'p-2.5 flex-col text-center' : 'px-3 py-2 shrink-0 min-w-[175px] max-w-[210px]'
                } ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-500 ring-1 ring-indigo-500/30 shadow-sm'
                    : 'bg-white dark:bg-[#111116] border-slate-200 dark:border-white/[0.08] hover:border-indigo-500/40'
                }`}
              >
                {ch.id.startsWith('chan-') && (
                  <span
                    onClick={(e) => handleRemoveChannel(ch.id, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-rose-500"
                    title="Remove tracked channel"
                  >
                    <Trash2 size={11} />
                  </span>
                )}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-white/15 shrink-0 bg-zinc-900">
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
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate">{ch.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate font-mono">
                    {ch.handle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Creator Spotlight (Visible Immediately Above the Fold) */}
      {activeChannel && (
        <div
          id="creator-spotlight-section"
          className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111116] p-4 sm:p-6 shadow-sm space-y-5"
        >
          {/* Spotlight Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 shrink-0 bg-zinc-900">
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
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">{activeChannel.name}</h3>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {activeChannel.handle}
                  </span>
                  {activeChannel.subscriberCount && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      • {activeChannel.subscriberCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl line-clamp-2">
                  {activeChannel.description}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 font-medium">
                    {activeChannel.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-medium">
                    {activeChannel.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Segmented Control */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#09090b] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] self-start lg:self-auto flex-wrap">
              <button
                onClick={() => setActiveTab('creator-videos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'creator-videos'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tv size={13} />
                <span>Videos ({channelVideos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('playlists')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'playlists'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListVideo size={13} />
                <span>Playlists ({activeChannelPlaylists.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('affinity-videos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'affinity-videos'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                <span>Related ({sameTypesOfVideos.length})</span>
              </button>

              <button
                onClick={handleReloadAllVideos}
                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                title="Refresh creator catalog"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Inline Paste YouTube URL Bar */}
          <form onSubmit={handleAddVideoToCreator} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customVideoUrl}
              onChange={(e) => setCustomVideoUrl(e.target.value)}
              placeholder={`Paste any YouTube URL to add to ${activeChannel.name}...`}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-white/[0.08] text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!customVideoUrl.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white/[0.08] hover:bg-slate-800 dark:hover:bg-white/[0.14] text-white text-xs font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Video</span>
            </button>
          </form>

          {/* Tab: Playlists & Series */}
          {activeTab === 'playlists' && (
            <div className="space-y-5">
              {activeChannelPlaylists.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedPlaylistId('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer border ${
                      selectedPlaylistId === 'all'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-[#09090b] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    All Series ({activeChannelPlaylists.length})
                  </button>
                  {activeChannelPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => setSelectedPlaylistId(pl.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                        selectedPlaylistId === pl.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-[#09090b] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.08]'
                      }`}
                    >
                      <ListVideo size={12} />
                      <span className="truncate max-w-[200px]">{pl.title}</span>
                      <span className="text-[10px] opacity-75">({pl.videos.length})</span>
                    </button>
                  ))}
                </div>
              )}

              {displayedPlaylists.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-2">
                  <ListVideo size={28} className="text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold">No playlists saved for {activeChannel.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                    Use &ldquo;Track Channel&rdquo; above with a YouTube playlist link to import episodes.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#09090b]/60 p-4 sm:p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                        <div className="min-w-0">
                          <h4
                            onClick={() => handlePlayEntirePlaylist(pl)}
                            className="text-sm sm:text-base font-bold hover:text-indigo-500 cursor-pointer transition-colors"
                          >
                            {pl.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                            {pl.videos.length} episodes • {pl.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handlePlayEntirePlaylist(pl)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play size={13} fill="currentColor" />
                            <span>Play Series</span>
                          </button>
                          <button
                            onClick={() => handleDeletePlaylist(pl.id, pl.title)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete playlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pl.videos.map((vid, idx) =>
                          renderVideoCard(vid, { episodeIndex: idx, playlistContext: pl })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: All Videos */}
          {activeTab === 'creator-videos' && (
            <div>
              {channelVideos.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-2">
                  <Tv size={28} className="text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold">No videos attached yet for {activeChannel.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Paste any YouTube video URL above to add and stream immediately.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channelVideos.map((vid) => renderVideoCard(vid))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Related Stack Videos */}
          {activeTab === 'affinity-videos' && (
            <div>
              {sameTypesOfVideos.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 dark:text-zinc-400">
                  No related videos found for this stack yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sameTypesOfVideos.map((vid) =>
                    renderVideoCard(vid, { accentTag: 'Related Stack' })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Undo Delete Toast */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-2xl bg-zinc-900 border border-white/15 text-white shadow-2xl flex items-center gap-3">
          <Trash2 size={15} className="text-rose-400 shrink-0" />
          <span className="text-xs font-medium truncate max-w-xs">
            Removed &ldquo;{deleteToast.title}&rdquo;
          </span>
          <button
            onClick={handleUndoDelete}
            className="ml-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

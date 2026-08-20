import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  ArrowUpRight,
} from 'lucide-react';

export type VideoItem = {
  slug: string;
  title: string;
  network: string;
  program?: string;
  externalUrl: string;
  /** YouTube video id — when present the card opens in the popup player. */
  videoId?: string;
};

/* ── YouTube IFrame API loader (once per page) ─────────────────────── */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

/* ── Popup with custom player chrome ───────────────────────────────── */
function PlayerModal({ item, onClose }: { item: VideoItem; onClose: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Build the player
  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new YT.Player(mountRef.current, {
        videoId: item.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,          // hide YouTube's own controls — we render ours
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            if (cancelled) return;
            setReady(true);
            setDuration(e.target.getDuration() ?? 0);
            e.target.playVideo();
            poll = setInterval(() => {
              const p = playerRef.current;
              if (!p?.getCurrentTime) return;
              setTime(p.getCurrentTime() ?? 0);
              const d = p.getDuration?.() ?? 0;
              if (d) setDuration(d);
            }, 250);
          },
          onStateChange: (e: any) => {
            if (cancelled) return;
            if (e.data === 1) setPlaying(true);        // playing
            else if (e.data === 2) setPlaying(false);  // paused
            else if (e.data === 0) setPlaying(false);  // ended
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, [item.videoId]);

  // Esc to close + lock page scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, [muted]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setTime(t);
    playerRef.current?.seekTo?.(t, true);
  };

  const fullscreen = () => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const progress = duration ? (time / duration) * 100 : 0;

  // Portal to <body>: escapes every stacking context on the page so nothing
  // renders on top of or bleeds through the popup.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <div
        ref={shellRef}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-black shadow-2xl"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-[var(--brand)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video (a transparent overlay blocks YouTube's own click UI; clicks toggle play) */}
        <div className="relative aspect-video w-full">
          <div ref={mountRef} className="absolute inset-0 h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="absolute inset-0 z-10 cursor-pointer"
          />
          {!ready && (
            <div className="absolute inset-0 z-10 grid place-items-center text-sm text-white/70">
              Loading…
            </div>
          )}
        </div>

        {/* Custom control bar */}
        <div className="relative z-20 flex flex-col gap-2 bg-black px-4 pb-3 pt-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.25}
            value={time}
            onChange={seek}
            aria-label="Seek"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--brand)]"
            style={{
              background: `linear-gradient(to right, var(--brand) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
            }}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--brand)]"
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--brand)]"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="font-mono text-xs text-white/70">
              {fmt(time)} / {fmt(duration)}
            </span>
            <span className="ml-auto hidden truncate text-xs text-white/60 sm:block">
              {item.network} — {item.title}
            </span>
            <button
              type="button"
              onClick={fullscreen}
              aria-label="Fullscreen"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[var(--brand)]"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ── Cards ─────────────────────────────────────────────────────────── */
function VideoCard({ item, onOpen }: { item: VideoItem; onOpen: (v: VideoItem) => void }) {
  const isYouTube = Boolean(item.videoId);
  const thumb = item.videoId
    ? `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`
    : undefined;

  const media = (
    <>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 bg-[var(--bg-glass)]" />
      )}
      <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/60 transition-colors group-hover:bg-[var(--brand)]">
        <Play className="ml-0.5 h-5 w-5 fill-current text-white" />
      </span>
    </>
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-elevated)]">
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-base)]">
        {isYouTube ? (
          <button
            type="button"
            onClick={() => onOpen(item)}
            aria-label={`Play: ${item.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            {media}
          </button>
        ) : (
          /* Non-embeddable (e.g. Facebook reel) — link out */
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch “${item.title}” on ${item.network}`}
            className="absolute inset-0 h-full w-full"
          >
            {media}
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-muted)]">
            {item.network}
          </span>
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open “${item.title}” in a new tab`}
            className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-[var(--text-faint)] transition-colors hover:text-[var(--brand)]"
          >
            Open
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[var(--text-primary)]">
          {item.title}
        </h3>
      </div>
    </article>
  );
}

export default function VideoGallery({ items }: { items: VideoItem[] }) {
  const [active, setActive] = useState<VideoItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <VideoCard key={item.slug} item={item} onOpen={setActive} />
        ))}
      </div>
      {active && <PlayerModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

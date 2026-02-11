"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  fav?: boolean;
  cover: string;
  lyrics: string[];
}

const playlist: Song[] = [
  { id: 1, title: "Hard to Love", artist: "Crying City", album: "Hard to Love", genre: "Alternative", duration: "3:08", fav: true, cover: "🎸", lyrics: ["I know I'm hard to love", "But you keep coming back", "Every time I push away", "You pull me closer still"] },
  { id: 2, title: "Nervous", artist: "Crying City", album: "Nervous", genre: "Rock", duration: "2:10", cover: "🎤", lyrics: ["I get so nervous", "When you're around", "My heart is racing", "Can't slow it down"] },
  { id: 3, title: "Buy My Lies", artist: "Crying City", album: "Buy My Lies", genre: "Alternative", duration: "3:32", fav: true, cover: "🌙", lyrics: ["Would you buy my lies", "If I sold them cheap", "Would you close your eyes", "And fall asleep"] },
  { id: 4, title: "Cologne", artist: "beabadoobee", album: "Our Extended Play", genre: "Alternative", duration: "2:45", fav: true, cover: "🌸", lyrics: ["I still smell your cologne", "On my pillowcase", "Every memory of you", "I can't erase"] },
  { id: 5, title: "Sienna", artist: "The Marías", album: "Submarine", genre: "Alternative", duration: "3:45", fav: true, cover: "🚗", lyrics: ["Sienna, you're a dream", "Floating through my mind", "Colors I have never seen", "Leaving me behind"] },
  { id: 6, title: "might start singing", artist: "sheldon charlot", album: "might start singing", genre: "R&B/Soul", duration: "2:07", cover: "🎵", lyrics: ["I might start singing", "Out of the blue", "Can't help this feeling", "When I'm with you"] },
  { id: 7, title: "I Hear a Symphony", artist: "Cody Fry", album: "Flying", genre: "Singer/Songwriter", duration: "3:05", cover: "🎻", lyrics: ["I hear a symphony", "Every time you speak", "A melody so beautiful", "It makes me weak"] },
  { id: 8, title: "My Love Mine All Mine", artist: "Mitski", album: "The Land Is Inhospitable", genre: "Alternative", duration: "2:18", cover: "💫", lyrics: ["My love mine all mine", "Nothing in this world belongs to me", "But my love mine all mine", "All mine"] },
  { id: 9, title: "Glue Song", artist: "beabadoobee", album: "Glue Song", genre: "Alternative", duration: "2:15", cover: "🩹", lyrics: ["You're the one", "That I want at the end", "You're the one", "My forever friend"] },
  { id: 10, title: "Urn", artist: "Crying City", album: "You're Still The Light", genre: "Alternative", duration: "3:23", fav: true, cover: "✨", lyrics: ["You're still the light", "When everything goes dark", "You're still the fire", "That burns within my heart"] },
  { id: 11, title: "505", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", genre: "Alternative", duration: "4:14", cover: "🌃", lyrics: ["I'm going back to 505", "If it's a seven hour flight", "Or a forty-five minute drive", "In my imagination"] },
  { id: 12, title: "Song on the Beach", artist: "Arcade Fire", album: "Her (Score)", genre: "Soundtrack", duration: "3:36", fav: true, cover: "🏖️", lyrics: ["~instrumental~", "The waves crash softly", "On the shore tonight", "Everything feels right"] },
  { id: 13, title: "Line Without a Hook", artist: "Ricky Montgomery", album: "Montgomery Ricky", genre: "Pop", duration: "4:10", cover: "🎣", lyrics: ["Oh baby I am a wreck", "When I'm without you", "I need you here to stay", "I broke all my bones that day"] },
  { id: 14, title: "anything", artist: "Adrianne Lenker", album: "songs", genre: "Alternative", duration: "3:22", cover: "🍂", lyrics: ["I wanna walk with you", "Through the leaves falling", "I wanna be with you", "Through anything at all"] },
  { id: 15, title: "Instagram", artist: "DEAN", album: "Instagram", genre: "Alternative", duration: "4:16", fav: true, cover: "📱", lyrics: ["인스타그램", "스크롤을 내려", "Everyone looks happy", "But I'm feeling lonely"] },
  { id: 16, title: "Worship", artist: "Ari Abdul", album: "Worship", genre: "Alternative", duration: "2:43", cover: "🕯️", lyrics: ["I would worship you", "If you let me", "Fall down at your feet", "Please don't forget me"] },
  { id: 17, title: "Kicking Cars", artist: "Panchiko", album: "D>E>A>T>H>M>E>T>A>L", genre: "Alternative", duration: "3:12", cover: "🚙", lyrics: ["Kicking cars", "In the parking lot", "Under stars", "Feeling lost"] },
  { id: 18, title: "The Beach", artist: "The Neighbourhood", album: "Wiped Out!", genre: "Alternative", duration: "4:02", cover: "🌊", lyrics: ["If I told you that I loved you", "Tell me what would you say", "If I told you that I hated this", "Would you go away"] },
  { id: 19, title: "See you soon", artist: "Wisp", album: "Pandora", genre: "Alternative", duration: "2:48", cover: "👋", lyrics: ["See you soon", "Under the moon", "In my dreams", "Nothing's as it seems"] },
  { id: 20, title: "Pandora", artist: "Wisp", album: "Pandora", genre: "Alternative", duration: "3:15", cover: "📦", lyrics: ["Open up the box", "Let the demons free", "Pandora's curse", "Is haunting me"] },
  { id: 21, title: "Flatline", artist: "Justin Bieber", album: "Journals", genre: "Pop", duration: "3:01", cover: "💔", lyrics: ["My heart goes flatline", "When you walk away", "Bring me back to life", "Please don't leave me this way"] },
  { id: 22, title: "What You Need", artist: "The Weeknd", album: "House Of Balloons", genre: "R&B/Soul", duration: "3:30", cover: "🎈", lyrics: ["I got what you need", "Baby come to me", "Let me be the one", "To set your heart free"] },
  { id: 23, title: "Cry", artist: "Cigarettes After Sex", album: "Cry", genre: "Alternative", duration: "4:17", cover: "🥀", lyrics: ["I just wanna be yours", "I just want to feel you close", "Hold me while I cry", "Don't let me go"] },
  { id: 24, title: "Avalon", artist: "Zeruel", album: "Avalon", genre: "Alternative", duration: "3:44", cover: "⚔️", lyrics: ["Take me to Avalon", "Where the legends sleep", "In the mist and fog", "Secrets we will keep"] },
];

// Cat singing component with the cute cat image
function SingingCat({ currentLyric, isPlaying }: { currentLyric: string; isPlaying: boolean }) {
  return (
    <motion.div
      className="fixed bottom-28 right-8 z-50 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Speech bubble with whiteboard frame */}
      <AnimatePresence mode="wait">
        {isPlaying && currentLyric && (
          <motion.div
            key={currentLyric}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4 relative w-[240px] h-[140px]"
          >
            {/* Whiteboard frame background */}
            <Image
              src="/whiteboard.png"
              alt=""
              fill
              className="object-contain"
            />
            {/* Lyrics text centered inside */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="text-gray-700 text-sm text-center italic leading-relaxed">
                &ldquo;{currentLyric}&rdquo;
              </span>
            </div>

            {/* Music notes floating */}
            <motion.span
              className="absolute -top-2 -right-2 text-lg text-[#fa2d48]"
              animate={{ y: [-5, -15, -5], opacity: [0.7, 1, 0.7], rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ♪
            </motion.span>
            <motion.span
              className="absolute -top-1 -left-2 text-sm text-[#fa2d48]"
              animate={{ y: [-3, -12, -3], opacity: [0.5, 1, 0.5], rotate: [0, -10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            >
              ♫
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cat image */}
      <motion.div
        className="relative w-36 h-36"
        animate={isPlaying ? {
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
        } : {}}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/cat.png"
          alt="Cute cat with headphones"
          width={144}
          height={144}
          className="object-contain drop-shadow-lg"
          priority
        />
      </motion.div>

      {/* "Vibing" text when playing */}
      {isPlaying && (
        <motion.p
          className="text-xs text-gray-400 mt-1 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          vibing~ ♪
        </motion.p>
      )}
    </motion.div>
  );
}

// Apple-style Track Row
function TrackRow({
  song,
  index,
  isActive,
  isPlaying,
  onClick,
  isFav,
  onFavToggle,
}: {
  song: Song;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
  isFav: boolean;
  onFavToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "grid grid-cols-[24px_1fr_1fr_40px_60px] gap-4 px-4 py-2.5 rounded-lg group cursor-pointer transition-colors",
        isActive ? "bg-[#fa2d48]/10" : "hover:bg-black/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.015 }}
    >
      {/* Number / Play icon */}
      <div className="flex items-center justify-center">
        {isHovered || isActive ? (
          isActive && isPlaying ? (
            <div className="flex items-end gap-[2px] h-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-[#fa2d48] rounded-sm"
                  animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="#fa2d48">
              <path d="M2.5 1.5v9l7-4.5-7-4.5z" />
            </svg>
          )
        ) : (
          <span className={cn("text-sm tabular-nums", isActive ? "text-[#fa2d48] font-medium" : "text-gray-400")}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className={cn("text-[15px] font-medium truncate", isActive ? "text-[#fa2d48]" : "text-gray-900")}>
            {song.title}
          </p>
          <p className="text-[13px] text-gray-500 truncate">
            {song.artist}
          </p>
        </div>
      </div>

      {/* Album */}
      <div className="flex items-center">
        <span className="text-[13px] text-gray-500 truncate">
          {song.album}
        </span>
      </div>

      {/* Fav */}
      <div className="flex items-center justify-center">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onFavToggle();
          }}
          className={cn(
            "transition-all",
            isFav ? "text-[#fa2d48]" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-400"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>
      </div>

      {/* Duration */}
      <div className="flex items-center justify-end">
        <span className="text-[13px] text-gray-400 tabular-nums">{song.duration}</span>
      </div>
    </motion.div>
  );
}

export default function MusicPage() {
  const [selected, setSelected] = useState<Song>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(playlist.filter((s) => s.fav).map((s) => s.id))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery) return playlist;
    const query = searchQuery.toLowerCase();
    return playlist.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Current lyric based on progress
  const currentLyric = useMemo(() => {
    const lyrics = selected.lyrics;
    const lyricIndex = Math.floor((progress / 100) * lyrics.length);
    return lyrics[Math.min(lyricIndex, lyrics.length - 1)];
  }, [selected.lyrics, progress]);

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const idx = playlist.findIndex((s) => s.id === selected.id);
          setSelected(playlist[(idx + 1) % playlist.length]);
          return 0;
        }
        return prev + 0.3;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, selected]);

  useEffect(() => {
    setProgress(0);
  }, [selected.id]);

  const handlePrev = useCallback(() => {
    const idx = playlist.findIndex((s) => s.id === selected.id);
    setSelected(playlist[idx > 0 ? idx - 1 : playlist.length - 1]);
  }, [selected]);

  const handleNext = useCallback(() => {
    const idx = playlist.findIndex((s) => s.id === selected.id);
    setSelected(playlist[(idx + 1) % playlist.length]);
  }, [selected]);

  const toggleFav = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const formatTime = (percent: number, duration: string) => {
    const [m, s] = duration.split(":").map(Number);
    const totalSecs = m * 60 + s;
    const currentSecs = Math.floor((percent / 100) * totalSecs);
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = useMemo(() => {
    let secs = 0;
    playlist.forEach((s) => {
      const [m, sec] = s.duration.split(":").map(Number);
      secs += m * 60 + sec;
    });
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h} hr ${m} min`;
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="pt-14 pb-32 h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 md:px-10 pt-8 pb-6 flex-shrink-0">
          <div className="flex items-start gap-6">
            {/* Album Art */}
            <motion.div
              className="w-52 h-52 rounded-xl bg-gradient-to-br from-[#fa2d48] via-[#ff6b6b] to-[#ffa07a] shadow-xl flex items-center justify-center flex-shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-7xl">🎧</span>
            </motion.div>

            {/* Info */}
            <div className="pt-4">
              <motion.p
                className="text-xs font-semibold text-[#fa2d48] uppercase tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Playlist
              </motion.p>
              <motion.h1
                className="text-4xl font-bold text-gray-900 mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Jay&apos;s Rotation
              </motion.h1>
              <motion.p
                className="text-sm text-gray-500 mt-2 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                What I&apos;ve been listening to — mostly alternative, indie, and R&B.
              </motion.p>
              <motion.div
                className="flex items-center gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm text-gray-500">{playlist.length} songs</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{totalDuration}</span>
              </motion.div>

              {/* Play button */}
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="mt-5 px-8 py-2.5 bg-[#fa2d48] text-white rounded-full text-sm font-semibold hover:bg-[#e0273f] transition-colors shadow-lg shadow-[#fa2d48]/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isPlaying ? "Pause" : "Play"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 md:px-10 pb-4 flex-shrink-0">
          <div className="relative max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search songs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 text-sm pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#fa2d48]/30 transition-shadow"
            />
          </div>
        </div>

        {/* Track list header */}
        <div className="px-6 md:px-10 flex-shrink-0">
          <div className="grid grid-cols-[24px_1fr_1fr_40px_60px] gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-200">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span></span>
            <span className="text-right">Time</span>
          </div>
        </div>

        {/* Scrollable track list */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-2">
          {filteredPlaylist.map((song, index) => (
            <TrackRow
              key={song.id}
              song={song}
              index={index}
              isActive={selected.id === song.id}
              isPlaying={isPlaying && selected.id === song.id}
              onClick={() => {
                setSelected(song);
                setIsPlaying(true);
              }}
              isFav={favorites.has(song.id)}
              onFavToggle={() => toggleFav(song.id)}
            />
          ))}
        </div>
      </main>

      {/* Apple-style Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-40">
        {/* Progress bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gray-200 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.max(0, Math.min(100, percent)));
          }}
        >
          <motion.div
            className="h-full bg-[#fa2d48] relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fa2d48] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
          </motion.div>
        </div>

        <div className="h-full px-6 flex items-center justify-between pt-1">
          {/* Left: Song info */}
          <div className="flex items-center gap-4 w-1/3">
            <motion.div
              className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#fa2d48] to-[#ff6b6b] flex items-center justify-center text-xl shadow-lg flex-shrink-0"
              key={selected.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {selected.cover}
            </motion.div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {selected.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {selected.artist}
              </p>
            </div>
            <motion.button
              onClick={() => toggleFav(selected.id)}
              className={cn("ml-2", favorites.has(selected.id) ? "text-[#fa2d48]" : "text-gray-300 hover:text-gray-400")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.has(selected.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.button>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-6">
              {/* Previous */}
              <motion.button
                onClick={handlePrev}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>

              {/* Next */}
              <motion.button
                onClick={handleNext}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </motion.button>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span className="tabular-nums">{formatTime(progress, selected.duration)}</span>
              <span>/</span>
              <span className="tabular-nums">{selected.duration}</span>
            </div>
          </div>

          {/* Right: Volume */}
          <div className="flex items-center gap-3 justify-end w-1/3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <div
              className="w-24 h-1 bg-gray-200 rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                setVolume(Math.max(0, Math.min(100, percent)));
              }}
            >
              <motion.div
                className="h-full bg-gray-400 group-hover:bg-[#fa2d48] rounded-full relative transition-colors"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Singing Cat */}
      <SingingCat currentLyric={currentLyric} isPlaying={isPlaying} />
    </div>
  );
}

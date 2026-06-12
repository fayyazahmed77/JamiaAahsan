import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import type { Audio as AudioType } from '@/types/models';
import { AudioPlayer } from '@/Components/Public/AudioPlayer';
import Header from '@/Components/Public/Header';
import Footer from '@/Components/Public/Footer';

interface AudioContextType {
    currentTrack: AudioType | null;
    isPlaying: boolean;
    playTrack: (track: AudioType, queueList?: AudioType[]) => void;
    togglePlay: () => void;
    queue: AudioType[];
    addToQueue: (track: AudioType) => void;
    playNext: () => void;
    playPrevious: () => void;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { locale, dir } = usePage<SharedData>().props;
    const [currentTrack, setCurrentTrack] = useState<AudioType | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<AudioType[]>([]);
    const [queueIndex, setQueueIndex] = useState(-1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        document.documentElement.dir = dir || 'ltr';
        document.documentElement.lang = locale || 'en';
        
        // Force light mode on public pages
        const html = document.documentElement;
        const hadDark = html.classList.contains('dark');
        html.classList.remove('dark');
        html.classList.add('light');
        html.style.colorScheme = 'light';

        const observer = new MutationObserver(() => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                html.style.colorScheme = 'light';
            }
        });

        observer.observe(html, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
            if (hadDark) {
                html.classList.add('dark');
                html.classList.remove('light');
                html.style.colorScheme = 'dark';
            }
        };
    }, [locale, dir]);

    useEffect(() => {
        audioRef.current = new window.Audio();
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;
        
        audioRef.current.src = currentTrack.url || '';
        audioRef.current.playbackRate = playbackSpeed;
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [currentTrack]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.playbackRate = playbackSpeed;
    }, [playbackSpeed]);

    const playTrack = (track: AudioType, queueList: AudioType[] = []) => {
        if (queueList.length > 0) {
            setQueue(queueList);
            const idx = queueList.findIndex(t => t.id === track.id);
            setQueueIndex(idx);
        } else {
            setQueue([track]);
            setQueueIndex(0);
        }
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentTrack) {
            setIsPlaying(!isPlaying);
        }
    };

    const addToQueue = (track: AudioType) => {
        setQueue(prev => [...prev, track]);
    };

    const playNext = () => {
        if (queue.length > 0 && queueIndex < queue.length - 1) {
            const nextIdx = queueIndex + 1;
            setQueueIndex(nextIdx);
            setCurrentTrack(queue[nextIdx]);
            setIsPlaying(true);
        }
    };

    const playPrevious = () => {
        if (queue.length > 0 && queueIndex > 0) {
            const prevIdx = queueIndex - 1;
            setQueueIndex(prevIdx);
            setCurrentTrack(queue[prevIdx]);
            setIsPlaying(true);
        }
    };

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            playTrack,
            togglePlay,
            queue,
            addToQueue,
            playNext,
            playPrevious,
            playbackSpeed,
            setPlaybackSpeed
        }}>
            <div dir={dir} className="flex flex-col min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
                {/* Skip to Main Content Link for Keyboard Accessibility */}
                <a 
                    href="#main-content" 
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none"
                >
                    Skip to main content
                </a>

                {/* Public Header Navbar */}
                <Header />

                {/* Page Content Shell */}
                <main id="main-content" className="flex-grow" style={{ paddingBottom: currentTrack ? 96 : 0 }}>
                    {children}
                </main>

                {/* Persistent Audio player (Spotify style) */}
                {audioRef.current && (
                    <AudioPlayer audioRef={audioRef} />
                )}

                {/* Public Footer */}
                <Footer />
            </div>
        </AudioContext.Provider>
    );
}

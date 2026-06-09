import React, { useEffect, useState } from 'react';
import { useAudio } from '@/Layouts/PublicLayout';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, HelpCircle, Share2, Layers } from 'lucide-react';

interface AudioPlayerProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export function AudioPlayer({ audioRef }: AudioPlayerProps) {
    const { currentTrack, isPlaying, togglePlay, playNext, playPrevious, playbackSpeed, setPlaybackSpeed, queue } = useAudio();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [speedOpen, setSpeedOpen] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateMetadata = () => setDuration(audio.duration || 0);
        const handleEnded = () => {
            playNext();
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = parseFloat(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!currentTrack) return null;

    const speeds = [0.75, 1, 1.25, 1.5, 2];

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: 88,
            background: 'var(--surface-2)', borderTop: '1px solid var(--border)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)', zIndex: 45,
            padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backdropFilter: 'blur(12px)'
        }}>
            {/* Left: Track Information */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, maxWidth: '30%' }}>
                <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius)',
                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, boxShadow: 'var(--shadow-glow)', flexShrink: 0
                }}>
                    🕌
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        {currentTrack.title}
                    </div>
                    <div style={{
                        fontSize: '0.75rem', color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        {currentTrack.speaker?.name || 'Scholar'} • {currentTrack.category?.name || 'Lecture'}
                    </div>
                </div>
            </div>

            {/* Center: Controls and Seekbar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexGrow: 1, maxWidth: 600 }}>
                {/* Control Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button 
                        onClick={playPrevious}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        title="Previous Track"
                    >
                        <SkipBack size={18} />
                    </button>
                    <button 
                        onClick={togglePlay}
                        style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'var(--primary-500)', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer',
                            transition: 'transform var(--transition)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
                    </button>
                    <button 
                        onClick={playNext}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        title="Next Track"
                    >
                        <SkipForward size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', width: 32, textAlign: 'right' }}>
                        {formatTime(currentTime)}
                    </span>
                    <input 
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            flexGrow: 1, height: 4, cursor: 'pointer',
                            accentColor: 'var(--primary-500)',
                            background: 'var(--border)'
                        }}
                    />
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', width: 32 }}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Right: Volume & Extra Utilities */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 200, justifyContent: 'flex-end' }}>
                {/* Speed toggle */}
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setSpeedOpen(!speedOpen)}
                        style={{
                            background: 'var(--surface-3)', border: '1px solid var(--border)',
                            color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        {playbackSpeed}x
                    </button>
                    {speedOpen && (
                        <div style={{
                            position: 'absolute', bottom: 32, right: 0, background: 'var(--surface-1)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                            boxShadow: 'var(--shadow)', padding: 4, display: 'flex', flexDirection: 'column', gap: 2,
                            zIndex: 60
                        }}>
                            {speeds.map(s => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        setPlaybackSpeed(s);
                                        setSpeedOpen(false);
                                    }}
                                    style={{
                                        background: playbackSpeed === s ? 'var(--primary-500)' : 'transparent',
                                        color: playbackSpeed === s ? 'white' : 'var(--text-secondary)',
                                        border: 'none', padding: '4px 12px', fontSize: '0.75rem',
                                        cursor: 'pointer', borderRadius: 'var(--radius-sm)', textAlign: 'left'
                                    }}
                                >
                                    {s}x
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Volume bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input 
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                        }}
                        style={{
                            width: 80, height: 4, cursor: 'pointer',
                            accentColor: 'var(--primary-500)',
                            background: 'var(--border)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

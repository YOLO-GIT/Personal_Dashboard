import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, Wind, Waves, Radio } from 'lucide-react';

const SOUND_PRESETS = [
    { id: 'rain', label: 'Rain', icon: CloudRain, type: 'pink', filterFreq: 1000 },
    { id: 'wind', label: 'Wind', icon: Wind, type: 'pink', filterFreq: 400 },
    { id: 'ocean', label: 'Ocean', icon: Waves, type: 'brown', filterFreq: 250 },
    { id: 'static', label: 'Static', icon: Radio, type: 'white', filterFreq: 3000 },
];

export default function AmbientPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSound, setSelectedSound] = useState('rain');
    const [volume, setVolume] = useState(0.5);

    const audioCtxRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const gainNodeRef = useRef(null);
    const filterNodeRef = useRef(null);

    // Initialize Web Audio API Context
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    // Generate Procedural Noise Buffer
    const createNoiseBuffer = (ctx, type) => {
        const bufferSize = ctx.sampleRate * 2; // 2 second looping buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            if (type === 'white') {
                data[i] = white * 0.15;
            } else if (type === 'brown') {
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 1.2;
            } else if (type === 'pink') {
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.08;
                b6 = white * 0.115926;
            }
        }
        return buffer;
    };

    // Start Playing Audio
    const startAudio = () => {
        initAudio();
        stopAudio(); // Stop existing nodes if any

        const ctx = audioCtxRef.current;
        const preset = SOUND_PRESETS.find(p => p.id === selectedSound);

        // Create Buffer & Source
        const buffer = createNoiseBuffer(ctx, preset.type);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Create Biquad Filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = preset.filterFreq;

        // Create Gain Node (Volume)
        const gain = ctx.createGain();
        gain.gain.value = volume;

        // Connect Pipeline: Source -> Filter -> Volume -> Output
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();

        sourceNodeRef.current = source;
        filterNodeRef.current = filter;
        gainNodeRef.current = gain;
        setIsPlaying(true);
    };

    // Stop Playing Audio
    const stopAudio = () => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            } catch (e) {
                // Node already stopped
            }
            sourceNodeRef.current = null;
        }
        setIsPlaying(false);
    };

    // Handle Play/Pause Toggle
    const togglePlay = () => {
        if (isPlaying) {
            stopAudio();
        } else {
            startAudio();
        }
    };

    // Update Volume on the Fly
    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = val;
        }
    };

    // Switch Sound Preset
    const handleSelectSound = (soundId) => {
        setSelectedSound(soundId);
        if (isPlaying) {
            setTimeout(() => startAudio(), 50);
        }
    };

    // Cleanup on Component Unmount
    useEffect(() => {
        return () => stopAudio();
    }, []);

    return (
        <div className="bg-[#181818] border border-gray-800/80 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" /> Ambient Noise
                </span>
                <button
                    onClick={togglePlay}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${isPlaying
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-gray-800 text-gray-300 hover:text-white'
                        }`}
                >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>

            {/* Preset Selector Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
                {SOUND_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedSound === preset.id;
                    return (
                        <button
                            key={preset.id}
                            onClick={() => handleSelectSound(preset.id)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${isSelected
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                : 'bg-[#121212] text-gray-400 hover:text-white border border-gray-800/60'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{preset.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    onClick={() => handleVolumeChange({ target: { value: volume === 0 ? 0.5 : 0 } })}
                    className="text-gray-500 hover:text-gray-300"
                >
                    {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
            </div>
        </div>
    );
}
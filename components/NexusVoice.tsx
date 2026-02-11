
import React, { useState, useRef } from 'react';
import { Mic2, Play, Volume2, Save, Loader2, Music, Waves } from 'lucide-react';
import { generateNexusSpeech } from '../services/geminiService';

const NexusVoice: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const voices = [
    { name: 'Kore', gender: 'Female', desc: 'Clear & Professional' },
    { name: 'Puck', gender: 'Male', desc: 'Deep & Energetic' },
    { name: 'Charon', gender: 'Male', desc: 'Calm & Steady' },
    { name: 'Fenrir', gender: 'Neutral', desc: 'Ancient & Rich' },
    { name: 'Zephyr', gender: 'Neutral', desc: 'Ethereal & Smooth' }
  ];

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handleSynthesize = async () => {
    if (!text.trim() || isSynthesizing) return;

    setIsSynthesizing(true);
    try {
      const base64Audio = await generateNexusSpeech(text, selectedVoice);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (error) {
      console.error(error);
      alert("Nexus Voice synchronization failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">Nexus Voice</h2>
            <p className="text-zinc-500 text-xs">Neural Text-to-Speech Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Music className="w-4 h-4" /> Input Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the message for Nexus to speak..."
                  className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none leading-relaxed"
                />
              </div>
              <button
                onClick={handleSynthesize}
                disabled={!text.trim() || isSynthesizing}
                className="w-full py-4 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Synchronizing Vocals...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    Speak Message
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              <label className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Voice Synthesis Profiles
              </label>
              <div className="space-y-3">
                {voices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => setSelectedVoice(voice.name)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                      selectedVoice === voice.name 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold">{voice.name}</h4>
                      <p className="text-xs opacity-60">{voice.desc}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono bg-zinc-800 px-2 py-1 rounded">
                      {voice.gender}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-6 glass rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-bold text-zinc-300">Live Visualizer</span>
                </div>
                <div className="h-20 flex items-center justify-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-cyan-500 rounded-full transition-all duration-300 ${
                        isSynthesizing ? 'animate-pulse' : 'opacity-20'
                      }`}
                      style={{ height: isSynthesizing ? `${Math.random() * 80 + 20}%` : '20%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusVoice;

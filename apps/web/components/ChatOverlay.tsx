'use client';

<<<<<<< HEAD
import { Bot, Send, User } from 'lucide-react';
=======
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../lib/stores/gameStore';
import { PixelButton } from './PixelComponents';

export const ChatOverlay: React.FC = () => {
    const logs = useGameStore((state) => state.logs);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatInput('');

        // User Message
        useGameStore.getState().addLog({
            id: Date.now(),
            message: userMessage,
<<<<<<< HEAD
            type: 'info', // 'info' is used for user messages in this codebase
=======
            type: 'info',
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // AI Response Logic
        try {
            // Mock TavernKeeper Agent
            const tavernKeeper = {
                id: 'tavern-keeper',
                name: 'TavernKeeper',
<<<<<<< HEAD
                class: 'Mage' as any,
                level: 99,
                traits: ['Friendly', 'Knowledgeable', 'Busy', 'Gossip'],
                backstory: 'I have run this inn for as long as I can remember.',
                stats: { hp: 100, maxHp: 100, mp: 100, maxMp: 100, str: 10, int: 18 },
                currentThought: "Business is booming.",
                inventory: [],
                spriteColor: "#855e42",
                position: { x: 0, y: 0 },
                lastAction: "Serving drinks"
            };
=======
                class: 'Innkeeper',
                level: 99,
                traits: ['Friendly', 'Knowledgeable', 'Busy', 'Gossip'],
                backstory: 'I have run this inn for as long as I can remember. I know everyone and everything that passes through.',
                stats: { strength: 10, dexterity: 10, intelligence: 18, vitality: 10, speed: 10 }
            };

            // Add "Thinking..." placeholder
            const thinkingId = Date.now() + 1;
            useGameStore.getState().addLog({
                id: thinkingId,
                message: "...",
                type: 'dialogue',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            // Import dynamically to avoid circular deps if any, or just use standard import
            const { chatWithAgent } = await import('../services/geminiService');
            const response = await chatWithAgent(tavernKeeper, userMessage);

            // Remove thinking log and add real response (in a real app we'd update the log, here we just add new one)
            // Actually, let's just add the new one. The "..." will stay as a "thinking" indicator or we can remove it.
            // For simplicity, let's just add the response.
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca

            // Add "Thinking..." placeholder
            const thinkingId = Date.now() + 1;
            useGameStore.getState().addLog({
<<<<<<< HEAD
                id: thinkingId,
                message: "...",
                type: 'dialogue', // 'dialogue' is used for agent messages
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            const { chatWithAgent } = await import('../app/actions/aiActions');
            const response = await chatWithAgent(tavernKeeper, userMessage);

            // Add real response
            useGameStore.getState().addLog({
=======
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
                id: Date.now() + 2,
                message: response,
                type: 'dialogue',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

        } catch (error) {
            console.error("AI Chat Error:", error);
<<<<<<< HEAD
            useGameStore.getState().addLog({
                id: Date.now() + 3,
                message: "*grunts* (Something went wrong...)",
=======
            // Fallback
            useGameStore.getState().addLog({
                id: Date.now() + 3,
                message: "I'm a bit overwhelmed right now, ask me later!",
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
                type: 'dialogue',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    };

    // Filter logs to only show chat-relevant ones if needed, or show all
    // For now, we show all logs but style them differently
    const chatLogs = [...logs].reverse(); // logs are stored new-to-old, so reverse for display

    return (
        <div className="w-full h-full flex flex-col bg-[#1a120b]/80 backdrop-blur-sm rounded-lg border-2 border-[#4a3b32] shadow-xl overflow-hidden relative">
            {/* Header */}
            <div className="bg-[#2a1d17] p-2 border-b-2 border-[#4a3b32] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[#eaddcf] font-bold text-xs tracking-wider">TAVERN CHAT</span>
            </div>

            {/* Chat History */}
<<<<<<< HEAD
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#1a120b]"
            >
                {chatLogs.length === 0 && (
                    <div className="text-center text-[#eaddcf]/30 italic mt-10 text-xs">
                        The tavern is quiet...
=======
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar p-2 mb-2">
                {[...logs].reverse().map((log) => (
                    <div key={log.id} className={`flex flex-col gap-1 ${log.type === 'info' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded text-xs leading-relaxed shadow-sm border-b-2
                ${log.type === 'info'
                                ? 'bg-[#d4c5b0] text-[#3e3224] border-[#8c7b63] rounded-tr-none'
                                : 'bg-[#2a1d17] text-[#eaddcf] border-[#1a120b] rounded-tl-none'
                            }`}>
                            {log.message}
                        </div>
                        <span className="text-[8px] text-amber-900/40 font-mono px-1">{log.timestamp}</span>
>>>>>>> d9c80166f06c3f6075f2ba2e63c2d068690df2ca
                    </div>
                )}

                {chatLogs.map((log) => {
                    const isUser = log.type === 'info';
                    return (
                        <div key={log.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded border-2 shrink-0 flex items-center justify-center
                                ${isUser ? 'bg-[#3e3224] border-[#8c7b63]' : 'bg-[#855e42] border-[#eaddcf]'}
                            `}>
                                {isUser ? <User size={14} className="text-[#eaddcf]" /> : <Bot size={14} className="text-[#eaddcf]" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                                <div className={`px-3 py-2 text-xs leading-relaxed shadow-md relative
                                    ${isUser
                                        ? 'bg-[#eaddcf] text-[#2a1d17] rounded-l-lg rounded-tr-lg'
                                        : 'bg-[#2a1d17] text-[#eaddcf] border border-[#4a3b32] rounded-r-lg rounded-tl-lg'
                                    }
                                `}>
                                    {log.message}
                                </div>
                                <span className="text-[9px] text-[#eaddcf]/40 mt-1 px-1 font-mono">
                                    {log.timestamp}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 bg-[#2a1d17] border-t-2 border-[#4a3b32] flex gap-2">
                <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Speak thy mind..."
                    className="flex-1 bg-[#1a120b] border border-[#4a3b32] text-[#eaddcf] px-3 py-2 text-xs font-pixel focus:outline-none focus:border-[#eaddcf] placeholder:text-[#eaddcf]/20 rounded resize-none h-10 custom-scrollbar"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <PixelButton
                    onClick={handleSendMessage}
                    className="h-10 w-10 flex items-center justify-center !p-0"
                    variant="wood"
                >
                    <Send size={16} />
                </PixelButton>
            </div>
        </div>
    );
};

'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mic, MicOff, Send } from 'lucide-react';

// Extend Window interface to include Speech Recognition
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SpeechRecognition: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        webkitSpeechRecognition: any;
    }
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
        isFinal: boolean;
    };
}

interface SpeechRecognitionResult {
    0: {
        transcript: string;
    };
    isFinal: boolean;
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface VoiceTextInputProps {
    onSubmit?: (text: string) => void;
    placeholder?: string;
}

const VoiceTextInput = ({ onSubmit, placeholder = 'พิมพ์ข้อความหรือกดไมค์เพื่อพูด...' }: VoiceTextInputProps) => {
    // State สำหรับ input text
    const [inputText, setInputText] = useState('');
    
    // State สำหรับ Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        // Check if browser supports Speech Recognition
        if (globalThis.window) {
            const SpeechRecognition = globalThis.window.SpeechRecognition || globalThis.window.webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'th-TH'; // ภาษาไทย, เปลี่ยนเป็น 'en-US' ถ้าต้องการภาษาอังกฤษ

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    // Update input with final or interim transcript
                    if (finalTranscript) {
                        setInputText(prev => prev + finalTranscript);
                    } else if (interimTranscript) {
                        setInputText(prev => {
                            const lastSpace = prev.lastIndexOf(' ');
                            return prev.substring(0, lastSpace + 1) + interimTranscript;
                        });
                    }
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error);
                    setError(`เกิดข้อผิดพลาด: ${event.error}`);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            } else {
                setError('เบราว์เซอร์นี้ไม่รองรับการรับรู้เสียง');
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Toggle voice recording
    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) {
            setError('ไม่สามารถใช้งานการรับรู้เสียงได้');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setError(null);
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error('Error starting recognition:', err);
                setError('ไม่สามารถเริ่มการรับรู้เสียงได้');
            }
        }
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            if (onSubmit) {
                onSubmit(inputText.trim());
            }
            console.log('📤 Submitted text:', inputText.trim());
            setInputText('');
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Status Indicator */}
            {isListening && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        🎤 กำลังฟัง...
                    </span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">❌ {error}</p>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-2 items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {/* Text Input */}
                    <Input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
                    />

                    {/* Voice Button */}
                    <Button
                        type="button"
                        onClick={toggleVoiceRecording}
                        variant={isListening ? 'destructive' : 'outline'}
                        size="icon"
                        className="h-10 w-10 rounded-full shrink-0"
                    >
                        {isListening ? (
                            <MicOff className="h-5 w-5" />
                        ) : (
                            <Mic className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Send Button */}
                    <Button
                        type="submit"
                        disabled={!inputText.trim()}
                        size="icon"
                        className="h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>

            {/* Instructions */}
            <div className="mt-4 text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 พิมพ์ข้อความหรือคลิกปุ่มไมค์เพื่อพูด จากนั้นกด Enter หรือปุ่มส่งเพื่อส่งข้อความ
                </p>
            </div>
        </div>
    );
};

export default VoiceTextInput;

'use client';
import { useEffect, useRef, useState } from 'react';
import { SimliClient } from 'simli-client';
import { Button } from '../ui/button';

const SimliAvatar = () => {
    // 1. สร้าง Ref เพื่ออ้างอิงถึง <video> และ <audio> elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 2. สร้าง State เพื่อเก็บ instance ของ simliClient
    const [client, setClient] = useState<SimliClient | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isClientConnected, setIsClientConnected] = useState(false);

    // 3. State และ Refs สำหรับไมโครโฟน
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);

    useEffect(() => {
        // รอให้ refs พร้อมก่อน initialize
        const initializeSimli = () => {
            if (!videoRef.current || !audioRef.current) {
                console.warn('Refs not ready yet, retrying...');
                // Retry after a short delay
                setTimeout(initializeSimli, 100);
                return;
            }

            console.log('✅ Refs are ready, initializing SimliClient...');
            const simliClient = new SimliClient();

            simliClient.Initialize({
                apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY || '',
                faceID: process.env.NEXT_PUBLIC_SIMLI_FACE_ID || '',
                handleSilence: true, // keep the face moving while in idle
                maxSessionLength: 3600, // in seconds
                maxIdleTime: 600, // in seconds
                videoRef: videoRef.current,
                audioRef: audioRef.current,
                enableConsoleLogs: true,
                session_token: '',
                SimliURL: '',
                maxRetryAttempts: 3,
                retryDelay_ms: 300,
                videoReceivedTimeout: 0,
                model: '',
            });

            simliClient.start();

            simliClient.on('connected', () => {
                console.log('✅ SimliClient connected');
                setClient(simliClient);
                setIsClientConnected(true);
                setIsInitializing(false);
            });

            simliClient.on('failed', () => {
                console.error('❌ SimliClient failed to connect.');
                setIsClientConnected(false);
                setIsInitializing(false);
            });

            simliClient.on('disconnected', () => {
                console.warn('⚠️ SimliClient disconnected');
                setIsClientConnected(false);
            });
        };

        initializeSimli();

        return () => {
            // Cleanup will be handled by simliClient.close() when it exists
        };
    }, []);

    // ฟังก์ชันแปลง Float32Array (-1.0 to 1.0) เป็น 16-bit PCM Uint8Array
    const float32ToPCM16 = (float32Array: Float32Array): Uint8Array => {
        const buffer = new ArrayBuffer(float32Array.length * 2); // 2 bytes per sample (16-bit)
        const view = new DataView(buffer);

        let offset = 0;
        for (const sample of float32Array) {
            // Clamp sample to [-1, 1]
            const s = Math.max(-1, Math.min(1, sample));
            // Convert to 16-bit integer (-32768 to 32767)
            const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
            view.setInt16(offset, int16, true); // true = little-endian
            offset += 2;
        }

        return new Uint8Array(buffer);
    };

    const handleSendData = () => {
        if (client) {
            const audioData = new Uint8Array(6000).fill(0);
            client.sendAudioData(audioData);
        } else {
            console.warn('SimliClient is not connected yet.');
        }
    };

    // ฟังก์ชันหยุดบันทึกเสียง
    const stopRecording = () => {
        setIsRecording(false);
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        workletNodeRef.current = null;
        audioContextRef.current = null;
        mediaStreamRef.current = null;
    };

    // ฟังก์ชันเริ่มบันทึกเสียงจากไมโครโฟน
    const startRecording = async () => {
        if (isRecording) return;
        setMicError(null);

        try {
            // ขออนุญาตเข้าถึงไมโครโฟน
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // สร้าง AudioContext
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;

            // Create inline AudioWorklet processor
            const processorCode = `
                class AudioProcessor extends AudioWorkletProcessor {
                    process(inputs) {
                        const input = inputs[0];
                        if (input.length > 0) {
                            const inputData = input[0]; // Float32Array
                            this.port.postMessage(inputData);
                        }
                        return true;
                    }
                }
                registerProcessor('audio-processor', AudioProcessor);
            `;

            const blob = new Blob([processorCode], { type: 'application/javascript' });
            const processorUrl = URL.createObjectURL(blob);
            
            await audioCtx.audioWorklet.addModule(processorUrl);
            URL.revokeObjectURL(processorUrl);

            const source = audioCtx.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');
            workletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
                const inputData = event.data; // Float32Array

                // แปลง Float32 เป็น PCM16 Uint8Array
                const pcm16Data = float32ToPCM16(inputData);

                // ส่งข้อมูลไปยัง SimliClient (ตรวจสอบ connection state ก่อน)
                if (client && isClientConnected) {
                    try {
                        client.sendAudioData(pcm16Data);
                        console.log('🎵 Sent:', pcm16Data.length, 'bytes');
                    } catch (error) {
                        console.error('❌ Error sending audio:', error);
                    }
                } else {
                    console.warn('⚠️ Client not connected, skipping chunk');
                }
            };

            source.connect(workletNode);
            workletNode.connect(audioCtx.destination);

            setIsRecording(true);
            console.log('✅ Recording started');
        } catch (err) {
            console.error('❌ Microphone error:', err);
            setMicError(err instanceof Error ? err.message : 'ไม่สามารถเข้าถึงไมโครโฟน');
        }
    };

    // ปุ่ม toggle เปิด/ปิดไมค์
    const handleToggleMic = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Cleanup เมื่อ component ถูก unmount
    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording();
            }
        };
    }, [isRecording]);

    return (
        <div className='w-full'>
            {/* Status Indicator */}
            <div className='mb-6'>
                {isInitializing && (
                    <div className='flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg'>
                        <div className='animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full'></div>
                        <span className='text-sm font-medium text-slate-600 dark:text-slate-300'>
                            Initializing avatar...
                        </span>
                    </div>
                )}
                {!isInitializing && !isClientConnected && (
                    <div className='flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
                        <span className='text-orange-600 dark:text-orange-400 text-lg'>⚠️</span>
                        <span className='text-sm font-medium text-orange-700 dark:text-orange-300'>
                            Avatar not connected. Mic recording will not work.
                        </span>
                    </div>
                )}
                {isClientConnected && (
                    <div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <span className='text-green-600 dark:text-green-400 text-lg'>✅</span>
                        <span className='text-sm font-medium text-green-700 dark:text-green-300'>
                            Avatar connected and ready
                        </span>
                    </div>
                )}
            </div>

            {/* Avatar Video Container */}
            <div className='relative mb-6 flex justify-center'>
                <div className='relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-700 bg-black'>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className='w-full max-w-md aspect-square object-cover'
                    >
                        <track kind="captions" label="Avatar video" />
                    </video>
                    {/* Recording Indicator Overlay */}
                    {isRecording && (
                        <div className='absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-red-500/90 backdrop-blur-sm rounded-full'>
                            <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                            <span className='text-xs font-semibold text-white'>Recording</span>
                        </div>
                    )}
                </div>
            </div>

            <audio ref={audioRef} autoPlay>
                <track kind="captions" label="Avatar audio" />
            </audio>

            {/* Controls Section */}
            <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    <Button 
                        onClick={handleToggleMic} 
                        variant={isRecording ? 'destructive' : 'default'}
                        disabled={!isClientConnected}
                        className='flex items-center gap-2 px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all'
                    >
                        {isRecording ? (
                            <>
                                <span className='text-xl'>🛑</span>
                                <span>Stop Recording</span>
                            </>
                        ) : (
                            <>
                                <span className='text-xl'>🎤</span>
                                <span>Start Recording</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Error Message */}
                {micError && (
                    <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                        <p className='text-sm font-medium text-red-700 dark:text-red-300 text-center'>
                            ❌ {micError}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                {isClientConnected && !isRecording && (
                    <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                        <p className='text-sm text-blue-700 dark:text-blue-300 font-medium'>
                            💡 Click &quot;Start Recording&quot; and speak to interact with the AI assistant
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimliAvatar;

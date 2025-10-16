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
        <div>
            {isInitializing && (
                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '14px' }}>
                    🔄 Initializing avatar...
                </p>
            )}
            {!isInitializing && !isClientConnected && (
                <p style={{ color: '#ff9800', marginBottom: '0.5rem', fontSize: '14px' }}>
                    ⚠️ Avatar not connected. Mic recording will not work.
                </p>
            )}
            {isClientConnected && (
                <p style={{ color: '#4caf50', marginBottom: '0.5rem', fontSize: '14px' }}>
                    ✅ Avatar connected
                </p>
            )}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '300px', height: '300px', border: '1px solid black' }}
            >
                <track kind="captions" label="Avatar video" />
            </video>
            <audio ref={audioRef} autoPlay>
                <track kind="captions" label="Avatar audio" />
            </audio>

            <br />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button onClick={handleSendData} disabled={!client || !isClientConnected}>
                    Send Test Audio
                </Button>
                <Button 
                    onClick={handleToggleMic} 
                    variant={isRecording ? 'destructive' : 'default'}
                    disabled={!isClientConnected}
                >
                    {isRecording ? '🛑 Stop Mic' : '🎤 Start Mic'}
                </Button>
            </div>
            {micError && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '14px' }}>{micError}</p>}
        </div>
    );
};

export default SimliAvatar;

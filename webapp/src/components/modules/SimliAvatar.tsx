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
    
    // 3. State และ Refs สำหรับไมโครโฟน
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    useEffect(() => {
        if (!videoRef.current || !audioRef.current) {
            console.error('Video or Audio ref is not available.');
            return;
        }

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
			model: ''
		});

        simliClient.start();

        simliClient.on('connected', () => {
            setClient(simliClient);
        });

        simliClient.on('failed', () => {
            console.error('SimliClient failed to connect.');
        });

        return () => {
            simliClient.close();
        };
    }, []);

    const handleSendData = () => {
        if (client) {
            const audioData = new Uint8Array(6000).fill(12345);
			console.log(audioData, "test")
            client.sendAudioData(audioData);
        } else {
            console.warn('SimliClient is not connected yet.');
        }
    };

    // ฟังก์ชันหยุดบันทึกเสียง
    const stopRecording = () => {
        setIsRecording(false);
        if (processorRef.current) {
            processorRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        processorRef.current = null;
        audioContextRef.current = null;
        mediaStreamRef.current = null;
        console.log('🛑 Recording stopped');
    };

    // ฟังก์ชันเริ่มบันทึกเสียงจากไมโครโฟน
    const startRecording = async () => {
        if (isRecording) return;
        setMicError(null);
        console.log('🎤 Requesting microphone access...');

        try {
            // ขออนุญาตเข้าถึงไมโครโฟน
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            console.log('✅ Microphone access granted');

            // สร้าง AudioContext
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
            console.log('🔊 AudioContext created, sample rate:', audioCtx.sampleRate);

            const source = audioCtx.createMediaStreamSource(stream);

            // ใช้ ScriptProcessorNode เพื่อจับข้อมูลเสียง
            const bufferSize = 4096;
            const processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0); // Float32Array
                console.log('🎵 Audio chunk received:', {
                    length: inputData.length,
                    sampleRate: audioCtx.sampleRate,
                    firstSamples: Array.from(inputData.slice(0, 10)), // แสดง 10 samples แรก
                    min: Math.min(...inputData),
                    max: Math.max(...inputData),
                });
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);

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
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '300px', height: '300px', border: '1px solid black' }}
            />
            <audio ref={audioRef} autoPlay />

            <br />
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
				<Button onClick={handleSendData} disabled={!client}>
					Send Test Audio
				</Button>
				<Button 
					onClick={handleToggleMic}
					variant={isRecording ? 'destructive' : 'default'}
				>
					{isRecording ? '🛑 Stop Mic' : '🎤 Start Mic'}
				</Button>
			</div>
			{micError && (
				<p style={{ color: 'red', marginTop: '0.5rem', fontSize: '14px' }}>
					{micError}
				</p>
			)}
			
        </div>
    );
};

export default SimliAvatar;

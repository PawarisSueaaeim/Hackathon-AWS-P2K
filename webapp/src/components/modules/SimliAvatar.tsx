'use client';
import { useEffect, useRef, useState } from 'react';
import { SimliClient } from 'simli-client';

const SimliAvatar = () => {
    // 1. สร้าง Ref เพื่ออ้างอิงถึง <video> และ <audio> elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 2. สร้าง State เพื่อเก็บ instance ของ simliClient
    const [client, setClient] = useState<SimliClient | null>(null);

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
    }, []); // Dependency array ว่างเปล่า `[]` หมายถึงให้ useEffect นี้ทำงานครั้งเดียวตอน component โหลดเสร็จ

    // ฟังก์ชันสำหรับส่งข้อมูลเสียง (ตัวอย่าง)
    const handleSendData = () => {
        if (client) {
            const audioData = new Uint8Array(6000).fill(0);
            client.sendAudioData(audioData);
        } else {
            console.warn('SimliClient is not connected yet.');
        }
    };

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
            <button onClick={handleSendData} disabled={!client}>
                Send Test Audio
            </button>
        </div>
    );
};

export default SimliAvatar;

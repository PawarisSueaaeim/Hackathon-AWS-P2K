import SimliAvatar from '@/components/modules/SimliAvatar';
import React from 'react';

export default function Assistants() {
    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950'>
            <div className='container mx-auto px-4 py-12'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4'>
                        AI Voice Assistant
                    </h1>
                    <p className='text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-body'>
                        Experience real-time conversation with our advanced AI avatar. Speak naturally and get instant responses.
                    </p>
                </div>

                {/* Main Content - Avatar Card */}
                <div className='flex justify-center items-center'>
                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-700'>
                        <SimliAvatar />
                    </div>
                </div>
            </div>
        </div>
    );
}

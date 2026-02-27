import React from 'react';

// Floating Background Shapes for empty side spaces on wide screens
const FloatingShapesBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
            {/* Left Side Shapes */}
            <div className="absolute top-[10%] left-[-2%] md:left-[5%] w-32 h-32 bg-pink-400 rounded-2xl rotate-12 opacity-40 blur-[2px] shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),_inset_-10px_-10px_20px_rgba(0,0,0,0.1),_10px_10px_20px_rgba(0,0,0,0.05)] animate-[float_8s_ease-in-out_infinite]"></div>

            <div className="absolute top-[40%] left-[-5%] md:left-[2%] w-48 h-48 bg-blue-300 rounded-full opacity-30 blur-[4px] shadow-[inset_15px_15px_30px_rgba(255,255,255,0.7),_inset_-15px_-15px_30px_rgba(0,0,0,0.1),_15px_15px_30px_rgba(0,0,0,0.05)] animate-[float_12s_ease-in-out_infinite_reverse]"></div>

            <div className="absolute top-[80%] left-[1%] md:left-[8%] w-24 h-24 bg-yellow-300 rounded-[2rem] rotate-45 opacity-50 blur-[1px] shadow-[inset_8px_8px_16px_rgba(255,255,255,0.9),_inset_-8px_-8px_16px_rgba(0,0,0,0.15)] animate-[float_9s_ease-in-out_infinite_1s]"></div>

            {/* Right Side Shapes */}
            <div className="absolute top-[20%] right-[-5%] md:right-[2%] w-40 h-40 bg-green-300 rounded-full opacity-30 blur-[3px] shadow-[inset_12px_12px_24px_rgba(255,255,255,0.7),_inset_-12px_-12px_24px_rgba(0,0,0,0.1)] animate-[float_10s_ease-in-out_infinite_0.5s]"></div>

            <div className="absolute top-[60%] right-[-2%] md:right-[6%] w-28 h-28 bg-orange-300 rounded-3xl -rotate-12 opacity-40 blur-[2px] shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),_inset_-10px_-10px_20px_rgba(0,0,0,0.1)] animate-[float_7s_ease-in-out_infinite_reverse_2s]"></div>

            <div className="absolute top-[90%] right-[0%] md:right-[4%] w-36 h-36 bg-purple-300 rounded-[2.5rem] rotate-[30deg] opacity-20 blur-[5px] shadow-[inset_15px_15px_30px_rgba(255,255,255,0.6)] animate-[float_11s_ease-in-out_infinite]"></div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(10deg); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(FloatingShapesBackground);

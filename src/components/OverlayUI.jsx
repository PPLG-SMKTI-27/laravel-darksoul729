import React from 'react';
import PlasticButton from '../../resources/js/UI/PlasticButton';

const OverlayUI = ({
    phase,
    debug,
    onJumpWide,
    onStepUp,
    onStepDown,
    navLocked = false,
    wideControlsEnabled = false,
    canStepUp = false,
    canStepDown = false,
    smoothedProgress,
    targetProgress,
}) => {
    const inTour = phase === 'tour';

    return (
        <div className="pointer-events-none absolute inset-0 z-20">
            {inTour && (
                <div className="pointer-events-auto absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-4">
                    <PlasticButton
                        color="pink"
                        disabled={!inTour || navLocked}
                        onClick={onJumpWide}
                    >
                        Room Tour
                    </PlasticButton>
                    <PlasticButton
                        color="blue"
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        Home
                    </PlasticButton>
                </div>
            )}

            {inTour && wideControlsEnabled && (
                <div className="pointer-events-auto absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3">
                    <button
                        type="button"
                        onClick={onStepUp}
                        disabled={navLocked || !canStepUp}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/45 bg-slate-900/60 text-2xl font-black text-white shadow-xl backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        onClick={onStepDown}
                        disabled={navLocked || !canStepDown}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/45 bg-slate-900/60 text-2xl font-black text-white shadow-xl backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        ↓
                    </button>
                </div>
            )}

            {inTour && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/35 bg-slate-900/50 px-4 py-2 text-xs text-white/95 backdrop-blur">
                    {wideControlsEnabled ? 'Pakai tombol atas bawah untuk camera tour' : 'Camera settling ke posisi wide...'}
                </div>
            )}

            {debug && (
                <div className="absolute bottom-5 right-5 rounded-xl border border-emerald-300 bg-emerald-950/80 px-4 py-3 text-xs font-mono text-emerald-100">
                    <div>phase: {phase}</div>
                    <div>target: {targetProgress.toFixed(3)}</div>
                    <div>smoothed: {smoothedProgress.toFixed(3)}</div>
                </div>
            )}
        </div>
    );
};

export default OverlayUI;

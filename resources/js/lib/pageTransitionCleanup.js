import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const loseCanvasContexts = () => {
    document.querySelectorAll('canvas').forEach((canvas) => {
        const context = canvas.getContext('webgl2')
            || canvas.getContext('webgl')
            || canvas.getContext('experimental-webgl');

        context?.getExtension('WEBGL_lose_context')?.loseContext();
    });
};

const clearCacheStorage = async () => {
    if (!('caches' in window)) {
        return;
    }

    const cacheKeys = await window.caches.keys();
    await Promise.allSettled(cacheKeys.map((key) => window.caches.delete(key)));
};

export const cleanupPageRuntime = ({ lenis } = {}) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new CustomEvent('app:page-will-change'));
    window.dispatchEvent(new Event('unlock-scroll'));

    lenis?.stop?.();

    ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
    });

    gsap.globalTimeline.getChildren(true, true, true).forEach((animation) => {
        animation.kill();
    });

    document.getAnimations?.().forEach((animation) => {
        animation.cancel();
    });

    loseCanvasContexts();
    window.performance?.clearResourceTimings?.();

    void clearCacheStorage();
};

export const navigateWithCleanup = (href, options = {}) => {
    if (typeof window === 'undefined' || !href) {
        return;
    }

    const targetUrl = new URL(href, window.location.origin);
    const currentUrl = new URL(window.location.href);

    if (
        targetUrl.pathname === currentUrl.pathname
        && targetUrl.search === currentUrl.search
        && targetUrl.hash === currentUrl.hash
    ) {
        return;
    }

    cleanupPageRuntime(options);

    window.setTimeout(() => {
        window.location.assign(targetUrl.toString());
    }, 40);
};

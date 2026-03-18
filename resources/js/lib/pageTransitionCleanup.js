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

    if (typeof window.__APP_NAVIGATE__ === 'function') {
        void window.__APP_NAVIGATE__(targetUrl.toString(), options);
        return;
    }

    cleanupPageRuntime(options);

    window.setTimeout(() => {
        window.location.assign(targetUrl.toString());
    }, 40);
};

export const prefetchRoute = (href) => {
    if (typeof window === 'undefined' || !href || typeof window.__APP_PREFETCH__ !== 'function') {
        return;
    }

    void window.__APP_PREFETCH__(href);
};

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { cleanupPageRuntime } from './lib/pageTransitionCleanup';
import { AdminDesktop, OSContext } from './UI/AdminTerminal';
import { LocalTerminal, LocalAppearance } from './UI/AdminApps';

const LandingPage = React.lazy(() => import('./Pages/LandingPage'));
const About = React.lazy(() => import('./Pages/About'));
const Contact = React.lazy(() => import('./Pages/Contact'));
const Feature = React.lazy(() => import('./Pages/Feature'));
const Skills = React.lazy(() => import('./Pages/Skills'));
const Projects = React.lazy(() => import('./Pages/Projects'));
const Login = React.lazy(() => import('./Pages/Login'));
const Dashboard = React.lazy(() => import('./Pages/Admin/Dashboard'));
const AdminProjects = React.lazy(() => import('./Pages/Admin/AdminProjects'));
const AdminProjectCreate = React.lazy(() => import('./Pages/Admin/AdminProjectCreate'));
const AdminProjectEdit = React.lazy(() => import('./Pages/Admin/AdminProjectEdit'));
const AdminMessages = React.lazy(() => import('./Pages/Admin/AdminMessages'));

const AdminComponents = {
    'Admin/Dashboard': Dashboard,
    'Dashboard': Dashboard,
    'AdminProjects': AdminProjects,
    'AdminProjectCreate': AdminProjectCreate,
    'AdminProjectEdit': AdminProjectEdit,
    'AdminMessages': AdminMessages,
    'LocalTerminal': LocalTerminal,
    'LocalAppearance': LocalAppearance,
};

const isAdminRoute = (page) => page?.startsWith('Admin') || page === 'Dashboard';

const AppLoadingFallback = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 px-8 py-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-500">
                Loading View
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-700">
                Preparing interface...
            </div>
        </div>
    </div>
);

const PREFETCH_ROUTES = ['/', '/about', '/contact', '/skills', '/projects'];

const getRouteCacheKey = (url) => {
    return `${url.pathname}${url.search}`;
};

const extractRoutePayload = (html) => {
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(html, 'text/html');
    const appElement = documentNode.getElementById('app');

    if (!appElement) {
        return null;
    }

    const page = appElement.getAttribute('data-page');
    const rawProps = appElement.getAttribute('data-props');

    if (!page) {
        return null;
    }

    return {
        page,
        props: JSON.parse(rawProps || '{}'),
    };
};

const App = ({ initialPage, initialProps }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [currentProps, setCurrentProps] = useState(initialProps);
    const [windows, setWindows] = useState([]);

    const routeCacheRef = useRef(new Map());
    const navigationControllerRef = useRef(null);

    const closeWindow = useCallback((id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const focusWindow = useCallback((id) => {
        setWindows(prev => {
            const index = prev.findIndex(w => w.id === id);
            if (index === -1 || index === prev.length - 1) return prev;
            const next = [...prev];
            const win = next.splice(index, 1)[0];
            next.push(win);
            return next;
        });
    }, []);

    const setTitle = useCallback((id, title) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, title } : w));
    }, []);

    const cacheCurrentRoute = useCallback((page, props) => {
        const currentUrl = new URL(window.location.href);
        routeCacheRef.current.set(getRouteCacheKey(currentUrl), { page, props });
    }, []);

    useEffect(() => {
        cacheCurrentRoute(initialPage, initialProps);
        if (isAdminRoute(initialPage)) {
            setWindows([{
                id: 'win-root',
                page: initialPage,
                props: initialProps,
                href: window.location.pathname + window.location.search
            }]);
        }
    }, [cacheCurrentRoute, initialPage, initialProps]);

    const applyRoutePayload = useCallback((targetUrl, payload, { replace = false, preserveScroll = false, skipHistory = false } = {}) => {
        setCurrentPage(payload.page);
        setCurrentProps(payload.props ?? {});
        routeCacheRef.current.set(getRouteCacheKey(targetUrl), payload);

        if (!skipHistory) {
            window.history[replace ? 'replaceState' : 'pushState']({ appRoute: getRouteCacheKey(targetUrl) }, '', targetUrl.toString());
        }

        if (!preserveScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, []);

    const fetchRoutePayload = useCallback(async (targetUrl, signal) => {
        const response = await fetch(targetUrl.toString(), {
            credentials: 'same-origin',
            headers: {
                'X-App-Navigation': '1',
                'X-Requested-With': 'XMLHttpRequest',
            },
            signal,
        });

        if (!response.ok) {
            return null;
        }

        const html = await response.text();
        return extractRoutePayload(html);
    }, []);

    const navigate = useCallback(async (href, options = {}) => {
        if (typeof window === 'undefined' || !href) {
            return false;
        }

        if (href.startsWith('#')) {
            const anchor = href.substring(1);
            if (['terminal', 'appearance'].includes(anchor)) {
                const componentName = anchor === 'terminal' ? 'LocalTerminal' : 'LocalAppearance';
                const titleName = anchor === 'terminal' ? 'Terminal Emulator' : 'Display Settings';

                setWindows(prev => {
                    const hrefKey = href;
                    const existingIndex = prev.findIndex(w => w.href === hrefKey);
                    if (existingIndex !== -1) {
                        const next = [...prev];
                        const win = next.splice(existingIndex, 1)[0];
                        next.push(win);
                        return next;
                    }
                    return [...prev, {
                        id: 'win-' + Date.now(),
                        page: componentName,
                        props: {},
                        href: hrefKey,
                        title: titleName
                    }];
                });
                return true;
            }
            return false;
        }

        const targetUrl = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        if (
            targetUrl.origin !== currentUrl.origin
            || targetUrl.protocol !== currentUrl.protocol
        ) {
            window.location.assign(targetUrl.toString());
            return false;
        }

        if (
            targetUrl.pathname === currentUrl.pathname
            && targetUrl.search === currentUrl.search
            && targetUrl.hash === currentUrl.hash
        ) {
            return true;
        }

        const cacheKey = getRouteCacheKey(targetUrl);
        const cachedRoute = routeCacheRef.current.get(cacheKey);

        cleanupPageRuntime(options);

        // Helper to handle routing conditionally
        const processPayload = (targetUrl, payload) => {
            const isAdminTarget = isAdminRoute(payload.page);
            const isAdminCurrent = isAdminRoute(currentPage);

            if (isAdminTarget && isAdminCurrent && options.openNewWindow !== false) {
                // OS Mode Multi-Window Navigation
                setWindows(prev => {
                    const existingIndex = prev.findIndex(w => w.href === targetUrl.pathname + targetUrl.search);
                    if (existingIndex !== -1) {
                        const next = [...prev];
                        const win = next.splice(existingIndex, 1)[0];
                        next.push(win); // Bring to front
                        return next;
                    }
                    return [...prev, {
                        id: 'win-' + Date.now(),
                        page: payload.page,
                        props: payload.props,
                        href: targetUrl.pathname + targetUrl.search
                    }];
                });
                if (!options.skipHistory) {
                    window.history[options.replace ? 'replaceState' : 'pushState']({ appRoute: cacheKey }, '', targetUrl.toString());
                }
                return true;
            }

            // Standard Navigation
            applyRoutePayload(targetUrl, payload, options);
            return true;
        };

        if (cachedRoute) {
            return processPayload(targetUrl, cachedRoute);
        }

        navigationControllerRef.current?.abort?.();
        const controller = new AbortController();
        navigationControllerRef.current = controller;

        try {
            const payload = await fetchRoutePayload(targetUrl, controller.signal);

            if (!payload) {
                window.location.assign(targetUrl.toString());
                return false;
            }

            return processPayload(targetUrl, payload);
        } catch (error) {
            if (controller.signal.aborted) {
                return false;
            }

            window.location.assign(targetUrl.toString());
            return false;
        }
    }, [applyRoutePayload, fetchRoutePayload, currentPage]);

    const prefetchRoute = useCallback(async (href) => {
        if (typeof window === 'undefined' || !href) return;

        const targetUrl = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin !== currentUrl.origin) return;

        const cacheKey = getRouteCacheKey(targetUrl);
        if (routeCacheRef.current.has(cacheKey)) return;

        try {
            const payload = await fetchRoutePayload(targetUrl);
            if (payload) {
                routeCacheRef.current.set(cacheKey, payload);
            }
        } catch (error) {
            // Ignore prefetch failures
        }
    }, [fetchRoutePayload]);

    useEffect(() => {
        window.__APP_NAVIGATE__ = navigate;
        window.__APP_PREFETCH__ = prefetchRoute;

        return () => {
            delete window.__APP_NAVIGATE__;
            delete window.__APP_PREFETCH__;
            navigationControllerRef.current?.abort?.();
        };
    }, [navigate, prefetchRoute]);

    useEffect(() => {
        const handlePopState = () => {
            void navigate(window.location.href, {
                preserveScroll: true,
                replace: true,
                skipHistory: true,
                openNewWindow: false // Important! Popstate should not spawn infinite windows
            });
        };

        const isSameDocumentLink = (targetUrl) => {
            const currentUrl = new URL(window.location.href);

            return targetUrl.origin === currentUrl.origin
                && targetUrl.pathname === currentUrl.pathname
                && targetUrl.search === currentUrl.search
                && targetUrl.hash !== currentUrl.hash;
        };

        const handleDocumentClick = (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = event.target.closest('a[href]');
            if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank') {
                return;
            }

            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#')) return;

            const targetUrl = new URL(anchor.href, window.location.origin);
            if (isSameDocumentLink(targetUrl)) return;
            if (targetUrl.origin !== window.location.origin) return;

            event.preventDefault();
            void navigate(targetUrl.toString());
        };

        const handlePointerPrefetch = (event) => {
            const anchor = event.target.closest('a[href]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#')) return;

            void prefetchRoute(anchor.href);
        };

        window.addEventListener('popstate', handlePopState);
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('pointerenter', handlePointerPrefetch, true);
        document.addEventListener('touchstart', handlePointerPrefetch, true);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('click', handleDocumentClick);
            document.removeEventListener('pointerenter', handlePointerPrefetch, true);
            document.removeEventListener('touchstart', handlePointerPrefetch, true);
        };
    }, [navigate, prefetchRoute]);

    // Load admin OS if the active page dictates so
    if (isAdminRoute(currentPage)) {
        return (
            <Suspense fallback={<AppLoadingFallback />}>
                <AdminDesktop
                    windows={windows}
                    closeWindow={closeWindow}
                    focusWindow={focusWindow}
                    setTitle={setTitle}
                    navigateMenu={navigate}
                >
                    {windows.map(win => {
                        const Component = AdminComponents[win.page];
                        return Component ? <Component key={win.id} windowId={win.id} {...win.props} /> : null;
                    })}
                </AdminDesktop>
            </Suspense>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'LandingPage': return <LandingPage page={currentPage} props={currentProps} />;
            case 'About': return <About page={currentPage} />;
            case 'Contact': return <Contact page={currentPage} />;
            case 'Feature': return <Feature page={currentPage} />;
            case 'Skills': return <Skills page={currentPage} />;
            case 'Projects': return <Projects page={currentPage} props={currentProps} />;
            case 'Login': return <Login page={currentPage} />;
            default:
                return (
                    <div className="flex items-center justify-center min-h-screen bg-red-100">
                        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
                            <h1 className="text-4xl font-black text-rose-500 mb-4">404</h1>
                            <p className="font-bold text-slate-500">Page "{currentPage}" not found.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Suspense fallback={<AppLoadingFallback />}>
            {renderPage()}
        </Suspense>
    );
};

export default App;

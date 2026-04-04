import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cleanupPageRuntime } from './lib/pageTransitionCleanup';

const pageLoaders = {
    LandingPage: () => import('./Pages/LandingPage'),
    About: () => import('./Pages/About'),
    Contact: () => import('./Pages/Contact'),
    Feature: () => import('./Pages/Feature'),
    Skills: () => import('./Pages/Skills'),
    Projects: () => import('./Pages/Projects'),
    Login: () => import('./Pages/Login'),
};

const adminModuleLoaders = {
    'Admin/Dashboard': () => import('./Pages/Admin/Dashboard'),
    Dashboard: () => import('./Pages/Admin/Dashboard'),
    AdminProjects: () => import('./Pages/Admin/AdminProjects'),
    AdminProjectCreate: () => import('./Pages/Admin/AdminProjectCreate'),
    AdminProjectEdit: () => import('./Pages/Admin/AdminProjectEdit'),
    AdminMessages: () => import('./Pages/Admin/AdminMessages'),
    LocalTerminal: () => import('./UI/AdminApps').then((module) => ({ default: module.LocalTerminal })),
    LocalAppearance: () => import('./UI/AdminApps').then((module) => ({ default: module.LocalAppearance })),
};

const loadAdminDesktop = () => import('./UI/AdminTerminal').then((module) => ({ default: module.AdminDesktop }));

const moduleCache = new Map();

const resolveDefaultExport = (module) => module.default || module;

const loadCachedModule = async (cacheKey, loader) => {
    const cachedModule = moduleCache.get(cacheKey);
    if (cachedModule) {
        return cachedModule;
    }

    const loadedModule = resolveDefaultExport(await loader());
    moduleCache.set(cacheKey, loadedModule);
    return loadedModule;
};

const loadPageComponent = async (page) => {
    const loader = pageLoaders[page];
    if (!loader) {
        return null;
    }

    return loadCachedModule(`page:${page}`, loader);
};

const loadAdminComponent = async (page) => {
    const loader = adminModuleLoaders[page];
    if (!loader) {
        return null;
    }

    return loadCachedModule(`admin:${page}`, loader);
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
    const [resolvedPageComponent, setResolvedPageComponent] = useState(null);
    const [resolvedAdminDesktop, setResolvedAdminDesktop] = useState(null);
    const [resolvedAdminComponents, setResolvedAdminComponents] = useState({});

    const routeCacheRef = useRef(new Map());
    const navigationControllerRef = useRef(null);

    const bringWindowToFront = useCallback((windowList, id, updates = {}) => {
        const index = windowList.findIndex((windowItem) => windowItem.id === id);
        if (index === -1) {
            return windowList;
        }

        const nextWindows = [...windowList];
        const activeWindow = {
            ...nextWindows.splice(index, 1)[0],
            ...updates,
        };

        nextWindows.push(activeWindow);

        return nextWindows;
    }, []);

    const closeWindow = useCallback((id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const focusWindow = useCallback((id) => {
        setWindows(prev => bringWindowToFront(prev, id, { isMinimized: false }));
    }, [bringWindowToFront]);

    const minimizeWindow = useCallback((id) => {
        setWindows(prev => {
            const index = prev.findIndex((windowItem) => windowItem.id === id);
            if (index === -1) {
                return prev;
            }

            const nextWindows = [...prev];
            nextWindows[index] = {
                ...nextWindows[index],
                isMinimized: true,
            };

            return nextWindows;
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

    useEffect(() => {
        let isCancelled = false;

        if (isAdminRoute(currentPage)) {
            setResolvedPageComponent(null);

            void loadAdminDesktop().then((component) => {
                if (!isCancelled) {
                    setResolvedAdminDesktop(() => component);
                }
            });

            return () => {
                isCancelled = true;
            };
        }

        setResolvedAdminDesktop(null);
        setResolvedPageComponent(null);

        void loadPageComponent(currentPage).then((component) => {
            if (!isCancelled) {
                setResolvedPageComponent(() => component);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [currentPage]);

    useEffect(() => {
        if (!isAdminRoute(currentPage)) {
            return undefined;
        }

        const pendingWindowPages = [...new Set(windows.map((windowItem) => windowItem.page))].filter((page) => !resolvedAdminComponents[page]);

        if (pendingWindowPages.length === 0) {
            return undefined;
        }

        let isCancelled = false;

        void Promise.all(
            pendingWindowPages.map(async (page) => [page, await loadAdminComponent(page)]),
        ).then((entries) => {
            if (isCancelled) {
                return;
            }

            setResolvedAdminComponents((current) => {
                const next = { ...current };
                entries.forEach(([page, component]) => {
                    if (component) {
                        next[page] = component;
                    }
                });
                return next;
            });
        });

        return () => {
            isCancelled = true;
        };
    }, [currentPage, resolvedAdminComponents, windows]);

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
                if (isAdminRoute(payload.page)) {
                    void loadAdminDesktop();
                    void loadAdminComponent(payload.page);
                } else {
                    void loadPageComponent(payload.page);
                }
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

            const target = event.target instanceof Element ? event.target : null;
            if (!target) {
                return;
            }

            const anchor = target.closest('a[href]');
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
            const target = event.target instanceof Element ? event.target : null;
            if (!target) {
                return;
            }

            const anchor = target.closest('a[href]');
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
        const AdminDesktop = resolvedAdminDesktop;

        if (!AdminDesktop) {
            return <AppLoadingFallback />;
        }

        return (
            <AdminDesktop
                windows={windows}
                closeWindow={closeWindow}
                focusWindow={focusWindow}
                minimizeWindow={minimizeWindow}
                setTitle={setTitle}
                navigateMenu={navigate}
            >
                {windows.filter((win) => !win.isMinimized).map(win => {
                    const Component = resolvedAdminComponents[win.page];
                    return Component ? <Component key={win.id} windowId={win.id} {...win.props} /> : null;
                })}
            </AdminDesktop>
        );
    }

    if (!pageLoaders[currentPage]) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-red-100">
                <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
                    <h1 className="mb-4 text-4xl font-black text-rose-500">404</h1>
                    <p className="font-bold text-slate-500">Page "{currentPage}" not found.</p>
                </div>
            </div>
        );
    }

    if (!resolvedPageComponent) {
        return <AppLoadingFallback />;
    }

    const PageComponent = resolvedPageComponent;
    return <PageComponent page={currentPage} props={currentProps} />;
};

export default App;

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>

<script>
    /**
     * =============================================================================
     * SYSTEM INITIALIZATION
     * =============================================================================
     */
    
    /**
     * =============================================================================
     * SYSTEM INITIALIZATION
     * =============================================================================
     */
    
    // Register Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Global State for Cleanup
    window.appState = window.appState || {
        animationFrameId: null,
        isMenuOpen: false
    };

    /**
     * =============================================================================
     * RE-USABLE FUNCTIONS
     * =============================================================================
     */
    function getDOM() {
        return {
            menuToggle: document.getElementById('menu-toggle'),
            mobileMenu: document.getElementById('mobile-menu'),
            mobileLinks: document.querySelectorAll('.mobile-link'),
            cursor: {
                dot: document.getElementById('cursor-dot'),
                ring: document.getElementById('cursor-ring')
            },
            transition: {
                overlay: document.getElementById('transition-overlay'),
                content: document.querySelector('main') // Target the main content for zoom
            }
        };
    }

    /**
     * WEBGL FLUID BACKGROUND
     */
    function initWebGL() {
        const canvas = document.getElementById("webgl-canvas");
        if(!canvas) return;

        // Cleanup old loop
        if (window.appState.animationFrameId) {
            cancelAnimationFrame(window.appState.animationFrameId);
        }

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        // Resize
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        // Shaders
        const vsSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;

            // Simple Noise function
            float random (in vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            // Noise based on Morgan McGuire @morgan3d
            float noise (in vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);

                // Four corners in 2D of a tile
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));

                vec2 u = f * f * (3.0 - 2.0 * f);

                return mix(a, b, u.x) +
                        (c - a)* u.y * (1.0 - u.x) +
                        (d - b) * u.x * u.y;
            }

            #define OCTAVES 6
            float fbm (in vec2 st) {
                float value = 0.0;
                float amplitude = .5;
                float frequency = 0.;
                for (int i = 0; i < OCTAVES; i++) {
                    value += amplitude * noise(st);
                    st *= 2.;
                    amplitude *= .5;
                }
                return value;
            }

            void main() {
                vec2 st = gl_FragCoord.xy/u_resolution.xy;
                st.x *= u_resolution.x/u_resolution.y;

                vec2 mouse = u_mouse/u_resolution.xy;
                mouse.x *= u_resolution.x/u_resolution.y;
                
                // Interaction
                float dist = distance(st, mouse);
                float interaction = smoothstep(0.5, 0.0, dist) * 0.5;

                vec2 q = vec2(0.);
                q.x = fbm( st + 0.00*u_time);
                q.y = fbm( st + vec2(1.0));

                vec2 r = vec2(0.);
                r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time + interaction );
                r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

                float f = fbm(st+r);

                vec3 color = mix(vec3(0.101961,0.619608,0.666667),
                                vec3(0.666667,0.666667,0.498039),
                                clamp((f*f)*4.0,0.0,1.0));

                color = mix(color,
                            vec3(0,0,0.164706),
                            clamp(length(q),0.0,1.0));

                color = mix(color,
                            vec3(0.666667,1,1),
                            clamp(length(r.x),0.0,1.0));

                // Convert to Grayscale/Mist
                float gray = dot(color, vec3(0.299, 0.587, 0.114));
                
                // Final output - misty white/grey smoke
                gl_FragColor = vec4(vec3(gray), (f * f * f + .6 * f * f + .5 * f) * 0.3);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const timeUniformLocation = gl.getUniformLocation(program, "u_time");
        const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]), gl.STATIC_DRAW);

        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = window.innerHeight - e.clientY; // Invert Y for WebGL
        });

        function render(time) {
            time *= 0.001; // convert to seconds

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.useProgram(program);

            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeUniformLocation, time);
            gl.uniform2f(mouseUniformLocation, mouseX, mouseY);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            window.appState.animationFrameId = requestAnimationFrame(render);
        }
        window.appState.animationFrameId = requestAnimationFrame(render);
    }

    function initInteractions() {
        const DOM = getDOM();
        
        // Menu Toggle
        if(DOM.menuToggle) {
             // Clean old listeners if needed (cloneNode?) or just rely on fresh element
             // Since body is swapped, DOM.menuToggle IS a new element.
             DOM.menuToggle.onclick = () => {
                window.appState.isMenuOpen = !window.appState.isMenuOpen;
                if (window.appState.isMenuOpen) {
                    DOM.mobileMenu.classList.add('active');
                    gsap.fromTo('.mobile-link', 
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.2 }
                    );
                    DOM.menuToggle.children[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                    DOM.menuToggle.children[1].style.opacity = "0";
                    DOM.menuToggle.children[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
                } else {
                    DOM.mobileMenu.classList.remove('active');
                    DOM.menuToggle.children[0].style.transform = "none";
                    DOM.menuToggle.children[1].style.opacity = "1";
                    DOM.menuToggle.children[2].style.transform = "none";
                }
            };
        }

        // Mobile Links
        if(DOM.mobileLinks) {
            DOM.mobileLinks.forEach(link => {
                link.onclick = () => {
                    window.appState.isMenuOpen = false;
                    DOM.mobileMenu.classList.remove('active');
                    DOM.menuToggle.children[0].style.transform = "none";
                    DOM.menuToggle.children[1].style.opacity = "1";
                    DOM.menuToggle.children[2].style.transform = "none";
                };
            });
        }
        
        // Hover effects
        document.querySelectorAll('a, button, .hoverable').forEach(el => {
            el.onmouseenter = () => document.body.classList.add('hovering');
            el.onmouseleave = () => document.body.classList.remove('hovering');
        });
    }

    function playEntranceAnimation() {
        const newDOM = getDOM();
        ScrollTrigger.refresh();

        if (newDOM.transition.overlay) {
            const tl = gsap.timeline();
            
            // Set initial state for "Tunnel Enter"
            // Overlay is already visible (opacity 1) from HTML or Exit animation
            // Content should start slightly zoomed in? Or just normal? 
            // For Tunnel Enter: Content starts zoomed IN (coming towards you) or Normal?
            // Let's do: Start Scale 1.1 -> Scale 1. 
            
            if(newDOM.transition.content) {
                gsap.set(newDOM.transition.content, { scale: 1.1, opacity: 0 });
            }

            // Sequence:
            // 1. Content appears (fades in while scaling down to 1)
            // 2. Overlay fades out concurrently
            
            tl.to(newDOM.transition.content, {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.1
            }, 0)
            .to(newDOM.transition.overlay, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
                pointerEvents: "none"
            }, 0);
        }
    }

    function playExitAnimation(onComplete) {
        const dom = getDOM();
        
        // TUNNEL EXIT: 
        // 1. Current Content scales DOWN (receding into darkness) and fades out
        // 2. Overlay fades IN
        
        const tl = gsap.timeline({
            onComplete: onComplete
        });

        if(dom.transition.overlay) {
            tl.to(dom.transition.overlay, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut",
                pointerEvents: "all" // Block clicks
            }, 0);
        }

        if(dom.transition.content) {
            tl.to(dom.transition.content, {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in"
            }, 0);
        }
    }

    /**
     * =============================================================================
     * MAIN EXECUTION (GUARDED)
     * =============================================================================
     */
    if (!window.HTMX_INIT) {
        window.HTMX_INIT = true;
        
        console.log("Initializing Global HTMX Listeners...");

        // 1. GLOBAL CURSOR FOLLOWER
        // This is on window, so we attach ONCE.
        // It must query IDs dynamically to support swapped DOM.
        window.addEventListener('mousemove', (e) => {
            const dot = document.getElementById('cursor-dot');
            const ring = document.getElementById('cursor-ring');
            if(dot) gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            if(ring) gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4 });
        });

        // 2. HTMX HOOKS FOR TRANSITIONS
        
        // Before Request: Trigger Exit Animation
        document.body.addEventListener('htmx:beforeRequest', (e) => {
            // We need to pause the request until animation is done? 
            // OR just let it load in background, but don't swap until animation done?
            // HTMX doesn't swap until the request returns. 
            // If the request is fast, we might see a jump.
            // If the request is slow, the animation finishes and we wait.
            
            // To ensure animation plays fully, we can use the 'htmx:confirm' event but that prompts.
            // Better: Let's just play animation. If the load is super fast (local), 
            // we might cut the animation short. 
            // FOR SMOOTHNESS WITH HTMX:
            // We can prevent default, play animation, then issuance request? 
            // Issue: Reference to element triggering request is complex to re-trigger.
            
            // Simple approach for now (since it's a "Cyber" theme, fast is okay):
            // Start exit animation immediately.
            // If content arrives, HTMX will swap.
            // We use 'htmx:beforeSwap' to ensure overlay is fully opaque if possible?
            // Actually, let's just run it. 
            
            // NOTE: If you click a link, HTMX request starts.
            // We play exit animation. 
            
            // FORCE Overlay visible immediately if needed or just animate
            playExitAnimation(() => {
                // Animation Done
                console.log("Exit Animation Complete");
            });
        });

        // 2. HTMX SWAP HANDLER
        document.addEventListener('htmx:afterSwap', (event) => {
            console.log("HTMX Content Swapped. Re-initializing...");
            initWebGL();
            initInteractions();
            playEntranceAnimation();
        });

        // 3. INITIAL LOAD HANDLER
        window.addEventListener('DOMContentLoaded', () => {
            initWebGL();
            initInteractions();
            playEntranceAnimation();
        });

    } else {
        // Script re-executed by HTMX Swap?
        // Usually we don't need to do anything because htmx:afterSwap handles it.
        // But if HTMX executes this inline script *after* the swap event, we duplicate logic?
        // HTMX swap flow: Request -> Swap -> settle -> afterSwap.
        // Scripts execute during swap/settle.
        // So global listener is already there. It will fire.
        // So we do NOTHING here.
        console.log("Script re-loaded via HTMX. Global listener handles init.");
    }
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>

<script>
    /**
     * =============================================================================
     * SYSTEM INITIALIZATION
     * =============================================================================
     */
    
    // Register Plugins
    gsap.registerPlugin(ScrollTrigger);

    // State Management
    const state = {
        isMenuOpen: false,
        isLoading: true
    };

    // DOM Elements
    const getDOM = () => ({
        menuToggle: document.getElementById('menu-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileLinks: document.querySelectorAll('.mobile-link'),
        cursor: {
            dot: document.getElementById('cursor-dot'),
            ring: document.getElementById('cursor-ring')
        },
        transition: {
            top: document.getElementById('transition-top'),
            bottom: document.getElementById('transition-bottom')
        }
    });

    /**
     * =============================================================================
     * PAGE TRANSITION (COMIC TEAR)
     * =============================================================================
     */
    function initPageTransition() {
        const DOM = getDOM();
        if (!DOM.transition.top || !DOM.transition.bottom) return;

        // 1. REVEAL (PAGE LOAD)
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut", duration: 0.8 } });
        
        // Start from closed state (center)
        gsap.set(DOM.transition.top, { y: '0%' });
        gsap.set(DOM.transition.bottom, { y: '0%' });

        // Animate Open (Tear apart)
        // Move further than 100% to account for jagged edges (~12 tailwind units)
        // 130% should be sufficient to clear the edges on all viewports
        tl.to(DOM.transition.top, { y: '-130%', delay: 0.2 })
          .to(DOM.transition.bottom, { y: '130%' }, "<"); 

        // 2. NAVIGATE (LINK CLICK)
        document.querySelectorAll('a').forEach(link => {
            // Ignore anchors, external links, and target blank
            if (link.hostname === window.location.hostname && 
                link.getAttribute('href').indexOf('#') !== 0 && 
                link.getAttribute('target') !== '_blank') {
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.href;

                    // Animate Close (Chomp shut)
                    const leaveTl = gsap.timeline({ 
                        defaults: { ease: "power4.inOut", duration: 0.6 },
                        onComplete: () => window.location.href = target
                    });

                    leaveTl.to(DOM.transition.top, { y: '0%' })
                           .to(DOM.transition.bottom, { y: '0%' }, "<");
                });
            }
        });
    }

    /**
     * =============================================================================
     * UI INTERACTIONS (MENU & CURSOR)
     * =============================================================================
     */
    
    window.addEventListener('DOMContentLoaded', () => {
        const DOM = getDOM();
        initPageTransition();
        
        // Custom Cursor Logic

        // Custom Cursor Logic
        window.addEventListener('mousemove', (e) => {
            if(DOM.cursor.dot) gsap.to(DOM.cursor.dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            if(DOM.cursor.ring) gsap.to(DOM.cursor.ring, { x: e.clientX, y: e.clientY, duration: 0.4 });
        });

        document.querySelectorAll('a, button, .hoverable').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        // Mobile Menu Toggle
        if(DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', () => {
                state.isMenuOpen = !state.isMenuOpen;
                
                if (state.isMenuOpen) {
                    DOM.mobileMenu.classList.add('active');
                    // Animate links in
                    gsap.fromTo('.mobile-link', 
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.2 }
                    );
                    // Burger animation
                    DOM.menuToggle.children[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                    DOM.menuToggle.children[1].style.opacity = "0";
                    DOM.menuToggle.children[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
                } else {
                    DOM.mobileMenu.classList.remove('active');
                    // Burger reset
                    DOM.menuToggle.children[0].style.transform = "none";
                    DOM.menuToggle.children[1].style.opacity = "1";
                    DOM.menuToggle.children[2].style.transform = "none";
                }
            });
        }

        // Close menu on link click
        if(DOM.mobileLinks) {
            DOM.mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    state.isMenuOpen = false;
                    DOM.mobileMenu.classList.remove('active');
                    DOM.menuToggle.children[0].style.transform = "none";
                    DOM.menuToggle.children[1].style.opacity = "1";
                    DOM.menuToggle.children[2].style.transform = "none";
                });
            });
        }
    });

    /**
     * =============================================================================
     * WEBGL FLUID BACKGROUND SIMULATION
     * =============================================================================
     */
    const canvas = document.getElementById("webgl-canvas");
    if(canvas) {
        // Only init if canvas exists
        const gl = canvas.getContext("webgl");

        function initWebGL() {
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

                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }
        initWebGL();
    }
</script>

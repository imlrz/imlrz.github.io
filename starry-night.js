/**
 * Starry Night – Canvas particle system
 * Inspired by Van Gogh's "The Starry Night"
 *
 * Features:
 *   - Crescent moon with radial glow
 *   - Multi-layer stars (bright / gold / pale-blue / dim)
 *   - Fixed vortex centers that auto-swirl particles
 *   - Gentle mouse rotational influence
 *   - Per-particle twinkling
 *   - Brush-stroke trailing tails
 *   - Occasional shooting stars
 *   - Scroll-responsive dimming for readability
 */
;(function () {
    'use strict';

    /* ── Canvas setup ── */
    const canvas = document.getElementById('starry-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const raf =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) { setTimeout(fn, 1000 / 60); };

    let W, H;                       // canvas dimensions
    let mouse = { x: null, y: null };
    let stars = [];
    let shootingStars = [];
    let vortexCenters = [];
    let time = 0;
    let scrollDim = 1;              // 1 = full brightness, dims when user scrolls

    /* ── Colour palette ── */
    const PAL = {
        gold:       [253, 230, 138],
        brightGold: [255, 210, 60],
        white:      [255, 255, 245],
        paleBlue:   [170, 200, 255],
    };

    /* ================================================================
       Resize & Vortex layout
       ================================================================ */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;

        // Place fixed swirl centres (like Van Gogh's spirals)
        vortexCenters = [
            { x: W * 0.25, y: H * 0.22, str:  0.70, r: W * 0.16 },
            { x: W * 0.62, y: H * 0.14, str: -0.55, r: W * 0.14 },
            { x: W * 0.45, y: H * 0.48, str:  0.45, r: W * 0.18 },
            { x: W * 0.12, y: H * 0.60, str: -0.35, r: W * 0.12 },
            { x: W * 0.80, y: H * 0.38, str:  0.60, r: W * 0.15 },
        ];
    }

    /* ================================================================
       Star factory
       ================================================================ */
    function makeStar() {
        const rnd = Math.random();
        let col, sz, spd;

        if (rnd < 0.04) {                       // 4% large bright white
            col = PAL.white;  sz = 2.2 + Math.random() * 2.8;  spd = 0.25;
        } else if (rnd < 0.14) {                 // 10% pale blue
            col = PAL.paleBlue;  sz = 1 + Math.random() * 1.8;  spd = 0.40;
        } else if (rnd < 0.32) {                 // 18% bright gold
            col = PAL.brightGold;  sz = 1 + Math.random() * 2.2;  spd = 0.35;
        } else {                                 // 68% standard gold
            col = PAL.gold;  sz = 0.4 + Math.random() * 1.6;  spd = 0.50;
        }

        return {
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - 0.5) * spd,
            vy: (Math.random() - 0.5) * spd,
            size:     sz,
            baseSize: sz,
            color:    col,
            twinkleK: 0.018 + Math.random() * 0.035,   // speed of twinkle
            twinkleP: Math.random() * Math.PI * 2,      // phase
            trail:    [],
            maxTrail: 12 + Math.floor(Math.random() * 18),
        };
    }

    function initStars() {
        const count = Math.min(280, Math.floor((W * H) / 5200));
        stars = [];
        for (let i = 0; i < count; i++) stars.push(makeStar());
    }

    /* ================================================================
       Shooting star
       ================================================================ */
    function spawnShootingStar() {
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.6;
        const speed = 10 + Math.random() * 10;
        return {
            x:  Math.random() * W * 0.8,
            y:  Math.random() * H * 0.35,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.014 + Math.random() * 0.012,
            trail: [],
            maxTrail: 28,
            size: 1.4 + Math.random() * 1.2,
        };
    }

    /* ================================================================
       Draw – Moon
       ================================================================ */
    function drawMoon() {
        const mx = W * 0.84;
        const my = H * 0.13;
        const mr = Math.min(W, H) * 0.055;

        // Outer glow layers
        const g1 = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 5);
        g1.addColorStop(0, `rgba(253,230,138,${0.12 * scrollDim})`);
        g1.addColorStop(0.35, `rgba(253,230,138,${0.04 * scrollDim})`);
        g1.addColorStop(1, 'rgba(253,230,138,0)');
        ctx.beginPath();
        ctx.arc(mx, my, mr * 5, 0, Math.PI * 2);
        ctx.fillStyle = g1;
        ctx.fill();

        // Moon body
        const g2 = ctx.createRadialGradient(
            mx - mr * 0.25, my - mr * 0.25, 0,
            mx, my, mr
        );
        g2.addColorStop(0, `rgba(255,252,228,${0.92 * scrollDim})`);
        g2.addColorStop(0.6, `rgba(253,230,138,${0.88 * scrollDim})`);
        g2.addColorStop(1, `rgba(235,200,100,${0.75 * scrollDim})`);
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fillStyle = g2;
        ctx.fill();

        // Crescent shadow
        ctx.beginPath();
        ctx.arc(mx + mr * 0.38, my - mr * 0.08, mr * 0.82, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,22,40,${0.88 * scrollDim})`;
        ctx.fill();
    }

    /* ================================================================
       Physics update
       ================================================================ */
    function update() {
        time += 0.016;   // ~60 fps tick

        // Maybe spawn a shooting star
        if (Math.random() < 0.0025 && shootingStars.length < 2) {
            shootingStars.push(spawnShootingStar());
        }

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // ── Twinkling ──
            s.size = s.baseSize *
                (0.65 + 0.35 * Math.sin(time * s.twinkleK * 60 + s.twinkleP));

            // ── Vortex forces (automatic swirl) ──
            for (let v = 0; v < vortexCenters.length; v++) {
                const vt = vortexCenters[v];
                const dx = s.x - vt.x;
                const dy = s.y - vt.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < vt.r && d > 1) {
                    const f = (1 - d / vt.r) * vt.str * 0.25;
                    // tangential (rotation)
                    s.vx += (-dy / d) * f;
                    s.vy += ( dx / d) * f;
                    // slight centripetal pull
                    s.vx -= (dx / d) * f * 0.08;
                    s.vy -= (dy / d) * f * 0.08;
                }
            }

            // ── Mouse influence (gentle rotation) ──
            if (mouse.x !== null) {
                const dx = s.x - mouse.x;
                const dy = s.y - mouse.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 280 && d > 1) {
                    const f = (1 - d / 280) * 0.45;
                    s.vx += (-dy / d) * f;
                    s.vy += ( dx / d) * f;
                }
            }

            // ── Damping ──
            s.vx *= 0.975;
            s.vy *= 0.975;

            // ── Move ──
            s.x += s.vx;
            s.y += s.vy;

            // ── Wrap edges (clear trail on wrap to avoid cross-screen lines) ──
            let wrapped = false;
            if (s.x < -20)     { s.x += W + 40; wrapped = true; }
            if (s.x > W + 20)  { s.x -= W + 40; wrapped = true; }
            if (s.y < -20)     { s.y += H + 40; wrapped = true; }
            if (s.y > H + 20)  { s.y -= H + 40; wrapped = true; }
            if (wrapped) s.trail.length = 0;

            // ── Trail ──
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > s.maxTrail) s.trail.shift();
        }

        // ── Shooting stars ──
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            ss.x += ss.vx;
            ss.y += ss.vy;
            ss.life -= ss.decay;
            ss.trail.push({ x: ss.x, y: ss.y, a: ss.life });
            if (ss.trail.length > ss.maxTrail) ss.trail.shift();
            if (ss.life <= 0) shootingStars.splice(i, 1);
        }
    }

    /* ================================================================
       Draw
       ================================================================ */
    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Moon
        drawMoon();

        const dim = scrollDim;   // local copy

        // ── Star trails (brush-stroke feel) ──
        for (let i = 0; i < stars.length; i++) {
            const s   = stars[i];
            const t   = s.trail;
            const len = t.length;
            if (len < 2) continue;

            for (let j = 1; j < len; j++) {
                // Skip segments that span too far (safety net for edge wraps)
                const segDx = t[j].x - t[j - 1].x;
                const segDy = t[j].y - t[j - 1].y;
                if (segDx * segDx + segDy * segDy > 10000) continue;   // > ~100px

                const progress = j / len;                         // 0→1
                const alpha    = progress * 0.35 * dim;
                const lw       = s.size * progress * 1.6;
                ctx.beginPath();
                ctx.moveTo(t[j - 1].x, t[j - 1].y);
                ctx.lineTo(t[j].x, t[j].y);
                ctx.strokeStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
                ctx.lineWidth   = lw;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }

            // ── Star body ──
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${0.9 * dim})`;
            ctx.fill();

            // ── Glow for larger stars ──
            if (s.baseSize > 2) {
                const gr = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
                gr.addColorStop(0, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${0.25 * dim})`);
                gr.addColorStop(1, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},0)`);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
                ctx.fillStyle = gr;
                ctx.fill();
            }
        }

        // ── Shooting stars ──
        for (let i = 0; i < shootingStars.length; i++) {
            const ss = shootingStars[i];
            const t  = ss.trail;
            for (let j = 1; j < t.length; j++) {
                const alpha = (j / t.length) * t[j].a * 0.85 * dim;
                const lw    = ss.size * (j / t.length);
                ctx.beginPath();
                ctx.moveTo(t[j - 1].x, t[j - 1].y);
                ctx.lineTo(t[j].x, t[j].y);
                ctx.strokeStyle = `rgba(255,255,240,${alpha})`;
                ctx.lineWidth   = lw;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }
        }
    }

    /* ================================================================
       Animation loop
       ================================================================ */
    function loop() {
        update();
        draw();
        raf(loop);
    }

    /* ================================================================
       Event listeners
       ================================================================ */
    window.addEventListener('resize', () => { resize(); initStars(); });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Dim stars slightly when user scrolls into the content area
    window.addEventListener('scroll', () => {
        const vh = window.innerHeight;
        scrollDim = Math.max(0.35, 1 - window.scrollY / (vh * 1.8));
    }, { passive: true });

    /* ── Boot ── */
    resize();
    initStars();
    loop();
})();

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected into <head>)
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0b0b0f;
      --gold:     #c2a86f;
      --gold-dim: #7a6240;
      --crimson:  #6e1f1f;
      --stone:    #7a7a7a;
      --fog:      rgba(180,160,120,0.04);
      --white:    #e8e0d0;
      --white-dim:#a09888;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--white);
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      overflow-x: hidden;
      cursor: default;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb { background: var(--gold-dim); }

    /* Utility: noise grain overlay */
    .grain::after {
      content: '';
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 2;
      mix-blend-mode: overlay;
      opacity: 0.6;
    }

    /* Scroll reveal states */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 1.2s cubic-bezier(.16,1,.3,1), transform 1.2s cubic-bezier(.16,1,.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-50px); transition: opacity 1.4s cubic-bezier(.16,1,.3,1), transform 1.4s cubic-bezier(.16,1,.3,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(50px); transition: opacity 1.4s cubic-bezier(.16,1,.3,1), transform 1.4s cubic-bezier(.16,1,.3,1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }
    .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 1.6s cubic-bezier(.16,1,.3,1), transform 1.6s cubic-bezier(.16,1,.3,1); }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    /* Delay helpers */
    .delay-1 { transition-delay: 0.15s !important; }
    .delay-2 { transition-delay: 0.3s !important; }
    .delay-3 { transition-delay: 0.5s !important; }
    .delay-4 { transition-delay: 0.7s !important; }
    .delay-5 { transition-delay: 0.9s !important; }

    /* Hero title animation */
    @keyframes heroFadeIn {
      0%   { opacity: 0; letter-spacing: 0.5em; transform: translateY(20px); }
      100% { opacity: 1; letter-spacing: 0.12em; transform: translateY(0); }
    }
    @keyframes heroSubFade {
      0%   { opacity: 0; transform: translateY(10px); }
      100% { opacity: 0.65; transform: translateY(0); }
    }
    @keyframes dividerExpand {
      0%   { width: 0; opacity: 0; }
      100% { width: 120px; opacity: 1; }
    }
    @keyframes slowZoom {
      0%   { transform: scale(1); }
      100% { transform: scale(1.12); }
    }
    @keyframes fogDrift {
      0%   { transform: translateX(0) translateY(0); opacity: 0.3; }
      50%  { transform: translateX(30px) translateY(-15px); opacity: 0.6; }
      100% { transform: translateX(0) translateY(0); opacity: 0.3; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes waterFlow {
      0%   { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    @keyframes runeGlow {
      0%, 100% { text-shadow: 0 0 20px rgba(194,168,111,0.3); }
      50%       { text-shadow: 0 0 60px rgba(194,168,111,0.7), 0 0 100px rgba(194,168,111,0.3); }
    }
    @keyframes columnRise {
      0%   { transform: translateY(60px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes scrollCue {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50%       { transform: translateY(8px); opacity: 1; }
    }
    @keyframes breathe {
      0%, 100% { transform: scaleY(1); }
      50%       { transform: scaleY(1.04); }
    }

    .hero-title {
      animation: heroFadeIn 3s cubic-bezier(.16,1,.3,1) 0.5s both;
    }
    .hero-sub {
      animation: heroSubFade 2.5s ease 2s both;
    }
    .hero-divider {
      animation: dividerExpand 2s ease 1.8s both;
    }
    .hero-bg {
      animation: slowZoom 25s ease-in-out infinite alternate;
    }
    .fog-layer {
      animation: fogDrift var(--dur, 12s) ease-in-out infinite;
    }
    .scroll-cue {
      animation: scrollCue 2s ease-in-out infinite;
    }
    .gold-shimmer {
      background: linear-gradient(90deg, var(--gold) 0%, #f0d898 40%, var(--gold) 60%, var(--gold-dim) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 6s linear infinite;
    }
    .rune-glow { animation: runeGlow 4s ease-in-out infinite; }

    /* Horizontal rule ornament */
    .ornament {
      display: flex; align-items: center; gap: 16px; justify-content: center;
    }
    .ornament::before, .ornament::after {
      content: ''; flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold));
    }
    .ornament::after { background: linear-gradient(90deg, var(--gold), transparent); }

    /* Stone column visual */
    .column {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .column-drum {
      width: 100%; background: linear-gradient(180deg, #3a3530 0%, #2a2520 50%, #3a3530 100%);
      border-left: 2px solid #4a4540; border-right: 2px solid #1a1510;
      position: relative;
    }
    .column-drum::after {
      content: ''; position: absolute; top: 50%; left: 0; right: 0;
      height: 1px; background: rgba(90,80,65,0.5);
    }
    .column-cap {
      width: 110%; height: 14px;
      background: linear-gradient(180deg, #4a4540, #2a2520);
      clip-path: polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%);
    }
    .column-base {
      width: 115%; height: 18px;
      background: linear-gradient(180deg, #3a3530, #1e1c18);
      clip-path: polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%);
    }
    .column-broken {
      width: 100%; background: linear-gradient(180deg, #3a3530 0%, #2a2520 100%);
      border-left: 2px solid #4a4540; border-right: 2px solid #1a1510;
      clip-path: polygon(0 0, 100% 0, 100% 70%, 80% 60%, 60% 75%, 40% 65%, 20% 80%, 0 70%);
    }

    /* Water effect */
    .water-shimmer {
      background: linear-gradient(135deg,
        rgba(15,30,50,0.9) 0%,
        rgba(20,45,70,0.8) 20%,
        rgba(10,25,45,0.95) 40%,
        rgba(25,50,80,0.75) 60%,
        rgba(10,30,55,0.9) 80%,
        rgba(15,35,60,0.85) 100%
      );
      background-size: 400% 400%;
      animation: waterFlow 8s ease infinite;
    }

    /* Section divider vignette */
    .vignette-top {
      background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
      position: absolute; top: 0; left: 0; right: 0; height: 200px; z-index: 3; pointer-events: none;
    }
    .vignette-bottom {
      background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
      position: absolute; bottom: 0; left: 0; right: 0; height: 200px; z-index: 3; pointer-events: none;
    }

    /* Nav dot indicator */
    .nav-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold-dim); transition: all 0.4s ease;
      cursor: pointer;
    }
    .nav-dot.active { background: var(--gold); transform: scale(1.5); box-shadow: 0 0 10px var(--gold); }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
      .section-title { font-size: clamp(1.8rem, 6vw, 3rem) !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   HOOK: Intersection Observer reveal
───────────────────────────────────────────── */
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ─────────────────────────────────────────────
   HOOK: Parallax scroll tracker
───────────────────────────────────────────── */
const useParallax = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrollY;
};

/* ─────────────────────────────────────────────
   COMPONENT: Dust Particle Canvas
───────────────────────────────────────────── */
const ParticleCanvas = ({ count = 60, opacity = 0.6 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.15 - 0.05,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      type: Math.random() > 0.7 ? 'fog' : 'dust',
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;
        const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;

        if (p.type === 'fog') {
          // Soft fog blobs
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
          grad.addColorStop(0, `rgba(180,160,120,${pulseOpacity * 0.3})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crisp dust motes
          ctx.fillStyle = `rgba(194,168,111,${pulseOpacity * opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}
    />
  );
};

/* ─────────────────────────────────────────────
   COMPONENT: Navigation Dots
───────────────────────────────────────────── */
const NavDots = ({ sections, active }) => (
  <div style={{
    position: 'fixed', right: '28px', top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 100,
  }}>
    {sections.map((s, i) => (
      <div
        key={s}
        className={`nav-dot ${active === i ? 'active' : ''}`}
        onClick={() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' })}
        title={s}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   COMPONENT: Stone Column
───────────────────────────────────────────── */
const StoneColumn = ({ height = 200, broken = false, tilt = 0, opacity = 1 }) => (
  <div className="column" style={{ width: 36, opacity, transform: `rotate(${tilt}deg)`, transformOrigin: 'bottom center' }}>
    {broken ? (
      <>
        <div className="column-cap" style={{ width: '110%', height: 12 }} />
        <div className="column-broken" style={{ height: height * 0.55 }} />
      </>
    ) : (
      <>
        <div className="column-cap" />
        {Array.from({ length: Math.floor(height / 28) }).map((_, i) => (
          <div key={i} className="column-drum" style={{ height: 24 }} />
        ))}
        <div className="column-base" />
      </>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   SECTION 1: HERO
───────────────────────────────────────────── */
const Hero = ({ scrollY }) => {
  const parallaxBg = scrollY * 0.4;
  const parallaxFog = scrollY * 0.2;

  return (
    <section
      id="hero"
      className="grain"
      style={{
        position: 'relative', height: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Background: SVG architectural line art */}
      <div
        className="hero-bg"
        style={{
          position: 'absolute', inset: '-10%',
          transform: `scale(1) translateY(${parallaxBg}px)`,
          zIndex: 0,
        }}
      >
        {/* Deep gradient atmosphere */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 80%, #1a0f0a 0%, #0b0b0f 60%, #05050a 100%)',
        }} />

        {/* Atmospheric horizon glow */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: 300,
          background: 'radial-gradient(ellipse 100% 100%, rgba(110,31,31,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '40%', height: 200,
          background: 'radial-gradient(ellipse 100% 100%, rgba(194,168,111,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
      </div>

      {/* Silhouette: gate structure (torii-like) */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: `translateX(-50%) translateY(${parallaxBg * 0.5}px)`,
        width: '100%', maxWidth: 900, zIndex: 1,
      }}>
        <svg viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', opacity: 0.7 }}>
          {/* Left pillar */}
          <rect x="120" y="80" width="28" height="320" fill="#0d0c0a" />
          <rect x="112" y="72" width="44" height="20" rx="2" fill="#100f0d" />
          {/* Right pillar */}
          <rect x="752" y="80" width="28" height="320" rx="1" fill="#0d0c0a" />
          <rect x="744" y="72" width="44" height="20" rx="2" fill="#100f0d" />
          {/* Top beam */}
          <path d="M80 95 Q450 55 820 95" stroke="#100f0d" strokeWidth="18" fill="none" strokeLinecap="round" />
          {/* Second beam */}
          <path d="M100 130 Q450 105 800 130" stroke="#0e0d0b" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* Distant ruins left */}
          <rect x="20" y="250" width="14" height="150" fill="#0d0c0a" opacity="0.6" />
          <rect x="55" y="220" width="10" height="180" fill="#0d0c0a" opacity="0.5" />
          <rect x="810" y="260" width="14" height="140" fill="#0d0c0a" opacity="0.6" />
          <rect x="840" y="230" width="10" height="170" fill="#0d0c0a" opacity="0.5" />
          {/* Ground mist gradient */}
          <defs>
            <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b0b0f" stopOpacity="0" />
              <stop offset="100%" stopColor="#0b0b0f" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="0" y="300" width="900" height="100" fill="url(#mistGrad)" />
        </svg>
      </div>

      {/* Fog layers */}
      {[
        { top: '60%', width: '120%', left: '-10%', dur: 14, delay: 0, opacity: 0.4 },
        { top: '70%', width: '140%', left: '-20%', dur: 18, delay: 3, opacity: 0.25 },
        { top: '55%', width: '100%', left: '0%',   dur: 11, delay: 6, opacity: 0.3 },
      ].map((f, i) => (
        <div key={i} className="fog-layer" style={{
          '--dur': `${f.dur}s`,
          position: 'absolute', top: f.top, left: f.left, width: f.width,
          height: 200, zIndex: 2, animationDelay: `${f.delay}s`,
          background: `radial-gradient(ellipse 60% 40% at 50% 100%, rgba(140,120,90,${f.opacity}) 0%, transparent 70%)`,
          filter: 'blur(25px)', transform: `translateY(${parallaxFog}px)`,
        }} />
      ))}

      {/* Particle canvas */}
      <ParticleCanvas count={80} opacity={0.8} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 24px' }}>
        {/* Eyebrow */}
        <div className="hero-sub" style={{
          fontFamily: "'Jost', sans-serif",
          letterSpacing: '0.4em',
          fontSize: '0.7rem',
          color: 'var(--gold-dim)',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          A Chronicle Across Ages
        </div>

        {/* Main title */}
        <h1
          className="hero-title"
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(2.8rem, 7vw, 7rem)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            lineHeight: 1.1,
            color: '#e8e0d0',
            marginBottom: 24,
            textShadow: '0 0 120px rgba(194,168,111,0.2), 0 4px 30px rgba(0,0,0,0.8)',
          }}
        >
          WHERE<br />
          <span className="gold-shimmer">EMPIRES</span><br />
          SLEEP
        </h1>

        {/* Ornamental divider */}
        <div className="hero-divider" style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          margin: '28px auto',
          width: 120,
        }} />

        {/* Subtitle */}
        <p className="hero-sub" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--white-dim)',
          letterSpacing: '0.08em',
          maxWidth: 480,
          margin: '0 auto',
          lineHeight: 1.8,
        }}>
          Through dust, mist, and stone — we walk among the ruins of worlds once unshakeable.
        </p>

        {/* Scroll indicator */}
        <div className="scroll-cue" style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold-dim)', textTransform: 'uppercase' }}>Descend</span>
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            <rect x="8" y="0" width="4" height="4" rx="2" fill="var(--gold-dim)" />
            <rect x="8" y="8" width="4" height="4" rx="2" fill="var(--gold-dim)" opacity="0.5" />
            <rect x="8" y="16" width="4" height="4" rx="2" fill="var(--gold-dim)" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="vignette-bottom" />
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 2: SAMURAI RUINS
───────────────────────────────────────────── */
const SamuraiRuins = ({ scrollY }) => {
  const sectionRef = useRef(null);
  const [localScroll, setLocalScroll] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    setLocalScroll(Math.max(0, scrollY - top + window.innerHeight));
  }, [scrollY]);

  const parallax = localScroll * 0.15;

  return (
    <section
      id="samurai"
      ref={sectionRef}
      className="grain"
      style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(180deg, #0b0b0f 0%, #0f0e0b 40%, #120d0a 100%)',
        padding: '120px 0',
      }}
    >
      <ParticleCanvas count={40} opacity={0.5} />

      {/* Background kanji characters */}
      <div style={{
        position: 'absolute', right: '5%', top: '10%',
        fontFamily: 'serif', fontSize: 'clamp(6rem, 15vw, 16rem)',
        color: 'rgba(194,168,111,0.03)',
        lineHeight: 1, letterSpacing: '-0.05em',
        transform: `translateY(${-parallax * 0.5}px)`,
        userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontWeight: 900,
      }}>
        武<br />士
      </div>

      {/* Decorative horizontal line art – temple silhouette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        transform: `translateY(${parallax * 0.3}px)`,
        zIndex: 1, opacity: 0.35,
      }}>
        <svg viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          {/* Pagoda silhouette left */}
          <polygon points="200,300 200,180 215,175 215,130 225,125 225,90 235,85 245,90 245,125 255,130 255,175 270,180 270,300" fill="#0f0e0b" />
          <polygon points="215,180 255,180 265,200 205,200" fill="#12110e" />
          <polygon points="225,130 245,130 252,147 218,147" fill="#12110e" />
          {/* Gate */}
          <rect x="500" y="200" width="30" height="100" fill="#0f0e0b" />
          <rect x="670" y="200" width="30" height="100" fill="#0f0e0b" />
          <path d="M490 210 Q600 170 710 210" stroke="#0f0e0b" strokeWidth="14" fill="none" />
          <path d="M505 230 Q600 198 695 230" stroke="#12110e" strokeWidth="9" fill="none" />
          {/* Distant mountains */}
          <polygon points="0,300 150,160 300,300" fill="#0d0c0a" opacity="0.5" />
          <polygon points="900,300 1050,140 1200,300" fill="#0d0c0a" opacity="0.5" />
          <polygon points="850,300 980,180 1100,300" fill="#0e0d0b" opacity="0.6" />
          {/* Ground */}
          <rect x="0" y="285" width="1200" height="15" fill="#0d0c0a" />
        </svg>
      </div>

      <div className="vignette-top" />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto', padding: '0 48px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
      }}>
        {/* Left: Visual element */}
        <div className="reveal-left" style={{ position: 'relative' }}>
          {/* Torii gate illustration */}
          <svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 380 }}>
            <defs>
              <radialGradient id="toriiGlow" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="rgba(194,168,111,0.12)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>
            <ellipse cx="200" cy="350" rx="160" ry="60" fill="url(#toriiGlow)" />
            {/* Left post */}
            <rect x="80" y="140" width="22" height="340" rx="2" fill="#1a1510" stroke="#2a2018" strokeWidth="1" />
            {/* Right post */}
            <rect x="298" y="140" width="22" height="340" rx="2" fill="#1a1510" stroke="#2a2018" strokeWidth="1" />
            {/* Top beam (kasagi) */}
            <path d="M50 150 Q200 110 350 150" stroke="#1e1a12" strokeWidth="20" strokeLinecap="round" fill="none" />
            <path d="M50 150 Q200 110 350 150" stroke="#2a2416" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Second beam (nuki) */}
            <path d="M75 195 Q200 175 325 195" stroke="#181410" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Shimegi (horizontal piece) */}
            <rect x="68" y="208" width="264" height="8" rx="2" fill="#151210" />
            {/* Lantern hanging */}
            <line x1="200" y1="195" x2="200" y2="240" stroke="#2a2018" strokeWidth="1" strokeDasharray="3,2" />
            <ellipse cx="200" cy="255" rx="14" ry="20" fill="#1a1510" stroke="#c2a86f" strokeWidth="0.5" strokeOpacity="0.4" />
            <ellipse cx="200" cy="255" rx="6" ry="8" fill="rgba(194,168,111,0.08)" />
            {/* Ground stone path */}
            {[0,1,2,3,4].map(i => (
              <rect key={i} x={148 + i * 22} y={460} width="18" height="10" rx="2" fill="#181510" stroke="#221e14" strokeWidth="0.5" />
            ))}
            {/* Moss/texture marks */}
            {[0,1,2,3].map(i => (
              <line key={i} x1={82 + i * 2} y1={200 + i * 60} x2={88 + i} y2={205 + i * 60} stroke="#2a2018" strokeWidth="0.8" opacity="0.5" />
            ))}
          </svg>

          {/* Caption under illustration */}
          <div style={{
            fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.3em',
            color: 'var(--gold-dim)', textTransform: 'uppercase', textAlign: 'center',
            marginTop: 16,
          }}>
            Feudal Gate of Passage · 古代の門 · 1600 CE
          </div>
        </div>

        {/* Right: Text */}
        <div>
          <div className="reveal delay-1" style={{
            fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.4em',
            color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Chapter I — The East
          </div>

          <h2 className="reveal section-title delay-2" style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2rem, 4vw, 3.8rem)',
            fontWeight: 600,
            color: '#e8e0d0',
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: '0.04em',
          }}>
            The Samurai<br />
            <span className="gold-shimmer">Ruins</span>
          </h2>

          <div className="ornament reveal delay-2" style={{ marginBottom: 32, justifyContent: 'flex-start' }}>
            <span style={{ fontFamily: 'Cinzel', fontSize: '0.7rem', color: 'var(--gold-dim)', letterSpacing: '0.2em' }}>
              武士道
            </span>
          </div>

          <p className="reveal delay-3" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            fontWeight: 300,
            color: 'var(--white-dim)',
            lineHeight: 1.9,
            marginBottom: 28,
          }}>
            Where once samurai walked through misted cedar forests, only fractured gates remain. The lacquered wood has long surrendered to rain and silence. Moss reclaims the carved temple steps; the stone lanterns no longer light any living path.
          </p>

          <p className="reveal delay-4" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
            fontWeight: 300,
            color: 'rgba(160,152,136,0.7)',
            lineHeight: 1.9,
          }}>
            Yet in the hush between wind and falling leaves, one can feel the weight of a civilization that chose beauty and discipline above all — a world that burned so brightly, it left its silhouette burned into the soil itself.
          </p>

          {/* Stat blocks */}
          <div className="reveal delay-5" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 48,
            borderTop: '1px solid rgba(194,168,111,0.12)', paddingTop: 32,
          }}>
            {[
              { value: '794', label: 'Heian Period', sub: 'CE' },
              { value: '400+', label: 'Castle Ruins', sub: 'Remaining' },
              { value: '∞', label: 'Bushidō', sub: 'Endures' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: 'var(--gold)',
                  fontWeight: 600, letterSpacing: '0.05em',
                }}>
                  {s.value}
                  <span style={{ fontSize: '0.7rem', color: 'var(--stone)', marginLeft: 4 }}>{s.sub}</span>
                </div>
                <div style={{ fontFamily: 'Jost', fontSize: '0.65rem', color: 'var(--stone)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vignette-bottom" />
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 3: ROMAN EMPIRE
───────────────────────────────────────────── */
const RomanEmpire = ({ scrollY }) => {
  const sectionRef = useRef(null);
  const [localScroll, setLocalScroll] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    setLocalScroll(Math.max(0, scrollY - top + window.innerHeight));
  }, [scrollY]);

  const columns = [
    { height: 220, broken: false, tilt: 0,    opacity: 1    },
    { height: 200, broken: true,  tilt: -4,   opacity: 0.85 },
    { height: 240, broken: false, tilt: 0,    opacity: 0.9  },
    { height: 180, broken: true,  tilt: 3,    opacity: 0.7  },
    { height: 200, broken: false, tilt: -2,   opacity: 0.8  },
    { height: 210, broken: true,  tilt: 5,    opacity: 0.6  },
    { height: 230, broken: false, tilt: 0,    opacity: 0.95 },
    { height: 170, broken: true,  tilt: -3,   opacity: 0.65 },
  ];

  return (
    <section
      id="roman"
      ref={sectionRef}
      className="grain"
      style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: 'linear-gradient(180deg, #120d0a 0%, #100e0c 50%, #0d0c0f 100%)',
        padding: '140px 0 80px',
      }}
    >
      <ParticleCanvas count={50} opacity={0.6} />

      {/* Broken arch background graphic */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', opacity: 0.08, zIndex: 0, pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 400 L100 180 Q250 20 400 20 Q550 20 700 180 L700 400" stroke="#c2a86f" strokeWidth="4" fill="none" />
          <path d="M130 400 L130 190 Q270 50 400 50 Q530 50 670 190 L670 400" stroke="#c2a86f" strokeWidth="2" fill="none" />
          <line x1="0" y1="400" x2="800" y2="400" stroke="#c2a86f" strokeWidth="3" />
        </svg>
      </div>

      <div className="vignette-top" />

      {/* Section header */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 5, marginBottom: 80, padding: '0 24px' }}>
        <div className="reveal" style={{
          fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.4em',
          color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 16,
        }}>
          Chapter II — The West
        </div>
        <h2 className="reveal delay-1 section-title" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '0.06em',
          color: '#e8e0d0',
        }}>
          The Roman <span className="gold-shimmer">Empire</span>
        </h2>
        <div className="reveal delay-2 ornament" style={{ marginTop: 24 }}>
          <span style={{ fontFamily: 'Cinzel', fontSize: '0.7rem', color: 'var(--gold-dim)', letterSpacing: '0.2em' }}>
            SPQR · Senatus Populusque Romanus
          </span>
        </div>
      </div>

      {/* Columns row */}
      <div className="reveal-scale" style={{
        position: 'relative', zIndex: 5,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        gap: 'clamp(12px, 3vw, 36px)', padding: '0 40px',
        marginBottom: 80,
      }}>
        {columns.map((col, i) => (
          <div key={i} style={{
            animationDelay: `${i * 0.12}s`,
            animation: `columnRise 1.2s ${i * 0.1}s cubic-bezier(.16,1,.3,1) both`,
          }}>
            <StoneColumn {...col} />
          </div>
        ))}
      </div>

      {/* Three-column text */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto', padding: '0 48px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48,
      }}>
        {[
          {
            latin: 'Aeternum',
            title: 'Stone & Marble',
            text: 'Rome built not for its generation, but for eternity. Every aqueduct, every arch, every forum was a declaration that this civilization intended to outlast the sun. The marble remembered what the people forgot.',
          },
          {
            latin: 'Imperium',
            title: 'Extent of Power',
            text: 'At its height, Rome held dominion over one quarter of humanity. From the cold moors of Britannia to the sands of Egypt, a single set of laws, a single language of governance — the world shaped by Latin.',
          },
          {
            latin: 'Ruina',
            title: 'What Remains',
            text: 'The columns still stand — cracked, tilted, hollowed. They hold no roof, serve no god, shelter no republic. Yet they communicate something unwritten: that even the mightiest ambition is finally answered by wind and grass.',
          },
        ].map((block, i) => (
          <div key={block.latin} className={`reveal delay-${i + 2}`} style={{
            borderLeft: '1px solid rgba(194,168,111,0.15)',
            paddingLeft: 28,
          }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.65rem', letterSpacing: '0.3em',
              color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: 12,
            }}>
              {block.latin}
            </div>
            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '1.1rem',
              color: '#d8d0c0', marginBottom: 16, letterSpacing: '0.05em',
            }}>
              {block.title}
            </h3>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1rem', fontWeight: 300,
              color: 'var(--white-dim)', lineHeight: 1.9,
            }}>
              {block.text}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom quote */}
      <div className="reveal" style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center', marginTop: 80, padding: '0 48px',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          fontStyle: 'italic', fontWeight: 300,
          color: 'rgba(194,168,111,0.55)',
          letterSpacing: '0.03em',
          maxWidth: 700, margin: '0 auto',
        }}>
          "The evil that men do lives after them; the good is oft interred with their bones."
        </p>
        <div style={{
          fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.3em',
          color: 'var(--stone)', textTransform: 'uppercase',
          marginTop: 16, opacity: 0.6,
        }}>
          — Attributed · The Forum · 44 BCE
        </div>
      </div>

      <div className="vignette-bottom" />
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 4: TEMPLE BY THE RIVER
───────────────────────────────────────────── */
const TempleRiver = ({ scrollY }) => {
  const sectionRef = useRef(null);
  const [localScroll, setLocalScroll] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    setLocalScroll(Math.max(0, scrollY - top + window.innerHeight));
  }, [scrollY]);

  const waterParallax = localScroll * 0.08;

  return (
    <section
      id="temple"
      ref={sectionRef}
      style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: '#0d0c0f',
      }}
    >
      {/* River water layer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '45%', zIndex: 1,
        transform: `translateY(${waterParallax}px)`,
      }}>
        <div className="water-shimmer" style={{ position: 'absolute', inset: 0 }} />

        {/* Water ripple SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}
          viewBox="0 0 1200 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {[0,1,2,3,4].map(i => (
            <ellipse key={i} cx={200 + i * 200} cy={100 + i * 40} rx={80 + i * 20} ry={8}
              stroke="rgba(100,160,200,0.4)" strokeWidth="1" fill="none" />
          ))}
          {[0,1,2,3].map(i => (
            <path key={i} d={`M${i * 300},${150 + i * 30} Q${i * 300 + 150},${120 + i * 30} ${i * 300 + 300},${150 + i * 30}`}
              stroke="rgba(80,140,180,0.25)" strokeWidth="1" fill="none" />
          ))}
        </svg>

        {/* Water surface shine */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(180deg, rgba(13,12,15,1) 0%, rgba(13,12,15,0) 100%)',
        }} />
      </div>

      {/* Submerged temple stones */}
      <div style={{
        position: 'absolute', bottom: '38%', left: '50%',
        transform: `translateX(-50%) translateY(${waterParallax * 0.5}px)`,
        width: '100%', zIndex: 2, opacity: 0.5,
      }}>
        <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          {/* Submerged columns */}
          <rect x="350" y="50" width="20" height="150" fill="#1a1510" opacity="0.7" />
          <rect x="420" y="80" width="18" height="120" fill="#181410" opacity="0.6" />
          <rect x="760" y="60" width="20" height="140" fill="#1a1510" opacity="0.7" />
          <rect x="830" y="90" width="18" height="110" fill="#181410" opacity="0.6" />
          {/* Temple platform */}
          <rect x="280" y="170" width="640" height="30" fill="#161310" opacity="0.8" />
          <rect x="260" y="182" width="680" height="18" fill="#120f0c" opacity="0.9" />
          {/* Water line blend */}
          <rect x="0" y="190" width="1200" height="10" fill="#0d1520" opacity="0.8" />
        </svg>
      </div>

      <div className="vignette-top" style={{ height: 300 }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh',
        padding: '160px 48px 80px',
        textAlign: 'center',
      }}>
        <div className="reveal" style={{
          fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.4em',
          color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 20,
        }}>
          Chapter III — The Sacred Waters
        </div>

        <h2 className="reveal delay-1 section-title" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '0.05em', color: '#e8e0d0',
          textShadow: '0 0 60px rgba(194,168,111,0.15)',
          marginBottom: 24,
        }}>
          Temple by<br />
          the <span className="gold-shimmer">River</span>
        </h2>

        <div className="reveal delay-2 ornament" style={{ marginBottom: 36, maxWidth: 160 }}>
          <span style={{ fontFamily: 'Cinzel', fontSize: '0.7rem', color: 'var(--gold-dim)', letterSpacing: '0.15em' }}>
            Sacred Ground
          </span>
        </div>

        <p className="reveal delay-3" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          fontWeight: 300, fontStyle: 'italic',
          color: 'var(--white-dim)', lineHeight: 1.9,
          maxWidth: 640, marginBottom: 24,
        }}>
          The river does not mourn what it swallows. Stone steps, carved offerings, the devotion of ten thousand prayers — all have slowly become part of its dark current.
        </p>

        <p className="reveal delay-4" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
          fontWeight: 300,
          color: 'rgba(160,152,136,0.65)', lineHeight: 1.9,
          maxWidth: 520,
        }}>
          Ancient priests believed this site to be the seam between worlds — where the water is a mirror not of sky, but of time itself. To stand at the shore is to see all that was, reflected perfectly, just beneath the surface.
        </p>

        {/* Floating orbs / offerings */}
        <div className="reveal delay-5" style={{ display: 'flex', gap: 40, marginTop: 60 }}>
          {['Water', 'Stone', 'Light', 'Memory'].map((word, i) => (
            <div key={word} style={{
              textAlign: 'center',
              animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '1px solid rgba(194,168,111,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                background: 'radial-gradient(circle, rgba(194,168,111,0.06) 0%, transparent 70%)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-dim)', opacity: 0.6 }} />
              </div>
              <span style={{ fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--stone)', textTransform: 'uppercase' }}>{word}</span>
            </div>
          ))}
        </div>
      </div>

      <ParticleCanvas count={30} opacity={0.4} />
    </section>
  );
};

/* ─────────────────────────────────────────────
   SECTION 5: PHILOSOPHY OF EMPIRES
───────────────────────────────────────────── */
const Philosophy = () => (
  <section
    id="philosophy"
    className="grain"
    style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      background: 'linear-gradient(180deg, #0d0c0f 0%, #0b0b0f 100%)',
      display: 'flex', alignItems: 'center',
      padding: '160px 0',
    }}
  >
    <div className="vignette-top" />
    <ParticleCanvas count={35} opacity={0.4} />

    {/* Large decorative numeral */}
    <div style={{
      position: 'absolute', right: '-2%', top: '10%',
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: 'clamp(12rem, 25vw, 28rem)',
      color: 'rgba(194,168,111,0.025)',
      lineHeight: 1, fontWeight: 900,
      userSelect: 'none', pointerEvents: 'none', zIndex: 0,
    }}>
      IV
    </div>

    <div style={{
      position: 'relative', zIndex: 5,
      maxWidth: 900, margin: '0 auto', padding: '0 48px',
    }}>
      <div className="reveal" style={{
        fontFamily: 'Jost', fontSize: '0.65rem', letterSpacing: '0.4em',
        color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 24,
      }}>
        Chapter IV — Reflection
      </div>

      <h2 className="reveal delay-1" style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
        fontWeight: 600, letterSpacing: '0.05em',
        color: '#e8e0d0', lineHeight: 1.2,
        marginBottom: 64,
      }}>
        Philosophy of <span className="gold-shimmer">Empires</span>
      </h2>

      {/* Large pull quotes */}
      {[
        {
          number: '01',
          statement: 'Every empire believes itself to be the final answer to history. This is the first condition of its eventual collapse.',
          attribution: 'The nature of civilizational hubris — observed in every iteration from Babylon to modern states. The conviction of permanence is the seed of impermanence.',
        },
        {
          number: '02',
          statement: 'The ruins do not speak of failure. They speak of ambition so vast it bent time before it fell.',
          attribution: 'To walk among broken columns is not to witness defeat — it is to witness the scale of what was attempted. That scale is itself a kind of immortality.',
        },
        {
          number: '03',
          statement: 'Cultures do not die. They dissolve into the soil, into the language, into the gesture of the next civilization\'s hands.',
          attribution: 'Rome lives in every courthouse. Feudal Japan lives in every code of honor. The dead empires breathe through us whether we acknowledge them or not.',
        },
      ].map((item, i) => (
        <div key={item.number} className={`reveal delay-${i + 2}`} style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr',
          gap: 32, marginBottom: 64,
          borderBottom: i < 2 ? '1px solid rgba(194,168,111,0.08)' : 'none',
          paddingBottom: i < 2 ? 64 : 0,
        }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '2.5rem', color: 'rgba(194,168,111,0.15)',
            fontWeight: 700, lineHeight: 1, paddingTop: 8,
          }}>
            {item.number}
          </div>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: '#d8d0c0', lineHeight: 1.7,
              marginBottom: 20,
            }}>
              "{item.statement}"
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.95rem', fontWeight: 300,
              color: 'rgba(160,152,136,0.6)', lineHeight: 1.8,
            }}>
              {item.attribution}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="vignette-bottom" />
  </section>
);

/* ─────────────────────────────────────────────
   SECTION 6: FINAL CTA
───────────────────────────────────────────── */
const FinalCTA = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="cta"
      className="grain"
      style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: 'linear-gradient(180deg, #0b0b0f 0%, #08080c 50%, #050509 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <ParticleCanvas count={90} opacity={0.9} />

      {/* Concentric circle ornament */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1, pointerEvents: 'none',
      }}>
        {[300, 450, 600, 800].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(194,168,111,${0.06 - i * 0.012})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `breathe ${6 + i * 2}s ease-in-out ${i * 0.8}s infinite`,
          }} />
        ))}
      </div>

      <div className="vignette-top" style={{ height: 300 }} />

      <div style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center', padding: '0 48px',
        maxWidth: 800,
      }}>
        <div className="reveal" style={{
          fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.5em',
          color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 24,
        }}>
          The Eternal Question
        </div>

        <h2 className="reveal delay-1" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
          fontWeight: 900, letterSpacing: '0.06em',
          color: '#e8e0d0', lineHeight: 1.1,
          textShadow: '0 0 120px rgba(194,168,111,0.15)',
          marginBottom: 32,
        }}>
          What Will<br />
          <span className="gold-shimmer rune-glow">You Leave</span><br />
          Behind?
        </h2>

        <p className="reveal delay-2" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontWeight: 300, fontStyle: 'italic',
          color: 'var(--white-dim)', lineHeight: 1.9,
          marginBottom: 56,
          letterSpacing: '0.03em',
        }}>
          The samurai left a philosophy that outlived his blade.<br />
          The Roman left an arch that outlived his republic.<br />
          The priest left a prayer that outlived the river itself.
        </p>

        {/* CTA Button */}
        <div className="reveal delay-3" style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.75rem', letterSpacing: '0.35em',
              color: hovered ? '#0b0b0f' : 'var(--gold)',
              background: hovered ? 'var(--gold)' : 'transparent',
              border: '1px solid rgba(194,168,111,0.5)',
              padding: '18px 48px',
              cursor: 'pointer',
              transition: 'all 0.6s cubic-bezier(.16,1,.3,1)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              boxShadow: hovered ? '0 0 40px rgba(194,168,111,0.3)' : '0 0 0px transparent',
            }}
          >
            Begin the Journey
          </button>

          <button
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.7rem', letterSpacing: '0.25em',
              color: 'var(--stone)',
              background: 'transparent',
              border: '1px solid rgba(122,122,122,0.2)',
              padding: '18px 40px',
              cursor: 'pointer',
              transition: 'all 0.6s ease',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--white-dim)'; e.target.style.borderColor = 'rgba(122,122,122,0.5)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--stone)'; e.target.style.borderColor = 'rgba(122,122,122,0.2)'; }}
          >
            Explore Archives
          </button>
        </div>

        {/* Bottom footnote */}
        <div className="reveal delay-4" style={{ marginTop: 80 }}>
          <div className="ornament" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'Cinzel', fontSize: '0.6rem', color: 'rgba(194,168,111,0.3)', letterSpacing: '0.2em' }}>
              Omnia Tempus Edax
            </span>
          </div>
          <p style={{
            fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.2em',
            color: 'rgba(122,122,122,0.4)', textTransform: 'uppercase',
          }}>
            Time, the Devourer of All Things
          </p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div style={{
        position: 'absolute', bottom: 32, left: 0, right: 0,
        textAlign: 'center', zIndex: 5,
      }}>
        <p style={{
          fontFamily: 'Jost', fontSize: '0.55rem', letterSpacing: '0.2em',
          color: 'rgba(122,122,122,0.3)', textTransform: 'uppercase',
        }}>
          Where Empires Sleep · An Immersive Historical Experience · Designed with Reverence
        </p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   COMPONENT: Top Navigation
───────────────────────────────────────────── */
const TopNav = ({ scrollY }) => {
  const visible = scrollY > 80;
  const sections = ['hero', 'samurai', 'roman', 'temple', 'philosophy', 'cta'];
  const labels = ['Origin', 'The East', 'The West', 'Sacred', 'Wisdom', 'Legacy'];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      background: visible ? 'rgba(11,11,15,0.9)' : 'transparent',
      backdropFilter: visible ? 'blur(20px)' : 'none',
      borderBottom: visible ? '1px solid rgba(194,168,111,0.1)' : '1px solid transparent',
      transition: 'all 0.6s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 28, height: 28, border: '1px solid rgba(194,168,111,0.4)',
          transform: 'rotate(45deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, background: 'rgba(194,168,111,0.4)', transform: 'rotate(0deg)' }} />
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.8rem',
          letterSpacing: '0.25em', color: 'rgba(194,168,111,0.7)',
          textTransform: 'uppercase',
        }}>
          Imperium
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => document.getElementById(sections[i])?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              fontFamily: 'Jost', fontSize: '0.6rem', letterSpacing: '0.25em',
              color: 'rgba(122,122,122,0.6)', textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.3s ease',
              display: window.innerWidth < 768 && i > 2 ? 'none' : 'block',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'rgba(122,122,122,0.6)'}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const scrollY = useParallax();
  useScrollReveal();

  // Track active section for nav dots
  const [activeSection, setActiveSection] = useState(0);
  const sectionIds = ['hero', 'samurai', 'roman', 'temple', 'philosophy', 'cta'];

  useEffect(() => {
    const sectionEls = sectionIds.map(id => document.getElementById(id));
    const findActive = () => {
      const viewMid = window.scrollY + window.innerHeight / 2;
      let active = 0;
      sectionEls.forEach((el, i) => {
        if (!el) return;
        if (el.offsetTop <= viewMid) active = i;
      });
      setActiveSection(active);
    };
    window.addEventListener('scroll', findActive, { passive: true });
    return () => window.removeEventListener('scroll', findActive);
  }, []);

  return (
    <>
      <GlobalStyles />
      <TopNav scrollY={scrollY} />
      <NavDots sections={sectionIds} active={activeSection} />
      <main>
        <Hero scrollY={scrollY} />
        <SamuraiRuins scrollY={scrollY} />
        <RomanEmpire scrollY={scrollY} />
        <TempleRiver scrollY={scrollY} />
        <Philosophy />
        <FinalCTA />
      </main>
    </>
  );
}

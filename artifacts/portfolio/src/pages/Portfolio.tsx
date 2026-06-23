import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Mail, ArrowDown, Shield, ExternalLink, MapPin, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Real data from Muhammad Abubakar's CV ───────────────────────────────────

const PROJECTS = [
  {
    id: "01",
    slug: "devsecops-pipeline",
    title: "Secure DevSecOps CI/CD Pipeline",
    category: "AppSec Automation",
    description:
      "Enforced fail-fast security gates in GitHub Actions — blocking any push containing secrets, SQLi patterns, or vulnerable dependencies. Packaged as a reusable template so downstream repos inherit the same security posture with zero per-project setup.",
    tags: ["GitHub Actions", "Bandit SAST", "pip-audit SCA", "pytest", "Python"],
    accent: "#00ff88",
  },
  {
    id: "02",
    slug: "phantom-identity",
    title: "Phantom Identity",
    category: "Browser Fingerprint Privacy Extension",
    description:
      "Manifest V3 extension defeating passive fingerprint tracking by spoofing Canvas, WebGL, Navigator, Screen, and timezone attributes per session. Surfaces fingerprint entropy and spoof effectiveness in an in-extension dashboard — zero outbound telemetry.",
    tags: ["JavaScript", "Manifest V3", "WebGL API", "Canvas API"],
    accent: "#00d4ff",
  },
  {
    id: "03",
    slug: "bakri-pay",
    title: "Bakri Pay",
    category: "Secure Banking Application",
    description:
      "Full-stack Flask banking app with secure session auth, transaction handling, and rules-based fraud detection on suspicious transfers. Controls mapped to OWASP Top 10 — bcrypt/Argon2 hashing, CSRF tokens, parameterized queries — validated via Burp Suite assessment.",
    tags: ["Flask", "Python", "OWASP Top 10", "Burp Suite", "PostgreSQL"],
    accent: "#00ff88",
  },
  {
    id: "04",
    slug: "dqn-noise",
    title: "DQN Adaptive Noise Allocation",
    category: "Wireless Security · Reinforcement Learning",
    description:
      "Modeled an eavesdropper-present MISO wiretap channel with MRT beamforming and trained a DQN agent to adaptively split power between signal and jamming noise. Achieved +0.299 bits/s/Hz secrecy gain over fixed allocation at low SNR.",
    tags: ["Python", "TensorFlow", "DQN", "Rayleigh Fading", "MISO"],
    accent: "#bf00ff",
  },
  {
    id: "05",
    slug: "ai-ids",
    title: "AI Intrusion Detection System",
    category: "ML · Cybersecurity",
    description:
      "Hybrid CatBoost + LOF detector pairing supervised classification with unsupervised novelty detection to catch unseen attacks. Trained on 1.6M samples in ~7.5 min — catches zero-day patterns that pure supervised models miss.",
    tags: ["CatBoost", "scikit-learn", "LOF", "Python", "Pandas"],
    accent: "#ff6b35",
  },
];

const SKILL_CATEGORIES = [
  {
    label: "security",
    items: ["Application Security", "DevSecOps", "Penetration Testing", "OWASP Top 10", "Threat Modeling", "SAST / SCA", "Vulnerability Assessment"],
  },
  {
    label: "tools",
    items: ["Burp Suite", "Nmap", "Metasploit", "Wireshark", "Bandit", "GitHub Actions", "Kali Linux"],
  },
  {
    label: "programming",
    items: ["Python", "JavaScript", "C++", "SQL", "Bash"],
  },
  {
    label: "frameworks",
    items: ["Flask", "React", "REST APIs", "NIST CSF", "ISO 27001", "Secure SDLC"],
  },
  {
    label: "ml / data",
    items: ["TensorFlow", "CatBoost", "scikit-learn", "Pandas", "PostgreSQL"],
  },
];

const EXPERIENCE = [
  {
    role: "Software QA Intern — Security Testing",
    company: "Thingtrax",
    location: "Lahore, Pakistan",
    period: "Jun 2025 – Aug 2025",
    bullets: [
      "Designed and ran security-focused test cases across 4 production releases — auth-flow validation, input fuzzing, and dependency-vulnerability checks.",
      "Triaged defects with developers and enforced the team's secure-coding bar.",
      "Contributed to a digitization workflow that cut document retrieval from ~15 min to under 5 sec.",
    ],
  },
  {
    role: "Secure Software Developer Intern",
    company: "Thingtrax",
    location: "Lahore, Pakistan",
    period: "Jun 2024 – Aug 2024",
    bullets: [
      "Built core flows (auth, catalog, checkout) for an industry-sponsored e-commerce platform using input validation and parameterized queries.",
      "Coordinated weekly agile syncs for a 10-person team.",
      "Shipped 50+ UI screens informed by research on 200+ users, improving delivery cadence ~15%.",
    ],
  },
];

const CERTS = [
  "Google Cybersecurity Professional Certificate",
  "AI for Cyber Security — Macquarie",
  "Linux Essentials — LPI",
  "Cisco Networking Basics",
  "Cisco Intro to Cybersecurity",
];

const STATS = [
  { value: "3.3", label: "GPA / 4.00" },
  { value: "2×", label: "Dean's Honor List" },
  { value: "5", label: "Security Projects" },
  { value: "1.6M", label: "Training Samples" },
];

// ─── Matrix rain canvas ────────────────────────────────────────────────────

function useMatrixRain(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CHARS = "01アイウエオカキクケコサシスセソ{}[]<>/\\|!@#$%ABCDEFabcdef0123456789";
    const FONT_SIZE = 13;
    let columns = Math.floor(canvas.width / FONT_SIZE);
    let drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 10, 6, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        // Vary brightness for depth
        const bright = Math.random() > 0.9;
        ctx.fillStyle = bright ? "#88ffb8" : "#00aa44";
        ctx.font = `${FONT_SIZE}px JetBrains Mono, monospace`;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Recompute columns on resize
      columns = Math.floor(canvas.width / FONT_SIZE);
      if (drops.length !== columns) {
        drops = new Array(columns).fill(1);
      }
    };

    const interval = setInterval(draw, 55);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// ─── Glitch effect on name ─────────────────────────────────────────────────

function useGlitch(elementRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glitch = () => {
      el.classList.add("glitching");
      setTimeout(() => el.classList.remove("glitching"), 350);
    };

    // Random glitch intervals
    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        glitch();
        timer = scheduleGlitch();
      }, delay);
    };

    let timer = scheduleGlitch();
    return () => clearTimeout(timer);
  }, [elementRef]);
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useMatrixRain(canvasRef);
  useGlitch(nameRef);

  // ── Custom cursor ──────────────────────────────────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const onEnter = () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: "power2.out" });
      gsap.to(cursor, { borderColor: "#00ff88", duration: 0.2 });
    };
    const onLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(cursor, { borderColor: "rgba(0,255,136,0.5)", duration: 0.2 });
    };
    const onDown = () => gsap.to(cursor, { scale: 0.7, duration: 0.1 });
    const onUp = () => gsap.to(cursor, { scale: 1, duration: 0.1 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const interactive = document.querySelectorAll("a, button, .project-card, .skill-tag");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // ── Hero reveal + pin ──────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Staggered character reveal on load
    const name = nameRef.current;
    if (name) {
      const words = name.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: "power4.out", delay: 0.3 }
      );
    }

    // Tagline + prompt reveal
    gsap.fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: "power3.out" });
    gsap.fromTo(".hero-prompt", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1.4 });
    gsap.fromTo(".scroll-cue", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.8 });

    // Pin hero: scale out name, reveal stats strip
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=120%",
        scrub: 1.5,
        pin: true,
      },
    });

    heroTl
      .to(name, { scale: 1.06, opacity: 0.15, duration: 1 }, 0)
      .fromTo(statsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.2);

    // About section
    gsap.fromTo(
      ".about-block",
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: "#about", start: "top 75%" },
      }
    );

    // Experience timeline items
    gsap.fromTo(
      ".exp-item",
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, stagger: 0.2, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: "#experience", start: "top 75%" },
      }
    );

    // Project cards
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: "#projects", start: "top 70%" },
      }
    );

    // Skills categories
    gsap.fromTo(
      ".skill-category",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: "#skills", start: "top 75%" },
      }
    );

    // Contact
    gsap.fromTo(
      ".contact-piece",
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 75%" },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="relative bg-background text-foreground min-h-screen font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground">

      {/* ── Custom cursor (desktop only) ──────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorDotRef}
        className="hidden md:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      />

      {/* ── Top nav ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
        style={{ background: "linear-gradient(to bottom, hsl(150 60% 3% / 0.95), transparent)" }}>
        <span className="font-mono text-xs text-primary tracking-widest">
          <span className="text-muted-foreground">~/</span>abubakar.sec
          <span className="cursor-blink text-primary ml-0.5">_</span>
        </span>
        <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest text-muted-foreground">
          {["about", "experience", "projects", "skills", "contact"].map((s) => (
            <a key={s} href={`#${s}`} className="hover:text-primary transition-colors duration-200">
              {`// ${s}`}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Matrix rain background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        />

        {/* Scanline overlay */}
        <div className="scanline-overlay absolute inset-0 pointer-events-none" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(150 60% 3% / 0.8) 100%)" }} />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          {/* Prompt line */}
          <p className="hero-prompt font-mono text-xs md:text-sm text-primary mb-6 md:mb-8 tracking-widest opacity-0">
            <span className="text-muted-foreground">$</span> whoami
          </p>

          {/* Name with word-by-word reveal */}
          <h1
            ref={nameRef}
            data-text="MUHAMMAD ABUBAKAR"
            className="glitch-name font-sans font-bold uppercase leading-[0.9] tracking-tight mb-6 md:mb-8"
            style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)" }}
          >
            <span className="overflow-hidden inline-block">
              <span className="word inline-block">MUHAMMAD</span>
            </span>
            <br />
            <span className="overflow-hidden inline-block gradient-text">
              <span className="word inline-block">ABUBAKAR</span>
            </span>
          </h1>

          {/* Tagline */}
          <div className="hero-sub opacity-0 space-y-2">
            <p className="font-mono text-base md:text-xl text-muted-foreground tracking-wide">
              Cyber Security Engineer
              <span className="text-primary mx-2">·</span>
              DevSecOps
              <span className="text-primary mx-2">·</span>
              Application Security
            </p>
            <p className="font-mono text-xs md:text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
              <MapPin size={12} className="text-primary" />
              Lahore, Pakistan
              <span className="text-primary mx-1">·</span>
              <GraduationCap size={12} className="text-primary" />
              GIKI · BSc Cyber Security · 3.3 GPA
            </p>
          </div>

          {/* Stats strip — fades in on scroll via GSAP */}
          <div
            ref={statsRef}
            className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto opacity-0"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center border border-primary/20 rounded px-4 py-3">
                <div className="font-mono font-bold text-2xl md:text-3xl text-primary text-glow">{s.value}</div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">SCROLL</span>
          <ArrowDown size={16} className="text-primary animate-bounce" />
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">

          <div className="about-block">
            <div className="section-line" />
            <p className="font-mono text-xs text-primary tracking-widest mb-4">// about</p>
            <h2 className="font-sans font-bold text-4xl md:text-5xl leading-tight mb-8">
              Final-year Security<br />
              <span className="gradient-text">Undergraduate.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Specializing in <span className="text-foreground font-medium">Application Security and DevSecOps</span> at
                Ghulam Ishaq Khan Institute (GIKI), with internship experience in security testing and secure
                development at Thingtrax.
              </p>
              <p>
                Hands-on across threat modeling, SAST/SCA pipeline gating, and OWASP-based hardening — plus applied
                ML research in wireless security and intrusion detection.
              </p>
              <p>
                Two-time Dean's Honor List recipient (5th and 6th semesters). Expected graduation: June 2027.
              </p>
            </div>
          </div>

          <div className="about-block">
            <div className="terminal-window">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                <span className="font-mono text-xs text-muted-foreground ml-2">profile.json</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <pre className="text-muted-foreground whitespace-pre-wrap overflow-x-auto">
{`{
  `}<span className="text-primary">"name"</span>{`: "Muhammad Abubakar",
  `}<span className="text-primary">"degree"</span>{`: "BSc Cyber Security",
  `}<span className="text-primary">"institution"</span>{`: "GIKI",
  `}<span className="text-primary">"gpa"</span>{`: `}<span className="text-accent">3.3</span>{`,
  `}<span className="text-primary">"honors"</span>{`: [`}<span className="text-yellow-400">"Dean's List"</span>{`, `}<span className="text-yellow-400">"x2"</span>{`],
  `}<span className="text-primary">"focus"</span>{`: [
    `}<span className="text-yellow-400">"Application Security"</span>{`,
    `}<span className="text-yellow-400">"DevSecOps"</span>{`,
    `}<span className="text-yellow-400">"Pen Testing"</span>{`,
    `}<span className="text-yellow-400">"ML for Security"</span>{`
  ],
  `}<span className="text-primary">"status"</span>{`: `}<span className="text-green-400">"open to opportunities"</span>{`
}`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────────────────────── */}
      <section id="experience" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-line" />
        <p className="font-mono text-xs text-primary tracking-widest mb-4">// experience</p>
        <h2 className="font-sans font-bold text-4xl md:text-5xl mb-16">
          Professional<br /><span className="gradient-text">Experience.</span>
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-12 md:pl-10">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="exp-item relative">
                {/* Timeline dot */}
                <div className="hidden md:block absolute -left-[2.65rem] top-1.5 w-2.5 h-2.5 rounded-full border border-primary bg-background" />

                <div className="terminal-window">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-border bg-card">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/70" />
                      <span className="font-mono text-xs text-muted-foreground">{exp.company}</span>
                    </div>
                    <span className="font-mono text-xs text-primary">{exp.period}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-sans font-semibold text-lg mb-4 text-foreground">{exp.role}</h3>
                    <ul className="space-y-2">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                          <span className="text-primary font-mono mt-0.5 shrink-0">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-line" />
        <p className="font-mono text-xs text-primary tracking-widest mb-4">// projects</p>
        <h2 className="font-sans font-bold text-4xl md:text-5xl mb-16">
          Selected<br /><span className="gradient-text">Work.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              data-testid={`card-project-${p.id}`}
              className={`project-card terminal-window group cursor-default ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              {/* Terminal title bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accent + "99" }} />
                  <span className="font-mono text-xs text-muted-foreground ml-2">
                    ~/projects/{p.slug}
                  </span>
                </div>
                <span className="project-number">// {p.id}</span>
              </div>

              {/* Card body */}
              <div className={`p-6 md:p-8 ${i === 0 ? "md:grid md:grid-cols-2 md:gap-12" : ""}`}>
                <div>
                  <p className="font-mono text-xs tracking-widest mb-2" style={{ color: p.accent }}>
                    {p.category}
                  </p>
                  <h3 className="font-sans font-bold text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors duration-300">
                    {p.title}
                  </h3>
                  {i === 0 && (
                    <p className="text-muted-foreground leading-relaxed md:hidden mb-4">{p.description}</p>
                  )}
                  {i !== 0 && (
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{p.description}</p>
                  )}
                </div>

                <div className={i === 0 ? "flex flex-col justify-center" : ""}>
                  {i === 0 && (
                    <p className="text-muted-foreground leading-relaxed mb-6 hidden md:block">{p.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="skill-tag">{tag}</span>
                    ))}
                  </div>
                  <a
                    href="https://github.com/abubakar-amir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Github size={13} />
                    view on github
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <section id="skills" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-line" />
        <p className="font-mono text-xs text-primary tracking-widest mb-4">// skills</p>
        <h2 className="font-sans font-bold text-4xl md:text-5xl mb-16">
          Toolkit &amp;<br /><span className="gradient-text">Expertise.</span>
        </h2>

        <div className="terminal-window">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
            <span className="font-mono text-xs text-muted-foreground ml-2">$ cat skills.json</span>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.label} className="skill-category">
                <p className="font-mono text-xs text-primary tracking-widest mb-4">
                  <span className="text-muted-foreground">"</span>{cat.label}<span className="text-muted-foreground">":</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className="skill-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────────────────────── */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="border border-border rounded px-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2 shrink-0">
            <Shield size={14} className="text-primary" />
            <span className="font-mono text-xs text-primary tracking-widest">CERTIFICATIONS</span>
          </div>
          {CERTS.map((c) => (
            <span key={c} className="font-mono text-xs text-muted-foreground">{c}</span>
          ))}
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="py-32 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-line" />
        <p className="contact-piece font-mono text-xs text-primary tracking-widest mb-4">// contact</p>

        <h2 className="contact-piece font-sans font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-16">
          Let&rsquo;s build<br />
          something<br />
          <span className="gradient-text">secure.</span>
        </h2>

        <div className="contact-piece grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Open to internship opportunities, security research collaborations, and full-time roles
              starting after June 2027.
            </p>
            <a
              href="mailto:abubakaramirwork@gmail.com"
              data-testid="link-email"
              className="block font-mono text-lg md:text-2xl text-foreground hover:text-primary transition-colors duration-300 border-b border-border hover:border-primary pb-2 w-fit"
            >
              abubakaramirwork@gmail.com
            </a>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/abubakar-amir"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-github"
              className="flex items-center gap-2 px-5 py-3 border border-border rounded hover:border-primary hover:text-primary transition-all duration-300 font-mono text-sm"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/abubakar-amir"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-linkedin"
              className="flex items-center gap-2 px-5 py-3 border border-border rounded hover:border-primary hover:text-primary transition-all duration-300 font-mono text-sm"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
            <a
              href="mailto:abubakaramirwork@gmail.com"
              data-testid="link-mail"
              className="flex items-center gap-2 px-5 py-3 border border-border rounded hover:border-primary hover:text-primary transition-all duration-300 font-mono text-sm"
            >
              <Mail size={16} />
              Email
            </a>
          </div>
        </div>

        {/* Footer line */}
        <div className="contact-piece mt-24 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            Muhammad Abubakar · Lahore, Pakistan · +92 339 4959692
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">GIKI</span> · BSc Cyber Security · 2023–2027
          </span>
        </div>
      </section>

    </div>
  );
}

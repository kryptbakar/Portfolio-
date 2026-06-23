import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "01",
    slug: "devsecops-pipeline",
    title: "Secure DevSecOps Pipeline",
    category: "AppSec · GitHub Actions",
    tags: ["SAST", "SCA", "CI/CD"],
    year: "2025",
    description: "Fail-fast security gates blocking secrets, SQLi, and vulnerable deps — packaged as a reusable template.",
  },
  {
    id: "02",
    slug: "phantom-identity",
    title: "Phantom Identity",
    category: "Privacy · Browser Extension",
    tags: ["Manifest V3", "WebGL", "Canvas"],
    year: "2025",
    description: "Defeats passive fingerprint tracking by spoofing Canvas, WebGL, Navigator, Screen and timezone per session.",
  },
  {
    id: "03",
    slug: "bakri-pay",
    title: "Bakri Pay",
    category: "AppSec · Flask",
    tags: ["OWASP", "Burp Suite", "bcrypt"],
    year: "2024",
    description: "Full-stack banking app with fraud detection, CSRF tokens, and parameterized queries. Validated via Burp Suite.",
  },
  {
    id: "04",
    slug: "dqn-noise",
    title: "DQN Adaptive Noise Allocation",
    category: "Wireless Security · RL",
    tags: ["TensorFlow", "DQN", "MISO"],
    year: "2024",
    description: "+0.299 bits/s/Hz secrecy gain over fixed allocation — DQN trained on a MISO wiretap channel.",
  },
  {
    id: "05",
    slug: "ai-ids",
    title: "AI Intrusion Detection System",
    category: "ML · Cybersecurity",
    tags: ["CatBoost", "LOF", "1.6M samples"],
    year: "2024",
    description: "Hybrid supervised + novelty detection catches zero-day patterns in 7.5 min on 1.6M records.",
  },
];

const SKILLS = [
  { label: "Security", items: ["Application Security", "Penetration Testing", "OWASP Top 10", "Threat Modeling", "SAST / SCA", "DevSecOps"] },
  { label: "Tools", items: ["Burp Suite", "Nmap", "Metasploit", "Wireshark", "Bandit", "GitHub Actions"] },
  { label: "Programming", items: ["Python", "JavaScript", "C++", "SQL", "Bash"] },
  { label: "Frameworks", items: ["Flask", "React", "NIST CSF", "ISO 27001", "Secure SDLC"] },
  { label: "ML / Data", items: ["TensorFlow", "CatBoost", "scikit-learn", "Pandas", "PostgreSQL"] },
];

const EXPERIENCE = [
  {
    role: "Software QA Intern — Security Testing",
    company: "Thingtrax",
    period: "Jun – Aug 2025",
    bullets: [
      "Security-focused test cases across 4 production releases — auth-flow validation, input fuzzing, dependency-vulnerability checks.",
      "Digitization workflow cutting document retrieval from ~15 min to under 5 sec.",
    ],
  },
  {
    role: "Secure Software Developer Intern",
    company: "Thingtrax",
    period: "Jun – Aug 2024",
    bullets: [
      "Built auth, catalog, checkout flows for an industry e-commerce platform with input validation and parameterized queries.",
      "Shipped 50+ UI screens informed by 200+ user interviews; improved delivery cadence ~15%.",
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

const SECTIONS = [
  { id: "hero",       label: "INTRO"    },
  { id: "about",      label: "ABOUT"    },
  { id: "projects",   label: "PROJECTS" },
  { id: "experience", label: "EXP"      },
  { id: "skills",     label: "SKILLS"   },
  { id: "contact",    label: "CONTACT"  },
];

// ─── Text scramble ────────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

function scramble(el: HTMLElement, text: string, durationMs = 500) {
  let frame = 0;
  const totalFrames = Math.floor(durationMs / 28);
  let id: ReturnType<typeof setInterval>;

  id = setInterval(() => {
    el.textContent = text
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        if (i < (frame / totalFrames) * text.length) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    frame++;
    if (frame > totalFrames) {
      el.textContent = text;
      clearInterval(id);
    }
  }, 28);

  return () => clearInterval(id);
}

function ScrambleLink({
  href,
  children,
  className,
  target,
  rel,
}: {
  href: string;
  children: string;
  className?: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const onEnter = useCallback(() => {
    if (ref.current) {
      cancelRef.current?.();
      cancelRef.current = scramble(ref.current, children, 420);
    }
  }, [children]);

  const onLeave = useCallback(() => {
    cancelRef.current?.();
    if (ref.current) ref.current.textContent = children;
  }, [children]);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      target={target}
      rel={rel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </a>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prog = 0;
    const tick = setInterval(() => {
      prog += Math.random() * 12 + 4;
      if (prog >= 100) {
        prog = 100;
        clearInterval(tick);
        if (fillRef.current) fillRef.current.style.width = "100%";
        setTimeout(() => {
          gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 1.1,
            ease: "power4.inOut",
            onComplete: onDone,
          });
        }, 350);
      }
      if (fillRef.current) fillRef.current.style.width = prog + "%";
    }, 60);
    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <div ref={overlayRef} className="loading-overlay">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            letterSpacing: "-0.04em",
            color: "#fff",
            lineHeight: 0.9,
            marginBottom: "2rem",
          }}
        >
          M.
          <br />
          ABUBAKAR
        </div>
        <div className="loading-bar-track">
          <div ref={fillRef} className="loading-bar-fill" />
        </div>
        <div className="loading-text" style={{ marginTop: "1rem" }}>
          Initializing
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
    };
  }, [loaded]);

  // Intersection observer for side indicator
  useEffect(() => {
    if (!loaded) return;
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [loaded]);

  // Custom cursor
  useEffect(() => {
    if (!loaded) return;
    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;
    if (!ring || !dot) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
    const xDot  = gsap.quickTo(dot,  "x", { duration: 0.06, ease: "none" });
    const yDot  = gsap.quickTo(dot,  "y", { duration: 0.06, ease: "none" });

    const onMove = (e: MouseEvent) => {
      xRing(e.clientX); yRing(e.clientY);
      xDot(e.clientX);  yDot(e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll("a, button, .work-row, .skill-category-cell");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, [loaded]);

  // GSAP scroll animations
  useEffect(() => {
    if (!loaded) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hero name reveal
    gsap.fromTo(
      ".hero-name-word",
      { yPercent: 110 },
      { yPercent: 0, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.2 }
    );
    gsap.fromTo(
      [".hero-scroll-label", ".hero-year"],
      { opacity: 0 },
      { opacity: 1, stagger: 0.15, duration: 1, ease: "power2.out", delay: 1.0 }
    );

    if (reduced) return;

    // Ghost text parallax
    gsap.to(".hero-ghost-text", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 },
    });

    // Mission lines reveal
    gsap.fromTo(
      ".mission-line",
      { yPercent: 100 },
      {
        yPercent: 0, stagger: 0.09, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: "#about", start: "top 65%" },
      }
    );
    gsap.fromTo(
      ".about-body",
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: "#about", start: "top 60%" },
      }
    );

    // Work rows
    gsap.fromTo(
      ".work-row",
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, stagger: 0.08, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: "#projects", start: "top 72%" },
      }
    );

    // Experience cards
    gsap.fromTo(
      ".exp-card",
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: "#experience", start: "top 72%" },
      }
    );

    // Skill cells
    gsap.fromTo(
      ".skill-category-cell",
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: "#skills", start: "top 72%" },
      }
    );

    // Vision
    gsap.fromTo(
      ".vision-text",
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: "#vision", start: "top 70%" },
      }
    );

    // Contact
    gsap.fromTo(
      ".contact-piece",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 72%" },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [loaded]);

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {/* Custom cursor — desktop only */}
      <div ref={cursorRingRef} className="cursor-ring hidden md:block" />
      <div ref={cursorDotRef}  className="cursor-dot  hidden md:block" />

      {/* Side scroll indicator */}
      <nav className="scroll-indicator hidden md:flex" aria-label="Section indicator">
        {SECTIONS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={`scroll-indicator-item ${activeSection === id ? "active" : ""}`}
             style={{ textDecoration: "none" }}>
            <div className="scroll-indicator-line" />
            <div className="scroll-indicator-label">{label}</div>
          </a>
        ))}
      </nav>

      {/* Nav */}
      <header className="site-nav">
        <a href="#hero" className="nav-logo" style={{ color: "#fff", textDecoration: "none" }}>
          M. Abubakar
        </a>
        <div className="nav-links">
          {["about", "projects", "skills", "contact"].map((s) => (
            <ScrambleLink key={s} href={`#${s}`} className="nav-link">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </ScrambleLink>
          ))}
        </div>
        <ScrambleLink
          href="mailto:abubakaramirwork@gmail.com"
          className="nav-contact"
        >
          Contact →
        </ScrambleLink>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="hero" className="hero-section">
        {/* Ghost outline name floating behind */}
        <div className="hero-name-ghost">
          <span
            className="hero-ghost-text"
            style={{ fontSize: "clamp(8rem, 22vw, 28rem)" }}
          >
            SECURITY
          </span>
        </div>

        {/* Main name */}
        <div className="hero-name-main">
          <span className="hero-name-line">
            <span
              className="hero-name-word"
              style={{ fontSize: "clamp(4.5rem, 13vw, 15rem)" }}
            >
              MUHAMMAD
            </span>
          </span>
          <span className="hero-name-line">
            <span
              className="hero-name-word"
              style={{
                fontSize: "clamp(4.5rem, 13vw, 15rem)",
                color: "transparent",
                WebkitTextStroke: "2px #fff",
              }}
            >
              ABUBAKAR
            </span>
          </span>

          {/* Subtitle row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "2.5rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <span>Cyber Security Engineer</span>
            <span style={{ width: 30, height: 1, background: "rgba(255,255,255,0.2)" }} />
            <span>GIKI · Lahore</span>
            <span style={{ width: 30, height: 1, background: "rgba(255,255,255,0.2)" }} />
            <span>BSc 2023 – 2027</span>
          </div>
        </div>

        {/* Scroll label */}
        <div className="hero-scroll-label">
          <div className="hero-scroll-line" />
          <span>Scroll to explore</span>
          <span>→</span>
        </div>

        {/* Year / portfolio badge */}
        <div className="hero-year">
          <div>©2025</div>
          <div>Portfolio</div>
          <div style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.18)" }}>v2.0</div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section
        id="about"
        style={{
          padding: "clamp(5rem, 10vw, 10rem) clamp(2rem, 6vw, 7rem)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="section-label">About</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem, 6vw, 7rem)", alignItems: "start" }}>
          {/* Mission statement */}
          <div>
            <div
              className="mission-text"
              style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}
            >
              {["Securing", "systems.", "Protecting", "futures."].map((word) => (
                <span key={word} className="mission-line-wrap">
                  <span className="mission-line">{word}</span>{" "}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div
            className="about-body"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.92rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              paddingTop: "0.5rem",
            }}
          >
            <p style={{ marginBottom: "1.25rem" }}>
              Final-year Cyber Security undergraduate at{" "}
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                Ghulam Ishaq Khan Institute (GIKI)
              </span>{" "}
              — specializing in Application Security and DevSecOps. Internship
              experience in security testing and secure development at Thingtrax.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              Hands-on across threat modeling, SAST/SCA pipeline gating, OWASP-based
              hardening, and applied ML research in wireless security and intrusion
              detection.
            </p>
            <p style={{ marginBottom: "2rem" }}>
              Two-time{" "}
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                Dean's Honor List
              </span>{" "}
              recipient (5th and 6th semesters). CGPA 3.3 / 4.00. Expected graduation:
              June 2027.
            </p>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: "1.5rem",
              }}
            >
              {[
                { v: "3.3", l: "GPA / 4.00" },
                { v: "2×", l: "Dean's List" },
                { v: "5", l: "Projects" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.75rem",
                      color: "#fff",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.28)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
      <section
        id="projects"
        style={{
          padding: "clamp(5rem, 10vw, 10rem) clamp(2rem, 6vw, 7rem)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "4rem",
          }}
        >
          <div className="section-label" style={{ marginBottom: 0 }}>Projects</div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            0{PROJECTS.length} total
          </span>
        </div>

        <div className="works-list">
          {PROJECTS.map((p) => (
            <div key={p.id} className="work-row" data-testid={`card-project-${p.id}`}>
              <span className="work-num">{p.id}</span>
              <div>
                <div className="work-title">{p.title}</div>
                <div className="work-sub">{p.description}</div>
              </div>
              <div className="work-tags">
                {p.tags.map((t) => (
                  <span key={t} className="work-tag">{t}</span>
                ))}
              </div>
              <span className="work-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────────────────────── */}
      <section
        id="experience"
        style={{
          padding: "clamp(5rem, 10vw, 10rem) clamp(2rem, 6vw, 7rem)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="section-label">Experience</div>
        <div className="exp-grid">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="exp-card">
              <div className="exp-period">{exp.period}</div>
              <div className="exp-company">{exp.company}</div>
              <div className="exp-role">{exp.role}</div>
              {exp.bullets.map((b, j) => (
                <div key={j} className="exp-bullet">
                  <span className="exp-bullet-mark">—</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <section
        id="skills"
        style={{
          padding: "clamp(5rem, 10vw, 10rem) clamp(2rem, 6vw, 7rem)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="section-label">Skills</div>
        <div className="skills-grid">
          {SKILLS.map((cat) => (
            <div key={cat.label} className="skill-category-cell">
              <div className="skill-cat-label">{cat.label}</div>
              <div className="skill-items">
                {cat.items.map((item) => (
                  <span key={item} className="skill-item-text">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────────────────────────── */}
      <section
        id="vision"
        className="vision-section"
        style={{ padding: "clamp(5rem, 10vw, 10rem) clamp(2rem, 6vw, 7rem)" }}
      >
        <div className="vision-text">
          Building security<br />
          into <span>every</span> layer.
        </div>
      </section>

      {/* ── CERTS marquee ─────────────────────────────────────────────────── */}
      <div className="cert-bar">
        <div className="cert-track">
          {[...CERTS, ...CERTS].map((c, i) => (
            <span key={i} className={i % 2 === 1 ? "cert-sep" : "cert-item"}>
              {i % 2 === 1 ? "·" : c}
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          padding: "clamp(6rem, 12vw, 12rem) clamp(2rem, 6vw, 7rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="section-label contact-piece"
          style={{ marginBottom: "3rem" }}
        >
          Contact
        </div>

        <div
          className="contact-piece"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 6vw, 6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "#fff",
            marginBottom: "3.5rem",
          }}
        >
          Let's build something
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.5)",
            }}
          >
            remarkable.
          </span>
        </div>

        <div
          className="contact-piece"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "2rem",
            paddingBottom: "4rem",
          }}
        >
          <a
            href="mailto:abubakaramirwork@gmail.com"
            className="contact-email"
            data-testid="link-email"
          >
            abubakaramirwork@gmail.com
          </a>

          <div style={{ display: "flex", gap: "2rem" }}>
            <ScrambleLink
              href="https://github.com/abubakar-amir"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub →
            </ScrambleLink>
            <ScrambleLink
              href="https://linkedin.com/in/abubakar-amir"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              LinkedIn →
            </ScrambleLink>
            <ScrambleLink
              href="tel:+923394959692"
              className="footer-link"
            >
              +92 339 4959692
            </ScrambleLink>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-left">
          <div>Muhammad Abubakar</div>
          <div>GIKI · Lahore, Pakistan</div>
          <div style={{ marginTop: "0.5rem" }}>BSc Cyber Security · 2023 – 2027</div>
        </div>
        <div className="footer-logo">M.A</div>
        <div className="footer-right">
          <ScrambleLink href="https://github.com/abubakar-amir" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </ScrambleLink>
          <ScrambleLink href="https://linkedin.com/in/abubakar-amir" target="_blank" rel="noopener noreferrer" className="footer-link">
            LinkedIn
          </ScrambleLink>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            ©2025
          </span>
        </div>
      </footer>
    </>
  );
}

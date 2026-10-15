/* ========================================
   animaciones.js — Portfolio Sebastian G
   ======================================== */

// ── CUSTOM CURSOR ──────────────────────────────────────────────
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor grow on hover
document.querySelectorAll('a, button, .skill-tag, .stat-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(2)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
        cursorRing.style.opacity   = '0.9';
        cursorRing.style.borderColor = 'var(--neon)';
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.opacity   = '0.6';
        cursorRing.style.borderColor = 'var(--accent)';
    });
});

// ── PARTICLE CANVAS BACKGROUND ─────────────────────────────────
const canvas  = document.getElementById('bg-canvas');
const ctx     = canvas.getContext('2d');

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 72;
const particles = [];

class Particle {
    constructor() { this.reset(true); }
    reset(init) {
        this.x  = Math.random() * canvas.width;
        this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
        this.r  = Math.random() * 1.6 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -(Math.random() * 0.4 + 0.15);
        this.life = 0;
        this.maxLife = Math.random() * 280 + 120;
        this.hue = Math.random() < 0.6 ? 270 : 190; // purple or cyan
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
        const progress = this.life / this.maxLife;
        const alpha = progress < 0.15
            ? progress / 0.15
            : progress > 0.75
                ? 1 - (progress - 0.75) / 0.25
                : 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${alpha * 0.55})`;
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw faint connecting lines between close particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(162,89,255,${(1 - dist / 110) * 0.07})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SCROLL PROGRESS + NAVBAR ────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
const navbar      = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (winScroll / height * 100) + '%';

    navbar.classList.toggle('scrolled', winScroll > 50);

    // Active nav link highlight
    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop - 80;
        if (winScroll >= top && winScroll < top + sec.offsetHeight) {
            document.querySelectorAll('.navbar a').forEach(a => a.classList.remove('active'));
            const link = document.querySelector(`.navbar a[href="#${sec.id}"]`);
            if (link) link.classList.add('active');
        }
    });
});

// ── TYPEWRITER ──────────────────────────────────────────────────
const typingEl  = document.getElementById('typing-text');
const glitchEl  = document.getElementById('glitch-target');
const blinkEl   = document.getElementById('cursor-blink');
const fullName  = 'Sebastian';

function typeWriter(text, i, cb) {
    if (i < text.length) {
        typingEl.textContent = text.substring(0, i + 1);
        glitchEl.setAttribute('data-text', text.substring(0, i + 1));
        setTimeout(() => typeWriter(text, i + 1, cb), 105);
    } else {
        if (cb) setTimeout(cb, 800);
        // Hide blink cursor after typing done — keep it blinking
    }
}

// ── INTERSECTION OBSERVER — REVEAL ─────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animacion]').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ── SKILL STAGGER ANIMATION ─────────────────────────────────────
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skills = entry.target.querySelectorAll('.skill-tag');
            skills.forEach((sk, i) => {
                sk.style.animationDelay = `${i * 60}ms`;
                sk.classList.add('skill-animate');
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

const habilidadesSection = document.getElementById('habilidades');
if (habilidadesSection) skillObserver.observe(habilidadesSection);

// ── GLITCH FLASH ON PROJECT CARD ────────────────────────────────
const campusCard = document.getElementById('campus-project');
if (campusCard) {
    campusCard.addEventListener('mouseenter', () => {
        campusCard.classList.add('glitch-flash');
        setTimeout(() => campusCard.classList.remove('glitch-flash'), 200);
    });
}

// ── STATS COUNT-UP ANIMATION ────────────────────────────────────
function countUp(el, target, duration) {
    const start = performance.now();
    const isInfinity = target === '∞';
    const isPercent  = String(target).includes('%');
    const numTarget  = isInfinity || isPercent ? parseInt(target) : parseInt(target);

    if (isInfinity) { el.textContent = '∞'; return; }

    function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * numTarget);
        el.textContent = current + (isPercent ? '%' : '+');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(num => {
                countUp(num, num.textContent.trim(), 900);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const sobreMi = document.getElementById('sobre-mi');
if (sobreMi) statsObserver.observe(sobreMi);

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    typeWriter(fullName, 0);
});

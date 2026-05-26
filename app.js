/* ==========================================================================
   Fantastic Fashion Interactive Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initSparkleStars();
    initMouseTrail();
    initBubbleLetters();
    initEasterEggs();
    initGiftCoupon();
    initCustomizer();
    initContactForm();
});

/* ==========================================================================
   1. Theme Initialization & Application
   ========================================================================== */

const DEFAULT_THEME = {
    heroBg: "#0033ff",
    titleColor: "#ff2a85",
    starsColor: "#ffff00",
    dotsColor: "#ffd700",
    font: "dynapuff"
};

function initTheme() {
    const savedTheme = localStorage.getItem("fantastic_fashion_theme");
    if (savedTheme) {
        try {
            const theme = JSON.parse(savedTheme);
            applyTheme(theme);
        } catch (e) {
            console.error("Error loading theme", e);
        }
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme.heroBg) root.style.setProperty("--hero-bg-color", theme.heroBg);
    if (theme.titleColor) root.style.setProperty("--primary-color", theme.titleColor);
    if (theme.starsColor) root.style.setProperty("--stars-color", theme.starsColor);
    if (theme.dotsColor) root.style.setProperty("--dots-color", theme.dotsColor);
    
    if (theme.font) {
        applyFontFamily(theme.font);
    }
}

function applyFontFamily(fontKey) {
    const root = document.documentElement;
    let fontFamily = "'DynaPuff', sans-serif";
    
    if (fontKey === "fredoka") {
        fontFamily = "'Fredoka', sans-serif";
    } else if (fontKey === "bubblegum") {
        fontFamily = "'Bubblegum Sans', cursive";
    } else if (fontKey === "caveat") {
        fontFamily = "'Caveat', cursive";
    }
    
    root.style.setProperty("--font-family", fontFamily);
}

/* ==========================================================================
   2. Sparkle Stars Engine (Background Stars)
   ========================================================================== */

function initSparkleStars() {
    const overlay = document.getElementById("stars-overlay");
    if (!overlay) return;
    
    const initialStarsCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < initialStarsCount; i++) {
        spawnStar(overlay, true);
    }
    
    setInterval(() => {
        spawnStar(overlay, false);
    }, 1200);
}

function spawnStar(container, isInitial = false) {
    const star = document.createElement("div");
    const isDot = Math.random() > 0.6;
    star.className = isDot ? "sparkle-dot" : "sparkle-star";
    
    let size = isDot ? Math.random() * 4 + 2 : Math.random() * 20 + 8;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    if (isInitial) {
        const delay = -Math.random() * 4;
        star.style.animationDelay = `${delay}s`;
    } else {
        star.style.animationDelay = `0s`;
    }
    
    const duration = Math.random() * 3 + 3;
    star.style.animationDuration = `${duration}s`;
    
    container.appendChild(star);
    
    const maxCapacity = 60;
    if (container.children.length > maxCapacity) {
        container.removeChild(container.firstChild);
    }
}

/* ==========================================================================
   3. Magic Wand Trail & Touch Gesture Engine
   ========================================================================== */

let globalParticles = [];
let activeGesturePath = [];
let isDrawingGesture = false;
let fadingPaths = [];

function initMouseTrail() {
    const canvas = document.getElementById("trail-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Spawn mouse move trail
    window.addEventListener("mousemove", (e) => {
        if (isDrawingGesture) {
            addGesturePoint(e.clientX, e.clientY);
        }
        for (let i = 0; i < 2; i++) {
            globalParticles.push(createParticle(e.clientX, e.clientY));
        }
    });

    // Touch events for drawing & trails on mobile
    window.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            // Don't draw gesture if tapping form fields or customizer
            if (touch.target.tagName === "INPUT" || touch.target.tagName === "TEXTAREA" || touch.target.tagName === "BUTTON" || touch.target.closest(".customizer-panel") || touch.target.closest(".customizer-toggle") || touch.target.closest(".product-card") || touch.target.closest("#gift-box")) return;
            
            startGesture(touch.clientX, touch.clientY);
            spawnBurst(touch.clientX, touch.clientY);
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            if (isDrawingGesture) {
                addGesturePoint(touch.clientX, touch.clientY);
            }
            globalParticles.push(createParticle(touch.clientX, touch.clientY));
        }
    });

    window.addEventListener("touchend", () => {
        endGesture();
    });

    // Mouse drag support for drawing on desktop (hold click to draw)
    window.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON" || e.target.closest(".customizer-panel") || e.target.closest(".customizer-toggle") || e.target.closest(".product-card") || e.target.closest("#gift-box")) return;
        startGesture(e.clientX, e.clientY);
        spawnBurst(e.clientX, e.clientY);
    });

    window.addEventListener("mouseup", () => {
        endGesture();
    });
    
    // Sparkle Particle Creator
    function createParticle(x, y) {
        const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#b026ff"];
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 1.2,
            size: Math.random() * 12 + 6, // Grown particle size
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.012 + 0.008, // Fades slower for a longer trail
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.12
        };
    }
    
    function drawSparkle(ctx, x, y, size, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Update regular mouse/touch trail particles
        for (let i = globalParticles.length - 1; i >= 0; i--) {
            const p = globalParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.rotation += p.rotationSpeed;
            
            if (p.alpha <= 0) {
                globalParticles.splice(i, 1);
            } else {
                drawSparkle(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
            }
        }

        // 2. Draw the active drawing gesture path (glowing blue line)
        if (activeGesturePath.length > 1) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 229, 255, 0.85)";
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00e5ff";
            
            ctx.beginPath();
            ctx.moveTo(activeGesturePath[0].x, activeGesturePath[0].y);
            for (let i = 1; i < activeGesturePath.length; i++) {
                ctx.lineTo(activeGesturePath[i].x, activeGesturePath[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // 3. Draw and update fading previous gesture paths
        for (let j = fadingPaths.length - 1; j >= 0; j--) {
            const fp = fadingPaths[j];
            fp.alpha -= 0.04; // Fade out quickly
            
            if (fp.alpha <= 0) {
                fadingPaths.splice(j, 1);
            } else {
                ctx.save();
                ctx.strokeStyle = `rgba(255, 42, 133, ${fp.alpha})`; // turns pink as it fades
                ctx.lineWidth = 8 * fp.alpha;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.shadowBlur = 10 * fp.alpha;
                ctx.shadowColor = "#ff2a85";
                
                ctx.beginPath();
                ctx.moveTo(fp.path[0].x, fp.path[0].y);
                for (let k = 1; k < fp.path.length; k++) {
                    ctx.lineTo(fp.path[k].x, fp.path[k].y);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
        
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

// Sparkle Explosion Burst
function spawnBurst(x, y) {
    const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#b026ff"];
    const count = 18;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4 + 3;
        globalParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            size: Math.random() * 12 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.015 + 0.012,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.15
        });
    }
}

// Drawing Gestures Engine
function startGesture(x, y) {
    activeGesturePath = [{x, y}];
    isDrawingGesture = true;
}

function addGesturePoint(x, y) {
    if (!isDrawingGesture) return;
    const last = activeGesturePath[activeGesturePath.length - 1];
    if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        if (dist < 4) return; // ignore minor moves
    }
    activeGesturePath.push({x, y});
}

function endGesture() {
    if (!isDrawingGesture) return;
    isDrawingGesture = false;
    
    if (activeGesturePath.length > 8) {
        analyzeGesture(activeGesturePath);
        // Move to fading stack
        fadingPaths.push({
            path: activeGesturePath,
            alpha: 1
        });
    }
    activeGesturePath = [];
}

// Detect drawn "E" or "K"
function analyzeGesture(path) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    path.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    if (width < 60 || height < 60) return; // Ignore too small drawings
    
    // Segment direction tracing
    const segmentsCount = 4;
    const dirs = [];
    const ptsPerSeg = Math.floor(path.length / segmentsCount);
    
    for (let i = 0; i < segmentsCount; i++) {
        const startPt = path[i * ptsPerSeg];
        const endPt = path[Math.min((i + 1) * ptsPerSeg, path.length - 1)];
        
        const dx = endPt.x - startPt.x;
        const dy = endPt.y - startPt.y;
        
        let dir = "";
        if (Math.abs(dx) > Math.abs(dy) * 1.4) {
            dir = dx > 0 ? "R" : "L";
        } else if (Math.abs(dy) > Math.abs(dx) * 1.4) {
            dir = dy > 0 ? "D" : "U";
        } else {
            dir = (dy > 0 ? "D" : "U") + (dx > 0 ? "R" : "L");
        }
        dirs.push(dir);
    }
    
    // Heuristic 1: Loop detection (Cursive E)
    const startPt = path[0];
    const endPt = path[path.length - 1];
    const startEndDist = Math.hypot(endPt.x - startPt.x, endPt.y - startPt.y);
    let pathLength = 0;
    for (let i = 1; i < path.length; i++) {
        pathLength += Math.hypot(path[i].x - path[i-1].x, path[i].y - path[i-1].y);
    }
    
    const isLoop = startEndDist < (width + height) * 0.45 && pathLength > 160;
    
    // Heuristic 2: K shape directions (Starts down, then goes up-right/right, then down-right/right)
    const hasDownStart = dirs[0].includes("D");
    const hasUpRight = dirs[1].includes("U") || dirs[1].includes("R") || dirs[2].includes("U") || dirs[2].includes("R");
    const hasDownRight = dirs[2].includes("D") || dirs[2].includes("R") || dirs[3].includes("D") || dirs[3].includes("R");
    
    if (isLoop) {
        triggerEasterEgg("erika");
    } else if (hasDownStart && hasUpRight && hasDownRight) {
        triggerEasterEgg("kayla");
    }
}

/* ==========================================================================
   4. Bubble Letter Popping & Mobile Idle Animation
   ========================================================================== */

// Synthesize Cute Bubble Pop Sound via Web Audio API
function playPopSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, audioCtx.currentTime); // start low
        osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.08); // slide up pitch rapidly
        
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); // decay
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
        console.log("Audio play blocked by browser gesture:", e);
    }
}

function initBubbleLetters() {
    const letters = document.querySelectorAll(".pop-letter");
    
    letters.forEach(letter => {
        letter.addEventListener("mousedown", (e) => e.preventDefault());
        
        letter.addEventListener("click", () => {
            if (letter.classList.contains("popped")) return;
            
            // Play cute bubble pop sound!
            playPopSound();
            
            letter.classList.add("popped");
            createPopVisualEffect(letter);
            
            setTimeout(() => {
                letter.classList.remove("popped");
                letter.style.transform = "scale(0)";
                letter.style.opacity = "0";
                
                void letter.offsetWidth; // browser reflow
                
                letter.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s";
                letter.style.transform = "scale(1)";
                letter.style.opacity = "1";
                
                setTimeout(() => {
                    letter.style.transition = "";
                    letter.style.transform = "";
                    letter.style.opacity = "";
                }, 400);
            }, 1200);
        });
    });

    // Mobile Idle Wiggler (Gently expands/wiggles letters automatically on mobile)
    const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isMobile) {
        setInterval(() => {
            const letters = document.querySelectorAll(".pop-letter");
            if (letters.length === 0) return;
            
            const randomIndex = Math.floor(Math.random() * letters.length);
            const letter = letters[randomIndex];
            
            if (!letter.classList.contains("popped") && !letter.classList.contains("hover-simulate")) {
                letter.classList.add("hover-simulate");
                setTimeout(() => {
                    letter.classList.remove("hover-simulate");
                }, 850);
            }
        }, 1400);
    }
}

function createPopVisualEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = "10px";
        particle.style.height = "10px";
        particle.style.borderRadius = "50%";
        
        const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#a855f7"];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "1000";
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        document.body.appendChild(particle);
        
        let alpha = 1;
        let px = x;
        let py = y;
        
        function animate() {
            px += vx;
            py += vy;
            alpha -= 0.04;
            
            particle.style.transform = `translate(${px - x}px, ${py - y}px) scale(${alpha})`;
            particle.style.opacity = alpha;
            
            if (alpha > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}

/* ==========================================================================
   5. Keyboard Easter Eggs (Kayla / Erika)
   ========================================================================== */

function initEasterEggs() {
    let typedBuffer = "";
    const keyTimeout = 2000;
    let timeoutId;
    
    window.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        
        clearTimeout(timeoutId);
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            typedBuffer += e.key.toLowerCase();
            if (typedBuffer.length > 15) {
                typedBuffer = typedBuffer.substring(typedBuffer.length - 15);
            }
            checkBuffer();
        }
        
        timeoutId = setTimeout(() => {
            typedBuffer = "";
        }, keyTimeout);
    });
    
    function checkBuffer() {
        if (typedBuffer.endsWith("kayla")) {
            triggerEasterEgg("kayla");
            typedBuffer = "";
        } else if (typedBuffer.endsWith("erika")) {
            triggerEasterEgg("erika");
            typedBuffer = "";
        }
    }
}

function triggerEasterEgg(name) {
    const banner = document.getElementById(`banner-${name}`);
    if (banner) {
        banner.classList.add("show");
        setTimeout(() => {
            banner.classList.remove("show");
        }, 3500);
    }
    
    const emojis = ["💖", "🌟", "🌈", "👑", "🧸", "🎨", "📿", "💍", "✨", "🎀", "💝", "🍬", "🍭", "🍩"];
    const count = 35;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const element = document.createElement("div");
            element.className = "rain-emoji";
            element.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            element.style.left = `${Math.random() * 95}%`;
            element.style.transform = `scale(${Math.random() * 0.6 + 0.7})`;
            
            const duration = Math.random() * 2 + 2;
            element.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, duration * 1000);
        }, i * 80);
    }
}

/* ==========================================================================
   6. Secret Gift Box & Coupon Reveal
   ========================================================================== */

function initGiftCoupon() {
    const giftBox = document.getElementById("gift-box");
    const teaserBox = document.querySelector(".coupon-teaser-box");
    const couponReveal = document.getElementById("coupon-reveal");
    const closeCoupon = document.getElementById("close-coupon");
    
    if (!giftBox || !couponReveal) return;
    
    giftBox.addEventListener("click", () => {
        playPopSound();
        giftBox.style.animation = "gift-wiggle-fast 0.2s 3 linear";
        
        setTimeout(() => {
            giftBox.style.animation = "";
            teaserBox.classList.add("revealed");
            couponReveal.classList.add("show");
            
            createConfetti(document.getElementById("confetti-container"));
        }, 600);
    });
    
    closeCoupon.addEventListener("click", () => {
        couponReveal.classList.remove("show");
        teaserBox.classList.remove("revealed");
    });
}

function createConfetti(container) {
    if (!container) return;
    container.innerHTML = "";
    
    const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#b026ff"];
    const count = 45;
    
    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 80 + 10}%`;
        piece.style.top = `-10px`;
        piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.animationDuration = `${Math.random() * 1.5 + 1.2}s`;
        
        const size = Math.random() * 6 + 6;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(piece);
    }
}

/* ==========================================================================
   7. Theme Customizer Panel Interactions
   ========================================================================== */

function initCustomizer() {
    const toggle = document.getElementById("customizer-toggle");
    const close = document.getElementById("customizer-close");
    const panel = document.getElementById("customizer-panel");
    const resetBtn = document.getElementById("customizer-reset");
    const saveBtn = document.getElementById("customizer-save");
    
    const pickerHeroBg = document.getElementById("picker-hero-bg");
    const pickerTitleColor = document.getElementById("picker-title-color");
    const pickerStarsColor = document.getElementById("picker-stars-color");
    const pickerDotsColor = document.getElementById("picker-dots-color");
    const fontBtns = document.querySelectorAll(".font-btn");
    
    if (!toggle || !panel) return;
    
    toggle.addEventListener("click", () => {
        panel.classList.add("open");
    });
    
    close.addEventListener("click", () => {
        panel.classList.remove("open");
    });
    
    document.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target) && panel.classList.contains("open")) {
            panel.classList.remove("open");
        }
    });
    
    syncPickerValues();
    
    pickerHeroBg.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--hero-bg-color", e.target.value);
    });
    pickerTitleColor.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--primary-color", e.target.value);
    });
    pickerStarsColor.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--stars-color", e.target.value);
    });
    pickerDotsColor.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--dots-color", e.target.value);
    });
    
    fontBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            fontBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const fontKey = btn.getAttribute("data-font");
            applyFontFamily(fontKey);
        });
    });
    
    saveBtn.addEventListener("click", () => {
        const activeFontBtn = document.querySelector(".font-btn.active");
        const activeFont = activeFontBtn ? activeFontBtn.getAttribute("data-font") : "dynapuff";
        
        const theme = {
            heroBg: pickerHeroBg.value,
            titleColor: pickerTitleColor.value,
            starsColor: pickerStarsColor.value,
            dotsColor: pickerDotsColor.value,
            font: activeFont
        };
        
        localStorage.setItem("fantastic_fashion_theme", JSON.stringify(theme));
        
        const originalText = saveBtn.innerText;
        saveBtn.innerText = "Theme Saved! ✨";
        saveBtn.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.style.backgroundColor = "";
            panel.classList.remove("open");
        }, 1500);
    });
    
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("fantastic_fashion_theme");
        applyTheme(DEFAULT_THEME);
        syncPickerValues();
        
        fontBtns.forEach(b => {
            if (b.getAttribute("data-font") === "dynapuff") {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });
        
        const originalText = resetBtn.innerText;
        resetBtn.innerText = "Reset Done!";
        setTimeout(() => {
            resetBtn.innerText = originalText;
        }, 1200);
    });
}

function syncPickerValues() {
    const rootStyles = getComputedStyle(document.documentElement);
    
    const heroBg = rootStyles.getPropertyValue("--hero-bg-color").trim();
    const titleColor = rootStyles.getPropertyValue("--primary-color").trim();
    const starsColor = rootStyles.getPropertyValue("--stars-color").trim();
    const dotsColor = rootStyles.getPropertyValue("--dots-color").trim();
    const fontFamily = rootStyles.getPropertyValue("--font-family").trim();
    
    if (document.getElementById("picker-hero-bg")) {
        document.getElementById("picker-hero-bg").value = convertToHex(heroBg) || DEFAULT_THEME.heroBg;
    }
    if (document.getElementById("picker-title-color")) {
        document.getElementById("picker-title-color").value = convertToHex(titleColor) || DEFAULT_THEME.titleColor;
    }
    if (document.getElementById("picker-stars-color")) {
        document.getElementById("picker-stars-color").value = convertToHex(starsColor) || DEFAULT_THEME.starsColor;
    }
    if (document.getElementById("picker-dots-color")) {
        document.getElementById("picker-dots-color").value = convertToHex(dotsColor) || DEFAULT_THEME.dotsColor;
    }
    
    const fontBtns = document.querySelectorAll(".font-btn");
    fontBtns.forEach(btn => {
        const fontAttr = btn.getAttribute("data-font");
        let matches = false;
        
        if (fontAttr === "dynapuff" && fontFamily.includes("DynaPuff")) matches = true;
        if (fontAttr === "fredoka" && fontFamily.includes("Fredoka")) matches = true;
        if (fontAttr === "bubblegum" && fontFamily.includes("Bubblegum")) matches = true;
        if (fontAttr === "caveat" && fontFamily.includes("Caveat")) matches = true;
        
        if (matches) {
            fontBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        }
    });
}

function convertToHex(colorVal) {
    if (!colorVal) return null;
    if (colorVal.startsWith("#")) return colorVal;
    
    const rgbArr = colorVal.match(/\d+/g);
    if (!rgbArr || rgbArr.length < 3) return null;
    
    const r = parseInt(rgbArr[0]).toString(16).padStart(2, "0");
    const g = parseInt(rgbArr[1]).toString(16).padStart(2, "0");
    const b = parseInt(rgbArr[2]).toString(16).padStart(2, "0");
    
    return `#${r}${g}${b}`;
}

/* ==========================================================================
   8. Contact Form Submissions (Anti-Spam Verification: Ontario)
   ========================================================================== */

function initContactForm() {
    const form = document.getElementById("contact-form");
    const successMsg = document.getElementById("success-message");
    const resetFormBtn = document.getElementById("reset-form-btn");
    const challengeInput = document.getElementById("form_challenge");
    const challengeError = document.getElementById("challenge-error");
    const submitBtn = document.getElementById("submit-btn");
    
    if (!form || !successMsg) return;
    
    const nextInput = form.querySelector('input[name="_next"]');
    if (nextInput) {
        nextInput.value = window.location.href;
    }
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // 1. Honeypot check
        const honeypotVal = document.getElementById("form_website").value;
        if (honeypotVal) {
            console.warn("Honeypot filled! Blocking spam submission.");
            showSuccessPanel();
            return;
        }
        
        // 2. Custom Semantic Challenge Check: Ontario
        const challengeVal = challengeInput.value.trim().toLowerCase();
        if (!challengeVal.includes("ontario")) {
            challengeError.classList.add("show");
            challengeInput.focus();
            
            if (navigator.vibrate) navigator.vibrate(100);
            
            setTimeout(() => {
                challengeError.classList.remove("show");
            }, 3000);
            
            return;
        }
        
        // 3. Form Validation Passed -> Submit via AJAX
        setSubmittingState(true);
        
        const formData = {
            name: document.getElementById("form_name").value,
            email: document.getElementById("form_email").value,
            message: document.getElementById("form_message").value,
            _subject: form.querySelector('input[name="_subject"]').value
        };
        
        fetch("https://formsubmit.co/ajax/fantastic.fashion@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            setSubmittingState(false);
            if (data.success === "true" || data.success === true) {
                showSuccessPanel();
            } else {
                alert("Oh no! Something went wrong sending your message. Please email us directly or try again!");
            }
        })
        .catch(err => {
            console.error("Submission error:", err);
            setSubmittingState(false);
            alert("Connection error. Submitting the form...");
            form.submit();
        });
    });
    
    resetFormBtn.addEventListener("click", () => {
        form.reset();
        successMsg.classList.remove("show");
        form.style.opacity = "1";
        form.style.pointerEvents = "auto";
    });
    
    function setSubmittingState(isSubmitting) {
        const btnText = submitBtn.querySelector(".btn-text");
        if (isSubmitting) {
            submitBtn.disabled = true;
            btnText.innerText = "Sending Message... 🚀";
            submitBtn.style.opacity = "0.7";
        } else {
            submitBtn.disabled = false;
            btnText.innerText = "Send Message ✨";
            submitBtn.style.opacity = "1";
        }
    }
    
    function showSuccessPanel() {
        successMsg.classList.add("show");
        form.style.opacity = "0";
        form.style.pointerEvents = "none";
        
        //Confetti on success
        createConfetti(document.getElementById("confetti-container"));
    }
}

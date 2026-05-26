/* ==========================================================================
   Fantastic Fashion Interactive Engine - Reverted & Optimized Trail
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
    
    // Create a fixed set of stars once. No dynamic DOM insertion/deletion intervals needed!
    const count = window.innerWidth < 768 ? 35 : 60;
    for (let i = 0; i < count; i++) {
        spawnStar(overlay, true);
    }
}

function spawnStar(container, isInitial = true) {
    const star = document.createElement("div");
    const isDot = Math.random() > 0.6;
    star.className = isDot ? "sparkle-dot" : "sparkle-star";
    
    let size = isDot ? Math.random() * 4 + 2 : Math.random() * 16 + 8;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Negative delay so they start at different points in their animation cycle
    const delay = -Math.random() * 6;
    star.style.animationDelay = `${delay}s`;
    
    const duration = Math.random() * 4 + 3; // 3s to 7s
    star.style.animationDuration = `${duration}s`;
    
    container.appendChild(star);
}

/* ==========================================================================
   3. Fast-Fade Stardust Trail Engine (Dynamic Sleep Loop)
   ========================================================================== */

let globalParticles = [];
let isLoopRunning = false;

let lastSpawnX = 0;
let lastSpawnY = 0;
const SPAWN_THRESHOLD = 20; 

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
    
    // Spawn mouse stardust on Desktop
    window.addEventListener("mousemove", (e) => {
        const dist = Math.hypot(e.clientX - lastSpawnX, e.clientY - lastSpawnY);
        if (dist > SPAWN_THRESHOLD) {
            addParticle(createParticle(e.clientX, e.clientY));
            lastSpawnX = e.clientX;
            lastSpawnY = e.clientY;
        }
    });

    // Touch events for stardust trail on Mobile
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const dist = Math.hypot(touch.clientX - lastSpawnX, touch.clientY - lastSpawnY);
            if (dist > SPAWN_THRESHOLD) {
                addParticle(createParticle(touch.clientX, touch.clientY));
                lastSpawnX = touch.clientX;
                lastSpawnY = touch.clientY;
            }
        }
    });

    // Tap/Click star explosions
    window.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON" || e.target.closest(".customizer-panel") || e.target.closest(".customizer-toggle") || e.target.closest(".pop-letter")) return;
        spawnBurst(e.clientX, e.clientY);
    });

    window.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            if (touch.target.tagName === "INPUT" || touch.target.tagName === "TEXTAREA" || touch.target.tagName === "BUTTON" || touch.target.closest(".customizer-panel") || touch.target.closest(".customizer-toggle") || touch.target.closest(".product-card") || touch.target.closest("#gift-box") || touch.target.closest(".pop-letter")) return;
            spawnBurst(touch.clientX, touch.clientY);
        }
    });
    
    function addParticle(p) {
        globalParticles.push(p);
        
        // Cap particles array to keep mobile rendering fast (longer trail if Super Trail powerup is active)
        const maxParticles = (typeof activePowerups !== 'undefined' && activePowerups.supertrail) ? 60 : 25;
        if (globalParticles.length > maxParticles) {
            globalParticles.shift();
        }

        // Start animation loop if it's currently sleeping
        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(updateParticles);
        }
    }

    // Sparkle Particle Creator (Dynamically adjusts if Super Star Trail powerup is active)
    function createParticle(x, y) {
        const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#b026ff"];
        const isSuper = activePowerups && activePowerups.supertrail;
        
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * (isSuper ? 5 : 2.5),
            vy: (Math.random() - 0.5) * (isSuper ? 5 : 2.5) - (isSuper ? 2.5 : 1.5), 
            size: isSuper ? Math.random() * 16 + 10 : Math.random() * 8 + 4,          
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: isSuper ? Math.random() * 0.009 + 0.007 : Math.random() * 0.022 + 0.018, 
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * (isSuper ? 0.25 : 0.1)
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
        if (globalParticles.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            isLoopRunning = false;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
        
        requestAnimationFrame(updateParticles);
    }
    
    // Sparkle Burst (Click/Tap triggers - Reverted parameters)
    function spawnBurst(x, y) {
        const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#b026ff"];
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
            const speed = Math.random() * 3 + 1;
            addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5, // Floats up
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.022 + 0.018,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.12
            });
        }
    }
}

/* ==========================================================================
   4. Bubble Letter Popping & Mobile Idle Animation
   ========================================================================== */

let globalAudioCtx = null;
let popCount = 0;
let popCounterShown = false;
let activePowerups = {
    rainbow: false,
    xylophone: false,
    supertrail: false
};

function playPopSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        
        if (!globalAudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
        
        if (globalAudioCtx.state === "suspended") {
            globalAudioCtx.resume();
        }
        
        const osc = globalAudioCtx.createOscillator();
        const gainNode = globalAudioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, globalAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, globalAudioCtx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.25, globalAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(globalAudioCtx.destination);
        
        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.12);
    } catch (e) {
        console.log("Audio blocked by browser config:", e);
    }
}

function playXylophoneSound(index) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        
        if (!globalAudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
        
        if (globalAudioCtx.state === "suspended") {
            globalAudioCtx.resume();
        }
        
        // Major scale frequencies starting at C5 (523.25 Hz)
        // 16 letters total: C5, D5, E5, F5, G5, A5, B5, C6, D6, E6, F6, G6, A6, B6, C7, D7
        const majorScale = [
            523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, // C5 to B5
            1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53, // C6 to B6
            2093.00, 2349.32 // C7 to D7
        ];
        
        const freq = majorScale[index % majorScale.length];
        
        const osc = globalAudioCtx.createOscillator();
        const gainNode = globalAudioCtx.createGain();
        
        // Sweet, resonant sine wave note that rings slightly like a toy xylophone bar
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, globalAudioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, globalAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.3); // longer ring decay
        
        osc.connect(gainNode);
        gainNode.connect(globalAudioCtx.destination);
        
        osc.start();
        osc.stop(globalAudioCtx.currentTime + 0.35);
    } catch (e) {
        console.log("Xylophone play error:", e);
    }
}

function playFanfareSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        
        if (!globalAudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
        
        if (globalAudioCtx.state === "suspended") {
            globalAudioCtx.resume();
        }
        
        const now = globalAudioCtx.currentTime;
        
        // Ascending chime notes C5, E5, G5, C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            
            gain.gain.setValueAtTime(0, now + idx * 0.15);
            gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
            
            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);
            
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.4);
        });
    } catch (e) {
        console.log("Fanfare sound error:", e);
    }
}

function incrementPopCount() {
    popCount++;
    
    const counterContainer = document.getElementById("pop-counter-container");
    const counterNumber = document.getElementById("pop-count-number");
    
    if (counterNumber) {
        counterNumber.innerText = popCount;
        
        counterNumber.classList.add("bump");
        setTimeout(() => {
            counterNumber.classList.remove("bump");
        }, 150);
    }
    
    if (popCount >= 3 && !popCounterShown && counterContainer) {
        counterContainer.classList.add("visible");
        popCounterShown = true;
    }
    
    if (popCount === 100) {
        triggerPopMasterReward();
    }
}

let emojiRainInterval = null;

function startGentleEmojiRain() {
    if (emojiRainInterval) return;
    
    emojiRainInterval = setInterval(() => {
        const emojis = ["👑", "🏆", "🌟", "✨", "🎈", "🎉", "💖", "💎", "🌈", "⭐", "🍕", "🧁", "🍭", "🧸", "🦄"];
        const element = document.createElement("div");
        element.className = "rain-emoji";
        element.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        element.style.left = `${Math.random() * 95}%`;
        element.style.transform = `scale(${Math.random() * 0.5 + 0.6})`;
        
        // Gentle slow fall for background stardust trail
        const duration = Math.random() * 4 + 4; // 4s to 8s
        element.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, duration * 1000);
    }, 150); 
}

function stopGentleEmojiRain() {
    if (emojiRainInterval) {
        clearInterval(emojiRainInterval);
        emojiRainInterval = null;
    }
}

function triggerPopMasterReward() {
    playFanfareSound();
    triggerMassiveEmojiRain();
    
    // Style/disable buttons for powerups that are already active
    const powerupButtons = document.querySelectorAll(".powerup-btn");
    let allUnlocked = true;
    powerupButtons.forEach(btn => {
        const powerup = btn.getAttribute("data-powerup");
        if (activePowerups[powerup]) {
            btn.style.opacity = "0.4";
            btn.style.pointerEvents = "none";
            const btnStrong = btn.querySelector("strong");
            if (btnStrong && !btnStrong.innerText.includes("Active")) {
                btnStrong.innerText += " (Active! ✅)";
            }
        } else {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
            allUnlocked = false;
        }
    });
    
    // If all three are already unlocked, reset them all so they can re-unlock!
    if (allUnlocked) {
        powerupButtons.forEach(btn => {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
            const btnStrong = btn.querySelector("strong");
            if (btnStrong) {
                btnStrong.innerText = btnStrong.innerText.replace(" (Active! ✅)", "");
            }
            const powerup = btn.getAttribute("data-powerup");
            activePowerups[powerup] = false;
        });
        document.documentElement.classList.remove("rainbow-shimmer-active");
        stopGentleEmojiRain();
        updatePowerupsUI();
    }
    
    const modal = document.getElementById("pop-master-modal");
    if (modal) {
        modal.classList.add("show");
    }
    
    const confettiContainer = document.getElementById("confetti-container");
    createConfetti(confettiContainer);
    setTimeout(() => {
        createConfetti(confettiContainer);
    }, 500);
}

function triggerMassiveEmojiRain() {
    const emojis = ["👑", "🏆", "🌟", "✨", "🎈", "🎉", "💖", "💎", "🌈", "⭐", "🍕", "🧁", "🍭", "🧸", "🦄"];
    const count = 50;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const element = document.createElement("div");
            element.className = "rain-emoji";
            element.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            element.style.left = `${Math.random() * 95}%`;
            element.style.transform = `scale(${Math.random() * 0.8 + 0.8})`;
            element.style.zIndex = "2100";
            
            // Twice as long (4s to 9s fall duration)
            const duration = Math.random() * 5 + 4;
            element.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, duration * 1000);
        }, i * 60);
    }
}

function activatePowerup(powerup) {
    activePowerups[powerup] = true;
    
    if (powerup === "rainbow") {
        document.documentElement.classList.add("rainbow-shimmer-active");
    }
    
    if (powerup === "supertrail") {
        startGentleEmojiRain();
    }
    
    updatePowerupsUI();
}

function updatePowerupsUI() {
    const listEl = document.getElementById("active-powerups-list");
    if (!listEl) return;
    
    const activeNames = [];
    if (activePowerups.rainbow) activeNames.push("🌈 Rainbow");
    if (activePowerups.xylophone) activeNames.push("🎹 Xylophone");
    if (activePowerups.supertrail) activeNames.push("✨ Emoji Star Trail");
    
    if (activeNames.length > 0) {
        listEl.innerText = `Powerups Active: ${activeNames.join(" | ")}`;
        listEl.classList.add("has-active");
    } else {
        listEl.classList.remove("has-active");
    }
}

function resetPopCount() {
    popCount = 0;
    const counterNumber = document.getElementById("pop-count-number");
    if (counterNumber) {
        counterNumber.innerText = popCount;
    }
}

function initBubbleLetters() {
    const letters = document.querySelectorAll(".pop-letter");
    
    letters.forEach((letter, idx) => {
        letter.addEventListener("mousedown", (e) => e.preventDefault());
        
        letter.addEventListener("click", () => {
            if (letter.classList.contains("popped")) return;
            
            if (activePowerups && activePowerups.xylophone) {
                playXylophoneSound(idx);
            } else {
                playPopSound();
            }
            letter.classList.add("popped");
            createPopVisualEffect(letter);
            
            // Increment the counter
            incrementPopCount();
            
            setTimeout(() => {
                letter.classList.remove("popped");
                letter.style.transform = "scale(0)";
                letter.style.opacity = "0";
                
                void letter.offsetWidth;
                
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

    // Close achievement modal / powerup buttons triggers
    const powerupButtons = document.querySelectorAll(".powerup-btn");
    powerupButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const powerup = btn.getAttribute("data-powerup");
            activatePowerup(powerup);
            
            // Close the modal
            const modal = document.getElementById("pop-master-modal");
            if (modal) modal.classList.remove("show");
            
            // Reset counter
            resetPopCount();
            
            // Show confetti
            createConfetti(document.getElementById("confetti-container"));
        });
    });
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
   5. Easter Eggs & Subtitle Double-Taps (Kayla & Erika)
   ========================================================================== */

function initEasterEggs() {
    let typedBuffer = "";
    const keyTimeout = 2000;
    let timeoutId;
    
    // Keyboard listener (Desktop)
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
        } else if (typedBuffer.endsWith("jojo")) {
            triggerPopMasterReward();
            typedBuffer = "";
        }
    }

    // Double Tap subtitle trigger (Clean names, no underline text decoration)
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) {
        subtitle.innerHTML = `By <span class="owner-tap" id="tap-kayla" style="cursor:pointer; font-weight: bold; transition: color 0.2s;">Kayla</span> and <span class="owner-tap" id="tap-erika" style="cursor:pointer; font-weight: bold; transition: color 0.2s;">Erika</span>`;
        
        const tapKayla = document.getElementById("tap-kayla");
        const tapErika = document.getElementById("tap-erika");
        
        let lastTapKayla = 0;
        let lastTapErika = 0;
        
        tapKayla.addEventListener("click", () => {
            const now = Date.now();
            if (now - lastTapKayla < 350) {
                triggerEasterEgg("kayla");
            }
            lastTapKayla = now;
        });

        tapErika.addEventListener("click", () => {
            const now = Date.now();
            if (now - lastTapErika < 350) {
                triggerEasterEgg("erika");
            }
            lastTapErika = now;
        });

        tapKayla.addEventListener("touchstart", (e) => {
            const now = Date.now();
            if (now - lastTapKayla < 350) {
                e.preventDefault();
                triggerEasterEgg("kayla");
            }
            lastTapKayla = now;
        });

        tapErika.addEventListener("touchstart", (e) => {
            const now = Date.now();
            if (now - lastTapErika < 350) {
                e.preventDefault();
                triggerEasterEgg("erika");
            }
            lastTapErika = now;
        });
    }

    // Double Tap gold dots trigger (jojo cheat code for mobile/desktop)
    const goldDots = document.querySelector(".gold-dots");
    if (goldDots) {
        let lastTapDots = 0;
        
        goldDots.addEventListener("click", () => {
            const now = Date.now();
            if (now - lastTapDots < 350) {
                triggerPopMasterReward();
            }
            lastTapDots = now;
        });
        
        goldDots.addEventListener("touchstart", (e) => {
            const now = Date.now();
            if (now - lastTapDots < 350) {
                e.preventDefault();
                triggerPopMasterReward();
            }
            lastTapDots = now;
        });
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
    
    // DISTINCT EMOJIS!
    let emojis = [];
    if (name === "kayla") {
        emojis = ["💖", "🎀", "🧸", "💝", "🌸", "🍬", "🍭", "👑", "🦄", "⭐", "🍩", "📿"];
    } else {
        emojis = ["🌈", "🌟", "🎨", "💍", "💎", "💫", "🍕", "🐱", "🐶", "🧁", "🍩"];
    }
    
    const count = 20; 
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
        }, i * 100);
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
    const count = 20; 
    
    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 80 + 10}%`;
        piece.style.top = `-10px`;
        piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
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
   8. Contact Form Submissions (Anti-Spam Verification: Canada)
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
        
        // 2. Custom Semantic Challenge Check: Canada
        const challengeVal = challengeInput.value.trim().toLowerCase();
        if (!challengeVal.includes("canada")) {
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
        
        createConfetti(document.getElementById("confetti-container"));
    }
}

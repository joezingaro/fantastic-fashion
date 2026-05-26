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
   1. Theme Initialization
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
    
    // Spawn initial batch of stars
    const initialStarsCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < initialStarsCount; i++) {
        spawnStar(overlay, true);
    }
    
    // Periodically spawn a new star to keep it dynamic
    setInterval(() => {
        spawnStar(overlay, false);
    }, 1200);
}

function spawnStar(container, isInitial = false) {
    const star = document.createElement("div");
    
    // Decide if it is a polygon star or a round dot
    const isDot = Math.random() > 0.6;
    star.className = isDot ? "sparkle-dot" : "sparkle-star";
    
    // Random sizes
    let size = isDot ? Math.random() * 4 + 2 : Math.random() * 20 + 8; // Stars 8-28px, Dots 2-6px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random positions
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random animation delays and durations
    if (isInitial) {
        // Stagger delays so they don't fade in/out at the same time
        const delay = -Math.random() * 4;
        star.style.animationDelay = `${delay}s`;
    } else {
        star.style.animationDelay = `0s`;
    }
    
    const duration = Math.random() * 3 + 3; // 3 to 6 seconds
    star.style.animationDuration = `${duration}s`;
    
    // Append
    container.appendChild(star);
    
    // Cleanup old stars that are not initial (stars run infinite animations, but we prune overflow)
    const maxCapacity = 60;
    if (container.children.length > maxCapacity) {
        container.removeChild(container.firstChild);
    }
}

/* ==========================================================================
   3. Magic Wand Mouse Trail Canvas
   ========================================================================== */

function initMouseTrail() {
    const canvas = document.getElementById("trail-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    
    // Handle resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Track mouse
    window.addEventListener("mousemove", (e) => {
        // Spawn 2 particles per mouse move
        for (let i = 0; i < 2; i++) {
            particles.push(createParticle(e.clientX, e.clientY));
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            particles.push(createParticle(touch.clientX, touch.clientY));
        }
    });
    
    function createParticle(x, y) {
        // Random bright cute colors
        const colors = [
            "#ff2a85", // Pink
            "#00e5ff", // Turquoise
            "#ffff00", // Yellow
            "#ffd700", // Gold
            "#ff9d00", // Orange
            "#b026ff"  // Purple
        ];
        
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5 - 1.5, // Float upwards
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
    }
    
    // Draw 4-pointed diamond sparkle star on canvas
    function drawSparkle(ctx, x, y, size, rotation, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        // Drawing a diamond star shape
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
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.rotation += p.rotationSpeed;
            
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                drawSparkle(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
            }
        }
        
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

/* ==========================================================================
   4. Bubble Letter pop & return micro-interaction
   ========================================================================== */

function initBubbleLetters() {
    const letters = document.querySelectorAll(".pop-letter");
    
    letters.forEach(letter => {
        // Prevent click drag selection
        letter.addEventListener("mousedown", (e) => e.preventDefault());
        
        letter.addEventListener("click", () => {
            if (letter.classList.contains("popped")) return;
            
            // Add pop animation
            letter.classList.add("popped");
            
            // Create a small burst of floating colorful micro-particles when it pops
            createPopVisualEffect(letter);
            
            // Return letter after 1.2 seconds
            setTimeout(() => {
                letter.classList.remove("popped");
                // Trigger a nice wiggle scale-in effect
                letter.style.transform = "scale(0)";
                letter.style.opacity = "0";
                
                // Forces browser reflow
                void letter.offsetWidth;
                
                // Smoothly fade back in
                letter.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s";
                letter.style.transform = "scale(1)";
                letter.style.opacity = "1";
                
                // Clear inline transition after animation completes
                setTimeout(() => {
                    letter.style.transition = "";
                    letter.style.transform = "";
                    letter.style.opacity = "";
                }, 400);
                
            }, 1200);
        });
    });
}

function createPopVisualEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Spawn 8 tiny popping circle particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = "10px";
        particle.style.height = "10px";
        particle.style.borderRadius = "50%";
        
        // Random pretty color
        const colors = ["#ff2a85", "#00e5ff", "#ffff00", "#ffd700", "#ff9d00", "#a855f7"];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "1000";
        
        // Random velocity direction
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
    const keyTimeout = 2000; // Reset typing tracker after 2 seconds of inactivity
    let timeoutId;
    
    window.addEventListener("keydown", (e) => {
        // Ignore inputs if typed in form fields
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        
        clearTimeout(timeoutId);
        
        // Accumulate keys (alphabetic only)
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            typedBuffer += e.key.toLowerCase();
            
            // Keep buffer reasonable length
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
    
    function triggerEasterEgg(name) {
        // 1. Show floating card banner
        const banner = document.getElementById(`banner-${name}`);
        if (banner) {
            banner.classList.add("show");
            setTimeout(() => {
                banner.classList.remove("show");
            }, 3500);
        }
        
        // 2. Spawn emoji shower
        const emojis = ["💖", "🌟", "🌈", "👑", "🧸", "🎨", "📿", "💍", "✨", "🎀", "💝", "🍬", "🍭", "🍩"];
        const count = 35;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const element = document.createElement("div");
                element.className = "rain-emoji";
                element.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                
                // Random position & scale
                element.style.left = `${Math.random() * 95}%`;
                element.style.transform = `scale(${Math.random() * 0.6 + 0.7})`;
                
                // Random animation durations
                const duration = Math.random() * 2 + 2; // 2 to 4 seconds
                element.style.animationDuration = `${duration}s`;
                
                document.body.appendChild(element);
                
                // Cleanup after falls off screen
                setTimeout(() => {
                    element.remove();
                }, duration * 1000);
            }, i * 80); // Stagger spawn times
        }
    }
}

/* ==========================================================================
   6. Secret Gift Box & Coupon Reveal
   ========================================================================== */

function initGiftCoupon() {
    const giftBox = document.getElementById("gift-box");
    const couponReveal = document.getElementById("coupon-reveal");
    const closeCoupon = document.getElementById("close-coupon");
    const copyBtn = document.getElementById("copy-code-btn");
    
    if (!giftBox || !couponReveal) return;
    
    giftBox.addEventListener("click", () => {
        // Play click wiggles
        giftBox.style.animation = "gift-wiggle-fast 0.2s 3 linear";
        
        setTimeout(() => {
            giftBox.style.animation = "";
            couponReveal.classList.add("show");
            
            // Trigger local confetti shower inside the card
            createConfetti(document.getElementById("confetti-container"));
        }, 600);
    });
    
    closeCoupon.addEventListener("click", () => {
        couponReveal.classList.remove("show");
    });
    
    copyBtn.addEventListener("click", () => {
        const codeText = "FANTASTIC5";
        
        navigator.clipboard.writeText(codeText).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied! 🎉";
            copyBtn.style.backgroundColor = "#10b981"; // Green success
            
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.backgroundColor = ""; // Reset
            }, 2000);
        }).catch(err => {
            console.error("Could not copy text: ", err);
        });
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
        
        // Random positions starting near top center of container
        piece.style.left = `${Math.random() * 80 + 10}%`;
        piece.style.top = `-10px`;
        
        // Random falling properties
        piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.animationDuration = `${Math.random() * 1.5 + 1.2}s`;
        
        // Random rotation & size
        const size = Math.random() * 6 + 6; // 6px to 12px
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
    
    // Pickers
    const pickerHeroBg = document.getElementById("picker-hero-bg");
    const pickerTitleColor = document.getElementById("picker-title-color");
    const pickerStarsColor = document.getElementById("picker-stars-color");
    const pickerDotsColor = document.getElementById("picker-dots-color");
    
    // Font buttons
    const fontBtns = document.querySelectorAll(".font-btn");
    
    if (!toggle || !panel) return;
    
    // Open/Close
    toggle.addEventListener("click", () => {
        panel.classList.add("open");
    });
    
    close.addEventListener("click", () => {
        panel.classList.remove("open");
    });
    
    // Close panel if clicked outside
    document.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target) && panel.classList.contains("open")) {
            panel.classList.remove("open");
        }
    });
    
    // Synchronize form controls with current variable values on load
    syncPickerValues();
    
    // Setup Picker Live Changes
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
    
    // Font selector changes
    fontBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            fontBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const fontKey = btn.getAttribute("data-font");
            applyFontFamily(fontKey);
        });
    });
    
    // Save theme button
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
        
        // Show success animation on button
        const originalText = saveBtn.innerText;
        saveBtn.innerText = "Theme Saved! ✨";
        saveBtn.style.backgroundColor = "#10b981"; // Success Green
        
        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.style.backgroundColor = ""; // Reset
            panel.classList.remove("open");
        }, 1500);
    });
    
    // Reset button
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("fantastic_fashion_theme");
        applyTheme(DEFAULT_THEME);
        syncPickerValues();
        
        // Reset active font button
        fontBtns.forEach(b => {
            if (b.getAttribute("data-font") === "dynapuff") {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });
        
        // Show reset feedback on reset button
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
    
    // Sync font buttons state
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

// Helper to convert rgb(x, y, z) outputted by browser styles to #hex
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
   8. Contact Form Verification & Submissions (with AJAX submission)
   ========================================================================== */

function initContactForm() {
    const form = document.getElementById("contact-form");
    const successMsg = document.getElementById("success-message");
    const resetFormBtn = document.getElementById("reset-form-btn");
    const challengeInput = document.getElementById("form_challenge");
    const challengeError = document.getElementById("challenge-error");
    const submitBtn = document.getElementById("submit-btn");
    
    if (!form || !successMsg) return;
    
    // Sync redirection URL (FormSubmit works with _next, but since we submit AJAX, we don't strictly need it. We still configure it just in case fallback happens.)
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
            // Pretend success so bot doesn't keep trying
            showSuccessPanel();
            return;
        }
        
        // 2. Custom Semantic Challenge Check
        const challengeVal = challengeInput.value.trim().toLowerCase();
        // Erika is spelled with a K. So answer should be 'k' (or 'k' inside a sentence, e.g. "with a k" or just "k")
        if (!challengeVal.includes("k") || challengeVal.includes("c")) {
            challengeError.classList.add("show");
            challengeInput.focus();
            
            // Vibrate error (if mobile)
            if (navigator.vibrate) navigator.vibrate(100);
            
            setTimeout(() => {
                challengeError.classList.remove("show");
            }, 3000);
            
            return;
        }
        
        // 3. Form Validation Passed -> Submit via AJAX
        setSubmittingState(true);
        
        // Collect form data
        const formData = {
            name: document.getElementById("form_name").value,
            email: document.getElementById("form_email").value,
            message: document.getElementById("form_message").value,
            _subject: form.querySelector('input[name="_subject"]').value
        };
        
        // Submit using AJAX endpoint of FormSubmit (ajax method)
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
                alert("Oh no! Something went wrong sending your message. Please try again or email us directly at fantastic.fashion@gmail.com!");
            }
        })
        .catch(err => {
            console.error("Submission error:", err);
            setSubmittingState(false);
            // Fallback: Submit the old-fashioned way by triggering native submit
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
        
        // Trigger a nice confetti explosion on success!
        const successPos = successMsg.getBoundingClientRect();
        createConfetti(document.getElementById("confetti-container"));
    }
}

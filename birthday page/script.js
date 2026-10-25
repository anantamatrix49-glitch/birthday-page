/**
 * ============================================================================
 * MANYA GUPTA BIRTHDAY PRESENTATION — CORE ENGINE (script.js)
 * Strict 100vh Multi-Scene Presentation • Zero Vertical Scrolling
 * Features: Scene State Machine, Audio Engine, Confetti Burst, Canvas Stars,
 *           Interactive Envelope, Milestone Stepper & Gallery Showcase
 * ============================================================================
 */

(function () {
    "use strict";

    // ------------------------------------------------------------------------
    // 1. CONFIGURATION & STATE
    // ------------------------------------------------------------------------
    const CONFIG = {
        totalPages: 7,
        transitionDuration: 550, // ms lock
        defaultVolume: 0.8,
        musicFile: "assets/music/happy-birthday.mp3",
        fallbackMusicFile: "happy-birthday.mp3",
        songTitle: "Happy Birthday Manya 🎵"
    };

    const STATE = {
        currentScene: 1,
        isTransitioning: false,
        isPlayingMusic: false,
        currentStorySlide: 1,
        currentGalleryIdx: 0,
        currentLetterPara: 1,
        isLetterOpened: false,
        candlesBlown: false
    };

    // ------------------------------------------------------------------------
    // 2. DOM ELEMENTS CACHE
    // ------------------------------------------------------------------------
    const DOM = {
        // App shell
        appViewport: document.getElementById("appViewport"),
        scenesWrapper: document.getElementById("scenesWrapper"),
        scenes: document.querySelectorAll(".scene"),
        currentPageNum: document.getElementById("currentPageNum"),
        
        // Persistent Top Nav
        persistentMusicBtn: document.getElementById("persistentMusicBtn"),
        persistentMusicIcon: document.getElementById("persistentMusicIcon"),
        persistentMusicLabel: document.getElementById("persistentMusicLabel"),
        soundWave: document.getElementById("soundWave"),

        // Bottom Dock
        navBtnBack: document.getElementById("navBtnBack"),
        navBtnNext: document.getElementById("navBtnNext"),
        navNextText: document.getElementById("navNextText"),
        navDots: document.querySelectorAll(".nav-dot"),

        // Scene 1: Invitation
        btnOpenSurprise: document.getElementById("btnOpenSurprise"),

        // Scene 2: Reveal
        btnRevealNext: document.getElementById("btnRevealNext"),

        // Scene 3: Story
        storyTabs: document.querySelectorAll(".story-tab"),
        storySlides: document.querySelectorAll(".story-slide"),
        storyDots: document.querySelectorAll("#storyIndicators .dot"),
        btnStoryPrev: document.getElementById("btnStoryPrev"),
        btnStoryNext: document.getElementById("btnStoryNext"),

        // Scene 4: Gallery
        galleryStage: document.getElementById("galleryStage"),
        galleryBlurBg: document.getElementById("galleryBlurBg"),
        galleryMainImg: document.getElementById("galleryMainImg"),
        galleryCurrentIdx: document.getElementById("galleryCurrentIdx"),
        galleryTotalCount: document.getElementById("galleryTotalCount"),
        galleryCaption: document.getElementById("galleryCaption"),
        gallerySubtext: document.getElementById("gallerySubtext"),
        galleryBtnPrev: document.getElementById("galleryBtnPrev"),
        galleryBtnNext: document.getElementById("galleryBtnNext"),
        galleryThumbsRow: document.getElementById("galleryThumbsRow"),

        // Scene 5: Letter
        envelopeWrapper: document.getElementById("envelopeWrapper"),
        envelopeCard: document.getElementById("envelopeCard"),
        btnOpenLetter: document.getElementById("btnOpenLetter"),
        envelopeFlap: document.getElementById("envelopeFlap"),
        letterRevealedWrapper: document.getElementById("letterRevealedWrapper"),
        letterParas: document.querySelectorAll(".letter-para"),
        letterPageStatus: document.getElementById("letterPageStatus"),
        btnLetterPrev: document.getElementById("btnLetterPrev"),
        btnLetterNext: document.getElementById("btnLetterNext"),
        btnOpenReadAllModal: document.getElementById("btnOpenReadAllModal"),

        // Modal
        letterModal: document.getElementById("letterModal"),
        modalBackdrop: document.getElementById("modalBackdrop"),
        btnCloseLetterModal: document.getElementById("btnCloseLetterModal"),
        btnModalCloseAction: document.getElementById("btnModalCloseAction"),

        // Scene 6: Birthday Wall
        cakeWrapper: document.getElementById("cakeWrapper"),
        candleFlames: document.getElementById("candleFlames"),
        cakeHint: document.getElementById("cakeHint"),
        btnMakeWish: document.getElementById("btnMakeWish"),

        // Scene 7: Final
        btnFinalReadLetter: document.getElementById("btnFinalReadLetter"),
        btnFinalMemories: document.getElementById("btnFinalMemories"),
        btnFinalReplay: document.getElementById("btnFinalReplay"),
        editableSig: document.getElementById("editableSig"),

        // Audio & Canvas
        sharedAudio: document.getElementById("sharedBirthdayAudio"),
        ambientCanvas: document.getElementById("ambientCanvas")
    };

    // Gallery Photos Collection
    const GALLERY_ITEMS = [
        { src: "images/photo1.jpeg", caption: " ❤️", subtext: "Always been my Favourite." },
        { src: "images/photo2.jpeg", caption: "📸", subtext: "God bless You " },
        { src: "images/photo3.jpeg", caption: " 🎂", subtext: " May this year filled with joy" },
        { src: "images/photo4.jpeg", caption: "🥳", subtext: "Go ahead in life" },
        { src: "images/photo5.jpeg", caption: "True Friendship 🫶", subtext: "A rare friendship that stands strong through it all." },
        { src: "images/photo6.jpeg", caption: "Good Vibes 🌟", subtext: "" },
        { src: "images/photo7.jpeg", caption: "🤝", subtext: "More than friendship—a connection built on genuine respect." },
        { src: "images/photo8.jpeg", caption: "Always Together 🫂", subtext: "Standing by each other through every chapter of life." },
        { src: "images/photo9.jpeg", caption: "Pure Golden Happiness ✨", subtext: "May this bright glow stay with you forever." },
        { src: "images/photo10.jpeg", caption: "Cherished Times 💖", subtext: "Memories etched forever in heart and soul." }
    ];

    // ------------------------------------------------------------------------
    // 3. SCENE STATE MACHINE & NAVIGATION
    // ------------------------------------------------------------------------
    function initSceneManager() {
        goToScene(1, true);

        // Next / Back buttons
        if (DOM.navBtnNext) {
            DOM.navBtnNext.addEventListener("click", () => {
                if (STATE.currentScene < CONFIG.totalPages) {
                    goToScene(STATE.currentScene + 1);
                } else {
                    // On final page, next acts as replay
                    goToScene(1);
                }
            });
        }

        if (DOM.navBtnBack) {
            DOM.navBtnBack.addEventListener("click", () => {
                if (STATE.currentScene > 1) {
                    goToScene(STATE.currentScene - 1);
                }
            });
        }

        // Direct Nav Dots
        DOM.navDots.forEach(dot => {
            dot.addEventListener("click", () => {
                const target = parseInt(dot.getAttribute("data-target"), 10);
                if (target && target !== STATE.currentScene) {
                    goToScene(target);
                }
            });
        });

        // Scene 1 CTA
        if (DOM.btnOpenSurprise) {
            DOM.btnOpenSurprise.addEventListener("click", () => {
                // Try unlocking audio gently on user interaction if not playing
                tryPlayMusicGesture();
                goToScene(2);
            });
        }

        // Scene 2 CTA
        if (DOM.btnRevealNext) {
            DOM.btnRevealNext.addEventListener("click", () => {
                goToScene(3);
            });
        }

        // Scene 7 Final Action Buttons
        if (DOM.btnFinalReadLetter) {
            DOM.btnFinalReadLetter.addEventListener("click", () => {
                goToScene(5);
                if (!STATE.isLetterOpened) openEnvelope();
            });
        }

        if (DOM.btnFinalMemories) {
            DOM.btnFinalMemories.addEventListener("click", () => goToScene(4));
        }

        if (DOM.btnFinalReplay) {
            DOM.btnFinalReplay.addEventListener("click", () => goToScene(1));
        }

        // Keyboard Navigation (ArrowLeft / ArrowRight)
        window.addEventListener("keydown", (e) => {
            // Do not intercept if user is typing in editable signature
            if (e.target && e.target.isContentEditable) return;

            if (e.key === "ArrowRight") {
                if (STATE.currentScene < CONFIG.totalPages) {
                    goToScene(STATE.currentScene + 1);
                }
            } else if (e.key === "ArrowLeft") {
                if (STATE.currentScene > 1) {
                    goToScene(STATE.currentScene - 1);
                }
            } else if (e.key === "Escape") {
                closeReadAllModal();
            }
        });
    }

    function goToScene(targetSceneNum, immediate = false) {
        if (STATE.isTransitioning && !immediate) return;
        if (targetSceneNum < 1 || targetSceneNum > CONFIG.totalPages) return;

        STATE.isTransitioning = true;
        const prevSceneNum = STATE.currentScene;
        STATE.currentScene = targetSceneNum;

        // Update Top Navigation Counter
        if (DOM.currentPageNum) {
            DOM.currentPageNum.textContent = String(targetSceneNum).padStart(2, "0");
        }

        // Update Bottom Nav Dots
        DOM.navDots.forEach(dot => {
            const dotTarget = parseInt(dot.getAttribute("data-target"), 10);
            const isActive = dotTarget === targetSceneNum;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        // Update Back Button Visibility (Hidden strictly on Page 1)
        if (DOM.navBtnBack) {
            if (targetSceneNum === 1) {
                DOM.navBtnBack.style.visibility = "hidden";
                DOM.navBtnBack.style.pointerEvents = "none";
                DOM.navBtnBack.setAttribute("aria-hidden", "true");
            } else {
                DOM.navBtnBack.style.visibility = "visible";
                DOM.navBtnBack.style.pointerEvents = "auto";
                DOM.navBtnBack.removeAttribute("aria-hidden");
            }
        }

        // Update Next Button Text
        if (DOM.navNextText) {
            if (targetSceneNum === CONFIG.totalPages) {
                DOM.navNextText.textContent = "Replay ↺";
            } else {
                DOM.navNextText.textContent = "Next";
            }
        }

        // Manage Scene DOM Visibility and Accessibility Attributes
        DOM.scenes.forEach(scene => {
            const sceneIdx = parseInt(scene.getAttribute("data-scene"), 10);
            if (sceneIdx === targetSceneNum) {
                scene.classList.add("active");
                scene.removeAttribute("inert");
                scene.removeAttribute("aria-hidden");
            } else {
                scene.classList.remove("active");
                scene.setAttribute("inert", "");
                scene.setAttribute("aria-hidden", "true");
            }
        });

        // Page-specific trigger actions
        onSceneEntered(targetSceneNum, prevSceneNum);

        // Unlock navigation transition debounce
        setTimeout(() => {
            STATE.isTransitioning = false;
        }, immediate ? 50 : CONFIG.transitionDuration);
    }

    function onSceneEntered(sceneNum, prevSceneNum) {
        // Scene 2: Birthday Reveal -> Confetti explosion
        if (sceneNum === 2) {
            triggerConfettiBurst(50);
        }

        // Scene 4: Gallery -> Ensure preview image is synced
        if (sceneNum === 4) {
            updateGalleryDisplay(STATE.currentGalleryIdx);
        }

        // Scene 6: Celebration Wall -> Soft particle fireworks
        if (sceneNum === 6) {
            triggerGoldenDustBurst(30);
        }
    }

    // ------------------------------------------------------------------------
    // 4. MUSIC PLAYER ENGINE (Single Shared Audio)
    // ------------------------------------------------------------------------
    function initMusicEngine() {
        if (!DOM.sharedAudio) return;

        // Configure audio
        DOM.sharedAudio.volume = CONFIG.defaultVolume;

        // Persistent top-right button
        if (DOM.persistentMusicBtn) {
            DOM.persistentMusicBtn.addEventListener("click", toggleMusic);
        }

        // Audio state listeners
        DOM.sharedAudio.addEventListener("play", () => {
            STATE.isPlayingMusic = true;
            updatePlayUI();
        });

        DOM.sharedAudio.addEventListener("pause", () => {
            STATE.isPlayingMusic = false;
            updatePlayUI();
        });

        DOM.sharedAudio.addEventListener("ended", () => {
            // Loop smoothly
            DOM.sharedAudio.currentTime = 0;
            DOM.sharedAudio.play().catch(() => {});
        });

        // Error listener: If missing or blocked, notify gracefully without breaking
        DOM.sharedAudio.addEventListener("error", () => {
            console.warn("Audio file could not be played. Check assets/music/happy-birthday.mp3");
            if (DOM.persistentMusicLabel) {
                DOM.persistentMusicLabel.textContent = "Song";
            }
        });
    }

    function toggleMusic() {
        if (!DOM.sharedAudio) return;

        if (DOM.sharedAudio.paused) {
            DOM.sharedAudio.play()
                .then(() => {
                    STATE.isPlayingMusic = true;
                    updatePlayUI();
                })
                .catch(err => {
                    console.log("Audio playback notice:", err.message);
                });
        } else {
            DOM.sharedAudio.pause();
            STATE.isPlayingMusic = false;
            updatePlayUI();
        }
    }

    function tryPlayMusicGesture() {
        // Optionally start on first click if permitted
        if (DOM.sharedAudio && DOM.sharedAudio.paused && !STATE.isPlayingMusic) {
            DOM.sharedAudio.play()
                .then(() => {
                    STATE.isPlayingMusic = true;
                    updatePlayUI();
                })
                .catch(() => {
                    // Browser policy blocked or file empty; safe to ignore
                });
        }
    }

    function updatePlayUI() {
        const isPlaying = STATE.isPlayingMusic;

        // Persistent top-right button
        if (DOM.persistentMusicBtn) {
            DOM.persistentMusicBtn.classList.toggle("playing", isPlaying);
        }
        if (DOM.persistentMusicIcon) {
            DOM.persistentMusicIcon.textContent = isPlaying ? "🔊" : "🎵";
        }
        if (DOM.persistentMusicLabel) {
            DOM.persistentMusicLabel.textContent = isPlaying ? "Playing" : "Music";
        }

    }

    // ------------------------------------------------------------------------
    // 5. SCENE 3 — OUR STORY (Interactive Milestones)
    // ------------------------------------------------------------------------
    function initStorySection() {
        DOM.storyTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const slideNum = parseInt(tab.getAttribute("data-story"), 10);
                if (slideNum) setStorySlide(slideNum);
            });
        });

        if (DOM.btnStoryPrev) {
            DOM.btnStoryPrev.addEventListener("click", () => {
                const prev = STATE.currentStorySlide > 1 ? STATE.currentStorySlide - 1 : 3;
                setStorySlide(prev);
            });
        }

        if (DOM.btnStoryNext) {
            DOM.btnStoryNext.addEventListener("click", () => {
                const next = STATE.currentStorySlide < 3 ? STATE.currentStorySlide + 1 : 1;
                setStorySlide(next);
            });
        }
    }

    function setStorySlide(slideNum) {
        STATE.currentStorySlide = slideNum;

        // Update tabs
        DOM.storyTabs.forEach(tab => {
            const num = parseInt(tab.getAttribute("data-story"), 10);
            const isActive = num === slideNum;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        // Update slides
        DOM.storySlides.forEach(slide => {
            const num = parseInt(slide.getAttribute("data-slide"), 10);
            slide.classList.toggle("active", num === slideNum);
        });

        // Update dots
        DOM.storyDots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx + 1 === slideNum);
        });
    }

    // ------------------------------------------------------------------------
    // 6. SCENE 4 — OUR MEMORIES (Interactive Showcase Gallery)
    // ------------------------------------------------------------------------
    function initGallerySection() {
        if (!DOM.galleryThumbsRow) return;

        // Render mini thumbnails
        DOM.galleryThumbsRow.innerHTML = "";
        GALLERY_ITEMS.forEach((item, index) => {
            const thumbBtn = document.createElement("button");
            thumbBtn.className = `gallery-thumb-btn ${index === 0 ? "active" : ""}`;
            thumbBtn.setAttribute("data-idx", index);
            thumbBtn.setAttribute("aria-label", `View memory photo ${index + 1}`);

            const thumbImg = document.createElement("img");
            thumbImg.src = item.src;
            thumbImg.alt = item.caption;
            thumbImg.onerror = function() {
                this.onerror = null;
                this.src = "images/photo1.jpeg";
            };

            thumbBtn.appendChild(thumbImg);
            thumbBtn.addEventListener("click", () => updateGalleryDisplay(index));
            DOM.galleryThumbsRow.appendChild(thumbBtn);
        });

        if (DOM.galleryTotalCount) {
            DOM.galleryTotalCount.textContent = String(GALLERY_ITEMS.length).padStart(2, "0");
        }

        // Nav buttons
        if (DOM.galleryBtnPrev) {
            DOM.galleryBtnPrev.addEventListener("click", () => {
                const prev = (STATE.currentGalleryIdx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
                updateGalleryDisplay(prev);
            });
        }

        if (DOM.galleryBtnNext) {
            DOM.galleryBtnNext.addEventListener("click", () => {
                const next = (STATE.currentGalleryIdx + 1) % GALLERY_ITEMS.length;
                updateGalleryDisplay(next);
            });
        }

        // Touch Swipe on mobile
        let touchStartX = 0;
        let touchEndX = 0;

        if (DOM.galleryStage) {
            DOM.galleryStage.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            DOM.galleryStage.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) > 40) {
                    if (diff < 0) {
                        // Swipe left -> Next
                        const next = (STATE.currentGalleryIdx + 1) % GALLERY_ITEMS.length;
                        updateGalleryDisplay(next);
                    } else {
                        // Swipe right -> Prev
                        const prev = (STATE.currentGalleryIdx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
                        updateGalleryDisplay(prev);
                    }
                }
            }, { passive: true });
        }
    }

    function updateGalleryDisplay(index) {
        if (index < 0 || index >= GALLERY_ITEMS.length) return;
        STATE.currentGalleryIdx = index;
        const item = GALLERY_ITEMS[index];

        // Animate main image
        if (DOM.galleryMainImg) {
            DOM.galleryMainImg.style.opacity = "0";
            DOM.galleryMainImg.style.transform = "scale(0.97)";

            setTimeout(() => {
                DOM.galleryMainImg.src = item.src;
                DOM.galleryMainImg.alt = item.caption;
                DOM.galleryMainImg.style.opacity = "1";
                DOM.galleryMainImg.style.transform = "scale(1)";
            }, 180);
        }

        // Update blurred background
        if (DOM.galleryBlurBg) {
            DOM.galleryBlurBg.style.backgroundImage = `url('${item.src}')`;
        }

        // Update captions
        if (DOM.galleryCaption) DOM.galleryCaption.textContent = item.caption;
        if (DOM.gallerySubtext) DOM.gallerySubtext.textContent = item.subtext;
        if (DOM.galleryCurrentIdx) {
            DOM.galleryCurrentIdx.textContent = String(index + 1).padStart(2, "0");
        }

        // Update thumbnails active state
        const thumbBtns = DOM.galleryThumbsRow.querySelectorAll(".gallery-thumb-btn");
        thumbBtns.forEach((btn, idx) => {
            btn.classList.toggle("active", idx === index);
        });
    }

    // ------------------------------------------------------------------------
    // 7. SCENE 5 — A LETTER FOR YOU (Envelope & Stepper)
    // ------------------------------------------------------------------------
    function initLetterSection() {
        // Open envelope
        if (DOM.btnOpenLetter) {
            DOM.btnOpenLetter.addEventListener("click", openEnvelope);
        }
        if (DOM.envelopeCard) {
            DOM.envelopeCard.addEventListener("click", openEnvelope);
        }

        // Stepper
        if (DOM.btnLetterPrev) {
            DOM.btnLetterPrev.addEventListener("click", () => {
                if (STATE.currentLetterPara > 1) {
                    setLetterParagraph(STATE.currentLetterPara - 1);
                }
            });
        }

        if (DOM.btnLetterNext) {
            DOM.btnLetterNext.addEventListener("click", () => {
                if (STATE.currentLetterPara < 4) {
                    setLetterParagraph(STATE.currentLetterPara + 1);
                }
            });
        }

        // Read All Modal
        if (DOM.btnOpenReadAllModal) {
            DOM.btnOpenReadAllModal.addEventListener("click", openReadAllModal);
        }

        if (DOM.btnCloseLetterModal) {
            DOM.btnCloseLetterModal.addEventListener("click", closeReadAllModal);
        }

        if (DOM.btnModalCloseAction) {
            DOM.btnModalCloseAction.addEventListener("click", closeReadAllModal);
        }

        if (DOM.modalBackdrop) {
            DOM.modalBackdrop.addEventListener("click", closeReadAllModal);
        }
    }

    function openEnvelope() {
        if (STATE.isLetterOpened) return;
        STATE.isLetterOpened = true;

        if (DOM.envelopeFlap) {
            DOM.envelopeFlap.style.transform = "rotateX(180deg)";
        }

        setTimeout(() => {
            if (DOM.envelopeWrapper) DOM.envelopeWrapper.classList.add("hidden");
            if (DOM.letterRevealedWrapper) {
                DOM.letterRevealedWrapper.classList.remove("hidden");
                DOM.letterRevealedWrapper.removeAttribute("aria-hidden");
            }
            setLetterParagraph(1);
        }, 400);
    }

    function setLetterParagraph(paraNum) {
        STATE.currentLetterPara = paraNum;

        DOM.letterParas.forEach(p => {
            const num = parseInt(p.getAttribute("data-para"), 10);
            p.classList.toggle("active", num === paraNum);
        });

        if (DOM.letterPageStatus) {
            DOM.letterPageStatus.textContent = `Part ${paraNum} of 4`;
        }

        if (DOM.btnLetterPrev) {
            DOM.btnLetterPrev.disabled = paraNum === 1;
            DOM.btnLetterPrev.style.opacity = paraNum === 1 ? "0.4" : "1";
        }

        if (DOM.btnLetterNext) {
            DOM.btnLetterNext.disabled = paraNum === 4;
            DOM.btnLetterNext.style.opacity = paraNum === 4 ? "0.4" : "1";
        }
    }

    function openReadAllModal() {
        if (!DOM.letterModal) return;
        DOM.letterModal.classList.add("active");
        DOM.letterModal.removeAttribute("inert");
    }

    function closeReadAllModal() {
        if (!DOM.letterModal) return;
        DOM.letterModal.classList.remove("active");
        DOM.letterModal.setAttribute("inert", "");
    }

    // ------------------------------------------------------------------------
    // 8. SCENE 6 — THE HAPPY BIRTHDAY WALL (Interactive Cake & Wish)
    // ------------------------------------------------------------------------
    function initCelebrationWall() {
        // Interactive Cake - Blow candles
        if (DOM.cakeWrapper) {
            DOM.cakeWrapper.addEventListener("click", blowCandles);
            DOM.cakeWrapper.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    blowCandles();
                }
            });
        }

        // Make a Wish Button
        if (DOM.btnMakeWish) {
            DOM.btnMakeWish.addEventListener("click", () => {
                triggerGoldenDustBurst(80);
                triggerConfettiBurst(40);
                showCelebrationToast("✨ Your wish has been sent to the stars! Happy Birthday, Manya! ✨");
            });
        }
    }

    function blowCandles() {
        if (STATE.candlesBlown) {
            // Relight
            STATE.candlesBlown = false;
            if (DOM.candleFlames) DOM.candleFlames.classList.remove("blown");
            if (DOM.cakeHint) DOM.cakeHint.textContent = "✨ Tap cake to blow candles ✨";
            return;
        }

        STATE.candlesBlown = true;
        if (DOM.candleFlames) DOM.candleFlames.classList.add("blown");
        if (DOM.cakeHint) DOM.cakeHint.textContent = "🎉 Wish Made! (Tap to relight) 🕯️";

        triggerGoldenDustBurst(40);
        showCelebrationToast("🎂 Candled blown! May all your heartfelt wishes come true! ✨");
    }

    function showCelebrationToast(msg) {
        const toast = document.createElement("div");
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed;
            top: 75px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(135deg, rgba(30, 8, 45, 0.95), rgba(65, 15, 80, 0.95));
            border: 1px solid #ffd36b;
            color: #fff;
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: all 0.4s ease;
            text-align: center;
            max-width: 90vw;
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(-20px)";
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    // ------------------------------------------------------------------------
    // 9. CELEBRATION CONFETTI & GOLDEN DUST PARTICLES
    // ------------------------------------------------------------------------
    function triggerConfettiBurst(count = 40) {
        const emojis = ["🎉", "✨", "💖", "⭐", "🎈", "🌸", "💫"];
        const viewportWidth = window.innerWidth;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            particle.className = "celebration-particle";
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const startX = Math.random() * viewportWidth;
            const size = Math.random() * 18 + 14;
            const duration = Math.random() * 2500 + 2000;
            const driftX = (Math.random() - 0.5) * 150;

            particle.style.cssText = `
                position: fixed;
                top: -30px;
                left: ${startX}px;
                font-size: ${size}px;
                pointer-events: none;
                z-index: 9999;
                opacity: 1;
            `;

            document.body.appendChild(particle);

            particle.animate([
                { transform: "translateY(0) translateX(0) rotate(0deg)", opacity: 1 },
                { transform: `translateY(110vh) translateX(${driftX}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: "cubic-bezier(0.25, 1, 0.5, 1)"
            });

            setTimeout(() => particle.remove(), duration);
        }
    }

    function triggerGoldenDustBurst(count = 30) {
        const colors = ["#ffd36b", "#ffea9f", "#ff6bd6", "#ffffff", "#e5b95f"];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const spark = document.createElement("div");
            const size = Math.random() * 8 + 4;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 250 + 60;
            const duration = Math.random() * 1200 + 900;
            const color = colors[Math.floor(Math.random() * colors.length)];

            spark.style.cssText = `
                position: fixed;
                top: ${centerY}px;
                left: ${centerX}px;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 10px ${color};
            `;

            document.body.appendChild(spark);

            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;

            spark.animate([
                { transform: "translate(0, 0) scale(1)", opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: "ease-out"
            });

            setTimeout(() => spark.remove(), duration);
        }
    }

    // ------------------------------------------------------------------------
    // 10. AMBIENT BACKGROUND STARS & PARTICLES CANVAS
    // ------------------------------------------------------------------------
    function initAmbientCanvas() {
        const canvas = DOM.ambientCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Generate ambient particles
        const particleCount = window.innerWidth < 768 ? 40 : 80;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.6 + 0.4,
                alpha: Math.random() * 0.7 + 0.2,
                speedY: Math.random() * 0.35 + 0.1,
                speedX: (Math.random() - 0.5) * 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                isGold: Math.random() > 0.4
            });
        }

        let animationFrameId;

        function renderParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                // Update position
                p.y -= p.speedY;
                p.x += p.speedX;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                // Pulsing glow
                p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.008;
                p.alpha = Math.max(0.15, Math.min(0.85, p.alpha));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.isGold
                    ? `rgba(255, 234, 159, ${p.alpha})`
                    : `rgba(255, 255, 255, ${p.alpha * 0.7})`;
                ctx.shadowBlur = p.radius * 3;
                ctx.shadowColor = p.isGold ? "#e5b95f" : "#ffffff";
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(renderParticles);
        }

        // Only run if user doesn't prefer reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion) {
            renderParticles();
        }
    }

    // ------------------------------------------------------------------------
    // 11. BOOTSTRAP APPLICATION
    // ------------------------------------------------------------------------
    function init() {
        initSceneManager();
        initMusicEngine();
        initStorySection();
        initGallerySection();
        initLetterSection();
        initCelebrationWall();
        initAmbientCanvas();

        // Restore custom signature from localStorage if saved
        if (DOM.editableSig) {
            const savedSig = localStorage.getItem("manya_birthday_sig");
            if (savedSig) DOM.editableSig.textContent = savedSig;

            DOM.editableSig.addEventListener("blur", () => {
                localStorage.setItem("manya_birthday_sig", DOM.editableSig.textContent.trim());
            });
        }
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
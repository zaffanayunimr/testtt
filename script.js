document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. DOM ELEMENT SELECTION
    // ==========================================
    const startOverlay = document.getElementById("start-overlay");
    const startAppBtn = document.getElementById("start-app-btn");

    const video1 = document.getElementById("videoPlayer1");
    const video2 = document.getElementById("videoPlayer2");
    
    // Overlays
    const langOverlay = document.getElementById("language-overlay");
    const scene4Overlay = document.getElementById("scene4-overlay");
    const settingsOverlay = document.getElementById("settings-overlay");

    // Navigation Buttons
    const btnBm = document.getElementById("btn-bm");
    const btnEn = document.getElementById("btn-en");
    const skipBtn = document.getElementById("skip-btn");
    const btnChapter = document.getElementById("btn-chapter");
    const btnQuiz = document.getElementById("btn-quiz");
    const settingsBtn = document.getElementById("settings-btn");
    const homeBtn = document.getElementById("home-btn");
    const backBtn = document.getElementById("back-btn");

    // Settings UI Text
    const settingsTitle = document.getElementById("settings-title");
    const labelAudio = document.getElementById("label-audio");
    const labelLanguage = document.getElementById("label-language");
    const textVolumeUp = document.getElementById("text-volume-up");
    const textVolumeDown = document.getElementById("text-volume-down");
    const textMute = document.getElementById("text-mute");
    const textLangBm = document.getElementById("text-lang-bm");
    const textLangEn = document.getElementById("text-lang-en");

    // Volume Controls
    const volumeSlider = document.getElementById("volume-slider");
    const volumePercentage = document.getElementById("volume-percentage");
    const btnVolumeUp = document.getElementById("btn-volume-up");
    const btnVolumeDown = document.getElementById("btn-volume-down");
    const btnMute = document.getElementById("btn-mute");

    const btnSetBm = document.getElementById("btn-set-bm");
    const btnSetEn = document.getElementById("btn-set-en");

    // ==========================================
    // 2. STATE MANAGEMENT & BGM SETUP
    // ==========================================
    let selectedLang = "ms";
    let introAudio = null;
    let previousScene = "scene4";

    // Cipta BGM & Tetapkan Ulang (Looping Continuous)
    const bgMusic = new Audio("assets/bgm.mp3");
    bgMusic.loop = true;
    bgMusic.volume = volumeSlider.value / 100;

    video2.load();

    // ==========================================
    // 3. START BUTTON: PLAY BGM & COMP1 SERENTAK
    // ==========================================
    startAppBtn.addEventListener("click", () => {
        // Sembunyikan Overlay
        startOverlay.style.display = "none";

        // MULA BGM DENGAN SEGERA DARI AWAL
        bgMusic.play().then(() => {
            console.log("BGM berjaya dimainkan dari Scene 1!");
        }).catch(err => console.error("Error playing BGM:", err));

        // Mula mainkan video comp1
        video1.play().catch(err => console.error("Error playing video 1:", err));
    });

    video1.addEventListener("ended", () => {
        video1.classList.remove("active");
        langOverlay.style.display = "flex";
    });

    // Control Volume
// Control Volume & Dynamic Track Color Gradient
function setVolume(val) {
    let clampedVal = Math.max(0, Math.min(100, val));
    
    volumeSlider.value = clampedVal;
    volumePercentage.textContent = clampedVal + "%";

    // Tukar warna trek: Kiri (Pekat), Kanan (Cair)
    let percent = clampedVal;
    volumeSlider.style.background = `linear-gradient(to right, #E70B90 ${percent}%, #FFCCE5 ${percent}%)`;

    if (bgMusic) {
        bgMusic.volume = clampedVal / 100;
    }
}

// Inisialisasi warna trek semasa dimuatkan
setVolume(volumeSlider.value);

    volumeSlider.addEventListener("input", (e) => setVolume(e.target.value));
    btnVolumeUp.addEventListener("click", () => setVolume(parseInt(volumeSlider.value) + 10));
    btnVolumeDown.addEventListener("click", () => setVolume(parseInt(volumeSlider.value) - 10));
    btnMute.addEventListener("click", () => setVolume(0));

    // ==========================================
    // 4. SCENE 2 & INTRO VIDEO FLOW
    // ==========================================
    btnBm.addEventListener("click", () => startIntroScene("ms"));
    btnEn.addEventListener("click", () => startIntroScene("en"));

    function startIntroScene(lang) {
        selectedLang = lang;
        updateLocalizationUI();

        langOverlay.style.display = "none";
        skipBtn.style.display = "flex";

        stopIntroAudio();

        const audioFile = (selectedLang === "en") ? "assets/intro eng.mp3" : "assets/intro.mp3";
        introAudio = new Audio(audioFile);

        video2.currentTime = 0;
        introAudio.currentTime = 0;

        video2.classList.add("active");

        introAudio.addEventListener("canplaythrough", () => {
            video2.currentTime = 0;
            introAudio.currentTime = 0;

            Promise.all([
                video2.play(),
                introAudio.play()
            ]).catch(err => console.error("Sync error:", err));
        }, { once: true });

        introAudio.load();
    }

    video2.addEventListener("ended", goToScene4);
    skipBtn.addEventListener("click", goToScene4);

    function stopIntroAudio() {
        if (introAudio) {
            introAudio.pause();
            introAudio = null;
        }
    }

    // ==========================================
    // 5. SCENE 4 & SETTINGS NAVIGATION
    // ==========================================
    function goToScene4() {
        stopIntroAudio();
        video2.pause();
        video2.classList.remove("active");
        skipBtn.style.display = "none";

        updateLocalizationUI();
        scene4Overlay.style.display = "flex";
    }

    settingsBtn.addEventListener("click", () => {
        previousScene = "scene4";
        scene4Overlay.style.display = "none";
        settingsOverlay.style.display = "flex";
    });

    backBtn.addEventListener("click", () => {
        settingsOverlay.style.display = "none";
        if (previousScene === "scene4" || !previousScene) {
            scene4Overlay.style.display = "flex";
        }
    });

    homeBtn.addEventListener("click", () => {
        settingsOverlay.style.display = "none";
        scene4Overlay.style.display = "flex";
    });

    btnSetBm.addEventListener("click", () => {
        selectedLang = "ms";
        updateLocalizationUI();
    });

    btnSetEn.addEventListener("click", () => {
        selectedLang = "en";
        updateLocalizationUI();
    });

    function updateLocalizationUI() {
        if (selectedLang === "en") {
            settingsTitle.textContent = "Setting";
            labelAudio.textContent = "Sound";
            labelLanguage.textContent = "Language";
            textVolumeUp.textContent = "Volume Up";
            textVolumeDown.textContent = "Volume Down";
            textMute.textContent = "Mute";
            textLangBm.textContent = "Malay";
            textLangEn.textContent = "English";
            backBtn.textContent = "Back";

            btnChapter.textContent = "Chapter";
            btnQuiz.textContent = "Quiz";
            skipBtn.textContent = "Skip";
        } else {
            settingsTitle.textContent = "Tetapan";
            labelAudio.textContent = "Audio";
            labelLanguage.textContent = "Bahasa";
            textVolumeUp.textContent = "Kuatkan";
            textVolumeDown.textContent = "Perlahankan";
            textMute.textContent = "Senyap";
            textLangBm.textContent = "Bahasa Melayu";
            textLangEn.textContent = "Bahasa Inggeris";
            backBtn.textContent = "Kembali";

            btnChapter.textContent = "Bab";
            btnQuiz.textContent = "Kuiz";
            skipBtn.textContent = "Langkau";
        }
    }
});
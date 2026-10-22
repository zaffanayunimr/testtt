
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DOM ELEMENT SELECTION
    // ==========================================
    const startOverlay = document.getElementById("start-overlay");
    const startAppBtn = document.getElementById("start-app-btn");

    const video1 = document.getElementById("videoPlayer1");
    const video2 = document.getElementById("videoPlayer2");

    const langOverlay = document.getElementById("language-overlay");
    const scene4Overlay = document.getElementById("scene4-overlay");
    const settingsOverlay = document.getElementById("settings-overlay");

    const btnBm = document.getElementById("btn-bm");
    const btnEn = document.getElementById("btn-en");
    const skipBtn = document.getElementById("skip-btn");
    const btnChapter = document.getElementById("btn-chapter");
    const btnQuiz = document.getElementById("btn-quiz");
    const settingsBtn = document.getElementById("settings-btn");
    const homeBtn = document.getElementById("home-btn");
    const backBtn = document.getElementById("back-btn");

    const settingsTitle = document.getElementById("settings-title");
    const labelAudio = document.getElementById("label-audio");
    const labelLanguage = document.getElementById("label-language");
    const textVolumeUp = document.getElementById("text-volume-up");
    const textVolumeDown = document.getElementById("text-volume-down");
    const textMute = document.getElementById("text-mute");
    const textLangBm = document.getElementById("text-lang-bm");
    const textLangEn = document.getElementById("text-lang-en");

    const volumeSlider = document.getElementById("volume-slider");
    const volumePercentage = document.getElementById("volume-percentage");
    const btnVolumeUp = document.getElementById("btn-volume-up");
    const btnVolumeDown = document.getElementById("btn-volume-down");
    const btnMute = document.getElementById("btn-mute");

    const btnSetBm = document.getElementById("btn-set-bm");
    const btnSetEn = document.getElementById("btn-set-en");

    // ==========================================
    // 2. STATE MANAGEMENT
    // ==========================================
    let selectedLang = "ms";
    let introAudio = null;
    let previousScene = "scene4";

    // ==========================================
    // 3. BACKGROUND MUSIC
    // ==========================================
    const bgMusic = new Audio("assets/bgm.mp3");

    bgMusic.loop = true;
    bgMusic.volume = volumeSlider.value / 100;

    bgMusic.addEventListener("error", () => {
        console.error("BGM gagal dimuatkan:", bgMusic.error);
    });

    // ==========================================
    // 4. VIDEO SETUP
    // ==========================================

    // Relative path sesuai untuk GitHub Pages
    video1.src = "assets/Comp1.mp4";
    video1.preload = "auto";
    video1.playsInline = true;

    video2.preload = "auto";
    video2.playsInline = true;

    // Elakkan bunyi video bercampur dengan BGM
    video1.muted = true;
    video2.muted = true;

    video1.load();
    video2.load();

    video1.addEventListener("error", () => {
        console.error(
            "Comp1.mp4 gagal dimuatkan.",
            video1.error,
            video1.currentSrc
        );
    });

    video2.addEventListener("error", () => {
        console.error(
            "Video kedua gagal dimuatkan.",
            video2.error,
            video2.currentSrc
        );
    });

    // ==========================================
    // 5. START BUTTON - SCENE 1
    // ==========================================
    startAppBtn.addEventListener("click", async () => {

        console.log("Start button clicked!");

        startOverlay.style.display = "none";

        video1.classList.add("active");

        video1.pause();
        video1.currentTime = 0;

        // Mainkan BGM
        bgMusic.play().catch(err => {
            console.error("BGM playback error:", err);
        });

        // Mainkan Comp1.mp4
        try {
            await video1.play();
            console.log("Comp1.mp4 berjaya dimainkan!");
        } catch (err) {
            console.error("Comp1.mp4 playback error:", err);

            alert(
                "Video pertama gagal dimainkan. " +
                "Sila semak Console browser. " +
                "Error: " + err.message
            );
        }
    });

    // ==========================================
    // 6. VIDEO 1 ENDED
    // ==========================================
    video1.addEventListener("ended", () => {

        video1.pause();
        video1.classList.remove("active");

        langOverlay.style.display = "flex";

        console.log("Scene 1 completed.");
    });

    // ==========================================
    // 7. VOLUME CONTROLS
    // ==========================================
    function setVolume(val) {

        const clampedVal = Math.max(
            0,
            Math.min(100, Number(val))
        );

        volumeSlider.value = clampedVal;
        volumePercentage.textContent = clampedVal + "%";

        volumeSlider.style.background =
            `linear-gradient(
                to right,
                #E70B90 ${clampedVal}%,
                #FFCCE5 ${clampedVal}%
            )`;

        bgMusic.volume = clampedVal / 100;
    }

    setVolume(volumeSlider.value);

    volumeSlider.addEventListener("input", (e) => {
        setVolume(e.target.value);
    });

    btnVolumeUp.addEventListener("click", () => {
        setVolume(Number(volumeSlider.value) + 10);
    });

    btnVolumeDown.addEventListener("click", () => {
        setVolume(Number(volumeSlider.value) - 10);
    });

    btnMute.addEventListener("click", () => {
        setVolume(0);
    });

    // ==========================================
    // 8. LANGUAGE SELECTION
    // ==========================================
    btnBm.addEventListener("click", () => {
        startIntroScene("ms");
    });

    btnEn.addEventListener("click", () => {
        startIntroScene("en");
    });

    // ==========================================
    // 9. SCENE 2 - INTRO VIDEO
    // ==========================================
    async function startIntroScene(lang) {

        selectedLang = lang;
        updateLocalizationUI();

        langOverlay.style.display = "none";
        skipBtn.style.display = "flex";

        stopIntroAudio();

        const audioFile = selectedLang === "en"
            ? "assets/intro eng.mp3"
            : "assets/intro.mp3";

        introAudio = new Audio(audioFile);

        video2.pause();
        video2.currentTime = 0;
        introAudio.currentTime = 0;

        video2.classList.add("active");

        try {
            await Promise.all([
                video2.play(),
                introAudio.play()
            ]);

            console.log("Intro video and audio playing.");

        } catch (err) {
            console.error("Intro playback error:", err);
        }
    }

    // ==========================================
    // 10. SCENE 2 ENDED / SKIP
    // ==========================================
    video2.addEventListener("ended", goToScene4);

    skipBtn.addEventListener("click", goToScene4);

    function stopIntroAudio() {

        if (introAudio) {
            introAudio.pause();
            introAudio = null;
        }
    }

    // ==========================================
    // 11. SCENE 4
    // ==========================================
    function goToScene4() {

        stopIntroAudio();

        video2.pause();
        video2.classList.remove("active");

        skipBtn.style.display = "none";

        updateLocalizationUI();

        scene4Overlay.style.display = "flex";
    }

    // ==========================================
    // 12. SETTINGS NAVIGATION
    // ==========================================
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

    // ==========================================
    // 13. SETTINGS LANGUAGE
    // ==========================================
    btnSetBm.addEventListener("click", () => {

        selectedLang = "ms";
        updateLocalizationUI();
    });

    btnSetEn.addEventListener("click", () => {

        selectedLang = "en";
        updateLocalizationUI();
    });

    // ==========================================
    // 14. LOCALIZATION UI
    // ==========================================
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

    updateLocalizationUI();

});

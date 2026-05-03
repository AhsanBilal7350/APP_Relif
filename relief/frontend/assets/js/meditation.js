document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.querySelector(".player-card button");
    const circle = document.querySelector(".circle");
    const statusText = document.querySelector(".player-card p");

    if (!playBtn) return;

    let audio = null;
    let isPlaying = false;
    let breathInterval;

    // Try multiple ocean sound sources (fallback chain)
    const audioSources = [
        "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3",
        "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg",
        "https://upload.wikimedia.org/wikipedia/commons/e/ea/Sea_waves.ogg"
    ];

    /**
     * Tries to load audio from the source list.
     * Returns a promise that resolves with a working Audio element.
     */
    function loadAudio() {
        return new Promise((resolve) => {
            let currentIndex = 0;

            function tryNext() {
                if (currentIndex >= audioSources.length) {
                    // All sources failed — use generated white noise as ocean substitute
                    console.warn("All audio sources failed. Using generated ambient sound.");
                    resolve(createGeneratedOceanSound());
                    return;
                }

                const testAudio = new Audio();
                testAudio.crossOrigin = "anonymous";
                testAudio.loop = true;
                testAudio.volume = 0.6;

                const timeout = setTimeout(() => {
                    console.warn(`Audio source timed out: ${audioSources[currentIndex]}`);
                    testAudio.src = "";
                    currentIndex++;
                    tryNext();
                }, 5000);

                testAudio.addEventListener("canplaythrough", () => {
                    clearTimeout(timeout);
                    console.log(`Audio loaded from: ${audioSources[currentIndex]}`);
                    resolve(testAudio);
                }, { once: true });

                testAudio.addEventListener("error", () => {
                    clearTimeout(timeout);
                    console.warn(`Audio source failed: ${audioSources[currentIndex]}`);
                    currentIndex++;
                    tryNext();
                }, { once: true });

                testAudio.src = audioSources[currentIndex];
                testAudio.load();
            }

            tryNext();
        });
    }

    /**
     * Creates a generated ocean-like ambient sound using Web Audio API.
     * This is the ultimate fallback — works offline with no external URLs.
     */
    function createGeneratedOceanSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = 2 * ctx.sampleRate; // 2 seconds of audio
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate pink noise (sounds more like ocean than white noise)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
            b6 = white * 0.115926;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Add a gentle low-pass filter to make it sound more like waves
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;

        const gain = ctx.createGain();
        gain.gain.value = 0.5;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Return an object that mimics the Audio API
        return {
            play: () => { ctx.resume(); source.start(0); },
            pause: () => { ctx.suspend(); },
            _isGenerated: true
        };
    }

    playBtn.addEventListener("click", async () => {
        if (!isPlaying) {
            // Load audio on first click (required by browser autoplay policy)
            if (!audio) {
                playBtn.textContent = "Loading...";
                playBtn.disabled = true;
                audio = await loadAudio();
                playBtn.disabled = false;
            }

            try {
                audio.play();
            } catch (err) {
                console.error("Audio playback failed:", err);
                statusText.textContent = "Audio could not play. Try again.";
                return;
            }

            playBtn.textContent = "Pause Session";
            circle.style.animation = "breathe 8s infinite ease-in-out";

            statusText.textContent = "Breathe in...";
            breathInterval = setInterval(() => {
                if (statusText.textContent === "Breathe in...") {
                    statusText.textContent = "Breathe out...";
                } else {
                    statusText.textContent = "Breathe in...";
                }
            }, 4000);

            isPlaying = true;
        } else {
            audio.pause();
            playBtn.textContent = "Play Session";
            circle.style.animation = "none";
            clearInterval(breathInterval);
            statusText.textContent = "Take a deep breath. Focus on the present moment.";
            isPlaying = false;
        }
    });
});

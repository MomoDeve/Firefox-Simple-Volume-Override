document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("volumeSlider");
    const volumeText = document.getElementById("volumeValue");
    const siteName = document.getElementById("siteName");
    const toggleSwitch = document.getElementById("overrideToggle");
    const toggleStatus = document.getElementById("toggleStatus");
    const volumeControls = document.getElementById("volumeControls");

    // Hide volume controls initially
    volumeControls.style.display = "none";

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]?.url) {
            const url = new URL(tabs[0].url);
            const hostname = url.hostname;
            siteName.textContent = `Site: ${hostname}`;

            browser.storage.local.get([hostname]).then((data) => {
                const storedData = data[hostname] || { volume: 0.5, override: false };

                // Ensure volume is a valid number (fallback to 0.5 if NaN or undefined)
                let volume = parseFloat(storedData.volume);
                if (isNaN(volume)) volume = 0.5;

                slider.value = volume;
                volumeText.textContent = (volume * 100).toFixed(0) + "%";

                toggleSwitch.checked = storedData.override;
                toggleStatus.textContent = storedData.override ? "Override: ON" : "Override: OFF";

                // Show or hide volume controls based on override status
                volumeControls.style.display = storedData.override ? "block" : "none";
            });

            // Handle slider change
            slider.addEventListener("input", () => {
                let volume = parseFloat(slider.value);
                if (isNaN(volume)) volume = 0.5;

                volumeText.textContent = (volume * 100).toFixed(0) + "%";

                browser.storage.local.get([hostname]).then((data) => {
                    const storedData = data[hostname] || {};
                    storedData.volume = volume;
                    browser.storage.local.set({ [hostname]: storedData });

                    if (toggleSwitch.checked) {
                        browser.tabs.executeScript({
                            code: `document.querySelectorAll("video").forEach(video => video.volume = ${volume});`
                        });
                    }
                });
            });

            // Handle toggle switch change
            toggleSwitch.addEventListener("change", () => {
                const overrideEnabled = toggleSwitch.checked;
                toggleStatus.textContent = overrideEnabled ? "Override: ON" : "Override: OFF";
                volumeControls.style.display = overrideEnabled ? "block" : "none";

                browser.storage.local.get([hostname]).then((data) => {
                    const storedData = data[hostname] || {};
                    storedData.override = overrideEnabled;

                    // Ensure valid volume before storing
                    let volume = parseFloat(slider.value);
                    if (isNaN(volume)) volume = 0.5;
                    storedData.volume = volume;

                    browser.storage.local.set({ [hostname]: storedData });

                    if (overrideEnabled) {
                        browser.tabs.executeScript({
                            code: `document.querySelectorAll("video").forEach(video => video.volume = ${volume});`
                        });
                    }
                });
            });
        }
    });
});
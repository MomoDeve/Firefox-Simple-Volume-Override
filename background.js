browser.runtime.onInstalled.addListener(() => {
    console.log("Simple Volume Override Installed");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getVolumeAndOverride") {
        const siteKey = new URL(sender.tab.url).hostname;
        browser.storage.local.get(siteKey).then((data) => {
            const storedData = data[siteKey] || { volume: 0.5, override: false };
            sendResponse(storedData);
        });
        return true;
    }

    if (message.action === "setVolume") {
        const siteKey = new URL(sender.tab.url).hostname;
        browser.storage.local.get(siteKey).then((data) => {
            const storedData = data[siteKey] || {};
            storedData.volume = message.volume;
            browser.storage.local.set({ [siteKey]: storedData });
        });
    }

    if (message.action === "setOverride") {
        const siteKey = new URL(sender.tab.url).hostname;
        browser.storage.local.get(siteKey).then((data) => {
            const storedData = data[siteKey] || {};
            storedData.override = message.override;
            browser.storage.local.set({ [siteKey]: storedData });
        });
    }
});
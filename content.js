function setVideoVolume(volume) {
    document.querySelectorAll("video").forEach((video) => {
        video.volume = volume;
    });
}

browser.runtime.sendMessage({ action: "getVolumeAndOverride" }).then((response) => {
    if (response && response.override) {
        setVideoVolume(response.volume);
    }
});

document.addEventListener("DOMNodeInserted", () => {
    browser.runtime.sendMessage({ action: "getVolumeAndOverride" }).then((response) => {
        if (response && response.override) {
            setVideoVolume(response.volume);
        }
    });
});
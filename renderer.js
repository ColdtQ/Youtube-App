// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote;
// grab the discord rich client and ID
//const client = require('discord-rich-presence')('463904802426978326');

const win = remote.getCurrentWindow();
/* Note this is different to the
html global `window` variable */

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
        customTitleBar();
    }
};

win.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get autogarbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}


function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.hide();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
    // handle discord rich presence - not working atm
    discordRichPresence();
    function discordRichPresence() {
        // Update rich presence when YouTube TV is playing.
        mainWindow.webContents.on('media-started-playing', function () {
            client.updatePresence({
                state: "on YouTube TV",
                details: "Watching TV",
                startTimestamp: Date.now(),
                largeImageKey: 'yttv',
                smallImageKey: 'play',
                instance: false,
            });
        });

        // Update rich presence when YouTube TV is paused or turned off.
        mainWindow.webContents.on('media-paused', function () {
            client.updatePresence({
                state: "on YouTube TV",
                details: "Watching TV (Paused)",
                StartTimestamp: Date.now(),
                largeImageKey: 'yttv',
                smallImageKey: 'pause',
                instance: false,
            });
        });

        // Start rich presence service into idle mode.
        client.updatePresence({
            state: 'on YouTube TV',
            details: 'Browsing Channels and TV Shows',
            startTimestamp: Date.now(),
            largeImageKey: 'yttv',
            smallImageKey: 'stop',
            instance: false,
        });
    }
}
/**
 * Basic waveform visualization for the tape recorder
 * 
 * Date: September 2019 - October 2019
 * Author: daohong li, daohong.li@studenti.unipd.it
 */

(function (Peaks, taperecorder) {
    /**
     * Create Menu Container
     */
    const title = document.createElement("div");
    title.id = "waveFormTitle";
    title.classList.add("menuBar");
    title.setAttribute('onclick', 'openWaveForm()');

    const name = document.createElement("div");
    name.classList.add("menuTitle");
    name.innerHTML = "WaveForm";

    title.appendChild(name);

    const empty = document.createElement("h2");
    empty.innerHTML = "Track not loaded.";
    empty.style.textAlign = "center";
    empty.style.display = "none";

    const menu = document.createElement("div");
    menu.id = "waveFormMenu";
    menu.classList.add("waveform")
    menu.appendChild(empty);

    /**
     * Append Container
     */
    const container = document.createElement("div");
    container.id = "waveform-container";
    container.style = "margin-left: 30px; pointer-events:none;";
    const overview = document.createElement("div");
    overview.id = "overview-container";
    container.appendChild(overview);

    // add container to the menu
    menu.appendChild(container);

    // Add Menu to the view
    const controls = document.getElementById("songDBTitle");
    controls.parentElement.insertBefore(title, controls);
    controls.parentElement.insertBefore(menu, controls);

    /**
     * Append dummy audio
     * 
     * dummy <audio> required by the peaks.js
     */
    const audioTag = document.createElement("audio");
    audioTag.id = "audio";
    audioTag.innerText = "Your browser does not support the audio element."
    document.body.appendChild(audioTag);

    /**
     * Create a dummy buffer for display
     */
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var frameCount = audioCtx.sampleRate * 200.0;
    var dummyBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);
    audioCtx.close();

    const options = {
        containers: {
            overview: document.getElementById('overview-container')
        },
        mediaElement: document.getElementById('audio'),
        webAudio: {
            audioBuffer: dummyBuffer,
        },
        keyboard: false,
        pointMarkerColor: '#006eb0',
        overviewWaveformColor: '#cccccc',
        showPlayheadTime: true
    };
    Peaks.init(options, function (err, peaksInstance) {
        menu.style.display = "none";
        empty.style.display = "block";
        container.style.display = "none";
        console.log('Peaks instance ready');
        taperecorder.initWaveFormView(peaksInstance);
    });
})(peaks, tapeRecorder);

/**
 * Initializes the waveform view context
 * 
 * @param waveform Peaks instance
 */
TapeRecorder.prototype.initWaveFormView = function (waveform) {
    if (!waveform) {
        throw new Error('WaveForm null @ waveform.js, initWaveForm()');
    }
    this.waveform = waveform;
    this.waveLoaded = false;
    this.waveInterval = null;
    this.waveHead = 0;
    console.log("WaveForm initialized!");
}

/**
 * Feed the audioBuffer to the waveform view
 * 
 * @param audioBuffer audioBuffer to be visualized
 */
TapeRecorder.prototype.setWaveFormBuffer = function (audioBuffer) {
    if (!this.waveform) {
        throw new Error('WaveForm not initialized @ waveform.js, setWaveFormBuffer()');
    }

    const options = {
        webAudio: {
            audioBuffer: audioBuffer,
            multiChannel: false
        }
    };

    const self = this;
    const self_waveform = this.waveform;
    function reset() {
        self_waveform.removeAllListeners('player_canplay');
        self_waveform.removeAllListeners('player_error');
    }

    function updateWaveForm() {
        reset();
        if (!options.zoomLevels) {
            options.zoomLevels = self_waveform.options.zoomLevels;
        }

        var webAudioOptions = options.webAudio;

        if (webAudioOptions.scale !== options.zoomLevels[0]) {
            webAudioOptions.scale = options.zoomLevels[0];
        }

        var webAudioBuilderOptions = {
            audio_buffer: webAudioOptions.audioBuffer,
            split_channels: webAudioOptions.multiChannel,
            scale: webAudioOptions.scale
        };

        // Generate waveform data by using WebAudioAPI, this method is async
        WaveformData.createFromAudio(webAudioBuilderOptions, function (err, waveformData) {
            if (err) {
                alert("An error has occurred during waveform generation, see console.");
                console.log(err);
                return;
            }
            self_waveform._waveformData = waveformData;
            [
                'overview',
                'zoomview'
            ].forEach(function (viewName) {
                var view = self_waveform.views.getView(viewName);
                if (view) {
                    view.setWaveformData(waveformData);
                }
            });
            self_waveform.zoom.setZoomLevels(options.zoomLevels);
            console.log("waveform updated");
            self.waveLoaded = true;
            document.getElementById("waveform-container").style.display = "block";
            document.querySelector("#waveFormMenu > h2").style.display = "none";
        });
    }
    updateWaveForm();
}

/**
 * Set the current head position of the waveform view
 * 
 * @param time offset in seconds
 */
TapeRecorder.prototype.setWaveFormHead = function (time) {
    if (!this.waveform) {
        throw new Error('WaveForm not initialized @ waveform.js, setWaveFormBuffer()');
    }
    this.waveform.views._overview._playheadLayer._syncPlayhead(time);
}

/**
 * Start the waveform at the selected offset
 * 
 * @param time offset in seconds
 */
TapeRecorder.prototype.startWaveForm = function (time) {
    if (!this.waveform) {
        throw new Error('WaveForm not initialized @ waveform.js, setWaveFormBuffer()');
    }
    console.log("enter start wave form " + this.waveLoaded);
    if (this.waveLoaded) {
        if (this.waveInterval != null) {
            this.stopWaveForm();
        }
        console.log("starting waveform");
        this.waveTime = time;

        this.setWaveFormHead(time);
        var speed = this.currentPlaybackRate;
        var timeout = this.currentPlaybackRate >= 4 ? 50 : 100;
        switch (this.state) {
            case 4:
                speed *= getMultiplicationFactor(this.currentSpeedState);
                timeout = 50;
                break;
            case 6:
                speed *= -getMultiplicationFactor(this.currentSpeedState);
                timeout = 50;
                break;
            default:
                break;
        }
        const self = this;
        this.waveInterval = setInterval(function () {
            // console.log("update time: " + self.waveTime);
            self.waveTime += timeout / 1000 * speed;
            if (self.playFinish) {
                self.stopWaveForm();
                return;
            }
            self.setWaveFormHead(self.waveTime);
        }, timeout);
    }
}

TapeRecorder.prototype.stopWaveForm = function () {
    if (!this.waveform) {
        throw new Error('WaveForm not initialized @ waveform.js, setWaveFormBuffer()');
    }
    if (this.waveInterval != null) {
        console.log("stopping waveform");
        clearInterval(this.waveInterval);
        this.waveInterval = null;
    }
}

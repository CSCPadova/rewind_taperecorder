function TapeRecorder(context) {
	// Path
	//this.C_PATH = "http://localhost/phi/";
	this.impulseResponsesPath = "./impulses/";
	this.completePath = "";
	this.isThereVideo = false;
	
	// Speed and time variables
	this.startTime = 0;
	this.offset = 0;				// Pos. of timer [sec]
	this.originalSpeed = 0;
	this.currentSpeed = 0;
	this.originalSpeedState = 1;	// 0: 3.75
	this.currentSpeedState = 1; 	// 1: 7.5
									// 2: 15
									// 3: 30
	this.currentPlaybackRate = 0;
	this.timer = null;				// contain setInterval 
	this.tempTimer = 0;				// temp value of the timer
	this.resetOffset = 0;			// offset for resetTimer
	
	// Automa
	this.state = 1; 	// 1: Track is not loaded
						// 2: Track is loaded
						// 3: Play
						// 4: FF
						// 5: Pause
						// 6: Rewind
						// 7: Song finished
	// Equalization variables
	this.originalEqualizationState = 0;
	this.currentEqualizationState = 0; 	// 0: ccir
										// 1: nab
										
	// Context and Nodes
	this.context = context;
	this.audioSource = null;
	this.convolutionNode = null;
	this.reverseConvolutionNode = null;
	
	// Flags
	this.isAudioSourceConnected = false;
	this.isConvolutionNodeConnected = false;

	// Buffers
	this.impulseBuffers = new Array();
	this.impulseBuffersPath = new Array(
			this.impulseResponsesPath + "CCIR_NAB_Stable.wav",
			this.impulseResponsesPath + "NAB_CCIR_Appr.wav"
			);

	this.currentBuffer = null;
	this.currentReverseBuffer = null;
	//this.loadImpulseBuffers();
	this.ibuf = 0;
	this.loadBuffers();
	loadButtons();
};

//-----------Functions-------------------------------------

//------Load Impulse Buffers------
/*TapeRecorder.prototype.loadImpulseBuffers = function() {
	for ( var i = 0; i < 3; i++) {
		this.loadBuffer(this.impulseBuffersPath[i], i);
	}
};*/
/*
TapeRecorder.prototype.loadBuffer = function(path, i) {
	var request = new XMLHttpRequest();
	request.open("GET", path, true);
	request.responseType = "arraybuffer";
	var those = this;
	request.onload = function() {
		var that = those;
		// Asynchronously decode the audio file data in request.response
		those.context.decodeAudioData(request.response,
				// successfull callback
				function(buffer) {
			if (!buffer) {
				alert('error decoding file data: ' + that.completePath);
				return;
			}
			console.log("impulseBuffers[" + i + "] caricato");

			// save the buffer
			that.impulseBuffers[i] = buffer;

			// enable all commands when all the buffers is loaded
			that.ibuf++;
			if (that.ibuf == 3) {
				enableAllCommands();
			}
		}, function(error) {
			alert('decodeAudioData error', error);
		});
	};

	request.onerror = function() {
		alert('error loading file data: ' + url);
	};
	request.send();
};

*/

TapeRecorder.prototype.loadBuffers = function(){
	var request = new XMLHttpRequest();
	request.open("GET", this.impulseBuffersPath[this.ibuf], true);
	request.responseType = "arraybuffer";
	var those = this;
	request.onload = function() {
		var that = those;
		// Asynchronously decode the audio file data in request.response
		those.context.decodeAudioData(request.response,
				// successful callback
				function(buffer) {
			if (!buffer) {
				alert('error decoding file data: buffer = ' + that.ibuf);
				return;
			}
			console.log("impulseBuffers[" + that.ibuf + "] caricato");

			// save the buffer
			that.impulseBuffers[that.ibuf] = buffer;
			buffer = null;
			// enable all commands when all the buffers is loaded
			that.ibuf++;
			if (that.ibuf == 2) {
				enableAllCommands();
			}
			else{
				that.loadBuffers();
			}
		}, function(error) {
			alert('decodeAudioData error', error);
		});
	};

	request.onerror = function() {
		alert('error loading file data: ' + url);
	};
	request.send();
};

//--------------- Load Disk --------------------
TapeRecorder.prototype.loadTrack = function(path, speed, equalization, flagVideo, path_video) {
    goUp();
	
	var upl=document.getElementById("upan");
	upl.style.display = "block";
	
    this.currentBuffer = null;
	this.currentReverseBuffer = null;
	//if(this.state == 1){
	//	loadTape();
	//}
	
	
	// if track is playing => stop
	if (this.state == 3 || this.state == 4 || this.state == 6) {
		this.pause();
		this.audioSource = null;
		this.audioSource = this.context.createBufferSource();
		
	}
	
	if(flagVideo == 1){
		this.isThereVideo = true;
		loadVideo(path_video);
	}
	else{
		clearVideo();
		this.isThereVideo = false;
	}
	
	clickButton(0);
	
	if(this.state != 1){
		removeTape();
	}
	else{
		removeVideo();
	}
	
	// save a temp of the equalization state and speed
	var speedTemp = this.currentSpeedState;
	var eqTemp = this.currentEqualizationState;

	// set speed and time variables
	this.originalSpeedState = this.currentSpeedState = getSpeedState(speed);
	this.originalSpeed = this.currentSpeed = 3.75 * Math.pow(2,
			this.originalSpeedState);
	changeReelRotation(this.originalSpeed);
	
	this.currentPlaybackRate = 1;
	this.startTime = 0;
	this.offset = 0;

	// set equalization variables
	this.originalEqualizationState = this.currentEqualizationState = getEqualizationState(equalization);
    var completePath = './';
	// Reset Interface
	this.resetInterface(speedTemp, this.currentSpeedState, eqTemp,
			this.currentEqualizationState);
    jQuery(document).ready(function($){
        completePath = completePath + path;
    });
	// set path => gestire i browser con mp3 ed ogg
	 // this.C_PATH +
	
	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", completePath, true);
	request.responseType = "arraybuffer";
	var those = this;

	request.onload = function() {
		var that = those;
		// Asynchronously decode the audio file data in request.response
		those.context.decodeAudioData(request.response,
				// successful callback
				function(buffer) {
			if (!buffer) {
				alert('error decoding file data: ' + that.completePath);
				return;
			}
			//alert("Brano Caricato!!");
			
			var upl=document.getElementById("upan");
			upl.style.display = "none";
            
			that.currentBuffer = null;
			// save the buffer
			that.currentBuffer = buffer;
			
			// create a reverse buffer
			that.currentReverseBuffer = cloneAudioBuffer(buffer);
			Array.prototype.reverse.call( that.currentReverseBuffer.getChannelData(0) );
	        Array.prototype.reverse.call( that.currentReverseBuffer.getChannelData(1) );
	        buffer = null;
			// update state
			that.state = 2;
			loadTape();
			// enable all commands
			enableAllCommands();

			// TODO stop buffering gif
		}, function(error) {
			alert('decodeAudioData error', error);
		});
	};

	request.onerror = function() {
		alert('error loading file data: ' + url);
	};

	request.send();

	// disable all commands
	disableAllCommands();
	// TODO buffering gif
	
	this.updateEqualization();
	this.resetOffset = 0;
};

//Reset interface
TapeRecorder.prototype.resetInterface = function(s1, s2, e1, e2) {
	// set speed Knob
	selectKnobPosition("#knSpeed", s1, s2);
	// set equalization Knob
	selectKnobPosition("#knEq", e1, e2);
	// reset timer
	zeroTimer();
	// TODO reset reel position
};

//------------------------------------PLAY--------------------------------------------

//Play Button --> state 3
TapeRecorder.prototype.playTrack = function() {
	if (this.state != 1 && this.state != 3 && this.state != 7) {
		if (this.state == 4 || this.state == 6) {
			this.pause();
		}
		this.play();
		clickButton(3);
	}
};

//Play
TapeRecorder.prototype.play = function() {
	// start reel rotation
	startReelRotation();
	changeReelRotation(this.currentSpeed);
	
	// update video speed 
	//if(this.isThereVideo)
	//	changeVideoSpeed(this.currentPlaybackRate);
	// create and connect the Source
	this.audioSource = this.context.createBufferSource();
	this.audioSource.buffer = this.currentBuffer;			
	this.audioSource.loop = false;
	this.audioSource.playbackRate.value = this.currentPlaybackRate;

	var that = this;
	this.audioSource.onended = function() {
		that.endOfTrack();
	};
	// connect the nodes
	this.connectSource();

	this.startTime = this.context.currentTime;
	this.audioSource.start(0, (this.offset) % this.audioSource.buffer.duration);
	this.state = 3;
	// start video
	if(this.isThereVideo){
		playVideo((this.offset) % this.audioSource.buffer.duration);
		changeVideoSpeed(this.audioSource.playbackRate.value);
	}
	// start timer
	this.startTimer();
	this.isAudioSourceConnected = true;
};

//Track is Finished
TapeRecorder.prototype.endOfTrack = function() {
	var playbackTime = this.offset + (this.context.currentTime - this.startTime) 
	* this.audioSource.playbackRate.value;
	if(this.audioSource.buffer != null && playbackTime >= this.audioSource.buffer.duration){
		this.offset = this.audioSource.buffer.duration;
		this.state = 7;
		stopReelRotation();
		this.stopTimer();
		if(this.isThereVideo)
			stopVideo();
		clickButton(0);
		// TODO ?? update video to finish???
		
		updateTimer((this.audioSource.buffer.duration - this.resetOffset) / this.currentPlaybackRate);
	}
	console.log("State = " + this.state);
};

//TODO connect the nodes of the context
TapeRecorder.prototype.connectSource = function() {
	
	/*this.convolutionNode = this.context.createConvolver();
	this.convolutionNode.buffer = this.impulseBuffers[1];
	this.convolutionNode.normalize = true;
	this.audioSource.connect(this.convolutionNode);
	this.convolutionNode.connect(this.context.destination);
	*/

	if(this.isAudioSourceConnected){
		this.audioSource.disconnect();
		this.isAudioSourceConnected = false;
	}
	if(this.isConvolutionNodeConnected){
		this.convolutionNode.disconnect();
		this.isConvolutionNodeConnected = false;
	}
	
	// FLAT
	if(this.originalEqualizationState == this.currentEqualizationState || this.convolutionNode.buffer == null){
			this.audioSource.connect(this.context.destination);
			this.isAudioSourceConnected = true;
	}
	else{
		if(this.audioSource != null){
			this.audioSource.connect(this.convolutionNode);
			this.convolutionNode.connect(this.context.destination);
			this.isAudioSourceConnected = true;
			this.isConvolutionNodeConnected = true;
		}
	}
	//}
};

//--------------------------STOP-----------------------------------------------

// Pause Button --> state 5 NB: il flag deve essere impostato prima di
//mettere in pausa la canzone
TapeRecorder.prototype.pauseTrack = function() {
	if (this.state == 3 || this.state == 4 || this.state == 6) {
		this.pause();
		clickButton(4);
	}
};

// Pause 
TapeRecorder.prototype.pause = function() {
	// from play or FF
	if(this.state == 3 || this.state == 4){
		// update offset
		this.updateOffset(0);
		this.state = 5;
		this.audioSource.stop(0);
		this.stopTimer();
		if(this.isThereVideo)
			stopVideo();
		stopReelRotation();
	}
	// from rewind
	else if(this.state == 6){
		this.updateOffset(1);
		this.state = 5;
		this.audioSource.stop(0);
		this.stopTimer();
		clearInterval(intervalRewind);
		if(this.isThereVideo)
			stopVideo();
		stopReelRotation();
	}
};

//------------------------Rewind----------------------------

// Rewind
TapeRecorder.prototype.rewind = function() {
	if (this.state != 1 && this.state != 2 && this.state != 6) {
		if (this.state == 3 || this.state == 4) {
			this.pause();
		}
		clickButton(1);
		this.startTimer();
		// Create and connect the Source
		this.audioSource = this.context.createBufferSource();
		this.audioSource.buffer = this.currentReverseBuffer;			
		this.audioSource.loop = false;
		this.audioSource.playbackRate.value = this.currentPlaybackRate * 
			 getMultiplicationFactor(this.currentSpeedState);

		var that = this;
		this.audioSource.onended = function() {
			that.endOfReverseTrack();
		};
		// connect the nodes
		this.connectSource();

		this.startTime = this.context.currentTime;
		
		this.audioSource.start(0, (this.audioSource.buffer.duration - this.offset) 
				% this.audioSource.buffer.duration);
		//stopReelRotation();
		startReelRotation();
		changeReelRotation(-60);
		if(this.isThereVideo){
			//playVideo(); //(this.audioSource.buffer.duration - this.offset) 
			//% this.audioSource.buffer.duration);
			//changeVideoSpeed(-this.audioSource.playbackRate.value);
			rewindVideo(this.audioSource.playbackRate.value);
		}
		this.state = 6;
	}
};

TapeRecorder.prototype.endOfReverseTrack = function(){
	var playbackTime = this.offset - (this.context.currentTime - this.startTime) 
	* this.audioSource.playbackRate.value;
	if(playbackTime <= 0){
		this.offset = 0;
		this.state = 2;
		stopReelRotation();
		this.stopTimer();
		if(this.isThereVideo)
			stopVideo();
		clickButton(0);
		// TODO ?? update to zero the video?? 
		updateTimer(0 - this.resetOffset / this.currentPlaybackRate);
	}
	//console.log("State = " + this.state);
};

//---------------------Fast Forward--------------------------

// FastForward X 4
TapeRecorder.prototype.fastForward = function() {
	if (this.state != 1 && this.state != 4 && this.state != 7) {
		if (this.state == 3 || this.state == 6) {
			this.pause();
			
		}
		clickButton(2);
		this.startTimer();
		// Create and connect the Source
		this.audioSource = this.context.createBufferSource();
		this.audioSource.buffer = this.currentBuffer;			
		this.audioSource.loop = false;
		this.audioSource.playbackRate.value = this.currentPlaybackRate * 
			 getMultiplicationFactor(this.currentSpeedState);

		var that = this;
		this.audioSource.onended = function() {
			that.endOfTrack();
		};
		// connect the nodes
		this.connectSource();

		this.startTime = this.context.currentTime;
		
		this.audioSource.start(0, (this.offset) 
				% this.audioSource.buffer.duration);
		//stopReelRotation();
		startReelRotation();
		changeReelRotation(60);
		// play video
		if(this.isThereVideo){
			playVideo((this.offset) 
					% this.audioSource.buffer.duration);
			changeVideoSpeed(this.audioSource.playbackRate.value);
		}
		this.state = 4;
		
		console.log("ff function finish");
	}
};

//---------------------- Speed---------------------------------

// Next Speed
TapeRecorder.prototype.nextSpeed = function() {
	var cssName = "#knSpeed";
	var  tempPlaybackRate = this.currentPlaybackRate;
	// Rotate the knob
	rotateKnob(cssName, this.currentSpeedState);	
	switch (this.currentSpeedState) {
	case 0:
		this.currentPlaybackRate *= 2;
		this.currentSpeedState++;
		this.currentSpeed = 7.5;
		break;
	case 1:
		this.currentPlaybackRate *= 2;
		this.currentSpeedState++;
		this.currentSpeed = 15;
		break;
	case 2:
		this.currentPlaybackRate *= 2;
		this.currentSpeedState++;
		this.currentSpeed = 30;
		break;
	case 3:
		this.currentPlaybackRate /= 8;
		this.currentSpeedState = 0;
		this.currentSpeed = 3.75;
		break;
	}

	if (this.state == 3){
		// update offset 
		this.offset += (this.context.currentTime - this.startTime)
		* tempPlaybackRate;
		this.startTime = this.context.currentTime;
		
		// update playback and reels rotation
		this.audioSource.playbackRate.value = this.currentPlaybackRate;
		changeReelRotation(this.currentSpeed);
		if(this.isThereVideo)
			changeVideoSpeed(this.audioSource.playbackRate.value);
	}
	else if (this.state == 5 || this.state == 2 || this.state == 7){
		updateTimer((this.offset -this.resetOffset) / this.currentPlaybackRate);
	}
	
	this.updateEqualization();
};

//-----------------------Equalization-----------------------------
TapeRecorder.prototype.updateEqualization = function(){
	if(this.originalEqualizationState != this.currentEqualizationState){
		//if(this.currentEqualizationState != 4){*/
			this.convolutionNode = this.context.createConvolver();
			this.convolutionNode.normalize = false;
			gBI = getBufferIndex(this.currentEqualizationState, this.currentSpeedState);
			if(gBI == -1){
				gBI = "FLAT";
				this.convolutionNode.buffer = null;
			}else
				this.convolutionNode.buffer = this.impulseBuffers[gBI];
			console.log("Impulse Buffer" + gBI);
			this.connectSource();
		//}		
	}
};

// next Equalization
TapeRecorder.prototype.nextEq = function() {
	var cssName = "#knEq";
	rotateKnob(cssName, this.currentEqualizationState);
	if(this.state!= 1){
		//if(this.originalEqualizationState == 4){
			this.currentEqualizationState = (1 + this.currentEqualizationState) % 2;
			if(this.currentEqualizationState != this.originalEqualizationState){
				this.convolutionNode = this.context.createConvolver();
				this.convolutionNode.normalize = false;
				gBI = getBufferIndex(this.currentEqualizationState, this.currentSpeedState);
				if(gBI == -1){
					gBI = "FLAT";
					this.convolutionNode.buffer = null;
				}else
					this.convolutionNode.buffer = this.impulseBuffers[gBI];	
			}
			else
				this.convolutionNode.buffer = null;
			gBI = getBufferIndex(this.currentEqualizationState, this.currentSpeedState);
				if(gBI == -1)
					gBI = "FLAT";
			console.log("Impulse Buffer" + gBI);
			if(this.isAudioSourceConnected)
				this.connectSource();
		//}
	}
	else{
		this.currentEqualizationState = (1 + this.currentEqualizationState) % 2;
	}
};

//-----------------------Timer------------------------------------

TapeRecorder.prototype.startTimer = function(){
	var that = this;
	this.timer = setInterval(function(){
		// every time that the speed change, 
		if(that.state == 3 || that.state == 4){
		
		/*that.tempTimer = (that.offset + (that.context.currentTime - 
				that.startTime) * that.audioSource.playbackRate.value - that.resetOffset) 
				/ that.currentPlaybackRate;*/
		that.tempTimer = (that.offset + (that.context.currentTime - 
				that.startTime) * that.audioSource.playbackRate.value - that.resetOffset) 
				/ that.currentPlaybackRate;
		updateTimer(that.tempTimer);
		}
		else{
			that.tempTimer = (that.offset - (that.context.currentTime - 
					that.startTime) * that.audioSource.playbackRate.value - that.resetOffset) 
					/ that.currentPlaybackRate;
			updateTimer(that.tempTimer);
		}
	}, 200);
};


TapeRecorder.prototype.stopTimer = function(){
	clearInterval(this.timer);
};

TapeRecorder.prototype.resetTimer = function(){
	if(this.state == 3 || this.state == 4){
		this.resetOffset = this.offset + (this.context.currentTime - 
				this.startTime) * this.audioSource.playbackRate.value;
	}else if(this.state == 2 || this.state == 5 || this.state == 7){
		this.resetOffset = this.offset;
		updateTimer(0);
	}
	else{
		this.resetOffset = this.offset - (this.context.currentTime - 
				this.startTime) * this.audioSource.playbackRate.value;
	}
	
};

TapeRecorder.prototype.updateOffset = function(type){
	if(type == 0){
		this.offset += (this.context.currentTime - this.startTime)
		* this.audioSource.playbackRate.value;
	}
	else if (type == 1){
		this.offset -= (this.context.currentTime - this.startTime)
		* this.audioSource.playbackRate.value;
	}
};
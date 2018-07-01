function getSpeedState(speed){
	var state = 0;
	switch(speed){
		case 3.75:
			state = 0;
			break;
		case 7.5: 
			state = 1;
			break;
		case 15.0: 
			state = 2;
			break;
		case 30.0: 
			state = 3;
			break;
		default:
			alert("Velocità di lettura errata! Velocità impostata di default a 7.5");
			state = 1;
			break;
	}
	return state;
};

function getEqualizationState(equalization){
	var eqUpper = equalization.toUpperCase();
	var eqState = 0;
	switch (eqUpper){
	case "FLAT":
		eqState = 2;
		break;
	case "CCIR":
		eqState = 0;
		break;
	case "NAB":
		eqState = 1;
		break;
	default: 
		alert("Warning: wrong equalization. Default equalization = FLAT");
		eqState = 2;
		break;
	}
	return eqState;
};

function getMultiplicationFactor(speedState){
	var multFactor = 0;
	switch (speedState) {
	case 0:
		multFactor = 16;
		break;
	case 1:
		multFactor = 8;
		break;
	case 2:
		multFactor = 4;
		break;
	case 3:
		multFactor = 2;
		break;
	default:
		alert("this.speedState error");
	break;
	}
	
	return multFactor;
};

function cloneAudioBuffer(audioBuffer){
    var channels = [],
        numChannels = audioBuffer.numberOfChannels;

    //clone the underlying Float32Arrays
    for (var i = 0; i < numChannels; i++){
        channels[i] = new Float32Array(audioBuffer.getChannelData(i));
    }

    //create the new AudioBuffer (assuming AudioContext variable is in scope)
    var newBuffer = context.createBuffer(
                        audioBuffer.numberOfChannels,
                        audioBuffer.length,
                        audioBuffer.sampleRate
                    );

    //copy the cloned arrays to the new AudioBuffer
    for (var i = 0; i < numChannels; i++){
        newBuffer.getChannelData(i).set(channels[i]);
    }

    return newBuffer;
};

function debugState(state){
	$(document).ready(function(){
		$('#debug').text("STATE: " + state);
	});
};

function getBufferIndex(equalization, speed){
	switch(speed){
	case 0: return 0;
	case 1: 
		if(equalization == 0)
			return 1;
		else
			return 3;
	case 2:
		if(equalization == 0)
			return 2;
		else
			return 3;
	case 3:
		return 4;
	}
};
// Global variable
var anim = null;
var isLoaderOpen = false;
// Reel rotation speed (initial value set to zero)
var angularSpeed = 0;
var intervalRewind;

var contextClass = (window.AudioContext || 
	window.webkitAudioContext || 
	window.mozAudioContext || 
	window.oAudioContext || 
	window.msAudioContext);

if (contextClass) {
	// Web Audio API is available.	
	// create context and object TapeRecorder
	var context = new contextClass();
	var tapeRecorder = new TapeRecorder(context); 
	
	disableAllCommands();
	
}
else{
	// Web Audio API is not available. Ask the user to use a supported browser.
	document.write("Il browser non supporta Web Audio Api.");
}

// -------------------------------- Animation ----------------------------------------------------

var cssKnobSpeedClassName = new Array ("posS0", "posS1", "posS2", "posS3");
var cssKnobEqClassName = new Array ("posE0", "posE1", "posE2");
// rotate knob figure
function rotateKnob(knob, initialPosition){
	jQuery(document).ready(function($){	
		if(knob == "#knSpeed"){
			$(knob).removeClass(cssKnobSpeedClassName[initialPosition]);
			$(knob).addClass(cssKnobSpeedClassName[(initialPosition + 1) % 4]);
		}
		else{
			$(knob).removeClass(cssKnobEqClassName[initialPosition]);
			$(knob).addClass(cssKnobEqClassName[(initialPosition + 1) % 3]);
		}
	});
};

// select knob rotation
function selectKnobPosition(knob, before, after ){
	jQuery(document).ready(function($){
		if(knob == "#knSpeed"){
			$(knob).removeClass(cssKnobSpeedClassName[before]);
			$(knob).addClass(cssKnobSpeedClassName[after]);
		}
		else{
			$(knob).removeClass(cssKnobEqClassName[before]);
			$(knob).addClass(cssKnobEqClassName[after]);
		}
	});
};

// reset interface
function resetInterface(speedBefore, speedAfter, eqBefore, eqAfter){
	// set speed Knob
	selectKnobPosition("#knSpeed", speedBefore, speedAfter);
	// set equalization Knob
	selectKnobPosition("#knEq", eqBefore, eqAfter);
	// TODO reset timer
};

// disable all commands TODO: disable track Loader
function disableAllCommands(){
	jQuery(document).ready(function($){
		$("#rewind").attr('disabled','disabled');
		$("#ffward").attr('disabled','disabled');
		$("#play").attr('disabled','disabled');
		$("#pause").attr('disabled','disabled');
		$("#speed").attr('disabled','disabled');
		$("#eq").attr('disabled','disabled');
	});
};

// enable all link TODO: enable track Loader
function enableAllCommands(){
	jQuery(document).ready(function($){
		$("#rewind").removeAttr('disabled');
		$("#ffward").removeAttr('disabled');
		$("#play").removeAttr('disabled');
		$("#pause").removeAttr('disabled');
		$("#speed").removeAttr('disabled');
		$("#eq").removeAttr('disabled');
	});
};

function startReelRotation(){
	anim.start();
	/*
	jQuery(document).ready(function($){
		$('#reelRContainer').addClass("tapeRotation");
		$('.tapeRotation').css("-webkit-animation-play-state", "running");
		$('.tapeRotation').css("-webkit-animation-play-state", "running");
		$(".tapeRotation").css("animation-play-state", "running");
		$(".tapeRotation").css("animation-play-state", "running");
	});*/
};


function stopReelRotation(){
	anim.stop();
	/*jQuery(document).ready(function($){
		$(".tapeRotation").css("-webkit-animation-play-state", "paused");
		$(".tapeRotation").css("-webkit-animation-play-state", "paused");
		$(".tapeRotation").css("animation-play-state", "paused");
		$(".tapeRotation").css("animation-play-state", "paused");
	});*/
};

function changeReelRotation(newSpeed){
	//jQuery(document).ready(function($){
		angularSpeed = -360 * newSpeed/10; 
		/*var time;
		if(angularSpeed < 0 ){
			time = -angularSpeed/270;
			//$(".tapeRotation").css();
		}
		else{
			time = angularSpeed/270;
			//$(".tapeRotation").css();
		}
		alert(time);
		$(".tapeRotation").css("-moz-animation-duration", time + "s");
		$(".tapeRotation").css("-o-animation-duration", time + "s");
		$(".tapeRotation").css("-webkit-animation-duration", time + "s");
		$(".tapeRotation").css("-ms-animation-duration", time + "s");
		$(".tapeRotation").css("animation-duration", time + "s");	
	});*/

};


function updateTimer(time){
	var temp = 0;
	var currentHours;
	if(time < 0 ){
		currentHours = '-';
		temp = -time;
	}
	else{
		currentHours =  Math.floor(temp / 3600);
		temp = time;
	}
	
	var currentSeconds = (Math.floor(temp % 60) < 10 ? '0' : '') 
		+ Math.floor(temp % 60);
	var currentMinutes = (Math.floor(temp / 60) < 10 ? '0' : '') 
		+ Math.floor(temp / 60);
	
	document.getElementById('timer').innerHTML = currentHours + ":"
		+ currentMinutes + ":" + currentSeconds ;
};

function playVideo(time){ //time
	var temp = time;
	document.getElementById("video").currentTime = temp;
	document.getElementById("video").play();
};

function stopVideo(){
	document.getElementById("video").pause();
};

function changeVideoSpeed(rate){
	document.getElementById("video").playbackRate = rate;
};

function rewindVideo(rate){
	intervalRewind = setInterval(function(){
	       video.playbackRate = 1.0;
	       video.pause();
	       if(video.currentTime == 0){
	           clearInterval(intervalRewind);
	           //video.pause();
	       }
	       else{
	           video.currentTime += -0.1 * rate;
	       }
	                }, (100)); 
};


function openLoader(){
	jQuery(document).ready(function($){
		$title = $("#songDBTitle");
		//  close the loader
		if (isLoaderOpen){
			/*
			$('#songDBTitle').delay(1000).animate({
					width: "920px",
					marginLeft: "+=0px"
				}, 
				100,
				function(){	
				}
						);
						*/
			$('#db').slideUp(1000);
			
			isLoaderOpen = false;
			$title.css("background-image", "url(\"./images/goDownWhite.png\")");
		}
		// open the loader
		else{
			/*
			$('#songDBTitle').animate({
				width: "920px",
				marginLeft: "-=0px"
			}, 
			100,
			function(){
				
			});
			*/
			$('#db').slideDown(1000);
			
			isLoaderOpen = true;
			$title.css("background-image", "url(\"./images/goUpWhite.png\")");
		}
	});
	
};

function loadTape(){
	jQuery(document).ready(function($){
		$('#magn').removeClass("init");
		$('#magn').addClass("loaded");
		$('#reels').css("display", "inline-block");
		$('#videoContainer').css("display", "inline-block");
		loadReels();
	});
};

function removeTape(){
	jQuery(document).ready(function($){
		$('#magn').addClass("init");
		$('#magn').removeClass("loaded");
		$('#reels').css("display", "none");
		removeVideo();
	});
};

function removeVideo(){
	jQuery(document).ready(function($){
		$('#videoContainer').css("display", "none");
	});
};

function loadReels(){
	//window.addEventListener('load', function(e) {
		  // Kinetic.js Stage object is associated to the <canvas> element
		  var stage = new Kinetic.Stage({
			  container: 'reels',
		      width: 600,
		      height: 400
		  });
		  
		  // Graphics are grouped in a layer
		  var layer = new Kinetic.Layer();
		  
		// Loading the tape reels
		  var tape = new Image();
		  tape.onload = function() {
			  var reelL = new Kinetic.Image({
				  x: 160.5,
				  y: 220.5,
				  image: tape,
				  width: 267,
				  height: 267,
				  offset: {x:133.5, y:134},
				  //rotation: Math.floor(Math.random()*120)
			  });
			  var reelR = new Kinetic.Image({
				  x: 438.5,
				  y: 220.5,
			      image: tape,
			      width: 267,
				  height: 267,
				  offset: {x:133.5, y:134},
			      //rotation: Math.floor(Math.random()*120)
			  });
			  layer.add(reelL);
			  layer.add(reelR);
			  reelL.setZIndex(1);
			  reelR.setZIndex(2);
			  layer.draw();
		    
			  // Reel animation function
			  anim = new Kinetic.Animation(function(frame) {
				  var angleDiff = frame.timeDiff * angularSpeed / 1000;
				  reelR.rotate(angleDiff);
				  reelL.rotate(angleDiff);
			  }, layer);
		  };
			  
		  // Add the layer to the stage
		  stage.add(layer);  
		  
		  // Source files
		  tape.src = './images/bobina267.png';
		  
		//}, false);
}
/*---------------------------------------------------SRC up-----------------------------------------------------------------------------------*/
function loadButtons(){
	jQuery(document).ready(function($){
		$('#play').click( function() {
	  		tapeRecorder.playTrack();
	  	});
	
	  	$('#pause').click( function() {
	  		tapeRecorder.pauseTrack();
	  	});
	
	  	$('#rewind').click( function() {
	  		tapeRecorder.rewind();
	  	});
	
	  	$('#ffward').click( function() {
	  		tapeRecorder.fastForward();
	  	});		  	
	  	
	  	$('#speed').click(function(){
	  		tapeRecorder.nextSpeed();
	  	});
	  	
	  	$('#eq').click(function(){
	  		tapeRecorder.nextEq();
	  	});
	  	
	  	$('#resetTimer').click(function(){
	  		tapeRecorder.resetTimer();
	  	});
	});
};

function goUp(){
	jQuery(document).ready(function($){
		$(document).scrollTop($('#magn').offset().top);
	});
};

var button = 0;
// 0: no button on
// 1: rw on
// 2: ff on
// 3: play on
// 4: stop on

function clickButton(type){
	jQuery(document).ready(function($){
		// all button off
		switch(button){
			case 0:
				break;
			case 1:
				$('#rewind').removeClass('rewindClick');
				break;
			case 2:
				$('#ffward').removeClass('ffwardClick');
				break;
			case 3:
				$('#play').removeClass('playClick');
				break;
			case 4:
				$('#pause').removeClass('stopClick');
				break;
			default:
				console.log("switch 1 button error");
				break;
		}
		
		switch(type){
			// Rewind
			case 0:
				button = 0;
				break;
			case 1:
				$('#rewind').addClass('rewindClick');
				button = 1;
				break;
			case 2:
				$('#ffward').addClass('ffwardClick');
				button = 2;
				break;
			case 3:
				$('#play').addClass('playClick');
				button = 3;
				break;
			case 4:
				$('#pause').addClass('stopClick');
				button = 4;
				break;
			default:
				console.log("switch 2 button error");
				break;
		}
	});
};

function clickResetTimer(){
	jQuery(document).ready(function($){
		$('#resetTimer').addClass('resetClick');
	});
};

function declickResetTimer(){
	jQuery(document).ready(function($){
		$('#resetTimer').removeClass('resetClick');
	});
};

function loadVideo(path){
	jQuery(document).ready(function($){
		$('#videoContainer').html(
				"<video id='video' preload muted >" + 
					"<source src='"+ path +".mp4' type='video/mp4'></source>" + 
					"<source src='"+ path +".webm' type='video/webm'></source>" +
					"<source src='"+ path +".ogv' type='video/ogv'></source>" +
				"</video>"
				);
	});
};

function clearVideo(){
	jQuery(document).ready(function($){
		$('#videoContainer').html("");
	});
};

function zeroTimer(){
	jQuery(document).ready(function($){
		$('#timer').text("0:00:00");
	});
}

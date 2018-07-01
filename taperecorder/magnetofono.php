


<style>
   @import url(./taperecorder/css/style.css);
</style>
<!--  <iframe id = "magn"  src = "http://localhost:3000" ></iframe> -->
<?php 

define("PATH", "./");
//header('Access-Control-Allow-Origin: *');
?>

<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>  -->
<script type = "text/javascript" src = "<?php echo PATH?>kinetic.js"></script>
<script type = "text/javascript" src = "<?php echo PATH?>taperecorder.js"></script>

<script type=text/javascript>
$(document).ready(function(){
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
		
		window.addEventListener('load', function(e) {
			

			
		  	// Kinetic.js Stage object is associated to the <canvas> element
		  	var stage = new Kinetic.Stage({
		    	container: 'container',
		    	width: 1040,
		    	height: 720
		  	});
	
		  	// Graphics are grouped in a layer
		  	var layer = new Kinetic.Layer();
	
		  	// Loading the tape reels
		  	var tape = new Image();
		  	tape.onload = function() {
		    	var reelL = new Kinetic.Image({
		      		x: 190,
		      		y: 210,
		     	 	image: tape,
		      		width: 300,
		      		height: 300,
		      		offset: {x:150, y:150},
		      		rotation: Math.floor(Math.random()*120)
		    	});
		    	var reelR = new Kinetic.Image({
		      		x: 850,
		      		y: 210,
		      		image: tape,
		      		width: 300,
		      		height: 300,
		      		offset: {x:150, y:150},
		      		rotation: Math.floor(Math.random()*120)
		    	});
		    	layer.add(reelL);
		    	layer.add(reelR);
		    	reelL.setZIndex(1);
		    	reelR.setZIndex(2);
		    	layer.draw();
	
		    // Reel animation function
		    	tapeRecorder.anim = new Kinetic.Animation(function(frame) {
		      		var angleDiff = frame.timeDiff * tapeRecorder.angularSpeed / 1000;
		      		reelR.rotate(angleDiff);
		    		  reelL.rotate(angleDiff);
		    	}, layer);
		  	};
	
		  // Loading the background
		  	var bg = new Image();
		  	bg.onload = function() {
		    	var studer = new Kinetic.Image({
		     		x: 0,
		     	 	y: 0,
		      		image: bg,
		     	 	width: 1040,
		      		height: 720
		    	});
			  // Add the shape to the layer
			  layer.add(studer);
			  // Move it to the bottom of the layer
			  studer.setZIndex(0);
			  layer.draw();
		  	};
	
		  // Finally, we load the pins (which shouldn't rotate
		  // with the rest of the reels)
		  	var pin = new Image();
		  	pin.onload = function() {
		    	var pinL = new Kinetic.Image({
		      		x: 183,
		      		y: 203,
		      		image: pin,
		      		width: 15,
		      		height: 15
		    	});
		    	var pinR = new Kinetic.Image({
		      		x: 843,
		      		y: 203,
		      		image: pin,
		      		width: 15,
		      		height: 15
		    	});
		  		layer.add(pinL);
		  		layer.add(pinR);
		  // Move them to the top of the layer
		  		pinL.setZIndex(3);
		  		pinR.setZIndex(4);
		  		layer.draw();
		  // Add the layer to the stage
		  		stage.add(layer);
		  	};
	
		  // Source files
		  	bg.src = '<?php echo PATH?>/taperecorder/images/canvasbg.jpg';
		  	tape.src = '<?php echo PATH?>/taperecorder/images/tapemetal.png';
		  	pin.src = '<?php echo PATH?>/taperecorder/images/pin.png';

			// Add function to button
			
			
		  	$('#play').click( function() {
		  		tapeRecorder.playTrack();
		  	});

		  	$('#pause').click( function() {
		  		tapeRecorder.pauseTrack();
		  	});

		  	$a('#rewind').click( function() {
		  		tapeRecorder.rewind();
		  	});

		  	$a('#ffward').click( function() {
		  		tapeRecorder.fastForward();
		  	});		  	

	  // stop onload function
		}, false);
	}
	else{
		// Web Audio API is not available. Ask the user to use a supported browser.
		document.write("Il browser non supporta Web Audio Api.");
	}
}
);
 </script>

<div id = "magn">
	<div id="container"></div>
	
	<div id = "bottom">
		<p id ="timer">00:00</p>
		<div class = "clickcontainer">
	      	<a id = "rewind" class = "click"  href = #rewind  ></a>
	      	<a id = "ffward" class = "click"  href = #ffward  ></a>
	      	<a id = "play" class = "click"  href = #play  ></a>
	      	<a id = "pause" class = "click"  href = #pause  ></a>
	 	</div>
	    <a class = "knob"  onclick = "tapeRecorder.nextSpeed()">
	    	<img id = "kn" class = "IEC1_7" src="<?php echo  PATH?>taperecorder/images/knob.png"
	    	 alt="Speed selector knob" >
	    </a>
	</div>	
</div>

<div id = trackLoader>
  	<button onclick = "tapeRecorder.loadTrack('db/gram/pescatore.wav' ,  7.5, 'FLAT' )">LOAD</button>
</div>

<div>
	
</div>
 
 
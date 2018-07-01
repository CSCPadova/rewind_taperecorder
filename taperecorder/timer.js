function Timer(){
	this.timer = 0;
	this.interval = null;
	this.timeInterval = 100; 
};

Timer.prototype.startTimer = function(){
	this.interval(function(){
		taperecorder.getStartTime();
	}, this.timeInterval);
};

Timer.prototype.stopTimer = function(){
	
};
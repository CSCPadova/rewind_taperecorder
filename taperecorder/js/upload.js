var x = document.getElementsByClassName('form-file-audio');
var i;
for (i = 0; i < x.length; i++) {
	x[i].addEventListener('submit', function(event) {
		console.log('inside upload');
		event.preventDefault();
		console.log('after prevent default');
		var id=(this.id).substring(3);
		var form = document.getElementById('fra'+id);
		//console.log(form.id);
		var fileSelect = document.getElementById('ina'+id);
		//console.log(fileSelect.id);
		var uploadButton = document.getElementById('bta'+id);
		//console.log(uploadButton.id);
		var targetFile=document.getElementById(id).getAttribute("missing");
		//console.log(targetFile);
		uploadButton.value = 'Uploading...';
		
		var file = fileSelect.files[0];
		var formData = new FormData();
		console.log(file);
		if (typeof file === 'undefined' || !file){
			uploadButton.value = 'Upload Track';
		}
		if (!file.type.match('audio.*')) {
			alert ("The submitted file is not an audio file");
		} else if(targetFile.replace(/^.*[\\\/]/, '')!=file.name){
			alert("the file name doesn't match with " + targetFile.replace(/^.*[\\\/]/, '') );
					
		} else {
			console.log("is a file audio");
			formData.append("request","addAudioFile");
			formData.append('newTrack', file, file.name);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', form.action, true);
			xhr.onload = function () {
				if (xhr.status === 200) {
					// File is uploaded, edit page, update row
					var loaddiv=document.getElementById(id);
					loaddiv.classList.remove('errorLoader');
					loaddiv.classList.add('trackLoaderButton');
					loaddiv.removeAttribute("missing");
					loaddiv.innerText='Load Track';
					var tab=document.getElementById('data'+id);

					//alert(tab.childElementCount);
					var eq=tab.getElementsByTagName("td")[2].innerText;
					//alert(eq);
					var vel=tab.getElementsByTagName("td")[1].innerText*1;
					//alert (vel);
					var video=tab.getElementsByTagName("td")[3].innerText;
					//alert(video);
					var videopath=null;
					if (video=="Yes"){
						video=1;
						videopath=document.getElementById("filev"+id).innerText.substring(12);
						//alert(videopath);
					}
					else{
						video=0;
					}
					loaddiv.setAttribute("onclick","tapeRecorder.loadTrack('"+targetFile+"',"+vel+",'"+eq+"','"+video+"','video/"+videopath+"')");
					
					var delfile=document.createElement("div");
					delfile.classList.add('delaudio');
					delfile.innerText='Delete Audio';
					delfile.setAttribute("onclick","deleteaudio('"+id+"','"+file.name+"')");
					delfile.setAttribute("id","da"+id);
					var desc=document.createElement("div");
					//alert("creatediv");
					desc.classList.add("filedesc");
					//alert("2");
					desc.setAttribute("id","filea"+id);
					//alert("3");
					
					desc.appendChild(document.createTextNode("Audio file: "+file.name));
					//alert("4");
					var audiodiv=document.getElementById("a"+id);
					//alert("5");
					audiodiv.innerHTML="";
					//alert("6");
					audiodiv.appendChild(desc);
					//alert("7");
					audiodiv.appendChild(delfile);
					
					} else if(xhr.status === 415){
					alert('Please insert only allowed input formats');
					uploadButton.value = 'Upload Track';
				} else if(xhr.status === 409){
					alert('File already exists on server');
					uploadButton.value = 'Upload Track';
				}
				else if(xhr.status === 451){
					alert('Max file duration is 3\'.20\"');
					fileSelect.value="";
					uploadButton.value = 'Upload Track';
				}
				else {
					alert('Bad request, please check data');
					uploadButton.value = 'Upload Track';
				}
			};
			xhr.send(formData);
		}		
	});
}

var x = document.getElementsByClassName('form-file-video');
var i;
for (i = 0; i < x.length; i++) {
	x[i].addEventListener('submit', function(event) {
		console.log('inside upload');
		event.preventDefault();
		console.log('after prevent default');
		var id=(this.id).substring(3);
		
		audiopath=document.getElementById("filea"+id);
		if(audiopath != null && audiopath !== undefined){
			audiopath=audiopath.innerText.substring(12);
			//alert(audiopath);
		}
		else{
			alert("please add an audio track first");
			return;
		}
		var form = document.getElementById('frv'+id);
		//console.log(form.id);
		var fileSelect = document.getElementById('inv'+id);
		//console.log(fileSelect.id);
		var uploadButton = document.getElementById('btv'+id);
		//console.log(uploadButton.id);
		uploadButton.value = 'Uploading...';
		
		var file = fileSelect.files[0];
		var formData = new FormData();
		console.log(file);
		if (typeof file === 'undefined' || !file){
			uploadButton.value = 'Upload Track';
		}
		if (!file.type.match('video.*')) {
			alert ("The submitted file is not a video file");
		} else {
			console.log("is a video file");
			formData.append("request","addVideoFile");
			formData.append('newTrack', file, file.name);
			formData.append('audio',audiopath);
			formData.append('id',id);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', form.action, true);
			xhr.onload = function () {
				if (xhr.status === 200) {
					// File is uploaded, edit page, update row				
					var delfile=document.createElement("div");
					delfile.classList.add('delvideo');
					delfile.innerText='Delete Video';
					delfile.setAttribute("onclick","deletevideo('"+id+"','"+file.name+"')");
					delfile.setAttribute("id","dv"+id);
					var desc=document.createElement("div");
					//alert("creatediv");
					desc.classList.add("filedesc");
					//alert("2");
					desc.setAttribute("id","filev"+id);
					//alert("3");
					
					desc.appendChild(document.createTextNode("Video file: "+file.name));
					//alert("4");
					var videodiv=document.getElementById("v"+id);
					//alert("5");
					videodiv.innerHTML="";
					//alert("6");
					videodiv.appendChild(desc);
					//alert("7");
					videodiv.appendChild(delfile);
					
					var loaddiv=document.getElementById(id);
					var tab=document.getElementById('data'+id);
					//alert(tab.childElementCount);
					var eq=tab.getElementsByTagName("td")[2].innerText;
					//alert(eq);
					var vel=tab.getElementsByTagName("td")[1].innerText*1;
					//alert (vel);
					tab.getElementsByTagName("td")[3].innerText="Yes";
					var video=1;
					//alert(video);
					var videopath=null;
					videopath=document.getElementById("filev"+id).innerText.substring(12);
					//alert(videopath);
					loaddiv.setAttribute("onclick","tapeRecorder.loadTrack('./audio/"+audiopath+"',"+vel+",'"+eq+"','"+video+"','./video/"+videopath+"')");					
					
					} else if(xhr.status === 415){
					alert('Please insert only allowed input formats');
					uploadButton.value = 'Upload Track';
				} else if(xhr.status === 409){
					alert('File already exists on server');
					uploadButton.value = 'Upload Track';
				}
				else if(xhr.status === 451){
					alert('The video length is not compatible with audio track');
					fileSelect.value="";
					uploadButton.value = 'Upload Track';
				}
				else {
					alert('Bad request, please check data');
					uploadButton.value = 'Upload Track';
				}
			};
			xhr.send(formData);
		}		
	});
}


function deleteaudio(id, filename){
	console.log("inside deleteaudio "+ filename);
	var formData2 = new FormData();
	formData2.append("request","delAudio");
	formData2.append("file",filename);
	var xhr2 = new XMLHttpRequest();
	xhr2.open('POST','upload.php', true);
	xhr2.onload = function () {
		if (xhr2.status === 200) {
			// File is deleted, edit page, update row
			var loaddiv=document.getElementById(id);
			loaddiv.classList.remove('trackLoaderButton');
			loaddiv.classList.add('errorLoader');
			loaddiv.setAttribute("missing","audio/"+filename);
			loaddiv.removeAttribute("onclick");
			loaddiv.innerText=filename+' not found';
			var audiodiv=document.getElementById("a"+id);
			audiodiv.innerHTML="";
			var form=document.createElement('form');
			form.setAttribute("action","upload.php");
			form.setAttribute("class","form-file-audio");
			form.setAttribute("id","fra"+id);
			form.setAttribute("method","post");
			form.setAttribute("enctype","multipart/form-data");
			form.appendChild(document.createTextNode("Select Audio Track (mp3,flac,wav):"));
			var input=document.createElement("input");
			input.setAttribute("type","file");
			input.setAttribute("class","input-file");
			input.setAttribute("id","ina"+id);
			input.setAttribute("name","newTrack");
			form.appendChild(input);
			var button=document.createElement("input");
			button.setAttribute("type","submit");
			button.setAttribute("class","button-file");
			button.setAttribute("id","bta"+id);
			button.setAttribute("name","submit");
			button.setAttribute("value","Upload Track");
			form.appendChild(button);
			audiodiv.appendChild(form);
			form.addEventListener('submit', function(event) {
				console.log('inside upload');
				event.preventDefault();
				console.log('after prevent default');
				var id=(this.id).substring(3);
				var form = document.getElementById('fra'+id);
				//console.log(form.id);
				var fileSelect = document.getElementById('ina'+id);
				//console.log(fileSelect.id);
				var uploadButton = document.getElementById('bta'+id);
				//console.log(uploadButton.id);
				var targetFile=document.getElementById(id).getAttribute("missing");
				//console.log(targetFile);
				uploadButton.value = 'Uploading...';
				
				var file = fileSelect.files[0];
				var formData = new FormData();
				console.log(file);
				if (typeof file === 'undefined' || !file){
					uploadButton.value = 'Upload Track';
				}
				if (!file.type.match('audio.*')) {
					alert ("The submitted file is not an audio file");
				} else if(targetFile.replace(/^.*[\\\/]/, '')!=file.name){
					alert("the file name doesn't match with " + targetFile.replace(/^.*[\\\/]/, '') );
							
				} else {
					console.log("is a file audio");
					formData.append("request","addAudioFile");
					formData.append('newTrack', file, file.name);
					var xhr = new XMLHttpRequest();
					xhr.open('POST', form.action, true);
					xhr.onload = function () {
						if (xhr.status === 200) {
							// File is uploaded, edit page, update row
							var loaddiv=document.getElementById(id);
							loaddiv.classList.remove('errorLoader');
							loaddiv.classList.add('trackLoaderButton');
							loaddiv.removeAttribute("missing");
							loaddiv.innerText='Load Track';
							var tab=document.getElementById('data'+id);
							//alert(tab.childElementCount);
							var vel=tab.getElementsByTagName("td")[1].innerText*1;
							//alert (vel);
							var eq=tab.getElementsByTagName("td")[2].innerText;
							//alert(eq);
							var video=tab.getElementsByTagName("td")[3].innerText;
							//alert(video);
							var videopath=null;
							if (video=="Yes"){
								video=1;
								videopath=document.getElementById("filev"+id).innerText.substring(12);
								//alert(videopath);
							}
							else{
								video=0;
							}
							loaddiv.setAttribute("onclick","tapeRecorder.loadTrack('"+targetFile+"',"+vel+",'"+eq+"','"+video+"','video/"+videopath+"')");
							
							var delfile=document.createElement("div");
							delfile.classList.add('delaudio');
							delfile.innerText='Delete Audio';
							delfile.setAttribute("onclick","deleteaudio('"+id+"','"+file.name+"')");
							delfile.setAttribute("id","da"+id);
							var desc=document.createElement("div");
							//alert("creatediv");
							desc.classList.add("filedesc");
							//alert("2");
							desc.setAttribute("id","filea"+id);
							//alert("3");
							
							desc.appendChild(document.createTextNode("Audio file: "+file.name));
							//alert("4");
							var audiodiv=document.getElementById("a"+id);
							//alert("5");
							audiodiv.innerHTML="";
							//alert("6");
							audiodiv.appendChild(desc);
							//alert("7");
							audiodiv.appendChild(delfile);
							
							} else if(xhr.status === 415){
							alert('Please insert only allowed input formats');
							uploadButton.value = 'Upload Track';
						} else if(xhr.status === 409){
							alert('File already exists on server');
							uploadButton.value = 'Upload Track';
						}
						else {
							alert('Bad request, please check data');
							uploadButton.value = 'Upload Track';
						}
					};
					xhr.send(formData);
				}	
			});
		} else if(xhr2.status === 452){
			alert('There is no file to delete');
		} 
		else {
			alert('Bad request, please check data');
		}
	};
	xhr2.send(formData2);
}

function deletevideo(id, filename){
	console.log("inside deletevideo "+ filename);
	var formData2 = new FormData();
	formData2.append("request","delVideo");
	formData2.append("file",filename);
	formData2.append("id",id);
	var xhr2 = new XMLHttpRequest();
	xhr2.open('POST','upload.php', true);
	xhr2.onload = function () {
		if (xhr2.status === 200) {
			// File is deleted, edit page, update row
			
			var videodiv=document.getElementById("v"+id);
			videodiv.innerHTML="";
			var form=document.createElement('form');
			form.setAttribute("action","upload.php");
			form.setAttribute("class","form-file-video");
			form.setAttribute("id","frv"+id);
			form.setAttribute("method","post");
			form.setAttribute("enctype","multipart/form-data");
			form.appendChild(document.createTextNode("Select Video Track (mp4,webm):"));
			var input=document.createElement("input");
			input.setAttribute("type","file");
			input.setAttribute("class","input-file");
			input.setAttribute("id","inv"+id);
			input.setAttribute("name","newTrack");
			form.appendChild(input);
			var button=document.createElement("input");
			button.setAttribute("type","submit");
			button.setAttribute("class","button-file");
			button.setAttribute("id","btv"+id);
			button.setAttribute("name","submit");
			button.setAttribute("value","Upload Video");
			form.appendChild(button);
			videodiv.appendChild(form);
			form.addEventListener('submit', function(event) {
				console.log('inside upload');
				event.preventDefault();
				console.log('after prevent default');
				var id=(this.id).substring(3);
				
				audiopath=document.getElementById("filea"+id);
				if(audiopath != null && audiopath !== undefined){
					audiopath=audiopath.innerText.substring(12);
					//alert(audiopath);
				}
				else{
					alert("please add an audio track first");
					return;
				}
				var form = document.getElementById('frv'+id);
				//console.log(form.id);
				var fileSelect = document.getElementById('inv'+id);
				//console.log(fileSelect.id);
				var uploadButton = document.getElementById('btv'+id);
				//console.log(uploadButton.id);
				uploadButton.value = 'Uploading...';
				
				var file = fileSelect.files[0];
				var formData = new FormData();
				console.log(file);
				if (typeof file === 'undefined' || !file){
					uploadButton.value = 'Upload Track';
				}
				if (!file.type.match('video.*')) {
					alert ("The submitted file is not a video file");
				} else {
					console.log("is a video file");
					formData.append("request","addVideoFile");
					formData.append('newTrack', file, file.name);
					formData.append('audio',audiopath);
					formData.append('id',id);
					var xhr = new XMLHttpRequest();
					xhr.open('POST', form.action, true);
					xhr.onload = function () {
						if (xhr.status === 200) {
							// File is uploaded, edit page, update row				
							var delfile=document.createElement("div");
							delfile.classList.add('delvideo');
							delfile.innerText='Delete Video';
							delfile.setAttribute("onclick","deletevideo('"+id+"','"+file.name+"')");
							delfile.setAttribute("id","dv"+id);
							var desc=document.createElement("div");
							//alert("creatediv");
							desc.classList.add("filedesc");
							//alert("2");
							desc.setAttribute("id","filev"+id);
							//alert("3");
							
							desc.appendChild(document.createTextNode("Video file: "+file.name));
							//alert("4");
							var videodiv=document.getElementById("v"+id);
							//alert("5");
							videodiv.innerHTML="";
							//alert("6");
							videodiv.appendChild(desc);
							//alert("7");
							videodiv.appendChild(delfile);
							
							var loaddiv=document.getElementById(id);
							var tab=document.getElementById('data'+id);
							//alert(tab.childElementCount);
							var eq=tab.getElementsByTagName("td")[2].innerText;
							//alert(eq);
							var vel=tab.getElementsByTagName("td")[1].innerText*1;
							//alert (vel);
							tab.getElementsByTagName("td")[3].innerText="Yes";
							var video=1;
							//alert(video);
							var videopath=null;
							videopath=document.getElementById("filev"+id).innerText.substring(12);
							//alert(videopath);
							loaddiv.setAttribute("onclick","tapeRecorder.loadTrack('./audio/"+audiopath+"',"+vel+",'"+eq+"','"+video+"','./video/"+videopath+"')");					
							
							} else if(xhr.status === 415){
							alert('Please insert only allowed input formats');
							uploadButton.value = 'Upload Track';
						} else if(xhr.status === 409){
							alert('File already exists on server');
							uploadButton.value = 'Upload Track';
						}
						else if(xhr.status === 451){
							alert('The video length is not compatible with audio track');
							fileSelect.value="";
							uploadButton.value = 'Upload Track';
						}
						else {
							alert('Bad request, please check data');
							uploadButton.value = 'Upload Track';
						}
					};
					xhr.send(formData);
				}		
			});
			var tab2=document.getElementById('data'+id);
			audiopath2=document.getElementById("filea"+id);
				if(audiopath2 != null && audiopath2 !== undefined){
					audiopath2=audiopath2.innerText.substring(12);
					var loaddiv2=document.getElementById(id);
					var eq2=tab2.getElementsByTagName("td")[2].innerText;
					var vel2=tab2.getElementsByTagName("td")[1].innerText*1;
					var video2=0;
					loaddiv2.setAttribute("onclick","tapeRecorder.loadTrack('./audio/"+audiopath2+"',"+vel2+",'"+eq2+"','"+video2+"',null)");					
				}			
			tab2.getElementsByTagName("td")[3].innerText="No";				
			
			
		} else if(xhr2.status === 452){
			alert('There is no file to delete');
		} 
		else {
			alert('Bad request, please check data');
		}
	};
	xhr2.send(formData2);
}


function deleterow(id){

	var formData = new FormData();
	formData.append("request","delRow");
	formData.append("id",id);
	var xhr = new XMLHttpRequest();
	xhr.open('POST','upload.php', true);
	xhr.onload = function () {
		if (xhr.status === 200) {
			// File and metadata are deleted, edit page, delete row
			var extdiv=document.getElementById(id).parentNode.parentNode;
			extdiv.parentNode.removeChild(extdiv);
			trackcount=trackcount-1;
			if(trackcount==0){
				document.getElementById('notracks').style.display = "block";
			}
			//alert(trackcount);
		} else if(xhr.status === 453){
			alert('Error in deleting metadata');
		} 
		else {
			alert('Bad request, please check data');
		}
	};
	xhr.send(formData);
}

document.getElementById("singleform").addEventListener('submit', function(event) {
		event.preventDefault();
		
		var title=document.getElementById("singletitle").value;
		var author=document.getElementById("singleauthor").value;
		var year=document.getElementById("singleyear").value;
		var speed=document.getElementById("singlespeed").value;
		var eq=document.getElementById("singleeq").value;
		if (year>2100 || year<1900){
			alert ("wrong year format");
			return;
		}
		var audiofileSelect = document.getElementById('singleimportaudio');
		var audiofile = audiofileSelect.files[0];
		if (typeof audiofile === 'undefined' || !audiofile){
			alert ("File not valid");
			return;
		}
		if (!audiofile.type.match('audio.*')) {
			alert ("The selected file is not an audio file");
			return;
		}
		var videofileSelect = document.getElementById('singleimportvideo');
		var videofile = null;
		if(videofileSelect.files.length!=0){
			//alert("ok video"+videofileSelect.files.length);
			var videofile = videofileSelect.files[0];
			if (typeof videofile === 'undefined' || !videofile){
			alert ("File not valid");
			return;
			}
			if (!videofile.type.match('video.*')) {
				alert ("The selected file is not a video file");
				return;
			}
		}
		var formData = new FormData();
		formData.append("request","singleTrack");
		formData.append("title",title);
		formData.append("author",author);
		formData.append("year",year);
		formData.append("speed",speed);
		formData.append("eq",eq);
		formData.append('newTrackaudio', audiofile, audiofile.name);
		if(videofileSelect.files.length!=0){
			formData.append('newTrackvideo', videofile, videofile.name);
		}
		console.log(formData);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "upload.php", true);
		xhr.onload = function () {
			if (xhr.status === 200) {
				var id=xhr.responseText*1;
				//alert(id);
				if(videofileSelect.files.length!=0){
					addTrackWithVideo(id,title,author,year,speed,eq,audiofile.name,videofile.name);
				}
				else{
					addTrackNoVideo(id,title,author,year,speed,eq,audiofile.name);
				}
				if(trackcount==0){
					document.getElementById('notracks').style.display = "none";
					trackcount=trackcount+1;
					//alert(trackcount);
				}
			} else if(xhr.status === 415){
				alert('Please insert only allowed input formats');
			} else if(xhr.status === 409){
				alert('Files already exist on server');
			} else if(xhr.status === 401){
				alert('Audio filename already exists in the database. Please change File Name');
			} else if(xhr.status === 501){
				alert('This track is already present in the database (Same Author and title). Please check the current tracklist.');
			}
			else if(xhr.status === 451){
				alert('Error: Audio and Video length are different');
				audiofileSelect.value="";
				videofileSelect.value="";
			}
			else {
				alert('Bad request, please check data');
			}
		};
		xhr.send(formData);
		
});

function addTrackWithVideo(id,title,author,year,speed,eq,audiofilename,videofilename){
	//console.log("addTrackDiv");
	var container=document.getElementById("track");
		var extdiv=document.createElement("div");
		extdiv.classList.add("trackLoaderContainer");
		extdiv.innerHTML="<div id='firstPlaceholder' class='firstRow'></div><div id='av"+id+"' class='audiovideo'>"+
							"<div id='a"+id+"' class='audio'><div id='filea"+id+"' class='filedesc'></div><div id='da"+id+"' class='delaudio'></div></div>"+
							"<div id='v"+id+"' class='video'><div id='filev"+id+"' class='filedesc'></div><div id='dv"+id+"' class='delvideo'></div></div>"+
							"</div><table class='dbTable'>"+
							"<tr class='secondRow'><td>Year</td><td>Speed</td><td>Equalization</td><td>Video</td></tr>"+
							"<tr id='data"+id+"' class='thirdRow'></tr>"+
							"</table>";
		container.appendChild(extdiv);
		var firstRow=document.getElementById("firstPlaceholder");
			firstRow.removeAttribute("id");
			var firstR=document.createElement("div");
				firstR.classList.add("firstR");
				firstR.setAttribute("id","title"+id);
				firstR.innerText=author+" - "+title+ "("+year+")";
			var delrow=document.createElement("div");
				delrow.classList.add("delrow");
				delrow.setAttribute("id","dr"+id);
				delrow.setAttribute("onclick","deleterow('"+id+"')");
				//delrow.innerText="Delete All";
			var trackLoaderButton=document.createElement("div");
				trackLoaderButton.classList.add("trackLoaderButton");
				trackLoaderButton.setAttribute("id",id);
				trackLoaderButton.setAttribute("onclick","tapeRecorder.loadTrack('audio/"+audiofilename+"',"+speed+",'"+eq+"','1','video/"+videofilename+"')");
				trackLoaderButton.innerText="Load Track";
		
		
		firstRow.appendChild(delrow);
		firstRow.appendChild(firstR);

		firstRow.appendChild(trackLoaderButton);
		
		var delfile=document.getElementById("da"+id);
		delfile.innerText='Delete Audio';
		delfile.setAttribute("onclick","deleteaudio('"+id+"','"+audiofilename+"')");
		var desc=document.getElementById("filea"+id);
		desc.appendChild(document.createTextNode("Audio file: "+audiofilename));
		var delfile=document.getElementById("dv"+id);
		delfile.innerText='Delete Video';
		delfile.setAttribute("onclick","deletevideo('"+id+"','"+videofilename+"')");
		var desc=document.getElementById("filev"+id);
		desc.appendChild(document.createTextNode("Video file: "+videofilename));
		var thirdRow=document.getElementById("data"+id);
		thirdRow.innerHTML=("<td>"+year+"</td><td>"+speed+"</td><td>"+eq+"</td><td>Yes</td>");
}

function addTrackNoVideo(id,title,author,year,speed,eq,audiofilename){
	//console.log("addTrackDiv");
	var container=document.getElementById("track");
		var extdiv=document.createElement("div");
		extdiv.classList.add("trackLoaderContainer");
		extdiv.innerHTML="<div id='firstPlaceholder' class='firstRow'></div><div id='av"+id+"' class='audiovideo'>"+
							"<div id='a"+id+"' class='audio'><div id='filea"+id+"' class='filedesc'></div><div id='da"+id+"' class='delaudio'></div></div>"+
							"<div id='v"+id+"' class='video'>"+
								"<form action='upload.php' class='form-file-video' id='frv"+id+"' method='post' enctype='multipart/form-data'>"+
								"Select Video track (mp4,webm):"+
								"<input class='input-file' name='newTrack' id='inv"+id+"' type='file'>"+
								"<input class='button-file' id='btv"+id+"' value='Upload Video' name='submit' type='submit'></form></div>"+
							"</div><table class='dbTable'>"+
							"<tr class='secondRow'><td>Year</td><td>Speed</td><td>Equalization</td><td>Video</td></tr>"+
							"<tr id='data"+id+"' class='thirdRow'></tr>"+
							"</table>";
		container.appendChild(extdiv);
		var firstRow=document.getElementById("firstPlaceholder");
			firstRow.removeAttribute("id");
			var firstR=document.createElement("div");
				firstR.classList.add("firstR");
				firstR.setAttribute("id","title"+id);
				firstR.innerText=author+" - "+title+ "("+year+")";
			var delrow=document.createElement("div");
				delrow.classList.add("delrow");
				delrow.setAttribute("id","dr"+id);
				delrow.setAttribute("onclick","deleterow('"+id+"')");
				//delrow.innerText="Delete All";
			var trackLoaderButton=document.createElement("div");
				trackLoaderButton.classList.add("trackLoaderButton");
				trackLoaderButton.setAttribute("id",id);
				trackLoaderButton.setAttribute("onclick","tapeRecorder.loadTrack('audio/"+audiofilename+"',"+speed+",'"+eq+"',0,null)");
				trackLoaderButton.innerText="Load Track";
		
		
		
		firstRow.appendChild(delrow);
		firstRow.appendChild(firstR);
		firstRow.appendChild(trackLoaderButton);
		
		var delfile=document.getElementById("da"+id);
		delfile.innerText='Delete Audio';
		delfile.setAttribute("onclick","deleteaudio('"+id+"','"+audiofilename+"')");
		var desc=document.getElementById("filea"+id);
		desc.appendChild(document.createTextNode("Audio file: "+audiofilename));
		var uploadvideoform=document.getElementById("frv"+id);
		uploadvideoform.addEventListener('submit', function(event) {
				console.log('inside upload');
				event.preventDefault();
				console.log('after prevent default');
				var id=(this.id).substring(3);
				
				audiopath=document.getElementById("filea"+id);
				if(audiopath != null && audiopath !== undefined){
					audiopath=audiopath.innerText.substring(12);
					//alert(audiopath);
				}
				else{
					alert("please add an audio track first");
					return;
				}
				var form = document.getElementById('frv'+id);
				//console.log(form.id);
				var fileSelect = document.getElementById('inv'+id);
				//console.log(fileSelect.id);
				var uploadButton = document.getElementById('btv'+id);
				//console.log(uploadButton.id);
				uploadButton.value = 'Uploading...';
				
				var file = fileSelect.files[0];
				var formData = new FormData();
				console.log(file);
				if (typeof file === 'undefined' || !file){
					uploadButton.value = 'Upload Track';
				}
				if (!file.type.match('video.*')) {
					alert ("The submitted file is not a video file");
				} else {
					console.log("is a video file");
					formData.append("request","addVideoFile");
					formData.append('newTrack', file, file.name);
					formData.append('audio',audiopath);
					formData.append('id',id);
					var xhr = new XMLHttpRequest();
					xhr.open('POST', form.action, true);
					xhr.onload = function () {
						if (xhr.status === 200) {
							// File is uploaded, edit page, update row				
							var delfile=document.createElement("div");
							delfile.classList.add('delvideo');
							delfile.innerText='Delete Video';
							delfile.setAttribute("onclick","deletevideo('"+id+"','"+file.name+"')");
							delfile.setAttribute("id","dv"+id);
							var desc=document.createElement("div");
							//alert("creatediv");
							desc.classList.add("filedesc");
							//alert("2");
							desc.setAttribute("id","filev"+id);
							//alert("3");
							
							desc.appendChild(document.createTextNode("Video file: "+file.name));
							//alert("4");
							var videodiv=document.getElementById("v"+id);
							//alert("5");
							videodiv.innerHTML="";
							//alert("6");
							videodiv.appendChild(desc);
							//alert("7");
							videodiv.appendChild(delfile);
							
							var loaddiv=document.getElementById(id);
							var tab=document.getElementById('data'+id);
							//alert(tab.childElementCount);
							var eq=tab.getElementsByTagName("td")[2].innerText;
							//alert(eq);
							var vel=tab.getElementsByTagName("td")[1].innerText*1;
							//alert (vel);
							tab.getElementsByTagName("td")[3].innerText="Yes";
							var video=1;
							//alert(video);
							var videopath=null;
							videopath=document.getElementById("filev"+id).innerText.substring(12);
							//alert(videopath);
							loaddiv.setAttribute("onclick","tapeRecorder.loadTrack('./audio/"+audiopath+"',"+vel+",'"+eq+"','"+video+"','./video/"+videopath+"')");					
							
							} else if(xhr.status === 415){
							alert('Please insert only allowed input formats');
							uploadButton.value = 'Upload Track';
						} else if(xhr.status === 409){
							alert('File already exists on server');
							uploadButton.value = 'Upload Track';
						}
						else if(xhr.status === 451){
							alert('The video length is not compatible with audio track');
							fileSelect.value="";
							uploadButton.value = 'Upload Track';
						}
						else {
							alert('Bad request, please check data');
							uploadButton.value = 'Upload Track';
						}
					};
					xhr.send(formData);
				}		
			});
		var thirdRow=document.getElementById("data"+id);
		thirdRow.innerHTML=("<td>"+year+"</td><td>"+speed+"</td><td>"+eq+"</td><td>No</td>");
}

document.getElementById("resetdb").addEventListener('click', function(event) {
	
	if(confirm("Are you sure to reset database? Audio/Video files and track information will be lost.")){
	var formData = new FormData();
	formData.append("request","reset");
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "upload.php", true);
	xhr.onload = function () {
			if (xhr.status === 200) {
				document.getElementById("track").innerHTML="";
				document.getElementById('notracks').style.display = "block";
			}
			else if(xhr.status === 453){
				alert('Error in resetting the database');
			}
			else {
				alert('Unexpected error');
			}
	}	
	xhr.send(formData);
	}
});

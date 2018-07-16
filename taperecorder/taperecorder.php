<!-- <!DOCTYPE html>
<html>
<head> -->

<?php 
define("PHI_HREF_SRC", "./"); /**/
?>

<style>
   @import url(./css/style.css);
</style>
   
<!-- <link href="<?php /* echo PHI_HREF_SRC;*/?>css/style.css" rel="stylesheet" type="text/css">  -->
 <script src="<?php echo PHI_HREF_SRC;?>jquery/jquery-1.11.1.js"></script> 
<script	src="<?php echo PHI_HREF_SRC;?>kinetic/kinetic.js"></script>
<script src="<?php echo PHI_HREF_SRC;?>tools.js"></script>
<script src="<?php echo PHI_HREF_SRC;?>taperecorder.js"></script>
<script src="<?php echo PHI_HREF_SRC;?>interface.js"></script>
<!-- </head>  -->

<body>

	<div id="magn" class = "init">
	<div id="upan"><div id="uploading"></div><div id="uploadingText">Uploading...</div></div>
		 <div id = "reelsContainer">
		 	<div id="reels"></div>
		 	<div id= "videoContainer"></div>
		</div>
	 
		
		<!-- <div id="bottom"> -->
		<div id = "time">
			<p id="timer" class = "inLineBlock">0:00:00</p>
			<div id="resetTimer" class = "inLineBlock" onmousedown="clickResetTimer()"
				onmouseup="declickResetTimer()"></div>
			<a id="speed" class="knob, inLineBlock"> 
				<img id="knSpeed"  src="<?php echo PHI_HREF_SRC;?>images/knob.png" class="posS1" alt="Speed selector knob"> <!--  -->
			</a>
			
		</div>
		
		<div class="clickcontainer">
			<div id="rewind" class="click"></div> 
			<div id="ffward" class="click"></div> 
			<div id="play" class="click"></div> 
			<div id="pause" class="click"></div>
			<a id="eq" class="knob">
				<img id="knEq"  src="<?php echo PHI_HREF_SRC;?>images/knob.png" class="posE0" alt="Equalization selector knob"> <!--  class="pos1" -->
			</a>
		</div>
		
		

		</div>

<!-- 	<div id="trackLoader">  -->
	
<!-- DB song  -->
		<div id="songDBTitle"  onclick="openLoader()">
			<div id = "loaderTitle">Track Loader</div>
			<!--<div id = "openDB" class = "openPart" ></div>  class = "menuPart"-->
		</div>

		<div id="db" style = "display: none;">

			<div id="track">
				<?php 
				// db connection
				try{
				//echo "before";
				$db = new SQLite3('im.db');
				//echo "after open";
				$results = $db->query('select * from phi_tape');
				
				$trackcount = $db->querySingle("SELECT COUNT(*) as count FROM phi_tape");

				while ($r_results = $results->fetchArray()) {
				?>
					<div class="trackLoaderContainer">
						<div class ="firstRow">
							
							<div class = "delrow" id="dr<?php echo $r_results['id_tape']?>" onclick="deleterow('<?php echo $r_results['id_tape']?>')"></div>
							<div class = "firstR" id="title<?php echo $r_results['id_tape']?>">
								<?php echo stripslashes($r_results['artista']);?> - <?php echo stripslashes($r_results['titolo']);?> (<?php echo stripslashes($r_results['data']);?>)
							</div>
							<?php if (file_exists('./'.$r_results['path_audio'])){?>
								<div class="trackLoaderButton" id="<?php echo $r_results['id_tape']?>"
								onclick="tapeRecorder.loadTrack('<?php echo $r_results['path_audio'];?>',
								<?php echo $r_results['velocita'];?>,'<?php echo $r_results['equalizzazione'];?>',
								'<?php echo $r_results['video'];?>', '<?php echo PHI_HREF_SRC;?><?php echo $r_results['path_video'];?>')">
								Load Track
								</div>
								
							<?php } else { ?>
								<div class = "errorLoader" id="<?php echo $r_results['id_tape']?>" missing="<?php echo $r_results['path_audio']?>"> <?php echo basename($r_results['path_audio'])?> not found 
								</div>
							<?php } ?>
						</div>
						
						<div class="audiovideo" id="av<?php echo $r_results['id_tape']?>">
						
							<div class="audio" id="a<?php echo $r_results['id_tape']?>">
								<?php
								//echo('./'.$r_results['path_audio']);
								if (file_exists('./'.$r_results['path_audio'])){
									echo("<div class='filedesc' id='filea".$r_results['id_tape']."'> Audio file: ". basename($r_results['path_audio'])."</div>"); 
								?>
								<div class = "delaudio" id="da<?php echo $r_results['id_tape']?>" onclick="deleteaudio('<?php echo $r_results['id_tape']?>','<?php echo basename($r_results['path_audio'])?>')">Delete Audio
								</div>
								<?php } else{?>
									<form action="upload.php" class="form-file-audio" id="fra<?php echo $r_results['id_tape']?>" method="post" enctype="multipart/form-data">
										Select Audio track (mp3,flac,wav):
										<input type="file" class="input-file" name="newTrack" id="ina<?php echo $r_results['id_tape']?>">
										<input type="submit" class="button-file" id="bta<?php echo $r_results['id_tape']?>" value="Upload Track" name="submit">
									</form>
								<?php } ?>
							</div>
							
							<div class="video" id="v<?php echo $r_results['id_tape']?>">
							
								<?php 	if ($r_results['video'] == 1 and file_exists('./'.$r_results['path_video']) ){
									echo("<div class='filedesc' id='filev".$r_results['id_tape']."'> Video file: ". basename($r_results['path_video'])."</div>"); 
								?>
								<div class = "delvideo" id="dv<?php echo $r_results['id_tape']?>" onclick="deletevideo('<?php echo $r_results['id_tape']?>','<?php echo basename($r_results['path_video'])?>')">Delete Video
								</div>
								<?php } else{ ?>
									<form action="upload.php" class="form-file-video" id="frv<?php echo $r_results['id_tape']?>" method="post" enctype="multipart/form-data">
										Select Video track (mp4,webm):
										<input type="file" class="input-file" name="newTrack" id="inv<?php echo $r_results['id_tape']?>">
										<input type="submit" class="button-file" id="btv<?php echo $r_results['id_tape']?>" value="Upload Video" name="submit">
									</form>
								<?php } ?>
							</div>
						</div>
						
						
						<table class="dbTable">
							<tr class="secondRow">
								<td>Year</td>
								<td>Speed</td>
								<td>Equalization</td>
								<td>Video</td>
							</tr>
							<tr class="thirdRow" id="data<?php echo $r_results['id_tape']?>">
								<td><?php echo $r_results['data'];?></td>
								<td><?php echo $r_results['velocita'];?> </td>
								<td><?php echo $r_results['equalizzazione'];?> </td>
								<td><?php 	if ($r_results['video'] == 1 ) 
												echo 'Yes'; 
											else 
												echo 'No';?> </td>
							</tr>
						</table>
					</div>

				<?php 
				}
				}
				catch(PDOException $e) {
					echo $e->getMessage();
				}

				?>
			<div id="notracks"> Tracklist is empty </div>
			</div>
		</div>
		
		<div id="importTitle"  onclick="openImport()">
			<div id = "importTitleLabel">Upload/Download Area</div>
		</div>

		<div id="importContent" style = "display: none;">
			<div id="singleTabTitle"  onclick="openSingle()">
				<div class = "titleSubMenuDiv">Import Single Track</div>
				<div id="singlearrow" class="openSubPart"></div>
			</div>

			<div id="singleTabContent" style = "display: none;">
					<form action="upload.php" id="singleform">
						<table class="formTable" id="singleTable">
							<tr><th>Title:<td><input id="singletitle" type="text" name="title" class="td100" required></tr>
							<tr><th>Author:<td><input id="singleauthor" type="text" name="author" class="td100" required></tr>
							<tr><th>Year:<td><input id="singleyear" type="number" name="author" class="td100" required></tr>
							<tr><th>Speed:<td>
							<select id="singlespeed" name="speedselect" class="td100">
							  <option value="3.75">3.75</option>
							  <option value="7.5">7.5</option>
							  <option value="15">15</option>
							  <option value="30">30</option>
							</select> </tr>
							<tr><th>Equalization<td>
							<select id="singleeq" name="eqselect" class="td100">
							  <option value="ccir">CCIR</option>
							  <option value="ccir">NAB</option>
							</select></tr>
							<tr><th>Select Audio Track (mp3,flac,wav):<td><input type="file" class="input-file-audio" name="singleimportaudio" id="singleimportaudio" required></tr>
							<tr><th>Select Video Track (mp4, webm):<td><input type="file" class="input-file-video" name="singleimportvideo" id="singleimportvideo"></tr>
							<tr><td colspan=2 ><input id="singlesubmit" type="submit" class="td100" value="Upload Track"></tr>
						</table>
					</form>
			</div>
			
			
			<div id="jsonTabTitle"  onclick="openJson()">
				<div class = "titleSubMenuDiv">Import/Export Multiple Tracks</div>
				<div id="jsonarrow" class="openSubPart"></div>
			</div>

			<div id="jsonTabContent" style = "display: none;">
				<div class="importexportdiv">
					<form method="post" class="w100" action="upload.php">
						<input type="hidden" name="request" value="downloadjson">
						<input id="exportjson" type="submit" class="w100" value="Download Tracklist (.json)">
					</form>
				</div>
				<div class="importexportdiv">	
					<form method="post" class="w100" action="downloadzip.php">
						<input type="hidden" name="request" value="downloadfiles">
						<input id="exportfiles" type="submit" class="w100" value="Download Tracks (.zip)">
					</form>
				</div>
				<div class="importexportdiv">	
					<input id="resetdb" type="submit" class="w100" value="Reset database">
				</div>
				<div class="importexportdiv">	
					<input id="uploadjson" class="w100" type="button" disabled="disabled" value="Upload Tracklist from json file">
					<form action="uploadlist.php" class="w100" id="jsonform" method="post" enctype="multipart/form-data" >
						<table class="jsontable" width="100%">
						<tr><td width="30%" id="jsontd">
						Select .json file to upload:</td>
						<td width="30%" class="jsontd"> 
						<input type="hidden" name="request" value="loadjson">
						<input type="file" name="jsonimport" id="jsonimport" required></td>
						<td width="40%" class="jsontd">
						<input type="submit" id="jsonbutton" value="Upload Tracks" name="jsonbutton"></td></tr></table>
					</form>
				</div>
			</div>
			
			
			
		</div>
		
		
		<script type="text/javascript">
			var trackcount=<?php echo($trackcount)?>;
			//alert(trackcount);
			if(trackcount==0){
				document.getElementById('notracks').style.display = "block";
			}
		</script>
		<script type = "text/javascript" src = "./js/upload.js"></script>
		<div id="debug"></div>
</body>
<!-- </html>  -->

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
				<img id="knEq"  src="<?php echo PHI_HREF_SRC;?>images/knob.png" class="posE2" alt="Equalization selector knob"> <!--  class="pos1" -->
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
				/*
				$conn = mysqli("localhost", "root", "");
				if(! $conn){
					echo "Errore di connessione al server";
					exit();
				}
				
				//db selection
				mysql_selectdb("phi");
				*/
				$servername = "localhost";
				$username = "root";
				$password = "";
				$dbname = "phi";

				// Create connection
				$conn = new mysqli($servername, $username, $password, $dbname);

				// Check connection
				if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
				} 

				//create the query
				$sql = "select * from phi_tape ";

				$result = $conn->query($sql);

				if ($result->num_rows > 0) {
					// output data of each row
				while($r_results = $result->fetch_assoc()) {
				?>
				<div class="trackLoaderContainer">
					<div class ="firstRow">
						<div class="firstR">
							<?php echo $r_results['artista'];?>
							-
							<?php echo $r_results['titolo'];?>
						
						</div>
						<div class="trackLoaderButton"
							onclick="tapeRecorder.loadTrack('<?php echo $r_results['path_audio'];?>',
							<?php echo $r_results['speed'];?>,'<?php echo $r_results['eq'];?>',
							'<?php echo $r_results['video'];?>', '<?php echo PHI_HREF_SRC;?><?php echo $r_results['path_video'];?>')">
							Load Disk
						</div>
					</div>

					<table class="dbTable">
						<tr class="secondRow">
							<td>Year</td>
							<td>Speed</td>
							<td>Equalization</td>
							<td>Video</td>
						</tr>
						<tr class="thirdRow">
							<td><?php echo $r_results['data'];?></td>
							<td><?php echo $r_results['speed'];?></td>
							<td><?php echo $r_results['eq'];?></td>
							<td><?php 	if ($r_results['video'] == 1 )
											echo 'Yes'; 
										else 
											echo 'No';?></td>
						</tr>
					</table>
				</div>

				<?php 
				//$r_results = mysql_fetch_array($results);
					}
				}
				//close db connection
				mysqli_close($conn);
				?>
			</div>
		<!-- </div> -->
		
		<div id="debug"></div>

</body>
<!-- </html>  -->

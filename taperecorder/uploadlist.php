<html>
<head>
	<title>Upload report</title>
	<link rel="stylesheet" href="./css/uploadlist.css">
	
</head>
<body>
	<div class="header">
		<div class="title">Upload Report</div>
		<div id="back"><a href="taperecorder.php">Back to player</a></div>
	</div>
	<div class="content">
	<?php
		
		$db = new SQLite3('im.db');
		if(isset($_POST['request'])&&$_POST['request']=="loadjson"){
			//echo($_POST['request']);
			$file=basename($_FILES["jsonimport"]["name"]);
			//echo($file);
			$isjsonok=1;
			$ext=strtolower(pathinfo($file,PATHINFO_EXTENSION));
			if($ext != "json"){
				echo("The submitted file is not a valid json file");
				$isjsonok=0;
			}
			
			if ($isjsonok && move_uploaded_file($_FILES["jsonimport"]["tmp_name"], $file)) {
				$jsonstring=file_get_contents($file, true);
				//echo($jsonstring);
				$tracks=@json_decode($jsonstring);
				if(json_last_error() != JSON_ERROR_NONE){
					if(json_last_error() ==4){
						echo("Syntax error in json file");
					}
					else{
						echo("error occurred decoding json file");
					}
					$isjsonok=0;
				}
			}
			if($isjsonok){
				?>
				<table id="contenttable">
					<tr><th>Audio File</th><th>Video File</th><th>Title</th><th>Author</th><th>Year</th><th>Speed</th><th>EQ</th><th>Uploaded</th><th>Note</th></tr>
				
				<?php
				//var_dump($tracks);
				foreach($tracks as $relid => $track){
					$upload=1;
					$uploaded=0;
					$note="";
					?>
					<tr class="reportrow">
					<?php
					if(!empty($track->path_audio)){
						$target_file="audio/".$track->path_audio;
						
						$q="select * from phi_tape where path_audio='".$target_file."'";
						//echo ($q);
						$results = $db->query($q);
						$r_results = $results->fetchArray();
						if($r_results){
							$upload=0;
							$note=$note.$track->path_audio." already present in the database<br>";
						}
						
						$audioFileType=strtolower(pathinfo($track->path_audio,PATHINFO_EXTENSION));
						if($audioFileType != "mp3" && $audioFileType != "flac" && $audioFileType != "wav") {
							$upload=0;
							$note=$note.$track->path_audio." wrong file extension - wav,mp3,tiff<br>";
						}
						if (file_exists($target_file)) {
							$upload=0;
							$note=$note.$track->path_audio." already present on server<br>";
						}
						echo("<td>".$track->path_audio."</td>");						
					}
					else{
						echo("<td> </td>");
						$note=$note."missing audio file<br>";
						$upload=0;
					}
					
					if(!empty($track->path_video) and ($track->path_video)!=""){
						$target_file="video/".$track->path_video;
						
						$videoFileType=strtolower(pathinfo($track->path_video,PATHINFO_EXTENSION));
						if($videoFileType != "mp4" && $videoFileType != "webm") {
							$upload=0;
							$note=$note.$track->path_video." wrong file extension - mp4,webm<br>";
						}
						if (file_exists($target_file)) {
							$upload=0;
							$note=$note.$track->path_video." already present on server<br>";
						}
						echo("<td>".$track->path_video."</td>");						
					}
					else{
						echo("<td> </td>");
						$note=$note."(missing video file)<br>";
					}
					
					if(!empty($track->title)){
						$title=$track->title;
						echo("<td>".$title."</td>");
					}
					else{
						echo("<td></td>");
						$note=$note."missing title<br>";
						$upload=0;
					}
					if(!empty($track->author)){
						$author=$track->author;
						echo("<td>".$author."</td>");
					}
					else{
						echo("<td></td>");
						$note=$note."missing author<br>";
						$upload=0;
					}
					if (!empty($track->title)&&!empty($track->author)){
						$titlemod=str_replace("'", "\''", $title);
						$q="select * from phi_tape where titolo='".$titlemod."' and artista='".$author."'";
						//echo ($q);
						$results2 = $db->query($q);
						$r_resultsb = $results2->fetchArray();
						if($r_resultsb){
							$upload=0;
							$note=$note.$title." by ".$author." is already present in the database<br>";
						}
					}
					if(!empty($track->year)){
						$year=$track->year;
						echo("<td>".$year."</td>");
					}
					else{
						echo("<td></td>");
						$note=$note."missing year<br>";
						$upload=0;
					}
					if(!empty($track->speed)){
						$speed=$track->speed;
						echo("<td>".$speed."</td>");
					}
					else{
						echo("<td></td>");
						$note=$note."missing speed<br>";
						$upload=0;
					}
					if(!empty($track->equalization)){
						$eq=$track->equalization;
						echo("<td>".$eq."</td>");
					}
					else{
						echo("<td></td>");
						$note=$note."missing equalization<br>";
						$upload=0;
					}
					if($upload){
						try{
							if(!empty($track->path_video) and ($track->path_video)!=""){
							//$vid=$track->video;
							$vid=0;
							$sql="INSERT INTO 'phi_tape' ('path_audio', 'path_video', 'titolo', 'artista', 'data', 'velocita','equalizzazione','video') VALUES ('audio/".$track->path_audio."', 'video/".$track->path_video."', '".$titlemod."', '".$author."', ".$year.", ".$speed.", '".$eq."',".$vid.")";
							}
							else{
							$sql="INSERT INTO 'phi_tape' ('path_audio', 'titolo', 'artista', 'data', 'velocita','equalizzazione','video') VALUES ('audio/".$track->path_audio."', '".$titlemod."', '".$author."', ".$year.", ".$speed.", '".$eq."',0)";	
							}
							//echo ($sql);
							$db->exec($sql);
							//echo ("dopo");
							$uploaded=1;
						} 
						catch(PDOException $e) {
							echo $e->getMessage();
							echo("<td> No</td>");
							$note=$note."unexpected error, check escape characters";
						}
					}
					if($uploaded){
						echo("<td> Yes</td>");
					}
					else{
						echo("<td> No</td>");
					}
					echo("<td>".$note);
				}?></td></tr><?php
				
			}
		}
		else{
			//header("Location: gramoplayer.php");
		}
		
	?>
	</div>
	<script type="text/javascript">
		var list=document.getElementsByClassName("reportrow");
		for(var i = 0; i < list.length; i++)
		{
		   var uploaded=list[i].childNodes[8].innerText;
		   //alert(uploaded);
			if (uploaded=="No"){
				list[i].classList.add("warn");
			}
			else{
				list[i].classList.add("success");
			}
		}
	</script>
	<?php exit; ?>
</body>
</html>
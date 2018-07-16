
<?php	
	require_once('js/getid3/getid3.php');
	http_response_code(500);
	//request for upload a file on the server
	if(isset($_POST["request"])){
		if($_POST["request"]=="addAudioFile"){
			echo($_POST["request"]);
			$target_dir = "./audio/";
			$target_file = $target_dir . basename($_FILES["newTrack"]["name"]);
			//echo $target_file;
			$uploadOk = 1;
			//echo $uploadOk;
			$audioFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
			//echo $audioFileType;

			// Check if file already exists
			if (file_exists($target_file)) {
				http_response_code(409);
				//echo "Sorry, file already exists.";
				$uploadOk = 0;
			}

			// Allow certain file formats
			if($audioFileType != "mp3" && $audioFileType != "flac" && $audioFileType != "wav") {
				//echo "Sorry, Only Mp3,flac and Wav files are allowed";
				echo $audioFileType;
				http_response_code(415);
				$uploadOk = 0;
			}
			
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 0) {
				echo "Your file was not uploaded.";
			// if everything is ok, try to upload file
			} else {
				if (move_uploaded_file($_FILES["newTrack"]["tmp_name"], $target_file)) {
					http_response_code(200);
				} else {
					//echo "Sorry, there was an error uploading your file.";
				}
			}
			exit;
		}
		
		
		if($_POST["request"]=="addVideoFile"){
			echo($_POST["request"]);
			$target_dir = "./video/";
			$target_file = $target_dir . basename($_FILES["newTrack"]["name"]);
			//echo $target_file;
			$uploadOk = 1;
			//echo $uploadOk;
			$videoFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
			//echo $audioFileType;

			// Check if file already exists
			if (file_exists($target_file)) {
				http_response_code(409);
				//echo "Sorry, file already exists.";
				$uploadOk = 0;
			}

			// Allow certain file formats
			if($videoFileType != "mp4" && $videoFileType != "webm") {
				//echo "Sorry, Only Mp4 and Webm files are allowed";
				echo $videoFileType;
				http_response_code(415);
				$uploadOk = 0;
			}
			
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 0) {
				echo "Your file was not uploaded.";
			// if everything is ok, try to upload file
			} else {
				if (move_uploaded_file($_FILES["newTrack"]["tmp_name"], $target_file)) {
					
					//check file duration
					$getID3 = new getID3;
					$audioinfo=$getID3->analyze("./audio/".$_POST["audio"]);
					$audiosec=$audioinfo['playtime_seconds'];
					echo($audiosec);
					$ThisFileInfo = $getID3->analyze($target_file);
					$sec= $ThisFileInfo['playtime_seconds'];
					echo($sec);
					//if different > 10 seconds, delete it and send error
					if (abs($sec-$audiosec)>10){
						http_response_code(451);
						unlink($target_file);
					}
					else{
						//update database and buttons
						echo("before");
						try{
							echo("intry");
							$db = new SQLite3('im.db');
							echo("opened");
							$sql="UPDATE phi_tape SET video = 1, path_video = 'video/".basename($target_file)."' where id_tape=".$_POST["id"];
							echo ($sql);
							$db->exec($sql);
							http_response_code(200);
						} 
						catch(PDOException $e) {
							http_response_code(500);
							echo $e->getMessage();
						}
					}
				} else {
					//echo "Sorry, there was an error uploading your file.";
				}
			}
			exit;
		}
		
		//request for deleting aa audio file from the server
		if($_POST["request"]=="delAudio"){
			if(isset($_POST["file"])){
				$file=$_POST["file"];
				$filePath="audio/".$file;
				if (file_exists($filePath)){
					unlink($filePath);
					http_response_code(200);
				}
				else {
					echo ("nothing to delete");
					http_response_code(452);
				}
			}
			exit;
		}
		
		
		//request for deleting a video file from the server
		if($_POST["request"]=="delVideo"){
			if(isset($_POST["file"])){
				$file=$_POST["file"];
				$filePath="video/".$file;
				if (file_exists($filePath)){
					unlink($filePath);
					try{
							$db = new SQLite3('im.db');
							$sql="UPDATE phi_tape SET video=0, path_video = null where id_tape=".$_POST["id"];
							echo ($sql);
							$db->exec($sql);
							http_response_code(200);
						} 
						catch(PDOException $e) {
							http_response_code(500);
							echo $e->getMessage();
						}
				}
				else {
					echo ("nothing to delete");
					http_response_code(452);
				}
			}
			exit;
		}
		
		
		//request for deleting a file from the server
		if($_POST["request"]=="delRow"){
			if(isset($_POST["id"])){
				$id=$_POST["id"];
				try{
						$db = new SQLite3('im.db');
						$sql='select * from phi_tape where id_tape='.$id;
						$results = $db->query($sql);
						$r_results = $results->fetchArray();
						$audiofile=$r_results['path_audio'];
						$videofile=$r_results['path_video'];			
						$sql='delete from phi_tape where id_tape='.$id;
						echo ($sql);
						$db->exec($sql);
						
						if (!empty($audiofile) and file_exists($audiofile)){
							unlink($audiofile);
						}
						if (!empty($videofile) and file_exists($videofile)){
							unlink($videofile);
						}
						http_response_code(200);
				} 
				catch(PDOException $e) {
						http_response_code(453);
						echo $e->getMessage();
				}
			}
			exit;
		}
		
		if($_POST["request"]=="singleTrack"){
			//echo($_POST["request"]);
			$audio_target_dir = "audio/";
			$audio_target_file = $audio_target_dir . basename($_FILES["newTrackaudio"]["name"]);
			//echo $target_file;
			$uploadOk = 1;
			//echo $uploadOk;
			$audioFileType = strtolower(pathinfo($audio_target_file,PATHINFO_EXTENSION));
			//echo $audioFileType;

			try{
				$db = new SQLite3('im.db');
				$title=$_POST["title"];
				$author=$_POST["author"];
				$year=$_POST["year"];
				$speed=$_POST["speed"];
				$eq=$_POST["eq"];	
				$title=str_replace("'", "\''", $title);
				$q="select * from phi_tape where path_audio='".$audio_target_file."'";
				//echo ($q);
				$results = $db->query($q);
				$r_results = $results->fetchArray();
				$q="select * from phi_tape where titolo='".$title."' and artista='".$author."'";
				//echo ($q);
				$results2 = $db->query($q);
				$r_resultsb = $results2->fetchArray();
				//echo($r_resultsb[0]);
			} 
			catch(PDOException $e) {
				echo $e->getMessage();
			}
			
			if ($r_results) {
				http_response_code(401);
				$uploadOk = 0;
			}
			
			if ($r_resultsb) {
				http_response_code(501);
				$uploadOk = 0;
			}		
			
			// Check if file already exists
			if (file_exists($audio_target_file)) {
				http_response_code(409);
				//echo "Sorry, file already exists.";
				$uploadOk = 0;
			}

			// Allow certain file formats
			if($audioFileType != "mp3" && $audioFileType != "flac" && $audioFileType != "wav") {
				//echo "Sorry, Only Mp3,flac and Wav files are allowed";
				echo $audioFileType;
				http_response_code(415);
				$uploadOk = 0;
			}
			
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 0) {
				echo "Your file was not uploaded.";
			// if everything is ok, try to upload file
			} else {
				if(!isset($_FILES["newTrackvideo"])){
					if (move_uploaded_file($_FILES["newTrackaudio"]["tmp_name"], $audio_target_file)) {
						http_response_code(200);
						//check file duration
						//$getID3 = new getID3;
						//$ThisFileInfo = $getID3->analyze($target_file);
						//$sec= $ThisFileInfo['playtime_seconds'];
						//if longer than 200 secondd, delete it and send error
						//if ($sec>200){
						//	http_response_code(451);
						//	unlink($target_file);
						//}
						//else{
							
						try{
							
							$sql="INSERT INTO 'phi_tape' ('path_audio', 'titolo', 'artista', 'data', 'velocita', 'equalizzazione', 'video') VALUES ('".$audio_target_file."', '".$title."', '".$author."', '".$year."','".$speed."', '".$eq."','0')";
							//echo ($sql);
							$db->exec($sql);
							
							$results = $db->query("select id_tape from phi_tape where path_audio='".$audio_target_file."'");
							$r_results = $results->fetchArray();
							echo($r_results['id_tape']);
						} 
						catch(PDOException $e) {
							echo $e->getMessage();
						}
							
						//}
					}
				}
				else{
					$video_target_dir = "video/";
					$video_target_file = $video_target_dir . basename($_FILES["newTrackvideo"]["name"]);
					$videoFileType = strtolower(pathinfo($video_target_file,PATHINFO_EXTENSION));
					
							// Check if file already exists
					if (file_exists($video_target_file)) {
						http_response_code(409);
						//echo "Sorry, file already exists.";
						$uploadOk = 0;
					}

					// Allow certain file formats
					if($videoFileType != "mp4" && $videoFileType != "webm") {
						//echo "Sorry, Only Mp4 and Webm files are allowed";
						echo $videoFileType;
						http_response_code(415);
						$uploadOk = 0;
					}
					
					
					
					if ($uploadOk and move_uploaded_file($_FILES["newTrackaudio"]["tmp_name"], $audio_target_file) and move_uploaded_file($_FILES["newTrackvideo"]["tmp_name"], $video_target_file)) {
						http_response_code(200);
						//check file duration
						$getID3 = new getID3;
						$audioinfo = $getID3->analyze($audio_target_file);
						$audiosec= $audioinfo['playtime_seconds'];
						$videoinfo = $getID3->analyze($video_target_file);
						$videosec= $videoinfo['playtime_seconds'];
						//if different more than 10 seconds, delete it and send error
						if (abs($audiosec-$videosec)>10){
							http_response_code(451);
							unlink($audio_target_file);
							unlink($video_target_file);
						}
						else{
							
							try{
								
								$sql="INSERT INTO 'phi_tape' ('path_audio','path_video', 'titolo', 'artista', 'data', 'velocita', 'equalizzazione', 'video') VALUES ('".$audio_target_file."', '".$video_target_file."' ,'".$title."', '".$author."', '".$year."','".$speed."', '".$eq."','1')";
								//echo ($sql);
								$db->exec($sql);
								
								$results = $db->query("select id_tape from phi_tape where path_audio='".$audio_target_file."'");
								$r_results = $results->fetchArray();
								echo($r_results['id_tape']);
							} 
							catch(PDOException $e) {
								echo $e->getMessage();
							}
							
						}
					}
				}
				
			}
			exit;
		}
		if($_POST["request"]=="downloadjson"){
			try{
				$db = new SQLite3('im.db');
				$results = $db->query('select * from phi_tape');
				$tracks=array();

				while ($r_results = $results->fetchArray()) {
					$myObj=new stdClass();
					//$myObj->id_vinyl = $r_results['id_vinyl'];
					$myObj->path_audio = stripslashes (basename($r_results['path_audio']));
					$myObj->path_video = stripslashes (basename($r_results['path_video']));
					$myObj->titolo = stripslashes ($r_results['titolo']);
					$myObj->artista = $r_results['artista'];
					$myObj->data = $r_results['data'];
					$myObj->velocita = $r_results['velocita'];
					$myObj->equalizzazione = $r_results['equalizzazione'];
					$myObj->video = stripslashes (basename($r_results['video']));
					array_push($tracks,$myObj);	 
				}
					$myJSON = json_encode($tracks, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);	
					$myfile = fopen("tracklist.json", "w");
					fwrite($myfile, $myJSON);
					fclose($myfile);
					header("Content-Type: application/force-download");
					header("Content-Transfer-Encoding: Binary"); 
					header("Content-disposition: attachment; filename=\"" . "tracklist.json" . "\""); 
					readfile("tracklist.json"); 
					http_response_code(200);
			} 
			catch(PDOException $e) {
				echo $e->getMessage();
			}
			exit;
		}
		if($_POST["request"]=="reset"){
			try{
					$db = new SQLite3('im.db');
					$sql='delete from phi_tape';
					echo ($sql);
					$db->exec($sql);
					$files = glob('audio/*'); // get all audio file names
					foreach($files as $file){ // iterate files
						if(is_file($file))	unlink($file); // delete file
					}
					$files = glob('video/*'); // get all video file names
					foreach($files as $file){ // iterate files
						if(is_file($file))	unlink($file); // delete file
					}
					http_response_code(200);
			} 
			catch(PDOException $e) {
					http_response_code(453);
					echo $e->getMessage();
			}
			exit;
		}
	}
?>

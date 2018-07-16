<?php 
// Create ZIP file
if(isset($_POST['request'])&&$_POST['request']=="downloadfiles"){
    $zip = new ZipArchive();
    $filename = "./taperecorderTracks.zip";
    if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
        exit("cannot open <$filename>\n");
    }
    $diraudio = 'audio/';
	$dirvideo='video/';
    // Create zip
	if(count(scandir($diraudio)) > 2 and count(scandir($dirvideo) >2)){
		createZip($zip,$diraudio);
		createZip($zip,$dirvideo);
		$zip->close();
		$filename = "taperecorderTracks.zip";
		
		if (file_exists($filename)) {
			header('Content-Type: application/zip');
			header('Content-Disposition: attachment; filename="'.basename($filename).'"');
			header('Content-Length: ' . filesize($filename));

			flush();
			readfile($filename);
			// delete file
			unlink($filename);
		}
	}
	else{
		$zip->addEmptyDir("audio");
		$zip->addEmptyDir("video");
		$zip->close();
		$filename = "taperecorderTracks.zip";
		
		if (file_exists($filename)) {
			header('Content-Type: application/zip');
			header('Content-Disposition: attachment; filename="'.basename($filename).'"');
			header('Content-Length: ' . filesize($filename));

			flush();
			readfile($filename);
			// delete file
			unlink($filename);
		}
	}
}
// Create zip
function createZip($zip,$dir){
	if (is_dir($dir)){
        if ($dh = opendir($dir)){
			
            while (($file = readdir($dh)) !== false){
                
                // If file
                if (is_file($dir.$file)) {
                    if($file != '' && $file != '.' && $file != '..'){
            
                        $zip->addFile($dir.$file);
                    }
                }else{
                    // If directory
                    if(is_dir($dir.$file) ){

                        if($file != '' && $file != '.' && $file != '..'){

                            // Add empty directory
                            $zip->addEmptyDir($dir.$file);
							
                            $folder = $dir.$file.'/';
                            
                            // Read data of the folder
                            createZip($zip,$folder);
                        }
                    }
                    
                }
                    
            }
            closedir($dh);
        }
    }
}
?>
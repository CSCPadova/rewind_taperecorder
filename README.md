# REWIND - Tape recorder

## Description

This repository contains the source code of a web application that simulates a tape recorder using the Web Audio API.
The project has also been developed using web technologies such as: PHP, HTML5, CSS3 and jQuery.
This project provides the following features:

*  **Audio playback**:  you can play a track simply with the tape recorder interface, you just need to load the tape from the track loader and play it by clicking on the play button;
*  **Reproduction Control**: you can manipulate the reproduction of the tracks with pause, fast forward (ff) and rewind buttons;
*  **Reset timer**: you can set the timer at zero when you want, by clicking on the reset timer button;
*  **Speed control**: you can set the reproduction speed of the tape;
*  **Equalization control**: you could set the equalization profile for the reproduction;
* **Track Loader**: using the track loader you can manage the tracks of your collection: you can choose the next track to play and the tracks to delete, you can also replace the audio/video file associated to a track with a new audio/video file specified through the upload interface.
* **Upload/Download Area**: the tape recorder is also equipped with an "Upload/Download Area" in which you can:
    * Import a single track;
    * Download the tracklist in JSON format;
    * Download all the tracks in a single zip file;

## Installation
All the project files are in the "taperecorder" folder. In order to install correctly the taperecorder project and use it, you need to put the "taperecorder" folder in any directory you prefer of the chosen web server (e.g.  if you use XAMPP (Apache) you need to put the "taperecorder" folder in any subdirectory of "htdocs" directory, that under Windows is in general located at this path: "C:\xampp\htdocs\").

Finally you need to control the PHP configuration in your "php.ini" file. In particular you need to:
* Enable SQLite extension (since the project uses it as DBMS), you can do this by decommenting the following two lines:
    * ```extension=php_sqlite3.dll```
    *  ```extension=php_pdo_sqlite.dll```
* Enable the upload file extension by setting "file_uploads" flag to "On" and the "upload_max_filesize" to the chosen upper bound as follows:
    * ```file_uploads=On ```
    * ```upload_max_filesize=XXXM``` (where "XXX" it's the max size for a file in upload, expressed in MB)
    * ```post_max_size==XXXM``` (where "XXX" it's the max size for a file in POST upload, expressed in MB)

## Usage
As first step, run your web server (e.g. Apache).
Then, open the browser at this address:
```
http://localhost/PATH_TO_TAPERECORDER/taperecorder/taperecorder.php:PORT
```
Where:
* "PATH_TO_TAPERECORDER": is the path from the web server root folder, to the "taperecorder" folder.
* "PORT": is the port used by the web server you use, by default is ``80``.


## Credits
The author of this project is [*Niccolò Pretto*](http://www.dei.unipd.it/~prettoni/).
The contributors of this project are:
* _Riccardo Galiazzo_
* _Fabio Giachelle_
* _Luca Piazzon_

The repository includes snippets of code and algorithms from the following repositories:
* **getID3**: https://github.com/JamesHeinrich/getID3
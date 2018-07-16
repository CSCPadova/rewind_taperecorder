CREATE TABLE 'phi_tape' (
  'id_tape' INTEGER PRIMARY KEY AUTOINCREMENT,
  'path_audio' varchar(50) NOT NULL,
  'path_video' varchar(50) DEFAULT NULL,
  'titolo' varchar(50) DEFAULT NULL,
  'artista' varchar(50) DEFAULT NULL,
  'data' year(4) DEFAULT NULL,
  'velocita' float NOT NULL,
  'equalizzazione' varchar(10) NOT NULL,
  'video' tinyint(1) NOT NULL
);

--
-- Dump dei dati per la tabella `phi_tape`
--

INSERT INTO 'phi_tape' ('path_audio', 'path_video', 'titolo', 'artista', 'data', 'velocita', 'equalizzazione', 'video') VALUES
('audio/BERIO001.mp3', 'video/BERIO001.mp4', 'Tape 001', 'Luciano Berio', 1960, '15.0', 'ccir', 1),
('audio/BERIO002.mp3', 'video/BERIO002.webm', 'Tape 002', 'Luciano Berio', 1961, '7.5', 'ccir', 1),
('audio/BERIO003.mp3', 'video/BERIO003.mp4', 'Tape 003', 'Luciano Berio', 1962, '7.5', 'ccir', 1),
('audio/BERIO004.mp3', 'video/BERIO004.webm', 'Tape 004', 'Luciano Berio', 1963, '15.0', 'ccir', 1),
('audio/BERIO005.mp3', 'video/BERIO005.mp4', 'Tape 005', 'Luciano Berio', 1964, '15.0', 'ccir', 1),
('audio/BERIO056.mp3', 'video/BERIO056.webm', 'Tape 056', 'Luciano Berio', 1970, '7.5', 'ccir', 1),
('audio/1.mp3', NULL, 'Nofrio e la finta americana', 'Giovanni De Rosalia', 1971, '15.0', 'ccir', 0),
('audio/trim_stereo-ramp.mp3', 'video/ramp_trim.mp4', 'With the Light Pen', 'Teresa Rampazzi', 1976, '7.5', 'ccir', 1);
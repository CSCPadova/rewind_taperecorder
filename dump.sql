CREATE TABLE `phi_tape` (
  `id_tape` int(10) UNSIGNED NOT NULL,
  `path_audio` varchar(50) NOT NULL,
  `path_video` varchar(50) DEFAULT NULL,
  `titolo` varchar(50) DEFAULT NULL,
  `artista` varchar(50) DEFAULT NULL,
  `data` year(4) DEFAULT NULL,
  `speed` decimal(10,1) NOT NULL,
  `eq` varchar(10) NOT NULL,
  `video` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `phi_tape`
--

INSERT INTO `phi_tape` (`id_tape`, `path_audio`, `path_video`, `titolo`, `artista`, `data`, `speed`, `eq`, `video`) VALUES
(0, 'audio/BERIO001', 'video/BERIO001', 'Tape 001', 'Luciano Berio', 1960, '15.0', 'flat', 1),
(1, 'audio/BERIO002', 'video/BERIO002', 'Tape 002', 'Luciano Berio', 1961, '7.5', 'flat', 1),
(2, 'audio/BERIO003', 'video/BERIO003', 'Tape 003', 'Luciano Berio', 1962, '7.5', 'flat', 1),
(3, 'audio/BERIO004', 'video/BERIO004', 'Tape 004', 'Luciano Berio', 1963, '15.0', 'flat', 1),
(4, 'audio/BERIO005', 'video/BERIO005', 'Tape 005', 'Luciano Berio', 1964, '15.0', 'flat', 1),
(6, 'audio/BERIO056', 'video/BERIO056', 'Tape 056', 'Luciano Berio', 1970, '7.5', 'flat', 1),
(7, 'audio/1', NULL, 'Nofrio e la finta americana', 'Giovanni De Rosalia', 1971, '15.0', 'flat', 0),
(8, 'audio/trim_stereo-ramp', 'video/ramp_trim', 'With the Light Pen', 'Teresa Rampazzi', 1976, '7.5', 'flat', 1);
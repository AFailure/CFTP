-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 16, 2025 at 03:52 AM
-- Server version: 5.7.24
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `positron_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(24) NOT NULL,
  `last_name` varchar(24) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` char(2) NOT NULL,
  `zipcode` mediumint(9) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `state`, `zipcode`, `password`) VALUES
(2, 'not', 'kevin', 'admin@failure.dev', '1234567890', '123 sunny side street', 'baltimore', 'MD', 12345, '$2y$10$XD2T1qMjAFFfjxY0f6dhIOAyRpkLw4XQhiy7QXUj.9e8BvWQs0SwC'),
(3, 'green', 'man', 'something@google.com', '1234567890', '5409 baller street', 'fredrick', 'MD', 12345, '$2y$10$uCNNQwSlL9NqcE/foGCvvenPOcS7K44fWgG1C0RUe.8NCZoBYvBGy'),
(4, 'blue', 'man', 'admin@google.com', '1234567890', '500r cbr', 'chevy chase', 'MD', 0, '$2y$10$kXdmIdHpfafT3bRrvgFP0utH/HapGwdBm3BE2s0PmMQ1hVYFymbAW'),
(5, 'red', 'man', 'redman@hotmail.com', '409840329', '48934 blue street', 'red', 'MD', 66000, '$2y$10$YIepDjms9YOUyuP5c/X8CuuhbhOCLP7ENkiwcdI0AOcwEXGHkruq.'),
(6, 'cyan', 'man', 'grincher@fbi.one', '2839482834', 'grincher street', 'grinchmas', 'MD', 99349, '$2y$10$wXbqVFiRzrRPLwbKiKLcM.hT9ykFv87.czGU0cPC37rteK/UjYzoO'),
(7, 'purple', 'man', 'yaaaaaaaaa@yahoo.xyz', '09823094', 'yayayaya blvd', 'portland', 'OR', 99349, '$2y$10$nXIBZjQ1sKWGTTJjuP.jyussSYU6pjTfjzQhii43SSXhuA58H3WKm'),
(8, 'uniden', 'r7', 'admin@unidenamerica.com', '39393939', 'nice jp', 'new york', 'NY', 82381, '$2y$10$mTO0SwPbQdgvM.UNUnFjUukc2QHoqDfardiW1P1g8muf1YdFmt8kq'),
(9, 'nick', 'coachy', 'yessir@nsa.gov', '9999999', 'ok lane', 'new york', 'NY', 34892, '$2y$10$MICB7qe0Wy0lUHnQkRAxru1iyjbgZopo7YRkVVZB/vcvFhYqzMW7S'),
(10, 'lino', 'romero', 'lino.romero@umd.edu', '2407582391', 'ok lane', 'hyattsville', 'MD', 20384, '$2y$10$iFTyOUAAF4W.9O5p4dDvweB6W5AUxNXnDGvAoO3AUKNnZXwA4pjNG'),
(11, 'albert', 'dueutens', 'albert@umbc.edu', '301843830', 'decatur street', 'hyattsville', 'MD', 20384, '$2y$10$pMzC9j0wWfXocZbnSm4MC..HgozbMVUv5CzRYvGS5bJhxMyQ3qFM2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

<?php
	$servername = "localhost";
	$username = "root";
	$password = "photoprints123";
	$db = "photoprints";
	// Create connection
	$conn = new mysqli($servername, $username, $password,$db);
	// Check connection
	if ($conn->connect_error) {
	    echo "DatabaseConnectionError";
	    die("Connection failed: " . $conn->connect_error);
	}
?>
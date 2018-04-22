<?php

include("vendor/autoload.php");

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version1X;

$version = new Version1X("http://10.16.19.131");
$client = new Client($version);
$client->initialize();
$client->emit("new_order", ["test"=>"test"]);
$client->close();

?>
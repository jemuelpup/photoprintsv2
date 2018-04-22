<?php

require $_SERVER['DOCUMENT_ROOT'].'/common/dbconnect.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
// $process = $request->process;
$data = $request->data;

login($conn,$data->username,$data->password);

// login("jemuel","123");

function startSession($employeeID,$position){
	session_start();
	$_SESSION["employeeID"] = $employeeID;
	$_SESSION["position"] = $position;
}

function login($c,$userName,$uPass){
	$sql = $c->prepare("SELECT e.position_fk, e.id FROM access_tbl a, employee_tbl e WHERE a.active=1 AND a.username=? AND a.password=? AND a.employee_id_fk = e.id");
	$sql->bind_param('ss',$userName, $uPass);
	if($sql->execute()){
		$res = $sql->get_result();
		$sesID = null;
		$position = null;
		if($res->num_rows>0){
			while($row = $res->fetch_assoc()){
				$sesID = $row["id"];
				$position = $row["position_fk"];
			}
		}
		startSession($sesID,$position);
		print_r(json_encode($_SESSION));
	}
	else{
		echo "Wrong username and password";
	}
}




?>
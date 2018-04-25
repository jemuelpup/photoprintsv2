<?php

session_start();
require $_SERVER['DOCUMENT_ROOT'].'/common/dbconnect.php';
include $_SERVER['DOCUMENT_ROOT'].'/common/commonFunctions.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$process = $request->process;
$data = $request->data;

switch($process){
	case "addOrder":{
		insertOrder($conn,$data);
	}break;
	case "orderPaid":{
		updateOrder($conn,$data);
	}break;
	case "getID":{
		getSessionId($conn,$data);
	}break;
	case "getAccessPosition":{
		getAccessPosition($conn,$data);
	}break;
	case "VoidOrder":{
		voidOrder($conn,$data);
	}break;
	case "Logout":{
		session_destroy(); // php code
	}break;
}


//sql injection safe

function voidOrder($c,$d){
	$sql = $c->prepare("UPDATE order_tbl SET void_fk = ?,void_reason=?, cashier_fk = ? WHERE id = ?");
	$sql->bind_param('isii', $_SESSION["employeeID"], validateData($d->reason), $_SESSION["employeeID"], validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Voiding order paid success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
	echo $msg;
}

function updateOrder($c,$d){
	$sql = $c->prepare("UPDATE order_tbl SET cashier_fk = ? ,payment = ?,received_date = NOW() WHERE id = ?");
	$sql->bind_param('idi', $_SESSION["employeeID"], validateData($d->cash), validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Setting order paid success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
	echo $msg;
}
//sql injection safe
function insertOrder($c,$d){
	$operator = $_SESSION["employeeID"];
	$sql = $c->prepare("INSERT INTO order_tbl (order_date,cashier_fk,branch_fk,operator_fk,total_amount,customer_name,down_payment,notes) VALUES (NOW(),?,?,?,?,?,?,?)");

	$sql->bind_param('iiidsds',validateData($d->cashier_fk), validateData($d->branch_fk), $operator, validateData($d->total_amount), validateData($d->customer_name),validateData($d->down_payment),validateData($d->notes));

	if ($sql->execute()) {
		$order_id = mysqli_insert_id($c);
		foreach ($d->items as $item) {
			$sql2 = $c->prepare("INSERT INTO order_line_tbl (order_id_fk,item_id_fk,name,code,quantity,price,discount) VALUES (?,?,?,?,?,?,?)");
			$sql2->bind_param('iissidd',$order_id,validateData($item->itemID),validateData($item->itemName),validateData($item->code),validateData($item->quantity),validateData($item->price),validateData($item->discount));
			$sql2->execute();
		}
		header("Content-type:application/json");
		echo json_encode(["orderID" => $order_id ]);
	}
	$sql->close();
}

function getSessionId(){
	$id = isset($_SESSION["employeeID"]) ? $_SESSION["employeeID"] : 0;
	echo $id;
}

function getAccessPosition(){
	$accessPosition = isset($_SESSION["position"]) ? $_SESSION["position"] : 0;
	echo $accessPosition;
}

?>
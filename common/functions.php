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
	case "EditMaterialAddStock":{
		updateMaterialAddStock($conn,$data);
	}break;
}
function updateMaterialAddStock($c,$d){
	$addedQty = $d->addedQuantity;
	$sql = $c->prepare("UPDATE material_tbl SET quantity=quantity+? WHERE id=?");
	$sql->bind_param('di',validateData($d->addedQuantity),validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Adding new Material affected on product success" : "Error: " . $sql . "<br>" . $c->error;
	$sql = $c->prepare("INSERT INTO `logs_tbl`(event_desc, employee_id_fk) SELECT CONCAT('Add ".$d->addedQuantity." stock to ',name,' material'),".$_SESSION["employeeID"]." FROM material_tbl WHERE id = ".$d->id);
	$sql->execute();
	$sql->close();
}

// updateInventory($conn,13);// delete this
function updateInventory($c,$orderID){
	$sql = "SELECT ol.item_id_fk,(SUM(ol.quantity*il.material_quantity_needed)) as material_used, il.material_id_fk FROM order_line_tbl ol, item_line_tbl il WHERE il.item_id_fk = ol.item_id_fk AND ol.order_id_fk = $orderID AND il.active = 1 GROUP BY material_id_fk" ;
	if(hasRows($c,$sql)){
		$orderedMaterials = selectQuery($c,$sql);
		$multiUpdateQuery = "";
		if(count($orderedMaterials)){
			foreach ($orderedMaterials as $orderedMaterial) { $multiUpdateQuery .= "WHEN (id=".$orderedMaterial['material_id_fk'].") THEN ".$orderedMaterial['material_used']." "; }
			$materialUpdateQuery = "UPDATE material_tbl SET quantity = quantity - ( CASE ".$multiUpdateQuery." ELSE 0 END )";
			// echo $materialUpdateQuery;
			$sql = $c->prepare($materialUpdateQuery);
			$sql->execute();
			$sql->close();
		}
	}
}
//sql injection safe
function insertOrder($c,$d){
	$operator = $_SESSION["employeeID"];
	$order_id = null;
	$sql = $c->prepare("INSERT INTO order_tbl (order_date,cashier_fk,branch_fk,operator_fk,total_amount,customer_name,down_payment,notes) VALUES (NOW(),?,?,?,?,?,?,?)");
	$sql->bind_param('iiidsds',validateData($d->cashier_fk), validateData($d->branch_fk), $operator, validateData($d->total_amount), validateData($d->customer_name),validateData($d->down_payment),validateData($d->notes));
	if ($sql->execute()) {
		$order_id = mysqli_insert_id($c);
		foreach ($d->items as $item) {
			$sql2 = $c->prepare("INSERT INTO order_line_tbl (order_id_fk,item_id_fk,name,code,quantity,price,discount) VALUES (?,?,?,?,?,?,?)");
			$sql2->bind_param('iissidd',$order_id,validateData($item->itemID),validateData($item->itemName),validateData($item->code),validateData($item->quantity),validateData($item->price),validateData($item->discount));
			$sql2->execute();
		}
		// header("Content-type:application/json");
		print_r(json_encode(["orderID" => $order_id ]));
	}
	updateInventory($c,$order_id);
	$sql->close();
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
function getSessionId(){
	$id = isset($_SESSION["employeeID"]) ? $_SESSION["employeeID"] : 0;
	echo $id;
}
function getAccessPosition(){
	$accessPosition = isset($_SESSION["position"]) ? $_SESSION["position"] : 0;
	echo $accessPosition;
}
?>
<?php
/* This file contains the elements for viewing */

require $_SERVER['DOCUMENT_ROOT'].'/common/dbconnect.php';
// 

$process="";

if(isset($_POST['process'])){
	$process = $_POST['process'];
}
else{
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$process = $request->process;
	$data = $request->data;
}

switch($process){
	case "getItems":{
		selectItem($conn);
	}break;
	case "getItemCategory":{
		selectItemCategory($conn);
	}break;
	case "getBranches":{
		selectBranch($conn);
	}break;
	case "getPositions":{
		selectPosition($conn);
	}break;
	case "getEmployees":{
		selectEmployee($conn);
	}break;
	case "getTotalSales":{
		getTotalSalesOn($conn,$data);
	}break;
	case "getTransationsData":{
		getTransationsDataOn($conn,$data);
	}break;
	case "getVoidTransactionsOn":{
		getVoidTransactionsOn($conn,$data);
	}break;
	
}

/*
	QUERY AREA
*/

// selectItemCategory($conn);
function selectItemCategory($c){
	$sql = "SELECT id,name,category_code,description FROM category_tbl WHERE active = 1";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}

/* This function needs some edit*/
function selectItem($c){
	$sql = "SELECT id,name,item_code,category_fk,date_modified,price FROM item_tbl WHERE active = 1";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}

function selectBranch($c){
	$sql = "SELECT id,name,address,description,branch_code FROM branch_tbl";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}

function selectPosition($c){
	// $sql = "SELECT id,name,description FROM position_tbl WHERE id != 3 AND active = 1"; // this code is for excepting the admin
	 $sql = "SELECT id,name,description FROM position_tbl WHERE active = 1";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}

function selectEmployee($c){
	$sql = "SELECT e.id,e.name,e.address,e.contact_number,e.email,p.name as position_name,b.name as branch_name,e.salary,e.date_modified,e.active,e.birth_day,e.gender,e.position_fk,e.branch_fk FROM employee_tbl e,position_tbl p,branch_tbl b WHERE p.id = e.position_fk AND e.branch_fk=b.id AND e.active=1";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}

function getTotalSalesOn($c,$data){
	print_r(getTotalSales($c,$data));
}
function getTotalSales($c,$data){
	// echo $date;
	// $from = substr($data->from,0,10);
	// $to = substr($data->to,0,10);
	// return "$from, $to";
	$sql = "SELECT SUM(total_amount) as totalSales FROM `order_tbl` WHERE void_fk = 0 AND received_date BETWEEN '".substr($data->from,0,10)."' AND '".substr($data->to,0,10)."' AND received_date IS NOT NULL";
	// echo "$sql";
	$totalSales = selectQuery($c,$sql)[0]["totalSales"];
	return $totalSales ? $totalSales : 0;
}
function getTransationsDataOn($c,$data){

	$sql = "SELECT o.id, o.order_date, (SELECT name FROM employee_tbl WHERE id = o.cashier_fk) as cashier_name, o.cashier_fk, b.name as branch_name, o.branch_fk, (SELECT name FROM employee_tbl WHERE id = o.operator_fk) as operator_name, o.operator_fk, o.void_fk, o.total_amount, o.customer_name, o.payment, o.down_payment, o.received_date, o.notes FROM order_tbl o , branch_tbl b WHERE o.void_fk = 0 AND b.id = o.branch_fk AND o.received_date BETWEEN '".substr($data->from,0,10)."' AND '".substr($data->to,0,10)."'";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}
function getVoidTransactionsOn($c,$data){
	$sql = "SELECT o.id, o.order_date, (SELECT name FROM employee_tbl WHERE id = o.cashier_fk) as cashier_name, o.cashier_fk, b.name as branch_name, o.branch_fk, (SELECT name FROM employee_tbl WHERE id = o.operator_fk) as operator_name, o.operator_fk, o.void_fk, o.total_amount, o.customer_name, o.payment, o.down_payment, o.received_date, o.notes,o.void_reason FROM order_tbl o , branch_tbl b WHERE o.void_fk != 0 AND b.id = o.branch_fk AND o.order_date BETWEEN '".substr($data->from,0,10)."' AND '".substr($data->to,0,10)."'";
	// echo "$sql";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}


/*
	FUNCTIONS AREA
*/
// get the rows of the query
function selectQuery($c,$sql){
	$resultSetArray = [];
	$res = $c->query($sql);
	if($res->num_rows>0){
		while($row = $res->fetch_assoc()){
			array_push($resultSetArray,$row);
		}
		return $resultSetArray;
	}
	return "";
}
// check if query produces output
function hasRows($c,$sql){
	$res = $c->query($sql);
	if($res->num_rows>0){
		return true;
	}
	return false;
}

?>

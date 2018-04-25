<?php
	
require $_SERVER['DOCUMENT_ROOT'].'/common/dbconnect.php';
include $_SERVER['DOCUMENT_ROOT'].'/common/commonFunctions.php';


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$process = $request->process;
session_start();

switch($process){
	case "getItems":{
		selectItem($conn);
	}break;
	case "getCategories":{
		selectCategory($conn);
	}break;
	case "getCategoriesAndItems":{
		selectCategoriesAndItems($conn);
	}break;
	case "getUnclaimedOrders":{
		 selectUnclaimedOrders($conn);
	}break;
	case "getTotalSales":{
		getTotalSalesOn($conn,$data);
	}break;
	case "getTransationsData":{
		getTransationsDataOn($conn,$data);
	}break;
	case "getEmployeeData":{
		selectEmployeeData($conn);
	}
}/**/
// common function
function getTotalSalesOn($c,$data){
	print_r(getTotalSales($c,substr($data,0,10)));
}

function selectEmployeeData($c){
	$sql = "SELECT id, name, address, contact_number, email, position_fk, branch_fk, salary, date_modified, modified_by_fk, active, birth_day, gender FROM employee_tbl WHERE id=".$_SESSION["employeeID"];
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}


// selectUnclaimedOrders($conn);

/* This function needs some edit*/
function selectItem($c){
	$sql = "SELECT id,name,item_code,category_fk,date_modified,price FROM item_tbl";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}
function selectCategory($c){
	$sql = "SELECT id,name FROM `category_tbl` WHERE 1";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}
function selectCategoriesAndItems($c){
	$sql = "SELECT i.id, i.name, i.item_code, i.category_fk, i.price, c.name as category_name FROM item_tbl i, category_tbl c WHERE i.active = 1 AND i.category_fk = c.id ORDER BY category_fk,id";
	print_r(hasRows($c,$sql) ? json_encode(selectQuery($c,$sql)) : "");
}
function selectUnclaimedOrders($c){
	$sql = "SELECT o.id, o.order_date, o.cashier_fk, o.branch_fk, o.operator_fk, (SELECT name FROM employee_tbl WHERE id = o.operator_fk) as operatorName, o.void_fk, o.total_amount, o.customer_name, o.payment, o.received_date, o.down_payment, o.notes, ol.order_id_fk, ol.item_id_fk, ol.name, ol.code, ol.quantity, ol.price, ol.discount FROM order_line_tbl ol, order_tbl o WHERE o.void_fk = 0 AND ol.order_id_fk = o.id AND o.received_date IS NULL";


	$orders = array();
	$orderLine = array();
	$id = 0;

	$res = $c->query($sql);
	if($res->num_rows>0){
		// generate data here
		$row = $res->fetch_assoc();

		$previd = $row['id'];
		$prevOperatorName = $row['operatorName'];
		$prevorder_date = $row['order_date'];
		$prevcashier_fk = $row['cashier_fk'];
		$prevbranch_fk = $row['branch_fk'];
		$prevoperator_fk = $row['operator_fk'];
		$prevvoid_fk = $row['void_fk'];
		$prevtotal_amount = $row['total_amount'];
		$prevcustomer_name = $row['customer_name'];
		$prevpayment = $row['payment'];
		$prevdownpayment = $row['down_payment'];
		$prevreceived_date = $row['received_date'];
		$prevNotes = $row['notes'];

		array_push($orderLine,$row);
		//item -> orderline -> orders
		while($row = $res->fetch_assoc()){
			//echo $previd."==".$row['id'];
			if($previd==$row['id']){
				//echo "Pareho.<br>";
				// add item to orderline
				array_push($orderLine,$row);
			}
			else{
				//echo "iba.<br>";
				//add orderline to orders
				array_push($orders,array('id'=>$previd,
										'order_date'=>$prevorder_date,
										'cashier_fk'=>$prevcashier_fk,
										'branch_fk'=>$prevbranch_fk,
										'operator_fk'=>$prevoperator_fk,
										'operator_name'=>$prevOperatorName,
										'void_fk'=>$prevvoid_fk,
										'total_amount'=>$prevtotal_amount,
										'customer_name'=>$prevcustomer_name,
										'payment'=>$prevpayment,
										'down_payment'=>$prevdownpayment,
										'received_date'=>$prevreceived_date,
										'notes'=>$prevNotes,
										'order_line'=>$orderLine));
				$orderLine = array();
				array_push($orderLine,$row);
				$previd = $row['id'];
				$prevorder_date = $row['order_date'];
				$prevcashier_fk = $row['cashier_fk'];
				$prevbranch_fk = $row['branch_fk'];
				$prevoperator_fk = $row['operator_fk'];
				$prevOperatorName = $row['operatorName'];
				$prevvoid_fk = $row['void_fk'];
				$prevtotal_amount = $row['total_amount'];
				$prevcustomer_name = $row['customer_name'];
				$prevpayment = $row['payment'];
				$prevdownpayment = $row['down_payment'];
				$prevreceived_date = $row['received_date'];
				$prevNotes = $row['notes'];
			}
		}
		array_push($orders,array('id'=>$previd,
										'order_date'=>$prevorder_date,
										'cashier_fk'=>$prevcashier_fk,
										'branch_fk'=>$prevbranch_fk,
										'operator_fk'=>$prevoperator_fk,
										'operator_name'=>$prevOperatorName,
										'void_fk'=>$prevvoid_fk,
										'total_amount'=>$prevtotal_amount,
										'customer_name'=>$prevcustomer_name,
										'payment'=>$prevpayment,
										'down_payment'=>$prevdownpayment,
										'received_date'=>$prevreceived_date,
										'notes'=>$prevNotes,
										'order_line'=>$orderLine));

		
		print_r(json_encode($orders));
	}
}

?>
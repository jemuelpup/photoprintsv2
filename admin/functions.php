<?php
require $_SERVER['DOCUMENT_ROOT'].'/common/dbconnect.php';
session_start();
$process="";
$data = "";

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
	case "Logout":{
		session_destroy(); // php code
	}
	case "AddCategory": {
		insertCategory($conn,$data);
	}break;
	case "AddItem":{
		insertItem($conn,$data);
	}break;
	case "AddPosition":{
		insertPosition($conn,$data);
	}break;
	case "AddBranch":{
		insertBranch($conn,$data);
	}break;
	case "AddEmployee": {
		insertEmployee($conn,$data);
	}break;
	case "AddAccess": {
		insertAccess($conn,$data);
	}break;
	case "EditEmployee": {
		updateEmployee($conn,$data);
	}break;
	case "EditCategory": {
		updateCategory($conn,$data);
	}break;
	case "EditItem": {
		updateItem($conn,$data);
	}break;
	case "EditBranch": {
		updateBranch($conn,$data);
	}break;
	case "EditPosition": {
		updatePosition($conn,$data);
	}break;
	case "RemoveEmployee":{
		deleteEmployee($conn,$data);
	}break;
	case "RemoveItem":{
		deleteItem($conn,$data);
	}break;
	case "RemoveCategory":{
		deleteCategory($conn,$data);
	}break;
	case "AddMaterial":{
		insertMaterial($conn,$data);
	}break;
	case "EditMaterial":{
		updateMaterial($conn,$data);
	}break;
}


/****************************************************************************
	Database operations
*/
/* INSERT */
function insertCategory($c,$d){
	$sql = $c->prepare("INSERT INTO category_tbl (name,category_code,description) VALUES (?,?,?)");
	$sql->bind_param('sss',$d->name,$d->category_code,$d->description);
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function insertItem($c,$d){
	$sql = $c->prepare("INSERT INTO item_tbl (name,item_code,category_fk,modified_by_fk,price) VALUES (?,?,?,?,?)");
	$sql->bind_param('ssiid',$d->name,$d->code,$d->category,$_SESSION["employeeID"],$d->price);
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function insertPosition($c,$d){
	$sql = $c->prepare("INSERT INTO position_tbl (name,description) VALUES (?,?)");
	$sql->bind_param('ss',$d->name,$d->description);
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function insertBranch($c,$d){
	$sql = $c->prepare("INSERT INTO branch_tbl (name,address,description,branch_code) VALUES (?,?,?,?)");
	$sql->bind_param('ssss',$d->name,$d->address,$d->description,$d->branch_code);
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function insertEmployee($c,$d){
	$sql = $c->prepare("INSERT INTO employee_tbl (name,address,contact_number,email,position_fk,branch_fk,salary,birth_day,gender) VALUES (?,?,?,?,?,?,?,?,?)");
	$sql->bind_param('ssssiidsi',validateData($d->name),validateData($d->address),validateData($d->contact_number),validateData($d->email),validateData($d->position_fk),validateData($d->branch_fk),validateData($d->salary),validateDate($d->birth_day),validateData($d->gender));
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function insertAccess($c,$d){
	$sql = $c->prepare("INSERT INTO access_tbl (employee_id_fk,username,password) VALUES (?,?,?) ON DUPLICATE KEY UPDATE username=?,password=?");
	$sql->bind_param('issss',validateData($d->id),validateData($d->username),validateData($d->password),validateData($d->username),validateData($d->password));
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function insertMaterial($c,$d){
	$sql = $c->prepare("INSERT INTO material_tbl(name,description,quantity)VALUES(?,?,?)");
	$sql->bind_param('ssd',$d->name,$d->description,$d->quantity);
	$msg = ($sql->execute() === TRUE) ? "Adding new Material success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

/* UPDATE */
function updateEmployee($c,$d){
	$sql = $c->prepare("UPDATE employee_tbl SET name = ? ,address = ? ,contact_number = ? ,email = ? ,position_fk = ?,branch_fk = ?,salary = ?,birth_day = ? ,gender = ? WHERE id = ?");
	$sql->bind_param('ssssiidsii',validateData($d->name),validateData($d->address),validateData($d->contact_number),validateData($d->email),validateData($d->position_fk),validateData($d->branch_fk),validateData($d->salary),validateDate($d->birth_day),validateData($d->gender),validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function updateCategory($c,$d){
	$sql = $c->prepare("UPDATE category_tbl SET name = ? ,category_code = ? ,description = ?  WHERE id = ?");
	$sql->bind_param('sssi',validateData($d->name),validateData($d->category_code),validateData($d->description),validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function updateBranch($c,$d){
	// print_r($d);
	// if(0){
	$sql = $c->prepare("UPDATE branch_tbl SET name = ?,address = ?,description = ?,branch_code = ?,modified_by_fk = ? WHERE id = ?");
	$sql->bind_param('ssssii',validateData($d->name),validateData($d->address),validateData($d->description),validateData($d->branch_code),$_SESSION["employeeID"],validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Updating branch success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
	// }
}
function updateItem($c,$d){
	$sql = $c->prepare("UPDATE item_tbl SET name = ? ,item_code = ? ,category_fk = ?,price = ? WHERE id = ?");
	$sql->bind_param('ssidi',validateData($d->name),validateData($d->item_code),validateData($d->category_fk),validateData($d->price),validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function updatePosition($c,$d){
	$sql = $c->prepare("UPDATE position_tbl SET name = ?,description = ? WHERE id = ?");
	$sql->bind_param('ssi',validateData($d->name),validateData($d->description),validateData($d->id));
	$msg = ($sql->execute() === TRUE) ? "Updating position success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function updateMaterial($c,$d){
	$sql = $c->prepare("UPDATE material_tbl SET name = ?, description = ?, quantity = ? WHERE id=?"); 
	$sql->bind_param('ssdi',$d->name,$d->description,$d->quantity,$d->id);
	$msg = ($sql->execute() === TRUE) ? "Updating material success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

/* DELETE */
function deleteCategory($c,$d){
	echo "UPDATE category_tbl SET date_modified = NOW(),modified_by_fk = ".$_SESSION["employeeID"].",active = 0 WHERE id = ".$d->id;
	$sql = $c->prepare("UPDATE category_tbl SET date_modified = NOW(),modified_by_fk = ?,active = 0 WHERE id = ?");
	$sql->bind_param('ii',$_SESSION["employeeID"],$d->id);
	$msg = ($sql->execute() === TRUE) ? "deleting Category success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}
function deleteItem($c,$d){
	$id = $d->id;
	$sql = $c->prepare("UPDATE item_tbl SET date_modified = NOW(),modified_by_fk = ?, active = 0 WHERE id = ?");
	$sql->bind_param('ii',$_SESSION["employeeID"],$d->id);
	$msg = ($sql->execute() === TRUE) ? "deleting item success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

function deleteEmployee($c,$d){
	$id = $d->id;
	$sql = $c->prepare("UPDATE employee_tbl SET date_modified=NOW(), modified_by_fk = ?, active = 0 WHERE id = ?");
	$sql->bind_param('ii',$_SESSION["employeeID"],$d->id);
	$msg = ($sql->execute() === TRUE) ? "Deleting employee success" : "Error: " . $sql . "<br>" . $c->error;
	$sql->close();
}

/**************************************************************************/

function validateData($d){
	if(isset($d)){
		return $d;
	}
	return "";
}
function validateDate($d){
	if(isset($d)){
		return date("Y-m-d", strtotime(str_replace('/', '-',$d)));
	}
	return "0000-00-00";
}



/*
@param
$d - serialize array value from jquery
$name - name of the field
*/
function getFieldValue($d,$name){
	foreach($d as $data){
		if($data["name"]==$name){
			return $data["value"];
		}
	}
}
// function getFieldValue2($d,$name){
// 	foreach($d as $data){
// 		if($data["name"]==$name){
// 			return $data["value"];
// 		}
// 	}
// }

?>


<?php


// for testing purposes only
$query = "CREATE TABLE IF NOT EXISTS `employee_tbl` (
  `name` varchar(100) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `position_fk` int(11) DEFAULT NULL,
  `branch_fk` int(11) DEFAULT NULL,
  `salary` decimal(11,2) NOT NULL,
  `birth_day` date DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
		";



$query = $_POST["createQuery"];



$formattedQuery = formatStringForCodeGeneration($query);
$jsonObject = json_decode(formatData($formattedQuery));


// print_r($jsonObject);
// echo "<br><br><br>".addFunctionCall("getFieldValue",createUpdateQueriesStoredProcedure($jsonObject));



// if(0)
echo "
{	\"htmlForms\":\"".createHTMLForms($jsonObject)."\",
	\"insertQuery\":\"".addFunctionCall("getFieldValue",createInsertQueries($jsonObject))."\",
	\"updateQuery\":\"".addFunctionCall("getFieldValue",createUpdateQueries($jsonObject))."\",
	\"updateQueryStoredProcedure\":\"".addFunctionCall("getFieldValue",createUpdateQueriesStoredProcedure($jsonObject))."\",
	\"selectQuery\":\"".createSelectQueries($jsonObject)."\",
	\"dataTable\":\"".createDynamicDataTable($jsonObject)."\",
	\"viewDataTableFunc\":\"".createPHPselect($jsonObject)."\",
	\"viewHTMLModalUpdate\":\"".createModalViewForEditting($jsonObject)."\"
}
";

// $x = str_replace(">","&gt;",$x);
// $x = str_replace("<","&lt;",$x);
// echo $x;


/*********************************************************************************************************
* Output customization functions *************************************************************************
* Output formatter here
*********************************************************************************************************/
function addFunctionCall($fc,$str){
	return preg_replace('/\$(\w*)/', ("validateData(\$d->$1)"), $str);
}

/********************************************************************************************************/

/*********************************************************************************************************
* PHP CODE Area **********************************************************************************
* This is the area where all the PHP code are generated
*********************************************************************************************************/
// echo createPHPselect($jsonObject);
function createPHPselect($jsonObject){

	$functionName = "functionName";

	$tdCode = "";
	$selectStatement = createSelectQueries($jsonObject);

	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			$tdCode .= "\\n<td name='$key->columnName'>\\\".\$row[\\\"$key->columnName\\\"].\\\"</td>";
		}
	}
	$rowCode = "\\\"<tr data-id='\\\".\$row[\\\"id\\\"].\\\"'>$tdCode</tr>\\\"";
	return "/* This function needs some edit*/\\nfunction $functionName(\$c){\\n\$sql = \\\"$selectStatement\\\";\\n\$code = \\\"\\\";\\n\$res = \$c->query(\$sql);\\nif(\$res->num_rows>0){\\nwhile(\$row = \$res->fetch_assoc()){\\n\$code.=$rowCode;\\n}\\n}\\necho \$code;\\n}";
}


/*********************************************************************************************************
* Database process Area **********************************************************************************
* This is the area where all the queries are generated
*********************************************************************************************************/
function createSelectQueries($jsonObject){
	$tableName = "";
	$fields = "";
	$values = "";
	
	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			$fields .= $key->columnName.",";
		}
	}
	$fields = substr($fields, 0, -1);
	$sql = "SELECT $fields FROM $tableName";
	return "$sql";
}
function createInsertQueries($jsonObject){
	$tableName = "";
	$fields = "";
	$values = "";
	
	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			$fields .= $key->columnName.",";
			if ($key->dataType == "str"||$key->dataType == "date") {	$values .= "'$".$key->columnName."',";	}
			elseif($key->dataType == "num" or $key->dataType == "dec") {	$values .= "$".$key->columnName.",";	};
		}
	}
	$fields = "(".substr($fields, 0, -1).")";
	$values = "(".substr($values, 0, -1).")";
	$sql = "INSERT INTO $tableName $fields VALUES $values";
	return "$sql";
}

function createUpdateQueries($jsonObject){
	$tableName = "";
	$updateVal = "";
	
	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			if ($key->dataType == "str") {	$updateVal .= "$key->columnName = '$$key->columnName',";	}
			elseif($key->dataType == "num" or $key->dataType == "dec") {	$updateVal .= "$key->columnName = $$key->columnName,";	};
		}
	}
	$updateVal = substr($updateVal, 0, -1);
	$sql = "UPDATE $tableName SET $updateVal";
	return "$sql";
}


function createUpdateQueriesStoredProcedure($jsonObject){
	$tableName = "";
	$updateVal = "";
	$bindParameters = "";
	$bindValues = "";
	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			// echo $key->dataType;
			$updateVal .= "$key->columnName = ?,";
			$bindValues .= ",$$key->columnName";
			if ($key->dataType == "str" or $key->dataType == "date") {
				$bindParameters .= "s";
			}
			elseif($key->dataType == "num") {
				$bindParameters .= "i";
			}
			elseif($key->dataType == "dec") {
				$bindParameters .= "d";
			}
		}
	}
	$updateVal = substr($updateVal, 0, -1);
	$sql = "(UPDATE $tableName SET $updateVal);('$bindParameters'$bindValues);";
	return "$sql";
}

 // $sql = $c->prepare("UPDATE item_tbl SET name = ? ,item_code = ? ,category_fk = ?,price = ? WHERE id = ?");
// 	$sql->bind_param('ssidi',validateData($d->name),validateData($d->item_code),validateData($d->category_fk),validateData($d->price),validateData($d->id));
// 	$msg = ($sql->execute() === TRUE) ? "Adding new Category success" : "Error: " . $sql . "<br>" . $c->error;




/*********************************************************************************************************
* UI/UX Development Area **********************************************************************************
* This is the area where all the forms and usefull code in user view is found
* Note: some code here can be copy paste in your page
*********************************************************************************************************/

function createHTMLForms($jsonObject){
	foreach($jsonObject as $object){
		//	echo $object->tableName;
		$code = "";
		foreach($object->data as $jsonData){
			$inputType = "text";
			if($jsonData->dataType=="num" or $jsonData->dataType=="dec"){
				$inputType = "number";
			}
			// $code .= "<div class='input-field col s12'><input placeholder='' name='$jsonData->columnName' value='$jsonData->defaultVal' type='$inputType' class='validate' maxlength='$jsonData->length' $jsonData->attribute/><label for='$jsonData->columnName'>$jsonData->columnName</label></div>";
			$code .= "<div class='input-field col s12'><input ng-model='angularSerialCode.$jsonData->columnName' value='$jsonData->defaultVal' type='$inputType' class='validate' maxlength='$jsonData->length' $jsonData->attribute/><label for='$jsonData->columnName'>$jsonData->columnName</label></div>";
		}
		return $code;
	}
}

function createDynamicDataTable($jsonObject){
	$th = "";
	$td = "";
	foreach($jsonObject as $object){
		$code = "";
		foreach($object->data as $jsonData){
			$th .= "<th>$jsonData->columnName</th>";
			$td .= "<td name='$jsonData->columnName'>{{x.$jsonData->columnName}}</td>";
		}
	}
	$th = "<tr>$th</tr>";
	$td = "<tr ng-repeat='x in scopeArray' data-id='{{x.id}}'>$td</tr>";
	return "<table>$th$td$td$td</table>";
}

function createModalViewForEditting($jsonObject){
	$modalBody = createHTMLForms($jsonObject);
	return "<div id='id-name-here' class='modal class-name-here'><form action='#'><div class='modal-content'><h2>Update name here</h2>$modalBody</div><div class='modal-footer'><button class='waves-effect waves-light btn' type='submit'>Update</button></div></form></div>";
}








/*********************************************************************************************************
* Data Processing Area ***********************************************************************************
* This is the area where all the needed data to be processed was prepared
*********************************************************************************************************/

/*******************************************************************
This function returns an array of needed data in input field
return: JSON data (tableName, data)
Data contains contents:
	columnName-colName
	dataType-dataType // str or num
	attribute-attribute
	length-maxLength
*******************************************************************/
function formatData($formattedQuery){
	$start = 0;
	$state1 = 1;
	$state2 = 2;
	$state3 = 3;
	$state4 = 4;
	$state5 = 5;
	$state6 = 6;
	$state7 = 7;
	$state8 = 8;
	$state9 = 9;
	$state10 = 10;
	$state11 = 11;
	$state12 = 12;
	$stateEnd = 999;
	$state = $start;

	$tableName = "";
	$colName = "";
	$dataType = "";
	$attribute = "";
	$maxLength = "";
	$colNameAndType = [];
	$dataJSON = "";
	$defaultVal = "";
	
	foreach($formattedQuery as $queryWord){
		switch ($state) {
			case $start:{
				if($queryWord=='CREATE'){
					$state = $state1;
				}
				else{
					$state = $stateEnd;
				}
			}break;
			case $state1:{
				if($queryWord=='TABLE'){
					$state = $state2;
				}
				else{
					$state = $stateEnd;
				}
			}break;
			case $state2:{// check the opening parenthesis and get the tableName
				if($queryWord=='('){
					$state = $state3;
				}
				else{
					$state = $state2;
					$tableName = $queryWord;
				}
			}break;
			case $state3:{ // the column name
				$colName = "";
				$dataType = "";
				$attribute = "";
				$maxLength = "";
				$defaultVal = '';
				$colName = $queryWord;
				$state = $state4;
			}break;
			case $state4:{ // the data type
				if(
					strtolower($queryWord)==strtolower("INT") or
					strtolower($queryWord)==strtolower("SMALLINT") or
					strtolower($queryWord)==strtolower("TINYINT") or
					strtolower($queryWord)==strtolower("MEDIUMINT") or
					strtolower($queryWord)==strtolower("BIGINT") or
					strtolower($queryWord)==strtolower("BIT")
					
				){
					$dataType = "num";
				}
				elseif(
					strtolower($queryWord)==strtolower("FLOAT") or
					strtolower($queryWord)==strtolower("DOUBLE") or
					strtolower($queryWord)==strtolower("DECIMAL")
				){
					$dataType = "dec";
				}
				elseif(
					strtolower($queryWord)==strtolower("time") or
					strtolower($queryWord)==strtolower("date") or
					strtolower($queryWord)==strtolower("smalldatetime") or
					strtolower($queryWord)==strtolower("datetime") or
					strtolower($queryWord)==strtolower("datetime2") or
					strtolower($queryWord)==strtolower("datetimeoffset") 
				){
					$dataType = "date";
				}
				else{
					$dataType = "str";
				}
				$state = $state5;
			}break;
			case $state5:{ // for checking if the datatype has attribute
				if($queryWord=='('){
					$state = $state6;
				}
				elseif($queryWord=='NOT'){
					$state = $state9;
				}
				elseif($queryWord=='DEFAULT'){
					$state = $state12;
				}
				elseif($queryWord==','){
					$state = $state3;
					array_push($colNameAndType,array("columnName"=>$colName,"dataType"=>$dataType,"attribute"=>$attribute,"length"=>$maxLength,"defaultVal"=>$defaultVal));
				}
				else{ $state = $state8; }
			}break;
			case $state6:{ // This is the maximum numbers of character of the string
				$maxLength = $queryWord;
				$state = $state7;
			}break;
			case $state7:{ if($queryWord==')'){ $state = $state8; } else{ $state = $state10; } }break;
			case $state8:{
				if($queryWord=='NOT'){ $state = $state9; }
				elseif($queryWord=='DEFAULT'){ $state = $state11; }
				elseif($queryWord==','){
					$state = $state3;
					array_push($colNameAndType,array("columnName"=>$colName,"dataType"=>$dataType,"attribute"=>$attribute,"length"=>$maxLength,"defaultVal"=>$defaultVal));
				}
				else{ $state = $state3; }
			}break;
			case $state9:{
				if($queryWord=='NULL'){
					$state = $state10;
					$attribute="required";
				}
				else{ $state = $state10; }
			}break;
			case $state10:{
				if($queryWord==','){
					$state = $state3;
					array_push($colNameAndType,array("columnName"=>$colName,"dataType"=>$dataType,"attribute"=>$attribute,"length"=>$maxLength,"defaultVal"=>$defaultVal));
				}
				elseif($queryWord==')'){
					$state = $stateEnd;
					array_push($colNameAndType,array("columnName"=>$colName,"dataType"=>$dataType,"attribute"=>$attribute,"length"=>$maxLength,"defaultVal"=>$defaultVal));
				}
				elseif($queryWord=="DEFAULT"){
					$state = $state12;
				}
				else{
					$state = $state10;
				}
			}break;
			case $state11:{
				if($queryWord=='NULL'){
					$state = $state10;
					$attribute="";
				}
			}break;
			case $state12:{
				$state = $state10;
				// if($queryWord=="NULL")
				$defaultVal=($queryWord=="NULL")? "":str_replace("'","",$queryWord);
			}break;
			case $stateEnd:{ }break;
		}
		if($start == $stateEnd) break 2;
	}
	
	$tableData = array();
	$tname = array(
		'tableName' => $tableName
	);
	array_push($tableData, array_merge($tname, array('data' => $colNameAndType)));
	return json_encode($tableData);
	
}


// This function returns array of generated String
function formatStringForCodeGeneration($query){
	// echo preg_replace('/uel\d+/','asd',"jemuel123");
	
	// $query = preg_replace('/decimal\(\d+,?\d\)/', 'int(11)' ,$query);
	$query = preg_replace('/decimal\(\d+,?\d\)/', 'decimal(11)' ,$query);
	$query = trim(preg_replace('/\s+/', ' ', $query));// trim removes space before and after the string
	$query = str_replace('(', ' ( ', $query);
	$query = str_replace(')', ' ) ', $query);
	$query = str_replace(',', ' , ', $query);
	$query = str_replace('`', '', $query);
	$query = preg_replace('/\s+/', ' ', $query);
	// echo $query;
	return explode(' ',$query);
}

















/*********************************************************************************************************
* Tool creation Area *************************************************************************************
* This is the area where all useful code to create tools was prepared
*********************************************************************************************************/

/* Functions for creating finite State machines */
function createCase(){
	for($i=0; $i<13; $i++){
		//		echo "\$state$i = $i,<br>";
	}
	for($i=0; $i<13; $i++){
		echo "
		case \$state$i:{
		if(\$queryWord==''){
			\$state = \$state;
			}
			else{
			\$state = \$state;
			}
		}break;<br>";
	}
}







/**************************/
function createHTMLFormsTest($jsonObject){
	foreach($jsonObject as $object){
		//	echo $object->tableName;
		foreach($object->data as $jsonData){
			$inputType = "text";
			$dummyValues = "hahhahah";
			if($jsonData->dataType=="num" or $jsonData->dataType=="dec"){
				$inputType = "number";
				$dummyValues = "'0'";
			}
			echo "
			<label for='$jsonData->columnName'>$jsonData->columnName</label>
			<input type='$inputType' class='' name='$jsonData->columnName' maxlength='$jsonData->length' value='$jsonData->defaultVal' $jsonData->attribute/>
			";
		}
	}
}















/* Future useful function */
/****************************************************************************
* This function echo all the keys and values of an object
****************************************************************************/
function getTheKeysAndValueOfObject($jsonObject){
	$tableName = "";
	//	$sql = "INSERT INTO $tableName ";
	foreach($jsonObject as $object){
		$tableName = $object->tableName;
		foreach($object->data as $key){
			while ($val = current($key)) {
				/*Note
					$key - The data type
					$val - Literal value
				*/
				echo key($key)."=".$val."---";
				next($key);
			}
			echo "<hr>";
		}
	}
}


?>

app.controller("employeeManagement",function($scope,$http,dbOperations){
	$scope.employeeFields = {};
	$scope.employeeAccessFields = {};
	$scope.employees = [];
	$scope.employeeFields.gender = 1;
	$scope.employeeFields.checked = 1;
	
	// to be update soon - subject to change
	$scope.addEmployeeCommand = false;
	$scope.editEmployeeCommand = false;
	// -----------------

	$scope.employeeData = {};
	var employeeId = 0;

	
	function formatDate(inputDate) {
		return  new Date(inputDate);
	}
	
	function getEmployees(){
		dbOperations.views("getEmployees","").then(function(res){
			// console.log("nasa employee");
			$scope.employees = res;
			formatData();
			// $('select').material_select();
		});
	}
	function formatData(){
		// if(($scope.employees).length>0)
		($scope.employees).forEach(function(e){
			e.salary = parseFloat(e.salary);
			e.birth_day = formatDate(e.birth_day);
			$scope.employeeFields = e;
		});
	}
	$scope.deleteEmployee = function(){
		if (confirm("Area you sure you want to delete this employee?")) {
			$scope.employeeFields.id = employeeId;
			dbOperations.processData("RemoveEmployee",$scope.employeeFields).then(function(res){
				getEmployees();
				$scope.branches = res;
				alert("Employee deleted");
			});
		}
	}

	$scope.newEmployee = function(){

		// console.log($("#addEmployee"));
		$scope.employeeFields = {};
		$("#addEmployee").modal("open");
		$scope.addEmployeeCommand = true;
		$scope.editEmployeeCommand = false;
	}
	$scope.editEmployeeData = function(){
		if(employeeId==0){
			alert("Select employee");
		}
		else{
			$scope.addEmployeeCommand = false;
			$scope.editEmployeeCommand = true;
			// $('select').material_select();
			$("#addEmployee").modal("open");
		}
	}
	$scope.updateEmployeeData = function(){
		if(!isNaN($(".employee-management select[name='positionField']").val())){
			$scope.employeeFields.position_fk = $(".employee-management select[name='positionField']").val();
		}
		if(!isNaN($("#addEmployee").val())){
			$scope.employeeFields.branch_fk = $("#addEmployee").val();
		}
		// $scope.employeeFields.id = employeeId;
		// console.log($scope.employeeFields);
		dbOperations.processData("EditEmployee",$scope.employeeFields).then(function(res){
			// console.log(res)
			getEmployees();//$("#add-employee").modal("close");
		});
	}
	$scope.getEmployeeInfo = function(dataId){
		// console.log($scope.employees);
		($scope.employees).forEach(function(e){// loop  to all the employee data
			if(e.id==dataId){
				if(employeeId==dataId){ $scope.employeeData = {}; employeeId = 0;}
				else{ employeeId = dataId; $scope.employeeData = e;}
				return false;
			}

		});
		$scope.employeeFields = $scope.employeeData;
		// console.log(employeeId);
	}
	$scope.newEmployeeAccess = function(){
		if(employeeId==0){
			alert("Select employee");
		}
		else{
			$scope.employeeFields = $scope.employeeData;
			// $('select').material_select();
			$("#addAccess").modal("open");
		}
	}
	$scope.addEmployeeAccess = function(){
		$scope.employeeAccessFields.id = employeeId;
		dbOperations.processData("AddAccess",$scope.employeeAccessFields).then(function(res){getEmployees();$("#add-access").modal("close");});
	}
	$scope.addEmployee = function(){
		$scope.employeeFields.position_fk = $(".employee-management select[name='positionField']").val();
		$scope.employeeFields.branch_fk = $("select#addEmployeeBranchField").val();
		if($scope.employeeFields.position_fk==""||$scope.employeeFields.branch_fk ==""){
			alert("Incomplete information");
		}
		else{
			// console.log($scope.employeeFields);
			dbOperations.processData("AddEmployee",$scope.employeeFields).then(function(res){
				getEmployees();
				$("#addEmployee").modal("close");
			});
			$scope.employeeFields={};
		}
	}
	getEmployees();
	$scope.employeeManagementInit = function(){
		dbOperations.views("getBranches","").then(function(res){ $scope.branches = res; });
		dbOperations.views("getPositions","").then(function(res){ $scope.positions = res; });
	}
})
app.controller("employeeManagement",function($scope,$http,dbOperations){
	$scope.employeeFields = {};
	$scope.employeeAccessFields = {};
	$scope.employees = [];
	$scope.employeeFields.gender = 1;
	$scope.employeeFields.checked = 1;
	$scope.editEmployeeFields = {};
	$scope.branches = [];
	$scope.positions = [];
	
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
		$scope.employeeFields = {};
		$("#addEmployee").modal("open");
		$scope.addEmployeeCommand = true;
		$scope.editEmployeeCommand = false;
	}
	$scope.editEmployeeData = function(){
		if($scope.editEmployeeFields.id){
			$("#editEmployee").modal("open");
		}
		else{
			alert("Select employee");
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
	$scope.getEmployeeInfo = function(employee){
		$scope.employeeFields = $scope.employeeFields==employee ? {} : employee;
		$scope.editEmployeeFields = $scope.editEmployeeFields==employee ? {} : employee;
		console.log(employee);
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
	employeeManagementInit = function(){
		dbOperations.views("getBranches","").then(function(res){ $scope.branches = res; });
		dbOperations.views("getPositions","").then(function(res){
			console.log(res);
			$scope.positions = res;
		});
	}

	employeeManagementInit();
})
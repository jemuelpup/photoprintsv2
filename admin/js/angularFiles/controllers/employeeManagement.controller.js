/*
ng-select bug.
ng select not updating programmatically after selecting
Bug: select not selecting programmatically after i select in angular js
*/

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
			$scope.employees = res;
			formatData();
		});
	}
	function formatData(){
		($scope.employees).forEach(function(e){
			e.birth_day = formatDate(e.birth_day);
		});
	}
	$scope.newEmployee = function(){
		$scope.employeeFields = {};
		$("#addEmployee").modal("open");
		$scope.addEmployeeCommand = true;
		$scope.editEmployeeCommand = false;
	}
	$scope.editEmployee = function(p,b){
		$scope.editEmployeeFields.position_fk = p.id;
		$scope.editEmployeeFields.branch_fk = b.id;
		dbOperations.processData("EditEmployee",$scope.editEmployeeFields).then(function(res){
			getEmployees();
			$("#editEmployee").modal("close");
		});
	}
	$scope.editEmployeeData = function(){
		if($scope.editEmployeeFields.id){
			$scope.selectedEmployeePosition = $scope.positions.find(function(p){
				return p.id==$scope.editEmployeeFields.position_fk;
			});
			$scope.selectedEmployeeBranch = $scope.branches.find(function(b){
				return b.id==$scope.editEmployeeFields.branch_fk;
			});
			$scope.editEmployeeFields.gender = $scope.editEmployeeFields.gender+"";
			$("#editEmployee").modal("open");
		}
		else{
			alert("Select employee");
		}
	}
	// $scope.test = function(){
	// 	$scope.selectedEmployeeBranch = $scope.branches[0];
	// }
	$scope.deleteEmployee = function(){
		if($scope.editEmployeeFields.id){
			if (confirm("Area you sure you want to delete this employee?")) {
				dbOperations.processData("RemoveEmployee",$scope.editEmployeeFields).then(function(res){
					getEmployees();
					$scope.branches = res;
					alert("Employee deleted");
				});
			}
		}
		else{
			alert("Select employee");
		}
	}
	$scope.addEmployeeAccess = function(){
		$scope.employeeAccessFields.id = $scope.editEmployeeFields.id;
		dbOperations.processData("AddAccess",$scope.employeeAccessFields).then(function(res){getEmployees();$("#add-access").modal("close");});
	}
	$scope.getEmployeeInfo = function(employee){
		$scope.editEmployeeFields = $scope.editEmployeeFields==employee ? {} : employee;
	}
	$scope.newEmployeeAccess = function(){
		if($scope.editEmployeeFields.id){
			$("#addAccess").modal("open");
		}
		else{
			alert("Select employee");
		}
	}
	$scope.addEmployee = function(){
		$scope.employeeFields.position_fk = $(".employee-management select[name='positionField']").val();
		$scope.employeeFields.branch_fk = $("select#addEmployeeBranchField").val();
		if($scope.employeeFields.position_fk==""||$scope.employeeFields.branch_fk ==""){
			alert("Incomplete information");
		}
		else{
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
		dbOperations.views("getPositions","").then(function(res){ $scope.positions = res; });
	}

	employeeManagementInit();
})
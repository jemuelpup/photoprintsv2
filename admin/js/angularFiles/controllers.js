var loginEnabled = 1;
var strictModeEnabled = 1;

app.controller("adminController",function($scope,dbOperations){
	$scope.sideNavActive = false;
	$scope.menuClick = function(){
		$scope.sideNavActive = true;
	}
	$scope.shadowClick = function(){
		$scope.sideNavActive = false;
	}
	$scope.logout = function(){
		dbOperations.processData("Logout","").then(function(res){
			window.location.href = '/';
		});
	}
});

app.controller("buisnessManagement",function($scope,$http,dbOperations){
	/* Testing sessions */
	if(loginEnabled){
		dbOperations.getAccessID().then(function(res){
			if(res.data==='0'){ window.location.href = '/'; }
		});
	}
	if(strictModeEnabled){
		dbOperations.getAccessPosition().then(function(res){
			// console.log(res.data);
			if(!(res.data==='3')){ window.location.href = '/'; }
		});
	}
	/* /Testing sessions */

	$scope.branchFields = {};
	$scope.branches = [];
	$scope.positionFields = {};
	$scope.positions = [];
	$scope.editBranchFields = {};
	$scope.orderItems = [];

	$scope.branchIndex = function(i,id){
		$scope.editBranchFields = ($scope.branches)[i];
		// console.log($scope.editBranchFields);
	}
	$scope.positionIndex = function(i,id){
		$scope.editPositionFields = ($scope.positions)[i];
		// console.log($scope.positionFields);
	}
	$scope.editBranch = function(e){
		dbOperations.processData("EditBranch",$scope.editBranchFields).then(function(res){
			// console.log(res);
			getBranches();
		});
	}
	$scope.editPosition = function(){
		dbOperations.processData("EditPosition",$scope.editPositionFields).then(function(res){
			// console.log(res);
			getPositions();
		});
	}
	$scope.newBranch = function(){
		console.log($scope.branchFields);
		dbOperations.processData("AddBranch",$scope.branchFields).then(function(res){
			getBranches();
		});
	}
	$scope.newPosition = function(){
		dbOperations.processData("AddPosition",$scope.positionFields).then(function(res){
			getPositions();
		});
	}
	function getBranches(){
		dbOperations.views("getBranches","").then(function(res){
			$scope.branches = res;
			$('select').material_select();
		});
	}
	function getPositions(){
		dbOperations.views("getPositions","").then(function(res){
			console.log("nasa position");
			console.log(res,"position");
			$scope.positions = res;
			$('select').material_select();
		});
	}
	getBranches();
	getPositions();
});

app.controller("productManagement",function($scope,$http,dbOperations){
	$scope.categories = [];
	$scope.items = [];
	$scope.categoryFields = {};
	$scope.itemFields = {};
	$scope.editItemFields = {};
	$scope.editCategoryFields = {};

	$scope.deleteCategory = function(){
		dbOperations.processData("RemoveCategory",$scope.editCategoryFields).then(function(res){
			// console.log("dumaan dito");
			// console.log($scope.editCategoryFields);
			// console.log(res);
			// alert("Category deleted")
			getCategories();});
	}
	$scope.addNewCategory = function(){
		dbOperations.processData("AddCategory",$scope.categoryFields).then(function(res){
			alert("New category available.")
			getCategories();});
	}

	$scope.addNewItem = function(){
		$scope.itemFields.category = $("select#category").val();
		dbOperations.processData("AddItem",$scope.itemFields).then(function(res){
			alert("New item available.");
			getItems();
		});
	}

	$scope.itemIndex = function(i,id){
		$scope.editItemFields = ($scope.items)[i];
		// $(".categoryUpdate [value="+$scope.editItemFields.category_fk+"]").attr("selected='selected'");
	}

	$scope.categoryIndex = function(i,id){
		$scope.editCategoryFields = ($scope.categories)[i];
		// console.log($scope.editCategoryFields);
	}

	$scope.editItemsTrigger = function(){
		$('#edit-item').modal('open');
	}

	$scope.editCategoryTrigger = function(){
		$('#edit-category').modal('open');
	}
	$scope.editItem = function(){
		if($scope.editItemFields.category_fk){
			if(!isNaN($("select#categoryUpdate").val())){
				$scope.editItemFields.category_fk = $("select#categoryUpdate").val();
			}
			dbOperations.processData("EditItem",$scope.editItemFields).then(function(res){getItems();});
		}
		else{
			alert("Put Category");
		}
	}
	$scope.editCategory = function(){
		// var d = $(this).serializeArray();
	// d.push({name:"id",value:itemId});// get the id... add to serialize array...
	// dbOperations("EditCategory",d,function(){v.displayItemCategoryList()});
		dbOperations.processData("EditCategory",$scope.editCategoryFields).then(function(res){
			// console.log(res);
			getItems();});
		// console.log($scope.editCategoryFields);
	}
	$scope.deleteItem = function(){
		if (confirm("Are you sure you want to delete this item?")) {
			dbOperations.processData("RemoveItem",$scope.editItemFields).then(function(res){
				// console.log(res)
				getItems();
			});
		}
	}


	function getCategories(){
		$http({
			method:"POST", url:"/admin/view.php",
			data: { 'process': "getItemCategory",'data':'' }
		}).then(function success(res){
			$scope.categories = res.data;
			// console.log(res.data,'nandit yun')
			$('select').material_select();
		}, function myError(response) {
	    });
    }
	function getItems(){
		$http({
			method:"POST", url:"/admin/view.php",
			data: { 'process': "getItems",'data':'' }
		}).then(function success(res){
			(res.data).map(function(e){
				e.price = Number(e.price);
				e.category_fk = Number(e.category_fk);
				return e
			});
			$scope.items = res.data;
			$('select').material_select();
			// $scope.items.price = Number(res.data.price);
		}, function myError(response) {
	    });
    }
	getCategories();
	getItems();


	$scope.sendMessage = function(){

	}
	// $http({
	// 	method:"GET", url:"http://localhost:3000/",
	// }).then(function(r){
	// 	console.log(r);
	// });
});

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
			console.log("nasa employee");
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
			$('select').material_select();
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
		console.log($scope.employees);
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
			$('select').material_select();
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

app.controller("reports",function($scope,$http,dbOperations,$interval){
	$scope.selectedDate = new Date();
	$scope.transactions = [];
	$scope.voidTransactions = [];
	$scope.totalSales = 0;
	$scope.transactionNotes = "";
	$scope.voidReason = "";
	$scope.reportFilters = [
		{"name":"Daily","id":"d1","val":1},
		{"name":"Weekly","id":"d2","val":2},
		{"name":"Monthly","id":"d3","val":3},
		{"name":"Yearly","id":"d4","val":4},
	];
	// $scope.fromdateInput = new Date();
	$scope.fromdateInput = new Date(2018, 2, 24, 10, 33, 30, 0);// for testing purposes
	$scope.todateInput = new Date(($scope.fromdateInput).getTime() + (24 * 60 * 60 * 1000));


	// .from = new Date();
	// $scope.dateInput.to = new Date();
	
	console.log($scope.selectedDate);
	function getTotalSalesOn(){
		dbOperations.getData('getTotalSales',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.totalSales = res.data;
			// console.log(res);
		});
	}
	function getTransationsOn(){
		dbOperations.getData('getTransationsData',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.transactions = res.data;
			console.log(res);
		});
	}
	function getVoidTransactionsOn(){
		console.log("nasa void transactions");
		dbOperations.getData('getVoidTransactionsOn',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.voidTransactions = res.data;
			console.log(res);
		});
	}
	$scope.getTransactionDetails = function(i){
		$scope.transactionNotes = $scope.transactions[i].notes;
		dbOperations.getData('getOrderData',{"orderID":$scope.transactions[i].id}).then(function(res) {
			$scope.orderItems = res.data;
			console.log(res);
		});
		console.log($scope.transactions[i].id);
	}
	$scope.getTransactionData = function(){
		getTotalSalesOn();
		getTransationsOn();
		getVoidTransactionsOn();
	}
	$scope.getVoidReason = function(i){
		$scope.voidReason = $scope.voidTransactions[i].void_reason;
	}
	getTotalSalesOn();
	getVoidTransactionsOn();
	getTransationsOn();
}
);

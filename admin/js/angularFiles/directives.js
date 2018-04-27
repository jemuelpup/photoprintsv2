
/* product management side */
app.directive("editCategory",function(){
	return {
		templateUrl: '/admin/templates/productManagement/editCategory.html'
	}
});
app.directive("addCategory",function(){
	return {
		templateUrl: '/admin/templates/productManagement/addCategory.html'
	}
});
app.directive("categoryList",function(){
	return {
		templateUrl: '/admin/templates/productManagement/categoryList.html'
	}
});
app.directive("addItem",function(){
	return {
		templateUrl: '/admin/templates/productManagement/addItem.html'
	}
});
app.directive("editItem",function(){
	return {
		templateUrl: '/admin/templates/productManagement/editItem.html'
	}
});
app.directive("itemList",function(){
	return {
		templateUrl: '/admin/templates/productManagement/itemList.html'
	}
});
/* Employee management */
app.directive("addEmployee",function(){
	return {
		templateUrl: '/admin/templates/employeeManagement/addEmployee.html'
	}
});
app.directive("addAccess",function(){
	return {
		templateUrl: '/admin/templates/employeeManagement/addAccess.html'
	}
});
app.directive("employeeList",function(){
	return {
		templateUrl: '/admin/templates/employeeManagement/employeeList.html'
	}
});
/* Buisness management */
app.directive("addBranch",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/addBranch.html'
	}
});
app.directive("editBranch",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/editBranch.html'
	}
});
app.directive("branchList",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/branchList.html'
	}
});
app.directive("addPosition",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/addPosition.html'
	}
});
app.directive("editPosition",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/editPosition.html'
	}
});
app.directive("positionList",function(){
	return {
		templateUrl: '/admin/templates/buisnessManagement/positionList.html'
	}
});
/* Reports management */
app.directive("reportInputFields",function(){
	return {
		templateUrl: '/admin/templates/reportsManagement/reportInputFields.html'
	}
});
app.directive("reportTransactionTable",function(){
	return {
		templateUrl: '/admin/templates/reportsManagement/reportTransactionTable.html'
	}
});
app.directive("reportVoidTransactionTable",function(){
	return {
		templateUrl: '/admin/templates/reportsManagement/reportVoidTransactionTable.html'
	}
});
/* Inventory management */
app.directive("addMaterial",function(){
	return {
		templateUrl: '/admin/templates/inventoryManagement/addMaterial.html'
	}
});
app.directive("editMaterial",function(){
	return {
		templateUrl: '/admin/templates/inventoryManagement/editMaterial.html'
	}
});

app.directive("materialList",function(){
	return {
		templateUrl: '/admin/templates/inventoryManagement/materialList.html'
	}
});


/* Reports management 
app.directive("transactions",function(){
	return {
		templateUrl: 'transactions'
	}
});
app.directive("voidTransaction",function(){
	return {
		templateUrl: 'voidTransaction'
	}
});
/*
app.directive("",function(){
	return {
		templateUrl: ''
	}
});
*/
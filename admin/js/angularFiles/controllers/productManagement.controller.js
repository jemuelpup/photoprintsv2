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

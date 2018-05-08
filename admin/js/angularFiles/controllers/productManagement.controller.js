app.controller("productManagement",function($scope,$http,dbOperations){
	$scope.categories = [];
	$scope.items = [];
	$scope.categoryFields = {};
	$scope.itemFields = {};
	$scope.editItemFields = {};
	$scope.editAffectedMaterial = {};
	$scope.editCategoryFields = {};
	$scope.selectedItemIndex = -1;
	$scope.productMaterials = [];
	$scope.itemMaterials = [];
	$scope.materials = [];
	$scope.selectedMaterialFields = {};
	$scope.selectedMaterialIndex = -1;


	$scope.removeSelectedHighlight = function(e){
		console.log("dumaan dito");
		$scope.selectedItemIndex = -1;
		$scope.editItemFields = {};
		$scope.itemMaterials = [];
	}
	$scope.removeItemAffectedInMaterial = function(e,itemId){
		if(confirm("Are you sure you want to remove the material in item?")){
			e.preventDefault();
			var data = {"materialID":$scope.editAffectedMaterial.id,
							"itemID":$scope.editItemFields.id};
			dbOperations.processData("RemoveMaterialAffectedPerItem",data).then(function(res){
				getItemMaterials($scope.editItemFields.id);
				alert("Editting Material affected on product success.");
			});
		}
	}

	$scope.setMaterialQuantityInItem = function(e,material_quantity){
		e.preventDefault();
		var data = {"materialID":$scope.editAffectedMaterial.id,
						"quantity":material_quantity,
						"itemID":$scope.editItemFields.id};
		dbOperations.processData("EditMaterialAffectedPerItem",data).then(function(res){
			getItemMaterials($scope.editItemFields.id);
			alert("Editting Material affected on product success.");
		});
	}

	$scope.editItemMaterialsTrigger = function(){
		if($scope.selectedMaterialIndex>-1){
			$('#editMaterialQuantityInItem').modal('open');
			console.log("call the edit trigger");
		}
		else{
			alert("Select product material to edit");
		}
	}
	$scope.addNewMaterialInItem = function(e){
		e.preventDefault();
		//check if there is selected material
		if($scope.selectedMaterialFields.id){
			var data = {"materialID":$scope.selectedMaterialFields.id,
						"quantity":$scope.addItemInMaterialFields.material_quantity,
						"itemID":$scope.editItemFields.id};
			dbOperations.processData("EditMaterialAffectedPerItem",data).then(function(res){
				// console.log(res);
				getItemMaterials($scope.editItemFields.id);
				alert("Adding new Material affected on product success");
			});
		}
		else{
			alert("Select material and set material quantity needed per item.");
		}
	}
	$scope.itemMaterialIndex = function(i,id){
		$scope.editAffectedMaterial = ($scope.items)[i];
		// use the id for editting
		$scope.selectedMaterialIndex = $scope.selectedMaterialIndex===i ? -1 : i;
	}

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

	$scope.itemIndex = function(i,item){
		$scope.editItemFields = item;
		$scope.selectedItemIndex = $scope.selectedItemIndex===i ? -1 : i;
		getItemMaterials($scope.editItemFields.id);
	}
	$scope.materialIndex = function(i,id){
		$scope.selectedMaterialFields = ($scope.materials)[i];
		$scope.selectedMaterialIndex = $scope.selectedMaterialIndex===i ? -1 : i;
	}
	$scope.categoryIndex = function(i,id){
		$scope.editCategoryFields = ($scope.categories)[i];
		// console.log($scope.editCategoryFields);
	}

	$scope.editItemsTrigger = function(){
		if($scope.selectedItemIndex == -1){
			alert("Select item first");
		}
		else{
			$('#editItem').modal('open');
			// $('#editItem select').material_select();
		}
	}


	$scope.addItemMaterialTrigger = function(){
		if($scope.selectedItemIndex == -1){
			alert("Select item first");
		}
		else{
			// dbOperations.views("GetMaterials","").then(function(res){ $scope.materials = res; });
			$('#addMaterialInItem').modal('open');
			// getMaterials();
		}
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
	function getItemMaterials(item_id){
		dbOperations.views("GetItemMaterials",{"itemId":item_id}).then(function(res){
			$scope.itemMaterials = res;
			console.log(res);
		});
	}

	function getCategories(){
		$http({
			method:"POST", url:"/admin/view.php",
			data: { 'process': "getItemCategory",'data':'' }
		}).then(function success(res){
			$scope.categories = res.data;
			// console.log(res.data,'nandit yun')
			// $('select').material_select();
		}, function myError(response) {
	    });
    }
    function getMaterials(){
		dbOperations.views("GetMaterials","").then(function(res){
			$scope.materials = res;
			// $('select').material_select();
			// $('.modal').modal();
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
			// $('.modal').modal();
			// $('select').material_select();
			// $scope.items.price = Number(res.data.price);
		}, function myError(response) {
	    });
    }
    getMaterials();
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

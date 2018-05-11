app.controller("productManagement",function($scope,$http,dbOperations){
	$scope.categories = [];
	$scope.items = [];
	$scope.productMaterials = [];
	$scope.itemMaterials = [];
	$scope.materials = [];
	$scope.categoryFields = {};
	$scope.itemFields = {};
	$scope.editItemFields = {};
	$scope.editAffectedMaterial = {};
	$scope.editCategoryFields = {};
	$scope.selectedMaterialFields = {};
	$scope.selectedItemIndex = -1;
	$scope.selectedMaterialIndex = -1;


	$scope.removeSelectedHighlight = function(e){
		console.log("dumaan dito");
		$scope.selectedItemIndex = -1;
		$scope.editItemFields = {};
		$scope.itemMaterials = [];
		$scope.itemMaterials = [];
	}
	// under development
	$scope.removeItemAffectedInMaterial = function(e){
		if(confirm("Are you sure you want to remove the material in item?")){
			e.preventDefault();
			var data = $scope.editAffectedMaterial;
			console.log(data);
			dbOperations.processData("RemoveMaterialAffectedInItem",data).then(function(res){	
				// console.log(res);
				getItemMaterials($scope.editItemFields.id);
				alert("Deleting Material affected on product success.");
			});
		}
	}
	$scope.itemMaterialIndex = function(i,itemMaterial){
		$scope.editAffectedMaterial = $scope.editAffectedMaterial.id == itemMaterial.id ? {} : itemMaterial;
	}
	$scope.itemIndex = function(i,item){
		console.log(item)
		$scope.editItemFields = item;
		$scope.selectedItemIndex = $scope.selectedItemIndex===i ? -1 : i;
		getItemMaterials($scope.editItemFields.id);
	}
	$scope.setMaterialQuantityInItem = function(e,material_quantity){
		e.preventDefault();
		if($scope.editAffectedMaterial.id){
			var data = {"materialID":$scope.editAffectedMaterial.material_id_fk,
							"quantity":material_quantity,
							"itemID":$scope.editAffectedMaterial.item_id_fk};
			dbOperations.processData("EditMaterialAffectedPerItem",data).then(function(res){
				getItemMaterials($scope.editItemFields.id);
				$("#editMaterialQuantityInItem").modal("close");
				alert("Editting Material affected on product success.");
			});
		}
	}
	$scope.editItemMaterialsTrigger = function(){
		if($scope.editAffectedMaterial.id){
			$('#editMaterialQuantityInItem').modal('open');
			console.log("call the edit trigger");
		}
		else{
			alert("Select product material to edit");
		}
	}
	$scope.addNewMaterialInItem = function(e){
		e.preventDefault();
		if($scope.selectedMaterialFields.id){
			var data = {"materialID":$scope.selectedMaterialFields.id,
						"quantity":$scope.addItemInMaterialFields.material_quantity,
						"itemID":$scope.editItemFields.id};
			dbOperations.processData("EditMaterialAffectedPerItem",data).then(function(res){
				// console.log(res);
				getItemMaterials($scope.editItemFields.id);
				alert("Adding new Material affected on product success");
				$("#addMaterialInItem").modal("close");
			});
		}
		else{
			alert("Select material and set material quantity needed per item.");
		}
	}
	$scope.deleteCategory = function(){
		if($scope.editCategoryFields.id){
			if(confirm("Are you sure you want to delete "+$scope.editCategoryFields.name+" category?")){
				dbOperations.processData("RemoveCategory",$scope.editCategoryFields).then(function(res){getCategories();});
			}
		}
		else{
			alert("Select category first");
		}
	}
	$scope.addNewCategory = function(){
		dbOperations.processData("AddCategory",$scope.categoryFields).then(function(res){
			alert("New category available.")
			getCategories();});
	}
	$scope.addNewItem = function(e){
		e.preventDefault();
		$scope.itemFields.category = $("select#category").val();
		dbOperations.processData("AddItem",$scope.itemFields).then(function(res){
			alert("New item available.");
			getItems();
			$scope.itemFields = angular.copy({});
		});
	}
	$scope.materialIndex = function(i,id){
		$scope.selectedMaterialFields = ($scope.materials)[i];
		$scope.selectedMaterialIndex = $scope.selectedMaterialIndex===i ? -1 : i;
	}
	$scope.categoryIndex = function(category){
		$scope.editCategoryFields = $scope.editCategoryFields == category ? {} : category;

		console.log(category);
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
			$('#addMaterialInItem').modal('open');
			$scope.editAffectedMaterial = {};
			$scope.selectedMaterialIndex = -1;
		}
	}
	$scope.editCategoryTrigger = function(){
		console.log("Dumaan sa edit category")
		$('#edit-category').modal('open');
	}
	$scope.editItem = function(){
		console.log($scope.editItemFields);
		// UNDER CONSTRUCTION
		// if($scope.editItemFields.category_fk){
		// 		$scope.editItemFields.category_fk = $("select#categoryUpdate").val();
			
		// 	dbOperations.processData("EditItem",$scope.editItemFields).then(function(res){getItems();});
		// }
		// else{
		// 	alert("Put Category");
		// }
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
			$scope.editAffectedMaterial = {};
			$scope.selectedMaterialIndex = -1;
			console.log(res);
		});
	}
	function getCategories(){
		$http({
			method:"POST", url:"/admin/view.php",
			data: { 'process': "getItemCategory",'data':'' }
		}).then(function success(res){
			// console.log("kinukuha yung categories")
			// console.log(res.data)
			$scope.categories = res.data;
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

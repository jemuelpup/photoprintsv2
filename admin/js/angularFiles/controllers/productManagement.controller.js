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
	$scope.selectedCategory = {};
	$scope.selectedItemIndex = -1;
	$scope.selectedMaterialIndex = -1;
	$scope.removeSelectedHighlight = function(e){
		$scope.selectedItemIndex = -1;
		$scope.editItemFields = {};
		$scope.itemMaterials = [];
		$scope.itemMaterials = [];
	}
	$scope.removeItemAffectedInMaterial = function(e){
		if(confirm("Are you sure you want to remove the material in item?")){
			e.preventDefault();
			var data = $scope.editAffectedMaterial;
			dbOperations.processData("RemoveMaterialAffectedInItem",data).then(function(res){
				getItemMaterials($scope.editItemFields.id);
				alert("Deleting Material affected on product success.");
			});
		}
	}
	$scope.itemMaterialIndex = function(i,itemMaterial){
		$scope.editAffectedMaterial = $scope.editAffectedMaterial.id == itemMaterial.id ? {} : itemMaterial;
	}
	$scope.itemIndex = function(i,item){
		$scope.editItemFields = item;
		$scope.selectedItemIndex = $scope.selectedItemIndex===i ? -1 : i;
		getItemMaterials($scope.editItemFields.id);
		$scope.selectedCategory = $scope.categories.find(function(e){
			return e.id==item.category_fk;
		});
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
				getItemMaterials($scope.editItemFields.id);
				getItems();
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
	}
	$scope.editItemsTrigger = function(){
		if($scope.selectedItemIndex == -1){
			alert("Select item first");
		}
		else{
			$('#editItem').modal('open');
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
		$('#edit-category').modal('open');
	}
	$scope.editItem = function(){
		$scope.editItemFields.category_fk = $scope.selectedCategory.id;
		dbOperations.processData("EditItem",$scope.editItemFields).then(function(res){
			getItems();
			$('#editItem').modal('close');
		});
	}
	$scope.editCategory = function(){
		dbOperations.processData("EditCategory",$scope.editCategoryFields).then(function(res){getItems();});
	}
	$scope.deleteItem = function(){
		if (confirm("Are you sure you want to delete this item?")) {
			dbOperations.processData("RemoveItem",$scope.editItemFields).then(function(res){
				getItems();
			});
		}
	}
	function getItemMaterials(item_id){
		dbOperations.views("GetItemMaterials",{"itemId":item_id}).then(function(res){
			$scope.itemMaterials = res;
			$scope.editAffectedMaterial = {};
			$scope.selectedMaterialIndex = -1;
		});
	}
    function getMaterials(){
		dbOperations.views("GetMaterials","").then(function(res){
			$scope.materials = res;
		});
	}
	function getCategories(){
		dbOperations.views("getItemCategory","").then(function(res){
			$scope.categories = res;
		});
    }
	function getItems(){
		dbOperations.views("getItems","").then(function(res){
			$scope.items = res;
			console.log(res)
		});
    }
    getMaterials();
	getCategories();
	getItems();
});

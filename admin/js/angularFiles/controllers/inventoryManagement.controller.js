app.controller("inventoryManagement",function($scope,$http,dbOperations){
	$scope.materials = [];
	$scope.addMaterialFields = {};
	$scope.editMaterialFields = {};
	function getMaterials(){
		dbOperations.views("GetMaterials","").then(function(res){
			$scope.materials = res;
			$('.modal').modal();
		});
	}
	$scope.materialIndex = function(material){
		$scope.editMaterialFields = $scope.editMaterialFields == material ? {} : material;
		
		console.log($scope.editMaterialFields);
	}
	$scope.deleteMaterial = function(){
		if($scope.editMaterialFields.id){
			if(confirm("Are you sure you want to delete this material?")){
				dbOperations.processData("RemoveMaterial",$scope.editMaterialFields).then(function(res){
					getMaterials();
					alert("Material deleted");
				});
			}
		}
		else{
			alert("Select material first");
		}
	}
	$scope.addNewMaterial = function(){
		dbOperations.processData("AddNewMaterial",$scope.addMaterialFields).then(function(res){
			alert("New material available.")
			getMaterials();
		});
	}
	$scope.addMaterialStockTrigger = function(){
		if($scope.editMaterialFields.id){ $('#addMaterialStock').modal('open'); }
		else{ alert("Select material first"); }
	}
	$scope.editMaterialTrigger = function(){
		if($scope.editMaterialFields.id){ $('#editMaterial').modal('open'); }
		else{ alert("Select material first"); }
	}
	$scope.addMaterialStock = function(e){
		dbOperations.processData("EditMaterialAddStock",$scope.editMaterialFields).then(function(res){
			alert("Material Stock updated.");
			getMaterials();
			$('#addMaterialStock').modal('close');
		});
	}
	$scope.editMaterial = function(){
		dbOperations.processData("EditMaterial",$scope.editMaterialFields).then(function(res){
			alert("Material Stock updated.");
			getMaterials();
			$('#editMaterial').modal('close');
		});
	}
	getMaterials();
});

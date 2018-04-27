app.controller("inventoryManagement",function($scope,$http,dbOperations){
	$scope.materials = [];
	$scope.addMaterialFields = {};
	$scope.editMaterialFields = {};
	$scope.selectedMaterialIndex = 1;

	function getMaterials(){
		dbOperations.views("GetMaterials","").then(function(res){
			$scope.materials = res;
			$('select').material_select();
			$('.modal').modal();
		});
	}

	$scope.materialIndex = function(i){

		console.log($scope.selectedMaterialIndex);
		
	}
	$scope.editMaterialTrigger = function(){
		if($scope.selectedMaterialIndex == -1){
			alert("Select material first");
		}
		else{
			$('#editMaterial').modal('open');
		}
	}
	$scope.editMaterial = function(){
		dbOperations.processData("EditMaterial",$scope.editMaterialFields).then(function(res){
			getMaterials();
		});
	}
	$scope.deleteMaterial = function(){
		dbOperations.processData("RemoveMaterial",$scope.editMaterialFields).then(function(res){
			getMaterials();
		});
	}
	$scope.addNewMaterial = function(e){
		e.preventDefault();
		dbOperations.processData("AddNewMaterial",$scope.addMaterialFields).then(function(res){
			alert("New material available.")
			getMaterials();});
	}
	getMaterials();
});

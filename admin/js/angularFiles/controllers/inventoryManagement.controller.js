var loginEnabled = 1;
var strictModeEnabled = 1;


app.controller("inventoryManagement",function($scope,$http,dbOperations){
	$scope.materials = [];
	$scope.materialFields = {};
	$scope.editMaterialFields = {};

	function getMaterials(){
		dbOperations.views("getMaterials","").then(function(res){
			$scope.Materials = res;
			$('select').material_select();
		});
	}

	$scope.materialIndex = function(i,id){
		$scope.editMaterialFields = ($scope.materials)[i];
	}
	$scope.editMaterialTrigger = function(){
		$('#editMaterial').modal('open');
	}
	$scope.editMaterial = function(){
		dbOperations.processData("EditMaterial",$scope.editMaterialFields).then(function(res){
			getMaterial();
		});
	}
	$scope.deleteMaterial = function(){
		dbOperations.processData("RemoveMaterial",$scope.editMaterialFields).then(function(res){
			getMaterials();
		});
	}
	$scope.addNewMaterial = function(){
		dbOperations.processData("AddMaterial",$scope.materialFields).then(function(res){
			alert("New material available.")
			getMaterials();});
	}
});

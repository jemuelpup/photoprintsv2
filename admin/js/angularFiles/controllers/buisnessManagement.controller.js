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
		// console.log($scope.branchFields);
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
			// console.log("nasa position");
			// console.log(res,"position");
			$scope.positions = res;
			$('select').material_select();
		});
	}
	getBranches();
	getPositions();
});
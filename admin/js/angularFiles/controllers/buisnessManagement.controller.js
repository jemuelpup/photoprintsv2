app.controller("buisnessManagement",function($scope,$http,dbOperations){
	/* Testing sessions */
	if(loginEnabled){
		dbOperations.getAccessID().then(function(res){
			if(res.data==='0'){ window.location.href = '/'; }
		});
	}
	if(strictModeEnabled){
		dbOperations.getAccessPosition().then(function(res){
			if(!(res.data==='3')){ window.location.href = '/'; }
		});
	}
	/* /Testing sessions */

	$scope.branchFields = {};
	$scope.branches = [];
	$scope.positionFields = {};
	$scope.positions = [];
	$scope.editBranchFields = {};
	$scope.editPositionFields = {};
	$scope.orderItems = [];

	$scope.branchIndex = function(branch){
		$scope.editBranchFields = $scope.editBranchFields == branch ? {} : branch;
	}
	$scope.positionIndex = function(position){
		$scope.editPositionFields = $scope.editPositionFields == position ? {} : position;
	}
	$scope.editBranch = function(e){
		dbOperations.processData("EditBranch",$scope.editBranchFields).then(function(res){
			$("#editBranch").modal("close");
			getBranches();
		});
	}
	$scope.editPositionTrigger = function(){
		$("#editPosition").modal("open");
	}
	$scope.editBranchTrigger = function(){
		$("#editBranch").modal("open");
	}
	$scope.removeBranch = function(){
		if($scope.editBranchFields.id){
			if(confirm("Are you sure you want to delete this branch?")){
				dbOperations.processData("RemoveBranch",$scope.editBranchFields).then(function(res){
					alert("Branch Deleted");
					getBranches();
				});
			}
		}
		else{
			alert("Select branch first before deleting");
		}
	}
	$scope.removePosition = function(){
		if($scope.editPositionFields.id){
			if(confirm("Are you sure you want to delete this Position?")){
				dbOperations.processData("RemovePosition",$scope.editPositionFields).then(function(res){
					alert("Position Deleted");
					getPositions();
				});
			}
		}
		else{
			alert("Select Position first before deleting");
		}
	}
	$scope.editPosition = function(){
		dbOperations.processData("EditPosition",$scope.editPositionFields).then(function(res){
			getPositions();
			$("#editPosition").modal("close");
		});
	}
	$scope.newBranch = function(){
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
		});
	}
	function getPositions(){
		dbOperations.views("getPositions","").then(function(res){
			$scope.positions = res;
		});
	}
	getBranches();
	getPositions();
});
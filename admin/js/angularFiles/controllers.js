var loginEnabled = 1;
var strictModeEnabled = 1;

app.controller("adminController",function($scope,dbOperations){
	$scope.sideNavActive = false;
	$scope.menuClick = function(){
		$scope.sideNavActive = true;
	}
	$scope.shadowClick = function(){
		$('.modal').modal();
		$scope.sideNavActive = false;
	}
	$scope.logout = function(){
		dbOperations.processData("Logout","").then(function(res){
			window.location.href = '/';
		});
	}
});

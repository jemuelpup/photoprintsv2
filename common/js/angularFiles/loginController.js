operations.controller('login',function($scope,$http,$timeout,dbOperations){
	console.log("nasa login ako");
	var loading = false;
	$scope.shake = false;
	$scope.loginMessage = "";
	$scope.validAcess = true;
	// access working...
	$scope.validateAcess = function(){
		
		
		console.log($scope.loginForm);

		dbOperations.access($scope.loginForm).then(function(res){
			console.log("Dumaan dito")
			console.log(res);
			console.log(res.position);
			var access = "";
			switch(res.position){
				case 1:{
					access = "/cashier";
				}break;
				case 2:{
					access = "/operator";
				}break;
				case 3:{
					access = "/admin";
				}break;
				case 6:{ // cashier and operator
					access = "/cashier";
					window.open("/operator", '_blank')
				}break;
				default:{
					res.position = 0;
				}break;
			}
			if(res.position){
				window.location.href = access;
			}
			else{
				$scope.shake = true;
				$timeout(function(){$scope.shake = false}, 830);
				$scope.loginMessage = "Invalid username and password.";
			}
		});


		
	}
});
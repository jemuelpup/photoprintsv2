var loginEnabled = 1;
var strictModeEnabled = 1;

operations.controller('cashier',function($scope,$http,$interval,dbOperations,systemOperations){
	if(loginEnabled){
		systemOperations.getAccessID().then(function(res){
			if(res.data==='0'){ window.location.href = '/'; }
		});
	}
	if(strictModeEnabled){
		systemOperations.getAccessPosition().then(function(res){
			if(!(res.data==='1'||res.data==='6')){ window.location.href = '/'; }
		});
	}
	$scope.orders = [];
	$scope.order = {};
	$scope.selectedOrder = {};
	$scope.orderItems = [];
	$scope.change = 0;
	// check the update per second
	var excecuteGet = true;
	// var receiptPrinted = false; // for printing the receipt
	function getUnclaimedOrders(){
		dbOperations.unclaimedOrders("getUnclaimedOrders","").then(function(res) {
			// console.log(res);
	 		$scope.orders = res;
	 	});
	}
	$scope.setOrderVoid = function(id){
		if((typeof ($scope.voidReason) !== "undefined" || $scope.voidReason!=="") && typeof (id) !== "undefined"){
			dbOperations.processData("VoidOrder",{"id":id,"reason":$scope.voidReason}).then(function(res) {
				console.log(res);
		 		// $scope.orders = res;
		 		getUnclaimedOrders();
		 		$scope.voidReason = "";
		 	});
		}
		else{
			alert("Please select order and enter the reason for voiding order.");
		}
	}
	$scope.viewUnclaimedOrders = function(){
		getUnclaimedOrders();
	}
	$scope.viewItemsOrdered = function(order,orderLine){
		if($scope.selectedOrder!=order){
			$scope.selectedOrder =  order;
			$scope.order = order;
			$scope.orderItems = orderLine;
			$scope.change = $scope.order.down_payment - $scope.order.total_amount;
		}
		else{
			$scope.selectedOrder = {};
			$scope.order = {};
			$scope.orderItems = [];
			$scope.change = 0;
		}
	}
	$scope.printReceipt = function(){
		if(($scope.cash-$scope.order.total_amount)>-1){
			window.print();
			// receiptPrinted = true; // for printing the receipt
		}
		else{
			alert("Not enough money");
		}
	}
	$scope.setOrderPaid = function(){
		$scope.cash = $scope.cash ? $scope.cash : 0;
		if(($scope.change+$scope.cash)>=0){
			// if(receiptPrinted){ // for printing the receipt
				$scope.order.cash = $scope.cash;



				if($scope.order.id){
					dbOperations.processData("orderPaid",$scope.order).then(function(res){
						getUnclaimedOrders();
						$scope.order = {};
						$scope.orderItems = [];
						$scope.cash = "";
						receiptPrinted = false;
						$scope.change = 0;
					})
				}
				else{
					alert("Select order first");
				}
				




			// } // for printing the receipt
			// else{ // for printing the receipt
			// 	alert("Print the receipt first"); // for printing the receipt
			// } // for printing the receipt
			
		}
		else{
			$scope.cash = "";
			alert("Not enough money");
		}
	}
	$scope.logout = function(){
		dbOperations.processData("Logout","").then(function(res){
			window.location.href = '/';
		});
	}




	getUnclaimedOrders();

});
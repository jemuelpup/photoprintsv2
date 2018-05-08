app.controller("reports",function($scope,$http,dbOperations,$interval){
	$scope.selectedDate = new Date();
	$scope.transactions = [];
	$scope.voidTransactions = [];
	$scope.totalSales = 0;
	$scope.transactionNotes = "";
	$scope.voidReason = "";
	$scope.itemSummary = [];
	$scope.reportFilters = [
		{"name":"Daily","id":"d1","val":1},
		{"name":"Weekly","id":"d2","val":2},
		{"name":"Monthly","id":"d3","val":3},
		{"name":"Yearly","id":"d4","val":4},
	];
	$scope.fromdateInput = new Date();
	// $scope.fromdateInput = new Date(2018, 2, 24, 10, 33, 30, 0);// for testing purposes
	$scope.todateInput = new Date(($scope.fromdateInput).getTime() + (24 * 60 * 60 * 1000));


	function getItemSummarySold(){
		dbOperations.getData('GetItemSummarySold',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.itemSummary = res.data;
			console.log(res)
		});
	}
	function getTotalSalesOn(){
		dbOperations.getData('getTotalSales',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.totalSales = res.data;
			// console.log(res);
		});
	}
	function getTransationsOn(){
		dbOperations.getData('getTransationsData',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.transactions = res.data;
			// console.log(res);
		});
	}
	function getVoidTransactionsOn(){
		// console.log("nasa void transactions");
		dbOperations.getData('getVoidTransactionsOn',{
			"from":$scope.fromdateInput,
			"to":$scope.todateInput
		}).then(function(res) {
			$scope.voidTransactions = res.data;
			// console.log(res);
		});
	}
	$scope.getTransactionDetails = function(i){
		$scope.transactionNotes = $scope.transactions[i].notes;
		dbOperations.getData('getOrderData',{"orderID":$scope.transactions[i].id}).then(function(res) {
			$scope.orderItems = res.data;
			// console.log(res);
		});
		// console.log($scope.transactions[i].id);
	}
	$scope.getTransactionData = function(){
		getTotalSalesOn();
		getTransationsOn();
		getVoidTransactionsOn();
	}
	$scope.getVoidReason = function(i){
		$scope.voidReason = $scope.voidTransactions[i].void_reason;
	}
	getTotalSalesOn();
	getItemSummarySold();
	getVoidTransactionsOn();
	getTransationsOn();
});

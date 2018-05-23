var reports = function($scope,$http,dbOperations,$interval){
	$scope.selectedDate = new Date();
	$scope.transactions = [];
	$scope.inventoryReports = [];
	$scope.totalSales = 0;
	$scope.transactionNotes = "";
	$scope.reportFilters = [
		{"name":"Daily","id":"d1","val":1},
		{"name":"Weekly","id":"d2","val":2},
		{"name":"Monthly","id":"d3","val":3},
		{"name":"Yearly","id":"d4","val":4},
	];
	getTotalSalesOn($scope.selectedDate);
	getTransationsOn($scope.selectedDate);
	

	function getTotalSalesOn(selectedDate){
		dbOperations.getData('getTotalSales',{
			"from":new Date(),
			"to":new Date((new Date()).getTime() + (24 * 60 * 60 * 1000))
		}).then(function(res) {
			$scope.totalSales = res.data;
		});
	}
	function getTransationsOn(selectedDate){
		dbOperations.getData('getTransationsData',{
			"from":new Date(),
			"to":new Date((new Date()).getTime() + (24 * 60 * 60 * 1000))
		}).then(function(res) {
			$scope.transactions = res.data;
			// console.log(res);
		});
	}
	$scope.getTransactionNotes = function(i){
		$scope.transactionNotes = $scope.transactions[i].notes;
	}
	$scope.getTransactionData = function(){
		getTotalSalesOn($scope.selectedDate);
		getTransationsOn($scope.selectedDate);
	}
	$scope.voidTransactions = [];

	var fromdateInput = new Date();
	var todateInput = new Date((fromdateInput).getTime() + (24 * 60 * 60 * 1000));

	function getVoidTransactionsOn(){
		console.log("nasa void transactions");
		dbOperations.getData('getVoidTransactionsOn',{
			"from":fromdateInput,
			"to":todateInput
		}).then(function(res) {
			$scope.voidTransactions = res.data;
			// console.log(res);
		});
	}
	function getInventoryEdits(){
		dbOperations.view("GetInventoryActivityLog").then(function(res){
			$scope.inventoryReports = res;
			console.log("nandito na ako");
			console.log($scope.inventoryReports);
		});
	}
	getInventoryEdits();
	getVoidTransactionsOn();
}


var loginEnabled = 1;
var strictModeEnabled = 1;

operations.controller('operator',function($scope,$http,$timeout,dbOperations,systemOperations){

	var newOrderQueued = false;
	var orderPrinted = false;
	$scope.onHardPrintNoDisplay = true;
	/* Testing sessions */
	if(loginEnabled){
		systemOperations.getAccessID().then(function(res){
			if(res.data==='0'){ window.location.href = '/'; }
		});
	}
	if(strictModeEnabled){
		systemOperations.getAccessPosition().then(function(res){
			// console.log(res.data);
			if(!(res.data==='2'||res.data==='6')){ window.location.href = '/'; }
		});
	}
	/* /Testing sessions */
	$scope.itemsWithCategory = [];
	$scope.categoryName = "All";
	$scope.categories = [];
	$scope.orders = [];
	$scope.totalPrice = 0;
	$scope.wordSearch = "";
	$scope.customerName = "";
	$scope.databaseData = {};
	$scope.disableEditting = false;
	$scope.orderID = "";
	$scope.showQueuedMessage = false;
	$scope.orderNotes = "";
	$scope.employeeData = {};
	$scope.selectedCategory = "";
 	dbOperations.view("getEmployeeData",{}).then(function(res){
		console.log("nasa get employee datas");
		console.log(res);
		$scope.employeeData = res;
	},function(res){
		alert(res);
	});
	dbOperations.view("getCategories","").then(function(res) {
 		$scope.categories = res;
 		console.log($scope.categories);
 	})
 	dbOperations.view("getItemsWithCategory","").then(function(res) {
 		console.log("Dumaan dito")
 		$scope.itemsWithCategory = res;
 		console.log($scope.itemsWithCategory);
 	})
	$scope.searchKeyword = function(){
		console.log($scope.wordSearch);
	}
	$scope.addToOrder = function(itemID,quantity=1,itemName,code,discount=0,price){
		// discount = !discount ? 1 : discount;
		if(!newOrderQueued){
			if(quantity==""){ quantity=1; }
			if(discount==""){ discount=0; }
			var itemTotalPrice = (price*quantity*(100-discount)/100);
			if(quantity>0){
				$scope.orders.push({quantity:quantity,itemID:itemID,itemName:itemName,code:code,discount:discount,price:price,itemTotalPrice:itemTotalPrice});
				// $scope.totalPrice += itemTotalPrice;
				updateTotal();
				// processDataprocessData
				this.quantity = "";
				this.discount = "";
			}
			else{
				alert("please enter the right quantity");
			}
			// console.log($scope.orders);
		}
	}
	$scope.customPrice = function(orderIndex,price){
		$scope.orders[orderIndex].price = price;
		// console.log(price);
		updateTotal();
	}
	function updateTotal(){
		$scope.totalPrice = 0;
		($scope.orders).forEach(function(e){
			$scope.totalPrice += (e.price*e.quantity*(100-e.discount)/100);
		});
	}
	$scope.done = function(){
		if(orderPrinted){
			console.log(($scope.orders).length);
			orderData = {};
			$scope.customerName = "";
			$scope.downPayment = "";
			$scope.orders = [];
			$scope.totalPrice = 0;
			newOrderQueued = false;
			$scope.disableEditting = false;
			$scope.showQueuedMessage = false;
			orderPrinted = false;
			$scope.orderNotes = "";
			$scope.onHardPrintNoDisplay = true;
		}
		else{
			alert("Print the order slip first");
		}
	}
	$scope.printOrderSlip = function(){
		if(($scope.orders).length){
			if($scope.disableEditting){
				window.print();
				orderPrinted = true;
			}
			else{
				alert("Save order first");
			}
		}
		else{
			alert("Place order and save it first");
		}
	}
	$scope.saveOrder = function(){
		if(($scope.orders).length){
			$scope.disableEditting = true;
			if(($scope.orders).length){
				if(!newOrderQueued ){//&& false){ // remove the false here
					$scope.downPayment = $scope.downPayment ? $scope.downPayment:0;
					var orderData = {
						cashier_fk:1,//mali ito
						branch_fk:1,//mali ito
						operator_fk:1,//mali ito
						total_amount:$scope.totalPrice,
						customer_name:$scope.customerName,
						down_payment:$scope.downPayment,
						items:$scope.orders,
						notes:$scope.orderNotes
					}
					$scope.showQueuedMessage = true;

					$scope.onHardPrintNoDisplay = false;
					// console.log($scope.showQueuedMessage, "ito yun");

					$timeout(function(){
						$scope.showQueuedMessage = false;

					}, 2000);
					console.log(orderData);
					dbOperations.processData("addOrder",orderData).then(function(res){
						console.log(res);
						$scope.orderID = res.orderID;
						newOrderQueued = true;
					},function(res){
						alert(res);
					});
				}
			}
			
		}
		else{	alert("place order first");	}
	}
	$scope.showCategoryIndex = function(categoryID,categoryName){
		console.log("Dumaan dito: "+categoryID)
		$scope.selectedCategory=categoryID;
		$scope.categoryName = categoryName;
	}
	$scope.removeItem = function(index,itemTotalPrice){
		// $scope.totalPrice -= itemTotalPrice; 
		$scope.orders.splice(index, 1);
		updateTotal();
	}
	$scope.logout = function(){
		dbOperations.processData("Logout","").then(function(res){
			window.location.href = '/';
		});
	}

});
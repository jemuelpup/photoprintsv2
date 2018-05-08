<!DOCTYPE html>
<html>
<head>
	<title>Operator</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="/plugin/materialize-css/dist/css/materialize.min.css">
	<link rel="stylesheet" href="/plugin/materialize/css/materialFont.css">
	<link rel="stylesheet" href="/common/css/common.css">
	<link rel="stylesheet" href="/operator/css/operator.css">
	<script src="/plugin/angular/angular.min.js"></script>
</head>
<body ng-app="operations" ng-controller="operator">
	<div class="container">
		<div class="banner-container">
			<h1>Operator</h1>
			<div class="logout" ng-click="logout()">
				<p>logout</p><i class="material-icons">exit_to_app</i>
			</div>
		</div>
		<ul class="category-list">
			<li ng-click="showCategoryIndex('','All')">All</li>
			<li ng-repeat="category in categories" ng-click="showCategoryIndex(category.id,category.name)">{{category.name}}</li>
		</ul>
		<div class="row">
			<div class='col l7 ms12'>
				<div class="row">
					<div class='col s12'>
						<div class='categories z-depth-2'>
							<div class="data-header">
								<h4 class="left w50p">{{categoryName}}</h4>
								<div class="headerSearch right w50p">
									<input placeholder="Search" id="{{category.categoryName}}" type="text" class="validate" ng-model="itemFilter" ng-focus="focus=true" ng-blur="focus=false">
								</div>
							</div>
							<div class='menu'>
								<table>
									<tr>
										<th>Name</th>
										<th>Code</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Discount(%)</th>
									</tr>
									<tr ng-repeat="item in itemsWithCategory | filter:itemFilter | filter:{category_fk:selectedCategory}">
										<td>{{item.name}}</td>
										<td>{{item.item_code}}</td>
										<td>{{item.price}}</td>
										<td><input ng-model="quantity" type='number'/></td>
										<td><input ng-model="discount" type='number'/></td>
										<td><button ng-click='addToOrder(item.id,quantity,item.name,item.item_code,discount,item.price,itemDesc)'>Add</button></td>
										<td></td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col l5 ms12">
				<div class="row">
					<div class="col s12">
						<div id="section-to-print" class="" ng-class="onHardPrintNoDisplay===true ? 'noDisplayOnHardPrint':''">
							<div class="ordered-items z-depth-2">
								<div class="queuedDataMsg hideOnPrint" ng-class="showQueuedMessage===true ? 'active' : ''">
									<p class="center-align">New orders queued. Print the order slip.</p>
								</div>
								<div class="data-header pr-pb0">
									<div class="showOnPrint center-align">
										<!-- <img src="/common/images/logoForReceipt.png" alt="PHOTOPRINTS"> -->
										<p class="largeLetter">PHOTOPRINTS</p>
									</div>
									<div class="showOnPrint">
										<p class="centerOnPrint pr-mb4">OrderSlip</p>
										<p class="left-align b">Operator name: {{employeeData[0].name}}</p>
										<p class="left-align b largeLetter">Order id: {{orderID}}</p>
									</div>
									<h4 class="hideOnPrint">Ordered Items</h4>
								</div>
								<div class="orders pr-pt0">
									<p class="showOnPrint pr-m0">Cutomer name:</p>
			        		<input placeholder="Customer name" id="customer-name" type="text" class="validate" ng-model="customerName">
			        		<input placeholder="Down payment" id="down-payment" type="number" class="validate hideOnPrint" ng-model="downPayment" min="0">
			        		<h4 class="text14pxOnPrint showOnPrint">Ordered Items</h4>
									<table>
										<tr>
											<th>Item</th>
											<th>Price</th>
											<th>Qty</th>
											<th>Disc</th>
											<th>Total</th>
										</tr>
										<tr ng-repeat="order in orders" class="show-on-hover" ng-init="active = false" ng-class="{'noHover':disableEditting}">
											<td><button class="edit-btn" ng-click="active=true">Edit Price</button>{{order.itemName}}</td>
											<!-- <td>{{order.itemName}}</td> -->
											<td>{{order.price}}
												<div class="customPrice" ng-class="{'active': active === true}">
													<input ng-model="cPrice" type="number" ng-keyup = "customPrice($index,cPrice)">
												</div>
											</td>
											<td> x {{order.quantity}}</td>
											<td>{{order.discount}}%</td>
											<td><span class="b">{{order.price*order.quantity*((1-order.discount/100))}}</span><button class="close-btn" ng-click="removeItem(orders.indexOf(order),order.itemTotalPrice);">x</button></td>
										</tr>
									</table>
									<p class="largeLetter">Total: Php. <span class="b">{{totalPrice}}</span></p>
									<p>Down payment: Php. <span class="b">{{downPayment ? downPayment : 0}}</span></p>
									<p>------------------------</p>
									<textarea class="notes" rows="4" ng-model="orderNotes"></textarea>
									<!-- create table here and remove orders
									{{orders}}
									{{databaseData}} -->
									<div class="hideOnPrint">
										<button ng-click="saveOrder()">Save</button>
										<button ng-click="printOrderSlip()">Print order slip</button>
										<button ng-click="done()">Done</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<!-- <div class="category" ng-repeat=""></div> -->

	<script src="/plugin/jquery/dist/jquery.min.js"></script>
	<script src="/common/js/angularFiles/modules.js"></script>
	<script src="/common/js/angularFiles/services.js"></script>
	<!-- <script src="/common/js/angularFiles/directives.js"></script>
	<script src="/common/js/angularFiles/filters.js"></script> -->
	<script src="/operator/js/operatorController.js"></script>
	<script>
		// $(document).ready(function() {
	 //    Materialize.updateTextFields();
	 //  });
	</script>
		
</body>
</html>
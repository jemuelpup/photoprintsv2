<!DOCTYPE html>
<html>
<head>
	<title>Cashier</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="/plugin/materialize-css/dist/css/materialize.min.css">
	<link rel="stylesheet" href="/plugin/materialize/css/materialFont.css">
	<link rel="stylesheet" href="/common/css/common.css">
	<link rel="stylesheet" href="/operator/css/operator.css">
	<link rel="stylesheet" href="/cashier/css/cashier.css">
	<link rel="stylesheet" href="/cashier/css/print.css">
	<script src="/plugin/angular/angular.min.js"></script>
</head>
<body ng-app="operations" ng-controller="cashier">
	
	<div class="container">
		<div id="addMaterialStock" class="modal addMaterialStock">
			<form ng-submit="addMaterialStock($event)">
				<div class="modal-content">
					<h4>Material: {{editMaterialFields.name}}</h4>
					<div class="input-field col m8 s12">
						<input ng-model="editMaterialFields.addedQuantity" name="quantity" value="0" type="number" class="validate" maxlength="50" step=".01">
						<label for="quantity">quantity</label>
					</div>
					<div class="input-field col m4 s12">
						<button class="waves-effect waves-light btn modal-action" type="submit">Add</button>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn modal-action modal-close" type="reset">Close</button>
				</div>
			</form>
		</div>
		<div class="banner-container">
			<h1>Cashier</h1>
			<div class="logout" ng-click="logout()">
				<p>logout</p><i class="material-icons">exit_to_app</i>
			</div>
		</div>
		<div class="row">
			<div class="col l8 m7 s12">
				<div class="orders">
					<div class="data-header">
						<h4 class="refreshOrders left w50p" ng-click="viewUnclaimedOrders()">Orders <i class="material-icons">refresh</i></h4>
						<div class="headerSearch right w50p">
							<input placeholder="Search" type="text" class="validate" ng-model="orderFilter" ng-focus="focus=true" ng-blur="focus=false">
						</div>
					</div>
					<div class="data-table-container">
						<table class="table-data data-clickable">
							<tr>
								<th>Order id</th>
								<th>Customer name</th>
								<th>Amount</th>
								<th>Down payment</th>
								<th>Operator</th>
								<th>Order date</th>
							</tr>
							<tr ng-repeat="order in orders|filter:orderFilter" ng-click="viewItemsOrdered(order,order.order_line)" ng-class="{'active': order===selectedOrder}">
								<td>{{order.id}}</td>
								<td>{{order.customer_name}}</td>
								<td>{{order.total_amount}}</td>
								<td>{{order.down_payment}}</td>
								<td>{{order.operator_name}}</td>
								<td>{{order.order_date}}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="col l4 m5 s12">
				<div id="section-to-print">
					<div class="order-details">
						<div class="data-header">
							<h4 class="left">Items</h4>
							<div class="headerInput">
								<input placeholder="Cash" type="number" value=0 ng-model="cash" min="0">
							</div>
						</div>
					</div>
					<table>
						<tr>
							<th>Item</th>
							<th>Price</th>
							<th>Qty</th>
							<th>Disc</th>
							<th>Total</th>
						</tr>
						<tr ng-repeat="orderItem in orderItems">
							<td>{{orderItem.name}}</td>
							<td>{{orderItem.price}}</td>
							<td> x {{orderItem.quantity}}</td>
							<td>{{orderItem.discount}}%</td>
							<td>{{orderItem.price*orderItem.quantity*(100-orderItem.discount)/100}}</td>
						</tr>
					</table>
					<p>Total: Php. {{order.total_amount}}</p>
					<p>Down payment: Php. {{order.down_payment}}</p>
					<p>Cash: Php. {{cash}}</p>
					<p>Change: Php. <span>{{ cash + change}}</span></p>
					<p>------------------------</p>
				</div>
				<div class="row">
					<div class="col s12 mb10">
						<button class="btn waves-effect waves-light" name="action" ng-click="setOrderPaid(order.id);">Paid<i class="material-icons right">payment</i></button>
					</div>
				</div>
				<div class="row">
					<input type="text" placeholder="Void reason" ng-model="voidReason">
					<button class="btn waves-effect waves-light right" name="action" ng-click="setOrderVoid(order.id);">Void<i class="material-icons right">cancel</i></button>
				</div>
				<div class="row">
					<div class="col s12">
						<a href="reports.html" class="btn waves-effect waves-light">Report<i class="material-icons right">book</i></a>
						<a href="inventory.html" class="btn waves-effect waves-light">Inventory<i class="material-icons right">book</i></a>
					</div>
				</div>
			</div>
		</div>
		<div class="row">  
			<div class="col s12">
				<div class="materialList">
				    <h3>material list</h3>
				    <div class="data-table-container">
				        <table class="data-clickable">
				            <tbody>
				                <tr>
				                    <th>name</th>
				                    <th>description</th>
				                    <th>quantity</th>
				                </tr>
				                <tr ng-repeat="material in materials" ng-click="materialIndex(material)" ng-class="{'active': material == editMaterialFields}">
				                    <td>{{material.name}}</td>
				                    <td>{{material.description}}</td>
				                    <td>{{material.quantity}}</td>
				                </tr>
				            </tbody>
				        </table>
				    </div>
				    <button class="waves-effect waves-light btn" ng-click="addMaterialStockTrigger()">Add Stock</button>
				</div>
			</div>
		</div>
	</div>

	
	<script src="/plugin/jquery/dist/jquery.min.js"></script>
	<script src="/plugin/materialize-css/dist/js/materialize.min.js"></script>
	<script src="/common/js/angularFiles/modules.js"></script>
	<script src="/common/js/angularFiles/services.js"></script>
	<!-- <script src="/common/js/angularFiles/directives.js"></script> -->
	<script src="/common/js/angularFiles/filters.js"></script>
	<!-- <script src="/common/js/angularFiles/controllers.js"></script> -->
	<script src="/cashier/js/cashierController.js"></script>
	<script>
		// $(document).ready(function() {
	 //    Materialize.updateTextFields();
	 //  });
	</script>

</body>
</html>
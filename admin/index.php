<?php
	include 'modals.php';
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Photoprints Admin</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/plugin/materialize-css/dist/css/materialize.min.css">
		<link rel="stylesheet" href="/plugin/materialize/css/materialFont.css">
		<link rel="stylesheet" href="/common/css/common.css">
		<link rel="stylesheet" href="/admin/css/style.css">
		<script src="/plugin/angular/angular.min.js"></script>
	</head>
	<body ng-app="photoPrints" ng-controller="adminController">
		<header>
			<div class="sidenav fixed" ng-class="sideNavActive ? 'active':''">
				<h1><img src="/common/images/logo.png" alt=""></h1>
				<ul class="navigation">
					<li ng-controller="productManagement">
						<a href="#" class="product-management-btn" ng-click="shadowClick()"><i class="small material-icons">note_add</i><span>Product management</span></a>
					</li>
					<li ng-controller="employeeManagement">
						<a href="#" class="employee-management-btn" ng-click="employeeManagementInit();shadowClick()"><i class="small material-icons">person</i><span><span>Employee management</span></a>
					</li>
					<li ng-controller="buisnessManagement">
						<a href="#" class="buisness-management-btn" ng-click="shadowClick()"><i class="small material-icons">business</i><span><span>Buisness management</span></a>
					</li>
					<li ng-controller="reports">
						<a href="#" class="reports-btn" ng-click="shadowClick()"><i class="small material-icons">library_books</i><span><span>Reports</span></a>
					</li>
					<li ng-controller="reports">
						<a href="#" class="inventory-btn" ng-click="shadowClick()"><i class="small material-icons">storage</i><span><span>Inventory</span></a>
					</li>
				</ul>
			</div>
		</header>
		<main>
			<div class="navBarShadow" ng-click="shadowClick()" ng-class="sideNavActive ? 'active':''"></div>
			<div class="banner-area">
				<div class="container">
					<p class="menu-btn showOnSP"><i class="material-icons showOnSP menu" ng-click="menuClick()">menu</i></p>
					<div class="banner">
						<h2>Point of sale System</h2>
						<div class="logout" ng-click="logout()">
							<p>logout</p><i class="material-icons">exit_to_app</i>
						</div>
					</div>	
				</div>
			</div>
			<section class="product-management" ng-controller="productManagement">
				<div class="container">
					<h2>Product management</h2>
					<div class="row">
						<div class="col s12">
							</edit-category></edit-category>
							<div class="row">
								<div class="col m6 s12">
									<add-category></add-category>
										</div>
									<div class="col m6 s12">
										<category-list></category-list>
									</div>
							</div>
						</div>
						<div class="col s12">
							<div class="row">
								<div class="col m6 s12">
									<add-item></add-item>
								</div>
								<div class="col m6 s12">
									<edit-item></edit-item>
									<item-list></item-list>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="employee-management" ng-controller="employeeManagement">
				<div class="container">
					<h2>Employee management</h2>
					<div class="row">
						<div class="col s12" ng-controller="buisnessManagement">
							<add-employee></add-employee>
							<add-access></add-access>
							<a class="btn-floating btn-large waves-effect waves-light fixed-bottom-right" ng-click="newEmployee()"><i class="material-icons">add</i></a>
						</div>
						<div class="col s12">
							<employee-list></employee-list>
						</div>
					</div>
				</div>
			</section>
			<section class="buisness-management" ng-controller="buisnessManagement">
				<div class="container">
					<h2>Buisness management</h2>
					<div class="row">
						<div class="col s12">
							<div class="branch-list-table">
								<h3>Branch management</h3>
								<div class="row">
							  	<div class="col m6 s12">
							  		<add-branch></add-branch>
								  </div>
								  <div class="col m6 s12">
								  	<edit-branch></edit-branch>
								  	<branch-list></branch-list>
									</div>
							  </div>
						  </div>
						</div>
						<div class="col s12">
							<h3>Employee position management</h3>
							<div class="row">
						  	<div class="col m6 s12">
						  		<add-position></add-position>
							  </div>
							  <div class="col m6 s12">
							  	<editPosition></editPosition>
							  	<position-list></position-list>
								</div>
						  </div>
						</div>
					</div>
				</div>
			</section>
			<section class="reports-management" ng-controller="reports">
				<div class="container">
					<h2>Sales</h2>
					<div class="row">
						<div class="col s12">
							<report-input-fields></report-input-fields>
						</div>
						<div class="col s12">
							<report-transaction-table></report-transaction-table>
						</div>
						<div class="col s12">
							<report-void-transaction-table></report-void-transaction-table>
						</div>
					</div>
				</div>
			</section>
			<section class="inventory-management" ng-controller="inventoryManagement">
				<div class="container">
					<h2>Inventory</h2>
					<div class="row">
						<div class="col s12">
							<div class="row">
								<div class="col m6 s12">
									<add-material></add-material>
								</div>
								<div class="col m6 s12">
									<edit-material></edit-material>
									<material-list></material-list>
								</div>
							</div>
						</div>
						<div class="col s12">
							
						</div>
						<div class="col s12">
							
						</div>
					</div>
				</div>
			</section>


		</main>
		<script src="/plugin/jquery/dist/jquery.min.js"></script>
		<script src="/plugin/materialize-css/dist/js/materialize.min.js"></script>
		<!-- <script src="/common/js/angularFiles/commonController.js"></script> -->
		<script src="/admin/js/angularFiles/modules.js"></script>
		<script src="/admin/js/angularFiles/services.js"></script>
		<script src="/admin/js/angularFiles/directives.js"></script>
		<script src="/admin/js/angularFiles/filters.js"></script>
		
		<script src="/admin/js/angularFiles/controllers.js"></script>
		<script src="/admin/js/angularFiles/controllers/buisnessManagement.controller.js"></script>
		<script src="/admin/js/angularFiles/controllers/productManagement.controller.js"></script>
		<script src="/admin/js/angularFiles/controllers/employeeManagement.controller.js"></script>
		<script src="/admin/js/angularFiles/controllers/reportManagement.controller.js"></script>
		<script src="/admin/js/angularFiles/controllers/inventoryManagement.controller.js"></script>		
		<!-- <script src="/common/js/operations.js"></script> -->
		<script src="/admin/js/main.js"></script>
		<!-- <script src="http://localhost:3000/socket.io/socket.io.js"></script>
		<script>
		  var socket = io();
		</script> -->
	</body>
</html>
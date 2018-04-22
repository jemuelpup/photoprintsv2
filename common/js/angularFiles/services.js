/*
@param:
process(String),
dataInputs(Object), -like in serialize array in jqueyr
callback(Function) - function call after the request
*/
operations.service('dbOperations',function($http){
	// this is responsible for insertion and updating of data
	this.processData = function(process,dataInputs,callback){
		return $http({
			method:"POST",
			url:"/common/functions.php",
			data: {
				'process': process,
				'data': dataInputs
			}
		}).then(function success(res){
			return res.data;
		}, function err(response) {
			return "Something wrong in intranet connection. Check the server.";
	    });
	}
	this.view = function(process,dataInputs){
		return $http({
			method:"POST",
			url:"/common/views.php",
			data: {
				'process': process,
				'data': dataInputs
			}
		}).then(function success(res){
			return res.data;
		}, function myError(response) {
			return "Something wrong in the system";
	  });
	}
	this.unclaimedOrders = function(process,dataInputs){
		return $http({
			method:"POST",
			url:"/common/views.php",
			data: {
				'process': process,
				'data': dataInputs
			}
		}).then(function success(res){
			return res.data;
		}, function myError(response) {
			return "Something wrong in the system";
	    });
	}
	this.items = function(process,dataInputs){
		return $http({
			method:"POST",
			url:"/common/views.php",
			data: {
				'process': process,
				'data': dataInputs
			}
		}).then(function success(res){
			var categorieInQueries = [];
			var prevVal = 0;
			var itemArray = [];
			var categoryID = "";
			var categoryName = "";
			// console.log(res);
			(res.data).forEach(function(e, idx, array){
				// console.log(idx,array);
				if(prevVal==0){
					prevVal=e.category_fk;
					categoryID = e.category_fk;
					categoryName = e.category_name;
				}
				if (idx === array.length - 1){// check if last iteration
					// console.log(prevVal+"!="+e.category_fk,"ito yung last")
					if(prevVal!=e.category_fk){ //pag different category,
						categorieInQueries.push({categoryID:categoryID,categoryName:categoryName,items:itemArray});
						itemArray = [];
						itemArray.push(e);
						categorieInQueries.push({categoryID:e.category_fk,categoryName:e.category_name,items:itemArray});
					}
					else{
						itemArray.push(e);
						categorieInQueries.push({categoryID:categoryID,categoryName:categoryName,items:itemArray});
					}
				}
				else if(prevVal!=e.category_fk){
					categorieInQueries.push({categoryID:categoryID,categoryName:categoryName,items:itemArray});
					itemArray = [];
					categoryID = e.category_fk;
					categoryName = e.category_name;
					prevVal=e.category_fk;
					itemArray.push(e);
				}
				else{// first iteration and equal categories
					itemArray.push(e);
				}
			});

			// console.log(itemArray);
			return categorieInQueries;
		}, function myError(response) {
			// console.log("Error");
	    });
	}
	this.access = function(dataInputs){
		return $http({
			method:"POST",
			url:"/common/login.php",
			data: {
				'data': dataInputs
			}
		}).then(function success(res){
			return res.data;
		}, function myError(response) {
			return "Something wrong in the system";
	    });
	}
	this.getData = function(process,date){
		return $http({
			method:"POST",
			url:"/admin/view.php",
			data: {
				'process': process,
				'data': date
			}
		}).then(function success(res){
			return res;
		}, function myError(response) {
			return 0;
	    });
	}
});

operations.service('systemOperations',function($http){
	this.getAccessID = function(){
		return $http({
			method:"POST",
			url:"/common/functions.php",
			data: {
				'process': "getID",
				'data': ""
			}
		}).then(function success(res){
			return res;
		}, function myError(response) {
			// console.log("Error");
	    });
	}
	this.getAccessPosition = function(){
		return $http({
			method:"POST",
			url:"/common/functions.php",
			data: {
				'process': "getAccessPosition",
				'data': ""
			}
		}).then(function success(res){
			return res;
		}, function myError(response) {
			// console.log("Error");
	    });
	}
});
/*
@param:
process(String),
dataInputs(Object), -like in serialize array in jqueyr
callback(Function) - function call after the request
*/
app.service('dbOperations',function($http){
	this.processData = function(process,dataInputs){
		return $http({
			method:"POST",
			url:"/admin/functions.php",
			data: {
				'process': process,
				'data': dataInputs
			}
		}).then(function success(res){
			return res;
		}, function myError(response) {
			return 0;
	    });
	}
	this.views = function(process,data){
		return $http({
			method:"POST", url:"/admin/view.php",
			data: { 'process': process,
					'data':data 
			}
		}).then(function success(res){
			return res.data;
		},function error(){
			alert("something went wrong.");
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

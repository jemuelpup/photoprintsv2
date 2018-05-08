app.filter('shortDateFromat',function(){
	return function(date){
		return date.toString().substring(4,15);;
	}
});

app.filter('gender',function(){
	return function(gender){
		return gender==1 ? "Male" : "Female";
	}
});

// app.filter('ucFirst',function(){
// 	return function(str){
// 		if(str.length())
// 			return str.replace(/^./, str[0].toUpperCase());
// 		return '';
// 	}
// });

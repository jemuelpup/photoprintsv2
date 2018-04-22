$(document).ready(function(){
	$(".input-snippet").click(function(){
		$("#code-input").text($(this).html().replace(/\t/g,""));
	});
	$(".data-table").click(function(){
		$("#data-table-code").text($(this).html().replace(/\t/g,""));
	});
	
	$(".generate-code").click(function(){
		var createQueryText = $(".createQueryText").val();
		// console.log(createQueryText);
		$.post("toolDevelopment.php",
		{
			createQuery: createQueryText
		},
		function(data,status){
			console.log(data);
			$(".code-snippet").html($.parseJSON(data).htmlForms);
			$(".selectQuery").text($.parseJSON(data).selectQuery);
			$(".insertQuery").text($.parseJSON(data).insertQuery);
			$(".updateQuery").text($.parseJSON(data).updateQuery);
			$(".updateQueryStoredProcedure").text($.parseJSON(data).updateQueryStoredProcedure);
			$(".data-table").html($.parseJSON(data).dataTable);
			$(".view-data-table-function").text($.parseJSON(data).viewDataTableFunc);
			$(".views-update-modal-code").text($.parseJSON(data).viewHTMLModalUpdate);
		});
	});
	
});
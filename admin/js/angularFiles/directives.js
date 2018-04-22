app.directive("employeeModal",function(){
	return {
		template:`
			<div id="add-employee" class="modal">
			    <div class="modal-content">
			        <div class="input-field col s12">
			            <input placeholder="" name="name" value="" type="text" class="validate" maxlength="100" required>
			            <label for="name">name</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="address" value="" type="text" class="validate" maxlength="50">
			            <label for="address">address</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="contact_number" value="" type="text" class="validate" maxlength="50">
			            <label for="contact_number">contact_number</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="email" value="" type="text" class="validate" maxlength="50">
			            <label for="email">email</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="position_fk" value="" type="number" class="validate" maxlength="11">
			            <label for="position_fk">position_fk</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="branch_fk" value="" type="number" class="validate" maxlength="11">
			            <label for="branch_fk">branch_fk</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="salary" value="" type="number" class="validate" maxlength="11" required>
			            <label for="salary">salary</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="birth_day" value="" type="text" class="validate" maxlength="">
			            <label for="birth_day">birth_day</label>
			        </div>
			        <div class="input-field col s12">
			            <input placeholder="" name="gender" value="1" type="number" class="validate" maxlength="1" required>
			            <label for="gender">gender</label>
			        </div>
			    </div>
			    <div class="modal-footer">
			        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
			    </div>
			</div>
		`
	};

});
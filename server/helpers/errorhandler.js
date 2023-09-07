'use strict';

module.exports = {

	manageError(er,type) {
		
		if(type == 400){
			return manageResponseError(er);
		}	

		if(type == 422){
			return manageResponseError(er);
		}

		return er;
	}
}

function manageResponseError(er) {

	var message = "";
	var formError = [];
   
	if(er.hasOwnProperty('details')){
		if(er.details.hasOwnProperty('messages')){
			message = JSON.stringify(er.details.messages);	
		}
			
	}
	else
	{
		 formError.push(er.message);
		 message = JSON.stringify({form:formError});
	}	

	var e = {message:message,status:er.status}
	return e;
}
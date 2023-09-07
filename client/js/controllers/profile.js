angular
  .module('pdp')
  .controller('ProfileController', ['$scope', 'AuthService', '$state', 'SubDomainService','$urlRouter','SpinnerService','Users','Authentication', 'Factory', 'Services', 'SpinnerService', 'ModalService',  
      function($scope, AuthService, $state, SubDomainService, $urlRouter, SpinnerService, Users, Authentication, Factory, Services, SpinnerService, ModalService) {

        var user;
        var factoryId;
        $scope.showeditbtn = window.enablePersonalDataEdit ? window.enablePersonalDataEdit : false;

        $scope.onLoadedSpinner = function () {
			initializateProfile();
			setUserRole();
        }

		$scope.onClickEdit = function () {
				$scope.hideeditablefields	= !$scope.hideeditablefields;
		}

		$scope.onClickAddressHistory = function () {
			$scope.hideaddresshistory	= !$scope.hideaddresshistory;
		}

		function initializateProfile() {

			$scope.hideeditablefields = true;
			$scope.hideaddresshistory = true;
        	
        	SpinnerService.show('spinner');
	        AuthService.getCurrentUser(function(currentUser){
	           
	            var filter = { where: { id: currentUser.id } };
	            Users.find({filter:filter}).$promise.then(
					function(users) {

		            	Factory.find({filter:{where:{isdefault:true}}}).$promise.then(
		            		function(factories) {
			              		user = users[0];
			              		factoryId = factories[0].id;
								console.log(user);
					            var filter = {
					            	where: {
					            		usersid: user.id,
					            		factory: factoryId,
					            		hrappid: window.hrAppId
					            	}
					            };

					            Services.readAddresses({filter: filter}).$promise.then(
									function(addresses) {
										SpinnerService.hide('spinner');

										$scope.addresses = addresses[0];
										$scope.rowCollection = [].concat($scope.addresses.residence).concat($scope.addresses.domicile).concat($scope.addresses.address);
										$scope.displayCollection = [].concat($scope.rowCollection);

										$scope.userid = user.id;
					              		$scope.username = user.username;
					              		$scope.email = user.email;
					              		$scope.firstname = user.firstname;
					              		$scope.secondname = user.secondname;
					              		$scope.businessname = user.businessname;
					              		$scope.address = user.address;
					              		$scope.telephone = user.telephone;
					              		$scope.fiscalcode = user.fiscalcode;
					              		$scope.vatnumber = user.vatnumber;
					              		$scope.city = user.city;
					              		$scope.province = user.province;
					              		$scope.state = user.state;
						            },
						            function(errorResponse){
						            	SpinnerService.hide('spinner');
						            	$scope.error = JSON.parse(errorResponse.data.message);
						            	var errMsg = JSON.stringify($scope.error)					            	
						            	callModalErrorWithTitleAndMessage("Errore", errMsg);					            	
					            	}
								);
		            		}
		            	);
	              });
	        });
	    }

	    function checkAddresses (addrObj) {
	    	var set = false;
				var check = true;
				for(var i=0;i<addrObj.length;i++){ 
          
					var prop = addrObj[i];
					if (addrObj.hasOwnProperty(prop)) {
						if (!set) {
							set = addrObj[prop] ? true : false;
						} else {
							if (!addrObj[prop]) {
								check = false;
								break;
							}
						}
						
					}
	    	}
	    	return check;
	    }

	    $scope.save = function () {
	    	let datefromResidence = $scope.datepickerFromResidenceOpen.date;
	    	if (datefromResidence) {
	    		datefromResidence.setHours(12, 0, 0, 0);
	    	}
	    	let datefromDomicile = $scope.datepickerFromDomicileOpen.date;
	    	if (datefromDomicile) {
	    		datefromDomicile.setHours(12, 0, 0, 0);
	    	}
	    	let datefromAddress = $scope.datepickerFromAddressOpen.date;
	    	if (datefromAddress) {
	    		datefromAddress.setHours(12, 0, 0, 0);
	    	}

	    	let result = {
	    		usersid: user.id,
	    		factory: factoryId,
	    		email: $scope.email_new,
	    		telephone: $scope.telephone_new,
	    		residence: {
	    			datefrom: datefromResidence,
	    			street: $scope.residence_street_new,
	    			postcode: $scope.residence_postcode_new,
	    			city: $scope.residence_city_new
	    		},
	    		domicile: {
	    			datefrom: datefromDomicile,
	    			street: $scope.domicile_street_new,
	    			postcode: $scope.domicile_postcode_new,
	    			city: $scope.domicile_city_new
	    		},
	    		address: {
	    			datefrom: datefromAddress,
	    			street: $scope.address_street_new,
	    			postcode: $scope.address_postcode_new,
	    			city: $scope.address_city_new
	    		}
	    	};

	    	if (!checkAddresses(result.residence) || !checkAddresses(result.domicile) || !checkAddresses(result.address)) {
	    		callModalErrorWithTitleAndMessage('Attenzione','I campi relativi agli indirizzi devono essere valorizzati in blocco');
	    		return;
	    	}

	    	var data = [];
	    	result.hrappid = window.hrAppId;
	    	data.push(result);
	    	SpinnerService.show('spinner');
	    	Users.updateAttributes({id: user.id}, {telephone: $scope.telephone_new ? $scope.telephone_new : user.telephone, email: $scope.email_new ? $scope.email_new : user.email}).$promise.then(
			    function(user) {

			    	Services.postPersonalData(data).$promise.then(
			    		function (response) {
			    			SpinnerService.hide('spinner');
			    			let msg;
			    			if (!response[0].errMsg) {
			    				msg = 'I dati sono stati salvati correttamente';
			    			} else {
			    				msg = 'Si sono verificati questi errori: ' + response[0].errMsg;
			    			}
			    			callModalOkWithTitleAndMessage('Salvataggio effettuato', msg);	    			
			    		},
			    		function(errorResponse) {
			    			SpinnerService.hide('spinner');
							$scope.error = JSON.parse(errorResponse.data.message);
							callModalErrorWithTitleAndMessage('Salvataggio fallito','Errore: ' + JSON.stringify($scope.error));
					  	}
			    	);

				},function(errorResponse) {
					SpinnerService.hide('spinner');
					$scope.error = JSON.parse(errorResponse.data.message);
					callModalErrorWithTitleAndMessage('Salvataggio fallito','Errore: ' + JSON.stringify($scope.error));
			  	}
		  	);
	    }

		$scope.datepickerFromResidenceOpen = function(datepicker) { 
		  // remove the week and other settings      
		  datepicker.opened = true;
		};

		$scope.datepickerFromDomicileOpen = function(datepicker) { 
		  // remove the week and other settings      
		  datepicker.opened = true;
		};

		$scope.datepickerFromAddressOpen = function(datepicker) { 
		  // remove the week and other settings      
		  datepicker.opened = true;
		};

		function callModalOkWithTitleAndMessage(title,message){
			var inputs = {title:title,text:message};
			ModalService.showModal({
			templateUrl: "../../../views/modals/notifytouserwithok.html",
			controllerjs:"js/controllers/modals/notifytouserwithok.js",
			controller: "notifytouserwithokController",
			inputs:inputs

			}).then(function(modal) {

				modal.element.modal();
			
				modal.close.then(function(result) {
					initializateProfile();
				}); 
			}).catch(function(error) {
				console.log(error);        

			});
	    }


	    function callModalErrorWithTitleAndMessage(title,message){
			var inputs = {title:title,text:message};
			ModalService.showModal({
				templateUrl: "../../../views/modals/error.html",
				controllerjs:"js/controllers/modals/error.js",
				controller: "errorController",
				inputs:inputs

				}).then(function(modal) {

				modal.element.modal();
				modal.close.then(function(result) {
					
				}); 
			}).catch(function(error) {
			console.log(error);        

			});
	    }

		function setUserRole (){

	    	AuthService.getCurrentUser(function(currentUser){
	           
	            var filter = { where: { id: currentUser.id } };
	            Users.find({filter:filter}).$promise.then(
	              function(users) {
	              		var user = users[0];
	              		$scope.currentRoles = [];
	              		var filterForAuth = {};
	              		Authentication.find({filter:filterForAuth}).$promise.then(
	              		function(roles) {
	              			$scope.roles = [];
	              			var userRoleIds = user.roleids.split("|");
							console.log(userRoleIds);

							for(var i=0; i<roles.length; i++){ 
								var r = roles[i];
								$scope.roles.push(r.name);
								
								for(var g=0; g<userRoleIds.length; g++){ 
									u = userRoleIds[g];
	              					var rs = r.id.toString();
	              					if(u===rs){
	              						$scope.currentRoles.push(r.name);
	              					}
	              				}
							}

						});
						
			   			 
	              		
	              });
	        });
		}

	    $scope.activeChange = function(){
	    	console.log($scope.active);
	    }


      	
}])
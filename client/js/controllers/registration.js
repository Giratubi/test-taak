angular
  .module('pdp')
  .controller('RegistrationController',  ['$scope','$rootScope', 'AuthService', '$state','Messages','$urlRouter', 'Users', '$cookieStore','ModalService','$timeout','Company','SpinnerService','Gateway','Gatewayspositions','Connector','Rele','Gatewayradius','Sensorvalue','$interval','$timeout',
   function($scope,$rootScope, AuthService, $state, Messages, $urlRouter, Users, $cookieStore,ModalService,$timeout,Company,SpinnerService,Gateway,Gatewayspositions,Connector,Rele,Gatewayradius,Sensorvalue,$interval,$timeout) {
      
     console.log("A SON CHE registrazione")





      //public_vars.$pageLoadingOverlay.addClass('loaded');

    $rootScope.isLoginPage        = true;
    $rootScope.isLightLoginPage   = false;
    $rootScope.isLockscreenPage   = false;
    $rootScope.isMainPage         = false;


    

    var opts = {
          "closeButton": true,
          "debug": false,
          "positionClass": "toast-bottom-right",
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        };


    initializate()


    function initializate(){


     		$scope.usertype = [{id:0,type:'Utente Privato'},
     							{id:1,type:'Azienda'}]

     	    $scope.usertypeselected = $scope.usertype[0]

    } 


    $scope.registration = function(){


    		//console.log("REGISTRATION",$scope.vatnumber)

    		// PRIVATO 

    		if($scope.usertypeselected.id == 0 ){

    			if($scope.firstname == null ){
	                 toastr.error("Non è stata inserito un nome corretto", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.secondname == null ){
	                 toastr.error("Non è stata inserito un cognonome corretto", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.fiscalcode == null ){
	                 toastr.error("Non è stato inserito un codice fiscale", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.password == null ){
	                 toastr.error("Non è stata inserita la password", "Avviso",opts);
	                 
	                 return;
	            }

    			var filtervat = {where:{vatnumber:$scope.fiscalcode}}

	    		Company.find({filter:filtervat}).$promise.then(function(companyfind) { 
	    			

	    			if(companyfind.length <=0){

	    			
	    			    var obj = {
			        		name:$scope.firstname + ' ' + $scope.secondname,
			        		address:null,
			        		vatnumber:$scope.fiscalcode,
			        		email:null,
			        		companytypeId:3
			        	}

			        	Company.create(obj).$promise.then(function(company){ 			        		 


			        		Users.find().$promise.then(function(response) {			        			    			

				    			var resprev = response.reverse();				    			  				

				    			var obj = [{

					        		id:resprev[0].id + 1,
					    			roleids : 3,    			
					    			firstname: $scope.firstname,
					    			secondname: $scope.secondname,		    			
					    			state : "state",
					    			style : "DS",
			                        active: true,
					    			username: $scope.email,
					    			email: $scope.email,
					    			password: $scope.password,
					    			authenticationId : 3,
			                        companyId:company.id    			
					    		
					    		}]; 					    		
    		
	    						Users.inserts(obj).$promise.then(function(resin){ 

	    							$scope.firstname = ''
	    							$scope.secondname = ''
	    							$scope.email = ''	
	    							$scope.password = ''
	    							$scope.fiscalcode = ''

	    							toastr.success("Registrazione avvenuta correttamente", "Avviso",opts);

	    							$timeout(function(){

	    								 $state.go('login');

	    							},2500, false);	
			        			})

			        		})
			        	})


	    			}else{

	    				Users.find().$promise.then(function(response) {			        			    			

				    			var resprev = response.reverse();				    			  				

				    			var obj = [{

					        		id:resprev[0].id + 1,
					    			roleids : 3,    			
					    			firstname: $scope.firstname,
					    			secondname: $scope.secondname,		    			
					    			state : "state",
					    			style : "DS",
			                        active: false,
					    			username: $scope.email,
					    			email: $scope.email,
					    			password: $scope.password,
			                        companyId:companyfind[0].id    			
					    		
					    		}]; 					    		
    		
	    						Users.inserts(obj).$promise.then(function(resin){ 

	    							$scope.firstname = ''
	    							$scope.secondname = ''
	    							$scope.email = ''	
	    							$scope.password = ''
	    							$scope.fiscalcode = ''
	    							
	    							toastr.success("Registrazione avvenuta correttamente", "Avviso",opts);

	    							$timeout(function(){

	    								 $state.go('login');

	    							},2500, false);

			        			})

			        		})


	    			}

	    		})
    		}

    		// AZIENDA

    		if($scope.usertypeselected.id == 1 ){

    			if($scope.firstname == null ){
	                 toastr.error("Non è stata inserito un nome corretto", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.secondname == null ){
	                 toastr.error("Non è stata inserito un cognonome corretto", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.companyname == null ){
	                 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.vatnumber == null ){
	                 toastr.error("Non è stato inserito un partita iva azienda", "Avviso",opts);
	                 
	                 return;
	            }

	            if($scope.password == null ){
	                 toastr.error("Non è stata inserita la password", "Avviso",opts);
	                 
	                 return;
	            }

    			var filtervat = {where:{vatnumber:$scope.vatnumber}}

	    		Company.find({filter:filtervat}).$promise.then(function(companyfind) { 
	    			

	    			if(companyfind.length <=0){

	    			
	    			    var obj = {
			        		name:$scope.companyname,
			        		address:null,
			        		vatnumber:$scope.vatnumber,
			        		email:null,
			        		companytypeId:3
			        	}

			        	Company.create(obj).$promise.then(function(company){ 			        		 


			        		Users.find().$promise.then(function(response) {			        			    			

				    			var resprev = response.reverse();				    			  				

				    			var obj = [{

					        		id:resprev[0].id + 1,
					    			roleids : 3,    			
					    			firstname: $scope.firstname,
					    			secondname: $scope.secondname,		    			
					    			state : "state",
					    			style : "DS",
			                        active: true,
					    			username: $scope.email,
					    			email: $scope.email,
					    			password: $scope.password,
					    			authenticationId : 3,
			                        companyId:company.id    			
					    		
					    		}]; 					    		
    		
	    						Users.inserts(obj).$promise.then(function(resin){ 

	    							$scope.firstname = ''
	    							$scope.secondname = ''
	    							$scope.email = ''	
	    							$scope.password = ''
	    							$scope.vatnumber = ''
	    							$scope.companyname = ''	

	    							toastr.success("Registrazione avvenuta correttamente", "Avviso",opts);

	    							$timeout(function(){

	    								 $state.go('login');

	    							},2500, false);

			        			})

			        		})
			        	})


	    			}else{

	    				Users.find().$promise.then(function(response) {			        			    			

				    			var resprev = response.reverse();				    			  				

				    			var obj = [{

					        		id:resprev[0].id + 1,
					    			roleids : 3,    			
					    			firstname: $scope.firstname,
					    			secondname: $scope.secondname,		    			
					    			state : "state",
					    			style : "DS",
			                        active: false,
					    			username: $scope.email,
					    			email: $scope.email,
					    			password: $scope.password,
			                        companyId:companyfind[0].id    			
					    		
					    		}]; 					    		
    		
	    						Users.inserts(obj).$promise.then(function(resin){ 

	    							$scope.firstname = ''
	    							$scope.secondname = ''
	    							$scope.email = ''	
	    							$scope.password = ''
	    							$scope.vatnumber = ''
	    							$scope.companyname = ''

	    							toastr.success("Registrazione avvenuta correttamente", "Avviso",opts);

	    							$timeout(function(){

	    								 $state.go('login');

	    							},2500, false);
	    								

			        			})

			        		})


	    			}

    			
    			})
    		}

    		


    }   


      


 





  }])
  .controller('LogoutController', ['$scope', 'AuthService', '$state',
      function($scope, AuthService, $state) {
      /*
      $scope.logout = function() {
        AuthService.logout()
          .then(function() {
            self.alreadyloaded = false;
            console.log('set self.alreadyloaded = false logout'); 
            $state.go('login');
          });
      } 
      */ 
  }]) 
  .controller('SideBarController', ['Messages','$scope', 'AuthService', '$state',
    function(Messages , $scope, AuthService, $state) {
       
     
     
    }
  ])
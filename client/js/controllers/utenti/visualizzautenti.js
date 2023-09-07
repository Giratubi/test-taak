angular.module('pdp').controller('visualizzaUtentiController', ['$scope','$rootScope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$timeout','UsersOperations',
    	function ($scope,$rootScope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$timeout,UsersOperations) {
               
    			

			

			initializate()

			// optioni del toaster
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



			function initializate(){

				SpinnerService.show('spinner'); 

              	//$("#showusers").css('display','none')

              	//$("#showusers_wrapper").css('display','none')  

				AuthService.getCurrentUser(function(currentUser){

	                $scope.current = currentUser

	                console.log("currentUser",currentUser)

	                var filter = {}

	                if(currentUser.roleids == '0'){	                	

	                	filter = {parameter:'users',id:null,companyids:null}
	                }else{	                	

	                	filter = {parameter:'users',id:null,companyids:currentUser.companyId}
	                }


	                Users.findWithFoto(filter).$promise.then(function(users) { 
	                	
	                 
	                    $scope.displayCollection = users;	

	                    SpinnerService.hide('spinner'); 

              			//$("#showusers").css('display','blcok')

              			//$("#showusers_wrapper").css('display','block')                    

	                    // paginatore e campo di ricerca della tabella

	                    $timeout(function(){
					        

							$("#showusers").dataTable({

								retrieve: true,
								aLengthMenu: [
									[ 25, 50, 100, -1], [ 25, 50, 100, "Tutti"]
								],
								language: {
						           info: "Mostra pagina _PAGE_ of _PAGES_",
						           lengthMenu: "Mostra _MENU_ records per riga",
						           paginate: {
									            previous: "Indietro",
									            next:"Avanti",
									            first:"Prima pagina",
									            last:"Ultima pagina"
									           },
								  search: "Cerca"
						        }
							}).yadcf([

								{column_number : 1 , filter_type: 'text',filter_default_label: "Nome"},
								{column_number : 2, filter_type: 'text',filter_default_label: "Cognome"},
								{column_number : 3, filter_type: 'text',filter_default_label: "Azienda"},
								{column_number : 4, filter_type: 'text',filter_default_label: "Email"},
								{column_number : 5, data: [{value:'true',label:'Attivo'},{value:'false',label:'Disattivato'}], filter_default_label: "Seleziona Stato"}
								

							],{ filters_tr_index: true });
					    }, 50, false);

					    // fine paginatore e search
	                    

	                });

	            })

			}



			$scope.editUser = function(user){

					var inputs = {inputs:user}

		            ModalService.showModal({
		                  templateUrl: "../../../views/modals/dettagliutente.html",
		                  controllerjs:"js/controllers/modals/dettagliutente.js",
		                  controller: "dettagliUtenteController",
		                  inputs:inputs

		                }).then(function(modal)   {

		                    modal.element.modal();
		                    modal.close.then(function(result) { 



		                    initializate();
		                    
		                    
		                  }); 
		               }).catch(function(error) {
		               console.log(error);        
		              
		            });
					
					//toastr.error("So me by marianne admitted speaking.", "This is a title", opts);
			}


			$scope.switchuser = function(user){
	           

	            if(user.active == true){             
	        
	                
	                Users.deactivate({id:user.id}).$promise.then(function(users) {

	                  initializate();

	                  toastr.warning("Utente disattivato", "Avviso",opts);
	                })

	            }else{              
	                

	                Users.activate({id:user.id}).$promise.then(function(users) {

	                   initializate();

	                   toastr.success("Utente attivato", "Avviso",opts);
	                })
	            }

	        }


	        $scope.deleteUser = function(user){

	        	toastr.warning("<br /><br /><div class='text-center'><button type='button' id='yes' class='btn btn-secondary'>Si</button><button type='button' id='no' class='btn btn-secondary'>No</button></div>",'Sicuro di voler cancellare questa area?',
                {
                    closeButton: false,
                    allowHtml: true,
                    positionClass: "toast-bottom-right",          
                    onclick: null,
                    tapToDismiss : false,
                    onShown: function (toast) {
                      $("#yes").click(function(){

                      	console.log("CLICCATO SI ")                      	 

                        
                        Users.deleteById({id:user.id}).$promise.then(function(deleteuser) {

                        	var filter = {where:{userId:user.id}}

                        	toastr.remove(toast);	                       

	                        toastr.success("Utente Eliminato", "Avviso",opts);

	                        initializate()


                        	/*UsersOperations.find({filter:filter}).$promise.then(function(userop) {

	                        	
	                        	if(userop.length > 0){

	                        		for(var uop of userop){

	                        			 UsersOperations.deleteById({id:uop.id}).$promise.then(function(delopuser) {

	                        			 	toastr.remove(toast);

	                       

	                        				toastr.success("Utente Eliminato", "Avviso",opts);

	                        				initializate()

	                        			 })

	                        		}

	                        	}

	                        })*/

                   		})

                      });
                      $("#no").click(function(){
                        
                         toastr.remove(toast);
                      });
                    }

                   
                })


	        }

			

			


}])
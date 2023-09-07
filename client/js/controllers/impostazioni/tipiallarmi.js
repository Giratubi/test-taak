angular.module('pdp',['angularFileUpload']).controller('tipiAllarmiController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Alarmtype','$timeout',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Alarmtype,$timeout) {
               

 		// opzioni del toaster
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

	    $scope.isdisabled = false;   // per il pulsante crea

	    initializate()


    	function initializate(){

    		Alarmtype.find().$promise.then(function(alarms) { 
                 
                 $scope.alarms = alarms

              
	            // paginatore e campo di ricerca della tabella

	           

                $timeout(function(){ 

					$("#showalarmtype").dataTable({

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
						{column_number : 0 , filter_type: 'text',filter_default_label: "Nome"},
						{column_number : 1, filter_type: 'text',filter_default_label: "Codice"},
						{column_number : 2, filter_type: 'text',filter_default_label: "Descrizione"}

					],{ filters_tr_index: true });
			    }, 150, false); 

			                     

            });
		}


    	$scope.toggleIcon = function(){

    		$("#iconbtn").toggleClass("fa-plus fa-minus");
    	}


    	$scope.createAlarmType = function(){    		


    		if($scope.name == null || $scope.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.code == null || $scope.code.length <= 0){
    			 toastr.error("Non è stato inserito un codice identificativo", "Avviso",opts);
                 return;
    		}    		


    		var filtercode = {where:{code:$scope.code}}

    		Alarmtype.find({filter:filtercode}).$promise.then(function(alarms) { 
               

                if(alarms.length > 0){

                	 toastr.error("Il tipo allarme è già presente a sistema", "Avviso",opts);
                	 return;

                }else{

                	$scope.isdisabled = true;


		    		var obj = {
		        		name:$scope.name,
		        		code:$scope.code,		        		      		
		        		description: $scope.description
		        		
		        	}

		        	Alarmtype.create(obj).$promise.then(function(Alarmtype){        		

		        		$scope.name = '';
		        		$scope.code = '';		        		
		        		$scope.description = '';
		        		

		        		toastr.success("Tipo allarme inserito correttamente", "Avviso",opts);      		

		        		$scope.isdisabled = false;

		        		initializate()

		        	});	

                }
                    

            });
        }

    	$scope.editAlarmType = function(alarmtype){

				var inputs = {inputs:alarmtype}

	            ModalService.showModal({
	                  templateUrl: "../../../views/modals/dettaglitipoallarme.html",
	                  controllerjs:"js/controllers/modals/dettaglitipoallarme.js",
	                  controller: "dettagliTipoAllarmeController",
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


}]);
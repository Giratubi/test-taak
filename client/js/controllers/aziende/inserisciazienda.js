angular.module('pdp',['angularFileUpload']).controller('inserisciAziendaController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Companytype','Company',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Companytype,Company) {
               

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

            AuthService.getCurrentUser(function(currentUser){                

                var filter = {}

                if(currentUser.roleids == '0'){  // super admin

                    filter = {where: {id: {inq: [2,3]}}}
                }

                if(currentUser.roleids == '1'){ // admin 
                        
                     filter = {where: {id: {inq: [3]}}}   

                }  
               

        		Companytype.find({filter:filter}).$promise.then(function(companytype) {


                     
                     $scope.companytype = companytype                   

                });
            });

    	}



    	$scope.createCompany = function(){    		


    		if($scope.name == null || $scope.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.address == null || $scope.address.length <= 0){
    			 toastr.error("Non è stato inserito un indirizzo azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.vatnumber == null ){

    			 toastr.error("Non è stato inserita la p.iva azienda in modo corretto", "Avviso",opts);
                 return;
    		}    		

    		if($scope.email == null || $scope.email.length <= 0){
    			 toastr.error("Non è stato inserita la mail azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.companytypeselected == null || $scope.companytypeselected.length <= 0){
    			 toastr.error("Non è stato inserito il tipo azienda", "Avviso",opts);
                 return;
    		}


    		var filtervat = {where:{vatnumber:$scope.vatnumber}}

    		Company.find({filter:filtervat}).$promise.then(function(company) { 

                console.log("company",company)
               

                if(company.length > 0){

                	 toastr.error("L'azienda inserita è già presente a sistema", "Avviso",opts);
                	 return;

                }else{

                	$scope.isdisabled = true;


		    		var obj = {
		        		name:$scope.name,
		        		address:$scope.address,
		        		vatnumber:$scope.vatnumber,
		        		email:$scope.email,        		
		        		description: $scope.description,
		        		companytypeId:$scope.companytypeselected.id
		        	}

		        	Company.create(obj).$promise.then(function(company){        		

		        		$scope.name = '';
		        		$scope.address = '';
		        		$scope.vatnumber = '';
		        		$scope.email = '';
		        		$scope.description = '';
		        		$scope.companytypeselected = []

		        		toastr.success("Azienda inserita correttamente", "Avviso",opts);      		

		        		$scope.isdisabled = false;

		        	});	

                }
                    

            });
               

    	}


}]);
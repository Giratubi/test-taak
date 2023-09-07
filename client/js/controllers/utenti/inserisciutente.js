angular.module('pdp',['angularFileUpload']).controller('inserisciUtenteController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Company',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Company) {
               

   		
    	initializate()	

    	$scope.activateroledesc = false;


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

    		Authentication.find().$promise.then(function(response) { 

    			$scope.roles = response;

    		});



            AuthService.getCurrentUser(function(currentUser){ 
                  

                  var installationcompanyId = null


                  if(currentUser.roleids == '0'){

                     installationcompanyId = null

                  }else{

                    installationcompanyId = currentUser.companyId

                  }

                  Company.find_({installationcompanyId:installationcompanyId}).$promise.then(function(companies) {               
                           
                      $scope.companies = companies.results

                  });
            });


    	}




    	$scope.createUser = function(){  

    		

    		if($scope.firstname == null){

                 toastr.error("il Campo Nome non può essere vuoto", "Avviso",opts);
    			
                 return;
    		}

    		if($scope.secondname == null){
                 toastr.error("il Campo Cognome non può essere vuoto", "Avviso",opts);
    			
                 return;
    		}

    		if($scope.email == null){
                 toastr.error("il Campo Email non può essere vuoto", "Avviso",opts);
    			 
                 return;
    		}

    		if($scope.password == null ){
                 toastr.error("il Campo Password non può essere vuoto", "Avviso",opts);
    			 
                 return;
    		}

    		if($scope.password.length < 6 ){
                 toastr.error("La password deve contenere almeno 6 caratteri", "Avviso",opts);
    			 
                 return;
    		}

    		if($scope.roleselected == null ){
                 toastr.error("Non è stato selezionato un ruoto utente", "Avviso",opts);
    			
                 return;
    		}


            if($scope.companyselected == null ){
                 toastr.error("Non è stata selezionata l'azienda di appartenenza", "Avviso",opts);
                 
                 return;
            }
    	   

           	  		    		
   		

    		Users.find().$promise.then(function(response) {    			

	    			var resprev = response.reverse();	    				

	    			var obj = [{

		        		id:resprev[0].id + 1,
		    			roleids : $scope.roleselected.id,    			
		    			firstname: $scope.firstname,
		    			secondname: $scope.secondname,		    			
		    			state : "state",
		    			style : "DS",
                        active: true,
		    			username: $scope.email,
		    			email: $scope.email,
		    			password: $scope.password,		    			
		    			authenticationId : $scope.roleselected.id,
                        companyId:$scope.companyselected.id	    			
		    		
		    		}];  

		    			

    		
	    		Users.inserts(obj).$promise.then(function(resin){    			
	    			
	    			
                    toastr.success("Utente inserito correttamente", "Avviso",opts);    

	    			$scope.firstname = "";
	    			$scope.secondname = "";
	                $scope.email ="";
	                $scope.password ="";

                    uploader.clearQueue();

                    if($scope.storageRecords.length > 0){

                        for(var s of $scope.storageRecords){
                            
                            s.modelid = resin[0].id;
                            
                        }
                
                        var sto = $scope.storageRecords;                    

                        Pddstorageb.create(sto).$promise.then(function(storage) {                 

                                
                            
                    
                        });

                    }

               

	    		});
	    	});
    	}    	



        $scope.removefile = function(){  

            if($scope.storageRecords.length > 0){ 

                for(var st of $scope.storageRecords) {              

                    var img = { container:"users",
                         file:st.storagefilename

                    }
                    ImportContainer.removeFile(img).$promise.then(function(data) {

                        uploader.clearQueue();
                        $scope.storageRecords = [];                       
                    
                    });
                }

            }else{

                uploader.clearQueue();
                $scope.storageRecords = [];
            }
            
          }



        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '/api/ImportContainers/users/upload',
            formData: [
            { key: 'value' }
            ]
        });

        $scope.storageRecords = []; 

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            
        };
        uploader.onAfterAddingFile = function(fileItem) {
           
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            
        };
        uploader.onBeforeUploadItem = function(item) {
           
        };
        uploader.onProgressItem = function(fileItem, progress) {
           
        };
        uploader.onProgressAll = function(progress) {
           
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {

             var storageRecord = {

                filename: response.result.files.file[0].originalFilename,
                storagefilename: response.result.files.file[0].name,
                model: 'users',
                modelid: ''
            };

            $scope.storageRecords.push(storageRecord); 
           
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            uploader.clearQueue();
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        





 }]);


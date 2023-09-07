angular.module('pdp',['angularFileUpload']).controller('dettagliUtenteController', ['$scope','$state','AuthService','ModalService','Factory','SpinnerService','close','inputs','ImportContainer','FileUploader','Pddstorageb','Users',
      function ($scope,$state,AuthService, ModalService, Factory, SpinnerService,close,inputs,ImportContainer,FileUploader,Pddstorageb,Users) {


      	console.log("son dentro dettagli cliente",inputs)




        $scope.firstname = inputs.firstname
        $scope.secondname = inputs.secondname
        $scope.email = inputs.email
        $scope.foto = inputs.pddstorageb

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
       

      	//initializate();

        $scope.uploader_ = new FileUploader({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '/api/ImportContainers/users/upload',
            formData: [
            { key: 'value' }
            ]
        });

        var uploader_ = $scope.uploader_ 

        $scope.storageRecords = [];  
      

        $scope.deleteImage = function(sto){

            Pddstorageb.deleteById({id:sto.id}).$promise.then(function(deletedimage) {
        
                
                    $scope.foto  = $scope.foto.filter(el => {
                              
                          if(el.id == sto.id) {    
                            return false;
                          }                  
                          return true; 
              
                    });                                          

                    var img = { container:"users",
                         file:sto.storagefilename

                    }

                    ImportContainer.removeFile(img).$promise.then(function(data) {

                    console.log("FILE CANCELLATO",data);
                    
                    });
          
            });

        }

      

        $scope.updateUser = function(){

            if($scope.firstname == null || $scope.firstname.length == 0){
                 toastr.error("Non è stato inserito un nome corretto", "Avviso",opts);
                 return;
            }  

            if($scope.secondname == null || $scope.secondname.length == 0){
                 toastr.error("Non è stato inserito un cognome corretto", "Avviso",opts);
                 return;
            }  


            
           


            var obj = {id:inputs.id,
                        firstname:$scope.firstname,
                        secondname:$scope.secondname 
                      }
           

              Users.updateAttributes({id:inputs.id},obj).$promise.then(function(main) {

              

                if($scope.storageRecords.length >0){  // se hanno inserito un allegato

                    for(var s of $scope.storageRecords){
                        
                        s.modelid = main.id;
                        
                    }
            
                    var sto = $scope.storageRecords;

                    Pddstorageb.create(sto).$promise.then(function(storage) {                        
                            
                                                   
                           
                    });
                }        
          
                toastr.success("Utente aggiornato correttamente", "Avviso",opts);    

                close(200);
                 

            });
        }        


      

      // questa è la remove file nel loader 

      $scope.removefile = function(item){           

          if($scope.storageRecords.length > 0){

              for (let i = 0; i < $scope.storageRecords.length; i++) {

                  var img = { container:"users",
                       file:$scope.storageRecords[i].storagefilename

                  }

                  ImportContainer.removeFile(img).$promise.then(function(data) {

                     uploader_.clearQueue();     
                  
                });
              }

          }else{
              uploader_.clearQueue();
          }

      }



       

      





   // CALLBACKS

        uploader_.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            
        };
        uploader_.onAfterAddingFile = function(fileItem) {
           
        };
        uploader_.onAfterAddingAll = function(addedFileItems) {
            
        };
        uploader_.onBeforeUploadItem = function(item) {
           
        };
        uploader_.onProgressItem = function(fileItem, progress) {
           
        };
        uploader_.onProgressAll = function(progress) {
           
        };
        uploader_.onSuccessItem = function(fileItem, response, status, headers) {

             var storageRecord = {

                filename: response.result.files.file[0].originalFilename,
                storagefilename: response.result.files.file[0].name,
                model: 'users',
                modelid: ''
            };

            $scope.storageRecords.push(storageRecord); 
           
        };
        uploader_.onErrorItem = function(fileItem, response, status, headers) {
            
        };
        uploader_.onCancelItem = function(fileItem, response, status, headers) {
            uploader.clearQueue();
        };
        uploader_.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader_.onCompleteAll = function() {
            console.info('onCompleteAll');
        };




      	


      	


}]);
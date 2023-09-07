angular
  .module('pdp')
  .controller('LoginController', ['$scope','$rootScope', 'AuthService', '$state', 'Factory','$urlRouter','SpinnerService','ModalService','$location','$pageLoadingBar','$timeout',
      function($scope, $rootScope,AuthService, $state, Factory, $urlRouter, SpinnerService,ModalService,$location,$pageLoadingBar,$timeout) {
  
    

    $rootScope.isLoginPage        = true;
    $rootScope.isLightLoginPage   = false;
    $rootScope.isLockscreenPage   = false;
    $rootScope.isMainPage         = false;

    console.log("SONO NEL AUTH CONTROLLER")


    showLoadingBar(0)

     $scope.goToRegistration = function(){

         $state.go('registration');
      }

    $scope.requestresetpassword = function(){

      $state.go('requestpasswordreset');  

    }
   

    $scope.login = function() {
      //SubDomainService.setNewRoutingApiForSubDomain($scope.selectedFactory.url, $scope.username);
      //SpinnerService.show('spinner');
      AuthService.login($scope.username, $scope.password, $scope.rememberMe)
        .then(function() {          

          showLoadingBar({
                    delay: .5,
                    pct: 100,
                    resetOnEnd: true,
                    finish: function(){

                      // Redirect after successful login page (when progress bar reaches 100%)

                        $state.go('app.dashboard-variant-1');  

                         //console.log("caricato state")
                      
                        }
                  });

        
         

          
         // SpinnerService.hide('spinner');

        },function(errorResponse) {
        
          $scope.error = JSON.parse(errorResponse.data.message); 

          $scope.error = $scope.error.form[0]; 

           console.log("$scope.error",$scope.error) 
           //SpinnerService.hide('spinner');    
      
        });
    };


    $scope.userNameBlur = function() {

      var username = $scope.username;
      //SpinnerService.show('spinner');
      $scope.listFactoryWithUsername = Factory.listFactoryWithUserName({userName:username}).$promise.then(
        function(listOfFactory) {
           SpinnerService.hide('spinner');
           $scope.listOfFactory = listOfFactory;
           $scope.selectedFactory = listOfFactory[0];
           $scope.showFactorySelector = listOfFactory.length > 1;
        },
        function(errorResponse) {
         // SpinnerService.hide('spinner');
          $scope.error = JSON.parse(errorResponse.data.message);  
          return $q.reject(responseError);
        });
    };
   
   /* $scope.resetPassword = function() {
      
        AuthService.resetPassword($scope.username).then(function() {

            var inputs = {title:'Email cambio password',text:'Mail inviata con successo'};
                        ModalService.showModal({
                        templateUrl: "../../../views/modals/notifytouserwithok.html",
                        controller: "notifytouserwithokController",
                        controllerjs:"js/controllers/modals/notifytouserwithok.js",
                        inputs:inputs

                      }).then(function(modal) {

                          modal.element.modal();
                          modal.close.then(function(result) {
                                    $scope.email = ""; 
                                    $scope.password = "";
                                    $scope.confirmpassword = "";
                                    $state.go('login');                                    
                                              
                                }); 
                          }).catch(function(error) {
                         console.log(error);        
                        
                      });


        },function(errorResponse) {
           $scope.error = JSON.parse(errorResponse.data.message);  
           callModalErrorWithTitleAndMessage('Errore',JSON.stringify($scope.error));
        });     
     
    };

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

    $scope.setPassword = function() {

        console.log($scope.password);
        console.log($scope.confirmPassword);
        

        if($scope.password == $scope.confirmPassword){
          
          var token = $location.search().access_token;
          console.log('TOKEN',token);
          AuthService.setNewPassword(token,$scope.password).then(function() {

               var inputs = {title:'Password cambiata',text:'La password è stata cambiata con successo'};
                          ModalService.showModal({
                          templateUrl: "../../../views/modals/notifytouserwithok.html",
                          controllerjs:"js/controllers/modals/notifytouserwithok.js",
                          controller: "notifytouserwithokController",
                          inputs:inputs

                        }).then(function(modal) {

                            modal.element.modal();
                            modal.close.then(function(result) {
                                      $scope.email = ""; 
                                      $scope.password = "";
                                      $scope.confirmpassword = "";
                                      $state.go('login');                                    
                                                
                                  }); 
                            }).catch(function(error) {
                           console.log(error);        
                          
                        });
          },function(errorResponse) {
             $scope.error = JSON.parse(errorResponse.data.message);  
             callModalErrorWithTitleAndMessage('Errore',JSON.stringify($scope.error));
          });  

        }
        else{

          var inputs = {title:'Password non coincidenti',text:'Le password devono essere identiche'};
                        ModalService.showModal({
                        templateUrl: "../../../views/modals/notifytouserwithok.html",
                        controller: "notifytouserwithokController",
                        controllerjs:"js/controllers/modals/notifytouserwithok.js",
                        inputs:inputs

                      }).then(function(modal) {

                          modal.element.modal();
                          modal.close.then(function(result) {
                                    $scope.password = "";
                                    $scope.confirmpassword = "";

                                              
                                }); 
                          }).catch(function(error) {
                         console.log(error);        
                        
                      });         
                            
        }
      
      
     
    };*/

  }])
 



angular
  .module('pdp')
  .factory('AuthService', ['Users', '$q', '$rootScope', '$state','$urlRouter', function(
      Users, $q, $rootScope, $state, $urlRouter) {
   
    self.currentUser = {};
    self.alreadyloaded = false;

    function login(username, password, rememberMe) {
      return Users
        .login({rememberMe: rememberMe},{username: username, password: password})
        .$promise
        .then(function(response) {

          if(response.user.active == false){

            console.log("son che errore")

            var err = {data:{code:400,message:'{"form":["Utente Disabilitato"]}'}}
            return $q.reject(err)

          }
          

          self.currentUser = {
              id: response.user.id,
              tokenId: response.id,
              email:  response.user.email,
              activeoperations:response.user.activeoperations,
              messages:response.user.messages,
              username:response.user.username,
              dashboardname:response.user.firstname + " " + response.user.secondname,
              style:response.user.style,
              companyId: response.user.companyId,
              roleids:response.user.roleids
          }



          
        },function(responseError){
          return $q.reject(responseError);
        });
    }

    function logout() {
      console.log('AuthService - LOGOUT')
      return Users
       .logout()
       .$promise
       .then(function() {
       });

        self.currentUser = {};
    }

    function getCurrentUserWithNewMessage(cb){

      Users.getCurrent().$promise.then(function(response) { 
          console.log('MESSAGES',response);
          self.currentUser.messages = response.messages
          cb(self.currentUser);   
      });

    }
  
    function getCurrentUser(cb){

      Users.getCurrent().$promise.then(function(response) {
        
          self.currentUser = {
            id: response.id,
            firstname: response.firstname,
            secondname: response.secondname,
            tokenId: response.id,
            email:  response.email,
            activeoperations:response.activeoperations,
            messages:response.messages,
            username:response.username,
            dashboardname:response.firstname + " " + response.secondname,
            style:response.style,
            companyId: response.companyId,
            roleids : response.roleids
          }

          cb(self.currentUser);       
      },function(responseError){
        var obj = {};
        cb(obj);
        console.log('NON PASSO DI QUA 2');    
      });;
      
    }




    function resetPassword(username){
      return Users.requestResetPassword({username:username}).$promise;
    }    



   function setNewPassword(username,password){
      console.log('email',username);
      var credentials = {username:username,password:password};
      return Users.setNewPassword(credentials).$promise.then(function(response) {}, function (error){
        throw (error);
      });
    }    


    return {
      login: login,
      logout: logout,
      getCurrentUser:getCurrentUser,
      resetPassword:resetPassword,
      setNewPassword:setNewPassword,
      getCurrentUserWithNewMessage:getCurrentUserWithNewMessage
    };

  }]);

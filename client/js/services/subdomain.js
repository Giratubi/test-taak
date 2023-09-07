angular
  .module('pdp') 
  .factory('SubDomainService', ['$q', '$rootScope', '$state', '$cookieStore', function(
    $q, $rootScope, $state, $cookieStore){

  	function setNewRoutingApiForSubDomain(newApiServer, username) {
  		
      angular.module('pdp').config(function(LoopBackResourceProvider) {
        LoopBackResourceProvider.setUrlBase(newApiServer);
      });
  		
      $cookieStore.put(username, {username: username, apiurl: newApiServer});

      return newApiServer;
  	}

  	return {
  		setNewRoutingApiForSubDomain:setNewRoutingApiForSubDomain
  	}

  }]);
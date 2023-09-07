angular.module('pdp').factory('SpinnerService', ['$rootScope', '$state', function () {
          
      var spinners = {};

      function register(data) {
        if (!data.hasOwnProperty('name')) {
          throw new Error("Spinner must specify a name when registering with the spinner service.");
        }
        spinners[data.name] = data;
      }

      function unregister(name) {
        if (spinners.hasOwnProperty(name)) {
          delete spinners[name];
        }
      }
      
      function unregisterGroup(group) {
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          if (spinners[name].group === group) {
            delete spinners[name];
          }
        }
      }

      function unregisterAll() {
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          delete spinners[name];
        }
      }

      function show(name) {

        console.log("name",name)
        var spinner = spinners[name];
        if (!spinner) {
          throw new Error("No spinner named '" + name + "' is registered.");
        }
        spinner.show();
      }
      
      function hide(name) {
        console.log("name",name)
        var spinner = spinners[name];
        if (!spinner) {
          throw new Error("No spinner named '" + name + "' is registered.");
        }
        spinner.hide();
      }

      function showGroup(group) {
        var groupExists = false;
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          var spinner = spinners[name];
          if (spinner.group === group) {
            spinner.show();
            groupExists = true;
          }
        }
        if (!groupExists) {
          throw new Error("No spinners found with group '" + group + "'.")
        }
      }

      function hideGroup(group) {
        var groupExists = false;
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          var spinner = spinners[name];
          if (spinner.group === group) {
            spinner.hide();
            groupExists = true;
          }
        }
        if (!groupExists) {
          throw new Error("No spinners found with group '" + group + "'.")
        }
      }

      function showAll() {
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          spinners[name].show();
        }
      }

      function hideAll() {
        for(var i=0;i<spinners.length;i++){
          var name = spinners[i];
          spinners[name].hide();
        }
      }
    
     return {
          _register: register,
          _unregister: register,
          _unregisterGroup: unregisterGroup,
          _unregisterAll:unregisterAll,
          show:show,
          hide:hide,
          showGroup:showGroup,
          hideGroup:hideGroup,
          showAll:showAll,
          hideAll:hideAll
        };

  }]);

function sideNavigation($timeout) {
  return function(scope, element) {
    $timeout(function() {
      console.log('QUA');
      element.metisMenu({
        activeClass: 'open',
        collapseClass: 'collapse',
        collapseInClass: 'in',
        collapsingClass: 'collapsing'
      });
    });
  };
}

function spinner(){
   return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        name: '@?',
        group: '@?',
        show: '=?',
        imgSrc: '@?',
        register: '@?',
        onLoaded: '&',
        onShow: '&?',
        onHide: '&?'
      },
      template: [
        '<div ng-show="show" class="spinner">',
        '  <img ng-if="imgSrc" ng-src="{{imgSrc}}" />',
        '  <ng-transclude></ng-transclude>',
        '</div>'
      ].join(''),
      controller: ['$scope', 'SpinnerService', function ($scope, SpinnerService) {

        // register should be true by default if not specified.
        if (!$scope.hasOwnProperty('register')) {
          $scope.register = true;
        } else {
          $scope.register = $scope.register.toLowerCase() === 'false' ? false : true;
        }

        // Declare a mini-API to hand off to our service so the service
        // doesn't have a direct reference to this directive's scope.
        var api = {
          name: $scope.name,
          group: $scope.group,
          show: function () {
            $scope.show = true;
          },
          hide: function () {
            $scope.show = false;
          },
          toggle: function () {
            $scope.show = !$scope.show;
          }
        };

        // Register this spinner with the spinner service.
        if ($scope.register === true) {
          SpinnerService._register(api);
        }

        // If an onShow or onHide expression was provided, register a watcher
        // that will fire the relevant expression when show's value changes.
        if ($scope.onShow || $scope.onHide) {
          $scope.$watch('show', function (show) {
            if (show && $scope.onShow) {
              $scope.onShow({ SpinnerService: SpinnerService, spinnerApi: api });
            } else if (!show && $scope.onHide) {
              $scope.onHide({ SpinnerService: SpinnerService, spinnerApi: api });
            }
          });
        }

        // This spinner is good to go. Fire the onLoaded expression.
        if ($scope.onLoaded) {
          $scope.onLoaded({ SpinnerService: SpinnerService, spinnerApi: api });
        }
      }]
    };
}

function customScrollbar() {
  
  return {
    restrict: 'A',
    scope: {
      color: '@',
      distance: '@',
      height: '@',
      opacity: '@',
      position: '@',
      scrollTo: '@',
      size: '@',
      start: '@',
      touchScrollStep: '@',
      wheelStep: '@',
      width: '@'
    },
    link: function(scope, element) {
      console.log('addssd');
      element.slimscroll({
        class: 'custom-scrollbar',
        barClass: 'custom-scrollbar-gripper',
        railClass: 'custom-scrollbar-track',
        wrapperClass: 'custom-scrollable-area',
        color: _.get(scope, 'color', '#000'),
        distance: _.get(scope, 'distance', '5px'),
        height: _.get(scope, 'height', '100%'),
        opacity: _.get(scope, 'opacity', 0.3),
        position: _.get(scope, 'position', 'right'),
        scrollTo: _.get(scope, 'scrollTo'),
        size: _.get(scope, 'size', '6px'),
        start: _.get(scope, 'start', 'top'),
        touchScrollStep: _.get(scope, 'touchScrollStep', 50),
        wheelStep: _.get(scope, 'wheelStep', 10),
        width: _.get(scope, 'width', '100%')
      });
    }
  };
}

function mdFormControl() {
  return {
    restrict: 'AC',
    scope: {},
    link: function(scope, element, attrs) {
      var checkValue = function() {
        var hasValue = ((element.val() || '').length > 0);
        element.parent().toggleClass('has-value', hasValue);
      };

      element.bind('focus', function(evt) {
        element.parent().addClass('is-focused');
      });

      element.bind('blur', function(evt) {
        element.parent().removeClass('is-focused');
      });

      element.bind('change', checkValue);

      checkValue();
    }
  };
}

function vectorMap() {
  return {
    restrict: 'A',
    scope: {
      options: '=?',
    },
    link: function(scope, element, attrs) {
      element.vectorMap(angular.merge({}, {
        backgroundColor: "null",
        color: "#fff",
        enableZoom: "true",
        hoverOpacity: "0.7",
        map: "world_en",
        scaleColors: ["#d9230f", "#950e0a"],
        selectedColor: "#777",
        showTooltip: "true",
      }, scope.options));
    }
  };
}

function fitHeight() {
  return {
    restrict: 'A',
    scope: {
      offset: '=?',
    },
    link: function(scope, element, attrs) {
      var offset = parseInt(scope.offset) || 0,
        $window = $(window);
      
      $window.on('resize', function(evt) {
        element.css("height", ($(window).height() - offset) + "px");
        element.css("min-height", ($(window).height() - offset) + "px");
      }).trigger('resize');
    }
  }
}


function stDateRange(){
 
    return {
          restrict: 'E',
          require: '^stTable',
          scope: {},
          templateUrl: '../../views/partials/stDataRange.html',

          link: function (scope, element, attr, table) {
              scope.status = {
                isBeforeOpen: false,
                isAfterOpen: false,
                before: '=',
                after: '='
              }

              var inputs = element.find('input');
              var inputBefore = angular.element(inputs[0]);
              var inputAfter = angular.element(inputs[1]);
              var predicateName = attr.predicate;
             
              [inputBefore, inputAfter].forEach(function (input) {

                  input.bind('focus', function () {
                      var query = {};                         
                      query.before = scope.status.before ? scope.status.before : "=";
                      query.after = scope.status.after ? scope.status.after : "=";
                      table.search(query, predicateName);
                  });
              });

              function open(before) {
                  return function ($event) {
                      $event.preventDefault();
                      $event.stopPropagation();

                      if (before) {
                          scope.status.isBeforeOpen = true;
                      } else {
                          scope.status.isAfterOpen = true;
                      }

                  }
              }
              
              scope.openBefore = open(true);
              scope.openAfter = open();
          }
      }
    
}


angular
  .module("pdp")
  .directive('sideNavigation', sideNavigation)
  .directive('customScrollbar', customScrollbar)
  .directive('mdFormControl', mdFormControl)
  .directive('vectorMap', vectorMap)
  .directive('fitHeight', fitHeight)
  .directive('spinner', spinner)
  .directive('stDateRange', stDateRange)
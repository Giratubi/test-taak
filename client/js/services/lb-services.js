// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' &&
  module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './lb-services';
  //   angular.module('app', [lbServices]);
  //
  module.exports = "lbServices";
}

(function(window, angular, undefined) {
  'use strict';

  var urlBase = "/api";
  var authHeader = 'authorization';

  function getHost(url) {
    var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
    return m ? m[1] : null;
  }
  // need to use the urlBase as the base to handle multiple
  // loopback servers behind a proxy/gateway where the host
  // would be the same.
  var urlBaseHost = getHost(urlBase) ? urlBase : location.host;

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
  var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.Users
 * @header lbServices.Users
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Users` model.
 *
 * **Details**
 *
 * Application Users
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Users",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Users/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Users#findById
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Find a user by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Users/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#find
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Find a user by where clause
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Users",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#deleteById
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Delete user profile in application cause delete all associated entity
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Users/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#login
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Login a user with username and password. AccessToken was generated
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
             *   Default value: `user`.
             *
             *  - `rememberMe` - `boolean` - Whether the authentication credentials
             *     should be remembered in localStorage across app/browser restarts.
             *     Default: `true`.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * The response body contains properties of the AccessToken created on login.
             * Depending on the value of `include` parameter, the body may contain additional properties:
             *   - `user` - `U+007BUserU+007D` - Data of the currently logged in user. (`include=user`)
             *
             */
            "login": {
              params: {
                include: 'user',
              },
              interceptor: {
                response: function(response) {
                  var accessToken = response.data;
                  LoopBackAuth.setUser(
                    accessToken.id, accessToken.userId, accessToken.user);
                  LoopBackAuth.rememberMe =
                    response.config.params.rememberMe !== false;
                  LoopBackAuth.save();
                  return response.resource;
                },
              },
              url: urlBase + "/Users/login",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#logout
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Logout a user and AccessToken released
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `access_token` – `{string=}` - Do not supply this argument, it is automatically extracted from request headers.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "logout": {
              interceptor: {
                response: function(response) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return responseError.resource;
                },
              },
              url: urlBase + "/Users/logout",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#inserts
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Insert a list of users whit role and set Active
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "inserts": {
              isArray: true,
              url: urlBase + "/Users/inserts",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#updateAttributes
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Update properties. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - The id of user that you want change properties
             *
             *  - `properties` – `{Users=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Users/:id/updateAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#deactivate
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Deactivate users by id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - The id of user that you want to deactivate
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "deactivate": {
              url: urlBase + "/Users/:id/deactivate",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#activate
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Activate users by id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - The id of user that you want to activate
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "activate": {
              url: urlBase + "/Users/:id/activate",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#requestResetPassword
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Request password reset. Temporary token generated
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `username` – `{string=}` - The username of the user who want to retrive password
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "requestResetPassword": {
              url: urlBase + "/Users/requestResetPassword",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#setNewPassword
             * @methodOf lbServices.Users
             *
             * @description
             *
             * set NewPassword to user
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "setNewPassword": {
              url: urlBase + "/Users/setNewPassword",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#findWithRole_
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Find Users with roles.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{string=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). 
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "findWithRole_": {
              isArray: true,
              url: urlBase + "/Users/findWithRole_",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#findWithFoto
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Find Users with Pic.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `parameter` – `{string=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). 
             *
             *  - `id` – `{number=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). 
             *
             *  - `companyids` – `{number=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"where":{"something":"value"}}). 
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
            "findWithFoto": {
              isArray: true,
              url: urlBase + "/Users/findWithFoto",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Users#getCurrent
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Get data of the currently logged user. Fail with HTTP result 401
             * when there is no user logged in.
             *
             * @param {function(Object,Object)=} successCb
             *    Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *    `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             */
            'getCurrent': {
              url: urlBase + "/Users" + '/:id',
              method: 'GET',
              params: {
                id: function() {
                  var id = LoopBackAuth.currentUserId;
                  if (id == null) id = '__anonymous__';
                  return id;
                },
              },
              interceptor: {
                response: function(response) {
                  LoopBackAuth.currentUserData = response.data;
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return $q.reject(responseError);
                },
              },
              __isGetCurrentUser__: true,
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Users#destroyById
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Delete user profile in application cause delete all associated entity
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Users#removeById
             * @methodOf lbServices.Users
             *
             * @description
             *
             * Delete user profile in application cause delete all associated entity
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Users` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Users#getCachedCurrent
         * @methodOf lbServices.Users
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.Users#login} or
         * {@link lbServices.Users#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A Users instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Users#isAuthenticated
         * @methodOf lbServices.Users
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Users#getCurrentId
         * @methodOf lbServices.Users
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

        /**
        * @ngdoc property
        * @name lbServices.Users#modelName
        * @propertyOf lbServices.Users
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Users`.
        */
        R.modelName = "Users";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Operations
 * @header lbServices.Operations
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Operations` model.
 *
 * **Details**
 *
 * What user can do, dashboard <br>activities, type of requests 
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Operations",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Operations/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Operations#create
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Create a new operation in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Operations",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#findById
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Find a operation by id
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Operations/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#find
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Find a operation by where clause
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Operations",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#delete
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Delete Operations. Only no related element was deleted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{number}` - Operation id to delete
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "delete": {
              url: urlBase + "/Operations/:id/delete",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#activateForUser
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * write a useroperations row if not present or change to active the correct row
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `userId` – `{number}` - User id that you want to activate operation
             *
             *  - `operationId` – `{number}` - Operations id that you want to activate to User
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "activateForUser": {
              url: urlBase + "/Operations/:id/activateForUserId",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#deactivateForUser
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * write a useroperations row if not present with deactivate <br> state or change to deactive the correct row
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `userId` – `{number}` - User id that you want to deactivate operation
             *
             *  - `operationId` – `{number}` - Operation id that you want to deactivate to user
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "deactivateForUser": {
              url: urlBase + "/Operations/:id/deactivateForUser",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#setOperationForRole
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * write a authenticationoperations row if not present 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `operationId` – `{number}` - Operations id that you want to activate
             *
             *  - `roleId` – `{number}` - Role id that you want to activate operation
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "setOperationForRole": {
              url: urlBase + "/Operations/setOperationForRole",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#unSetOperationForRole
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * delete a authenticationoperations row if present 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `operationId` – `{number}` - Operations id that you want to activate
             *
             *  - `roleId` – `{number}` - Role id that you want to activate operation
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "unSetOperationForRole": {
              url: urlBase + "/Operations/unSetOperationForRole",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#listActiveForUser
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Get a list of active operation for user
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `userId` – `{number}` - User id that you want to know active op
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "listActiveForUser": {
              isArray: true,
              url: urlBase + "/Operations/listActiveForUser",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#updateAttributes
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Update properties. Admitted only all Except ID
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - Operations id to change
             *
             *  - `properties` – `{Operations=}` - Refer to Model and ModelSchema.ID must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Operations/:id/updateAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#findCategory
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Find a category list
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{string=}` - Insert a where clause to filter data. Example:{"where":{"field":value}}}
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "findCategory": {
              url: urlBase + "/Operations/findCategory",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#createCategory
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Create operationCategory with description
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "createCategory": {
              url: urlBase + "/Operations/createCategory",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#updateCategoryAttributes
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Edit operationCategory description. Admitted all Except ID
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - OperationCategory id to change
             *
             *  - `properties` – `{OperationsCategory=}` - Refer to Model and ModelSchema. Read Admitted
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "updateCategoryAttributes": {
              url: urlBase + "/Operations/:id/updateCategoryAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#deleteCategory
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Delete Category. Only no related element was deleted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{number}` - OperationCategory id to delete
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "deleteCategory": {
              url: urlBase + "/Operations/:id/deleteCategory",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#generateDashboardForUser
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Generate dashboard for a user
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `userId` – `{number}` - User id that you want to generate dashboard
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "generateDashboardForUser": {
              isArray: true,
              url: urlBase + "/Operations/generateDashboardForUser",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#updateServiceUrl
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Edit service url
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - Service to update url
             *
             *  - `url` – `{string}` - Service url
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "updateServiceUrl": {
              url: urlBase + "/Operations/:id/updateServiceUrl",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#services
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Get services list
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{string=}` - Insert a where clause to filter data. Example:{"where":{"field":value}}
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "services": {
              isArray: true,
              url: urlBase + "/Operations/services",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Operations#createMany
             * @methodOf lbServices.Operations
             *
             * @description
             *
             * Create a new operation in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Operations` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Operations",
              method: "POST",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Operations#modelName
        * @propertyOf lbServices.Operations
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Operations`.
        */
        R.modelName = "Operations";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Factory
 * @header lbServices.Factory
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Factory` model.
 *
 * **Details**
 *
 * Company and sub Company
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Factory",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Factories/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Factory#create
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Create a new factory in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Factories",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Factory#find
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Find a factory with filter
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Factories",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Factory#listFactoryWithUserName
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Get list of all factory where username is present
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `userName` – `{string}` - Username used to check if users is present in others sub-company
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "listFactoryWithUserName": {
              isArray: true,
              url: urlBase + "/Factories/listFactoryWithUserName",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Factory#updateAttributes
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Update properties. Admitted all except ID in properties
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - The id of factory
             *
             *  - `properties` – `{Factory=}` - Refer to Model and Model Schema. ID must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Factories/:id/updateAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Factory#insertCaledarEvents
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Update properties. Admitted all except ID in properties
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `events` – `{object=}` - The id of factory
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "insertCaledarEvents": {
              url: urlBase + "/Factories/insertCaledarEvents",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Factory#createMany
             * @methodOf lbServices.Factory
             *
             * @description
             *
             * Create a new factory in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Factory` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Factories",
              method: "POST",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Factory#modelName
        * @propertyOf lbServices.Factory
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Factory`.
        */
        R.modelName = "Factory";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.OperationsCategory
 * @header lbServices.OperationsCategory
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `OperationsCategory` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "OperationsCategory",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/OperationsCategories/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.OperationsCategory#modelName
        * @propertyOf lbServices.OperationsCategory
        * @description
        * The name of the model represented by this $resource,
        * i.e. `OperationsCategory`.
        */
        R.modelName = "OperationsCategory";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.UsersOperations
 * @header lbServices.UsersOperations
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `UsersOperations` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "UsersOperations",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/UsersOperations/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.UsersOperations#modelName
        * @propertyOf lbServices.UsersOperations
        * @description
        * The name of the model represented by this $resource,
        * i.e. `UsersOperations`.
        */
        R.modelName = "UsersOperations";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Messages
 * @header lbServices.Messages
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Messages` model.
 *
 * **Details**
 *
 * Operation's message notified to user 
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Messages",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Messages/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Messages#find
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * Find a message by where clause
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Messages",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Messages#inserts
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * Create a new message for operation and event code.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "inserts": {
              isArray: true,
              url: urlBase + "/Messages/inserts",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Messages#updateAttributes
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * Update properties. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - Messages id
             *
             *  - `properties` – `{Messages=}` - Refer to Model and ModelSchema
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "updateAttributes": {
              isArray: true,
              url: urlBase + "/Messages/:id/updateAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Messages#deleteByid
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * Delete message 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{number}` - Messages id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "deleteByid": {
              url: urlBase + "/Messages/deleteByid/:id/",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Messages#NotifyToUserForOperation
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * write a useroperationsmessages row. Message was sent to user
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - Id of message that want to notificate to user
             *
             *  - `userId` – `{number}` - Id of user that recive message
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "NotifyToUserForOperation": {
              url: urlBase + "/Messages/:id/NotifyToUserForOperation",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Messages#DeNotifyToUserForOperation
             * @methodOf lbServices.Messages
             *
             * @description
             *
             * delete a useroperationsmessages row.Message was acquired from user
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - Id of message that want to denotificate to user
             *
             *  - `userId` – `{number}` - Id of user that want to denotificate to user
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Messages` object.)
             * </em>
             */
            "DeNotifyToUserForOperation": {
              url: urlBase + "/Messages/:id/DeNotifyToUserForOperation",
              method: "POST",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Messages#modelName
        * @propertyOf lbServices.Messages
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Messages`.
        */
        R.modelName = "Messages";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Authentication
 * @header lbServices.Authentication
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Authentication` model.
 *
 * **Details**
 *
 * Authentication Role and Mappings
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Authentication",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Authentications/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Authentication#create
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Create a new role in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Authentications",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#find
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Find Role in database
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Authentications",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#findACLRole
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Get ACL filtered by where
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{string=}` - Insert a where clause to filter data. Example:{"where":{"field":value}}
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Filtered row
             */
            "findACLRole": {
              isArray: true,
              url: urlBase + "/Authentications/findACLRole",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#createACLRow
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Create ACL Rows
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "createACLRow": {
              isArray: true,
              url: urlBase + "/Authentications/createACLRow",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#updateACLAttributes
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Edit ACL Attributes
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - id of ACL Row
             *
             *  - `properties` – `{ACL=}` - Refer to Model and ModelSchema, id field ignored.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "updateACLAttributes": {
              url: urlBase + "/Authentications/:id/updateACLAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#deleteACLRow
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Delete ACL Row
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{number}` - id of ACL Row
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "deleteACLRow": {
              url: urlBase + "/Authentications/:id/deleteACLRow",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#updateAttributes
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Update properties. Admitted All except ID
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{number}` - id of role row
             *
             *  - `properties` – `{Authentication=}` - Refer to Model and Model Schema. Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Authentications/:id/updateAttributes",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#deleteRole
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Delete Role only if is empty and no ACL is Mapped
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{number}` - id of role row
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "deleteRole": {
              url: urlBase + "/Authentications/:id/deleteRole",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#mapRoleToUser
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Map Role To Users
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `userId` – `{number}` - Id of user who have new role subscribed
             *
             *  - `Role` – `{string}` - id of Role Row
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "mapRoleToUser": {
              url: urlBase + "/Authentications/mapRoleToUser",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Authentication#createMany
             * @methodOf lbServices.Authentication
             *
             * @description
             *
             * Create a new role in application 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Authentication` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Authentications",
              method: "POST",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Authentication#modelName
        * @propertyOf lbServices.Authentication
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Authentication`.
        */
        R.modelName = "Authentication";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Services
 * @header lbServices.Services
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Services` model.
 *
 * **Details**
 *
 * External Services called to enter exit data
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Services",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Services/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Services#modelName
        * @propertyOf lbServices.Services
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Services`.
        */
        R.modelName = "Services";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.OperationsServices
 * @header lbServices.OperationsServices
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `OperationsServices` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "OperationsServices",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/OperationsServices/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.OperationsServices#modelName
        * @propertyOf lbServices.OperationsServices
        * @description
        * The name of the model represented by this $resource,
        * i.e. `OperationsServices`.
        */
        R.modelName = "OperationsServices";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Email
 * @header lbServices.Email
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Email` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Email",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Emails/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Email#modelName
        * @propertyOf lbServices.Email
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Email`.
        */
        R.modelName = "Email";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.ImportContainer
 * @header lbServices.ImportContainer
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ImportContainer` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "ImportContainer",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/ImportContainers/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#getContainers
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ImportContainer` object.)
             * </em>
             */
            "getContainers": {
              isArray: true,
              url: urlBase + "/ImportContainers",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#createContainer
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ImportContainer` object.)
             * </em>
             */
            "createContainer": {
              url: urlBase + "/ImportContainers",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#destroyContainer
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            "destroyContainer": {
              url: urlBase + "/ImportContainers/:container",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#getContainer
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ImportContainer` object.)
             * </em>
             */
            "getContainer": {
              url: urlBase + "/ImportContainers/:container",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#getFiles
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ImportContainer` object.)
             * </em>
             */
            "getFiles": {
              isArray: true,
              url: urlBase + "/ImportContainers/:container/files",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#getFile
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             *  - `file` – `{string}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ImportContainer` object.)
             * </em>
             */
            "getFile": {
              url: urlBase + "/ImportContainers/:container/files/:file",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#removeFile
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             *  - `file` – `{string}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            "removeFile": {
              url: urlBase + "/ImportContainers/:container/files/:file",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#upload
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             * @param {Object} postData Request data.
             *
             *  - `req` – `{object=}` -
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `result` – `{object=}` -
             */
            "upload": {
              url: urlBase + "/ImportContainers/:container/upload",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ImportContainer#download
             * @methodOf lbServices.ImportContainer
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             *  - `file` – `{string}` -
             *
             *  - `req` – `{object=}` -
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "download": {
              url: urlBase + "/ImportContainers/:container/download/:file",
              method: "GET",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.ImportContainer#modelName
        * @propertyOf lbServices.ImportContainer
        * @description
        * The name of the model represented by this $resource,
        * i.e. `ImportContainer`.
        */
        R.modelName = "ImportContainer";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Pddstorageb
 * @header lbServices.Pddstorageb
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Pddstorageb` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Pddstorageb",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Pddstoragebs/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#create
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Pddstoragebs",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#findById
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Pddstoragebs/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#find
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Pddstoragebs",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#deleteById
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Pddstoragebs/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#createMany
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Pddstoragebs",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#destroyById
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Pddstorageb#removeById
             * @methodOf lbServices.Pddstorageb
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Pddstorageb` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Pddstorageb#modelName
        * @propertyOf lbServices.Pddstorageb
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Pddstorageb`.
        */
        R.modelName = "Pddstorageb";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Installation
 * @header lbServices.Installation
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Installation` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Installation",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/installations/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Installation#create
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/installations",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#patchOrCreate
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "patchOrCreate": {
              url: urlBase + "/installations",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#replaceOrCreate
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Replace an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "replaceOrCreate": {
              url: urlBase + "/installations/replaceOrCreate",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#upsertWithWhere
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "upsertWithWhere": {
              url: urlBase + "/installations/upsertWithWhere",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#exists
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Check whether a model instance exists in the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `exists` – `{boolean=}` -
             */
            "exists": {
              url: urlBase + "/installations/:id/exists",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#findById
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/installations/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#replaceById
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Replace attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "replaceById": {
              url: urlBase + "/installations/:id/replace",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#find
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/installations",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#findOne
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/installations/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#updateAll
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
            "updateAll": {
              url: urlBase + "/installations/update",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#deleteById
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/installations/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#count
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/installations/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#prototype$patchAttributes
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - installation id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/installations/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#createChangeStream
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Create a change stream.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `changes` – `{ReadableStream=}` -
             */
            "createChangeStream": {
              url: urlBase + "/installations/change-stream",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Installation#createMany
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/installations",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Installation#upsert
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["upsert"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#updateOrCreate
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["updateOrCreate"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#patchOrCreateWithWhere
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["patchOrCreateWithWhere"] = R["upsertWithWhere"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#update
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
        R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#destroyById
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#removeById
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Installation#prototype$updateAttributes
             * @methodOf lbServices.Installation
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - installation id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Installation` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Installation#modelName
        * @propertyOf lbServices.Installation
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Installation`.
        */
        R.modelName = "Installation";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.AuthenticationsOperations
 * @header lbServices.AuthenticationsOperations
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AuthenticationsOperations` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "AuthenticationsOperations",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/AuthenticationsOperations/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.AuthenticationsOperations#create
             * @methodOf lbServices.AuthenticationsOperations
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AuthenticationsOperations` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/AuthenticationsOperations",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AuthenticationsOperations#findById
             * @methodOf lbServices.AuthenticationsOperations
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AuthenticationsOperations` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/AuthenticationsOperations/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AuthenticationsOperations#find
             * @methodOf lbServices.AuthenticationsOperations
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AuthenticationsOperations` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/AuthenticationsOperations",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AuthenticationsOperations#createMany
             * @methodOf lbServices.AuthenticationsOperations
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AuthenticationsOperations` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/AuthenticationsOperations",
              method: "POST",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.AuthenticationsOperations#modelName
        * @propertyOf lbServices.AuthenticationsOperations
        * @description
        * The name of the model represented by this $resource,
        * i.e. `AuthenticationsOperations`.
        */
        R.modelName = "AuthenticationsOperations";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Gateway
 * @header lbServices.Gateway
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Gateway` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Gateway",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Gateways/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Gateway#create
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Gateways",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#findById
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Gateways/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#find
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Gateways",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#deleteById
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Gateways/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#findAlarmAux
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Find Gateway with companytype
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{object=}` -
             */
            "findAlarmAux": {
              url: urlBase + "/Gateways/findAlarmAux",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#find_
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Find Gateway with companytype
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string=}` - Gateway find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Gateway=}` -
             */
            "find_": {
              url: urlBase + "/Gateways/find_",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#updateAttributes
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Update Gateway. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of Gateway that you want change properties
             *
             *  - `properties` – `{Gateway=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Gateways/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gateway#createMany
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Gateways",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Gateway#destroyById
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Gateway#removeById
             * @methodOf lbServices.Gateway
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gateway` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Gateway#modelName
        * @propertyOf lbServices.Gateway
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Gateway`.
        */
        R.modelName = "Gateway";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Sensorvalue
 * @header lbServices.Sensorvalue
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sensorvalue` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Sensorvalue",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Sensorvalues/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#create
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Sensorvalues",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#findById
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Sensorvalues/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#find
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Sensorvalues",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#deleteById
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Sensorvalues/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#findVolt
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Find Sensorvalue by date 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `code` – `{string=}` - Code find 
             *
             *  - `from` – `{string=}` - from find 
             *
             *  - `to` – `{string=}` - to find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Sensorvalue=}` -
             */
            "findVolt": {
              url: urlBase + "/Sensorvalues/findVolt",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#findByDate
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Find Sensorvalue by date 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `code` – `{string=}` - Code find 
             *
             *  - `from` – `{string=}` - from find 
             *
             *  - `to` – `{string=}` - to find 
             *
             *  - `connectorid` – `{string=}` - to find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Sensorvalue=}` -
             */
            "findByDate": {
              url: urlBase + "/Sensorvalues/findByDate",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#createMany
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Sensorvalues",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#destroyById
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Sensorvalue#removeById
             * @methodOf lbServices.Sensorvalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvalue` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Sensorvalue#modelName
        * @propertyOf lbServices.Sensorvalue
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Sensorvalue`.
        */
        R.modelName = "Sensorvalue";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Sensortype
 * @header lbServices.Sensortype
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sensortype` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Sensortype",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Sensortypes/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#create
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Sensortypes",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#findById
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Sensortypes/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#find
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Sensortypes",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#deleteById
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Sensortypes/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#updateAttributes
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Update Sensortype. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Sensortype=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Sensortypes/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#createMany
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Sensortypes",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Sensortype#destroyById
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Sensortype#removeById
             * @methodOf lbServices.Sensortype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensortype` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Sensortype#modelName
        * @propertyOf lbServices.Sensortype
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Sensortype`.
        */
        R.modelName = "Sensortype";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Connector
 * @header lbServices.Connector
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Connector` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Connector",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Connectors/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Connector#create
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Connectors",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#findById
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Connectors/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#find
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Connectors",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#deleteById
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Connectors/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#updateAttributes
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Update Connector. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Connector=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Connectors/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#updateAssociation
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Update Connector association. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Connector=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "updateAssociation": {
              url: urlBase + "/Connectors/updateAssociation/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Connector#createMany
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Connectors",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Connector#destroyById
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Connector#removeById
             * @methodOf lbServices.Connector
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Connector` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Connector#modelName
        * @propertyOf lbServices.Connector
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Connector`.
        */
        R.modelName = "Connector";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Company
 * @header lbServices.Company
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Company` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Company",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Companies/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Company#create
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Companies",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#findById
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Companies/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#find
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Companies",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#deleteById
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Companies/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#find__
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Find Companies with companytype
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string=}` - Companies find__ 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Companies=}` -
             */
            "find__": {
              url: urlBase + "/Companies/find__",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#findNew_
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Find Companies with companytype
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `installationcompanyId` – `{string=}` - Companies find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Companies_=}` -
             */
            "findNew_": {
              url: urlBase + "/Companies/findNew_",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#find_
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Find Companies with companytype
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `installationcompanyId` – `{string=}` - Companies find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Companies=}` -
             */
            "find_": {
              url: urlBase + "/Companies/find_",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#updateAttributes
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Update Company. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Company=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Companies/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#delete_
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Delete Companies and all parameters
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `companyId` – `{number=}` - Companies find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Company=}` -
             */
            "delete_": {
              url: urlBase + "/Companies/:companyId",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Company#createMany
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Companies",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Company#destroyById
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Company#removeById
             * @methodOf lbServices.Company
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Company` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Company#modelName
        * @propertyOf lbServices.Company
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Company`.
        */
        R.modelName = "Company";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Companytype
 * @header lbServices.Companytype
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Companytype` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Companytype",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Companytypes/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Companytype#create
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Companytypes",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Companytype#findById
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Companytypes/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Companytype#find
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Companytypes",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Companytype#deleteById
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Companytypes/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Companytype#createMany
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Companytypes",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Companytype#destroyById
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Companytype#removeById
             * @methodOf lbServices.Companytype
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Companytype` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Companytype#modelName
        * @propertyOf lbServices.Companytype
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Companytype`.
        */
        R.modelName = "Companytype";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Gatewaycompany
 * @header lbServices.Gatewaycompany
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Gatewaycompany` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Gatewaycompany",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Gatewaycompanies/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#create
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Gatewaycompanies",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#findById
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Gatewaycompanies/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#find
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Gatewaycompanies",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#deleteById
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Gatewaycompanies/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#updateAssociation
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Update Gatewaycompany association. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Connector=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "updateAssociation": {
              url: urlBase + "/Gatewaycompanies/updateAssociation/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#updateAttributes
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Update Gatewaycompany. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Gatewaycompany=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Gatewaycompanies/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#createMany
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Gatewaycompanies",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#destroyById
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Gatewaycompany#removeById
             * @methodOf lbServices.Gatewaycompany
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewaycompany` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Gatewaycompany#modelName
        * @propertyOf lbServices.Gatewaycompany
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Gatewaycompany`.
        */
        R.modelName = "Gatewaycompany";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Gatewayspositions
 * @header lbServices.Gatewayspositions
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Gatewayspositions` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Gatewayspositions",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Gatewayspositions/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#create
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Gatewayspositions",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#findById
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Gatewayspositions/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#find
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Gatewayspositions",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#deleteById
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Gatewayspositions/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#updateAttributes
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Update Gatewayspositions. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of Gateway that you want change properties
             *
             *  - `properties` – `{Gatewayspositions=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Gatewayspositions/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#createMany
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Gatewayspositions",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#destroyById
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Gatewayspositions#removeById
             * @methodOf lbServices.Gatewayspositions
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayspositions` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Gatewayspositions#modelName
        * @propertyOf lbServices.Gatewayspositions
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Gatewayspositions`.
        */
        R.modelName = "Gatewayspositions";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Sensorvaluelimit
 * @header lbServices.Sensorvaluelimit
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sensorvaluelimit` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Sensorvaluelimit",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Sensorvaluelimits/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#create
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Sensorvaluelimits",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#findById
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Sensorvaluelimits/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#find
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Sensorvaluelimits",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#deleteById
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Sensorvaluelimits/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#updateAttributes
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Update Sensorvaluelimit. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of Sensorvaluelimit that you want change properties
             *
             *  - `properties` – `{Sensorvaluelimit=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Sensorvaluelimits/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#createMany
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Sensorvaluelimits",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#destroyById
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimit#removeById
             * @methodOf lbServices.Sensorvaluelimit
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimit` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Sensorvaluelimit#modelName
        * @propertyOf lbServices.Sensorvaluelimit
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Sensorvaluelimit`.
        */
        R.modelName = "Sensorvaluelimit";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Rele
 * @header lbServices.Rele
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Rele` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Rele",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Reles/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Rele#create
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Reles",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#findById
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Reles/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#find
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Reles",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#deleteById
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Reles/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#find_
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Find Rele 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `companyId` – `{string=}` - Reles find 
             *
             *  - `installationcompanyId` – `{string=}` - Reles find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Rele=}` -
             */
            "find_": {
              url: urlBase + "/Reles/find_",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#updateAttributes
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Update Reles. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of MeintinanceType that you want change properties
             *
             *  - `properties` – `{Rele=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Reles/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Rele#createMany
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Reles",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Rele#destroyById
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Rele#removeById
             * @methodOf lbServices.Rele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Rele` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Rele#modelName
        * @propertyOf lbServices.Rele
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Rele`.
        */
        R.modelName = "Rele";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Relevalue
 * @header lbServices.Relevalue
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Relevalue` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Relevalue",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Relevalues/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#create
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Relevalues",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#findById
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Relevalues/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#find
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Relevalues",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#deleteById
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Relevalues/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#createChangeStream
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Create a change stream.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `changes` – `{ReadableStream=}` -
             */
            "createChangeStream": {
              url: urlBase + "/Relevalues/change-stream",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#findByDate
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Find Relevalue by date 
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `code` – `{string=}` - Code find 
             *
             *  - `from` – `{string=}` - from find 
             *
             *  - `to` – `{string=}` - to find 
             *
             *  - `releId` – `{string=}` - to find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Relevalue=}` -
             */
            "findByDate": {
              url: urlBase + "/Relevalues/findByDate",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#createMany
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Relevalues",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Relevalue#destroyById
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Relevalue#removeById
             * @methodOf lbServices.Relevalue
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Relevalue` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Relevalue#modelName
        * @propertyOf lbServices.Relevalue
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Relevalue`.
        */
        R.modelName = "Relevalue";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Sensorvaluelimitrele
 * @header lbServices.Sensorvaluelimitrele
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sensorvaluelimitrele` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Sensorvaluelimitrele",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Sensorvaluelimitreles/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#create
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Sensorvaluelimitreles",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#findById
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Sensorvaluelimitreles/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#find
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Sensorvaluelimitreles",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#deleteById
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Sensorvaluelimitreles/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#updateAttributes
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Update Sensorvaluelimit. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of Sensorvaluelimit that you want change properties
             *
             *  - `properties` – `{Sensorvaluelimitrele=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Sensorvaluelimitreles/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#delete_
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Delete Sensorvaluelimitrele By sensorvaluelimitsId where no page savede
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `sensovaluelimitsId` – `{string}` - delete sensorvaluelimitsId with sensorvaluelimitsId id where is no page saved
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "delete_": {
              url: urlBase + "/Sensorvaluelimitreles/delete_/:sensovaluelimitsId",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#createMany
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Sensorvaluelimitreles",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#destroyById
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Sensorvaluelimitrele#removeById
             * @methodOf lbServices.Sensorvaluelimitrele
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorvaluelimitrele` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Sensorvaluelimitrele#modelName
        * @propertyOf lbServices.Sensorvaluelimitrele
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Sensorvaluelimitrele`.
        */
        R.modelName = "Sensorvaluelimitrele";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Gatewayradius
 * @header lbServices.Gatewayradius
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Gatewayradius` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Gatewayradius",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Gatewayradius/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#create
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Gatewayradius",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#findById
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Gatewayradius/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#find
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Gatewayradius",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#deleteById
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Gatewayradius/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#updateAttributes
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Update Gatewayradius. Admitted 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` - The id of Gateway that you want change properties
             *
             *  - `properties` – `{Gatewayradius=}` - Refer To Model and ModelSchema.Id must be removed
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "updateAttributes": {
              url: urlBase + "/Gatewayradius/updateAttributes/:id",
              method: "PUT",
            },

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#createMany
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Gatewayradius",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#destroyById
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Gatewayradius#removeById
             * @methodOf lbServices.Gatewayradius
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Gatewayradius` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Gatewayradius#modelName
        * @propertyOf lbServices.Gatewayradius
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Gatewayradius`.
        */
        R.modelName = "Gatewayradius";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Sensorcustomname
 * @header lbServices.Sensorcustomname
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sensorcustomname` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Sensorcustomname",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Sensorcustomnames/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#create
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Sensorcustomnames",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#findById
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Sensorcustomnames/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#find
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Sensorcustomnames",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#deleteById
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Sensorcustomnames/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#updateAttributes_
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Find Sensorcustomname 
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `obj` – `{Object=}` - Reles find 
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `results` – `{Sensorcustomname=}` -
             */
            "updateAttributes_": {
              url: urlBase + "/Sensorcustomnames/updateAttributes_",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#createMany
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Sensorcustomnames",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#destroyById
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Sensorcustomname#removeById
             * @methodOf lbServices.Sensorcustomname
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Sensorcustomname` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];


        /**
        * @ngdoc property
        * @name lbServices.Sensorcustomname#modelName
        * @propertyOf lbServices.Sensorcustomname
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Sensorcustomname`.
        */
        R.modelName = "Sensorcustomname";



        return R;
      }]);


  module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId', 'rememberMe'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    };

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    };

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      try {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
      } catch (err) {
        console.log('Cannot access local/session storage:', err);
      }
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', ['$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {
          // filter out external requests
          var host = getHost(config.url);
          if (host && config.url.indexOf(urlBaseHost) === -1) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 }},
              status: 401,
              config: config,
              headers: function() { return undefined; },
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        },
      };
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the header name that is used for sending the authentication token.
     */
    this.getAuthHeader = function() {
      return authHeader;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
      urlBaseHost = getHost(urlBase) || location.host;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      var LoopBackResource = function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };

      LoopBackResource.getUrlBase = function() {
        return urlBase;
      };

      LoopBackResource.getAuthHeader = function() {
        return authHeader;
      };

      return LoopBackResource;
    }];
  });
})(window, window.angular);

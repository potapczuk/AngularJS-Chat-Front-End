'use strict';
/**
 * @ngdoc overview
 * @name chatApp
 * @description
 * # chatApp
 *
 * Main module of the application.
 */
angular
  .module('chatApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ]);



angular
.module('chatApp').config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null 
}



angular.module('chatApp').config(['$httpProvider', 
                                  function($httpProvider) {
	
	    $httpProvider.defaults.useXDomain = true;
	    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	    
        
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
       
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */ 
        var param = function(obj) {
          var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
            
          for(name in obj) {
            value = obj[name];
              
            if(value instanceof Array) {
              for(i=0; i<value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
              }
            }
            else if(value instanceof Object) {
              for(subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
              }
            }
            else if(value !== undefined && value !== null)
              query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
            
          return query.length ? query.substr(0, query.length - 1) : query;
        };
       
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
	}
]);
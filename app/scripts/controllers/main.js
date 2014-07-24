'use strict';

/**
 * @ngdoc function
 * @name chatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatApp
 */

angular.module('chatApp')
        .controller('MainCtrl', [ '$scope', '$timeout', 'ChatService', 
                                  function($scope, $timeout, ChatService) {
            $scope.users = [];
            $scope.activeUser = null;
            $scope.messageText = "";
            
            $scope.activeMessages = ChatService.getMessages();
            $scope.users = ChatService.getUsers();
            
            var updateTime = 1000;
            var updateReference;
            
            $scope.setActiveUser = function(user) {
                $scope.activeUser = user;
                
                ChatService
                .loadMessages(user.id)
                .then(function () {
                	$scope.activeMessages = ChatService.getMessages();
                });
            };
            
            $scope.sendMessage = function(){
            	if($scope.messageText !== ""){
	            	ChatService.sendMessage($scope.activeUser.id, $scope.messageText);
	            	$scope.messageText = "";
            	}
            };

			// schedule to run the heart beat
			$scope.heartBeat = function() {			
				updateReference = $timeout(function() {
					$scope.runHeartBeat();
			    }, updateTime);
			};
			
			// Run the heart beat
			$scope.runHeartBeat = function() {
				ChatService
	            .heartBeat()
	            .then(function () {
	            	$scope.users = ChatService.getUsers();
	            	$scope.heartBeat();
	            });
			};
			
			// Start running the heart beat right now
			$scope.runHeartBeat();
        }]);
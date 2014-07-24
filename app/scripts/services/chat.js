'use strict';

angular.module('chatApp').service('ChatService', ['$http', function($http) {

    var baseUrl = 'http://stcall.localhost/callCenter/chat/';
    
    var users = [];
    var selectedUser = "";
    var messages = [];
    var lastMsgTime = "";
    
    this.nl2br = function (str, is_xhtml) {   
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    }
	
	var entityMap = {
	    "&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};

    this.escapeHtml = function (string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
        	return entityMap[s];
        });
    }
    
    this.getUsers = function() {
    	return users;
    }
    
    this.getMessages = function() {
    	return messages;
    }
 
    this.heartBeat = function() {
    	return $http.get(baseUrl+'chat-heart-beat-ang?f='+selectedUser+'&u='+lastMsgTime)
        .success(function (data) {
        	
        	// Load users
            if(angular.isUndefinedOrNull(data.user) == false) {
            	while(users.length > 0) {
            		users.pop();
            	}
            	for(var i in data.user){
            		users.push(data.user[i]);
            	}
            }
            
            // Load new messages
			if(angular.isUndefinedOrNull(data.msg) == false){
				for(var i in data.msg){
            		messages.unshift(data.msg[i]);
            		
            		lastMsgTime = data.msg[i]['date'];
            	}
			}
        })
        .error(function (data) {
            console.error("Error: "+data);
        });
    };
    
    this.loadMessages = function(userId) {
    	selectedUser = userId;
    	
    	while(messages.length > 0) {
    		messages.pop();
    	}
    	
    	return $http.get(baseUrl+'get-messages-ang?f='+selectedUser)
        .success(function (data) {        	
            if(angular.isUndefinedOrNull(data.msg) == false) {
            	for(var i in data.msg){
            		messages.push(data.msg[i]);
            		
            		if(lastMsgTime == "" && data.msg[i]['userId'] != "Me"){
            			lastMsgTime = data.msg[i]['date']; 
					}
            	}
            }
        })
        .error(function (data) {
            console.error("Error "+data);
        });
    };
    
    this.sendMessage = function(userId, text) {
    	
    	var newText = this.escapeHtml(text);
    	newText = this.nl2br(newText, true);
    	
    	messages.unshift({'text' : newText, 'userId' : 'Me'});
    	
    	return $http({
		    url: baseUrl+'send-message-ang',
		    method: "POST",
		    data: {'userId' : userId, 'text' : text},
		})
        .success(function (data) {       

        })
        .error(function (data) {
            console.error("Error "+data);
        });
    };
}]);
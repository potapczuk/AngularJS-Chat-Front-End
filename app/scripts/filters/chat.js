'use strict';

angular.module('chatApp').filter('mineClass', function () {
    return function (message) {        
        if(message.userId == 'Me'){
            return 'self';
        } else {
            return 'other';
        }
    }
});

angular.module('chatApp').filter('timeFormat', function () {
    return function (text) {        
    	if(angular.isUndefinedOrNull(text) == true || text == ''){
            return '';
        }

        var time = new Date(text);
        var today = new Date();

        if( today.toLocaleDateString() != time.toLocaleDateString()){                    
            text = time.toLocaleDateString() + ' ' +time.toLocaleTimeString();
        } else {
        	text = time.toLocaleTimeString();
        }

        return text;
    }
});

angular.module('chatApp').filter('activeUserClass', function () {
    return function (userId, activeUserId) {        
        if(userId == activeUserId){
            return 'active';
        }
    }
});
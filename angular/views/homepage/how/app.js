'use strict';
define(['app', 'WOW'], function(app, WOW) {
    app.register.controller('howCtrl', [
        'localStorageService',
        '$scope',
        '$rootScope',
        function(localStorageService, $scope, $rootScope) {
            $rootScope.currentMenu = "home";

            if (typeof WOW === 'function') {
				new WOW({
					boxClass:     'wow',      // default
					animateClass: 'animated', // default
					offset:       0          // default
				}).init();
			}
    }]);
});
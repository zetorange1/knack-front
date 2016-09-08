'use strict';
define(['app'], function(app) {
    app.register.controller('termsCtrl', [
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
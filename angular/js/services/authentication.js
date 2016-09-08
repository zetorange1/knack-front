define(['angularAMD'], function(app) {

    app.service('Authentication', ['$rootScope', function($rootScope) {

    	function _isFBAccount() {
            // Check if user is logged in with FB
            return true;
        }

        function _isAuthenticated() {
            return $rootScope.is_authenticated;
        }

        return {
            isFBAccount: _isFBAccount,
            isAuthenticated: _isAuthenticated
        }
    }]);
});
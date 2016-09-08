define(['angularAMD'], function(app) {
    app.controller('footerCtrl', ['localStorageService','$scope', '$rootScope', '$timeout',
    	function(localStorageService,$scope, $rootScope, $timeout) {
            $scope.new_email = ""

            $scope.getStart = function(){
                $rootScope.new_email = $scope.new_email;
                $timeout(function() {
                    if(!$rootScope.is_authenticated) {
                        angular.element("#id-sign-up").triggerHandler('click');
                    }
                }, 0);
            }
    }]);
});
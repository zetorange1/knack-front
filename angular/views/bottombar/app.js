define(['angularAMD'], function(app) {
    app.controller('bottombarCtrl', [
        'localStorageService',
        '$scope',
        '$rootScope',
        '$modal',
        '$timeout',
        '$resource',
        '$state',
        'tokenError',
        function(localStorageService, $scope, $rootScope, $modal, $timeout, $resource, $state) {
            

            var savedPosition = 0;
            var timer;
            $scope.state = '';

            $(window).on('scroll', function() {
                if ($(window).width() >= 767){
                    $('.bottom-bar').slideUp();
                    return;
                }
                
                var currentPosition = ($('.bottom-bar').offset() || { "top": NaN }).top;

                if (isNaN(currentPosition)) {
                    console.log("something is wrong, no top");  
                } else if (currentPosition - savedPosition > 0){
                    
                    $('.bottom-bar').slideDown();
                    
                    /*
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        $('.bottom-bar').slideUp();
                            
                    }, 5000);*/

                }
                savedPosition = currentPosition;                
            });

            $scope.goKnacks = function() {
                $scope.state = 'knacks';
                $state.go('knack-offered');
            };

            $scope.goMarketplace = function() {
                $scope.state = 'marketplace';
                $state.go('marketplace');
            };

            $scope.goNotification = function() {
                $scope.state = 'notification';
                $state.go('messages');
            };

            $scope.goProfile = function() {
                if(!$rootScope.is_authenticated) {
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/login-modal.html',
                        controller: 'LoginModalCtl',
                        windowClass: 'vcenter-modal'
                    });
                    modalInstance.result.then(function (data) {
                            $state.go('private-profile');
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                } else {
                    $scope.state = 'profile';
                    $state.go('private-profile');
                }
            };

    }]);
});
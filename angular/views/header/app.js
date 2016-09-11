define(['angularAMD'], function(app) {
    app.controller('headerCtrl', [
        'localStorageService',
        '$scope',
        '$rootScope',
        '$modal',
        '$timeout',
        '$resource',
        '$state',
        'tokenError',
        'notification',
        function(localStorageService, $scope, $rootScope, $modal, $timeout, $resource, $state, tokenError, notification) {

            $rootScope.new_message_count = 0;
            $scope.new_messages = null;
            
            $scope.$watch(
                function () { return notification.all(); },
                function (new_value, old_value) {$scope.notifications = new_value;},
                true
            );
            $scope.$watch(
                function () { return notification.unread(); },
                function (new_value, old_value) {$scope.unread_notifications = new_value;},
                true
            );

            var new_messages_resource = $resource(":protocol://:url/api/chat/new_messages",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
            },{
                'query': {method: 'GET', isArray: true, ignoreLoadingBar: true }
            });

            (function tick() {
                new_messages_resource.query(function (result) {
                    $scope.new_messages = result;
                    $rootScope.new_message_count = result.length;
                    $timeout(tick, 5000);
                }, function (error) {
                    $timeout(tick, 5000);
                });
            })();
            
            $scope.openLoginModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal wide-modal'
                });
                modalInstance.result.then(function (data) {
                        $state.go('private-profile');
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
             
            /*
            $scope.openLoginModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                        $state.go('private-profile');
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            */
            $scope.registerModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal wide-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            
            $scope.signout = function() {

                var logout =  $resource(":protocol://:url/api/accounts/logout/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                });

                $scope.email = logout.save($rootScope.profile_user, function(data){
                    localStorageService.clearAll();
                    $rootScope.restricted();
                    $state.go('home');
                    $rootScope.isGoToFeed = false;
                },function(error) {
                    $scope.message = error.data;
                });
            };
            $scope.clickFeed = function() {
                if($rootScope.is_authenticated) {
                    $state.go('feed-knacks');
                } else {
                    $rootScope.isGotoFeed = true;
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/loginto-modal.html',
                        controller: 'LoginToModalCtl',
                        windowClass: 'vcenter-modal'
                    });

                    modalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }
            };
            $scope.$on('$destroy', function(){
                if (angular.isDefined(promise)) {
                    $interval.cancel(promise);
                    promise = undefined;
                }
            });

            $scope.toggleResponsiveSidebar = function() {
                $rootScope.isResponsiveSideShow = !$rootScope.isResponsiveSideShow;
            };
            $scope.isShowPaymentBox = false;
            $scope.isShowNotificationBox =false;
            $scope.showPaymentBox = function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if (!$scope.isShowPaymentBox) {
                    $scope.isShowPaymentBox = true;
                } else {
                    $scope.isShowPaymentBox = false;
                }
                $scope.isShowNotificationBox = false;
            };
            $scope.showNotificationBox = function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                for (var i = 0, l = $scope.unread_notifications.length; i < l; i++) {
                    notification.read($scope.unread_notifications[i]);
                }
                if (!$scope.isShowNotificationBox) {
                    $scope.isShowNotificationBox = true;
                } else {
                    $scope.isShowNotificationBox = false;
                }
                $scope.isShowPaymentBox = false;
            };
            $scope.hideDropDownBox = function() {
                $scope.isShowPaymentBox = false;
                $scope.isShowNotificationBox = false;
            };

            $scope.toggleSidebar = function() {
                $rootScope.isSidebarOpen = !$rootScope.isSidebarOpen;
                if($rootScope.isSidebarOpen) {
                    $rootScope.isMenubarOpen = false;
                }
            };

            $scope.toggleMenubar = function() {
                $rootScope.isMenubarOpen = !$rootScope.isMenubarOpen;
                if($rootScope.isMenubarOpen) {
                    $rootScope.isSidebarOpen = false;
                }
            };
    }]);
});
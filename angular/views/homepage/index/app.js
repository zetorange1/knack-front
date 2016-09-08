'use strict';
define(['app', 'WOW', 'owl.carousel'], function(app, WOW, owlCarousel) {
    app.register.controller('indexCtrl', [
        'localStorageService',
        '$scope',
        '$rootScope', '$resource', '$modal', '$timeout', '$state', '$stateParams',
        function(localStorageService, $scope, $rootScope, $resource, $modal, $timeout, $state, $stateParams) {
            $rootScope.currentMenu = "home";
            $scope.knacks = [];
            $scope.current_type = 'knack-offered';

            // Calculate items count depending on a user screen width
            // 244: 220px (width of an item) + 24px (12px margin on left and right)
            $scope.row_size = Math.floor($('#item-container').width() / 244);
            // Load up to 5 rows
            $scope.rows = 5;

            $scope.page_size = $scope.row_size * $scope.rows;
            $scope.page = 1;
            $scope.more = true;

            if (typeof WOW === 'function') {
				new WOW({
					boxClass:     'wow',      // default
					animateClass: 'animated', // default
					offset:       0          // default
				}).init();
			}

            $timeout(function(){jQuery('.tweet_list').owlCarousel({
	            loop:true,
				margin:0,
				responsiveClass:true,
				nav:false,
				dots: true,
				autoplay: true,
				autoplayTimeout: 20000,
				autoHeight: false,
				smartSpeed: 400,
				responsive:{
					0: {
						items:1
					},
					768: {
						items:2
					},
					1200: {
						items:3
					}
				}
	        });});/**/

            var isResetable = $resource(":protocol://:url/api/accounts/isResetable?uuid=:uuid",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                uuid: '@uuid'
            });

            var already_registered = $resource(":protocol://:url/api/accounts/already_registered?uuid=:uuid",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                uuid: '@uuid'
            });

            if ($stateParams.id) {
                already_registered.get({uuid: $stateParams.id}, function(result){
                    console.log(result);
                    localStorageService.add('Authorization', 'Token ' + result.token);
                    localStorageService.add('rest_token', result.token);
                    localStorageService.add('user_id', result.id);
                    localStorageService.add('full_name', result.full_name);
                    localStorageService.add('age', result.age);
                    localStorageService.add('picture', result.picture);
                }, function(error){
                    //if (error.data.details == 'Invalid User'){
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: '/views/modals/register-modal.html',
                            controller: 'RegisterModalCtl',
                            windowClass: 'vcenter-modal',
                            backdrop: 'static',
                            resolve: {
                                uuid: function () {
                                    return $stateParams.id;
                                }
                            }
                        });

                        modalInstance.result.then(function (data) {
                                console.log(data);
                            }, function () {
                                console.info('Modal dismissed at: ' + new Date());
                            }
                        );
                    //}
                });
            }

            if ($stateParams.uuid) {
                isResetable.get({uuid: $stateParams.uuid}, function(result){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/pwd-reset-modal.html',
                        controller: 'PwdResetModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            uuid: function () {
                                return result.uuid;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }, function (error){
                    $state.go('home');
                });
            }

            $scope.getStart = function () {
                $timeout(function() {
                    if(!$rootScope.is_authenticated) {
                        angular.element("#id-sign-up").triggerHandler('click');
                    } else {
                        $state.go("knack-offered");
                    }
                }, 0);
            };

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

            showKnacks('init');

            function showKnacks(type) {
                if(type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.knacks = [];
                    $scope.page = 1;
                }

                var knacks_resource = $resource(
                        ":protocol://:url/api/knacks/knacks?page=:page&page_size=:page_size",
                        {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL,
                            page: $scope.page,
                            page_size: 5
                        }
                    );

                knacks_resource.get(function (result) {
                    if ($scope.knacks.length) {
                        for (var i = 0, l = result.results.length; i < l; i++) {
                            result.results[i].flip = $scope.knacks[0].flip;
                        }
                    }
                    $scope.knacks = $scope.knacks.concat(result.results);
                    $scope.more = !! result.next;                    
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);                    
                });
            }            

            $scope.flip = function(item) {
                item.flip = !item.flip;
            };

            $scope.showVideoModal = function(url) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/video-modal.html',
                    controller: 'KnackVideoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        video_url: function () {
                            return url;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.hideMenubar = function() {
                $rootScope.isMenubarOpen = false;
            }


            $scope.goToKnack = function(id) {
                $state.go('knack-offered-single', {id: id});
            }
    }]);
});
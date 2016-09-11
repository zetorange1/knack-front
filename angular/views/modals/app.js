'use strict';


define(['angularAMD'], function(app) {
    app.controller('KnackModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'data',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, data) {
                $scope.knack = $.extend({
                    anonymous: false,
                    username: '',
                    name: '',
                    category: '',
                    description: '',
                    photo0: '',
                    photo1: '',
                    photo2: '',
                    photo3: '',
                    photo4: '',
                    video: '',
                    schedule: '',
                    willing_to_travel: false,
                    price: '',
                    type: 'O',
                    miles: 'On Campus',
                    how_charge: 'Flat Fee',
                    category_name: 'Category Selection'
                }, data.knack);

                $scope.category_name = $scope.knack.category_name;
                $scope.knack_type = $scope.knack.type == 'O' ? 'Offered' : 'Wanted';
                $scope.action = data.action;

                $scope.showError = false;
                $scope.photo_selected = true;
                $scope.category_selected = true;
                $scope.wrong_price = false;
                $scope.posted_knack = false;
                $scope.sourceImage = null;
                $scope.cropperImage = {};
                $scope.cropperImages = [null,null,null,null,null];
                $scope.selectedImageIndex = null;

                $rootScope.bounds = {};
                $rootScope.bounds.left = 0;
                $rootScope.bounds.right = 0;
                $rootScope.bounds.top = 0;
                $rootScope.bounds.bottom = 0;


                $scope.getModalTitle = function() {
                    if($scope.action=='create' && $scope.knack.type=='O') {
                        return 'SELL YOUR KNACK';
                    }
                    if($scope.action=='create' && $scope.knack.type=='W') {
                        return 'WHAT DO YOU NEED DONE?';
                    }
                    if($scope.action=='edit') {
                        return 'EDIT YOUR KNACK ' + $scope.knack_type;
                    }
                    if($scope.action=='repost') {
                        return 'REPOST YOUR KNACK ' + $scope.knack_type;
                    }
                }

                $scope.getSubmitButtonTitle = function() {
                    if($scope.action=='create' && $scope.knack.type=='O') {
                        return 'POST YOUR KNACK';
                    }
                    if($scope.action=='create' && $scope.knack.type=='W') {
                        return 'REQUEST YOUR KNACK';
                    }
                    if($scope.action=='edit') {
                        return 'UPDATE YOUR KNACK ' + $scope.knack_type;
                    }
                    if($scope.action=='repost') {
                        return 'REPOST YOUR KNACK ' + $scope.knack_type;
                    }
                }

                $scope.clearUpload = function(){
                    $scope.$apply(function () {
                        $scope.cropperImages[$scope.selectedImageIndex] = null;
                    });
                    
                    var uploadFile = $('#photo' + $scope.selectedImageIndex);
                    uploadFile.replaceWith( uploadFile = uploadFile.clone(true));
                };
                var post_resource = $resource(":protocol://:url/api/knacks/knacks/", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL
                    }, {
                        save: {
                            method: 'POST',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                var edit_resource = $resource(":protocol://:url/api/knacks/knacks/:id", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL,
                        id: $scope.knack.id
                    }, {
                        save: {
                            method: 'PUT',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.save_knack = function () {
                    $scope.showError = false;
                    $scope.knack.photo0 = $scope.cropperImages[0] == null ? $scope.knack.photo0 : $scope.cropperImages[0];
                    $scope.knack.photo1 = $scope.cropperImages[1] == null ? $scope.knack.photo1 : $scope.cropperImages[1];
                    $scope.knack.photo2 = $scope.cropperImages[2] == null ? $scope.knack.photo2 : $scope.cropperImages[2];
                    $scope.knack.photo3 = $scope.cropperImages[3] == null ? $scope.knack.photo3 : $scope.cropperImages[3];
                    $scope.knack.photo4 = $scope.cropperImages[4] == null ? $scope.knack.photo4 : $scope.cropperImages[4];
                        
                    if ($scope.category_name == 'Category Selection'){
                        $scope.category_selected = false;
                    }
                   
                    if (!$scope.knack.photo0 && !$scope.knack.photo1 && !$scope.knack.photo2 && !$scope.knack.photo3 && !$scope.knack.photo4){
                        $scope.photo_selected = false;
                    }
                    
                    if ($scope.postForm.$valid) {

                        
                        if(! $scope.photo_selected || ! $scope.category_selected){
                            return;
                        } 
                        

                        var price = $scope.knack.price.toString();
                        price = price.replace(/\$/gi, '');
                        price = parseFloat(price);
                        if (! isFinite(price)) {
                            $scope.wrong_price = true;
                            return;
                        }
                        price = price.toFixed(2);
                        // $scope.knack.price = price;
                        $scope.wrong_price = false;

                        if ($scope.action == 'create' || $scope.action=='repost') {
                            // Add new
                            $scope.posted_knack = true;
                            post_resource.save($scope.knack, function (knack) {
                                $modalInstance.close(knack);
                            }, function (error) {
                                $scope.message = error.data;
                                console.log(error);
                            });
                        } else {
                            // Update existing one
                            edit_resource.save($scope.knack, function (knack) {
                                $modalInstance.close(knack);
                            }, function (error) {
                                $scope.message = error.data;
                                console.log(error);
                            });
                        }
                    }
                    else if (!$scope.postForm.$valid || !$scope.photo_selected || !$scope.category_selected)
                    {
                        if(!$scope.showError){
                            $scope.showError = true;

                        } 
                    }
                };

                $scope.createMoreKnacks = function () {
                    $scope.posted_knack = false;
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                $('.modal-open .modal').css('overflow-y', 'hidden');
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                            $('.modal-open .modal').css('overflow-y', 'auto');
                        }
                    );
                };


                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="anonymously-text">When you post a knack anonymously, your name and photo will be hidden from the public. Also, your knack will not be linked to your profile.<br><br>NOTE: Customers are more likely to hire knackers who they can both see and verify. please choose wisely when posting anonymously.</p>';
                                $('.modal-open .modal').css('overflow-y', 'hidden');
                                return message;
                            }
                        }
                    });                    
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                            $('.modal-open .modal').css('overflow-y', 'auto');
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

    app.controller('NewKnackModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'UknackModals',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, UknackModals) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.postKnackOffered = function () {
                    UknackModals.openPostKnackModal().then(function (data) {
                        $modalInstance.dismiss('cancel');
                    });
                };

                $scope.postKnackRequested = function () {
                    UknackModals.openRequestKnackModal().then(function (data) {
                        $modalInstance.dismiss('cancel');
                    });
                };
            }]);

    app.controller('ItemModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', '$stateParams', 'data',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, $stateParams, data) {
                $scope.item = $.extend({
                    anonymous: false,
                    username: '',
                    name: '',
                    category: '',
                    description: '',
                    photo0: '',
                    photo1: '',
                    photo2: '',
                    photo3: '',
                    photo4: '',
                    schedule: '',
                    willing_to_travel: false,
                    price: '',
                    type: 'O',
                    miles: 'On Campus',
                    category_name: 'Category Selection'
                }, data.item);

                $scope.category_name = $scope.item.category_name;
                $scope.item_type = $scope.item.type == 'O' ? 'Offered' : 'Wanted';
                $scope.action = data.action;

                $scope.showError = false;
                $scope.photo_selected = true;
                $scope.category_selected = true;
                $scope.wrong_price = false;
                $scope.posted_item = false;
                $scope.sourceImage = null;
                $scope.cropperImage = {};
                $scope.cropperImages = [null,null,null,null,null];
                $scope.selectedImageIndex = null;

                $rootScope.bounds = {};
                $rootScope.bounds.left = 0;
                $rootScope.bounds.right = 0;
                $rootScope.bounds.top = 0;
                $rootScope.bounds.bottom = 0;


                $scope.getModalTitle = function() {
                    if($scope.action=='create' && $scope.item.type=='O') {
                        return 'SELL YOUR ITEM';
                    }
                    if($scope.action=='create' && $scope.item.type=='W') {
                        return 'REQUEST AN ITEM';
                    }
                    if($scope.action=='edit') {
                        return 'EDIT YOUR ITEM ' + $scope.item_type;
                    }
                    if($scope.action=='repost') {
                        return 'REPOST YOUR ITEM ' + $scope.item_type;
                    }
                }

                $scope.getSubmitButtonTitle = function() {
                    if($scope.action=='create' && $scope.item.type=='O') {
                        return 'POST YOUR ITEM';
                    }
                    if($scope.action=='create' && $scope.item.type=='W') {
                        return 'REQUEST YOUR ITEM';
                    }
                    if($scope.action=='edit') {
                        return 'UPDATE YOUR ITEM ' + $scope.item_type;
                    }
                    if($scope.action=='repost') {
                        return 'REPOST YOUR ITEM ' + $scope.item_type;
                    }
                }

                $scope.clearUpload = function(){
                    $scope.$apply(function () {
                        $scope.cropperImages[$scope.selectedImageIndex] = null;
                    });

                    var uploadFile = $('#photo' + $scope.selectedImageIndex);
                    uploadFile.replaceWith( uploadFile = uploadFile.clone(true));
                };

                var post_resource = $resource(":protocol://:url/api/items/items/", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL
                    }, {
                        save: {
                            method: 'POST',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                var edit_resource = $resource(":protocol://:url/api/items/items/:id", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL,
                        id: $scope.item.id
                    }, {
                        save: {
                            method: 'PUT',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.save_item = function () {
                    $scope.showError = false;
                    $scope.item.photo0 = $scope.cropperImages[0] == null ? $scope.item.photo0 : $scope.cropperImages[0];
                    $scope.item.photo1 = $scope.cropperImages[1] == null ? $scope.item.photo1 : $scope.cropperImages[1];
                    $scope.item.photo2 = $scope.cropperImages[2] == null ? $scope.item.photo2 : $scope.cropperImages[2];
                    $scope.item.photo3 = $scope.cropperImages[3] == null ? $scope.item.photo3 : $scope.cropperImages[3];
                    $scope.item.photo4 = $scope.cropperImages[4] == null ? $scope.item.photo4 : $scope.cropperImages[4];

                    if ($scope.category_name == 'Category Selection'){
                        $scope.category_selected = false;
                    }

                    if (!$scope.item.photo0 && !$scope.item.photo1 && !$scope.item.photo2 && !$scope.item.photo3 && !$scope.item.photo4){
                        $scope.photo_selected = false;
                    }

                    if ($scope.postForm.$valid) {
                        if (!$scope.photo_selected || !$scope.category_selected) {
                            return;
                        }

                        var price = $scope.item.price.toString();
                        price = price.replace(/\$/gi, '');
                        price = parseFloat(price);
                        if (!isFinite(price)) {
                            $scope.wrong_price = true;
                            return;
                        }
                        price = price.toFixed(2);
                        $scope.item.price = price;
                        $scope.wrong_price = false;

                        if ($scope.action == 'create') {
                            // Add new
                            $scope.posted_item = true;
                            post_resource.save($scope.item, function (item) {
                                $modalInstance.close(item);
                            }, function (error) {
                                $scope.message = error.data;
                                console.log(error);
                            });
                        } else {
                            // Update existing one
                            edit_resource.save($scope.item, function (item) {
                                $modalInstance.close(item);
                            }, function (error) {
                                $scope.message = error.data;
                                console.log(error);
                            });
                        }
                    }
                    else if (!$scope.postForm.$valid || !$scope.photo_selected || !$scope.category_selected)
                    {
                        if(!$scope.showError){
                            $scope.showError = true;

                        }
                    }
                };

                $scope.sellMoreItems = function () {
                    $scope.posted_item = false;
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                $('.modal-open .modal').css('overflow-y', 'hidden');
                                return message;
                            }
                        }
                    });

                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                            $('.modal-open .modal').css('overflow-y', 'auto');
                        }
                    );
                };

                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="font-4">When you post anonymously your name and photo will  hidden from the public.<br><br>Note: People are less likely to hire knackers that they  can’t see and verify. So choose wisely when posting anonymously.</p>';
                                $('.modal-open .modal').css('overflow-y', 'hidden');
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                            $('.modal-open .modal').css('overflow-y', 'auto');
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

    app.controller('NewItemModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'UknackModals',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, UknackModals) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.postItemOffered = function () {
                    UknackModals.openPostItemModal().then(function (data) {
                        $modalInstance.dismiss('cancel');
                    });
                };

                $scope.postItemWanted = function () {
                    UknackModals.openRequestItemModal().then(function (data) {
                        $modalInstance.dismiss('cancel');
                    });
                };
            }]);

    app.controller('KnackVideoModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$sce', 'video_url', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $sce, video_url) {
                $scope.video_url = video_url;
                $scope.config = {
                    sources: [
                        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
                    ],
                    tracks: [
                        {
                            src: "",
                            kind: "subtitles",
                            srclang: "en",
                            label: "English",
                            default: ""
                        }
                    ],
                    theme: "common/videogular-themes-default/videogular.css",
                    plugins: {
                        controls: {
                            autoHide: true,
                            autoHideTime: 5000
                        }
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);
    
    app.controller('LoginModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal',
                '$http', '$state', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, $state, localStorageService) {
            $scope.user = {
				email: '',
				password: ''
			};
            var AuthToken =  $resource(":protocol://:url/api/accounts/login/", {
    			protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            var SocialAuth = $resource(":protocol://:url/api/accounts/fb_login/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.socialLogin = function() {
                //SocialAuth.get(function(){
                //    $modalInstance.close();
                //    $rootScope.restricted();
                //}, function(error) {
                //    $scope.message = error.data;
                //});
                window.location.href=$scope.restProtocol + '://' + $scope.restURL + '/social/login/facebook/';
            };

            $scope.login = function () {

                $scope.authToken = AuthToken.save($scope.user, function(){

					localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
					localStorageService.add('rest_token', $scope.authToken.token);
					localStorageService.add('user_id', $scope.authToken.id);
                    localStorageService.add('full_name', $scope.authToken.full_name);
                    localStorageService.add('picture', $scope.authToken.picture);

                    $modalInstance.close();
                    $rootScope.restricted();

                    // $state.go($state.current, {}, {reload: true});
                    // $state.go('knack-offered', {}, {reload: true});
                    // window.location.href='/#/knacks/offered';
                    // window.location.href='/#/';

                    //window.location.href='/#/private-profile';
                    //$state.go('private-profile');

                    //if($rootScope.isGoToFeed) {
                    //    $state.go('feed-knacks');
                    //}
				},function(error) {
                    window.console.log(error.data);
					$scope.message = "The username and password don't match. Please try again.";
				});
            };

            $scope.registerModal = function () {
                $modalInstance.dismiss('cancel');

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

            $scope.forgotPasswordModal = function () {
                $modalInstance.dismiss('cancel');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/forgot-pwd-modal.html',
                    controller: 'ForgotPwdModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.openInfoModal = function () {
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/info-modal.html',
                    controller: 'InfoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
        }]);

    app.controller('RegisterModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'localStorageService', 'uuid', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, localStorageService, uuid) {

            $scope.user = {
                uuid: uuid,
                password: ''
            };
            var AuthToken =  $resource(":protocol://:url/api/accounts/login/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.socialLogin = function() {
                window.location.href=$scope.restProtocol + '://' + $scope.restURL + '/social/login/facebook/';
            };

            $scope.login = function () {
                $scope.authToken = AuthToken.save($scope.user, function(){
                    localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
                    localStorageService.add('rest_token', $scope.authToken.token);
                    localStorageService.add('user_id', $scope.authToken.id);
                    localStorageService.add('full_name', $scope.authToken.full_name);
                    localStorageService.add('picture', $scope.authToken.picture);

                    $modalInstance.close();
                    $rootScope.restricted();
                    localStorageService.remove('registered_email');
                    $rootScope.is_authenticated = true;
                    $state.go('private-profile');
                    // $state.go($state.current, {}, {reload: true});
                    // $state.go('knack-offered', {}, {reload: true});

                    // window.location.href='/#/';
                },function(error) {
                    $scope.message = error.data;
                });
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.$on('$routeChangeStart', function(){
                $modalInstance.close();
            });
        }]);

    app.controller('RegisterEmailModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$modal', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $modal, localStorageService) {
            $scope.user = {
				email: $rootScope.new_email
			};
            var RegisterEmail =  $resource(":protocol://:url/api/accounts/register_email/", {
    			protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.register = function (form) {
                if(!form || form.$invalid) {
                    return;
                }

                // if(!$scope.user.email.endsWith(".edu")) {
                //     $scope.message = "You must sign up with a .edu student email address to become a member of Uknack.";
                //     return;
                // }

                $scope.email = RegisterEmail.save($scope.user, function(data){
					localStorageService.add('registered_email', data.email);
                    $modalInstance.close();
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/thanks-modal.html',
                        controller: 'ThanksModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message = '';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
				},function(error) {
                    $scope.message = 'This account is already associated with an account, please try a different email';
					//$scope.message = error.data.email[0] || error.data;
				});

                //$modalInstance.dismiss('cancel');
            };

            $scope.openLoginModal = function () {
                $modalInstance.dismiss('cancel');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal wide-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                        $state.go('private-profile');
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.openInfoModal = function () {
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/info-modal.html',
                    controller: 'InfoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
        }]);

    app.controller('ForgotPwdModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$modal', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $modal, localStorageService) {
                $scope.email = '';
                
                var ForgotPassword =  $resource(":protocol://:url/api/accounts/forgot-password/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                });

                $scope.requestReset = function () {
                    if (!$scope.forgotPwdForm.$valid) { return; }
                    $scope.user = {
                        email: $scope.email
                    };
                    ForgotPassword.save($scope.user, function(data){
                        $modalInstance.dismiss('cancel');
                        var submodalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'views/modals/reset-thanks-modal.html',
                            controller: 'ThanksModalCtl',
                            windowClass: 'vcenter-modal',
                            resolve: {
                                message: function () {
                                    var message = 'Sweet: Your password reset email has been sent.';
                                    return message;
                                }
                            }
                        });
                        submodalInstance.result.then(function (data) {
                                console.log(data);
                            }, function () {
                                console.info('Modal dismissed at: ' + new Date());
                            }
                        );
                    },function(error) {
                        $scope.message = 'User does not exist.';
                    });
                };

                $scope.openLoginModal = function () {
                    $modalInstance.dismiss('cancel');

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/login-modal.html',
                        controller: 'LoginModalCtl',
                        windowClass: 'vcenter-modal wide-modal'
                    });

                    modalInstance.result.then(function (data) {
                            console.log(data);
                            $state.go('private-profile');
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

            }]);

    app.controller('PwdResetModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$modal', 'localStorageService', 'uuid', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $modal, localStorageService, uuid) {
                $scope.password = '';
                $scope.confirm_password = '';

                var ResetPassword =  $resource(":protocol://:url/api/accounts/reset-password/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                });

                $scope.setPassword = function () {
                    if (!$scope.resetPwdForm.$valid) { return; }
                    if ($scope.password != $scope.confirm_password) {
                        $scope.message = 'The two passwords do not match.';
                        return;
                    }
                    $scope.user = {
                        password: $scope.password,
                        uuid: uuid
                    };
                    ResetPassword.save($scope.user, function(data){
                        $modalInstance.dismiss('cancel');
                        var submodalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'views/modals/reset-thanks-modal.html',
                            controller: 'ThanksModalCtl',
                            windowClass: 'vcenter-modal',
                            resolve: {
                                message: function () {
                                    var message = 'Your password has been successfully reset.';
                                    return message;
                                }
                            }
                        });
                        submodalInstance.result.then(function (data) {
                                console.log(data);
                            }, function () {
                                console.info('Modal dismissed at: ' + new Date());
                            }
                        );
                    },function(error) {
                        $scope.message = 'User does not exist.';
                    });
                };

                $scope.openLoginModal = function () {
                    $modalInstance.dismiss('cancel');

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/login-modal.html',
                        controller: 'LoginModalCtl',
                        windowClass: 'vcenter-modal wide-modal'
                    });

                    modalInstance.result.then(function (data) {
                            console.log(data);
                            $state.go('private-profile');
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

            }]);

    app.controller('PaymentModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService) {
            
            var paymentItemList = [];
            var item1 = new Object();
            item1.detail = "Send money instantly for free";
            item1.img = 'images/venmo.png';
            var item2 = new Object();
            item2.detail = "Paypal also accepts credit cards";
            item2.img = 'images/paypal.png';
            var item3 = new Object();
            item3.detail = "Pay cash on campus";
            item3.img = 'images/cash.png';
            paymentItemList.push(item1);
            paymentItemList.push(item2);
            paymentItemList.push(item3);
            $scope.paymentItemList = paymentItemList;
            $scope.activeIndex = -1;
            $scope.activeOption = function(index) {
                $scope.activeIndex = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.paidCash = function () {

                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/agreed-modal.html',
                    controller: 'AgreedModalCtl',
                    windowClass: 'vcenter-modal'
                });

                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
        }]);

    app.controller('HireModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'knack', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService, knack) {
            
            var paymentItemList = [];
            var item1 = new Object();
            item1.detail = "Send money instantly for free";
            item1.img = 'images/venmo.png';
            var item2 = new Object();
            item2.detail = "Paypal also accepts credit cards";
            item2.img = 'images/paypal.png';
            var item3 = new Object();
            item3.detail = "Pay cash on campus";
            item3.img = 'images/cash.png';
            paymentItemList.push(item1);
            paymentItemList.push(item2);
            paymentItemList.push(item3);

            $scope.knack = knack;
            $scope.knack_url = $rootScope.restProtocol + '://' + $rootScope.restURL + '/#/knacks/offered/' + knack.id;
            $scope.shares = 0;
            $scope.real_price = knack.price;
            $scope.discountPct = 0;
            $scope.paymentItemList = paymentItemList;
            $scope.activeIndex = -1;
            twttr.ready(function(twttr){
               function handleTweetEvent(event){
                 if (event) {
                   alert("This is a callback from a tweet")
                 }
               }
               twttr.events.bind('tweet', handleTweetEvent);        
             });

            $scope.activeOption = function(index) {
                $scope.activeIndex = index;
                if (index == 0){
                    $("#payBtn").text("Pay with Venmo");
                }
                else if (index == 1){
                    $("#payBtn").text("PAY WITH PAYPAL");
                }
                else
                    $("#payBtn").text("PAY IN CASH");
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.callback = function(response){
    		    if($("#facebookShareBtn").text() != "SHARED") {
                    $scope.discountPct = $scope.discountPct + 5;
                    $("#discountPercent").text("%" + $scope.discountPct.toString());
                    $("#facebookShareBtn").text("SHARED");
                    $scope.real_price = knack.price / 100 * (100 - $scope.discountPct);
                    $("#real-price").text($scope.real_price.toFixed(1).toString());
                }
                console.log(response);
            };
            $scope.shareTweet = function(){
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.knack_url);
                var text = encodeURIComponent($scope.knack.name);
                var twitter_url = 'http://twitter.com/intent/tweet?text=' + text + '&url=' + url;
                var win=window.open(twitter_url, 'twitter', opts);
                var timer = setInterval(function() {
                    if ($("#twitterShareBtn").text() == "SHARED"){
                        clearInterval(timer);
                        return;
                    }
    		    if(win.closed) {
            		clearInterval(timer);
                        $scope.discountPct = $scope.discountPct + 5;
                        $("#discountPercent").text("%" + $scope.discountPct.toString());
                        $("#twitterShareBtn").text("SHARED");
                        $scope.real_price = knack.price / 100 * (100 - $scope.discountPct);
                        $("#real-price").text($scope.real_price.toFixed(1).toString());
                    }
                }, 300);
            };
            $scope.sharePinterest = function(){
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.knack_url);
                var text = encodeURIComponent($scope.knack.name);
                var photo = encodeURIComponent($scope.knack.photo0);
                var pinterest_url = '//www.pinterest.com/pin/create/button/?url=' + url + '&media=' + photo + '&description=' + text;
                var pinwin = window.open(pinterest_url, 'pinterest', opts);
                var timer = setInterval(function() {
                    if ($("#pinterestShareBtn").text() == "SHARED"){
                        clearInterval(timer);
                        return;
                    }
        		    if(pinwin.closed) {
                		clearInterval(timer);
                        $scope.discountPct = $scope.discountPct + 5;
                        $("#discountPercent").text("%" + $scope.discountPct.toString());
                        $("#pinterestShareBtn").text("SHARED");
                        $scope.real_price = knack.price / 100 * (100 - $scope.discountPct);
                        $("#real-price").text($scope.real_price.toFixed(1).toString());
                    }
                }, 300);
            };
            $scope.paidCash = function () {

                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/agreed-modal.html',
                    controller: 'AgreedModalCtl',
                    windowClass: 'vcenter-modal'
                });

                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
        }]);

    app.controller('WriteReviewModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'buy_item', 'item_type', 'item_id', 'reviews', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, buy_item, item_type, item_id, reviews) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];

            var post_resource = $resource(":protocol://:url/api/reviews/reviews/", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'POST',
                        transformRequest: transFormRequestHandler,
                        headers: {'Content-Type': undefined}
                    }
                }
            );
            
            $scope.created = true;
            $scope.review = {
                rating: 5,
                feedback: '',
                item_type: item_type,
                item_id: item_id
            };
            $scope.buy_item = buy_item;
            $scope.item_type = item_type;
            $scope.ratingItemList = ratingItemList;

            if (reviews){
                for (var i=0; i<reviews.length; i++) {
                    if (reviews[i].poster == localStorageService.get('user_id')){
                        $scope.review['rating'] = reviews[i].rating;
                        $scope.review['feedback'] = reviews[i].feedback;
                        $scope.item_id = reviews[i].id;
                        $scope.created = false;
                    }
                }
            }            

            var edit_resource = $resource(":protocol://:url/api/reviews/reviews/:id", {
                    protocol: $scope.restProtocol,
                    url: $scope.restURL,
                    id: $scope.item_id
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: transFormRequestHandler,
                        headers: {'Content-Type': undefined}
                    }
                }
            );

            $scope.selectItem = function(index) {
                $scope.review.rating = index + 1;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postReview = function () {
                if (!$scope.writereviewForm.$valid) { return; }
                if ($scope.created){
                    post_resource.save($scope.review, function (review) {
                        $modalInstance.close(review);
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    edit_resource.save($scope.review, function (review) {
                        $modalInstance.close(review);
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                }
            };
        }]);

    app.controller('ContactMeModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'contact_user', 'title', 'button_title', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService, contact_user, title, button_title) {
            $scope.contact_user = angular.copy(contact_user);
            $scope.button_title = button_title;
            $scope.title = title;
            $scope.sent_message = false;
            $scope.sendMessage = function () {
                $scope.sent_message = true;
            };
            $scope.continue = function () {
                $scope.sent_message = false;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    app.controller('AgreedModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];
            $scope.ratingItemList = ratingItemList;
            $scope.isSelected = -1;
            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    app.controller('ThanksModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'message', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, message) {
            $scope.isSelected = -1;
            $scope.message = message;
            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    app.controller('InfoModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'message', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, message) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];
                    
            $scope.ratingItemList = ratingItemList;
            $scope.isSelected = -1;
            $scope.message = message;

            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);

        app.controller('BusinessModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'business_model', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, business_model) {
            $scope.business = business_model;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

   app.controller('LoginToModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', 'message',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, message) {

            $scope.gotoLogin = function () {
                $rootScope.isGoToFeed = true;
                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal wide-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.gotoSignup = function () {
                $modalInstance.dismiss('cancel');
                $rootScope.isGoToFeed = true;
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal wide-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    app.controller('LoginToFlipModalCtl',
            ['$scope', '$rootScope', '$modalInstance', '$modal', 'title',
            function ($scope, $rootScope, $modalInstance, $modal, title) {

            $scope.title = title;
            $scope.gotoLogin = function () {
                $rootScope.isGoToFeed = true;
                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal wide-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.gotoSignup = function () {
                $modalInstance.dismiss('cancel');
                $rootScope.isGoToFeed = true;
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal wide-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

    app.controller('CroppingModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'sourceImage',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, sourceImage) {
            $scope.sourceImage = sourceImage;
            $scope.croppedImage = null;

            $scope.cancel = function () {
                this.clearUpload();
                $modalInstance.dismiss('cancel');
            };

            $scope.cropFunc = function () {
                $modalInstance.close({croppedImage: $scope.croppedImage});
            };                 
        }]);

    app.controller('ProfileCroppingModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'sourceImage',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, sourceImage) {
            $scope.sourceImage = sourceImage;
            $scope.croppedImage = null;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.cropFunc = function () {
                $modalInstance.close({croppedImage: $scope.croppedImage});
                var private_picture_edit = $resource(":protocol://:url/api/accounts/profile/picture/edit",{
                    protocol: this.$parent.restProtocol,
                    url: this.$parent.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('picture', data['picture']);
                            fd.append('full_name', data['full_name']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}
                    }
                });

                var data = {
                    'picture': $scope.croppedImage,
                    'full_name': localStorageService.get('full_name')
                };
                private_picture_edit.save(data, function (result) {
                    localStorageService.add('picture', result.picture);
                    $rootScope.restricted();
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });
            };
        }]);

    app.controller('ValidateEduModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modalStack', '$http', '$modal', 'localStorageService', 'title',
            function ($scope, $rootScope, $resource, $modalInstance, $modalStack, $http, $modal, localStorageService, title) {
            $scope.user = {
                email: ''
            };
            $scope.title = title;

            var SendInvitation =  $resource(":protocol://:url/api/accounts/send_invitation/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.send = function (form) {
                if(!form || form.$invalid) {
                    return;
                }

                if(!$scope.user.email.endsWith(".edu")) {
                    $scope.message = "You must enter a .edu student email address.";
                    return;
                }

                var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/validation-thanks-modal.html',
                        controller: 'ThanksModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message = '';
                                return message;
                            }
                        }
                    });

                submodalInstance.result.finally(function (data) {
                        $modalStack.dismissAll();
                    });

                // $scope.email = SendInvitation.save($scope.user, function(data){
                //     $modalInstance.close();
                //     var submodalInstance = $modal.open({
                //         animation: true,
                //         templateUrl: 'views/modals/thanks-modal.html',
                //         controller: 'ThanksModalCtl',
                //         windowClass: 'vcenter-modal',
                //         resolve: {
                //             message: function () {
                //                 var message = '';
                //                 return message;
                //             }
                //         }
                //     });
                    // submodalInstance.result.finally(function (data) {
                    //     $modalStack.dismissAll();
                    // });
                // },function(error) {
                //     $scope.message = error.data.email[0] || error.data;
                // });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.openInfoModal = function () {
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/info-modal.html',
                    controller: 'InfoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
        }]);

        var transFormRequestHandler = function (data, headersGetterFunction) {
            if (data === undefined)
                return data;

            var fd = new FormData();
            angular.forEach(data, function (value, key) {
                if (value instanceof FileList) {
                    if (value.length == 1) {
                        fd.append(key, value[0]);
                    } else {
                        angular.forEach(value, function (file, index) {
                            fd.append(key + '_' + index, file);
                        });
                    }
                } else {
                    fd.append(key, value);
                }
            });

            return fd;
        }
    return app;
});
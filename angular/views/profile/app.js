'use strict';
define(['angularAMD'], function(app) {
    app.controller('profileCtrl', [
        'localStorageService', '$rootScope', '$scope', '$cookies', '$resource', '$modal', '$state', '$stateParams', '$location', '$timeout', '$filter', 'UknackModals', 'Authentication', 'user',
        function (localStorageService, $rootScope, $scope, $cookies, $resource, $modal, $state, $stateParams, $location, $timeout, $filter, UknackModals, Authentication, user) {
            var public_profile_resource = $resource(":protocol://:url/api/accounts/profile?user_id=:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            var private_profile_resource = $resource(":protocol://:url/api/accounts/profile?social_backend=:social_backend&social_code=:social_code",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                social_backend: '@social_backend',
                social_code: '@social_code'
            });

            var flag = true;
            if ($location.search().social_code != undefined){
                $cookies.social_code = $location.search().social_code;
            } else {
                flag = false;
            }

            if ($location.search().social_backend != undefined){
                $cookies.social_backend = $location.search().social_backend;
            } else {
                flag = false;
            }

            if ($location.search().token != undefined){
                $cookies.token = $location.search().token;   
            } else {
                flag = false;
            }
            if (flag) {
                $state.go('private-profile');
            }

            $scope.isMobile = $(window).width() < 768;
            if (!flag){
                init();
            }

            function init(){
                $scope.knacks = [];              // knacks list
                $scope.items = [];
                $scope.edit_field = null;       // a profile field to edit
                $scope.user = null;             // profile info
                $scope.is_public = false;       // boolean if this page is for public or private profile.
                $scope.user_post_data = {};      // data to post for profile edit
                $scope.edit_item = null;         // An user's item or knack to edit
                $scope.active_tab = 'knacks';
                $scope.active_r_tab = 'connections';
                $scope.isCollegeBoxOpened = false;
                $scope.isAgeBoxOpened = false;
                $scope.isGenderBoxOpened = false;
                $scope.limit = 3;
                $rootScope.cropper0 = {};
                $rootScope.cropper0.sourceImage = null;
                $rootScope.cropper0.croppedImage = null;
                
                $scope.knack_url = $rootScope.restProtocol + '://' + $rootScope.restURL + '/#/knacks/offered/';
                $scope.home_url = $rootScope.restProtocol + '://' + $rootScope.restURL;
                $scope._user = user;
                
                $scope.user_not_found = false;

                if ($stateParams.id) {
                    $rootScope.currentMenu = 'profile';
                } else {
                    $rootScope.currentMenu = 'profile_edit';
                }

                $scope.restricted();

                if ($stateParams.public_url) {
                    $scope.is_public = true;
                    $scope.user = public_profile_resource.get({public_url: $stateParams.public_url}, function (result) {
                        $scope.user = result;

                        result.picture = result.picture ? result.picture : 'images/users/no_avatar.png';
                        $scope.user_post_data = result;
                        if ($scope.user_post_data.social_links.facebook != ''){
                            $scope.user_post_data.social_links.facebook = 'https://' + $scope.user_post_data.social_links.facebook;
                        }
                        if ($scope.user_post_data.social_links.twitter != ''){
                            $scope.user_post_data.social_links.twitter = 'https://' + $scope.user_post_data.social_links.twitter;
                        }
                        if ($scope.user_post_data.social_links.instagram != ''){
                            $scope.user_post_data.social_links.instagram = 'https://' + $scope.user_post_data.social_links.instagram;
                        }

                        if ($rootScope.genders.indexOf($scope.user_post_data.gender) == -1) {
                            $scope.user_post_data.gender = "Gender";
                        }

                        $scope.knacks = $filter('filter')(result.knacks, {anonymous: false});
                        $scope.items = $filter('filter')(result.items, {anonymous: false});
                        $scope.connections = result.connections;
                        $scope.reviews = result.reviews;
                        if ($scope.reviews.length > 0) {
                            var sum = 0.0;
                            angular.forEach($scope.reviews, function(value, index){
                                sum += value.rating;
                            });
                            $scope.overall_rating = sum / $scope.reviews.length;
                            $scope.overall_rating = $scope.overall_rating.toFixed(1);
                        }
                    }, function () {
                        $scope.user_not_found = true;
                    });
                } else {
                    var social_backend = '';
                    var social_code = '';
                    if ($cookies.social_backend != undefined) {
                        social_backend = $cookies.social_backend;
                    }
                    if ($cookies.social_code != undefined) {
                        social_code = $cookies.social_code;
                    }
                    if ($cookies.token != undefined) {
                        localStorageService.add('Authorization', 'Token ' + $cookies.token);
                        localStorageService.add('rest_token', $cookies.token);
                        $rootScope.restricted();
                        $rootScope.is_authenticated = true;
                    }
                    $scope.user = private_profile_resource.get({social_backend: social_backend, social_code: social_code}, function (result) {
                        $scope.user = result;
                        
                        result.picture = result.picture ? result.picture : 'images/users/no_avatar.png';
                        $scope.user_post_data = result;
                        if ($scope.user_post_data.social_links.facebook != ''){
                            $scope.user_post_data.social_links.facebook = 'https://' + $scope.user_post_data.social_links.facebook;
                        }
                        if ($scope.user_post_data.social_links.twitter != ''){
                            $scope.user_post_data.social_links.twitter = 'https://' + $scope.user_post_data.social_links.twitter;
                        }
                        if ($scope.user_post_data.social_links.instagram != ''){
                            $scope.user_post_data.social_links.instagram = 'https://' + $scope.user_post_data.social_links.instagram;
                        }

                        if ($rootScope.genders.indexOf($scope.user_post_data.gender) == -1) {
                            $scope.user_post_data.gender = "Gender";
                        }
                        $scope.knacks = $filter('filter')(result.knacks, {anonymous: false});
                        $scope.items = $filter('filter')(result.items, {anonymous: false});
                        $scope.connections = $scope._user.profile().connections;
                        $scope.reviews = result.reviews;
                        if ($scope.reviews.length > 0) {
                            var sum = 0.0;
                            angular.forEach($scope.reviews, function(value, index){
                                sum += value.rating;
                            });
                            $scope.overall_rating = sum / $scope.reviews.length;
                        }

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();

                        if (social_backend != '' && social_code != '') {
                            delete $cookies.social_backend;
                            delete $cookies.social_code;
                            delete $cookies.token;
                        }
                    }, $scope.checkTokenError);
                }
            }

            function show_welcome_popup(){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/views/modals/register-modal.html',
                    controller: 'RegisterModalCtl',
                    windowClass: 'vcenter-modal',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            }
            
            $scope.openHireModal = function(knack) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/hire-modal.html',
                    controller: 'HireModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        knack: function() {
                            return knack;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.openWriteAReviewModal = function(buy_item, item_type, item_id, reviews) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/write-review-modal.html',
                    controller: 'WriteReviewModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        buy_item: function () {
                            return buy_item;
                        },
                        item_type: function () {
                            return item_type;
                        },
                        item_id: function() {
                            return item_id;
                        },
                        reviews: function() {
                            return reviews;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.openByItemModal = function() {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/payment-modal.html',
                    controller: 'PaymentModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.contactMe = function(first_name) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/contact-me-modal.html',
                    controller: 'ContactMeModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        contact_user: function () {
                            return {name: first_name};
                        },
                        button_title:function(){
                            return "SEND YOUR MESSAGE"
                        },
                        title:function(){
                            return "Contact"
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.openPostKnackModal = function () {    
                UknackModals.openPostKnackModal().then(function (data) {
                    $scope.knacks.splice(0, 0, data);
                });
            };

            $scope.openNewKnackModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/new-knack-modal.html',
                    controller: 'NewKnackModalCtl',
                    windowClass: 'vcenter-modal',
                    backdrop:'static'
                });
                modalInstance.result.then(function (data) {
                        // [].push.apply($scope.knacks, data);
                        $scope.knacks.splice(0, 0, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.openPostItemModal = function () {
                UknackModals.openPostItemModal().then(function (data) {
                    $scope.items.splice(0, 0, data);
                });
            };

            $scope.openNewItemModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/new-item-modal.html',
                    controller: 'NewItemModalCtl',
                    windowClass: 'vcenter-modal',
                    backdrop:'static'
                });
                modalInstance.result.then(function (data) {
                        // [].push.apply($scope.knacks, data);
                        $scope.items.splice(0, 0, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.gotoKnackIdea = function() {
                $state.go('knack-ideas');
            };

            $scope.toggleCollegeBox = function(college) {
                $scope.isCollegeBoxOpened = false;
                $scope.user_post_data.college = college;
            };

            $scope.toggleYearBox = function(year) {
                $scope.isAgeBoxOpened = false;
                $scope.user_post_data.year = year;
            };

            $scope.toggleGenderBox = function(gender) {
                $scope.isGenderBoxOpened = false;
                $scope.user_post_data.gender = gender;
                $scope.save_profile();
            };

            $scope.edit_profile = function(field_name, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if(!$scope.user_not_found)
                    $scope.edit_field = field_name;
            };

            $scope.edit_knack = function(knack) {
                UknackModals.openEditKnackModal(knack).then(function (data) {
                        angular.extend(knack, data);
                        var submodalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'views/modals/info-modal.html',
                            controller: 'InfoModalCtl',
                            windowClass: 'vcenter-modal',
                            resolve: {
                                message: function () {
                                    var message =
                                        '<div class="success-popup"><div class="font-1 heavy-blue-color">Great!</div><div class="font-1 heavy-blue-color">Your item has been updated.</div><br/></div>';
                                    return message;
                                }
                            }
                        });
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
            };

            $scope.edit_item = function(item) {
                UknackModals.openEditItemModal(item).then(function (data) {
                    angular.extend(item, data);
                });
            };

            $scope.repost_knack = function(knack) {
                UknackModals.openRepostKnackModal(knack);
            };

            $scope.repost_item = function(item) {
                UknackModals.openRepostItemModal(item);
            };

            $scope.save_profile = function() {
                var private_profile_edit = $resource(":protocol://:url/api/accounts/profile/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('full_name', data['full_name']);
                            fd.append('college', data['college']);
                            fd.append('year', data['year']);
                            fd.append('age', data['age']);
                            fd.append('gender', data['gender']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.profileForm.$valid) {
                    var data = {
                        'full_name' : $scope.user_post_data.full_name,
                        'college': $scope.user_post_data.college,
                        'year': $scope.user_post_data.year,
                        'age': $scope.user_post_data.age,
                        'gender': $scope.user_post_data.gender
                    };
                    private_profile_edit.save(data, function (result) {
                        $scope.user_post_data = result;

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();

                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_social = function() {
                var private_profile_social_edit = $resource(":protocol://:url/api/accounts/profile/social/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('twitter', data['twitter']);
                            fd.append('facebook', data['facebook']);
                            fd.append('instagram', data['instagram']);
                            fd.append('googleplus', data['googleplus']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.socialForm.$valid) {
                    private_profile_social_edit.save($scope.user_post_data.social_links, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_reasons = function() {
                var private_profile_reasons_edit = $resource(":protocol://:url/api/accounts/profile/reasons/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            angular.forEach(data, function(value, key) {
                                fd.append(key, value);
                            });
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.reasonForm.$valid) {
                    private_profile_reasons_edit.save($scope.user_post_data.reasons, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_about = function() {
                var private_profile_about_edit = $resource(":protocol://:url/api/accounts/profile/about/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('about', data);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.aboutForm.$valid) {
                    private_profile_about_edit.save($scope.user_post_data.about_me, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_payment = function() {
                var private_profile_payment_edit = $resource(":protocol://:url/api/accounts/profile/payment/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('venmo', data['venmo']);
                            fd.append('paypal', data['paypal']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.paymentForm.$valid) {
                    var data = {'venmo' : $scope.user_post_data.payment_venmo, 'paypal': $scope.user_post_data.payment_paypal};
                    private_profile_payment_edit.save(data, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_public_url = function() {
                var private_profile_publicurl_edit = $resource(":protocol://:url/api/accounts/profile/public_url/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('public_url', data);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.paymentForm.$valid) {
                    private_profile_publicurl_edit.save($scope.user_post_data.public_profile_url, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };
            
            $scope.save_notification_email = function() {
                var private_profile_notification_email = $resource(":protocol://:url/api/accounts/profile/notification_email/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('notification_email', data);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.notificationEmailForm.$valid) {
                    $scope.notificationEmailForm.show_error = true;
                    private_profile_notification_email.save($scope.user_post_data.notification_email, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    $scope.notificationEmailForm.show_error = true;
                }
            };

            $scope.close_edit = function() {
                $scope.edit_field = null;
            };

            $scope.add_more_reason = function() {
                $scope.user_post_data.reasons.push('');
            };

            $scope.remove_reason = function(index) {
                $scope.user_post_data.reasons.splice(index, 1);
            };

            $scope.activate_knacks = function() {
                $scope.active_tab = 'knacks';
            };

            $scope.activate_items = function() {
                $scope.active_tab = 'items';
            };

            $scope.activate_connections = function() {
                $scope.active_r_tab = 'connections';
            };

            $scope.activate_reviews = function() {
                $scope.active_r_tab = 'reviews';
            };

            $scope.instagram_focus_out = function() {
                if ($scope.user_post_data.social_links.instagram == 'www.instagram.com/'){
                    $scope.user_post_data.social_links.instagram = '';
                }
            };

            $scope.instagram_focus_in = function() {
                if ($scope.user_post_data.social_links.instagram == ''){
                    $timeout(function() {
                        $scope.user_post_data.social_links.instagram = 'www.instagram.com/';
                    }, 10);                      
                }
            };

            $scope.twitter_focus_out = function() {
                if ($scope.user_post_data.social_links.twitter == 'twitter.com/'){
                    $scope.user_post_data.social_links.twitter = '';
                }
            };

            $scope.twitter_focus_in = function() {
                if ($scope.user_post_data.social_links.twitter == ''){
                    $timeout(function() {
                        $scope.user_post_data.social_links.twitter = 'twitter.com/';
                    }, 10);
                }
            };

            $scope.facebook_focus_out = function() {
                if ($scope.user_post_data.social_links.facebook == 'www.facebook.com/'){
                    $scope.user_post_data.social_links.facebook = '';
                }
            };

            $scope.facebook_focus_in = function() {
                if ($scope.user_post_data.social_links.facebook == ''){
                    $timeout(function() {
                        $scope.user_post_data.social_links.facebook = 'www.facebook.com/';
                    }, 10);                    
                }
            };

            $scope.venmo_focus_out = function() {
                if ($scope.user_post_data.payment_venmo == 'venmo.com/'){
                    $scope.user_post_data.payment_venmo = '';
                }
            };

            $scope.venmo_focus_in = function() {
                if ($scope.user_post_data.payment_venmo == ''){
                    $timeout(function() {
                        $scope.user_post_data.payment_venmo = 'venmo.com/';
                    }, 10);                    
                }
            };

            $scope.paypal_focus_out = function() {
                if ($scope.user_post_data.payment_paypal == 'paypal.com/'){
                    $scope.user_post_data.payment_paypal = '';
                }
            };

            $scope.paypal_focus_in = function() {
                if ($scope.user_post_data.payment_paypal == ''){
                    $timeout(function() {
                        $scope.user_post_data.payment_paypal = 'paypal.com/';
                    }, 10);                                        
                }
            };

            $scope.profile_url_focus_out = function() {
                if ($scope.user_post_data.public_profile_url == 'www.uknack.com/') {
                    $scope.user_post_data.public_profile_url = '';
                }
            };

            $scope.profile_url_focus_in = function() {
                if ($scope.user_post_data.public_profile_url == '' || $scope.user_post_data.public_profile_url == undefined) {
                    $timeout(function() {
                        $scope.user_post_data.public_profile_url = 'www.uknack.com/';
                    }, 10);                    
                }
            };   

            $scope.showAll = function() {
                $scope.limit = $scope.reviews.length;
            }         

            $scope.shareItemTweet = function(id, name) {
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.knack_url + id);
                var text = encodeURIComponent(name);
                var twitter_url = 'http://twitter.com/intent/tweet?text=' + text + '&url=' + url;
                window.open(twitter_url, 'twitter', opts);
            }

            $scope.shareItemPinterest = function(id, name, photo){
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.knack_url + id);
                var text = encodeURIComponent(name);
                var photo = encodeURIComponent(photo);
                var pinterest_url = '//www.pinterest.com/pin/create/button/?url=' + url + '&media=' + photo + '&description=' + text;
                window.open(pinterest_url, 'pinterest', opts);
            };

            $scope.shareProfileTweet = function(username, full_name) {
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.home_url + '/#/public/' + username);
                var text = encodeURIComponent(full_name);
                var twitter_url = 'http://twitter.com/intent/tweet?text=' + text + '&url=' + url;
                window.open(twitter_url, 'twitter', opts);
            }

            $scope.shareProfilePinterest = function(username, full_name, photo){
                var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2;
                var opts = 'status=1' + 
                ',width=' + width + 
                ',height=' + height +
                ',top=' + top + 
                ',left=' + left;
                var url = encodeURIComponent($scope.home_url + '/#/public/' + username);
                var text = encodeURIComponent(full_name);
                var photo = encodeURIComponent(photo);
                var pinterest_url = '//www.pinterest.com/pin/create/button/?url=' + url + '&media=' + photo + '&description=' + text;
                window.open(pinterest_url, 'pinterest', opts);
            };

        }]);
    return app;
});

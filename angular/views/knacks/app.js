'use strict';
define(['app'], function (app) {
    app.register.controller('knacksCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$state', '$stateParams', '$window', 'UknackModals', 'Authentication', 'user',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $state, $stateParams, $window, UknackModals, Authentication, user) {

            var knack_item_resource = $resource(":protocol://:url/api/knacks/knacks/:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            var knack_idea_item_resource = $resource(":protocol://:url/api/knacks/knack_ideas/:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            var loading = false;

            $rootScope.currentMenu = 'knacks';
            $scope.current_page = $state.current.name;
            $scope.current_type = $state.current.data.type;
            $scope.filter_name = 'filter_' + $scope.current_type;
            
            $scope.user = user;

            $scope.knacks = [];
            $scope.total_count = 0;

            // Calculate items count depending on a user screen width
            // 244: 220px (width of an item) + 24px (12px margin on left and right)
            $scope.row_size = Math.floor($('#item-container').width() / 244);
            // Load up to 3 rows
            $scope.rows = 3;

            $scope.page_size = $scope.row_size * $scope.rows;
            $scope.page = 1;
            $scope.more = true;

            $scope.single_knack = null;
            $scope.categories = $rootScope.knackCategories;
            $scope.sortList = ['Most Recent', 'Highest rated', 'Favorite Knackers'];
            $scope.selectedItem = 'Most recent';
            $scope.isShowSortContent = false;

            if ($state[$scope.filter_name]) {
                $scope.filter = $state[$scope.filter_name];
            } else {
                $scope.filter = {};
                if ($scope.current_type != 'knack-ideas') {
                    $scope.filter = {
                        'age': {
                            'from': 0,
                            'to': 60
                        },
                        'price': {
                            'from': 0,
                            'to': 240
                        },
                        'gender': '',
                        'type': $scope.current_type == 'knack-offered' ? 'O': 'W',
                        'sort_by': 'recently',
                        'search_text': ''
                    }
                }
            }

            if($stateParams.id != null){
                var resource = $scope.current_type == 'knack-ideas' ? knack_idea_item_resource : knack_item_resource;
                resource.get({'id': $stateParams.id}, function(result){
                    $scope.single_knack = result;
                }, function(error){
                    console.log(error);
                });
            }

            $scope.restricted();

            var pKnacks = $scope.knacks;
            for(var i = 0; i < pKnacks.length; i++) {
                var college = pKnacks[i].owner.college;
                var title = pKnacks[i].name;
                if(college.length > 18) {
                    $scope.knacks[i].ellipsisCollege = college.slice(0, 17) + ' ...';
                } else {
                    $scope.knacks[i].ellipsisCollege = college;
                }
                if(title.length > 55) {
                    $scope.knacks[i].ellipsisTitle = title.slice(0, 54) + '...';
                } else {
                    $scope.knacks[i].ellipsisTitle = title;
                }
            }

            showKnacks('init');

            function showKnacks(type) {
                if (loading) {
                    return;
                }
                loading = true;
                $state[$scope.filter_name] = $scope.filter;
                if ($scope.single_knack) {
                    $scope.closeSingle();
                }

                if(type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.knacks = [];
                    $scope.page = 1;
                }

                if ($scope.current_type != 'knack-ideas') {
                    var knacks_resource = $resource(
                        ":protocol://:url/api/knacks/knacks?page=:page&page_size=:page_size&type=:type&" +
                        "gender=:gender&min_price=:min_price&max_price=:max_price&min_age=:min_age&max_age=:max_age&categories=:categories&college=:college&year=:year&search_text=:search_text",
                        {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL,
                            page: $scope.page,
                            page_size: $scope.page_size,
                            gender: $scope.filter.gender,
                            min_price: $scope.filter.price.from,
                            max_price: $scope.filter.price.to,
                            min_age: $scope.filter.age.from,
                            max_age: $scope.filter.age.to,
                            type: $scope.filter.type,
                            categories: $scope.filter.selected_categories,
                            college: $scope.filter.college,
                            year: $scope.filter.year,
                            search_text: $scope.filter.search_text,
                            connections_only: $scope.selectedItem == 'Favorite Knackers' ? user.profile().id : 0
                        }
                    );
                } else {
                    knacks_resource = $resource(
                        ":protocol://:url/api/knacks/knack_ideas?page=:page&page_size=:page_size&categories=:categories&search_text=:search_text",
                        {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL,
                            page: $scope.page,
                            page_size: $scope.page_size,
                            categories: $scope.filter.selected_categories,
                            search_text: $scope.filter.search_text
                        }
                    );
                }

                knacks_resource.get(function (result) {
                    $scope.total_count = result.count;
                    if ($scope.knacks.length) {
                        angular.forEach(result.results, function(value) {
                            value.flip = $scope.knacks[0].flip;
                        });
                    }
                    $scope.knacks = $scope.knacks.concat(result.results);
                    $scope.more = !! result.next;
                    loading = false;
                }, function (error) {
                    $scope.message = error.data;
                    loading = false;
                });
            }

            $scope.selectItem = function(index) {
                $scope.isShowSortContent = false;
                if ($scope.selectedItem != $scope.sortList[index]) {
                    $scope.selectedItem = $scope.sortList[index];
                    showKnacks('init');
                }
            };

            $scope.hideDropDownBox = function() {
                $scope.isShowSortContent = false;
            };

            $scope.toggleDropDownBox = function() {
                if (!$scope.isShowSortContent) {
                    $scope.isShowSortContent = true;
                } else {
                    $scope.isShowSortContent = false;
                }
            }

            angular.element($window).bind('scroll', function() {
                // Preload more items if there are last $scope.rows rows
                // 364: 340px (width of a row) + 24px (12px margin on bottom and top)
                var threshold = 364 * $scope.rows;
                var document_height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                if (document_height - $window.scrollY < threshold && ! $scope.single_knack) {
                    $scope.showMore();
                }
            });

            $scope.showMore = function(){
                if ($scope.more) {
                    showKnacks('more');
                }
            };

            $scope.closeSingle = function(){
                $scope.single_knack = null;
                $state.go($scope.current_type);
            };

            $scope.openBusinessModal = function (business_model) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/business-modal.html',
                    controller: 'BusinessModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        business_model: function () {
                            return business_model;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.ideaToKnack = function (knack_idea) {
                var knack = angular.copy(knack_idea);
                knack['anonymous'] = false;
                delete knack['photos'];
                delete knack['id'];
                for (var i = 0; i < 5; i++) {
                    knack['photo' + i] = knack_idea.photos[i] ? knack_idea.photos[i] : '';
                }
                return knack;
            };

            $scope.setChatUser = function(user) {
                if ($rootScope.is_authenticated) {
                    $rootScope.$broadcast('chatReceiverSet', user);
                } else {
                    UknackModals.openLoginModal();
                }
            };

            $scope.messageMe = function(first_name) {
                UknackModals.openMessageMeModal({name: first_name});
            };

            $scope.openPostModal = function (item) { 
                UknackModals.openPostKnackModal(item).then(function (data) {
                    $state.go('knack-offered');
                });
            };

            $scope.openRequestModal = function (item) { 
                UknackModals.openRequestKnackModal(item).then(function (data) {
                    $state.go('knack-offered');
                });
            };

            $scope.openHireModal = function (item) {
                if(!$rootScope.is_authenticated) {
                    $rootScope.isGotoFeed = true;
                    UknackModals.openLoginModal('Please login to be able to buy knacks');
                } else {
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/hire-modal.html',
                        controller: 'HireModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            knack: function () {
                                return item;
                            }
                        }
                    });
                }
            };
            $scope.openMakeOfferModal = function (type, item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/contact-me-modal.html',
                    controller: 'ContactMeModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        contact_user: function () {
                            return {name: item.owner.full_name};
                        },
                        title: function () {
                            return 'Make an Offer to ';
                        },
                        button_title: function () {
                            return 'SEND YOUR OFFER';
                        }
                    }
                });
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

            $scope.fullSearch = function(){
                showKnacks('init');
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

            // Watch filters
            $scope.$watch('filter.age.from', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>' + newVal + '</div>');
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.age.to', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>' + newVal + '</div>');
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.price.from', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>$' + newVal + '</div>');
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.price.to', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>$' + newVal + '</div>');
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.college', function (newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.year', function (newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watch('filter.gender', function (newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);

            $scope.$watchCollection('filter.selected_categories', function(newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watchCollection('filter.gender', function(newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);
            $scope.$watchCollection('filter.sort_by', function(newVal, oldVal) {
                if(newVal != oldVal) {
                    showKnacks('init');
                }
            }, true);

            $scope.mainLeftLoaded = function() {
                if ($scope.current_type != 'knack-ideas') {
                    var divHandles = angular.element("#price-slider .noUi-handle");
                    angular.element(divHandles[0]).append('<div>$' + $scope.filter.price.from + '</div>');
                    angular.element(divHandles[1]).append('<div>$' + $scope.filter.price.to + '</div>');
                    divHandles = angular.element("#age-slider .noUi-handle");
                    angular.element(divHandles[0]).append('<div>' + $scope.filter.age.from + '</div>');
                    angular.element(divHandles[1]).append('<div>' + $scope.filter.age.to + '</div>');
                }
            };

            $scope.selectAllCategories = function (isSelect) {
                if (!$scope.categories) { return; }
                if (isSelect) {
                    $scope.filter.selected_categories = $scope.categories.map(function(category) { return category.id; });
                } else {
                    $scope.filter.selected_categories.splice(0, $scope.filter.selected_categories.length);
                }
            };

            $scope.isAllCategorySelected = function () {
                if (!$scope.categories) { return; }
                return angular.equals($scope.filter.selected_categories, $scope.categories.map(function(category) { return category.id; }));
            };

            $scope.flip = function(item) {
                if(!Authentication.isAuthenticated()) {
                    $rootScope.isGotoFeed = true;
                    UknackModals.openLoginModal('Please login to connect with friends and classmates');
                } else if(Authentication.isFBAccount()) {
                    UknackModals.openValidateEduModal('Searching socially is for <span class="ext-text">Students Only</span>');
                } else {
                    item.flip = !item.flip;
                }
            };

            $scope.flipAll = function() {
                if(!Authentication.isAuthenticated()) {
                    $rootScope.isGotoFeed = true;
                    UknackModals.openLoginModal('Please login to connect with friends and classmates');
                } else if(Authentication.isFBAccount()) {
                    UknackModals.openValidateEduModal('Searching socially is for <span class="ext-text">Students Only</span>');
                } else {
                    angular.forEach($scope.knacks, function(knack, inx) {
                        knack.flip = !knack.flip;
                    });
                }
            };

            $scope.showVideoModal = function(url) {
                if (! url) {
                    return;
                }
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

            $scope.goToKnack = function(id) {
                if($scope.current_type == 'knack-offered') {
                    $state.go('knack-offered-single', {id: id});
                } else {
                    $state.go('knack-wanted-single', {id: id});
                }
            }
        }]);
    return app;
});
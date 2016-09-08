'use strict';
define(['app'], function (app) {
    app.register.controller('marketplaceCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$state', '$stateParams', '$window', 'UknackModals', 'Authentication', 'user',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $state, $stateParams, $window, UknackModals, Authentication, user) {

            var item_resource = $resource(":protocol://:url/api/items/items/:id", {
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });
            
            var loading = false;

            $rootScope.currentMenu = 'marketplace';
            $rootScope.current_page = $state.current.name;
            $scope.current_type = $state.current.data.type;
            $scope.filter_name = 'filter_' + $scope.current_type;
            
            $scope.user = user;

            $scope.items = [];
            
            // Calculate items count depending on a user screen width
            // 244: 220px (width of an item) + 24px (12px margin on left and right)
            $scope.row_size = Math.floor($('#item-container').width() / 244);
            // Load up to 3 rows
            $scope.rows = 3;

            $scope.page_size = $scope.row_size * $scope.rows;
            $scope.page = 1;
            $scope.more = true;
            
            $scope.single_item = null;
            $scope.categories = $rootScope.itemCategories;
            $scope.sortList = ['Most Recent', 'Highest rated', 'Favorite Knackers'];
            $scope.selectedItem = 'Most recent';

            if ($state[$scope.filter_name]) {
                $scope.filter = $state[$scope.filter_name];
            } else {
                $scope.filter = {
                    'age': {
                        'from': 0,
                        'to': 60
                    },
                    'price': {
                        'from': 1,
                        'to': 5000
                    },
                    'gender': '',
                    'type': $scope.current_type == 'item-offered' ? 'O': 'W',
                    'sort_by': 'recently',
                    'search_text': ''
                }
            }

            if ($stateParams.id != null) {
                item_resource.get({'id': $stateParams.id}, function (result) {
                    $scope.single_item = result;
                }, function (error) {
                    console.log(error);
                });
            }

            $scope.restricted();

            showItems('init');

            function showItems(type) {
                if (loading) {
                    return;
                }
                loading = true;
                $state[$scope.filter_name] = $scope.filter;
                if ($scope.single_item) {
                    $scope.closeSingle();
                }
                if (type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.items = [];
                    $scope.page = 1;
                }
                var items_resource = $resource(
                    ":protocol://:url/api/items/items?page=:page&page_size=:page_size&type=:type&" +
                    "gender=:gender&min_price=:min_price&max_price=:max_price&min_age=:min_age&max_age=:max_age&categories=:categories&college=:college&search_text=:search_text",
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
                        search_text: $scope.filter.search_text,
                        connections_only: $scope.selectedItem == 'Favorite Knackers' ? user.profile().id : 0
                    }
                );
                items_resource.get(function (result) {
                    if ($scope.items.length) {
                        for (var i = 0, l = result.results.length; i < l; i++) {
                            result.results[i].flip = $scope.items[0].flip;
                        }
                    }
                    $scope.items = $scope.items.concat(result.results);
                    $scope.more = !! result.next;
                    loading = false;
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                    loading = false;
                });
            }

            $scope.selectItem = function(index) {
                $scope.isShowSortContent = false;
                if ($scope.selectedItem != $scope.sortList[index]) {
                    $scope.selectedItem = $scope.sortList[index];
                    showItems('init');
                }
            };
            angular.element($window).bind('scroll', function() {
                // Preload more items if there are last $scope.rows rows
                // 364: 340px (width of a row) + 24px (12px margin on bottom and top)
                var threshold = 364 * $scope.rows;
                var document_height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                if (document_height - $window.scrollY < threshold && ! $scope.single_item) {
                    $scope.showMore();
                }
            });

            $scope.showMore = function () {
                if ($scope.more) {
                    showItems('more');
                }
            };

            $scope.closeSingle = function () {
                $scope.single_item = null;
                $state.go($scope.current_type);
            };

            $scope.setChatUser = function(user) {
                if ($rootScope.is_authenticated) {
                    $rootScope.$broadcast('chatReceiverSet', user);
                } else {
                    UknackModals.openLoginModal();
                }
            };

            $scope.openPostModal = function (item) {
                UknackModals.openPostItemModal(item).then(function (data) {
                    $scope.items.splice(0, 0, data);
                });
            };

            $scope.openRequestModal = function (item) {
                UknackModals.openRequestItemModal(item).then(function (data) {
                    $scope.items.splice(0, 0, data);
                });
            };

            $scope.openByItemModal = function () {
                if(!$rootScope.is_authenticated) {
                    $rootScope.isGotoFeed = true;
                    UknackModals.openLoginModal('Please login to be able to buy items');
                } else {
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
                }
            };

            $scope.fullSearch = function () {
                showItems('init');
            };

            // Watch filters
            $scope.$watch('filter.age.from', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>' + newVal + '</div>');
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watch('filter.age.to', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>' + newVal + '</div>');
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watch('filter.price.from', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>$' + newVal + '</div>');
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watch('filter.price.to', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>$' + newVal + '</div>');
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watch('filter.college', function (newVal, oldVal) {
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watchCollection('filter.selected_categories', function (newVal, oldVal) {
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watchCollection('filter.gender', function (newVal, oldVal) {
                if (newVal != oldVal)
                    showItems('init');
            }, true);
            $scope.$watchCollection('filter.sort_by', function (newVal, oldVal) {
                if (newVal != oldVal)
                    showItems('init');
            }, true);

            $scope.mainLeftLoaded = function () {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>$' + $scope.filter.price.from + '</div>');
                angular.element(divHandles[1]).append('<div>$' + $scope.filter.price.to + '</div>');
                divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>' + $scope.filter.age.from + '</div>');
                angular.element(divHandles[1]).append('<div>' + $scope.filter.age.to + '</div>');
            };

            $scope.selectAllCategories = function (isSelect) {
                if (!$scope.categories) {
                    return;
                }
                if (isSelect) {
                    $scope.filter.selected_categories = $scope.categories.map(function (category) {
                        return category.id;
                    });
                } else {
                    $scope.filter.selected_categories.splice(0, $scope.filter.selected_categories.length);
                }
            };

            $scope.isAllCategorySelected = function () {
                if (!$scope.categories) {
                    return;
                }
                return angular.equals($scope.filter.selected_categories, $scope.categories.map(function (category) {
                    return category.id;
                }));
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

            $scope.flipAll = function () {
                if(!Authentication.isAuthenticated()) {
                    $rootScope.isGotoFeed = true;
                    UknackModals.openLoginModal('Please login to connect with friends and classmates');
                } else if(Authentication.isFBAccount()) {
                    UknackModals.openValidateEduModal('Searching socially is for <span class="ext-text">Students Only</span>');
                } else {
                    angular.forEach($scope.items, function(item, inx) {
                        item.flip = !item.flip;
                    });
                }
            };

            $scope.goToItem = function(id) {
                if($scope.current_type == 'item-offered') {
                    $state.go('item-offered-single', {id: id});
                } else {
                    $state.go('item-wanted-single', {id: id});
                }
            }
        }]);
    return app;
});
'use strict';
define(['app'], function (app) {
    app.register.controller('businessCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$state', '$stateParams', 'UknackModals', 'Authentication', 'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $state, $stateParams, UknackModals, Authentication) {

            var knack_item_resource = $resource(":protocol://:url/knacks/knacks?id=:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            init();

            function init(){
                $rootScope.currentMenu = 'feed';
                $scope.current_page = $state.current.name;
                console.log('current page -> ' + $scope.current_page);
                $scope.knacks = [];
                $scope.page = 1;
                $scope.page_size = 6;
                $scope.knacks_total = 0;
                $scope.show_mode = 'grid';
                // $scope.item_id = $stateParams.id;
                $scope.single_knack = null;
                /*******/
                //$scope.categories = $rootScope.knackCategories;
                                var category1 = new Object();
                category1.id = 28;
                category1.name = 'UAssist';
                var category2 = new Object();
                category2.id = 27;
                category2.name = 'UBeauty';
                var category3 = new Object();
                category3.id = 26;
                category3.name = 'UBiz';
                var category4 = new Object();
                category4.id = 25;
                category4.name = 'UCars';
                var category5 = new Object();
                category5.id = 24;
                category5.name = 'UClean';
                var category6 = new Object();
                category6.id = 23;
                category6.name = 'UDeliver';
                var category7 = new Object();
                category7.id = 22;
                category7.name = 'UDesign';
                var category8 = new Object();
                category8.id = 21;
                category8.name = 'UErrands';
                var category9 = new Object();
                category9.id = 20;
                category9.name = 'UEvents';
                var category10 = new Object();
                category10.id = 19;
                category10.name = 'UFashion';
                var category11 = new Object();
                category11.id = 18;
                category11.name = 'UFilms';
                var category12 = new Object();
                category12.id = 17;
                category12.name = 'UFitness';
                var category13 = new Object();
                category13.id = 16;
                category13.name = 'UFood';
                var category14 = new Object();
                category14.id = 15;
                category14.name = 'UHandy';
                var category16 = new Object();
                category16.id = 14;
                category16.name = 'UHealth';
                var category17 = new Object();
                category17.id = 13;
                category17.name = 'UHome'; 
                var category18 = new Object();
                category18.id = 13;
                category18.name = 'ULaw'; 
                var category19 = new Object();
                category19.id = 13;
                category19.name = 'ULove'; 
                var category20 = new Object();
                category20.id = 13;
                category20.name = 'UMedia';                  
                var temp_categories = [];
                temp_categories.push(category1);
                temp_categories.push(category2);
                temp_categories.push(category3);
                temp_categories.push(category4);
                temp_categories.push(category5);
                temp_categories.push(category6);
                temp_categories.push(category7);
                temp_categories.push(category8);
                temp_categories.push(category9);
                temp_categories.push(category10);
                temp_categories.push(category11);
                temp_categories.push(category12);
                temp_categories.push(category13);
                temp_categories.push(category14);
                temp_categories.push(category16);
                temp_categories.push(category17);
                temp_categories.push(category18);  
                temp_categories.push(category19);  
                temp_categories.push(category20);  
                $scope.categories = temp_categories;

                var channel1 = new Object();
                channel1.id = 28;
                channel1.name = 'Accounting';
                var channel2 = new Object();
                channel2.id = 27;
                channel2.name = 'Advertising';
                var channel3 = new Object();
                channel3.id = 26;
                channel3.name = 'Business Design';
                var channel4 = new Object();
                channel4.id = 25;
                channel4.name = 'B2B';
                var channel5 = new Object();
                channel5.id = 24;
                channel5.name = 'B2C';
                var channel6 = new Object();
                channel6.id = 23;
                channel6.name = 'Business School';
                var channel7 = new Object();
                channel7.id = 22;
                channel7.name = 'Business Law';
                var channel8 = new Object();
                channel8.id = 21;
                channel8.name = 'Uhome';
                var channel9 = new Object();
                channel9.id = 20;
                channel9.name = 'Ulaw';
                
                var temp_channels = [];
                temp_channels.push(channel1);
                temp_channels.push(channel2);
                temp_channels.push(channel3);
                temp_channels.push(channel4);
                temp_channels.push(channel5);
                temp_channels.push(channel6);
                temp_channels.push(channel7);
                temp_channels.push(channel8);
                temp_channels.push(channel9);
                $scope.channels = temp_channels;

                $scope.feeds_total = 156;

                var feedList = [];
                var feed1 = new Object();
                feed1.name = 'Automs Barnby';
                feed1.picture = 'images/users/user1.jpg';
                feed1.college = 'Fisher college';
                feed1.time = '2min ago';
                feed1.id = '#Ubiz';
                feed1.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed1.subfeedList = [];
                feed1.star = 659;
                feed1.like = 8;
                feed1.messageCnt = 3;
                feed1.shares = 22;
                feed1.showInfo = false;
                feed1.showShares = false;
                feed1.showSubFeed = false;
                feed1.showMsgInput = false;

                var feed2 = new Object();
                feed2.name = 'Andrew Wilkinson';
                feed2.picture = 'images/users/user1.jpg';
                feed2.college = 'Fisher college';
                feed2.time = '4min ago';
                feed2.id = '#Ubiz';
                feed2.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed2.subfeedList = [];
                feed2.star = 202;
                feed1.like = 8;
                feed2.messageCnt = 2;
                feed2.shares = 12;
                feed2.showInfo = false;
                feed2.showShares = false;
                feed2.showSubFeed = false;
                feed2.showMsgInput = false;

                var feed3 = new Object();
                feed3.name = 'Automs Barnby';
                feed3.picture = 'images/users/user1.jpg';
                feed3.college = 'Fisher college';
                feed3.time = '2min ago';
                feed3.id = '#Ubiz';
                feed3.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed3.subfeedList = [];
                feed3.star = 202;
                feed3.messageCnt = 0;
                feed3.shares = 4;
                feed3.like = 8;
                feed3.showInfo = false;
                feed3.showShares = false;
                feed3.showSubFeed = false;
                feed3.showMsgInput = false;

                var feed4 = new Object();
                feed4.name = 'Jack Sparrow';
                feed4.picture = 'images/users/user1.jpg';
                feed4.college = 'Fisher college';
                feed4.time = '7min ago';
                feed4.id = '#Ubiz';
                feed4.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed4.subfeedList = [];
                feed4.star = 202;
                feed4.messageCnt = 0;
                feed4.shares = 4;
                feed4.like = 8;
                feed4.showInfo = false;
                feed4.showShares = false;
                feed4.showSubFeed = false;
                feed4.showMsgInput = false;

                var feed5 = new Object();
                feed5.name = 'Marc Johonson';
                feed5.picture = 'images/users/user1.jpg';
                feed5.college = 'Harvard';
                feed5.time = '2min ago';
                feed5.id = '@Jack';
                feed5.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed5.subfeedList = [];
                feed5.star = 202;
                feed5.messageCnt = 2;
                feed5.shares = 12;
                feed5.like = 8;
                feed5.showInfo = false;
                feed5.showShares = false;
                feed5.showSubFeed = false;
                feed5.showMsgInput = false;

                var feed6 = new Object();
                feed6.name = 'Marc Johonson';
                feed6.picture = 'images/users/user1.jpg';
                feed6.college = 'Harvard';
                feed6.time = '2min ago';
                feed6.id = '@Jack';
                feed6.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed6.subfeedList = [];
                feed6.star = 202;
                feed6.messageCnt = 2;
                feed6.shares = 12;
                feed6.like = 8;
                feed6.showInfo = false;
                feed6.showShares = false;
                feed6.showSubFeed = false;
                feed6.showMsgInput = false;

                var feed7 = new Object();
                feed7.name = 'Marc Johonson';
                feed7.picture = 'images/users/user1.jpg';
                feed7.college = 'Harvard';
                feed7.time = '2min ago';
                feed7.id = '@Jack';
                feed7.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed7.subfeedList = [];
                feed7.subfeedList.push(feed4);
                feed7.subfeedList.push(feed5);
                feed7.subfeedList.push(feed6);
                feed7.star = 202;
                feed7.messageCnt = 2;
                feed7.shares = 12;
                feed7.like = 8;
                feed7.showInfo = false;
                feed7.showShares = false;
                feed7.showSubFeed = false;
                feed7.showMsgInput = false;

                var feed8 = new Object();
                feed8.name = 'Marc Johonson';
                feed8.picture = 'images/users/user1.jpg';
                feed8.college = 'Harvard';
                feed8.time = '2min ago';
                feed8.id = '@Jack';
                feed8.text = 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.';
                feed8.subfeedList = [];
                feed8.star = 202;
                feed8.messageCnt = 2;
                feed8.shares = 12;
                feed8.like = 8;
                feed8.showInfo = false;
                feed8.showShares = false;
                feed8.showSubFeed = false;
                feed8.showMsgInput = false;

                feedList.push(feed1);
                feedList.push(feed2);
                feedList.push(feed3);
                feedList.push(feed7);
                feedList.push(feed8);
                $scope.feedList = feedList;

                var years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad', 'Professor', 'Alumni Bachelor', 'Alumni Master Alumni MBA', 'Alumni Doctorate'];
                $scope.years = years;

                var sortList = ['Most recent', 'Highest rated', 'Most Shared', 'Favorite Knackers'];
                $scope.sortList = sortList;
                $scope.selectedItem = 'Most recent';
                $scope.isShowSortContent = false;
                $scope.selectItem = function(index) {
                    $scope.selectedItem = sortList[index];
                    $scope.isShowSortContent = false;
                };
                $scope.hideSortby = function (evt) {
                    //alert(2);
                    $scope.isShowSortContent = false;
                };
                $scope.toggleSortBox = function(evt) {
                    //alert(1);
                    evt.preventDefault();
                    evt.stopPropagation();
                    if(!$scope.isShowSortContent )
                        $scope.isShowSortContent = true;

                };

                $scope.isChennelBoxOpened = false;
                $scope.isCollegeBoxOpened = false;
                $scope.isYearBoxOpened = false;
                $scope.isGenderBoxOpened = false;
                $scope.isShowSubFeed = false;
                $scope.genderList = ['Male', 'Female'];
                $scope.toggleCollegeBox = function() {
                    $scope.isCollegeBoxOpened = !$scope.isCollegeBoxOpened;
                };
                $scope.toggleYearBox = function() {
                    $scope.isYearBoxOpened = !$scope.isYearBoxOpened;
                };
                $scope.toggleGenderBox = function() {
                    $scope.isGenderBoxOpened = !$scope.isGenderBoxOpened;
                };
                $scope.showInfoBox = function(index) {
                    $scope.feedList[index].showInfo = true;
                };
                $scope.hideInfoBox = function(index) {
                    $scope.feedList[index].showInfo = false;
                };
               
                $scope.toggleSocialBox = function(index) {
                    $scope.feedList[index].showShares = !$scope.feedList[index].showShares;
                };

                $scope.showSubFeed = function (pList) {
                    if(pList.length == 0)
                        return false;
                    else 
                        return true;
                };
                $scope.toggleSubFeed = function(index) {
                    $scope.feedList[index].showSubFeed = !$scope.feedList[index].showSubFeed;
                };  
                $scope.toggleMsgInput = function(index) {
                    $scope.feedList[index].showMsgInput = !$scope.feedList[index].showMsgInput;
                };
                console.log($scope.categories);

                $scope.filter = {
                    'age': {
                        'from': 20,
                        'to': 52
                    },
                    'price': {
                        'from': 0,
                        'to': 200
                    },
                    'gender': '',
                    'type': 'O',
                    'sort_by': 'recently',
                    'search_text': ''
                }
                if($stateParams.id != null){
                    knack_item_resource.get({'id': $stateParams.id}, function(result){
                        $scope.single_knack = result.results[0];
                    }, function(error){
                        console.log(error);
                    });
                }

                $scope.restricted();

                show_knacks('init');
            }

            function show_knacks(type){
                if(type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.knacks = [];
                    $scope.page = 1;
                }
                var knacks_resource =  $resource(
                    ":protocol://:url/knacks/knacks?page=:page&page_size=:page_size&type=:type&" +
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
                        college: $scope.filter.college ? $scope.filter.college.name: '',
                        search_text: $scope.filter.search_text
                    }
                );
                knacks_resource.get(function (result) {
                    $scope.knacks_total = result.count;
                    $scope.knacks = $scope.knacks.concat(result.results);
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });
            }

            $scope.show_more = function(){
                show_knacks('more');
            };

            $scope.close_single = function(){
                $scope.single_knack = null;
            };

            $scope.openPostModal = function () {
                UknackModals.openPostItemModal().then(function (data) {
                    $scope.knacks.splice(0, 0, data);
                    $scope.knacks_total += 1;
                }               
            };
            $scope.show_grid = function(){
                $scope.show_mode = 'grid';
                $scope.page_size = 6;
            };
            $scope.show_list = function(){
                $scope.show_mode = 'list';
                $scope.page_size = 3;
            };

            $scope.full_search = function(){
                show_knacks('init');
            }

            // Watch filters
            $scope.$watch('filter.age.from', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>' + newVal + '</div>');
                if(newVal!=oldVal)
                    show_knacks('init');
            });
            $scope.$watch('filter.age.to', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>' + newVal + '</div>');
                if(newVal!=oldVal)
                    show_knacks('init');
            });

            $scope.$watch('filter.price.from', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>$' + newVal + '</div>');
                if(newVal!=oldVal)
                    show_knacks('init');
            });
            $scope.$watch('filter.price.to', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>$' + newVal + '</div>');
                if(newVal!=oldVal)
                    show_knacks('init');
            });
            $scope.$watch('filter.college', function (newVal, oldVal) {
                if(newVal!=oldVal)
                    show_knacks('init');
            });
            $scope.mainLeftLoaded = function() {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>$' + $scope.filter.price.from + '</div>');
                angular.element(divHandles[1]).append('<div>$' + $scope.filter.price.to + '</div>');
                divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>' + $scope.filter.age.from + '</div>');
                angular.element(divHandles[1]).append('<div>' + $scope.filter.age.to + '</div>');
            };

            $scope.$watchCollection('filter.selected_categories', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    show_knacks('init');
            });
            $scope.$watchCollection('filter.gender', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    show_knacks('init');
            });

            $scope.$watchCollection('filter.sort_by', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    show_knacks('init');
            });

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
            }
        }]);
    return app;
});
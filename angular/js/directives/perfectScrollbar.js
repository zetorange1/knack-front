define(['angularAMD'], function(app) {
    app.directive("perfectScrollbar", function () {
        return {
            restrict: 'A',
            scope: {
                psOption: '=',
                scrollBottom: "="
            },
            link: function ($scope, $element, $attributes) {
                if(!$scope.psOption) {
                    $($element).perfectScrollbar();
                } else {
                    $($element).perfectScrollbar($scope.psOption);
                    if($scope.psOption.hasOwnProperty('watcher')) {
                        $scope.$watch('psOption.watcher', function(newValue) {
                            if(newValue) {
                                $($element).perfectScrollbar('update');
                            }
                        });
                    }
                }

                $scope.$watchCollection('scrollBottom', function (newValue) {
                    if (newValue) {
                        $($element).scrollTop($($element)[0].scrollHeight);
                    }
                });
            }
        }
    });
});
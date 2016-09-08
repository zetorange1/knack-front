define(['angularAMD'], function(app) {
    app.directive("readMore", ['$interval', function ($interval) {
        return {
            restrict: 'A',
            template: '<p class="read-more-text" ng-class="{\'expandable\': expandable && !expanded}">{{ readMoreText }}</p>' +
                        '<a class="read-more" ng-hide="expanded || !expandable" ng-click="expanded=!expanded">show more</a>' +
                        '<a class="read-more" ng-show="expanded && expandable" ng-click="expanded=!expanded">show less</a>',
            transclude: true,                        
            scope: {
                'readMoreText': '=',
                'readMoreHeight': '@'
            },            
            link: function ($scope, $element, $attributes) {
                $scope.expanded = false;
                $scope.expandable = false;

                $interval(function() {
                    var text = $element.find('.read-more-text');

                    if($scope.expandable === false && text.outerHeight() >= $scope.readMoreHeight) {
                        $scope.expandable = true;
                        return;
                    }

                    if($scope.expandable === true) {
                        if($scope.expanded) {
                            text.attr('style', 'max-height: initial;');    
                        } else {
                            text.attr('style', 'max-height:' + $scope.readMoreHeight + 'px');    
                        }
                        
                        if($scope.expanded && text.outerHeight() < $scope.readMoreHeight) {
                            $scope.expanded = false;
                            $scope.expandable = false;
                            text.removeAttr('style');
                            return;
                        }
                    }
                }, 300);
            }
        }
    }]);
});
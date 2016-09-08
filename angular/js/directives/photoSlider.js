define(['angularAMD'], function(app) {
    app.directive("photoSlider", ['$timeout', function ($timeout) {
        return {
            restrict: 'AE',
            scope: {
                photoClick: '&'
            },
            link: function ($scope, $element, $attributes) { 
                $scope.dragging = false;

                $timeout(function() {
                    var options = {
                        item: 1,
                        thumbItem: 5,
                        pager: $attributes.gallery && $attributes.gallery == 'false' ? false : true,
                        gallery: $attributes.gallery && $attributes.gallery == 'false' ? false : true,
                        adaptiveHeight: true,
                        onBeforeSlide: function (el) {
                            // console.log('onBeforeSlide');
                            // $scope.dragged = true;
                        }
                    };
                    var slider = $($element).lightSlider(options);
                    slider.refresh();

                    $($element).mousedown(function(){
                        $scope.dragging = false;
                    }).mousemove(function(){
                        $scope.dragging = true;
                    }).mouseup(function(){
                        if($scope.dragging === false){
                            $scope.photoClick();
                        }
                    });
                }, 500);
                /*    
                var photos = [], loadedPhotos = 0;
                var size = $attributes.sliderSize;

                $element.parent().addClass('slider-loading').addClass(size);

                $attributes.$observe('sliderPhotos', function(value){
                    if(value == '' || value == undefined) return;

                    photos = value;
                    photos = photos.replace(/'/g, '"');
                    photos = JSON.parse(photos);

                    for (var i=0; i<photos.length; i++) {
                        var img = new Image();
                        img.src = photos[i];
                        img.onload=function() {
                            photosLoaded();
                        }
                        img.onerror=function() {
                            photosLoaded();
                        }
                    }
                });

                function photosLoaded() {
                    loadedPhotos++;

                    if (loadedPhotos == photos.length) {
                        $element.parent().removeClass('slider-loading').removeClass(size);

                        $timeout(function() {
                            var options = {
                                item: 1,
                                thumbItem: 5,
                                pager: $attributes.gallery && $attributes.gallery == 'false' ? false : true,
                                gallery: $attributes.gallery && $attributes.gallery == 'false' ? false : true
                            };
                            var slider = $($element).lightSlider(options);
                            slider.refresh();
                        }, 500);    
                    }                    
                }
                */ 


            }
        }
    }]);
});
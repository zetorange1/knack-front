define(['angularAMD'], function(app) {
    app.directive('fdInput', ['$timeout', '$modal', 'deviceDetection', function ($timeout, $modal, deviceDetection) {
	    return {
            scope: {
                image: "="
            },
	        link: function (scope, element, attrs) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        $timeout(function () {
                            var image = loadEvent.target.result;
                            if(deviceDetection.isMobile()) {
                                scope.image = image;
                            } else {
                                doCrop(image).then(function(image) {
                                    scope.image = image;
                                });
                            }
                        }, 0);
                    };

                    if (changeEvent.target.files.length == 0) {
                        scope.clearUpload();
                        return;
                    } else {
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    }
                });
	            
                function doCrop(image) {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        scope:scope,
                        backdrop:'static',
                        resolve: {
                            sourceImage: function () {
                                return image;
                            }
                        }
                    });
                    return submodalInstance.result.then(function (result) {
                        return result.croppedImage;
                    });
                }
	        }
	    }
    }]);
    app.directive('profileFdInput', ['$timeout', '$modal', '$resource', function ($timeout, $modal, $resource) {
        return {
            link: function (scope, element, attrs) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        $timeout(function () {
                            var image = loadEvent.target.result;
                            doCrop(image).then(function(image) {
                                scope.image = image;
                            });
                        }, 0);
                    };

                    if (changeEvent.target.files.length == 0) {
                        scope.clearUpload();
                        return;
                    } else {
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    }
                });
                
                function doCrop(image) {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/profile-cropping-modal.html',
                        controller: 'ProfileCroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        scope:scope,
                        backdrop:'static',
                        resolve: {
                            sourceImage: function () {
                                return image;
                            }
                        }
                    });
                    return submodalInstance.result.then(function (result) {
                        return result.croppedImage;
                    });
                }
            }
        }
    }]);
});

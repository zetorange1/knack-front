/*######################################################
 Set up require.js
 require.js will ensure our dependancies are enforced (recommended by
 the creater of angular). This will allow ease for testing

 Documentation:

 baseUrl: self explanitory
 paths: attach an alias to a path
 Example: 'angular' : '/static/common/js/vendor/angular/angular'
 which will look for /static/common/js/vendor/angular/angular.js

 using the alias will force modules to make to load
 required alia(s) before doing any sort of code configuration
 Example:
 define(['app', 'angular','common/js/example' ], function(app) {
 ... } //javascript code in here

 app routes to the path /static/app/app.js
 since common/js/example isn't defined in paths
 then require.js will load /static/common/js/example.js
 one time, if example is used more than one place
 then it's better to give it a path

 deps: will initiate the startin depedancies which in term will
 start the real program boostrap.js

 this is a proper definition for shim.
 shim : Configure the dependencies, exports, and custom initialization for older,
 traditional "browser globals" scripts that do not use define() to declare the
 dependencies and set a module value.
 ######################################################*/

 var isMobile = (/Mobile/i.test(navigator.userAgent));

require.config({
    baseUrl: "",
    paths: {
        'angular': 'common/angular/angular.min',
        'angularLocalStorage': 'common/angular-local-storage/dist/angular-local-storage',
        'angularResource': 'common/angular-resource/angular-resource.min',
        'angularAMD': 'common/angularAMD/angularAMD.min',
        'ngload': 'common/angularAMD/ngload.min',
        'uiRouter': 'common/angular-ui-router/release/angular-ui-router.min',
        'uiBootstrap': 'common/angular-bootstrap/ui-bootstrap-tpls',
        'routeResolver': 'vendor/routeResolver',
        'jquery': 'common/jquery/dist/jquery.min',
        'underscore': 'common/underscore/underscore-min',
        'angularFileUpload': 'common/angular-file-upload/dist/angular-file-upload.min',
        'angularFileModel': 'common/angular-file-model/angular-file-model',
        'ui.utils': 'common/angular-ui-utils/ui-utils.min',
        'masonry': 'common/masonry/dist/masonry.pkgd.min',
        'imagesloaded': 'common/imagesloaded/imagesloaded.pkgd.min',
        'angular-masonry': 'vendor/angular-masonry/angular-masonry',
        // 'angularFileUploadShim': 'common/ng-file-upload/angular-file-upload-shim.min',
        // 'bootstrap.modal': 'common/bootstrap/js/modal', // I needed this to get the wysihtml5 image and link modals working
        'smoothscroll': 'vendor/smoothscroll',
        'checklist-model': 'vendor/checklist-model',
        'retinajs': 'common/retinajs/dist/retina.min',
        'jquery-bridget': 'common/jquery-bridget/jquery.bridget',
        'linkjs': 'common/nouislider/Link',
        'jquery.nouislider': 'common/nouislider/jquery.nouislider',
        'jquery.magnific-popup': 'common/magnific-popup/dist/jquery.magnific-popup.min',
        'owl.carousel': 'vendor/owl.carousel.min',
        'WOW': 'vendor/wow',
        'angularNouislider': 'common/angular-nouislider/src/nouislider.min',
        'angular-loading-bar': 'common/angular-loading-bar/build/loading-bar.min',
        'angular-websocket': 'common/angular-websocket/angular-websocket.min',
        'lightslider': 'common/lightslider/dist/js/lightslider.min',
        'perfect-scrollbar-jquery': 'common/perfect-scrollbar/js/perfect-scrollbar.jquery.min',
        'perfect-scrollbar': 'js/directives/perfectScrollbar',
        // 'uknacks': 'vendor/uknacks',
        // 'bootstrap': 'common/bootstrap/dist/js/bootstrap.min',
        'footer': 'views/footer/app',
        'app': 'js/app',
        'modals': 'views/modals/app',
        'imgLoader': 'js/directives/imgLoader',
        'chatbox': 'views/chatbox/app',
        'photoSlider': 'js/directives/photoSlider',
        'fileInput': 'js/directives/fileinput',
        'readMore': 'js/directives/readMore',
        'header': 'views/header/app',
        'profile': 'views/profile/app',
        'menubar': 'views/menubar/app',
        'bottombar': 'views/bottombar/app',
        'headroom': 'vendor/headroom.min',
        'angular-headroom': 'vendor/angular.headroom.min',
        'angular-sanitize': 'common/angular-sanitize/angular-sanitize.min',
        'videogular': 'common/videogular/videogular.min',
        'vg-controls': 'common/videogular-controls/vg-controls',
        'vg-overlay-play': 'common/videogular-overlay-play/vg-overlay-play',
        'vg-poster': 'common/videogular-poster/vg-poster',
        'vg-buffering': 'common/videogular-buffering/vg-buffering',
        'smile-emoji': 'common/angular-emoji/angular-emoji',
        'angular-cookies': 'common/angular-cookies/angular-cookies',
        'angular-audio': 'common/angular-audio/index',
        'emoji-config': 'vendor/config',
        'emoji-controls': 'vendor/emoji.min',
        'angular-img-cropper': 'js/directives/angular-img-cropper',
        'djds4rce.angular-socialshare': 'vendor/angular-socialshare',
        'device-detection': 'js/services/device-detection',
        'uknack-modals': 'js/services/uknack-modals',
        'authentication': 'js/services/authentication',
        'isEmpty': 'js/filters/isEmpty'
    },
    //'smile-emoji': 'common/angular-emoji/angular-emoji'
    //Angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'angularAMD': ['angular'],
        'angularLocalStorage': ['angular'],
        'angularResource': ['angular'],
        'uiRouter': ['angular'],
        'underscore': ['angular'],
        'uiBootstrap': ['angular'],
        // 'footer': ['app'],
        'angularFileUpload': ['angular'],
        'angularFileModel': ['angular'],
        'ui.utils': ['angular'],
        'jquery.nouislider': ['jquery'],
        'jquery.magnific-popup': ['jquery'],
        'angularNouislider': ['angular', 'linkjs', 'jquery.nouislider' ],
        'angular-loading-bar': ['angular'],
        'imagesloaded': ['jquery'],
        'masonry': ['jquery', 'jquery-bridget'],
        'angular-masonry': ['angular', 'imagesloaded', 'masonry'],
        'caret': ['jquery'],
        'smmothscroll': ['jquery'],
        'checklist-model': ['angular'],
        'retinajs': ['jquery'],
        'linkjs': ['jquery'],
        'jquery-bridget': ['jquery'],
        'angular-websocket': ['angular'],
        'angular-headroom': ['angular', 'headroom'],
        'owl.carousel': ['jquery'],
        'lightslider': ['jquery'],
        'imgLoader': ['angular'],
        'perfect-scrollbar-jquery': ['jquery'],
        'photoSlider': ['lightslider'],
        'readMore': ['angular'],
        'fileInput': ['jquery', 'angular'],
        'angular-sanitize': ['angular'],
        'videogular': ['angular', 'angular-sanitize'],
        'vg-controls': ['angular', 'angular-sanitize', 'videogular'],
        'vg-overlay-play': ['angular', 'angular-sanitize', 'videogular'],
        'vg-poster': ['angular', 'angular-sanitize', 'videogular'],
        'vg-buffering': ['angular', 'angular-sanitize', 'videogular'],
        'smile-emoji': ['angular', 'angular-sanitize'],
        'angular-cookies': ['angular'],
        'emoji-config': ['angular', 'angular-sanitize'],
        'emoji-controls': ['angular', 'angular-sanitize'],
        'angular-img-cropper': ['angular'],
        'djds4rce.angular-socialshare': ['angular'],
        'device-detection': ['angular'],
        'uknack-modals': ['angular'],
        'authentication': ['angular'],
        'perfect-scrollbar': ['perfect-scrollbar-jquery', 'angular'],
        'angular-audio': ['angular'],
        'isEmpty': ['angular']
    },
    // Version the app to avoid cache issues
    urlArgs: "0.1.1",
    waitSeconds: 200,
    // Kick start application
    deps: ['app']
});



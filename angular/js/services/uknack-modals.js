define(['angularAMD'], function(app) {

    app.service('UknackModals', ['$state', '$modal', '$q', 'Authentication', function($state, $modal, $q, Authentication) {

        function _openLoginModal(title) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/loginto-flip-modal.html',
                controller: 'LoginToFlipModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    title: function() {
                        return title;
                    }
                }
            });

            return modalInstance.result;
        }

        function _openValidateEduModal(title) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/validateedu-modal.html',
                controller: 'ValidateEduModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    title: function() {
                        return title;
                    }
                }
            });

            return modalInstance.result;
        }

        function _openPostKnackModal(knack) {
            if (!Authentication.isAuthenticated()) {
                _openLoginModal('Please login to be able to sell');
                return $q.reject();
            }
            //  else if (Authentication.isFBAccount()) {
            //     _openValidateEduModal('Selling Knacks or Items is for <span class="ext-text">Students Only</span>');
            //     return $q.reject();
            // }

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/knack-modal.html',
                controller: 'KnackModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	knack: $.extend(knack, {type: 'O'}),
                        	action: 'create'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openRequestKnackModal(knack) {
            if (!Authentication.isAuthenticated()) {
                _openLoginModal('Please login to be able to request');
                return $q.reject();
            }

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/knack-modal.html',
                controller: 'KnackModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	knack: $.extend(knack, {type: 'W'}),
                        	action: 'create'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openRepostKnackModal(knack) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/knack-modal.html',
                controller: 'KnackModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	knack: knack,
                        	action: 'repost'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openEditKnackModal(knack) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/knack-modal.html',
                controller: 'KnackModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	knack: knack,
                        	action: 'edit'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openPostItemModal(item) {
            if (!Authentication.isAuthenticated()) {
                _openLoginModal('Please login to be able to sell');
                return $q.reject();
            } else if (Authentication.isFBAccount()) {
                _openValidateEduModal('Selling Knacks or Items is for <span class="ext-text">Students Only</span>');
                return $q.reject();
            }

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/item-modal.html',
                controller: 'ItemModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function () {
                        return {
                        	item: $.extend(item, {type: 'O'}),
                        	action: 'create'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openRequestItemModal(item) {
            if (!Authentication.isAuthenticated()) {
                _openLoginModal('Please login to be able to request');
                return $q.reject();
            }
            
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/item-modal.html',
                controller: 'ItemModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	item: $.extend(item, {type: 'W'}),
                        	action: 'create'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openRepostItemModal(item) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/item-modal.html',
                controller: 'ItemModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	item: item,
                        	action: 'repost'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openEditItemModal(item) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/item-modal.html',
                controller: 'ItemModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    data: function() {
                        return {
                        	item: item,
                        	action: 'edit'
                        }
                    }
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }

        function _openMessageMeModal(data) {
            if (!Authentication.isAuthenticated()) {
                _openLoginModal('Please login to be able to message');
                return $q.reject();
            }

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/modals/contact-me-modal.html',
                controller: 'ContactMeModalCtl',
                windowClass: 'vcenter-modal',
                resolve: {
                    contact_user: function () {
                        return data;
                    },
                    button_title:function(){
                        return "SEND YOUR MESSAGE"
                    },
                    title:function(){
                        return "Message"
                    }
                }
            });

            return modalInstance.result;
        }

        /*========================================
        =            HELPER FUNCTIONS            =
        ========================================*/

        return {
            openLoginModal: _openLoginModal,
            openValidateEduModal: _openValidateEduModal,
            openPostKnackModal: _openPostKnackModal,
            openRequestKnackModal: _openRequestKnackModal,
            openRepostKnackModal: _openRepostKnackModal,
            openEditKnackModal: _openEditKnackModal,
            openPostItemModal: _openPostItemModal,
            openRequestItemModal: _openRequestItemModal,
            openRepostItemModal: _openRepostItemModal,
            openEditItemModal: _openEditItemModal,
            openMessageMeModal: _openMessageMeModal
        }
    }]);
});
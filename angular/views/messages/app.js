'use strict';
define(['app'], function (app) {
    app.register.controller('messagesCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource',
        '$modal', '$stateParams', 'Message', 'notification', 'user',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource,
                  $modal, $stateParams, Message, notification, user) {

            $scope.$watch(
                function () { return notification.all(); },
                function (new_value, old_value) {$scope.notifications = new_value;},
                true
            );
            $scope.$watch(
                function () { return notification.unread(); },
                function (new_value, old_value) {$scope.unread_notifications = new_value;},
                true
            );

            var messages_resource = $resource(":protocol://:url/api/chat/messages?companion=:companion",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                companion: '@companion'
            });

            var contacts_resource = $resource(":protocol://:url/api/chat/message_contacts",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.user = user;

            $scope.Message = null;
            $scope.chat_data = {
                new_message: ''
            };

            $scope.selected_user = null;
            $scope.current_notification = null;
            $scope.current_connection = null;

            $rootScope.currentMenu = 'profile_edit';

            $scope.nowContainer = 'messages';
            
            $scope.contacts = contacts_resource.get(function(result){
                $scope.contacts = result.results;
            }, $scope.checkTokenError);

            $scope.toggleConnect = function(contact, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if(contact.state == 'connected') {
                    contact.state = 'disconnected';
                } else {
                    contact.state = 'connected';
                }
            };

            $scope.select_notification = function(n) {
                notification.read(n);
                $scope.current_notification = n;
            };
            $scope.select_connection = function(c) {
                $scope.current_connection = c;
            };

            $scope.select_contact = function(user){
                $scope.selected_user = user;
                $scope.messages = [];
                $scope.Message = Message($rootScope.token, user.id, $scope.user.profile().id);

                $scope.messages = messages_resource.get({'companion': user.id}, function(result){
                    $scope.messages = result.results;
                    $scope.messages.reverse();
                    $scope.$watch(
                        function () { return $scope.Message.collection },
                        function (new_value) {
                            if (new_value.length) {
                                var new_message = new_value[new_value.length - 1];
                                var message = {
                                    sender: new_message.data.sender_data,
                                    body: new_message.data.message,
                                    created_at: new_message.data.created_at
                                };
                                $scope.messages.push(message)
                            }
                        },
                        true
                    );
                }, $scope.checkTokenError);
            };

            /* Websocket chat */
            $scope.submit = function() {
                if (!$scope.chat_data.new_message || !$scope.Message) { return; }

                $scope.Message.send({
                    sender_data: $scope.user.profile(),
                    receipt_data: $scope.selected_user,
                    message: $scope.chat_data.new_message
                });

                $scope.chat_data.new_message = '';
            };
        }]);
    return app;
});
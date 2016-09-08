define(['angularAMD'], function(app) {
    app.controller("chatboxCtrl",
        ['$rootScope', '$scope', '$location', 'Message', 'user', 'restricted',
        function ($rootScope, $scope, $location, Message, user, restricted) {
            $rootScope.restricted();

            $rootScope.$on('$locationChangeSuccess', function() {
                $scope.messages_page = $location.url() == '/messages';
            });
            $scope.minimized = false;
            $scope.receiver = null;
            $scope.new_message = '';
            $scope.Message = null;
            
            $scope.user = user;

            $scope.$on('chatReceiverSet', function(event, user) {
                $scope.receiver = user;
                $scope.minimized = false;
                $scope.Message = Message($rootScope.token, user.id, $scope.user.profile().id);
            });

            $scope.submit = function (new_message) {
                if (! new_message) {
                    return;
                }
                $scope.Message.send({
                    sender_data: user.profile(),
                    receipt_data: $scope.receiver,
                    message: new_message
                });
                $scope.new_message = '';
            };


            $scope.close = function (event) {
                event.stopPropagation();
                $scope.receiver = null;
                $scope.new_message = '';
            };

            $scope.toggleChat = function() {
                $scope.minimized = ! $scope.minimized;
            };
        }]
    );
});
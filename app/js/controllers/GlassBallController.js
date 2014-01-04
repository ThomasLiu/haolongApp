define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering GlassBallController module.");

    var controller = ['$scope', 'GlassBallService', function ($scope,GlassBallService) {
        Console.group("GlassBallController entered.");
        $scope.isShow = false;
        $scope.queue = GlassBallService.queue();
        $scope.queueHead = [
             '订单名'
            , '记录时间'
        ];

        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            GlassBallService.removeObject('p'+object.id,function(){
                $scope.queue = GlassBallService.queue();
            });
            Console.groupEnd();
        }

        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

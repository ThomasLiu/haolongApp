define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering BallController module.");

    var controller = ['$scope', 'BallService', function ($scope,BallService) {
        Console.group("BallController entered.");
        $scope.isShow = false;
        $scope.queue = BallService.queue();
        $scope.queueHead = [
             '客户名'
            , '交货日期'
            , '颜色'
            , '厘数'
            , '备注'
            , '记录时间'
        ];

        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            BallService.removeObject('p'+object.id,function(){
                $scope.queue = BallService.queue();
            });
            Console.groupEnd();
        }

        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

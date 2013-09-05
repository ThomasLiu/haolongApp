define(['Console'], function (Console) {
    "use strict";
    Console.group("Entering WindowModelDetailController module.");

    var controller = ['$scope'
        , 'WindowModelService'
        ,'$routeParams'

        , function ($scope
            ,WindowModelService
            ,$routeParams) {
        Console.group("WindowModelDetailController entered.");
        $scope.isShow = false;

        WindowModelService.getObjectById($routeParams.windowModelId,function(getBackObject){
            if(getBackObject){
                $scope.object = getBackObject;
            }
        });
        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

define(['Console'], function (Console) {
    "use strict";
    Console.group("Entering AfterCalculateController module.");

    var controller = ['$scope'
        , 'WindowModelService'
        ,'$routeParams'

        , function ($scope
            ,WindowModelService
            ,$routeParams) {
        Console.group("AfterCalculateController entered.");
        var needCalculateObject = {
            height:$routeParams.height,
            width:$routeParams.width,
            interHeight:$routeParams.interHeight,
            quantity:$routeParams.quantity,
            showWeight:$routeParams.showWeight,
            showPrice:$routeParams.showPrice,
            windowModelId:$routeParams.windowModelId
        };

        Console.debug("needCalculateObject",needCalculateObject);


        WindowModelService.calculate(needCalculateObject,function(afterCalculate){
             $scope.afterCalculate = afterCalculate;

        });


        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

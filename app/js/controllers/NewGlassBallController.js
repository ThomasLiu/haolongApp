define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering GlassBallController module.");

    var controller = ['$scope'
        , 'GlassBallService'
        , '$routeParams'
        , function ($scope
            ,GlassBallService
            , $routeParams) {
        Console.group("GlassBallController entered.");
        Console.debug("$routeParams.glassBallId",$routeParams.glassBallId);
        if($routeParams.glassBallId){
            GlassBallService.getObjectById($routeParams.glassBallId,function(getBackObject){
                if(getBackObject){
                    $scope.willSaveObject = getBackObject;
                }
            });
        }else{
            $scope.willSaveObject = {};
        }


        $scope.removeItem = function(index,glass){
            glass.list.splice(index, 1);
        };
        $scope.removeGlass = function(index){
            $scope.willSaveObject.glasss.splice(index, 1);
        };

        $scope.addGlass = function(object) {
            if(object){
                Console.group("addGlass", object);
                var glasss = $scope.willSaveObject.glasss || [];
                var clone = _.clone(object);

                glasss.push(clone);

                Console.group("glasss", glasss);
                $scope.willSaveObject.glasss = glasss;
                object.caseName = '';
                Console.groupEnd();
            }
        };
        $scope.addItem = function(object) {
            if(object){
                Console.group("addItem", object);
                var list = object.list || [];
                var clone = _.clone(object.newItem);
                list.push(clone);
                var countNum = 0;
                if(list){
                    _.forEach(list,function(value, key){
                        countNum = countNum + parseInt(value.countNum);
                    });
                }
                object.countNum = countNum;

                Console.group("list", list);
                object.list = list;
                object.newItem.height = '';
                object.newItem.width = '';
                object.newItem.countNum = '';
                Console.groupEnd();
            }
        };



        $scope.saveObject = function(object) {
            if(object){
                Console.group("saveObject", object);
                if(object.caseName && object.caseName != ''){
                    GlassBallService.saveObject(object,function(savedBall){
                        window.alert('保存成功');
                    });
                }else{
                    window.alert('请输入订单名');
                }
                Console.groupEnd();
            }
        };

        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering MaterialController module.");

    var controller = ['$scope', 'MaterialService', 'NeedMaterialService', function ($scope,MaterialService,NeedMaterialService) {
        Console.group("MaterialController entered.");
        $scope.isShow = false;
        $scope.queue = MaterialService.queue();
        $scope.queueHead = [
            '框料名'
            , '每米的重量（Kg/m）'
            , '每公斤的单价（￥/Kg）'
        ];
        $scope.getObject = function(object) {
            Console.group("removeObject", object);
            $scope.willSaveObject =  _.clone(object);
            Console.groupEnd();
        }

        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            MaterialService.removeObject('p'+object.id,function(){
                NeedMaterialService.removeByMaterialId(object.id,function(){
                    $scope.queue = MaterialService.queue();
                });
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                Console.group("updateObject", object);

                MaterialService.getObjectByCaseName(object.caseName, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = ' 修改成功';
                    }else{
                        object.id = null;
                        msg = ' 本来不存在，现在已帮您添加了';
                    }
                    MaterialService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = MaterialService.queue();
                        $scope.msg = object.caseName + msg;
                        $scope.result = 'alert alert-success';
                        $scope.isShow = true;
                    });
                });
                Console.groupEnd();
            }
        }

        $scope.saveObject = function(object) {
            if(object){
                Console.group("saveObject", object);

                MaterialService.getObjectByCaseName(object.caseName, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = object.caseName + '已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        MaterialService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = MaterialService.queue();
                            $scope.msg = object.caseName + '添加成功';
                            $scope.result = 'alert alert-success';
                        });
                    }
                    $scope.isShow = true;
                });
                Console.groupEnd();
            }
        }

        Console.groupEnd();
    }];

    Console.groupEnd();
    return controller;
});

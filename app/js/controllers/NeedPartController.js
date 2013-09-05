define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering NeedPartController module.");

    var controller = ['$scope'
        , 'NeedPartService'
        ,'PartService'
        ,'$routeParams', function ($scope,NeedPartService,PartService,$routeParams) {
        Console.group("NeedPartController entered.");
        $scope.isShow = false;
        $scope.queuePart = PartService.queue();
        $scope.queue = NeedPartService.queueByWindowModelId($routeParams.windowModelId);
        $scope.queueHead = [
             '配件名'
            , '个数计算公式'
        ];


        $scope.getObject = function(object) {
            Console.group("getObject", object);
            $scope.willSaveObject =  _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            NeedPartService.removeObject('p'+object.id,function(){
                $scope.queue = NeedPartService.queueByWindowModelId($routeParams.windowModelId);
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                object.windowModel = $routeParams.windowModelId;
                Console.group("updateObject", object);

                NeedPartService.getObjectByWindowModelIdAndPartId(object.windowModel,object.part, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = '该关系 修改成功';
                    }else{
                        object.id = null;
                        msg = '该关系 本来不存在，现在已帮您添加了';
                    }
                    NeedPartService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = NeedPartService.queueByWindowModelId($routeParams.windowModelId);
                        $scope.msg =  msg;
                        $scope.result = 'alert alert-success';
                        $scope.isShow = true;
                    });
                });
                Console.groupEnd();
            }

        }

        $scope.saveObject = function(object) {
            if(object){
                object.windowModel = $routeParams.windowModelId;
                Console.group("saveObject", object);

                NeedPartService.getObjectByWindowModelIdAndPartId(object.windowModel,object.part, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = '该关系已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        NeedPartService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = NeedPartService.queueByWindowModelId($routeParams.windowModelId);
                            $scope.msg = '关系添加成功';
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

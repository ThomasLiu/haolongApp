define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering NeedMaterialController module.");

    var controller = ['$scope'
        , 'NeedMaterialService'
        ,'MaterialService'
        ,'$routeParams', function ($scope,NeedMaterialService,MaterialService,$routeParams) {
        Console.group("NeedMaterialController entered.");
        $scope.isShow = false;
        $scope.queueMaterial = MaterialService.queue();
        $scope.queue = NeedMaterialService.queueByWindowModelId($routeParams.windowModelId);
        $scope.queueHead = [
             '铝材名'
            , '需要多少件'
            , '每件的计算公式'
        ];


        $scope.getObject = function(object) {
            Console.group("getObject", object);
            $scope.willSaveObject = _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            NeedMaterialService.removeObject('p'+object.id,function(){
                $scope.queue = NeedMaterialService.queueByWindowModelId($routeParams.windowModelId);
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                object.windowModel = $routeParams.windowModelId;
                Console.group("updateObject", object);

                NeedMaterialService.getObjectByWindowModelIdAndMaterialId(object.windowModel,object.material, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = '该关系 修改成功';
                    }else{
                        object.id = null;
                        msg = '该关系 本来不存在，现在已帮您添加了';
                    }
                    NeedMaterialService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = NeedMaterialService.queueByWindowModelId($routeParams.windowModelId);
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

                NeedMaterialService.getObjectByWindowModelIdAndMaterialId(object.windowModel,object.material, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = '该关系已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        NeedMaterialService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = NeedMaterialService.queueByWindowModelId($routeParams.windowModelId);
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

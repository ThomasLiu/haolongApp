define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering WindowModelController module.");

    var controller = ['$scope'
        , 'WindowModelService'
        , 'NeedMaterialService'
        , 'NeedGlassService'
        , 'NeedPartService'
        , function ($scope,WindowModelService,NeedMaterialService,NeedGlassService,NeedPartService) {
        Console.group("WindowModelController entered.");
        $scope.isShow = false;
        $scope.queue = WindowModelService.queue();
        $scope.queueHead = [
             '窗型名'
            , '型号类别'
            , '是否有内孔'
            , '窗型开数'
        ];
        $scope.getObject = function(object) {
            Console.group("removeObject", object);
            $scope.willSaveObject = _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            WindowModelService.removeObject('p'+object.id,function(){
                NeedMaterialService.removeByWindowModelId(object.id,function(){
                    NeedGlassService.removeByWindowModelId(object.id,function(){
                        NeedPartService.removeByWindowModelId(object.id,function(){
                            $scope.queue = WindowModelService.queue();
                        });
                    });
                });
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                Console.group("updateObject", object);

                WindowModelService.getObjectByCaseName(object.caseName, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = ' 修改成功';
                    }else{
                        object.id = null;
                        msg = ' 本来不存在，现在已帮您添加了';
                    }
                    WindowModelService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = WindowModelService.queue();
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

                WindowModelService.getObjectByCaseName(object.caseName, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = object.caseName + '已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        WindowModelService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = WindowModelService.queue();
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

define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering NeedGlassController module.");

    var controller = ['$scope'
        , 'NeedGlassService'
        ,'GlassService'
        ,'$routeParams', function ($scope,NeedGlassService,GlassService,$routeParams) {
        Console.group("NeedGlassController entered.");
        $scope.isShow = false;
        $scope.queueGlass = GlassService.queue();
        $scope.queue = NeedGlassService.queueByWindowModelId($routeParams.windowModelId);
        $scope.queueHead = [
             '玻璃名'
            , '需要多少块'
            , '长的计算公式（每块玻璃）'
            , '宽的计算公式（每块玻璃）'
        ];


        $scope.getObject = function(object) {
            Console.group("getObject", object);
            $scope.willSaveObject =  _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            NeedGlassService.removeObject('p'+object.id,function(){
                $scope.queue = NeedGlassService.queueByWindowModelId($routeParams.windowModelId);
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                object.windowModel = $routeParams.windowModelId;
                Console.group("updateObject", object);

                NeedGlassService.getObjectByWindowModelIdAndGlassId(object.windowModel,object.glass, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = '该关系 修改成功';
                    }else{
                        object.id = null;
                        msg = '该关系 本来不存在，现在已帮您添加了';
                    }
                    NeedGlassService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = NeedGlassService.queueByWindowModelId($routeParams.windowModelId);
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

                NeedGlassService.getObjectByWindowModelIdAndGlassId(object.windowModel,object.glass, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = '该关系已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        NeedGlassService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = NeedGlassService.queueByWindowModelId($routeParams.windowModelId);
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

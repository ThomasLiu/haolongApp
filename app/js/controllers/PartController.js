define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering PartController module.");

    var controller = ['$scope', 'PartService', 'NeedPartService', function ($scope,PartService,NeedPartService) {
        Console.group("PartController entered.");
        $scope.isShow = false;
        $scope.queue = PartService.queue();
        $scope.queueHead = [
             '配件名'
            , '配件单位'
            , '单价'
        ];

        $scope.getObject = function(object) {
            Console.group("removeObject", object);
            $scope.willSaveObject = _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            PartService.removeObject('p'+object.id,function(){
                NeedPartService.removeByPartId(object.id,function(){
                    $scope.queue = PartService.queue();
                });

            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                Console.group("updateObject", object);

                PartService.getObjectByCaseName(object.caseName, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = ' 修改成功';
                    }else{
                        object.id = null;
                        msg = ' 本来不存在，现在已帮您添加了';
                    }
                    PartService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = PartService.queue();
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

                PartService.getObjectByCaseName(object.caseName, function(thisObject){
                    if(thisObject){
                        $scope.willSaveObject = thisObject;
                        $scope.msg = object.caseName + '已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        PartService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = PartService.queue();
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

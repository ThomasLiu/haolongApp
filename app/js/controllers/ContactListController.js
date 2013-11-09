define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering ContactListController module.");

    var controller = ['$scope', 'ContactListService', function ($scope,ContactListService) {
        Console.group("ContactListController entered.");
        $scope.isShow = false;
        $scope.queue = ContactListService.queue();
        $scope.queueHead = [
             '名字'
            , '电话'
            , '地址'
        ];

        $scope.getObject = function(object) {
            Console.group("removeObject", object);
            $scope.willSaveObject = _.clone(object);
            Console.groupEnd();
        }
        $scope.removeObject = function(object) {
            Console.group("removeObject", object);
            ContactListService.removeObject('p'+object.id,function(){
                $scope.queue = ContactListService.queue();
            });
            Console.groupEnd();
        }


        $scope.updateObject = function(object) {
            if(object){
                Console.group("updateObject", object);

                ContactListService.getObjectByPhone(object.phone, function(thisObject){
                    var msg = '';
                    if(thisObject){
                        object.id  = thisObject.id;
                        msg = ' 修改成功';
                    }else{
                        object.id = null;
                        msg = ' 本来不存在，现在已帮您添加了';
                    }
                    ContactListService.saveObject(object,function(savedObject){
                        Console.debug("object id?", savedObject.id);
                        $scope.willSaveObject = savedObject;
                        $scope.queue = ContactListService.queue();
                        $scope.msg = object.phone + msg;
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

                ContactListService.getObjectByPhone(object.phone, function(thisObject){
                    if(thisObject){
                        $scope.msg = object.phone + '这个号码已存在';
                        $scope.result = 'alert';
                    }else{
                        object.id = null;
                        ContactListService.saveObject(object,function(savedObject){
                            Console.debug("object id?", savedObject.id);
                            $scope.willSaveObject = savedObject;
                            $scope.queue = ContactListService.queue();
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

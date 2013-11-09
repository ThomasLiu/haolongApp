define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering WindowModelDetailController module.");

    var controller = ['$scope'
        , 'WindowModelService'
        , 'BallService'
        , '$routeParams'
        , 'ColorService'
        , 'GrainService'
        , function ($scope
            ,WindowModelService
            ,BallService
            ,$routeParams
            ,ColorService
            ,GrainService) {
            Console.group("WindowModelDetailController entered.");

            $scope.queueWindowModel = WindowModelService.queue();

            $scope.queueColor = ColorService.queue();

            $scope.queueGrain = GrainService.queue();

            $scope.glassColor = new Array();

            $scope.removeNotNowCalculate = function(index){
                $scope.newBall.queueNotNowCalculate.splice(index, 1);
            };
            Console.debug("$routeParams.ballId",$routeParams.ballId);
            if($routeParams.ballId){
                BallService.getObjectById($routeParams.ballId,function(getBackObject){
                    if(getBackObject){
                        $scope.newBall = getBackObject;
                    }
                });
            }else{
                $scope.newBall = {
                    queueNotNowCalculate: []
                };
            }
            $scope.materialType = '';




            $scope.change = function(windowModelId){
                WindowModelService.getObjectById(windowModelId,function(thisWindowModel){
                    Console.debug("haveInner",thisWindowModel.haveInner);
                    if(thisWindowModel.haveInner && thisWindowModel.haveInner == 'true'){

                    }else{
                        $scope.needObject.interHeight = undefined;
                    }
                    $scope.selectedWindowModel = thisWindowModel;
                });
            }
            $scope.saveBall = function(ball){

                Console.group("saveBall",ball);
                if(ball.client && ball.client != ''){
                    BallService.saveObject(ball,function(savedBall){
                        window.alert('保存成功');
                    });
                }else{
                    window.alert('请输入客户名');
                }
                Console.groupEnd();
            }
            $scope.printBall = function(type){
                Console.group("notNowCalculate",type);
                switch(type){
                    case 1:
                        $scope.printClientBall = true;
                        $scope.printMaterialBall = false;
                        $scope.printGlassBall = true;
                        $scope.printPartBall = true;
                        break;
                    case 2:
                        $scope.printClientBall = true;
                        $scope.printMaterialBall = true;
                        $scope.printGlassBall = false;
                        $scope.printPartBall = true;
                        break;

                    case 3:
                        $scope.printClientBall = true;
                        $scope.printMaterialBall = true;
                        $scope.printGlassBall = true;
                        $scope.printPartBall = false;
                        break;

                    case 4:
                        $scope.printClientBall = true;
                        $scope.printMaterialBall = false;
                        $scope.printGlassBall = true;
                        $scope.printPartBall = false;
                        break;

                    default :
                        $scope.printClientBall = false;
                        $scope.printMaterialBall = true;
                        $scope.printGlassBall = true;
                        $scope.printPartBall = true;
                        break;

                }
                $scope.newBall.createdDate = (new Date()).toLocaleString();
                setTimeout(function(){
                        window.print();
                    },500
                )

                Console.groupEnd();
            }

            $scope.notNowCalculate = function(needCalculate){
                Console.group("notNowCalculate",needCalculate);
                var clone = _.clone(needCalculate);
                var notSame = true;

                for(var i=0;i < $scope.newBall.queueNotNowCalculate.length; i++){
                    var thisNotNowCalculate = $scope.newBall.queueNotNowCalculate[i];
                    if(thisNotNowCalculate.windowModelId == clone.windowModelId
                        && thisNotNowCalculate.height == clone.height
                        && thisNotNowCalculate.width == clone.width
                        && thisNotNowCalculate.interHeight == clone.interHeight){

                        $scope.newBall.queueNotNowCalculate[i].quantity = (parseInt(thisNotNowCalculate.quantity || 1) + parseInt(clone.quantity || 1));

                        notSame = false;
                    }
               }
               if(notSame){
                   $scope.newBall.queueNotNowCalculate.push(clone);
               }
               Console.groupEnd();
            }
            $scope.queueAfterCalculated = {};

            $scope.calculate = function(queueNeedCalculates){
                WindowModelService.calceulateList(queueNeedCalculates,function(queueAfterCalculated){
                    $scope.queueAfterCalculated = queueAfterCalculated;
                });
            }

            Console.groupEnd();
        }];

    Console.groupEnd();
    return controller;
});

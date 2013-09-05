define(['Console'
    , 'Underscore' // lib/underscore/underscore
    ], function (Console,_) {
    "use strict";
    Console.group("Entering WindowModelDetailController module.");

    var controller = ['$scope'
        , 'WindowModelService'
        , 'MaterialService'
        , 'GlassService'
        , function ($scope
            ,WindowModelService
            ,MaterialService
            ,GlassService) {
            Console.group("WindowModelDetailController entered.");

            $scope.queueWindowModel = WindowModelService.queue();

            $scope.removeNotNowCalculate = function(index){
                $scope.queueNotNowCalculate.splice(index, 1);
            };


            $scope.queueNotNowCalculate = [];

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

            $scope.notNowCalculate = function(needCalculate){
                Console.group("notNowCalculate",needCalculate);
                var clone = _.clone(needCalculate);
                var notSame = true;

                for(var i=0;i < $scope.queueNotNowCalculate.length; i++){
                    var thisNotNowCalculate = $scope.queueNotNowCalculate[i];
                    if(thisNotNowCalculate.windowModelId == clone.windowModelId
                        && thisNotNowCalculate.height == clone.height
                        && thisNotNowCalculate.width == clone.width
                        && thisNotNowCalculate.interHeight == clone.interHeight){

                        $scope.queueNotNowCalculate[i].quantity = (parseInt(thisNotNowCalculate.quantity || 1) + parseInt(clone.quantity || 1));

                        notSame = false;
                    }
               }
               if(notSame){
                   $scope.queueNotNowCalculate.push(clone);
               }
               Console.groupEnd();
            }

            $scope.queueCalculated = {};

            $scope.calculate = function(queueNeedCalculates){
                Console.group("calculate",queueNeedCalculates);
                $scope.queueCalculated = {};
                for(var i=0;i < queueNeedCalculates.length; i++){
                    var needCalculate = queueNeedCalculates[i];
                    WindowModelService.calculate(needCalculate,function(afterCalculate){

                        var calculatedWindowModel =  $scope.queueCalculated['p' + afterCalculate.windowModel.id]
                            || {
                            caseName: afterCalculate.windowModel.caseName,
                            calculated:[],
                            materialHead:[],
                            glassHead:[],
                            materials:{},
                            glasss:{},
                            totalPrice:0
                        };
                        calculatedWindowModel.calculated.push(afterCalculate);
                        if(calculatedWindowModel.materialHead.length == 0){
                            for(var index = 0; index< afterCalculate.materials.length; index++ ){
                                calculatedWindowModel.materialHead.push(afterCalculate.materials[index].caseName);
                            }
                        }
                        if(calculatedWindowModel.glassHead.length == 0){
                            for(var index = 0; index< afterCalculate.glasss.length; index++ ){
                                calculatedWindowModel.glassHead.push(afterCalculate.glasss[index].caseName);
                            }
                        }

                        for(var index = 0; index< afterCalculate.materials.length; index++ ){
                            var afterCalculateMaterial = afterCalculate.materials[index];
                            var calculated = calculatedWindowModel.materials['p' + afterCalculateMaterial.materialId] || {};

                            var materialLength = calculated['l' + afterCalculateMaterial.length] || {
                                needLength:afterCalculateMaterial.length,
                                materialId:afterCalculateMaterial.materialId
                            };

                            materialLength.thisQuantity = parseInt((materialLength.thisQuantity || '0')) + parseInt(afterCalculateMaterial.thisQuantity);

                            calculated['l' + afterCalculateMaterial.length] = materialLength;
                            calculatedWindowModel.materials['p' + afterCalculateMaterial.materialId] = calculated;
                        }

                        for(var index = 0; index< afterCalculate.glasss.length; index++ ){
                            var afterCalculateGlass = afterCalculate.glasss[index];
                            var calculated = calculatedWindowModel.glasss['p' + afterCalculateGlass.glassId] || {};

                            var glassArea = calculated[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] ||
                            {
                                needLength:afterCalculateGlass.lengthFormula,
                                needWidth:afterCalculateGlass.widthFormula,
                                glassId:afterCalculateGlass.glassId
                            };

                            glassArea.thisQuantity = parseInt((glassArea.thisQuantity || '0')) + parseInt(afterCalculateGlass.thisQuantity);

                            calculated[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] = glassArea;
                            calculatedWindowModel.glasss['p' + afterCalculateGlass.glassId] = calculated;
                        }

                        _.each(calculatedWindowModel.materials, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                MaterialService.getObjectById(value.materialId,function(gotMaterial){
                                    value.weight = parseInt(gotMaterial.weight || 0)*parseInt(value.needLength || 0)/10;
                                    value.price =  parseInt(value.weight || 0)*gotMaterial.price;

                                    calculatedWindowModel.totalPrice = parseInt(calculatedWindowModel.totalPrice) + value.price;
                                });
                            });
                        });
                        _.each(calculatedWindowModel.glasss, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                GlassService.getObjectById(value.glassId,function(gotGlass){
                                    value.price =  parseInt(value.needLength || 0)*parseInt(value.needWidth || 0)*gotGlass.price/100;

                                    calculatedWindowModel.totalPrice = parseInt(calculatedWindowModel.totalPrice) + value.price;
                                });
                            });
                        });

                        $scope.queueCalculated['p' + afterCalculate.windowModel.id] = calculatedWindowModel;


                    });
                }
                Console.debug("queueCalculated",$scope.queueCalculated);
                Console.groupEnd();
            }

            Console.groupEnd();
        }];

    Console.groupEnd();
    return controller;
});

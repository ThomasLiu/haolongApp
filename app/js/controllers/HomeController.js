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
                Console.group("$scope.calculate",queueNeedCalculates);
                $scope.queueCalculated = {};

                $scope.queueCalculatedMaterial = {};
                $scope.queueCalculatedGlass = {};
                $scope.queueCalculatedPart = {};

                Console.debug("queueNeedCalculates.length",queueNeedCalculates.length);
                for(var i=0;i < queueNeedCalculates.length; i++){

                    var needCalculate = queueNeedCalculates[i];
                    Console.debug("needCalculate",needCalculate);
                    WindowModelService.calculate(needCalculate,function(afterCalculate){

                        var calculatedWindowModel =  $scope.queueCalculated['p' + afterCalculate.windowModel.id]
                            || {
                            caseName: afterCalculate.windowModel.caseName,
                            calculated:[],
                            materialHead:[],
                            glassHead:[],
                            materials:{},
                            glasss:{},
                            parts:{},
                            totalPrice:0,
				            totalWeight:0
                            ,totalMaterialPrice:0
                            ,totalGlassPrice:0
                            ,totalPartPrice:0
                            ,showMaterial:true
                            ,showGlass:true
                            ,showPart:true
                        };

                        calculatedWindowModel.totalPrice += afterCalculate.totalPrice;
                        calculatedWindowModel.totalWeight += afterCalculate.totalWeight;
                        calculatedWindowModel.totalMaterialPrice += afterCalculate.totalMaterialPrice;
                        calculatedWindowModel.totalGlassPrice += afterCalculate.totalGlassPrice;
                        calculatedWindowModel.totalPartPrice += afterCalculate.totalPartPrice;

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

                            var thisCalculatedMaterial = $scope.queueCalculatedMaterial['p' + afterCalculateMaterial.materialId] || {};
                            Console.debug("afterCalculateMaterial.caseName.indexOf",afterCalculateMaterial.caseName + "," + afterCalculateMaterial.caseName.indexOf('侧') + "," + (afterCalculateMaterial.caseName.length-1));
                            var thisCalculatedMaterialLength;
                            if(afterCalculateMaterial.caseName.indexOf('侧') == (afterCalculateMaterial.caseName.length-1) &&
                                afterCalculate.windowModel.haveInner == 'true'){
                                var thisCaseName = '(内：' + afterCalculate.needObject.interHeight + ')' + afterCalculate.windowModel.openNum + '开';
                                thisCalculatedMaterialLength = thisCalculatedMaterial['l' + afterCalculateMaterial.length + 'k' + afterCalculate.windowModel.openNum + 'i' + afterCalculate.needObject.interHeight] || {
                                    needLength:afterCalculateMaterial.length,
                                    materialId:afterCalculateMaterial.materialId,
                                    caseName: thisCaseName
                                };
                                thisCalculatedMaterial['l' + afterCalculateMaterial.length + 'k' + afterCalculate.windowModel.openNum + 'i' + afterCalculate.needObject.interHeight] = thisCalculatedMaterialLength;
                            }else{
                                thisCalculatedMaterialLength = thisCalculatedMaterial['l' + afterCalculateMaterial.length] || {
                                    needLength:afterCalculateMaterial.length,
                                    materialId:afterCalculateMaterial.materialId

                                };
                                thisCalculatedMaterial['l' + afterCalculateMaterial.length] = thisCalculatedMaterialLength;
                            }


                            var materialLength = calculated['l' + afterCalculateMaterial.length] || {
                                needLength:afterCalculateMaterial.length,
                                materialId:afterCalculateMaterial.materialId
                            };

                            materialLength.thisQuantity = parseInt((materialLength.thisQuantity || '0')) + parseInt(afterCalculateMaterial.thisQuantity);
                            thisCalculatedMaterialLength.thisQuantity = parseInt((thisCalculatedMaterialLength.thisQuantity || '0')) + parseInt(afterCalculateMaterial.thisQuantity);

                            calculated['l' + afterCalculateMaterial.length] = materialLength;
                            calculatedWindowModel.materials['p' + afterCalculateMaterial.materialId] = calculated;
                            $scope.queueCalculatedMaterial['p' + afterCalculateMaterial.materialId] = thisCalculatedMaterial;
                        }

                        for(var index = 0; index< afterCalculate.glasss.length; index++ ){
                            var afterCalculateGlass = afterCalculate.glasss[index];
                            var calculated = calculatedWindowModel.glasss['p' + afterCalculateGlass.glassId] || {};
                            var thisCalculatedGlass = $scope.queueCalculatedGlass['p' + afterCalculateGlass.glassId] || {};
                            var thisCalculatedGlassArea = thisCalculatedGlass[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] ||
                            {
                                needLength:afterCalculateGlass.lengthFormula,
                                needWidth:afterCalculateGlass.widthFormula,
                                glassId:afterCalculateGlass.glassId
                            };

                            var glassArea = calculated[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] ||
                            {
                                needLength:afterCalculateGlass.lengthFormula,
                                needWidth:afterCalculateGlass.widthFormula,
                                glassId:afterCalculateGlass.glassId
                            };

                            glassArea.thisQuantity = parseInt((glassArea.thisQuantity || '0')) + parseInt(afterCalculateGlass.thisQuantity);
                            thisCalculatedGlassArea.thisQuantity = parseInt((thisCalculatedGlassArea.thisQuantity || '0')) + parseInt(afterCalculateGlass.thisQuantity);
                            thisCalculatedGlass[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] = thisCalculatedGlassArea;
                            calculated[afterCalculateGlass.lengthFormula + 'X' + afterCalculateGlass.widthFormula] = glassArea;
                            calculatedWindowModel.glasss['p' + afterCalculateGlass.glassId] = calculated;
                            $scope.queueCalculatedGlass['p' + afterCalculateGlass.glassId] = thisCalculatedGlass;
                        }

                        for(var index = 0; index< afterCalculate.parts.length; index++ ){
                            var afterCalculatePart = afterCalculate.parts[index];

                            var thisCalculatedPart = $scope.queueCalculatedPart['p' + afterCalculatePart.partId] || {
                                unit: afterCalculatePart.unit
                                ,thisQuantity: 0
                                ,price:0
                            };

                            var calculated = calculatedWindowModel.parts['p' + afterCalculatePart.partId] || {
                                unit: afterCalculatePart.unit
                                ,thisQuantity: 0
                                ,price:0
                            };
                            calculated.thisQuantity += parseFloat(afterCalculatePart.thisQuantity || 0);
                            calculated.price += parseFloat(afterCalculatePart.price || 0);
                            thisCalculatedPart.thisQuantity += parseFloat(afterCalculatePart.thisQuantity || 0);
                            thisCalculatedPart.price += parseFloat(afterCalculatePart.price || 0);

                            calculatedWindowModel.parts['p' + afterCalculatePart.partId] = calculated;

                            $scope.queueCalculatedPart['p' + afterCalculatePart.partId] = thisCalculatedPart;
                        }



                        _.each(calculatedWindowModel.materials, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                MaterialService.getObjectById(value.materialId,function(gotMaterial){
                                    value.weight = parseFloat(gotMaterial.weight || 0)*parseInt(value.needLength || 0)/1000*value.thisQuantity;
                                    value.price =  parseFloat(value.weight || 0)*parseFloat(gotMaterial.price);
                                });
                            });
                        });
                        _.each(calculatedWindowModel.glasss, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                GlassService.getObjectById(value.glassId,function(gotGlass){
                                    value.price =  parseInt(value.needLength || 0)*parseInt(value.needWidth || 0)*parseFloat(gotGlass.price)*value.thisQuantity/1000000;
                                });
                            });
                        });
                        _.each($scope.queueCalculatedMaterial, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                MaterialService.getObjectById(value.materialId,function(gotMaterial){
                                    value.weight = parseFloat(gotMaterial.weight || 0)*parseInt(value.needLength || 0)/1000*value.thisQuantity;
                                    value.price =  parseFloat(value.weight || 0)*parseFloat(gotMaterial.price);
                                });
                            });
                        });
                        _.each($scope.queueCalculatedGlass, function(valueFirst, keyFirst) {
                            _.each(valueFirst, function(value, key) {
                                Console.debug("value",value);
                                GlassService.getObjectById(value.glassId,function(gotGlass){
                                    value.price =  parseInt(value.needLength || 0)*parseInt(value.needWidth || 0)*parseFloat(gotGlass.price)*value.thisQuantity/1000000;
                                });
                            });
                        });

                        $scope.queueCalculated['p' + afterCalculate.windowModel.id] = calculatedWindowModel;


                    });
                    Console.debug("queueCalculatedMaterial",$scope.queueCalculatedMaterial);
                }

                Console.debug("queueCalculated",$scope.queueCalculated);
                Console.groupEnd();
            }

            Console.groupEnd();
        }];

    Console.groupEnd();
    return controller;
});

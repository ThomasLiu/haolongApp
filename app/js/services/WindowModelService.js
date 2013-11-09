define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Underscore' // lib/underscore/underscore
    ,'utils/localStorageUtil'
], function (Console, _, localStorageUtil) {
  "use strict";
  Console.group("Entering WindowModelService module.");

  var service = ['$window'
      , 'NeedMaterialService'
      , 'NeedGlassService'
      , 'NeedPartService'
      , 'MaterialService'
      , 'GlassService'
      , 'PartService'
      , function ($window
          ,NeedMaterialService
          ,NeedGlassService
          ,NeedPartService
          ,MaterialService
          ,GlassService
          ,PartService) {
      var db = $window.localStorage;

      function calceulateList(queueNeedCalculates,callback){
          Console.group("Entering WindowModelService module calceulateList",queueNeedCalculates);
          var queueAfterCalculated = {
              queueCalculated : {},
              queueCalculatedMaterial : {},
              queueCalculatedGlass : {},
              queueCalculatedPart : {}
          };
          Console.debug("queueNeedCalculates.length",queueNeedCalculates.length);
          for(var i=0;i < queueNeedCalculates.length; i++){

              var needCalculate = queueNeedCalculates[i];
              Console.debug("needCalculate",needCalculate);
              calculate(needCalculate,function(afterCalculate){

                  var calculatedWindowModel =  queueAfterCalculated.queueCalculated['p' + afterCalculate.windowModel.id] || {
                      caseName: afterCalculate.windowModel.caseName,
                      haveInner: afterCalculate.windowModel.haveInner,
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
                  //构建表头
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
                  //计算铝材
                  for(var index = 0; index< afterCalculate.materials.length; index++ ){
                      var afterCalculateMaterial = afterCalculate.materials[index];
                      var calculated = calculatedWindowModel.materials['p' + afterCalculateMaterial.materialId] || {};

                      var thisCalculatedMaterial = queueAfterCalculated.queueCalculatedMaterial['p' + afterCalculateMaterial.materialId] || {
                          materialType:afterCalculateMaterial.materialType || '框料',
                          sumQuantity:0,
                          materialSizes:{}
                      };
                      Console.debug("afterCalculateMaterial.caseName.indexOf",afterCalculateMaterial.caseName + "," + afterCalculateMaterial.caseName.indexOf('侧') + "," + (afterCalculateMaterial.caseName.length-1));
                      var thisCalculatedMaterialLength;
                      var materialLength = calculated['l' + afterCalculateMaterial.length] || {
                          needLength:afterCalculateMaterial.length,
                          materialId:afterCalculateMaterial.materialId
                      };
                      if(afterCalculateMaterial.caseName.indexOf('侧') == (afterCalculateMaterial.caseName.length-1) ||
                          afterCalculateMaterial.caseName.indexOf('企') == (afterCalculateMaterial.caseName.length-1)){

                          var thisCaseName = '';
                          if(afterCalculate.windowModel.haveInner == 'true'){
                               thisCaseName = thisCaseName + '( 内：' + afterCalculate.needObject.interHeight + ' ) ';
                          }
                          if(afterCalculate.windowModel.haveCopperBar == 'true'){
                              thisCaseName = thisCaseName + '( 有铜条 ) ';
                          }
                          thisCaseName = thisCaseName + ' ( ' + afterCalculate.windowModel.openNum + '开 )';
                          var tempName = 'l' + afterCalculateMaterial.length + 'k' + afterCalculate.windowModel.openNum + 'i' + (afterCalculate.needObject.interHeight || 0) + (afterCalculate.windowModel.haveCopperBar || 'false');
                          thisCalculatedMaterialLength = thisCalculatedMaterial.materialSizes[tempName] || {
                              needLength:afterCalculateMaterial.length,
                              materialId:afterCalculateMaterial.materialId,
                              caseName: thisCaseName
                          };
                          thisCalculatedMaterial.materialSizes[tempName] = thisCalculatedMaterialLength;

                          materialLength = calculated['l' + afterCalculateMaterial.length + 'i' + (afterCalculate.needObject.interHeight || 0)] || {
                              needLength:afterCalculateMaterial.length,
                              materialId:afterCalculateMaterial.materialId,
                              caseName: thisCaseName
                          };
                          calculated['l' + afterCalculateMaterial.length + 'i' + (afterCalculate.needObject.interHeight || 0)] = materialLength;
                      }else{
                          thisCalculatedMaterialLength = thisCalculatedMaterial.materialSizes['l' + afterCalculateMaterial.length] || {
                              needLength:afterCalculateMaterial.length,
                              materialId:afterCalculateMaterial.materialId
                          };
                          thisCalculatedMaterial.materialSizes['l' + afterCalculateMaterial.length] = thisCalculatedMaterialLength;

                          materialLength = calculated['l' + afterCalculateMaterial.length] || {
                              needLength:afterCalculateMaterial.length,
                              materialId:afterCalculateMaterial.materialId
                          };
                          calculated['l' + afterCalculateMaterial.length] = materialLength;
                      }
		              var thisQuantity = parseInt(afterCalculateMaterial.thisQuantity);
                      materialLength.thisQuantity = parseInt((materialLength.thisQuantity || '0')) + thisQuantity;

                      thisCalculatedMaterialLength.thisQuantity = parseInt((thisCalculatedMaterialLength.thisQuantity || '0')) + thisQuantity;

                      thisCalculatedMaterial.sumQuantity = (thisCalculatedMaterial.sumQuantity || 0) + thisQuantity;

                      calculatedWindowModel.materials['p' + afterCalculateMaterial.materialId] = calculated;
                      queueAfterCalculated.queueCalculatedMaterial['p' + afterCalculateMaterial.materialId] = thisCalculatedMaterial;
                  }
                  //计算玻璃
                  for(var index = 0; index< afterCalculate.glasss.length; index++ ){
                      var afterCalculateGlass = afterCalculate.glasss[index];
                      var calculated = calculatedWindowModel.glasss['p' + afterCalculateGlass.glassId] || {};
                      var thisCalculatedGlass = queueAfterCalculated.queueCalculatedGlass['p' + afterCalculateGlass.glassId] || {};
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
                      queueAfterCalculated.queueCalculatedGlass['p' + afterCalculateGlass.glassId] = thisCalculatedGlass;
                  }
                  //计算配件
                  for(var index = 0; index< afterCalculate.parts.length; index++ ){
                      var afterCalculatePart = afterCalculate.parts[index];

                      var thisCalculatedPart = queueAfterCalculated.queueCalculatedPart['p' + afterCalculatePart.partId] || {
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

                      queueAfterCalculated.queueCalculatedPart['p' + afterCalculatePart.partId] = thisCalculatedPart;
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
                  _.each(queueAfterCalculated.queueCalculatedMaterial, function(valueFirst, keyFirst) {
                      _.each(valueFirst.materialSizes, function(value, key) {
                          Console.debug("value",value);
                          MaterialService.getObjectById(value.materialId,function(gotMaterial){
                              value.weight = parseFloat(gotMaterial.weight || 0)*parseInt(value.needLength || 0)/1000*value.thisQuantity;
                              value.price =  parseFloat(value.weight || 0)*parseFloat(gotMaterial.price);
                          });
                      });
                  });
                  _.each(queueAfterCalculated.queueCalculatedGlass, function(valueFirst, keyFirst) {
                      _.each(valueFirst, function(value, key) {
                          Console.debug("value",value);
                          GlassService.getObjectById(value.glassId,function(gotGlass){
                              value.price =  parseInt(value.needLength || 0)*parseInt(value.needWidth || 0)*parseFloat(gotGlass.price)*value.thisQuantity/1000000;
                          });
                      });
                  });
                  queueAfterCalculated.queueCalculated['p' + afterCalculate.windowModel.id] = calculatedWindowModel;
              });
              Console.debug("queueCalculatedMaterial",queueAfterCalculated.queueCalculatedMaterial);
              Console.debug("queueCalculated",queueAfterCalculated.queueCalculated);
          }
          Console.groupEnd();
          callback(queueAfterCalculated);
      }



      function calculate(object,callback){
          getObjectById(object.windowModelId,function(gotObject){
                 if(gotObject){
                     var needMaterials = NeedMaterialService.queueByWindowModelId(object.windowModelId);
                     var needGlasss = NeedGlassService.queueByWindowModelId(object.windowModelId);
                     var needParts = NeedPartService.queueByWindowModelId(object.windowModelId);

                     var l = parseInt(object.height || 0);
                     var w = parseInt(object.width || 0);
                     var i = parseInt(object.interHeight || 0);
                     var k = parseInt(gotObject.openNum || 0);
                     var quantity = parseInt(object.quantity || 1);

                     var afterCalculate = {
                         needObject:object
                         ,windowModel:gotObject
                         ,materials:[]
                         ,glasss:[]
                         ,parts:[]
                         ,totalPrice:0
                         ,totalWeight:0
                         ,totalMaterialPrice:0
                         ,totalGlassPrice:0
                         ,totalPartPrice:0
                     };
                     for(var index = 0; index<needMaterials.length; index++){
                         var needMaterial = needMaterials[index];
                         MaterialService.getObjectById(needMaterial.material, function(thisMaterial){
                             if(thisMaterial){
                                 var length = eval(needMaterial.formula);
                                 var thisQuantity = (parseInt(needMaterial.quantity || 1)*quantity);
                                 var weight = thisQuantity * length * parseFloat(thisMaterial.weight || 0) / 1000;
                                 var price = weight * parseFloat(thisMaterial.price || 0);

                                 var material = {
                                     materialId: thisMaterial.id
                                     ,caseName: thisMaterial.caseName
                                     ,materialType:thisMaterial.materialType
                                     ,length: length
                                     ,thisQuantity: thisQuantity
                                     ,weight: weight
                                     ,price:price
                                 };
                                 Console.debug("material", material);
                                 afterCalculate.materials.push(material);
                                 afterCalculate.totalWeight += weight;
                                 afterCalculate.totalPrice += price;
                                 afterCalculate.totalMaterialPrice += price;
                             }
                         });
                     }

                     for(var index = 0; index<needGlasss.length; index++){
                         var needGlass = needGlasss[index];
                         GlassService.getObjectById(needGlass.glass, function(thisGlass){
                             if(thisGlass){
                                 var lengthFormula = eval(needGlass.lengthFormula);
                                 var widthFormula = eval(needGlass.widthFormula);
                                 var thisQuantity = (parseInt(needGlass.quantity || 1)*quantity);
                                 var area = thisQuantity*lengthFormula*widthFormula/1000000;
                                 var price = area * parseFloat(thisGlass.price || 0);

                                 var glass = {
                                     glassId: thisGlass.id
                                     ,caseName: thisGlass.caseName
                                     ,lengthFormula: lengthFormula
                                     ,widthFormula: widthFormula
                                     ,thisQuantity: thisQuantity
                                     ,price:price
                                 };
                                 Console.debug("glass", glass);
                                 afterCalculate.glasss.push(glass);
                                 afterCalculate.totalPrice += price;
                                 afterCalculate.totalGlassPrice += price;
                             }
                         });
                     }

                     for(var index = 0; index<needParts.length; index++){
                         var needPart = needParts[index];
                         PartService.getObjectById(needPart.part, function(thisPart){
                             if(thisPart){
                                 var thisQuantity = eval(needPart.quantityFormula);
                                 var thisQuantity = (parseFloat(thisQuantity || 0)*quantity);
                                 var price = parseFloat(thisPart.price || 0) * thisQuantity;

                                 var part = {
                                     partId: thisPart.id
                                     ,caseName: thisPart.caseName
                                     ,thisQuantity: thisQuantity
                                     ,unit: thisPart.unit
                                     ,price:price
                                 };
                                 Console.debug("part", part);
                                 afterCalculate.parts.push(part);
                                 afterCalculate.totalPrice += price;
                                 afterCalculate.totalPartPrice += price;
                             }
                         });
                     }
                     callback(afterCalculate);
                 }
          });


      }

      function queue(){
          Console.group("Entering WindowModelService module queue.");
          var lists = [];
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].caseName){
                      lists.push(myData[thisData]);
                  }
              }
          }
          Console.groupEnd();
          return lists;
      }

      function getLists(){
          Console.group("Entering WindowModelService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myWindowModels',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering WindowModelService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myWindowModels = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function saveObject(object,callback){
          Console.group("Entering WindowModelService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myWindowModels = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }

      function getObjectById(objectId,callback){
          Console.group("Entering WindowModelService module getObjectById. objectId?" + objectId);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].id == objectId){
                      Console.groupEnd();
                      callback(myData[thisData]);
                      return false;
                  }
              }
              Console.groupEnd();
              callback(null);
          }
      }

      function getObjectByCaseName(caseName,callback){
          Console.group("Entering WindowModelService module getObjectByCaseName. caseName?" + caseName);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].caseName == caseName){
                      Console.groupEnd();
                      callback(myData[thisData]);
                      return false;
                  }
              }
              Console.groupEnd();
              callback(null);
          }
      }

    return {
        getLists:getLists,
        saveObject:saveObject,
        getObjectByCaseName:getObjectByCaseName,
        queue:queue,
        removeObject:removeObject,
        getObjectById:getObjectById,
        calculate:calculate,
        calceulateList:calceulateList
    };

  }];

  Console.groupEnd();
  return service;
});

define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
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
        calculate:calculate

    };

  }];

  Console.groupEnd();
  return service;
});

define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering NeedMaterialService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering NeedMaterialService module queue.");
          var lists = [];
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].material){
                      lists.push(myData[thisData]);
                  }
              }
          }
          Console.groupEnd();
          return lists;
      }
      function queueByWindowModelId(windowModelId){
          Console.group("Entering NeedMaterialService module queueByWindowModelId. windowModelId?" + windowModelId);
          var lists = [];
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId){
                      lists.push(myData[thisData]);
                  }
              }
          }
          Console.groupEnd();
          return lists;
      }


      function getLists(){
          Console.group("Entering NeedMaterialService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myNeedMaterials',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering NeedMaterialService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myNeedMaterials = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByMaterialId(materialId,callback){
          Console.group("Entering NeedMaterialService module removeByMaterialId. materialId?" + materialId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].material == materialId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedMaterials = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByWindowModelId(windowModelId,callback){
          Console.group("Entering NeedMaterialService module removeByWindowModelId. windowModelId?" + windowModelId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedMaterials = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }


      function saveObject(object,callback){
          Console.group("Entering NeedMaterialService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myNeedMaterials = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }

      function getObjectByWindowModelIdAndMaterialId(windowModelId,materialId,callback){
          Console.group("Entering NeedMaterialService module getObjectByWindowModelIdAndMaterialId. windowModelId?"
              + windowModelId + " materialId?" + materialId);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId && myData[thisData].material == materialId){
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
        getObjectByWindowModelIdAndMaterialId:getObjectByWindowModelIdAndMaterialId,
        queue:queue,
        removeObject:removeObject,
        queueByWindowModelId:queueByWindowModelId,
        removeByMaterialId:removeByMaterialId,
        removeByWindowModelId:removeByWindowModelId
    };

  }];

  Console.groupEnd();
  return service;
});

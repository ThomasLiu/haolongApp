define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering NeedGlassService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering NeedGlassService module queue.");
          var lists = [];
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].glass){
                      lists.push(myData[thisData]);
                  }
              }
          }
          Console.groupEnd();
          return lists;
      }
      function queueByWindowModelId(windowModelId){
          Console.group("Entering NeedGlassService module queueByWindowModelId. windowModelId?" + windowModelId);
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
          Console.group("Entering NeedGlassService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myNeedGlasss',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering NeedGlassService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myNeedGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByGlassId(glassId,callback){
          Console.group("Entering NeedGlassService module removeByGlassId. glassId?" + glassId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].glass == glassId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByWindowModelId(windowModelId,callback){
          Console.group("Entering NeedGlassService module removeByWindowModelId. windowModelId?" + windowModelId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }


      function saveObject(object,callback){
          Console.group("Entering NeedGlassService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myNeedGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }

      function getObjectByWindowModelIdAndGlassId(windowModelId,glassId,callback){
          Console.group("Entering NeedGlassService module getObjectByWindowModelIdAndGlassId. windowModelId?"
              + windowModelId + " glassId?" + glassId);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId && myData[thisData].glass == glassId){
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
        getObjectByWindowModelIdAndGlassId:getObjectByWindowModelIdAndGlassId,
        queue:queue,
        removeObject:removeObject,
        queueByWindowModelId:queueByWindowModelId,
        removeByGlassId:removeByGlassId,
        removeByWindowModelId:removeByWindowModelId
    };

  }];

  Console.groupEnd();
  return service;
});

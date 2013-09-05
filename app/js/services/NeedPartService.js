define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering NeedPartService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering NeedPartService module queue.");
          var lists = [];
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].part){
                      lists.push(myData[thisData]);
                  }
              }
          }
          Console.groupEnd();
          return lists;
      }
      function queueByWindowModelId(windowModelId){
          Console.group("Entering NeedPartService module queueByWindowModelId. windowModelId?" + windowModelId);
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
          Console.group("Entering NeedPartService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myNeedParts',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering NeedPartService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myNeedParts = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByPartId(partId,callback){
          Console.group("Entering NeedPartService module removeByPartId. partId?" + partId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].part == partId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedParts = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function removeByWindowModelId(windowModelId,callback){
          Console.group("Entering NeedPartService module removeByWindowModelId. windowModelId?" + windowModelId);
          var myData = getLists();
          if(myData.count != 0){
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId){
                      myData[thisData]  = undefined;
                  }
              }
          }
          db.myNeedParts = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }


      function saveObject(object,callback){
          Console.group("Entering NeedPartService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myNeedParts = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }

      function getObjectByWindowModelIdAndPartId(windowModelId,partId,callback){
          Console.group("Entering NeedPartService module getObjectByWindowModelIdAndPartId. windowModelId?"
              + windowModelId + " partId?" + partId);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].windowModel == windowModelId && myData[thisData].part == partId){
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
        getObjectByWindowModelIdAndPartId:getObjectByWindowModelIdAndPartId,
        queue:queue,
        removeObject:removeObject,
        queueByWindowModelId:queueByWindowModelId,
        removeByPartId:removeByPartId,
        removeByWindowModelId:removeByWindowModelId
    };

  }];

  Console.groupEnd();
  return service;
});

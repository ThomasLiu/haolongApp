define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering GlassService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering GlassService module queue.");
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
          Console.group("Entering GlassService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myGlasss',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering GlassService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function saveObject(object,callback){
          Console.group("Entering GlassService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myGlasss = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }

      function getObjectById(objectId,callback){
          Console.group("Entering GlassService module getObjectById. objectId?" + objectId);
          var myData = getLists();
          callback(myData['p'+ objectId]);
      }

      function getObjectByCaseName(caseName,callback){
          Console.group("Entering GlassService module getObjectByCaseName. caseName?" + caseName);
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
        getObjectById:getObjectById
    };

  }];

  Console.groupEnd();
  return service;
});

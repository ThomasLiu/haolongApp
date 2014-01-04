define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering GlassBallService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering GlassBallService module queue.");
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
          Console.group("Entering GlassBallService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myGlassBalls',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering GlassBallService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myGlassBalls = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function saveObject(object,callback){
          Console.group("Entering GlassBallService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          object.createdDate = (new Date()).toLocaleString();
          object.createdDateTime = (new Date()).setTime();
          myData['p' + object.id] = object;
          db.myGlassBalls = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }
      function getObjectById(objectId,callback){
          Console.group("Entering GlassBallService module getObjectById. objectId?" + objectId);
          var myData = getLists();
          Console.groupEnd();
          callback(myData['p'+ objectId]);
      }

      function getObjectByCaseName(caseName,callback){
          Console.group("Entering GlassBallService module getObjectByCaseName. caseName?" + caseName);
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

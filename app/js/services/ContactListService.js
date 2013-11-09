define([
    // Standard Libs
    'Console'// lib/console/console
    ,'utils/localStorageUtil'
], function (Console,localStorageUtil) {
  "use strict";
  Console.group("Entering ContactListService module.");

  var service = ['$window', function ($window) {
      var db = $window.localStorage;

      function queue(){
          Console.group("Entering ContactListService module queue.");
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
          Console.group("Entering ContactListService module getLists.");
          var myData = localStorageUtil.getLocalStorageToObject('myContactLists',db);
          Console.groupEnd();
          return myData;
      }

      function removeObject(id,callback){
          Console.group("Entering ContactListService module removeObject.id?" + id);
          var myData = getLists();
          if(myData[id]){
              myData[id] = undefined;
          }

          db.myContactLists = JSON.stringify(myData);
          Console.groupEnd();
          callback();
      }

      function saveObject(object,callback){
          Console.group("Entering ContactListService module saveObject.");
          var myData = getLists();
          if(!object.id){
              object.id = myData.count + 1;
              myData.count = myData.count + 1;
          }
          myData['p' + object.id] = object;
          db.myContactLists = JSON.stringify(myData);
          Console.groupEnd();
          callback(object);
      }
      function getObjectById(objectId,callback){
          Console.group("Entering ContactListService module getObjectById. objectId?" + objectId);
          var myData = getLists();
          callback(myData['p'+ objectId]);
      }

      function getObjectByPhone(phone,callback){
          Console.group("Entering ContactListService module getObjectByPhone. phone?" + phone);
          var myData = getLists();
          if(myData.count == 0){
              Console.groupEnd();
              callback(null);
          }else{
              for(var thisData in myData){
                  if(myData[thisData].phone == phone){
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
        getObjectByPhone:getObjectByPhone,
        queue:queue,
        removeObject:removeObject,
        getObjectById:getObjectById
    };

  }];

  Console.groupEnd();
  return service;
});

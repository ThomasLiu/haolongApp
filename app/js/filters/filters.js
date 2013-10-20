define([
  // Standard Libs
  'Console'       // lib/console/console
  , 'Underscore'  // lib/underscore/underscore
  // Application Filters
  , 'filters/ModalCaseNameFilter'
  , 'filters/HomePlaceFilter'
  , 'filters/CountQuantityFilter'
], function (Console,_ , msnf, hpf, cqf){
  "use strict";
  Console.group("Entering Filters module.");
  Console.info("modalCaseName", msnf);
  Console.info("homePlace", hpf);
  Console.info("countQuantity", cqf);
  var filters = {
       modalCaseName :msnf
      ,homePlace:hpf
      ,countQuantity:cqf
  };
  Console.info("Registered filters: ", filters);

  var initialize = function (angModule) {
    _.each(filters,function(filter,name){
      angModule.filter(name,filter);
    })
    Console.debug("Custom filters initialized.");
  }

  Console.groupEnd();
  return {
    initialize: initialize
  };
});

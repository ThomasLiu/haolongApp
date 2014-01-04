define([
  // Standard Libs
  'Console'       // lib/console/console
  , 'Underscore'  // lib/underscore/underscore
  // Application Filters
  , 'filters/ModalCaseNameFilter'
  , 'filters/HomePlaceFilter'
  , 'filters/CountQuantityFilter'
  , 'filters/CountAreaFilter'
  , 'filters/CountGlassBallFilter'
], function (Console,_ , msnf, hpf, cqf, caf, cgbf){
  "use strict";
  Console.group("Entering Filters module.");
  Console.info("modalCaseName", msnf);
  Console.info("homePlace", hpf);
  Console.info("countQuantity", cqf);
  Console.info("countArea", caf);
  Console.info("CountGlassBallFilter", cgbf);
  var filters = {
       modalCaseName :msnf
      ,homePlace:hpf
      ,countQuantity:cqf
      ,countArea:caf
      ,countGlassBall:cgbf
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

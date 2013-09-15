define([
  // Standard Libs
  'Console'       // lib/console/console
  , 'Underscore'  // lib/underscore/underscore
  // Application Filters
  , 'filters/ModalCaseNameFilter'
  , 'filters/HomePlaceFilter'
], function (Console,_ , msnf, hpf){
  "use strict";
  Console.group("Entering Filters module.");
  Console.info("modalCaseName", msnf);
  Console.info("homePlace", hpf);

  var filters = {
       modalCaseName :msnf
      ,homePlace:hpf
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

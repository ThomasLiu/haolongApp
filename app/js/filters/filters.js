define([
  // Standard Libs
  'Console'       // lib/console/console
  , 'Underscore'  // lib/underscore/underscore
  // Application Filters
  , 'filters/ModalCaseNameFilter'
], function (Console,_ , msnf){
  "use strict";
  Console.group("Entering Filters module.");
  Console.info("modalCaseName", msnf);

  var filters = {
       modalCaseName :msnf
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

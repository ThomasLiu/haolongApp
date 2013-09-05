define([
  // Standard Libs
  'Console'       // lib/console/console
  , 'Underscore'  // lib/underscore/underscore

  // Custom Services

  , 'services/PartService'
  , 'services/MaterialService'
  , 'services/WindowModelService'
  , 'services/GlassService'
  , 'services/NeedMaterialService'
  , 'services/NeedGlassService'
  , 'services/NeedPartService'
], function(Console, _, ps, ms, ws, gs, nms, ngs, nps) {
  "use strict";
  Console.group("Entering Service module.");
  Console.info("PartService", ps);
  Console.info("MaterialService", ms);
  Console.info("WindowModelService", ws);
  Console.info("GlassService", gs);
  Console.info("NeedMaterialService", nms);
  Console.info("NeedGlassService", ngs);
  Console.info("NeedPartService", nps);
  var services = {
      PartService: ps,
      MaterialService: ms
      ,WindowModelService: ws
      ,GlassService: gs
      ,NeedMaterialService:nms
      ,NeedGlassService:ngs
      ,NeedPartService:nps
  };
  Console.info("Registered services: ", services);

  var initialize = function (angModule) {
    _.each(services,function(service,name){
      angModule.factory(name,service);
    })
    Console.debug("Custom services initialized.");
  }

  Console.groupEnd();
  return {
    initialize: initialize
  };
});

define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Angular'    // lib/angular/angular
], function (Console,angular) {
  "use strict";
  Console.group("Entering HomePlaceFilter module.");

  var filter = function () {
      return function(input) {
          Console.group("Entering HomePlaceFilter module. input",input);
          if(input){
              if(input.showMaterial && input.showGlass && input.showPart){
                  return input.totalPrice;
              }else{
                 var totalMaterialPrice = input.showMaterial?input.totalMaterialPrice:0;
                 var totalGlassPrice = input.showGlass?input.totalGlassPrice:0;
                 var totalPartPrice = input.showPart?input.totalPartPrice:0;
                 Console.debug("totalMaterialPrice",totalMaterialPrice);
                 Console.debug("totalGlassPrice",totalGlassPrice);
                 Console.debug("totalPartPrice",totalPartPrice);
                 return totalMaterialPrice + totalGlassPrice + totalPartPrice;
              }
          }else{
              return '';
          }
          Console.groupEnd();
      }
  };
  Console.groupEnd();
  return filter;
});

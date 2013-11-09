define([
  // Standard Libs
  'Console'      // lib/console/console
  , 'Underscore' // lib/underscore/underscore

  // routing
  , 'routes/routes'

  // Application Controller
  , 'controllers/AppController'
  , 'controllers/HomeController'
  , 'controllers/PartController'
  , 'controllers/MaterialController'
  , 'controllers/WindowModelController'
  , 'controllers/WindowModelDetailController'
  , 'controllers/GlassController'
  , 'controllers/NeedMaterialController'
  , 'controllers/NeedGlassController'
  , 'controllers/NeedPartController'
  , 'controllers/AfterCalculateController'
  , 'controllers/BallController'
  , 'controllers/ColorController'
  , 'controllers/GrainController'
  , 'controllers/ContactListController'
], function (Console, _, routes, app
    ,home
    ,part
    ,material
    ,windowModel
    ,windowModelDetail
    ,glass
    ,needMaterial
    ,needGlass
    ,needPart
    ,afterCalculate
    ,ball
    ,color
    ,grain
    ,contactList) {
  "use strict";
  Console.group("Entering controllers module.");
  Console.info("AppController", app);

  var controllers = {
    home: home
      ,part:part
      ,material:material
      ,windowModel:windowModel
      ,windowModelDetail:windowModelDetail
      ,glass:glass
      ,needMaterial:needMaterial
      ,needGlass:needGlass
      ,needPart:needPart
      ,afterCalculate:afterCalculate
      ,ball:ball
      ,color:color
      ,grain:grain
      ,contactList:contactList
  };


  var setUpRoutes = function(angModule) {
    // hook up routing
    Console.group( 'Initializing navigation and routing.' );
    angModule.config(function($routeProvider){
      _.each(routes, function(value, key) {
        Console.debug("Adding ", key, ":", value);
        $routeProvider.when(
          value.route
          , {
            template: value.template
            , controller: value.controller
            , title: value.title
          }
        );
      });

        $routeProvider.when(
            '/home'
            , {
                templateUrl: 'templates/Home.html'
                , controller: home
                , title: '浩龙下料管理系统'
            }
        );

        $routeProvider.when(
            '/ballDetail/:ballId'
            , {
                templateUrl: 'templates/Home.html'
                , controller: home
                , title: '浩龙下料管理系统'
            }
        );


      $routeProvider.when(
          '/windowModelDetail/:windowModelId'
          , {
             templateUrl: 'templates/WindowModelDetail.html'
            , controller: windowModelDetail
            , title: '窗体详细信息'
          }
      );
      $routeProvider.when(
            '/calculate/:windowModelId/:height/:width/:interHeight/:quantity/:showWeight/:showPrice'
          , {
                templateUrl: 'templates/AfterCalculate.html'
                , controller: afterCalculate
                , title: '计算结果'
            }
      );
      $routeProvider.otherwise({ redirectTo: '/home' });
    });
    angModule.run(function($rootScope){
      $rootScope.$on('$routeChangeSuccess',function (next,last) {
        Console.debug("Navigating from ", last);
        Console.debug("Navigating to   ", next);
      });
    });
  }

  var initialize = function(angModule) {
    angModule.controller('AppController', app);
    _.each(controllers,function(controller,name){
      angModule.controller(name, controller);
    })
    setUpRoutes(angModule);
    Console.info("Registered Controllers: ", controllers);
  };


  Console.groupEnd();
  return {
    initialize: initialize
  };
});

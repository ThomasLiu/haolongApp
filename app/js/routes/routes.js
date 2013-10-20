define([
  'text!templates/Part.html'
  ,'text!templates/Material.html'
  ,'text!templates/WindowModel.html'
  ,'text!templates/Glass.html'
  ,'text!templates/Ball.html'
  ,'text!templates/Color.html'
  ,'text!templates/Grain.html'
],function(partTemplate,materialTemplate,windowModelTemplate,glassTemplate,ballTemplate,colorTemplate,grainTemplate){
  return {
    windowModel: {
          title: '窗型管理'
          , route: '/windowModel'
          , controller: 'windowModel'
          , template: windowModelTemplate
    }
    , glass: {
          title: '玻璃管理'
         , route: '/glass'
         , controller: 'glass'
         , template: glassTemplate
    }
    , part: {
          title: '配件管理'
          , route: '/part'
          , controller: 'part'
          , template: partTemplate
      }
    , material: {
          title: '铝材管理'
          , route: '/material'
          , controller: 'material'
          , template: materialTemplate
     }
    , ball: {
          title: '订单管理'
          , route: '/ball'
          , controller: 'ball'
          , template: ballTemplate
    }
    , color: {
          title: '颜色管理'
          , route: '/color'
          , controller: 'color'
          , template: colorTemplate
    }
      , grain: {
          title: '厘数管理'
          , route: '/grain'
          , controller: 'grain'
          , template: grainTemplate
      }
  };
})

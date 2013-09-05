define([
  ,'text!templates/Part.html'
  ,'text!templates/Material.html'
  ,'text!templates/WindowModel.html'
  ,'text!templates/Glass.html'
],function(partTemplate,materialTemplate,windowModelTemplate,glassTemplate){
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
          title: '框料管理'
          , route: '/material'
          , controller: 'material'
          , template: materialTemplate
     }
  };
})

import Ember from "ember"
const { $, Component } = Ember;

Component.reopen({
  didRender: function(){
    if(!$.AdminLTE.options.loadState)
      $.AdminLTE.init() 

    $.AdminLTE.initRender()
    this._super();
  }
})

export default {
  name: "adminLTE-theme",
  initialize: function(){
  }
}

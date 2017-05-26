import Ember from 'ember';

const {Component, $} = Ember;
export default Component.extend({
  classNames: ["content-wrapper"],
  showBreadcrumbs: false,
  didInsertElement: function(){
    var self = this;

    self.resizeElement();
    $(window).resize(function(){
      self.resizeElement()
    })
  },
  resizeElement: function(){
    var headHeight = $('.main-header').outerHeight();
    var footerHeight = $('.main-footer').outerHeight();
    var sidebar_height = $(".sidebar").height();
    
    var neg = headHeight + footerHeight
    var window_height = $(window).height();
    
    if ($("body").hasClass("fixed")) {
      this.setHeight(window_height - footerHeight)
    } else {
      this.setHeight(window_height >= sidebar_height ? (window_height - neg) : sidebar_height)
    }
  },
  setHeight: function(height){
    this.$().css('min-height', height);
  }
});

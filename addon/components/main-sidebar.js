import Ember from 'ember';

const { isEmpty, $, Component } = Ember;

export default Component.extend({
  tagName: 'aside',
  classNames: ['main-sidebar'],
  sidebarHeight: function(){
    return this.$(".sidebar").height();
  },

  didInsertElement: function(){
    var that = this;
    
    Ember.run.next(function(){
      that.treeMenu();
    });
  },


  treeMenu(){
    this.$(".sidebar li a").click(function(e){
      //Get the clicked link and the next element
      var $this = $(this);
      var checkElement = $this.next();

      if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
        //Close the menu
        checkElement.slideUp('normal', function () {
          checkElement.removeClass('menu-open');
        });
        checkElement.parent("li").removeClass("active");
      }
      else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
        //Get the parent menu
        var parent = $this.parents('ul').first();
        //Close all open menus within the parent
        var ul = parent.find('ul:visible').slideUp('normal');
        //Remove the menu-open class from the parent
        ul.removeClass('menu-open');
        //Get the parent li
        var parent_li = $this.parent("li");

        //Open the target menu and add the menu-open class
        checkElement.slideDown('normal', function () {
          //Add the class active to the parent li
          checkElement.addClass('menu-open');
          parent.find('li.active').removeClass('active');
          parent_li.addClass('active');
        });
      }
      if (checkElement.is('.treeview-menu')) {
        e.preventDefault();
      }
      if (isEmpty(checkElement)) {
        let $father = $this.parent();
        let $brother = $father.siblings();
        $brother.removeClass("active")
        $father.addClass("active")
      }
    });
  }
});

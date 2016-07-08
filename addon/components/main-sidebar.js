import Ember from 'ember';

const { computed, isBlank } = Ember;

export default Ember.Component.extend({
  tagName: 'aside',
  classNames: ['main-sidebar'],
  sidebarHeight: function(){
    return this.$(".sidebar").height();
  },
  
  routeName: computed("appRoute.controller.currentRouteName", function(){
    return this.get('appRoute.controller.currentRouteName')
  }),

  routeUrl: computed("appRoute.router.url", function(){
    return this.get("appRoute.router.url").replace(/\?.*/, "")
  }),

  urlChanged: function(){
    this.initSidebarByRoute()
  }.observes("appRoute.router.url"),

  didInsertElement: function(){
    var that = this;
    
    Ember.run.next(function(){
      that.treeMenu();
    });

    Ember.run.next( () => {
      this.initSidebarByRoute();
    })
  },

  initSidebarByRoute: function(){
    let that = this;
    let $navItems = this.$("li", ".sidebar");
    $navItems.removeClass("active");
    let currentUrl = that.get("routeUrl");
    let element = this.getActiveElement(currentUrl)
    if(element) this.activeCurrent(element)
  }.observes("routeUrl"),

  getActiveElement: function(currentUrl){
    let links = this.$("a", ".sidebar"),
      el = null;

    let elems = links.filter((i, elem) => {
      let url = ($(elem).attr("href") || "").replace("#", "");
      if(Em.isEmpty(url)) return false;
      if(url == currentUrl) el = elem
      return ~currentUrl.indexOf(url)
    }).sort(function(a, b){ 
      if(a == b) return 0
      return a < b ? 1 : -1
    })
    return (el ? el : elems[0])
  },

  initRouter(){
    let _name = this.get("appRoute.controller.currentRouteName");
    let _url = this.get("appRoute.router.url");
    this.set("routeName", _name);
    this.set("routeUrl", _url);
  },

  activeCurrent(element) {

    let that = this , navs = [];
    let isRoot = function(ele) { 
      return that.$(ele).parent().hasClass("sidebar-menu");
    };    
    while ( !isRoot(element) ){
      let father = that.$(element).parent();
      navs.push(father);
      element = father;
    }
    navs.push(element);
    $.each( navs ,(index, nav) => {
      nav.addClass("active");
    })

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
      if (Em.isEmpty(checkElement)) {
        let $father = $this.parent();
        let $brother = $father.siblings();
        $brother.removeClass("active")
        $father.addClass("active")
      }
    });
  }
});

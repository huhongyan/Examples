define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['headerBar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"navbar-header pull-left\">\r\n    <a class=\"navbar-brand\" href=\"#\">This is A LOGO</a><!--\r\n    --><a class=\"sidebar-collapse\" id=\"sidebar-collapse\" href=\"javascript:void(0);\">\r\n        <i class=\"collapse-icon fa fa-bars\"></i>\r\n    </a>\r\n</div>\r\n<ul class=\"nav navbar-right pull-right\">\r\n    <li><a href=\"#\"><i class=\"glyphicon glyphicon-envelope\"></i></a></li><!--\r\n    --><li class=\"dropdown\">\r\n        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"true\"><i class=\"glyphicon glyphicon-user\"></i><span class=\"caret\"></span></a>\r\n        <ul class=\"dropdown-menu\" role=\"menu\">\r\n            <li><a href=\"#\" class=\"glyphicon glyphicon-cog\"> Setting</a></li>\r\n            <li><a href=\"#\" class=\"glyphicon glyphicon-user\"> User</a></li>\r\n            <li class=\"divider\"></li>\r\n            <li><a href=\"#\" class=\"glyphicon glyphicon-log-out\"> Logout</a></li>\r\n        </ul>\r\n    </li>\r\n</ul>";
},"useData":true});
templates['leftNavbar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"navbar-search\">\r\n	<i class=\"glyphicon glyphicon-search\"></i>\r\n	<input type=\"search\" placeholder=\"Search...\" />\r\n</div>\r\n<div id=\"leftNavbarGroup\"></div>\r\n<div class=\"navbar-slider\"></div>";
},"useData":true});
templates['leftNavbarSubPanel'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"panel\">\r\n    <div class=\"panel-heading\" role=\"tab\" id=\"menus_"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\r\n        <a class=\"panel-title collapsed "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.subMenus : depth0),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-href=\""
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"collapse\" data-parent=\".panel-group\" href=\"#menus_"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "_content\" aria-expanded=\"true\" aria-controls=\"menus_"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "_content\"><i class=\""
    + alias4(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i><span class=\"menu-text\">&nbsp;&nbsp;"
    + alias4(container.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</span>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subMenus : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n        </a>\r\n    </div>\r\n    <ul id=\"menus_"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "_content\" class=\"panel-collapse collapse nav-left-sub\" role=\"tabpanel\" aria-labelledby=\"menus_"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.subMenus : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "alone";
},"4":function(container,depth0,helpers,partials,data) {
    return "<i class=\"glyphicon glyphicon-menu-down pull-right\"></i>";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li data-href=\""
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">\r\n            <a href=\"javascript:void(0);\"><span class=\"menu-text\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></a>\r\n        </li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"panel-group\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.menus : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['main'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<header class=\"navbar navbar-default navbar-static-top navbar-nav-top\"></header>\r\n<nav class=\"navbar-default navbar-nav-left navbar-collapse\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\" aria-expanded=\"false\">\r\n</nav>\r\n<section id=\"page-container\">\r\n    <iframe id=\"rightcontainer\" src=\"/Examples/pages/Index/welcome.html\" height=\"100%\" width=\"100%\" scrolling=\"auto\" frameborder=\"0\"></iframe>\r\n</section>";
},"useData":true});
return templates;
});

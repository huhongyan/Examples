"use strict";
require([
     "../../../requirejs_config"
], function(){
    require([
        "./js/views/mainView.js", 
        "bootstrap", 
        "require-css!pages/Index/css/index.css", 
        "require-css!Font-Awesome",
        "domReady!"
    ], function(MainView){
    	new MainView().render();
    });
});

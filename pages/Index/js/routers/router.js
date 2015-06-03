"use strict";
define([
  	"backbone"
], function(Backbone) {

    return Backbone.Router.extend({
    	routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.TodoFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			app.todos.trigger('filter');
		}
    });
}); 
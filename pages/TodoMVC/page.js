var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

(function($){
	'use strict';

	//todo model
	app.Todo = Backbone.Model.extend({
		defaults:{
			title:'',
			completed:false
		},

		toggle:function(){
			this.save({
				completed: !this.get('completed')
			});
		}
	});

	//todo collection
	var Todos = Backbone.Collection.extend({
		model:app.Todo,

		localStorage:new Backbone.LocalStorage('todos-backbone'),

		completed:function(){
			return this.where({completed: true});
		},

		remaining:function(){
			return this.where({completed: false});
		},

		nextOrder:function(){
			return  this.length ? this.last().get('order') + 1 : 1;
		},

		comparator:'order'
	});

	app.todos = new Todos();

	//todo item view
	app.TodoView = Backbone.View.extend({
		tagName:'li',

		template: _.template($('#item-template').html()),

		events:{
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'reverOnEscape',
			'blur .edit': 'close'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		render :function(){
			if(this.model.changed.id !== undefined){
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			this.toggleVisible();
			this.$input = this.$('.edit');

			return this;
		},

		toggleVisible: function(){
			this.$el.toggleClass('hidden', this.isHidden());
		},

		isHidden: function(){
			var isCompleted = this.model.get('completed');
			return ((!isCompleted && app.TodoFilter === 'completed') ||
				(isCompleted && app.TodoFilter === 'active'));
		},

		toggleCompleted:function(){
			this.model.toggle();
		},

		edit: function(){
			this.$el.addClass('editing');
			this.$input.focus();
		},

		close:function(){
			var value = this.$input.val();
			var trimmedValue = value.trim();

			if(!this.$el.hasClass('editing')){
				return;
			}

			if(trimmedValue){
				this.model.save({title: trimmedValue});

				if(value !== trimmedValue){//why?
					this.model.trigger('change');
				}
			}else{
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		updateOnEnter: function(e){
			if(e.which === ENTER_KEY){//IE用event.keCode
				this.close();
			}
		},

		reverOnEscape: function(e){
			if(e.which === ESC_KEY){
				this.$el.removeClass('editing');
				this.$input.val(this.model.get('title'));
			}
		},

		clear: function(){
			this.model.destroy();
		}
	});

	//app view
	app.AppView = Backbone.View.extend({

		 el: '#todoapp',

		 statsTemplate: _.template($('#stats-template').html()),

		 events:{
		 	'keypress #new-todo': 'createOnEnter',
		 	'click #clear-completed':'clearCompleted',
		 	'click #toggle-all':'toggleAllComplete'
		 },

		 initialize: function(){
		 	this.allCheckbox = this.$('#toggle-all')[0];
		 	this.$input = this.$('#new-todo');
		 	this.$footer = this.$('#footer');
		 	this.$main = this.$('#main');
		 	this.$list = $('#todo-list');

		 	this.listenTo(app.todos, 'add', this.addOne);
		 	this.listenTo(app.todos, 'reset', this.addAll);
		 	this.listenTo(app.todos, 'change:completed', this.filterOne);
		 	this.listenTo(app.todos, 'filter', this.filterAll);
		 	this.listenTo(app.todos, 'all', this.render);

		 	app.todos.fetch({reset: true});
		 },

		 render: function(){
		 	var completed = app.todos.completed().length;
		 	var remaining = app.todos.remaining().length;

		 	if(app.todos.length){
		 		this.$main.show();
		 		this.$footer.show();

		 		this.$footer.html(this.statsTemplate({
		 			completed: completed,
		 			remaining: remaining
		 		}));


		 		this.$('#filters li a')
		 			.removeClass('selected')
		 			.filter('[href="#/'+(app.TodoFilter || '')+'"]')
		 			.addClass('selected');
		 	}else{
		 		this.$main.hide();
		 		this.$footer.hide();
		 	}

		 	this.allCheckbox.checked = !remaining;
		 },

		 addOne: function(todo){
		 	var view = new app.TodoView({model: todo});
		 	this.$list.append(view.render().el);
		 },

		 addAll: function(){
		 	this.$list.html('');
		 	app.todos.each(this.addOne, this);
		 },

		 filterOne: function(todo){
		 	todo.trigger('visible');
		 },

		 filterAll: function(){
		 	app.todos.each(this.filterOne, this);
		 },

		 newAttributes: function(){
		 	return {
		 		title: this.$input.val().trim(),
		 		order: app.todos.nextOrder(),
		 		completed:false
		 	};
		 },

		 createOnEnter: function(e){
		 	if(e.which === ENTER_KEY && this.$input.val().trim()){
		 		app.todos.create(this.newAttributes());
		 		this.$input.val('');
		 	}
		 },

		 clearCompleted: function(){
		 	_.invoke(app.todos.completed(), 'destroy');
		 	return false;
		 },

		 toggleAllComplete: function(){
		 	var completed = this.allCheckbox.checked;

		 	app.todos.each(function(todo){
		 		todo.save({
		 			completed: completed
		 		});
		 	});
		 }
	});

	//todo router
	var TodoRouter = Backbone.Router.extend({
		routes:{
			'*filter':'setFilter'
		},

		setFilter:function(param){

			app.TodoFilter = param || '';

			//调用collection的event
			app.todos.trigger('filter');
		}
	});

	app.TodoRouter = new TodoRouter();
	Backbone.history.start();


	//kick things off by creating the `App`
	new app.AppView();

})(jQuery);
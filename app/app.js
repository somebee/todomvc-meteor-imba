(function(){
	var self = this;
	Todos = new Mongo.Collection("todos");
	
	if (Meteor.isServer) {
		
		Meteor.publish("todos",function() { return Todos.find(); });
		return Meteor.startup(function() { return self; });
	} else if (Meteor.isClient) {
		
		AllTodos = Todos.find();
		Meteor.subscribe("todos");
		return Meteor.startup(function() { return q$$('body').append(id$('app')); });
	};

})()
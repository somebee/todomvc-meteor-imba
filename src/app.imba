Todos = Mongo.Collection.new("todos")

if Meteor:isServer

	Meteor.publish "todos" do Todos.find
	Meteor.startup do self

elif Meteor:isClient

	AllTodos = Todos.find
	Meteor.subscribe "todos"
	Meteor.startup do $$(body).append(#app)
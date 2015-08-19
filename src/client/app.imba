var ESCAPE_KEY = 27
var ENTER_KEY = 13

tag new-todo-input < input

	def onkeydown e
		if e.which == ENTER_KEY
			#app.add value.trim
			value = ""

tag todo < li

	def model
		up(%app).model

	def commit
		render

	def render
		var todo = @object
		<self .completed=(todo:completed) >
			<div.view>
				<label :dblclick='edit'> "{todo:title}"
				<input@toggle type='checkbox' :change='toggle' checked=(todo:completed)>
				<button.destroy :tap='drop'>
			<input@input.edit type='text'>

	def edit
		@editing = yes
		flag(:editing)
		@input.value = object:title
		setTimeout(&,10) do @input.focus
		render # only need to render this

	def save
		#app.save(object)

	def drop
		Todos.remove(object.@id)

	def toggle e
		object:completed = @toggle.checked
		save

	def submit
		@editing = no
		unflag(:editing)

		if var title = @input.value.trim
			object:title = title
			save
		else
			drop(object)


	def onfocusout e
		submit if @editing

	def cancel
		@editing = no
		unflag(:editing)
		@input.blur
		render

	# onkeydown from inner element cascade through
	def onkeydown e
		e.halt
		submit if e.which == ENTER_KEY
		cancel if e.which == ESCAPE_KEY

tag #app

	def hash
		window:location:hash

	def awaken
		render
		setInterval(&, 1000 / 30) do render
		self

	def dirty
		self

	def add title
		if title.trim
			Todos.insert(title: title.trim, completed: false)
		self
		
	def toggle todo
		todo:completed = !todo:completed
		save(todo)

	def toggleAll e
		AllTodos.map do |todo|
			todo:completed = e.target.checked
			save(todo)
		self

	def save todo
		Todos.update(todo.@id,$set: {
			title: todo:title,
			completed: todo:completed
		})

		return self
	
	# remove all completed todos
	def clear
		AllTodos.forEach do |todo| Todos.remove(todo.@id) if todo:completed
		$$(.toggle-all).checked = no

	def render
		# converting to plain array - returns new todos every time?
		var all    = AllTodos.map do |todo| todo
		var active = all.filter do |todo| !todo:completed
		var done   = all.filter do |todo| todo:completed

		var items  = {'#/completed': done, '#/active': active}[hash] or all		

		<self>
			<header.header>
				<h1> "todos"
				<new-todo-input.new-todo type='text' placeholder='What needs to be done?'>

			if all:length > 0
				<section.main>
					<input.toggle-all type='checkbox' :change='toggleAll'>
					<ul.todo-list>
						for todo in items
							<todo[todo]@{todo.@id}>

				<footer.footer>
					<span.todo-count>
						<strong> "{active:length} "
						active:length == 1 ? 'item left' : 'items left'

					<ul.filters>
						<li> <a .selected=(items == all)    href='#/'> 'All'
						<li> <a .selected=(items == active) href='#/active'> 'Active'
						<li> <a .selected=(items == done)   href='#/completed'> 'Completed'

					if done:length > 0
						<button.clear-completed :tap='clear'> 'Clear completed'

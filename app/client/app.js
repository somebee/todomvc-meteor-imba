(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	Imba.defineTag('new_todo_input','input', function(tag){
		
		tag.prototype.onkeydown = function (e){
			var v_;
			if (e.which() == ENTER_KEY) {
				id$('app').add(this.value().trim());
				return (this.setValue(v_=""),v_);
			};
		};
	});
	
	Imba.defineTag('todo','li', function(tag){
		
		tag.prototype.model = function (){
			return this.up(q$('._app',this)).model();
		};
		
		tag.prototype.commit = function (){
			return this.render();
		};
		
		tag.prototype.render = function (){
			var t0;
			var todo = this._object;
			return this.flag('completed',(todo.completed)).setChildren(Imba.static([
				(t0 = this.$a || (this.$a = t$('div').flag('view'))).setContent(Imba.static([
					(t0.$$a = t0.$$a || t$('label').setHandler('dblclick','edit',this)).setText(("" + (todo.title))).end(),
					(this._toggle = this._toggle || t$('input').setRef('toggle',this).setType('checkbox').setHandler('change','toggle',this)).setChecked((todo.completed)).end(),
					(t0.$$c = t0.$$c || t$('button').flag('destroy').setHandler('tap','drop',this)).end()
				],1)).end(),
				(this._input = this._input || t$('input').setRef('input',this).flag('edit').setType('text')).end()
			],1)).synced();
		};
		
		tag.prototype.edit = function (){
			var self=this;
			this._editing = true;
			this.flag('editing');
			this._input.setValue(this.object().title);
			setTimeout(function() { return self._input.focus(); },10);
			return self.render(); // only need to render this
		};
		
		tag.prototype.save = function (){
			return id$('app').save(this.object());
		};
		
		tag.prototype.drop = function (){
			return Todos.remove(this.object()._id);
		};
		
		tag.prototype.toggle = function (e){
			this.object().completed = this._toggle.checked();
			return this.save();
		};
		
		tag.prototype.submit = function (){
			var title;
			this._editing = false;
			this.unflag('editing');
			
			if (title = this._input.value().trim()) {
				this.object().title = title;
				return this.save();
			} else {
				return this.drop(this.object());
			};
		};
		
		
		tag.prototype.onfocusout = function (e){
			if (this._editing) { return this.submit() };
		};
		
		tag.prototype.cancel = function (){
			this._editing = false;
			this.unflag('editing');
			this._input.blur();
			return this.render();
		};
		
		// onkeydown from inner element cascade through
		tag.prototype.onkeydown = function (e){
			e.halt();
			if (e.which() == ENTER_KEY) this.submit();
			if (e.which() == ESCAPE_KEY) { return this.cancel() };
		};
	});
	
	Imba.defineSingletonTag('app', function(tag){
		
		tag.prototype.hash = function (){
			return window.location.hash;
		};
		
		tag.prototype.awaken = function (){
			var self=this;
			self.render();
			setInterval(function() { return self.render(); },1000 / 30);
			return self;
		};
		
		tag.prototype.dirty = function (){
			return this;
		};
		
		tag.prototype.add = function (title){
			if (title.trim()) {
				Todos.insert({title: title.trim(),completed: false});
			};
			return this;
		};
		
		tag.prototype.toggle = function (todo){
			todo.completed = !todo.completed;
			return this.save(todo);
		};
		
		tag.prototype.toggleAll = function (e){
			var self=this;
			AllTodos.map(function(todo) {
				todo.completed = e.target().checked();
				return self.save(todo);
			});
			return self;
		};
		
		tag.prototype.save = function (todo){
			Todos.update(todo._id,{$set: {
				title: todo.title,
				completed: todo.completed
			}});
			
			return this;
		};
		
		// remove all completed todos
		tag.prototype.clear = function (){
			AllTodos.forEach(function(todo) { if (todo.completed) { return Todos.remove(todo._id) }; });
			return (q$$('.toggle-all').setChecked(false),false);
		};
		
		tag.prototype.render = function (){
			// converting to plain array - returns new todos every time?
			var t0, self=this, t1, t2;
			var all = AllTodos.map(function(todo) { return todo; });
			var active = all.filter(function(todo) { return !todo.completed; });
			var done = all.filter(function(todo) { return todo.completed; });
			
			var items = {'#/completed': done,'#/active': active}[this.hash()] || all;
			
			return this.setChildren(Imba.static([
				(t0 = this.$a || (this.$a = t$('header').flag('header'))).setContent(Imba.static([
					(t0.$$a = t0.$$a || t$('h1')).setText("todos").end(),
					(t0.$$b = t0.$$b || t$('new_todo_input').flag('new-todo').setType('text').setPlaceholder('What needs to be done?')).end()
				],1)).end(),
				
				(all.length > 0) && (Imba.static([
					(t0 = self.$b || (self.$b = t$('section').flag('main'))).setContent(Imba.static([
						(t0.$$a = t0.$$a || t$('input').flag('toggle-all').setType('checkbox').setHandler('change','toggleAll',this)).end(),
						(t1 = t0.$$b || (t0.$$b = t$('ul').flag('todo-list'))).setContent((function(t1) {
							for (var i=0, ary=iter$(items), len=ary.length, todo, res=[]; i < len; i++) {
								todo = ary[i];
								res.push((t1['_' + todo._id] = t1['_' + todo._id] || t$('todo')).setObject(todo).end());
							};
							return res;
						})(t1)).end()
					],1)).end(),
					
					(t0 = self.$c || (self.$c = t$('footer').flag('footer'))).setContent(Imba.static([
						(t1 = t0.$$a || (t0.$$a = t$('span').flag('todo-count'))).setContent(Imba.static([
							(t1.$$a = t1.$$a || t$('strong')).setText(("" + (active.length) + " ")).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1)).end(),
						
						(t1 = t0.$$b || (t0.$$b = t$('ul').flag('filters'))).setContent(Imba.static([
							(t2 = t1.$$a || (t1.$$a = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/')).flag('selected',(items == all)).setText('All').end()).end(),
							(t2 = t1.$$b || (t1.$$b = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/active')).flag('selected',(items == active)).setText('Active').end()).end(),
							(t2 = t1.$$c || (t1.$$c = t$('li'))).setContent((t2.$$a = t2.$$a || t$('a').setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end()).end()
						],1)).end(),
						
						(done.length > 0) && (
							(t0.$$c = t0.$$c || t$('button').flag('clear-completed').setHandler('tap','clear',self)).setText('Clear completed').end()
						)
					],1)).end()
				],2))
			],1)).synced();
		};
	});

})()
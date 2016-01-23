(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	tag$.defineTag('new-todo-input', 'input', function(tag){
		
		tag.prototype.onkeydown = function (e){
			var v_;
			if (e.which() == ENTER_KEY) {
				id$('app').add(this.value().trim());
				return (this.setValue(v_ = ""),v_);
			};
		};
	});
	
	tag$.defineTag('todo', 'li', function(tag){
		
		tag.prototype.model = function (){
			return this.up(q$('._app',this)).model();
		};
		
		tag.prototype.commit = function (){
			return this.render();
		};
		
		tag.prototype.render = function (){
			var t0, t1;
			var todo = this._object;
			return this.flag('completed',(todo.completed)).setChildren([
				(t0 = this.$a=this.$a || tag$.$div().flag('view')).setContent([
					(t1 = t0.$$a=t0.$$a || tag$.$label().setHandler('dblclick','edit',this)).setContent(("" + (todo.title)),3).end(),
					(this._toggle = this._toggle || tag$.$input().setRef('toggle',this).setType('checkbox').setHandler('change','toggle',this)).setChecked((todo.completed)).end(),
					(t0.$$c = t0.$$c || tag$.$button().flag('destroy').setHandler('tap','drop',this)).end()
				],2).end(),
				(this._input = this._input || tag$.$input().setRef('input',this).flag('edit').setType('text')).end()
			],2).synced();
		};
		
		tag.prototype.edit = function (){
			var self = this;
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
	
	return tag$.defineTag('#app', function(tag){
		
		tag.prototype.hash = function (){
			return window.location.hash;
		};
		
		tag.prototype.awaken = function (){
			var self = this;
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
			var self = this;
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
			var t0, t1, self = this, t2, t3, t4, t5, t6, t7, t8, t9;
			var all = AllTodos.map(function(todo) { return todo; });
			var active = all.filter(function(todo) { return !todo.completed; });
			var done = all.filter(function(todo) { return todo.completed; });
			
			var items = {'#/completed': done,'#/active': active}[this.hash()] || all;
			
			return this.setChildren([
				(t0 = this.$a=this.$a || tag$.$header().flag('header')).setContent([
					(t0.$$a = t0.$$a || tag$.$h1()).setText("todos").end(),
					(t0.$$b = t0.$$b || tag$.$new_todo_input().flag('new-todo').setType('text').setPlaceholder('What needs to be done?')).end()
				],2).end(),
				
				(all.length > 0) ? (Imba.static([
					(t1 = self.$b=self.$b || tag$.$section().flag('main')).setContent([
						(t1.$$a = t1.$$a || tag$.$input().flag('toggle-all').setType('checkbox').setHandler('change','toggleAll',this)).end(),
						(t2 = t1.$$b=t1.$$b || tag$.$ul().flag('todo-list')).setContent(
							(function(t2) {
								for (var i = 0, ary = iter$(items), len = ary.length, todo, res = []; i < len; i++) {
									todo = ary[i];
									res.push((t2['_' + todo._id] = t2['_' + todo._id] || tag$.$todo()).setObject(todo).end());
								};
								return res;
							})(t2)
						,3).end()
					],2).end(),
					
					(t3 = self.$c=self.$c || tag$.$footer().flag('footer')).setContent([
						(t4 = t3.$$a=t3.$$a || tag$.$span().flag('todo-count')).setContent([
							(t5 = t4.$$a=t4.$$a || tag$.$strong()).setContent(("" + (active.length) + " "),3).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1).end(),
						
						(t6 = t3.$$b=t3.$$b || tag$.$ul().flag('filters')).setContent([
							(t7 = t6.$$a=t6.$$a || tag$.$li()).setContent((t7.$$a = t7.$$a || tag$.$a().setHref('#/')).flag('selected',(items == all)).setText('All').end(),2).end(),
							(t8 = t6.$$b=t6.$$b || tag$.$li()).setContent((t8.$$a = t8.$$a || tag$.$a().setHref('#/active')).flag('selected',(items == active)).setText('Active').end(),2).end(),
							(t9 = t6.$$c=t6.$$c || tag$.$li()).setContent((t9.$$a = t9.$$a || tag$.$a().setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end(),2).end()
						],2).end(),
						
						(done.length > 0) ? (
							(t3.$$c = t3.$$c || tag$.$button().flag('clear-completed').setHandler('tap','clear',self)).setText('Clear completed').end()
						) : void(0)
					],1).end()
				],2)) : void(0)
			],1).synced();
		};
	});

})()
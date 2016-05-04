

/**
 * An implementation for idiomatic React.js classes that mix with
 * Reflux stores. To utilize extend Reflux.Component instead of
 * React.Component. Then you may hook any Reflux store that has a
 * `this.state` property containing its state values to the component
 * via `this.store` or an Array of Reflux stores via `this.stores` in
 * the component's constructor (similar to how you assign initial state
 * in the constructor in ES6 style React). The default values of the
 * stores will automaticall reflect in the component's state, and any
 * further `trigger` calls from that store will update properties passed
 * in the trigger into the component automatically.
 */


var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) {
		if (b.hasOwnProperty(p)) {
			d[p] = b[p];
		}
	}
    function __() {
		this.constructor = d;
	}
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/* globals Reflux: false */

/**
 * Also adds a `Reflux.defineReact` function where you can manually supply
 * the React object in order to create in case Reflux needs to load before
 * React or there is a modular environment where there won't be a global
 * React variable.
 */
function defineReact(react, reflux)
{
	var rflx;
	
	try {
		rflx = reflux || Reflux;
	} catch (e) {
		return;
	}
	
	if (rflx && react && react.Component)
	{
		var RefluxComponent = function(props) {
			_super.call(this, props);
		};
		
		var _super = react.Component;
		__extends(RefluxComponent, _super);
		
		RefluxComponent.prototype.componentWillMount = function () {
			if (this.store) {
				if (Array.isArray(this.stores)) {
					this.stores.unshift(this.store);
				} else {
					this.stores = [this.store];
				}
			}
			if (this.stores) {
				this.__storeunsubscribes__ = [];
				for (var i = 0, ii = this.stores.length; i < ii; i++) {
					this.__storeunsubscribes__.push(this.stores[i].listen(this.setState.bind(this)));
					this.setState(this.stores[i].state);
				}
			}
			else {
				throw new Error('Extending Reflux.Component requires you to set either this.store or this.stores in the constructor.');
			}
		};
		
		RefluxComponent.prototype.componentWillUnmount = function () {
			for (var i = 0, ii = this.__storeunsubscribes__.length; i < ii; i++) {
				this.__storeunsubscribe__[i]();
			}
		};
		
		rflx.Component = RefluxComponent;
	}
}

module.exports = defineReact;


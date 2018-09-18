const NOT = (x) => !x
const EQUAL = (x, y) => x == y
const NOT_EQUAL = (x, y) => NOT(EQUAL(x, y))
const BIGGER_THAN = (x, y) => x > y
const LOWER_THAN = (x, y) => x < y
const OR = (x, y) => x || y
const AND = (x, y) => x && y
const BIGGER_OR_EQUAL_THAN = (x, y) => OR( BIGGER_THAN(x, y), EQUAL(x, y) )
const LOWER_OR_EQUAL_THAN = (x, y) => OR( LOWER_THAN(x, y), EQUAL(x, y) )


export interface HippoConfig {
	methods?: any,
	variables?: any,
	variablePrefix?: string,
	methodPrefix?: string,
	variableResolver?: Function
}

const DEFAULT_CONFIG: HippoConfig = {
	methods: {
		'eq': EQUAL,
		'neq': NOT_EQUAL,
		'not': NOT,
		'bt': BIGGER_THAN,
		'bte' : BIGGER_OR_EQUAL_THAN,
		'lt' : LOWER_THAN,
		'lte' : LOWER_OR_EQUAL_THAN,
		'and' : AND,
		'or': OR
	},
	variables: {
	},
	variablePrefix: '$',
	methodPrefix: '@',
}

export default class Hippo {

	config: HippoConfig
	_variableResolver: Function
	_methods = {}
	_variables = {}

	constructor(config?: HippoConfig) {
		this._configure(config)
	}
	
	_configure(config: HippoConfig = {}) {
		
		this.config = { 
			variablePrefix: config.variablePrefix || DEFAULT_CONFIG.variablePrefix,
			methodPrefix: config.methodPrefix || DEFAULT_CONFIG.methodPrefix,
			variables: {
				...DEFAULT_CONFIG.variables,
				...( config.variables || {} )
			},
			methods: {
				...DEFAULT_CONFIG.methods,
				...( config.methods || {} )
			}
		}

		this._variableResolver = config.variableResolver || ( (x) => x )

		this._methods = {}
		for( const name in this.config.methods ) {
			this.registerMethod( name, this.config.methods[name] )
		}
		
		this._variables = {}
		for( const name in this.config.variables ) {
			this.registerVariable( name, this.config.variables[name] )
		}
	}

	registerMethod(name, fn){
	
		this._methods[ this.config.methodPrefix + name ] = fn
	}	
	
	executeMethod( name, args ) {

		if( !this._methods[name] ) {
			throw new Error('Method not defined: '+ name)
		}

		return this._methods[ name ]( ...args )
	}
	
	isMethod(fragment) {
		
		return fragment.charAt(0) === this.config.methodPrefix
	}
	
	isVariable(fragment) {
		
		return fragment.charAt(0) === this.config.variablePrefix
	}
	
	registerVariable(name, value){
		
		this._variables[ this.config.variablePrefix + name ] = value
	}

	resolveVariable(name) {
		
		let result = this._variableResolver(name) 
		if( name != result ) {
			return result
		}

		if( this._variables[name] ) {
			return this._variables[name]
		}

		throw new Error('Variable not defined: ' + name)
	}
	
	exec( expression ) {
		
		const stack = new Array()
		
		for( const fragment of expression ) {
			let resolvedFragment = fragment
			
			if( fragment instanceof Array ) {
				resolvedFragment = this.exec( fragment )
			}

			if( typeof fragment === 'string' ) {
				
				if( this.isMethod(fragment) ) {
					const args = Array.from(stack)
					stack.splice(0, stack.length)
					return this.executeMethod(fragment, args)
				}

				if( this.isVariable(fragment) ) {
					resolvedFragment = this.resolveVariable(fragment)
				}
			}

			stack.push(resolvedFragment)
		}

		throw new Error( 'You forgotted the required operation @method' )

	}

}
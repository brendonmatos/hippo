
import * as assert from 'assert'
import Hippo from './index'

describe('Hippo expressions', () => {

	it('The return from function should be true', () => {
		const vm = new Hippo()
		const result = vm.exec( [ true, true, '@eq' ] )
		assert.equal( result , true )
	})


	it('The return from function should be false', () => {
		const vm = new Hippo()
		const result = vm.exec( [ true, true, '@neq' ] )
		assert.equal( result , false )
	})


	it('The return from function should be true', () => {
		const vm = new Hippo()
		const result = vm.exec( [ 1, 0, '@neq' ] )
		assert.equal( result , true )
	})

	it('The return from function should be true', () => {
		const vm = new Hippo()
		const result = vm.exec( [ 1, 0, '@neq' ] )
		assert.equal( result , true )
	})


	it('The return from function should be true', () => {
		const vm = new Hippo()
		const bt = [35,30,"@bt"]
		const lt = [35,60,"@lt"]


		const result = vm.exec([
			bt,
			lt,
			"@and"
		])
		assert.equal( result , true )
	})


	it('The return from function should be true', () => {
		
		const hippoConfig = {
			variableResolver: (name) => {
				if( name === '$number' ) {
					return number
				}
			}
		}

		const number = 30000
		const vm = new Hippo(hippoConfig)
		const bt = ['$number',30,"@bt"]

		const result = vm.exec(bt)
		assert.equal( result , true )
	})

	it('The return from function should be 27', () => {
		
		const hippoConfig = {
			variableResolver: (name) => {
				if( name === '$number' ) {
					return number
				}
			},
			methods: {
				'multiply': (x, y) => x * y 
			}
		}

		const number = 3
		const vm = new Hippo(hippoConfig)

		const bt = ['$number',9,"@multiply"]

		const result = vm.exec(bt)
		assert.equal( result , 27 )
	})

	it('The return from function should not be 27', () => {
		
		const hippoConfig = {
			variableResolver: (name) => {
				if( name === '$number' ) {
					return number
				}
			},
			methods: {
				'multiply': (x, y) => x * y 
			}
		}

		const number = 3
		const vm = new Hippo(hippoConfig)
		const bt = ['$number',30,"@multiply"]

		const result = vm.exec(bt)
		assert.notEqual( result , 27 )
	})
	
	it('The return from function should be 27', () => {
		
		const hippoConfig = {
			variablePrefix: '%',
			variableResolver: (name) => {
				if( name === '%number' ) {
					return number
				}
			},
			methods: {
				'multiply': (...args) => args[0] * args[1] 
			}
		}

		const number = 3
		const vm = new Hippo(hippoConfig)
		const bt = ['%number',9,"@multiply"]

		const result = vm.exec(bt)
		assert.equal( result , 27 )
	})
	
	it('The return from function should be "Brendon"', () => {
	
		const vm = new Hippo()
		vm.exec([
			[
			'Brendon',
			'foo',
			'@set'
			]
		])
		assert.equal( vm.exec('$foo'), 'Brendon' )
		assert.equal( vm.exec(['$foo', '@get']), 'Brendon' )
	})

	it('The return from function should be "BrendonBrendon"', () => {
	
		const vm = new Hippo({
			methods: {
				'concat': (x, y) => [x, y].join('') 
			}
		})
		vm.exec([
			[
				'Brendon',
				'foo',
				'@set'
			],
			[
				[
					'$foo',
					'$foo',
					'@concat'
				],
				'concatenated', 
				'@set'
			]
		])
		assert.equal( vm.exec('$foo'), 'Brendon' )
		assert.equal( vm.exec(['$foo', '@get']), 'Brendon' )
		assert.equal( vm.exec('$concatenated'), 'BrendonBrendon' )
		assert.equal( vm.exec(['$concatenated', '@get']), 'BrendonBrendon' )
	})
	// it('The return from function should be v1.0.0', () => {
		
	// 	const hippoConfig = {
	// 		methods: {
	// 			'parse_version': (x) => 'v'+x 
	// 		},
	// 		variables: {
	// 			'version': package_json.version
	// 		}
	// 	}

	// 	const vm = new Hippo(hippoConfig)
	// 	const version = ['$version',"@parse_version"]

	// 	const result = vm.exec(version)
	// 	assert.equal( result , 'v1.0.0' )
	// })

})
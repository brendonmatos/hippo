import Hippo from '../index';

const vm = new Hippo({
	variables: {
		'lucky_number': 3
	},
	methods: {
		'pick_random': ( ...args ) => args[ Math.floor(Math.random() * (args.length - 1)) + 0 ],
		'is_between': ( value, min, max ) => value > min && value < max,
		'if_else': ( condition, valueIfTrue, valueIfFalse ) => condition && valueIfTrue || valueIfFalse
	}
})

vm.exec(
	[ 
		[ 3, 4, 5, 7, 2, 1, '@pick_random' ], 
		'random_pick', 
		'@set'
	]
)

vm.exec(
	[ 
		[ '$random_pick', '$lucky_number', "@eq"],
		'is_my_number', 
		'@set'
	] 
)

console.log( '$is_my_number:', vm.exec('$is_my_number') )
console.log( '$random_pick:', vm.exec('$random_pick') )
console.log( '$lucky_number:', vm.exec('$lucky_number') )
console.log( 'vars dump', vm.dump() )

const result = vm.exec( [ '$is_my_number', 'You are lucky!', 'Não foi dessa vez', '@if_else' ] )

console.log(result) // Super position variable 
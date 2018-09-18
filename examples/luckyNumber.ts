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

const random_pick_expression = [ '3', '5', '7', '@pick_random' ]
const is_my_lucky_number =  [ random_pick_expression, '$lucky_number', "@eq"]
const result = vm.exec( [ is_my_lucky_number, 'You are lucky!', 'Não foi dessa vez', '@if_else' ] )

console.log(result) // Super position variable 
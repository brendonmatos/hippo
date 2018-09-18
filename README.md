# hippo
Client side secure eval

## Installing

```
  npm install --save hippo-interpreter
```

### Usage

```javascript
  //const Hippo = require('hippo-interpreter').default
  import Hippo from 'hippo-interpreter'
  const vm = new Hippo()
  const result = vm.exec( [ 40, 30, "@bt"] )
  console.log(result) // true
```

## Define methods

```javascript
  const vm = new Hippo({
    methods: {
      'times': (x, y) => x * y
    }
  })
  // the 3 will be the x
  // the 9 will be the y
  const result = vm.exec( [ 3, 9, "@times"] )
  console.log(result) // 27
```

## Define variables

```javascript
  const vm = new Hippo({
    variables: {
      'year': 2018
    }
  })
  const result = vm.exec( [ '$year', 2017, "@bt"] )
  console.log(result) // true
```

## Complex expressions

### Sub expressions

```javascript
  const vm = new Hippo({
    variables: {
      'date_now': Date.now()
    },
    methods: {
      'subtract': ( x, y ) => x - y
    }
  })
  const result = vm.exec( [ '$date_now', [ '$date_now', 1000, '@subtract' ], "@bt"] )
  console.log(result) // Date.now() - 1000 '-'
```

### Random variable

```javascript
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
  const fragment = [ is_my_lucky_number, 'You are lucky!', 'Não foi dessa vez', '@if_else' ]
  const result = vm.exec( fragment )
  console.log(result) // Super position variable
```

## Basic methods

- `@lt`: LOWER THAN  
- `@lte`: LOWER THAN OR EQUAL
- `@gt`: GREATHER THAN  
- `@gte`: GREATHER THAN OR EQUAL
- `@eq`: EQUAL
- `@neq`: NOT EQUAL
- `@and`: AND
- `@not`: NOT

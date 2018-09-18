# hippo
Client side secure eval
Parametrize your front-end logic

## Installing

```
  npm install --save hippo-interpreter
```

### Usage

```javascript
  //const Hippo = require('hippo-interpreter').default
  import Hippo from 'hippo-interpreter'
  const vm = new Hippo()
  const result = vm.exec( [ 40, 30, "@bt"] ) // 40 > 30
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
  const result = vm.exec( [ 3, 9, "@times"] ) // 3 * 9
  console.log(result) // 27
```

## Define variables

```javascript
  const vm = new Hippo({
    variables: {
      'year': 2018
    }
  })
  const result = vm.exec( [ '$year', 2017, "@bt"] ) // 2018 > 2017
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
  const result = vm.exec( [ '$date_now', [ '$date_now', 1000, '@subtract' ], "@bt"] ) // Date.now() > ( Date.now() - 1000) '-'
  console.log(result) // true ;
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
- `@set`: Create an variable `[ anyValue, 'variableName', '@set' ]`
- `@get`: GET VALUE

### Checklist

 - [x] attach plugins
 - [ ] more basic methods
 - [ ] improve types
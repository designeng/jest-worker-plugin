const wire = require('wire');
const Benchmark = require('benchmark');

const fibonacci = require('../test/math/fibonacci')

const spec = require('../test/spec');
const specWithPromiseAll = require('./specWithPromiseAll');

const suite = new Benchmark.Suite;

function runSpecWithWorkers() {
    return wire(spec);
}

function runSpecWithPromiseAll() {
    return wire(specWithPromiseAll);
}

suite
// .add('Workers', runSpecWithWorkers)
// .add('Promise.all', runSpecWithPromiseAll)

.add('Workers', () => {
    return fibonacci(20);
})
.add('Promise.all', () => {
    return fibonacci(10);
})

.on('cycle', (event) => {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})

.run({ 'async': true });

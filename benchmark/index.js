const wire = require('wire');
const Benchmark = require('benchmark');

const JestWorkerPlugin = require('..');
const fibonacci = require('../test/math/fibonacci');

const suite = new Benchmark.Suite;

const NUM = 20;

wire({
    $plugins: [
        JestWorkerPlugin
    ],

    worker: {
        createJestWorker: {
            workerPath: __dirname + '/../test/workers/index.js',
            workerOptions: {
                exposedMethods: [
                    'init',
                    'calculate'
                ],
                numWorkers: 4,
                maxRetries: 10,
                forkOptions: {
                    silent: false
                }
            },
            additionalOptions: {
                initImmediately: true
            }
        }
    },

    runWorkersFn: {
        create: {
            module: (worker) => function runWorkersFn() {
                return Promise.all([
                    worker.calculate(NUM),
                    worker.calculate(NUM),
                    worker.calculate(NUM),
                    worker.calculate(NUM),
                ])
            },
            args: [
                {$ref: 'worker'}
            ]
        }
    },

    runPromiseAllFn: {
        create: {
            module: () => function runPromiseAllFn() {
                return Promise.all([
                    fibonacci(NUM),
                    fibonacci(NUM),
                    fibonacci(NUM),
                    fibonacci(NUM),
                ])
            },
            args: []
        }
    }
}).then(context => {
    const {
        runWorkersFn,
        runPromiseAllFn,
    } = context;

    suite
        .add('Workers', runWorkersFn)
        .add('Promise.all', runPromiseAllFn)

        .on('cycle', (event) => {
            console.log(String(event.target));
        })
        .on('complete', function() {
            console.log('Fastest is ' + this.filter('fastest').map('name'));

            context.destroy().then(process.exit);
        })

        .run({ 'async': true });
})

const wire = require('wire');
const JestWorkerPlugin = require('..');

wire({
    $plugins: [
        JestWorkerPlugin
    ],

    worker: {
        createJestWorker: {
            workerPath: __dirname + '/workers/index.js',
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

    result: {
        create: {
            module: (worker) => {
                return worker.calculate(50)
            },
            args: [
                {$ref: 'worker'}
            ]
        }
    },

    holdWiring: {
        create: {
            module: () => {
                return new Promise(resolve => {
                    setTimeout(resolve, 10000);
                })
            },
            args: [
                {$ref: 'worker'}
            ]
        }
    }
}).then(context => {
    const { result } = context;

    console.log('DONE', result);

    context.destroy();
}).catch(error => {
    console.log('Went wrong:', error);
})

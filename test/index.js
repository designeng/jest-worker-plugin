const wire = require('wire');
const _ = require('underscore');
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
                return worker.calculate(10)
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
                    setTimeout(resolve, 1000);
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

    const closeUp = async () => {
        context.destroy().then(() => {
            _.delay(process.exit, 1000, 0);
        });
    }

    // closeUp();

    process.on('SIGINT', closeUp);
}).catch(error => {
    console.log('Went wrong:', error);
})

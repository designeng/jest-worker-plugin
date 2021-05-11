const t = require('tap');
const wire = require('wire');
const _ = require('underscore');
const JestWorkerPlugin = require('..');

const NUM = 20;

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
                return Promise.all([
                    worker.calculate(NUM),
                    worker.calculate(NUM),
                    worker.calculate(NUM),
                    worker.calculate(NUM),
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
    }
}).then(context => {
    const { result } = context;

    t.ok(result);

    const closeUp = async () => {
        context.destroy().then(() => {
            _.delay(process.exit, 1000, 0);
        });
    }

    closeUp();

    process.on('SIGINT', closeUp);
}).catch(error => {
    console.log('Went wrong:', error);
})

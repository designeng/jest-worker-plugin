const JestWorkerPlugin = require('..');

const NUM = 20;

module.exports = {
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
                ])
            },
            args: [
                {$ref: 'worker'}
            ]
        }
    }
}

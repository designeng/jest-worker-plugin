## Jest-worker plugin for wire.js

## Installation
`npm i jest-worker-plugin`

## Usage
Install wire from `git://github.com/cujojs/wire.git#0.10.11`

```
const wire = require('wire');
const JestWorkerPlugin = require('jest-worker-plugin');

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
                return worker.calculate(8)
            },
            args: [
                {$ref: 'worker'}
            ]
        }
    }
})
```

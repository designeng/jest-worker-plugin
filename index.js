const JestWorker = require('jest-worker').default;

module.exports = function JestWorkerPlugin(options) {
    const workers = {};

    function closeWorkers() {
        var keys = Object.keys(workers);
        return Promise.all(keys.map(key => {
            return workers[key].end();
        }))
    }

    function createJestWorker({ resolve, reject }, compDef, wire) {
        wire(compDef.options).then(async options => {
            var { workerPath, workerOptions, additionalOptions } = options;
            workerOptions = workerOptions || {};
            additionalOptions = additionalOptions || {
                initImmediately: false
            };

            const { forkOptions } = workerOptions;

            var worker = new JestWorker(require.resolve(workerPath), workerOptions);

            if(forkOptions && forkOptions.silent === false) {
                var data = '';

                const readableStream = worker.getStdout();

                readableStream.on('data', (chunk) => {
                    data += chunk;
                })

                readableStream.on('end', () => {
                    console.log(data);
                });

                readableStream.on('error', (error) => {
                    console.error('[JestWorker error]', error);
                });
            }

            workers[workerPath] = worker;

            if(additionalOptions.initImmediately) {
                var i = 0,
                    initPromises = [];

                while(i < workerOptions.numWorkers) {
                    initPromises.push(worker.init());
                    i++;
                }
                await Promise.all(initPromises);
            }

            resolve(worker);
        })
    }

    return {
        factories: {
            createJestWorker
        },
        context: {
            shutdown: (resolver, wire) => {
                resolver.resolve(closeWorkers());
            },
            error: (resolver, wire, err) => {
                resolver.resolve(closeWorkers());
            }
        }
    }
}

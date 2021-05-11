const fibonacci = require('../test/math/fibonacci')

const NUM = 20;

module.exports = {
    $plugins: [
    ],

    result: {
        create: {
            module: () => {
                return Promise.all([
                    fibonacci(NUM),
                    fibonacci(NUM),
                    fibonacci(NUM),
                    fibonacci(NUM),
                ])
            },
            args: [
            ]
        }
    }
}

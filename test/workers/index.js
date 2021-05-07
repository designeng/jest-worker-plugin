const fibonacci = require('../math/fibonacci')

function init() {
    /* init silently */
    console.log('INIT', process.pid);
}

function calculate(num) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(fibonacci(num));
        }, 1000);
    })
}

module.exports = {
    init,
    calculate
}

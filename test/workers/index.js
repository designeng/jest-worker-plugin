const fibonacci = require('../math/fibonacci')

function init() {
    /* init silently */
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

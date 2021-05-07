/* tail recursive */
// module.exports = function fibonacci(n, sum = 0, prev = 1) {
//     if (n <= 1) return sum;
//     return fibonacci(n-1, prev + sum, sum);
// }

/* not a tail recursive function */
module.exports = function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1 || n === 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

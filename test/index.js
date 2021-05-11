const t = require('tap');
const wire = require('wire');
const _ = require('underscore');

const spec = require('./spec');

wire(spec).then(context => {
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

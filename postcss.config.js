const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');


// (file, options, env)
module.exports = () => {
    return {
        plugins: [
            autoprefixer(),

            mqpacker({
                sort: true,
            }),
        ],
    };
};

const exphbs = require('express-handlebars')

module.exports = (app) => {
    app.set('view engine', 'hbs')

    app.engine('.hbs', exphbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        helpers: {
            json: (context) => JSON.stringify(context),
            inc: (number) => parseInt(number) + 1,
            equals: (first, second) => first == second,           // not using a strict equal as string-casted in hbs
            loop: (n, block) => {
                var accum = ''
                for (let i = 0; i < n; i++) {
                    accum += block.fn(i)
                }
                return accum
            },
            min: (first, second) => parseInt(first) - parseInt(second),
            sum: (first, second) => parseInt(first) + parseInt(second),
            divide: (first, second) => parseInt(first) / parseInt(second),
            mod: (first, second) => parseInt(first) % parseInt(second),
            times: (first, second) => parseInt(first) * parseInt(second),
            lt: (first, second) => parseInt(first) > parseInt(second)
        }
    }))
}


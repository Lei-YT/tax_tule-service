module.exports = {
    presets: [
        ['@vue/app',
            {
                useBuiltIns: 'entry',
                polyfills: [
                    'es6.promise',
                    'es6.array.find-index',
                    'es6.array.copy-withiin',
                    'es6.array.fill',
                    'es7.array.includes',
                    'es6.array.iterator',
                    'es6.symbol',
                    'es6.string.includes',
                    'es6.object.assign',
                ]
            }
        ]
    ]
}

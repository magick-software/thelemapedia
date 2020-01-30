let R = require('ramda')
let sephiraProps = require("..").sephira

let keys = R.uniq(R.map(R.prop('key'), sephiraProps))

console.log('# Known Sephira Keys\n')
for(let key of keys) {
    console.log(` * ${key}`)
}
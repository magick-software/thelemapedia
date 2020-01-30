let R = require('ramda')
let sephiraProps = require("..").sephira

let byProp = R.groupBy(R.prop('key'), sephiraProps)

for(let key of R.keys(byProp)) {
    console.log(`\n\n## ${key}\n`)
    console.log(`| Sephira | Correspondence |\n|-|-|`)
    for(let p of byProp[key]) {
        console.log(`| ${p.sephira} | ${p.value} |`)
    }
}
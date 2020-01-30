let R = require('ramda')
let sephiraProps = require("..").sephira

let byProp = R.groupBy(R.prop('key'), sephiraProps)

let incomplete = R.pipe(
    R.map(R.length),
    R.filter(R.compose(R.not, R.equals(10))),
)(byProp)


console.log(`\n# Missing keys\n`)
console.log(`| Key | Defined for # Sephira |\n|-|-|`)
for(let [key, has] of R.toPairs(incomplete)) {
    console.log(`| ${key} | ${has} |`)
}


for(let key of R.keys(incomplete)) {
    console.log(`\n\n## ${key}\n`)
    console.log(`| Sephira | Correspondence |\n|-|-|`)
    for(let p of byProp[key]) {
        console.log(`| ${p.sephira} | ${p.value} |`)
    }
}
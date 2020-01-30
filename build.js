let fs = require('fs')
let pathjoin = require('path').join
let R = require('ramda')

let sephiraFiles = R.trim(`
kether.txt
binah.txt
chokmah.txt
chesed.txt
geburah.txt
tiphereth.txt
hod.txt
netzach.txt
yesod.txt
malkuth.txt
`).split('\n').map(R.trim)

let pathFiles = R.trim(`
aleph.txt
beth.txt
daleth.txt
gimel.txt
he.txt
vau.txt
zain.txt
cheth.txt
teth.txt
yod.txt
kaph.txt
lamed.txt
nun.txt
samekh.txt
ayin.txt
pe.txt
tzaddi.txt
qoph.txt
resh.txt
shin.txt
`).split('\n').map(R.trim)


let splitLines = R.split(/\n/g)
let isProperty = R.test(/^\s+/)
let splitProperty = line => R.map(R.trim, R.split(':', line))
let toProps = R.pipe(
    splitLines,
    R.filter(isProperty),
    R.map(splitProperty)
)

function loadProps(dir, filename) {
    let content = fs.readFileSync(pathjoin(__dirname, dir, filename), {encoding: 'utf-8'})
    return toProps(content)
}

function processSephiraFile (filename) {
    let sephira = R.replace('.txt', '', filename)
    let props = loadProps('sephira', filename)
    let mapProp = ([key,value]) => ({key, value, sephira})
    return R.map(mapProp, props)
}

function processPathFile (filename) {
    let path = R.replace('.txt', '', filename)
    let props = loadProps('paths', filename)
    let mapProp = ([key,value]) => ({key, value, path})
    return R.map(mapProp, props)
}


// removes "(#)"
let removeHashThing = R.replace(/\s*\(#\)\s*/, '')
let splitIfHasDotOrComma = s => {
    if (R.test(/\./, s)) {
        return R.split(/\s*\.\s*/, s)
    } else {
        if (R.test(/,/, s)) {
            return R.split(/\s*,\s*/, s)
        } else {
            return s
        }
    }
}

let valueCleaner = s => {
    let t = removeHashThing(s)
    let q = splitIfHasDotOrComma(t)
    // console.log('=== ', s, '\n+++ ', t, '\n^^^ ', q)
    return q
}

let filterKeys = x => ({...x, value: valueCleaner(x.value || '') })

let allProps = (f, fs) => R.pipe(
    R.map(f),
    R.flatten,
    // R.map(filterKeys)
)(fs)

let allSephiraProps = allProps(processSephiraFile, sephiraFiles)

console.log(`loaded ${allSephiraProps.length} sephira properties, writing to 'sephira.json'`)
fs.writeFileSync('sephira.json', JSON.stringify(allSephiraProps), {encoding:'utf-8'})

let allPathProps = allProps(processPathFile, pathFiles)

console.log(`loaded ${allPathProps.length} path properties, writing to 'paths.json'`)
fs.writeFileSync('paths.json', JSON.stringify(allSephiraProps), {encoding:'utf-8'})

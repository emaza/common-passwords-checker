'use strict'
/**
* Check if password exists in passwords file.
* File whith common password list:
* https://github.com/danielmiessler/SecLists/blob/master/Passwords/xato-net-10-million-passwords.txt
* Usage:
* > node password_checker.js 'password_to_check'
* to debug use:
* > node password_checker.js 'password_to_check' -debug
*/
const fs = require('fs')
const readline = require('readline')
const passwordsFile = './xato-net-10-million-passwords.txt'
const password = getFirstArgument(process.argv)

const debug = process.argv.slice(2)[1] === '-debug'
if (debug) {
    var startUsage = process.cpuUsage()
    console.time('processTime')
    process.on('exit', (code) => {
        console.log(`About to exit with code: ${code}`)
        console.timeEnd('processTime')
    })
}

const fileStream = fs.createReadStream(passwordsFile)
fileStream.on('end', () => {
    console.log(true)
    logProcessTime('EOF')
    process.exit(0)
})
const readable = readline.createInterface({
    input: fileStream
})

readable.on('close', () => {
    logProcessTime('readable closed')
})

readable.on('line', (input) => {
    // logProcessTime(`Received: '${input}'`)
    if (input === password) {
        console.log(false)
        readable.close()
        process.exit(0)
    }
})

function getFirstArgument(argv) {
    if (argv.slice(2)[0] === undefined) {
        throw new Error('One argument is required')
    }
    return argv.slice(2)[0]
}

function logProcessTime(info) {
    if (debug) {
        console.log(info)
        console.log(process.cpuUsage(startUsage))
    }
}

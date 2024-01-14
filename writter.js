/**
 * Outil d'écriture permanente des actions
 * @module writer
 */

const fs = require('fs')
const logger = require('./logger')
const pccApi = require('./server.json')

exports.simple = (text,elem,organne,prio) => {
    function dayOfWeekAsString(dayIndex) {
        return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || '';
    }
    let actualTime = new Date();

    let data = `[${dayOfWeekAsString(actualTime.getDay())}${' '.repeat(10-dayOfWeekAsString(actualTime.getDay()).length)}${('0'+actualTime.getHours()).slice(-2)}h${('0'+actualTime.getMinutes()).slice(-2)}:${('0'+actualTime.getSeconds()).slice(-2)}] ${elem}${' '.repeat(5-elem.length)} -> ${organne} ; ${text} \n`
    fs.writeFile('logs.txt', data, {flag: 'a+'}, (err) => {
        if (err) {
            throw err;
        }
    })
    let alarm = { 
        timestamp: actualTime.getTime(),
        content: data,
        priority: prio||1
    }
    pccApi.logs.push(alarm)
    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
}

exports.clean = ()=>{
    fs.writeFile('logs.txt', '', (err) => {
        if(err) {
            throw err;
        }
    });
    pccApi.logs=[]
    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
}
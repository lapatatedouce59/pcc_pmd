/**
 * Outil de gestion des demandes de cycles 
 * @module OGDC
 */

const logger = require('./logger')

const pccApi=require('./server.json');

const fs = require('fs')

const parent = require('./ws')

const {setTimeout} = require('timers/promises')

const writter = require("./writter");

const itineraire = require('./ICI');
const ovse = require('./OVSE');

let INTERVALS = []
let INTERMAP=new Map()

/**
* Applique le cycle rensigné
* @param code Code de cycle
* @param wss WebSeocket actif (permet de broadcast)
* @param cycleTrigger true en cas de réapplication du cycle (ou false si pas de réitération)
* @default false Le cycle n'a pas été appliqué
* @returns True si le cycle a été appliqué
* @type {boolean}
*/


exports.startCycle = function (code, wss, cycleTrigger) {
    if(!(code)) throw new Error ('[OGDC] Aucun code de cycle renseigné')
    if(!(wss)) throw new Error ('[OGDC] Le WebSocket n\'a pas été renseigné!')
    function apiSave(){
        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));

        parent.apiSave()
        //ws.send();
    }

    wss.broadcast = function broadcast(msg) {
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    };

    for(let sec of pccApi.SEC){
        for(let cycle of sec.CYCLES){
            if(!(cycle.code===code)) continue;
            if(code==='c1p1'){
                cycle.active=true
                writter.simple(`CYCLE ${cycle.code} EN ACTIVITÉ.`,'PA', `IGC`,1)
                let initPhaseInter = setInterval(async ()=>{ //? PREPARATION PHASE 1
                    if(cycle.active===false) {
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        return;
                    }
                    if(ctnInf('c2201').trains.length>0){
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        let itiDes1 = ["2401_2201","1201_1401","1401_1201","2401_1401","1401_2401","1201_2201","2201_1201"]
                        for(let iti1 of itiDes1){
                            if(itiInf(iti1).active===true&&itiInf(iti1).mode==='SEL') itineraire.DES(iti1)
                        }
                        if(itiInf('2201_2401').active===false) itineraire.SEL('2201_2401')
                        writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 1.`,'PA', `IGC`,1)
                        let phase1Inter = setInterval(async ()=>{
                            for(let aig of pccApi.aiguilles){
                                if(!(aig.id==='C1')) continue;
                                if(cycle.active===false) {
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    return;
                                }
                                if(aig.actualIti.length===1 && aig.actualIti[0]==='2201_2401'){//? VERIFICATION CONFORMITÉ PHASE 1 ET CONSTRUCTION
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 1.`,'PA', `IGC`)
                                    itineraire.DES('2201_2401')
                                    itineraire.SEL('2401_1401')
                                    writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 2.`,'PA', `IGC`)
                                    let phase2inter = setInterval(async ()=>{
                                        for(let aig of pccApi.aiguilles){
                                            if(!(aig.id==='C1')) continue;
                                            if(cycle.active===false) {
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                return;
                                            }
                                            if(ctnInf('c2401').trains.length>0 && itiInf('2401_1401').active===true){//? ATTENTE CONSTRUCTION AUTOMATIQUE PHASE 2
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 2.`,'PA', `IGC`)
                                                itineraire.SEL('2201_2401')
                                                itineraire.DES('2401_1401')
                                                if(cycleTrigger===true){
                                                    writter.simple(`CYCLE ${cycle.code} EN ATTENTE DE RESET.`,'PA', `IGC`)
                                                    let recursiveInter = setInterval(async ()=>{
                                                        for(let aig of pccApi.aiguilles){
                                                            if(!(aig.id==='C1')) continue;
                                                            if(cycle.active===false) {
                                                                clearCorrespondingInterval(code)
                                                                INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                                return;
                                                            }
                                                            if(ctnInf('c1401').trains.length>0 && itiInf('2401_1401').active===false){//? ATTENTE DESTRUCTION PHASE 2 POUR RECURSIVITÉ
                                                                clearCorrespondingInterval(code)
                                                                INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                                return exports.startCycle(code, wss, cycleTrigger);
                                                            } 
                                                        }
                                                    },100)
                                                    INTERVALS.push(recursiveInter)
                                                    INTERMAP.set(code, recursiveInter)
                                                } else {
                                                    cycle.active=false
                                                    cycle.sel=false
                                                }
                                            }
                                        }
                                    },100)
                                    INTERVALS.push(phase2inter)
                                    INTERMAP.set(code, phase2inter)
                                }
                            }
                        },100)
                        INTERVALS.push(phase1Inter)
                        INTERMAP.set(code, phase1Inter)
                    }
                },100)
                INTERVALS.push(initPhaseInter)
                INTERMAP.set(code, initPhaseInter)
            }


            if(code==='c2p1'){
                cycle.active=true
                writter.simple('EN ACTIVITÉ.','PA', `CYCLE ${cycle.code}`)
                let initPhaseInter = setInterval(async ()=>{ //? PREPARATION PHASE 1
                    if(cycle.active===false) {
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        return;
                    }
                    if(ctnInf('c1401').trains.length>0){
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        let itiDes1 = ["2401_2201","2201_2401","1201_1401","2401_1401","1401_2401","1201_2201","2201_1201"]
                        for(let iti1 of itiDes1){
                            if(itiInf(iti1).active===true&&itiInf(iti1).mode==='SEL') itineraire.DES(iti1)
                        }
                        if(itiInf('1401_1201').active===false) itineraire.SEL('1401_1201')
                        writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 1.`,'PA', `IGC`)
                        let phase1Inter = setInterval(async ()=>{
                            for(let aig of pccApi.aiguilles){
                                if(!(aig.id==='C1')) continue;
                                if(cycle.active===false) {
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    return;
                                }
                                if(aig.actualIti.length===1 && aig.actualIti[0]==='1401_1201'){//? VERIFICATION CONFORMITÉ PHASE 1 ET CONSTRUCTION
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 1.`,'PA', `IGC`)
                                    itineraire.DES('1401_1201')
                                    itineraire.SEL('1201_2201')
                                    writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 2.`,'PA', `IGC`)
                                    let phase2inter = setInterval(async ()=>{
                                        for(let aig of pccApi.aiguilles){
                                            if(!(aig.id==='C1')) continue;
                                            if(cycle.active===false) {
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                return;
                                            }
                                            if(ctnInf('c1201').trains.length>0 && itiInf('1201_2201').active===true){//? ATTENTE CONSTRUCTION AUTOMATIQUE PHASE 2
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 2.`,'PA', `IGC`)
                                                itineraire.SEL('1401_1201')
                                                itineraire.DES('1201_2201')
                                                if(cycleTrigger===true){
                                                    writter.simple(`CYCLE ${cycle.code} EN ATTENTE DE RESET.`,'PA', `IGC`)
                                                    let recursiveInter = setInterval(async ()=>{
                                                        for(let aig of pccApi.aiguilles){
                                                            if(!(aig.id==='C1')) continue;
                                                            if(cycle.active===false) {
                                                                clearCorrespondingInterval(code)
                                                                INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                                return;
                                                            }
                                                            if(ctnInf('c2201').trains.length>0 && itiInf('1201_2201').active===false){//? ATTENTE DESTRUCTION PHASE 2 POUR RECURSIVITÉ
                                                                clearCorrespondingInterval(code)
                                                                INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                                return exports.startCycle(code, wss, cycleTrigger);
                                                            } 
                                                        }
                                                    },100)
                                                    INTERVALS.push(recursiveInter)
                                                    INTERMAP.set(code, recursiveInter)
                                                } else {
                                                    cycle.active=false
                                                    cycle.sel=false
                                                }
                                            }
                                        }
                                    },100)
                                    INTERVALS.push(phase2inter)
                                    INTERMAP.set(code, phase2inter)
                                }
                            }
                        },100)
                        INTERVALS.push(phase1Inter)
                        INTERMAP.set(code, phase1Inter)
                    }
                },100)
                INTERVALS.push(initPhaseInter)
                INTERMAP.set(code, initPhaseInter)
            }

            if(code==='c1p2'){
                cycle.active=true
                writter.simple(`CYCLE ${cycle.code} EN ACTIVITÉ.`,'PA', `IGC`)
                let initPhaseInter = setInterval(async ()=>{ //? PREPARATION PHASE 1
                    if(cycle.active===false) {
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        return;
                    }
                    if(ctnInf('c2302').trains.length>0){
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        let itiDes1 = ["2101_2302","2101_1202","1202_2101","1501_1202","1202_1501"]
                        for(let iti1 of itiDes1){
                            if(itiInf(iti1).active===true&&itiInf(iti1).mode==='SEL') itineraire.DES(iti1)
                        }
                        if(itiInf('2302_2101').active===false) itineraire.SEL('2302_2101')
                        writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 1.`,'PA', `IGC`)
                        let phase1Inter = setInterval(async ()=>{
                            for(let aig of pccApi.aiguilles){
                                if(!(aig.id==='C2')) continue;
                                if(cycle.active===false) {
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    return;
                                }
                                if(aig.actualIti.length===1 && aig.actualIti[0]==='2302_2101'){//? VERIFICATION CONFORMITÉ PHASE 1 ET CONSTRUCTION
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 1.`,'PA', `IGC`)
                                    itineraire.DES('2302_2101')
                                    itineraire.SEL('2101_1202')
                                    writter.simple(`CYCLE ${cycle.code} EN CONSTRUCTION PHASE 2.`,'PA', `IGC`)
                                    let phase2inter = setInterval(async ()=>{
                                        for(let aig of pccApi.aiguilles){
                                            if(!(aig.id==='C2')) continue;
                                            if(cycle.active===false) {
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                return;
                                            }
                                            if(ctnInf('c2101').trains.length>0 && itiInf('2101_1202').active===true){//? ATTENTE CONSTRUCTION AUTOMATIQUE PHASE 2
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                writter.simple(`CYCLE ${cycle.code} CONSTRUIT PHASE 2.`,'PA', `IGC`)
                                                itineraire.SEL('2302_2101')
                                                itineraire.DES('2101_1202')
                                                if(cycleTrigger===true){
                                                    writter.simple(`CYCLE ${cycle.code} EN ATTENTE DE RESET.`,'PA', `IGC`)
                                                    let recursiveInter = setInterval(async ()=>{
                                                        if(cycle.active===false) {
                                                            clearCorrespondingInterval(code)
                                                            INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                            return;
                                                        }
                                                        for(let aig of pccApi.aiguilles){
                                                            if(!(aig.id==='C2')) continue;
                                                            if(ctnInf('c1202').trains.length>0 && itiInf('2101_1202').active===false){//? ATTENTE DESTRUCTION PHASE 2 POUR RECURSIVITÉ
                                                                clearCorrespondingInterval(code)
                                                                INTERVALS.splice(INTERVALS.indexOf(recursiveInter),1)
                                                                return exports.startCycle(code, wss, cycleTrigger);
                                                            } 
                                                        }
                                                    },100)
                                                    INTERVALS.push(recursiveInter)
                                                    INTERMAP.set(code, recursiveInter)
                                                } else {
                                                    cycle.active=false
                                                    cycle.sel=false
                                                }
                                            }
                                        }
                                    },100)
                                    INTERVALS.push(phase2inter)
                                    INTERMAP.set(code, phase2inter)
                                }
                            }
                        },100)
                        INTERVALS.push(phase1Inter)
                        INTERMAP.set(code, phase1Inter)
                    }
                },100)
                INTERVALS.push(initPhaseInter)
                INTERMAP.set(code, initPhaseInter)
            }
        }
    }
}

function clearCorrespondingInterval(code){
    if(INTERMAP.has(code)){
        clearInterval(INTERMAP.get(code))
        INTERMAP.delete(code)
        console.log(`Successfully cleared (${code})'s interval.`)
        return true;
    }
    return false;
}

function ctnInf(cid){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return ctn;
        }
    }
}

function itiInf(code){
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    return iti
                } else continue;
            }
        }
    }
}

exports.clearAll=()=>{
    let len = INTERVALS.length
    for(let interval of INTERVALS){
        clearInterval(INTERMAP.get(interval))
        clearInterval(interval)
        INTERVALS.splice(INTERVALS.indexOf(interval),1)
        INTERMAP.clear()
    }
    console.log(`Successfully cleared ${len} interval(s).`)
    return true;
}
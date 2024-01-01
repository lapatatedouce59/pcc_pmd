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

const itineraire = require('./itineraires');
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
                writter.simple('EN ACTIVITÉ.','PA', `CYCLE ${cycle.code}`)
                let initPhaseInter = setInterval(async ()=>{ //? PREPARATION PHASE 1
                    if(ctnInf('c2201').trains.length>0){
                        clearCorrespondingInterval(code)
                        INTERVALS.splice(INTERVALS.indexOf(initPhaseInter),1)
                        let itiDes1 = ["2401_2201","1201_1401","1401_1201","2401_1401","1401_2401","1201_2201","2201_1201"]
                        for(let iti1 of itiDes1){
                            if(itiInf(iti1).active===true&&itiInf(iti1).mode==='SEL') itineraire.DES(iti1)
                        }
                        if(itiInf('2201_2401').active===false) itineraire.SEL('2201_2401')
                        writter.simple('EN CONSTRUCTION PHASE 1.','PA', `CYCLE ${cycle.code}`)
                        let phase1Inter = setInterval(async ()=>{
                            for(let aig of pccApi.aiguilles){
                                if(!(aig.id==='C1')) continue;
                                if(aig.actualIti.length===1 && aig.actualIti[0]==='2201_2401'){//? VERIFICATION CONFORMITÉ PHASE 1 ET CONSTRUCTION
                                    clearCorrespondingInterval(code)
                                    INTERVALS.splice(INTERVALS.indexOf(phase1Inter),1)
                                    writter.simple('CONSTRUIT PHASE 1.','PA', `CYCLE ${cycle.code}`)
                                    itineraire.DES('2201_2401')
                                    itineraire.SEL('2401_1401')
                                    writter.simple('EN CONSTRUCTION PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                    let phase2inter = setInterval(async ()=>{
                                        for(let aig of pccApi.aiguilles){
                                            if(!(aig.id==='C1')) continue;
                                            if(ctnInf('c2401').trains.length>0 && itiInf('2401_1401').active===true){//? ATTENTE CONSTRUCTION AUTOMATIQUE PHASE 2
                                                clearCorrespondingInterval(code)
                                                INTERVALS.splice(INTERVALS.indexOf(phase2inter),1)
                                                writter.simple('CONSTRUIT PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                                itineraire.SEL('2201_2401')
                                                itineraire.DES('2401_1401')
                                                if(cycleTrigger===true){
                                                    writter.simple('EN ATTENTE DE RESET.','PA', `CYCLE ${cycle.code}`)
                                                    let recursiveInter = setInterval(async ()=>{
                                                        for(let aig of pccApi.aiguilles){
                                                            if(!(aig.id==='C1')) continue;
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
                const rpdelay = async() => {
                    changeItiState('des','1201_1401')
                    changeItiState('des','1401_2401')
                    changeItiState('des','2201_2401')
                    changeItiState('des','2401_2201')
                    changeItiState('des','2401_1401')
                    changeItiState('des','2201_1201')
                    changeItiState('des','1201_2201')

                    changeItiState('sel','1401_1201')
                    await setTimeout(100)
                    writter.simple('EN CONSTRUCTION PHASE 1.','PA', `CYCLE ${cycle.code}`)
                    apiSave()
                    await setTimeout(2000)
                    apiSave()
                    writter.simple('CONSTRUIT PHASE 1.','PA', `CYCLE ${cycle.code}`)
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[1].trains.length>0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[1].trains.length>0)&&(pccApi.SEC[0].cantons[2].trains.length===0)&&(pccApi.SEC[0].cantons[6].trains.length===0)){
                                clearInterval(cycleClearInter)
                                if(true){
                                    const rpdelay2 = async() => {
                                        changeItiState('des','2201_2401')
                                        changeItiState('des','1401_2401')
                                        changeItiState('des','2201_1201')
                                        changeItiState('des','2401_1401')
                                        changeItiState('des','1401_1201')
                                        changeItiState('des','1201_1401')

                                        changeItiState('sel','1201_2201')
                                        await setTimeout(100)
                                        apiSave()
                                        writter.simple('EN CONSTRUCTION PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                        await setTimeout(2000)
                                        apiSave()
                                        writter.simple('CONSTRUIT PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        writter.simple('EN ATTENTE DE RESET.','PA', `CYCLE ${cycle.code}`)
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[0].cantons[6].trains.length>0)&&(pccApi.SEC[0].cantons[7].trains.length===0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }

            if(code==='c1p2'){
                writter.simple('EN ACTIVITÉ.','PA', `CYCLE ${cycle.code}`)
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('des','2302_2202')
                    changeItiState('des','2101_2302')
                    changeItiState('des','2101_2402')
                    changeItiState('des','2101_1202')
                    changeItiState('des','1202_2101')

                    changeItiState('sel','2202_2302')
                    changeItiState('sel','2302_2101')
                    changeItiState('sel','2402_2101')
                    await setTimeout(100)
                    apiSave()
                    writter.simple('EN CONSTRUCTION PHASE 1.','PA', `CYCLE ${cycle.code}`)
                    await setTimeout(2000)
                    apiSave()
                    writter.simple('CONSTRUIT PHASE 1.','PA', `CYCLE ${cycle.code}`)
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[5].trains.length>0)&&(pccApi.SEC[1].cantons[7].trains.length===0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[5].trains.length>0)&&(pccApi.SEC[1].cantons[2].trains.length===0)){
                                clearInterval(cycleClearInter)
                                if(true){
                                    const rpdelay2 = async() => {
                                        changeItiState('des','2402_2101')
                                        changeItiState('des','2302_2101')
                                        changeItiState('des','1202_2101')
                                        changeItiState('des','1302_1102')
                                        changeItiState('des','PAG1_1102')
                                        changeItiState('des','1102_PAG1')
                                        changeItiState('des','1202_1501')
                                        changeItiState('des','1501_1202')

                                        changeItiState('sel','2101_2402')
                                        changeItiState('sel','2101_1202')
                                        changeItiState('sel','1102_1302')
                                        await setTimeout(100)
                                        apiSave()
                                        writter.simple('EN CONSTRUCTION PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                        await setTimeout(2000)
                                        apiSave()
                                        writter.simple('CONSTRUIT PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        writter.simple('EN ATTENTE DE RESET.','PA', `CYCLE ${cycle.code}`)
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[1].cantons[2].trains.length>0)&&(pccApi.SEC[1].cantons[1].trains.length===0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }
            if(code==='c2p2'){
                writter.simple('EN ACTIVITÉ.','PA', `CYCLE ${cycle.code}`)
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('des','2302_2202')
                    changeItiState('des','2101_2302')
                    changeItiState('des','2101_2402')
                    changeItiState('des','2101_1202')
                    changeItiState('des','1202_2101')

                    changeItiState('sel','2202_2302')
                    changeItiState('sel','2302_2101')
                    changeItiState('sel','2402_2101')
                    await setTimeout(100)
                    apiSave()
                    writter.simple('EN CONSTRUCTION PHASE 1.','PA', `CYCLE ${cycle.code}`)
                    await setTimeout(2000)
                    apiSave()
                    writter.simple('CONSTRUIT PHASE 1.','PA', `CYCLE ${cycle.code}`)
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[5].trains.length>0)&&(pccApi.SEC[1].cantons[7].trains.length===0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[5].trains.length>0)&&(pccApi.SEC[1].cantons[9].trains.length===0)){
                                clearInterval(cycleClearInter)
                                if(true){
                                    const rpdelay2 = async() => {
                                        changeItiState('des','2402_2101')
                                        changeItiState('des','2302_2101')
                                        changeItiState('des','1202_2101')
                                        changeItiState('des','1302_1102')
                                        changeItiState('des','PAG1_1102')
                                        changeItiState('des','1102_1302')
                                        changeItiState('des','1202_1501')
                                        changeItiState('des','1501_1202')

                                        changeItiState('sel','2101_2402')
                                        changeItiState('sel','2101_1202')
                                        changeItiState('sel','1102_PAG1')
                                        await setTimeout(100)
                                        apiSave()
                                        writter.simple('EN CONSTRUCTION PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                        await setTimeout(2000)
                                        apiSave()
                                        writter.simple('CONSTRUIT PHASE 2.','PA', `CYCLE ${cycle.code}`)
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        writter.simple('EN ATTENTE DE RESET.','PA', `CYCLE ${cycle.code}`)
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[1].cantons[9].trains.length>0)&&(pccApi.SEC[1].cantons[8].trains.length===0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
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
        INTERVALS.splice(INTERVALS.indexOf(interval),1)
        INTERMAP.clear()
    }
    console.log(`Successfully cleared ${len} interval(s).`)
    return true;
}
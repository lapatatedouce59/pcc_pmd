/**
 * Outil de vérification du statut des éléments
 * @module OVSE
 */

let pccApi = require('./server.json')

let parent = require('./ws')
const writter = require("./writter");

exports.f1 = false
exports.f2 = false
exports.f3 = false
exports.f4 = false
exports.f5 = false
exports.f6 = false
exports.f7 = false
exports.f8 = false
exports.f9 = true

exports.coupFS = false

exports.work = false;

exports.sequence = Array

function ongoingiti(){
    for(let sec of pccApi.SEC){
        let ongoing = []
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.active){
                    ongoing.push(iti.code)
                } else continue;
            }
        }
        if(ongoing.length>0) {
            sec.states.itiOngoing=true
        } else {
            sec.states.itiOngoing=false
        }
    }
    exports.f1=true
    return false;
}

function ongoingcycle(){
    for(let sec of pccApi.SEC){
        let ongoing = []
        for(let cycle of sec.CYCLES){
            if(cycle.active){
                ongoing.push(cycle.code)
            }
        }
        if(ongoing.length>0) {
            sec.states.cycleOngoing=true
        } else {
            sec.states.cycleOngoing=false
        }
    }
    
    exports.f2=true
}

function checkStationTrainsPresence(){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(ctn.hasOwnProperty('type')){
                if(ctn.trains.length>0 && (ctn.states.status===false||ctn.states.status==='def')){
                    ctn.states.status='valid'
                }
                if(ctn.trains.length>0){
                    if((ctn.states.status==='valid'||ctn.states.status==='def') && ctn.trains[0].states.trainInscrit){
                        ctn.states.status='inscrit'
                    }
                }
                
                if((ctn.states.status==='inscrit'||ctn.states.status==='def') && ctn.states.doorsOpened){
                    ctn.states.status='sharing'
                }
                if((ctn.states.status==='sharing'||ctn.states.status==='def') && ctn.states.doorsClosed){
                    ctn.states.status='inscrit'
                }
                if(ctn.trains.length>0){
                    if((ctn.states.status==='inscrit'||ctn.states.status==='def') && ctn.trains[0].states.trainInscrit===false){
                        ctn.states.status='departure'
                    }
                }
                
                if(ctn.trains.length===0){
                    ctn.states.status=false
                }
                let defList = []
                for(let states of Object.entries(ctn.states)){
                    if(!(states[1]===2)) continue;
                    defList.push(states[0])
                }
                if(defList.length>0){
                    ctn.states.status='def'
                }
            }
        }
    }
    exports.f3=true
}

function updateItiFormVoys(){
    if(pccApi.SEC[0].cantons[9].trains.length>0){
        pccApi.SEC[0].states.injDispoV201=true
        pccApi.SEC[0].states.retDispoV201=false
    }
    if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
        pccApi.SEC[0].states.injDispoV101=true
        if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
            pccApi.SEC[0].states.retDispoV101=true
        } else {
            pccApi.SEC[0].states.retDispoV101=false
        }
    }
    if(pccApi.SEC[0].cantons[9].trains.length===0){
        pccApi.SEC[0].states.injDispoV201=false
        pccApi.SEC[0].states.retDispoV201=true 
    }
    if((pccApi.SEC[0].cantons[1].trains.length>0)&&(pccApi.SEC[0].cantons[0].trains.length>0)){
        pccApi.SEC[0].states.injDispoV101=true
    }
    if((pccApi.SEC[0].cantons[1].trains.length>0)||(pccApi.SEC[0].cantons[0].trains.length>0)){
        pccApi.SEC[0].states.retDispoV101=true
    }
    if((pccApi.SEC[0].cantons[1].trains.length===0)&&(pccApi.SEC[0].cantons[0].trains.length===0)){
        pccApi.SEC[0].states.injDispoV101=false
    }
    if(pccApi.SEC[1].cantons[9].trains.length===0){
        pccApi.SEC[1].states.sortieDispoGla=true
    }
    if(pccApi.SEC[1].cantons[9].trains.length===0){
        pccApi.SEC[1].states.sortieDispoGla=true
        pccApi.SEC[1].states.entreeDispoGla=false
    } else {
        pccApi.SEC[1].states.sortieDispoGla=false
        pccApi.SEC[1].states.entreeDispoGla=true
    }
    exports.f4=true
}
//? Ajout des cantons de reference pour les alarmes cantons (ldi)
giveMapIndexForIti = function (code){
    let itiArrayC1Dev = ['1201_2201','2201_1201','2401_1401','1401_2401']
    let itiArrayC1NorV1 = ['1401_1201','1201_1401']
    let itiArrayC1NorV2 = ['2401_2201','2201_2401']

    let itiArrayC2Dev = ['2101_1202','1202_2101']
    let itiArrayC2BDev = ['1102_PAG1','PAG1_1102']
    let itiArrayC2NorV1 = ['1501_1202','1202_1501']
    let itiArrayC2NorV2 = ['2302_2101','2101_2302']
    let itiArrayC2BNor = ['1102_1302','1302_1102']



    if(!(code)) return;
    if(itiArrayC1Dev.includes(code)) return 'C1Dev';
    if(itiArrayC1NorV1.includes(code)) return 'C1NorV1';
    if(itiArrayC1NorV2.includes(code)) return 'C1NorV2';

    if(itiArrayC2Dev.includes(code)) return 'C2Dev';
    if(itiArrayC2BDev.includes(code)) return 'C2BDev';
    if(itiArrayC2NorV1.includes(code)) return 'C2NorV1';
    if(itiArrayC2NorV2.includes(code)) return 'C2NorV2';
    if(itiArrayC2BNor.includes(code)) return 'C2BNor';

    return false;
}
exports.isItiAnAigOne=function(code){
    if(!(code)) return;
    let gmifi = giveMapIndexForIti(code)

    if(!(gmifi===false)) return true;
    return false;
}
function isItiActive(code){
    if(!code) return console.error('[isItiActive] Aucun code d\'iti indiqué!')
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===code)) continue;
                return iti.active
            }
        }
    }
    console.info('[itiInfo] Aucun itinéraire correspondant.')
    return false;
}

let itiAigMap = new Map()
//s1
itiAigMap.set('C1Dev',['c1301','c2301'])
itiAigMap.set('C1NorV1',['c1301'])
itiAigMap.set('C1NorV2',['c2301'])
//s2
itiAigMap.set('C2Dev',['c1102','c2402'])
itiAigMap.set('C2BDev',['c1202'])
itiAigMap.set('C2NorV1',['c1102'])
itiAigMap.set('C2NorV2',['c2402'])
itiAigMap.set('C2BNor',['c1202'])

exports.returnCtnIteration=function(cid){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return ctn;
        }
    }
    return false;
}


function detectLDI(){
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(exports.isItiAnAigOne(iti.code)){
                    let itiParts = iti.code.split('_')
                    if(isItiActive(`${itiParts[1]}_${itiParts[0]}`)&&isItiActive(iti.code)){
                        let ctnToAlarm = itiAigMap.get(giveMapIndexForIti(iti.code))
                        for(let ctn of ctnToAlarm){
                            if(itiParts[0]==='PAG1') itiParts[0]='cGPAG1'
                            if(itiParts[1]==='PAG1') itiParts[1]='cGPAG1'
                            let actualCtn = exports.returnCtnIteration(ctn)
                            actualCtn.states.ldi = 2
                            writter.simple(`${actualCtn.cid}.`,'PA','LDI')
                        }
                    }
                } else {
                    let itiParts = iti.code.split('_')
                    if(isItiActive(`${itiParts[1]}_${itiParts[0]}`)&&isItiActive(iti.code)){
                        if(itiParts[0]==='PAG1') itiParts[0]='cGPAG1'
                        if(itiParts[1]==='PAG1') itiParts[1]='cGPAG1'
                        let ctn1 = exports.returnCtnIteration(`c${itiParts[0]}`)
                        let ctn2 = exports.returnCtnIteration(`c${itiParts[1]}`)
                        ctn1.states.ldi=2
                        ctn2.states.ldi=2
                        writter.simple(`${ctn1.cid}-${ctn2.cid}.`,'PA','LDI')
                    }
                }
            }
        }
    }
    exports.f5=true
}

function detectPZO(){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(ctn.trains.length>1){
                ctn.states.pzo=2
                writter.simple(`${ctn.cid} (trains ${ctn.trains[0].tid} et ${ctn.trains[1].tid}).`,'PA','PZO')
            }
        }
    }
    exports.f6=true
}

let noDef1 = false
let noDef2 = false


function detectAZM(){
    let defUCA = []
    for(let sec of pccApi.SEC){
        if(sec.id==='1'){
            for(let ctn of sec.cantons){
                if(ctn.cid === 'c1301' || ctn.cid === 'c2301'){
                    if(ctn.trains.length>0){
                        if(!(isItiActive('1201_1401')||isItiActive('1401_1201')||isItiActive('1401_2401')||isItiActive('2401_1401')||isItiActive('1201_2201')||isItiActive('2201_1201')||isItiActive('2201_2401')||isItiActive('2401_2201'))){
                            sec.states.zoneManoeuvre1=2
                            writter.simple(`${sec.id} (${ctn.cid})`,'PA','AZM')
                            defUCA.push(ctn.cid)
                            exports.f9=false
                            exports.callCounts++
                            askForFsCoup()
                        }
                    }
                }
            }
        }
        if(sec.id==='2'){
            for(let ctn of sec.cantons){
                if(ctn.cid === 'c1102' || ctn.cid === 'c2402'){
                    if(ctn.trains.length>0){
                        if(!(isItiActive('2501_1202')||isItiActive('1202_2501')||isItiActive('2302_2101')||isItiActive('2101_2302')||isItiActive('1202_2101')||isItiActive('2101_1202'))){
                            sec.states.zoneManoeuvre2=2
                            writter.simple(`${sec.id} (${ctn.cid})`,'PA','AZM')
                            defUCA.push(ctn.cid)
                            exports.f9=false
                            exports.callCounts++
                            askForFsCoup()
                        }
                    }
                } else if(ctn.cid === 'c1202' || ctn.cid === 'cGA2PAG'){
                    if(ctn.trains.length>0){
                        if(!(isItiActive('1102_1302')||isItiActive('1302_1102')||isItiActive('PAG1_1102')||isItiActive('1102_PAG1'))){
                            sec.states.zoneManoeuvre2=2
                            writter.simple(`${sec.id} (${ctn.cid})`,'PA','AZM')
                            defUCA.push(ctn.cid)
                            exports.f9=false
                            exports.callCounts++
                            askForFsCoup()
                        }
                    }
                }
            }
        }
    }
    if(defUCA.length===0){
        noDef1=true
    }
    exports.f7=true
}

function detectTNE(){
    let defs = []
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(ctn.cid.startsWith('cG')) continue;
            if(ctn.trains.length>0){
                if(ctn.trains[0].states.TMSActive===false){
                    ctn.trains[0].states.tneHorsZGAT=2
                    writter.simple(`${sec.id} (${ctn.trains[0].tid})`,'PA','TNE/TNI')
                    writter.simple(`${ctn.cid}`,'PA','PDP')
                    ctn.states.pdp=2
                    if(sec.id==='1'){
                        sec.states.tnitne1=2
                    } else if(sec.id==='2'){
                        sec.states.tnitne2=2
                    }
                    exports.f9=false
                    exports.callCounts++
                    askForFsCoup()
                    defs.push(ctn.cid)
                }
            }
        }
    }
    if(defs.length===0){
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                if(!(ctn.trains.length>0)) continue;
                ctn.trains[0].states.tneHorsZGAT=false
                if(sec.id==='1'){
                    sec.states.tnitne1=false
                } else if(sec.id==='2'){
                    sec.states.tnitne2=false
                }
            }
        }
        noDef2=true
    }
    exports.f8=true
}


exports.done=false
exports.callCounts=0
exports.actualCount=0
function askForFsCoup(){
    exports.actualCount++
    exports.coupFS=true
    pccApi.voyUCA=2
    if(exports.callCounts===exports.actualCount) exports.f9=true
}

function retablissementUCA(){
    if(!(noDef1&&noDef2)) return false;
    if(!(pccApi.voyUCA===2||pccApi.voyUCA===1)) return false;
    exports.coupFS='RETABLISSEMENT'
    pccApi.voyUCA=true
    noDef1=false
    noDef2=false
}

exports.periodicUpdateVoy = async function(){
    exports.f9=true
    exports.done=false
    detectLDI()
    detectAZM()
    detectTNE()
    detectPZO()
    ongoingiti()
    checkStationTrainsPresence()
    ongoingcycle()
    updateItiFormVoys()
    retablissementUCA()
}
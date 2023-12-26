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

exports.lastCtn = String

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
                    if((ctn.states.status==='valid'||ctn.states.status==='def') && pccApi.trains[ctn.trains[0]].states.trainInscrit){
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
exports.isItiAnAigOne=function(code){
    if(!(code)) return;
    for(let aigIti of Object.entries(pccApi.aigItis)){
        if (aigIti[1].includes(code)) return aigIti[0];
    }
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
    for(let itiGroup of pccApi.aiguilles){
        if (itiGroup.actualIti.length===0){
            // aucun itinéraire n'est admis pour l'aiguille.
            //! Coupure de la FS sur le canton
            writter.simple(`${itiGroup.id}.`,'UCA','COUPURE FS')
            writter.simple(`${itiGroup.id}.`,'PA','ABSENCE ITI')
        }
    }
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(exports.isItiAnAigOne(iti.code)){
                    if(isItiActive(iti.code)){
                        for(let itiGroup of pccApi.aiguilles){
                            if(!(itiGroup.id===exports.isItiAnAigOne(iti.code))) continue;
                            if(itiGroup.actualIti.includes(iti.code)){
                                let itiParts = iti.code.split('_')
                                if(isItiActive(`${itiParts[1]}_${itiParts[0]}`)&&isItiActive(iti.code)){
                                    for(let trueCtn of itiGroup.aigCtn){
                                        let actualCtn = exports.returnCtnIteration(trueCtn)
                                        //actualCtn.states.ldi = 2
                                    }
                                    writter.simple(`${itiGroup.id} (DIV)`,'PA','LDI')
                                    continue;
                                }
                                if(itiGroup.actualIti.length>1){
                                    for(let aigIti of itiGroup.actualIti){
                                        if(!(itiGroup.exeption.includes(aigIti))&&(isItiActive(aigIti))){
                                            //Plusieurs itinéraires sont actifs sur l'aiguille mais ils ne concordent pas.
                                            //! DU, coupure FS et LDI

                                            for(let trueCtn of itiGroup.aigCtn){
                                                let actualCtn = exports.returnCtnIteration(trueCtn)
                                                //actualCtn.states.ldi = 2
                                            }
                                            writter.simple(`${itiGroup.id} (${iti.code})`,'PA','LDI')
                                        }
                                    }
                                }
                            } else {
                                // l'itinéraire est en ligne...mais n'est pas appliqué à l'aiguille.
                                //! Anomalie
                                writter.simple(`${itiGroup.id} > ${iti.code}`,'PA','DISCORDANCE')
                            }
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
                            UCA.newAlarm('pzo', `${ctn.cid}`, ["fs"])
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
                            UCA.newAlarm('pzo', `${ctn.cid}`, ["fs"])
                        }
                    }
                } else if(ctn.cid === 'c1202' || ctn.cid === 'cGA2PAG'){
                    if(ctn.trains.length>0){
                        if(!(isItiActive('1102_1302')||isItiActive('1302_1102')||isItiActive('PAG1_1102')||isItiActive('1102_PAG1'))){
                            sec.states.zoneManoeuvre2=2
                            writter.simple(`${sec.id} (${ctn.cid})`,'PA','AZM')
                            defUCA.push(ctn.cid)
                            exports.f9=false
                            UCA.newAlarm('pzo', `${ctn.cid}`, ["fs"])
                            UCA.alarmInventory.pzo=true
                        }
                    }
                }
            }
        }
    }
    if(defUCA.length===0){
        UCA.alarmInventory.pzo=false
    }
    exports.f7=true
}

function detectPDP(){
    let defUCA2=[]
    let trainList = []
    let foundMap = new Map()
    for(let train of Object.entries(pccApi.trains)){
        trainList.push(train[0])
    }
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            for(let train of ctn.trains){
                if(trainList.includes(train)){
                    foundMap.set(train,true)
                }
            }
        }
    }
    for(let trainInd of trainList){
        if(typeof foundMap.get(trainInd)==='undefined'){
            console.log(`PDP de train ${trainInd} sur ${exports.lastCtn}`)
            writter.simple(`${exports.lastCtn} > ${trainInd}`,'PA','PDP')
            defUCA2.push(trainInd)
            UCA.alarmInventory.pdp=true
            UCA.newAlarm('pdp', `${exports.lastCtn}`, ["fs","ht"])
        }
    }
    exports.f8=true
    if(defUCA2.length===0){
        UCA.alarmInventory.pdp=false
    }
}

/*function detectTNE(){
    let defs = []
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(ctn.cid.startsWith('cG')) continue;
            if(ctn.trains.length>0){
                if(pccApi.trains[ctn.trains[0]].states.TMSActive===false){
                    pccApi.trains[ctn.trains[0]].states.tneHorsZGAT=2
                    writter.simple(`${sec.id} (${pccApi.trains[ctn.trains[0]].tid})`,'PA','TNE/TNI')
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
                pccApi.trains[ctn.trains[0]].states.tneHorsZGAT=false
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
}*/

let UCA = {
    newAlarm: function (origin, concern, target){
        for(let alarm of pccApi.UCA){
            if(alarm.origin===origin && alarm.concern===concern) return;
        }
        pccApi.UCA.push({ origin: origin||"uca", concern: concern||"line", impact: target||["fs","ht"], acq: false })
    },
    update: ()=>{
        let alarmsOn=[]
        for(let alarmType of Object.entries(UCA.alarmInventory)){
            if(alarmType[1]===true){
                alarmsOn.push(alarmType)
            }
        }
        if(alarmsOn.length===0) {
            pccApi.UCA=[]
            //writter.simple(`EFFACEMENT ALARMES`,'UCA','')
            return pccApi.voyUCA=true
        }
        for(let alarm of pccApi.UCA){
            if(alarm.acq===false) return pccApi.voyUCA=2;
        }
        for(let alarmType of Object.entries(UCA.alarmInventory)){
            if(alarmType[1]===true) return pccApi.voyUCA=1;
        }
        console.log('clear uca')
        pccApi.UCA=[]
        pccApi.voyUCA=true
        return; //writter.simple(`EFFACEMENT ALARMES`,'UCA','')
    },
    acquitAll: function () {
        pccApi.UCA.forEach((alarm)=>alarm.acq=true)
    },
    alarmInventory:{
        ldi: false,
        azm: false,
        pzo: false,
        pdp: false
    }
}

exports.uca=UCA

exports.periodicUpdateVoy = async function(){
    exports.f9=true
    exports.done=false
    detectLDI()
    detectAZM()
    detectPDP()
    //detectTNE()
    detectPZO()
    ongoingiti()
    checkStationTrainsPresence()
    ongoingcycle()
    updateItiFormVoys()
}
/**
 * Outil de vérification du statut des éléments
 * @module OVSE
 */

let pccApi = require('./server.json')

let parent = require('./ws')
const writter = require("./writter");
const fs = require('fs')

exports.f1 = false
exports.f2 = false
exports.f3 = false
exports.f4 = false
exports.f5 = false
exports.f6 = false
exports.f7 = false
exports.f8 = false
exports.f9 = false
exports.fUCA = false

exports.coupFS = false

exports.lastCtn = String

exports.lastDPOn = String

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
function isItiApartFromAnAigOne(code){
    if(!(code)) return;
    for(let itiDesc of Object.entries(pccApi.itiDescription)){
        if(itiDesc[1].includes(code)) return true;
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

function ctnInf(cid){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return ctn;
        }
    }
}

function secInf(id){
    for(let sec of pccApi.SEC){
        if(!(sec.id===id)) continue;
        return sec;
    }
}

function detectLDI(){
    let defUca = []
    for(let itiGroup of pccApi.aiguilles){
        if (itiGroup.actualIti.length===0){
            let selectedIti = []
            for(let itiListOfAig of pccApi.aigItis[itiGroup.id]){
                if(itiInf(itiListOfAig).mode==='SEL') selectedIti.push(itiListOfAig)
            }
            if(selectedIti.length===0){
                // aucun itinéraire n'est admis pour l'aiguille et aucun itinéraire n'est sélectionné pour remplacer.
                //! Coupure de la FS sur le canton
                writter.simple(`${itiGroup.id}.`,'UCA','COUPURE FS')
                writter.simple(`${itiGroup.id}.`,'PA','ABSENCE ITI')
                for(let trueCtn of itiGroup.aigCtn){
                    let actualCtn = exports.returnCtnIteration(trueCtn)
                    actualCtn.states.coupFs = 2
                }
            } //sinon, un itinéraire est sélectionné pour remédier à la destruction du précédent.
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
                                        actualCtn.states.ldi = 2
                                    }
                                    writter.simple(`${itiGroup.id} (DIV)`,'PA','LDI')
                                    defUca.push(itiGroup.id)
                                    UCA.newAlarm('ldi', `${itiGroup.id}`, ["fs"])
                                    UCA.alarmInventory.ldi=true
                                    continue;
                                }
                                if(itiGroup.actualIti.length>1){
                                    for(let aigIti of itiGroup.actualIti){
                                        if(!(itiGroup.exeption.includes(aigIti))&&(isItiActive(aigIti))){
                                            //Plusieurs itinéraires sont actifs sur l'aiguille mais ils ne concordent pas.
                                            //! DU, coupure FS et LDI

                                            for(let trueCtn of itiGroup.aigCtn){
                                                let actualCtn = exports.returnCtnIteration(trueCtn)
                                                actualCtn.states.ldi = 2
                                            }
                                            writter.simple(`${itiGroup.id} (${iti.code})`,'PA','LDI')
                                            defUca.push(itiGroup.id)
                                            UCA.newAlarm('ldi', `${itiGroup.id}`, ["fs"])
                                            UCA.alarmInventory.ldi=true
                                        }
                                    }
                                }
                            } else {
                                // l'itinéraire est en ligne...mais n'est pas appliqué à l'aiguille.
                                //! Anomalie
                                writter.simple(`${itiGroup.id} > ${iti.code}`,'PA','DISCORDANCE')
                                sec.states[`discord${itiGroup.aigCtn[0].slice(-1)}`]=2
                                defUca.push(itiGroup.id)
                                UCA.newAlarm('ldi', `${itiGroup.id}`, ["fs"])
                                UCA.alarmInventory.ldi=true
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
                        defUca.push(iti.code)
                        UCA.newAlarm('ldi', `${iti.code}`, ["fs"])
                        UCA.alarmInventory.ldi=true
                    }
                }
            }
        }
    }
    if(defUca.length===0){
        UCA.alarmInventory.ldi=false
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


/*function detectAZM(){
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
                            UCA.newAlarm('azm', `${ctn.cid}`, ["fs"])
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
                            UCA.newAlarm('azm', `${ctn.cid}`, ["fs"])
                        }
                    }
                } else if(ctn.cid === 'c1202' || ctn.cid === 'cGA2PAG'){
                    if(ctn.trains.length>0){
                        if(!(isItiActive('1102_1302')||isItiActive('1302_1102')||isItiActive('PAG1_1102')||isItiActive('1102_PAG1'))){
                            sec.states.zoneManoeuvre2=2
                            writter.simple(`${sec.id} (${ctn.cid})`,'PA','AZM')
                            defUCA.push(ctn.cid)
                            exports.f9=false
                            UCA.newAlarm('azm', `${ctn.cid}`, ["fs"])
                            UCA.alarmInventory.azm=true
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
}*/

function detectAZM(){
    let defUCA = []
    for(let aigGroup of pccApi.aiguilles){
        if(aigGroup.actualIti.length===0){
            let trainsOnAig=[]
            for(let pctn of aigGroup.aigCtn){
                if(ctnInf(pctn).trains.length>0){
                    trainsOnAig.push(pctn)
                }
            }
            if(trainsOnAig.length>0){
                let secId = ctnInf(aigGroup.aigCtn[0]).cid.slice(-2)
                let secIdNum = parseInt(secId)
                let secIt = secInf(JSON.stringify(secIdNum))
                secIt.states[`zoneManoeuvre${secIt.id}`] = 2
                defUCA.push(aigGroup.id)
                UCA.newAlarm('azm', `${aigGroup.id}`, ["fs","ht"])
                UCA.alarmInventory.azm=true
                writter.simple(`${secIdNum} (${aigGroup.id})`,'PA','AZM')
            }
        }
    }
    if(defUCA.length===0){
        UCA.alarmInventory.azm=false
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


function detectALCD(){
    let defUCA2=[]
    for(let trainItiLog of Object.entries(pccApi.trainMouvements)){
        if(trainItiLog[1].length>1){ //On vérifie si il y a une SÉQUENCE de mouvement.
            let ctnToIti = []
            for(let ctn of trainItiLog[1]){
                if(ctn==='cGPAG1') {ctnToIti.push('PAG1'); continue;}
                ctnToIti.push(ctn.replace('c',''))
            }
            if(isItiApartFromAnAigOne(`${ctnToIti[0]}_${ctnToIti[1]}`)){
                let itiCompris = []
                for(let itiComponents of Object.entries(pccApi.itiDescription)){
                    if(itiComponents[1].includes(`${ctnToIti[0]}_${ctnToIti[1]}`)){
                        if(isItiActive(`${itiComponents[0]}`)&&exports.isItiAnAigOne(`${itiComponents[0]}`)) itiCompris.push(`${ctnToIti[0]}_${ctnToIti[1]}`)
                    }
                }
                if(itiCompris.length===0){
                    //console.log(`ALDC train ${trainItiLog[0]} sur MANOEUVRE ${ctnToIti[0]} A ${ctnToIti[1]}`)
                    writter.simple(`${ctnToIti[0]}-${ctnToIti[1]} > ${trainItiLog[0]}`,'UCA','ALDC')
                    defUCA2.push(trainItiLog[0])
                    UCA.alarmInventory.pdp=true
                    UCA.newAlarm('alc', `${trainItiLog[0]}`, ["fs","ht"])
                }
            } else {
                if(!(isItiActive(`${ctnToIti[0]}_${ctnToIti[1]}`))){  //Si le mouvement ne correspond pas à un iti online.
                    //console.log(`ALDC train ${trainItiLog[0]} sur ${ctnToIti[0]} et ${ctnToIti[1]}`)
                    writter.simple(`${ctnToIti[0]}-${ctnToIti[1]} > ${trainItiLog[0]}`,'UCA','ALDC')
                    defUCA2.push(trainItiLog[0])
                    UCA.alarmInventory.pdp=true
                    UCA.newAlarm('alc', `${trainItiLog[0]}`, ["fs","ht"])
                    continue;
                }
            }
        }
    }
    exports.f9=true
    if(defUCA2.length===0){
        UCA.alarmInventory.alc=false
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
        pdp: false,
        alc: false
    }
}

exports.uca=UCA

exports.periodicUpdateVoy = async function(){
    exports.done=false
    detectLDI()
    detectAZM()
    detectPDP()
    //detectTNE()
    detectPZO()
    ongoingiti()
    checkStationTrainsPresence()
    ongoingcycle()
    detectALCD()
    updateItiFormVoys()
    let verFuncAll = setInterval(()=>{
        if(exports.f1===true&&exports.f2===true&&exports.f3===true&&exports.f4===true&&exports.f5===true&&exports.f6===true&&exports.f7===true&&exports.f8===true&&exports.f9===true){
            clearInterval(verFuncAll)
            exports.uca.update()
            exports.f1=false
            exports.f2=false
            exports.f3=false
            exports.f4=false
            exports.f5=false
            exports.f6=false
            exports.f7=false
            exports.f8=false
            exports.f9=false

            let fsInc=[]
            let htInc=[]
            let alcInc=[]
            //let voys = {ALC: pccApi.voyALC, FS: pccApi.voyFS, HT: pccApi.voyHT, SS: pccApi.SS}
            for(let alert of pccApi.UCA){
                if(alert.acq===false){
                    if(alert.impact.includes('fs')) {
                        pccApi.voyFS=2
                        fsInc.push(alert)
                        for(let ss of pccApi.SS){
                            ss.voyFS=2
                            ss.voyPA=2
                        }
                    }
                    if(alert.impact.includes('ht')) {
                        pccApi.voyHT=2
                        htInc.push(alert)
                        for(let ss of pccApi.SS){
                            ss.voyHTAutABS=2
                            ss.voyHT=2
                            ss.voyPA=2
                        }
                    }
                    if(alert.origin==='alc'){
                        pccApi.voyALC=2
                        alcInc.push(alert)
                    }
                } else if (alert.acq===true){
                    if(alert.impact.includes('fs')) {
                        if(!(pccApi.voyFS===2)) pccApi.voyFS=1
                        fsInc.push(alert)
                        for(let ss of pccApi.SS){
                            if(!(ss.voyFS===2)) ss.voyFS=1
                            if(!(ss.voyPA===2)) ss.voyPA=1
                        }
                    }
                    if(alert.impact.includes('ht')) {
                        if(!(pccApi.voyHT===2)) pccApi.voyHT=1
                        htInc.push(alert)
                        for(let ss of pccApi.SS){
                            if(!(ss.voyHTAutABS===2)) ss.voyHTAutABS=1
                            if(!(ss.voyHT===2)) ss.voyHT=1
                            if(!(ss.voyPA===2)) ss.voyPA=1
                        }
                    }
                    if(alert.origin==='alc'){
                        if(!(pccApi.voyALC===2)) pccApi.voyALC=1
                        alcInc.push(alert)
                    }
                }
            }
            if(fsInc.length===0) {
                if(isSomeComActivated('fs')) pccApi.voyFS=true
                for(let ss of pccApi.SS){
                    if(ss.comCoupFS===false && isSomeComActivated('fs')) ss.voyFS=true
                    if(ss.comAutHT===false && ss.voyAlim===true && ss.voyDHT===true && ss.voyRU===true && ss.comCoupFS===false && ss.voyFS===true) ss.voyPA=true
                }
            }
            if(htInc.length===0) {
                if(isSomeComActivated('ht')) pccApi.voyHT=true
                for(let ss of pccApi.SS){
                    if(isSomeComActivated('ht')) ss.voyHTAutABS=true
                    if(ss.comAutHT===false && ss.voyAlim===true && ss.voyDHT===true && ss.voyRU===true && isSomeComActivated('ht')) ss.voyHT=true
                    if(ss.comAutHT===false && ss.voyAlim===true && ss.voyDHT===true && ss.voyRU===true && ss.comCoupFS===false) ss.voyPA=true
                }
            }
            if(alcInc.length===0) {
                pccApi.voyALC=true
            }
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            return exports.fUCA=true
        }
    },10)
}

function isSomeComActivated(target){
    switch(target){
        case 'ht':
            if(pccApi.comAG===false && pccApi.comArmPR===true && pccApi.comAuth===true) return true;
            return false;
        case 'fs':
            if(pccApi.comFSLine===false) return true;
            return false;
    }
}
let selectMenuTrain = document.getElementById('trainSelect');
let selectValueTrain = false

//INFOS TRAIN HEAD
let trainNumberTrain = document.getElementById('trainNumberTrain')
let trainCanton = document.getElementById('trainCanton')
let trainAsso = document.getElementById('trainAsso')
let trainSpeed = document.getElementById('trainSpeed')
let trainState = document.getElementById('trainState')
let trainGSec = document.getElementById('trainGSec')
let trainMission = document.getElementById('trainMission')
let fuCount = document.getElementById('fuCount')
let fuCountInput = document.getElementById('fuCountInput')

let btnAcquitTrain = document.getElementById('btnAcquitTrain')

let jeTeMontreTonUUID = document.getElementById('uuidTrain')

let ws = new WebSocket('ws://localhost:8081')
let data=false

let uuid = false;
let usrname = username


let fileIntervals=[]

import sm from './sm.js'
sm.init()

sm.registerSound('gong', './src/formats/gong.mp3')
sm.registerSound('gongChange', './src/formats/gong.mp3')
sm.registerSound('w','./src/formats/warn.mp3')

let warnInterval = false

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

ws.addEventListener('open', ()=> {
    console.log('Connecté au WS')
    const weweOnAttends = async() => {
        await sleep(100)
        ws.send(JSON.stringify({
            op: 1,
            from: "TRAIN",
            uname: username||localStorage.getItem('dUsername')
        }));
        console.log(username)
    }
    weweOnAttends()

    ws.addEventListener('message', msg =>{
        data = JSON.parse(msg.data);
        console.log(data);

        if(!(data.op)){
            let trains = []
            let inflationDuPrixDuCarburant = 0
            for (let sec of data.SEC){
                for (let ctns of sec.cantons){
                    if(!(ctns.trains.length >=1)) continue;
                    console.log('canton '+ctns.cid)
                    for (let train of ctns.trains){
                        console.log(train)
                        trains.push({tname: train.tid})
                        let opt = document.createElement('OPTION')
                        opt.innerHTML=train.tid
                        opt.value=train.tid
                        opt.classList='trainOpt'
                        opt.id=train.tid
                        selectMenuTrain.appendChild(opt)
                    }
                }
                inflationDuPrixDuCarburant++
            }
            console.log(trains)
            ws.send(JSON.stringify({
                op: 2,
                demande: 'GET-UUID?'
            }))
        }else if(data.op===3){
            uuid=data.uuid
            jeTeMontreTonUUID.innerHTML=uuid
            console.log(uuid)
            ws.send(JSON.stringify({
                op: 4,
                demande: 'TEST-UUID?',
                uuid: uuid
            }))
        } else if (data.op===300){
            data=data.content
            let train = getTrainInfo(selectMenuTrain.value)
            console.log(train)
            updateVoy(train)
        }
    })
})

function getTrainInfo(id){
    let reponse={id: false, states: false, trains: [], secIndex: false, cIndex: false, tIndex: false}
    console.log(data.SEC)
    for (let sec of data.SEC){
        for (let ctns of sec.cantons){
            for (let train of ctns.trains){
                if(!(train.tid === id)) continue;
                console.log(train)
                reponse.trains.push(train)
                reponse.id=ctns.cid;
                if(ctns.hasOwnProperty('type')) {
                    reponse.states=ctns.states
                }
            }
        }
    }
    for (let sec in data.SEC){
        for (let ctns in data.SEC[sec].cantons){
            for(let train in data.SEC[sec].cantons[ctns].trains){
                if(!(data.SEC[sec].cantons[ctns].trains[train].tid === id)) continue;
                reponse.tIndex=train
                reponse.secIndex=sec;
                reponse.cIndex=ctns;
            }
        }
    }
    return reponse;
}

function yaUnDefautQQPart(){
    for(let staOpt of document.getElementsByClassName('stationOpt')){
        staOpt.classList.remove('alarm')
    }
    let defList=[]
    for (let sec in data.SEC){
        for (let ctns in data.SEC[sec].cantons){
            if(typeof data.SEC[sec].cantons[ctns].type === 'undefined') continue;
            for(const property of Object.entries(data.SEC[sec].cantons[ctns].states)){
                if(!(property[1] === 1 || property[1] === 2)) continue;
                defList.push(data.SEC[sec].cantons[ctns].name)
            }
        }
    }
    console.log(defList)
    for (let sta in defList){
        console.log(defList[sta])
        let elem = document.getElementById(defList[sta])
        elem.classList.toggle('alarm',true)
    }
}

selectMenuTrain.addEventListener('input', () => {
    selectValueTrain = selectMenuTrain.value
    let train = getTrainInfo(selectMenuTrain.value)
    console.log(train)
    updateVoy(train)
})

const blinkIntervalId = new Map()

let beepIntervalId = false

let blinkIdReturn = 0

function updateVoy(c){

    console.log(c)

    trainNumberTrain.value=c.trains[0].tid
    trainCanton.value=c.id.replace('c','')

    if(data.SEC[c.secIndex].id!=='GAT'){
        trainGSec.value='ABS'
    } else {
        trainGSec.value='GAT'
    }

    let actualTState=c.trains[0].states

    if(actualTState.pretTrain===false){
        trainState.value='TNE/NI'
        trainState.classList.toggle('alarm',true)
        trainState.classList.remove('ok')
    }else if(actualTState.pretTrain===true){
        trainState.value='PRÊT'
        trainState.classList.toggle('ok',true)
        trainState.classList.remove('alarm')
    }

    if(actualTState.speed===false){
        trainSpeed.value='TMS!'
        trainSpeed.classList.toggle('alarm',true)
        trainSpeed.classList.remove('ok')
    }else{
        trainState.value=actualTState.speed
        trainSpeed.classList.remove('alarm')
    }

    fuCountInput.value=actualTState.cptFu
    if(actualTState.cptFu>0){
        fuCount.classList.toggle('alarm',true)
        fuCountInput.classList.toggle('alarm',true)
    }else{
        fuCount.classList.remove('alarm')
        fuCountInput.classList.remove('alarm')
    }

    if(actualTState.mission===false){
        trainMission.value='/'
    } else {
        trainMission.value=actualTState.mission
    }

    if(data.SEC[c.secIndex].cantons[c.cIndex].trains[1]){
        trainAsso.value=data.SEC[c.secIndex].cantons[c.cIndex].trains[1].tid
    } else trainAsso.value='NON'

    for(let interval of fileIntervals){
        if(interval===beepIntervalId) continue;
        clearInterval(interval)
    }

    //yaUnDefautQQPart()

    sm.playSound('gongChange', 2)
    
    for (let voy of document.getElementsByClassName('voyTrainState')){
        let elemid = voy.id
        let elem=document.getElementById(elemid)

        switch(c.trains[0].states[elemid]){
            case false:
                console.log(elemid+' faux.')
                voy.classList.remove('ok')
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                break;
            case true:
                console.log(elemid+' true.')
                voy.classList.toggle('ok', true)
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                break;
            case 1:
                console.log(elemid+' Alarme')
                voy.classList.remove('ok')
                voy.classList.toggle('alarm', true)
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                break;
            case 2:
                console.log(elemid+' Anomalie')
                voy.classList.remove('ok')
                voy.classList.toggle('alarm',true)
                let blinkId = setInterval(async function() {
                    voy.classList.toggle('alarm')
                }, 500)
                if(blinkId>=10000) alert('blinkId>=10000, relancer la page!')
                console.log(blinkId)
                blinkIntervalId.set(elemid, blinkId)
                console.log(blinkIntervalId)
                fileIntervals.push(blinkId)
                break;
        }
    }
    /*if(s.trains[0]){
        console.log(s.trains[0])
        trainNumber.value=s.trains[0].tid
        for (let voy of document.getElementsByClassName('voyStationTrain')){
            let elemid = voy.id
    
            switch(s.trains[0].states[elemid]){
                case false:
                    console.log(elemid+' faux.')
                    voy.classList.remove('ok')
                    voy.classList.remove('alarm')
                    blinkIdReturn = blinkIntervalId.get(elemid)
                    clearInterval(blinkIdReturn)
                    clearInterval(blinkIdReturn-1)
                    blinkIntervalId.delete(elemid)
                    break;
                case true:
                    blinkIdReturn = blinkIntervalId.get(elemid)
                    clearInterval(blinkIdReturn)
                    clearInterval(blinkIdReturn-1)
                    blinkIntervalId.delete(elemid)
                    console.log(elemid+' true.')
                    voy.classList.toggle('ok', true)
                    voy.classList.remove('alarm')
                    break;
                case 1:
                    console.log(elemid+' Alarme')
                    voy.classList.remove('ok')
                    voy.classList.toggle('alarm', true)
                    blinkIdReturn = blinkIntervalId.get(elemid)
                    clearInterval(blinkIdReturn)
                    clearInterval(blinkIdReturn-1)
                    blinkIntervalId.delete(elemid)
                    break;
                case 2:
                    console.log(elemid+' Anomalie')
                    voy.classList.remove('ok')
                    voy.classList.toggle('alarm',true)
                    let blinkId = setInterval(async function() {
                        voy.classList.toggle('alarm')
                    }, 500)
                    if(blinkId>=10000) alert('blinkId>=10000, relancer la page!')
                    console.log(blinkId)
                    blinkIntervalId.set(elemid, blinkId)
                    console.log(blinkIntervalId)
                    fileIntervals.push(blinkId)
                    break;
            }
        }
        console.log(fileIntervals)
    } else {
        for(let voy of document.getElementsByClassName('voyStationTrain')){
            voy.classList.remove('ok')
            voy.classList.remove('alarm')
        }
        trainNumber.value='NON'
    }*/
    console.log(blinkIntervalId)
    if (blinkIntervalId.size >= 1) {
        console.log(blinkIntervalId+blinkIntervalId.size)
        sm.playSound('gong', 2)
        if(beepIntervalId!=false) return;
        beepIntervalId = setInterval(async () => {
            sm.playSound('gong', 2)
            //sm.stopFreq(2959)
        }, 1000)
    } else {
        console.log('stop')
        clearInterval(beepIntervalId)
        beepIntervalId=false
        sm.stopSound('gong')
    }
}

btnClosePP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "CLOSEPP-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnOpenPP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "OPENPP-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnOpenPV.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    ws.send(JSON.stringify({
        op: 204,
        execute: "OPENPV-BTN",
        target: trainId,
        uuid: uuid
    }));
    trainOrderAffect.style.backgroundColor='white'
})

btnClosePV.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    ws.send(JSON.stringify({
        op: 204,
        execute: "CLOSEPV-BTN",
        target: trainId,
        uuid: uuid
    }));
    trainOrderAffect.style.backgroundColor='white'
})

btnPartialPPOpeningInc.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "GENRATEINC-PARTIALPPOPEN-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnPartialPPClosingInc.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "GENRATEINC-PARTIALPPCLOSE-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnTotalPPOpeningInc.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "GENRATEINC-TOTALPPOPEN-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnTotalPPClosingInc.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "GENRATEINC-TOTALPPCLOSE-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnReset.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "GENRATEINC-RESET-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnAcquitStation.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "AQC-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

ckbZopp.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbZopp.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "ZOPP-ON-COM",
            target: trainId,
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "ZOPP-OFF-COM",
            target: trainId,
            uuid: uuid
        }));
    }
})

ckbSafe.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbSafe.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "SAFE-ON-COM",
            target: trainId,
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "SAFE-OFF-COM",
            target: trainId,
            uuid: uuid
        }));
    }
})

ckbObs.addEventListener('input', ()=>{
    if(ckbObs.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "OBS-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "OBS-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    }
})

ckbUnlockPMS.addEventListener('input', ()=>{
    if(ckbUnlockPMS.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSUNLOCK-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSUNLOCK-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    }
})

ckbManualExploit.addEventListener('input', ()=>{
    if(ckbManualExploit.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSMANUAL-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSMANUAL-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    }
})

ckbMaintenance.addEventListener('input', ()=>{
    if(ckbMaintenance.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSMAINT-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "PMSMAINT-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    }
})

btnActiveHLP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "HLP-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnInactiveHLP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "HLP-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnActiveDSO.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "DSO-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnInactiveDSO.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "DSO-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnIhibIDPOPLTP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "INHIBPLTPIDPO-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnIhibIDPOALC.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "INHIBALCIDPO-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

ckbObsVeh.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbObsVeh.checked){
        ws.send(JSON.stringify({
            op: 204,
            execute: "OBSVEH-ON-COM",
            target: trainId,
            uuid: uuid
        }));
    } else {
        ws.send(JSON.stringify({
            op: 204,
            execute: "OBSVEH-OFF-COM",
            target: trainId,
            uuid: uuid
        }));
    }
})

btnSetTime.addEventListener('click', ()=>{
    if(!newTime.value){
        newTime.style.backgroundColor='#EC2020'
        return;
    }
    ws.send(JSON.stringify({
        op: 204,
        execute: "SETTIME-BTN",
        new: newTime.value,
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
    
})

btnEmCall.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    ws.send(JSON.stringify({
        op: 204,
        execute: "EMCALL-BTN",
        target: trainId,
        uuid: uuid
    }));
    trainOrderAffect.style.backgroundColor='white'
})

btnAcqEmCall.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    ws.send(JSON.stringify({
        op: 204,
        execute: "ACQEMCALL-BTN",
        target: trainId,
        uuid: uuid
    }));
    trainOrderAffect.style.backgroundColor='white'
})

btnAFD.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "AFD-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZAFD.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "AFD-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnVVTS1.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS1-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZVVTS1.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS1-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnInhibVVTS1.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS1-INHIB-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnVVTS2.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS2-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZVVTS2.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS2-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnInhibVVTS2.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "VVTS2-INHIB-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnDEPA.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "DEPA-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZdepa.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "DEPA-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnIDPF.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "IDPF-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZidpf.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "IDPF-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnMAPF.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "MAPF-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZmapf.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "MAPF-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnISTA.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "ISTA-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})

btnRAZista.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "ISTA-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: uuid
    }));
})
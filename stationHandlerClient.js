let selectMenu = document.getElementById('stationSelect');
let selectValue = false

let quaiTitle = document.getElementById('quaiTitle')

//voyants
let trainNumber = document.getElementById('trainNumber')

let btnActiveHLP = document.getElementById('btnActiveHLP')
let btnActiveDSO = document.getElementById('btnActiveDSO')
let btnInactiveHLP = document.getElementById('btnInactiveHLP')
let btnInactiveDSO = document.getElementById('btnInactiveDSO')
let btnIhibIDPOPLTP = document.getElementById('btnIhibIDPOPLTP')

let btnSetTime = document.getElementById('btnSetTime')
let newTime = document.getElementById('newTime')
let actualTime = document.getElementById('actualTime')

//commandes
let btnAFD = document.getElementById('btnAFD')
let btnRAZAFD = document.getElementById('btnRAZAFD')
let btnVVTS1 = document.getElementById('btnVVTS1')
let btnRAZVVTS1 = document.getElementById('btnRAZVVTS1')
let btnVVTS2 = document.getElementById('btnVVTS2')
let btnRAZVVTS2 = document.getElementById('btnRAZVVTS2')
let btnDEPA = document.getElementById('btnDEPA')
let btnRAZdepa = document.getElementById('btnRAZdepa')
let btnIDPF = document.getElementById('btnIDPF')
let btnRAZidpf = document.getElementById('btnRAZidpf')
let btnISTA = document.getElementById('btnISTA')
let btnRAZista = document.getElementById('btnRAZista')
let btnMAPF = document.getElementById('btnMAPF')
let btnRAZmapf = document.getElementById('btnRAZmapf')
let btnInhibVVTS1 = document.getElementById('btnInhibVVTS1')
let btnInhibVVTS2 = document.getElementById('btnInhibVVTS2')

//btnAnomalies
let btnPartialPPOpeningInc = document.getElementById('btnPartialPPOpeningInc')
let btnPartialPPClosingInc = document.getElementById('btnPartialPPClosingInc')
let btnTotalPPOpeningInc = document.getElementById('btnTotalPPOpeningInc')
let btnTotalPPClosingInc = document.getElementById('btnTotalPPClosingInc')
let ckbObs = document.getElementById('ckbObs')
let btnEmCall =document.getElementById('btnEmCall')
let btnAcqEmCall = document.getElementById('btnAcqEmCall')
let btnReset = document.getElementById('btnReset')

//btn actions
let btnOpenPV = document.getElementById('btnOpenPV')
let btnClosePV = document.getElementById('btnClosePV')
let btnOpenPP = document.getElementById('btnOpenPP')
let btnClosePP = document.getElementById('btnClosePP')
let trainOrderAffect = document.getElementById('trainOrderAffect')
let ckbZopp = document.getElementById('ckbZopp')
let ckbSafe = document.getElementById('ckbSafe')
let ckbUnlockPMS = document.getElementById('ckbUnlockPMS')
let ckbManualExploit = document.getElementById('ckbManualExploit')
let ckbMaintenance = document.getElementById('ckbMaintenance')
let ckbObsVeh = document.getElementById('ckbObsVeh')

let btnAcquitStation = document.getElementById('btnAcquitStation')

let jeTeMontreTonUUID = document.getElementById('uuidStation')

quaiTitle.innerHTML=selectMenu.value

let ws = new WebSocket('ws://localhost:8081')
let data=false

let uuid = false;


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

async function faireBip(){
    warnInterval=setInterval(async function() {
        selectMenu.classList.toggle('warn')
        sm.playSound('w')
        console.log('bip')
    }, 250)
    await sleep(3000)
    console.log('boup')
    clearInterval(warnInterval)
    selectMenu.classList.remove('warn')
}

faireBip()

ws.addEventListener('open', ()=> {
    console.log('Connecté au WS')
    ws.send(JSON.stringify({
        op: 1,
        from: "STATION"
    }));

    ws.addEventListener('close', ()=>{
        alert('Le serveur viens de crash! Merci de signaler l\'erreur à La Patate Douce sur discord.gg/pmd en indiquant les actions effectuées!')
    })

    ws.addEventListener('error',()=>{
        alert('Le serveur viens de crash! Merci de signaler l\'erreur à La Patate Douce sur discord.gg/pmd en indiquant les actions effectuées!')
    })

    ws.addEventListener('message', msg =>{
        data = JSON.parse(msg.data);
        console.log(data);

        if(!(data.op)){
            let sections = []
            let inflationDuPrixDuCarburant = 0
            for (let sec of data.SEC){
                sections.push({sec : 'SECTION '+sec.id, quais: []})
                let gr = document.createElement('OPTGROUP')
                gr.label='SECTION '+sec.id
                selectMenu.appendChild(gr)
                for (let ctns of sec.cantons){
                    if(!(ctns.hasOwnProperty('type'))) continue;
                    console.log(ctns.type+' canton '+ctns.cid+' appelée '+ctns.name)
                    sections[inflationDuPrixDuCarburant].quais.push({sname: ctns.name})
                    let opt = document.createElement('OPTION')
                    opt.innerHTML=ctns.name
                    opt.value=ctns.name
                    gr.appendChild(opt)
                }
                inflationDuPrixDuCarburant++
            }
            console.log(sections)
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
            let station = getStationsInfo(selectMenu.value)
            updateVoy(station)
        }
    })
})

function getStationsInfo(id){
    let reponse={name: false, id: false, states: false, trains: [], secIndex: false, cIndex: false}
    console.log(data.SEC)
    for (let sec of data.SEC){
        for (let ctns of sec.cantons){
            if(!(ctns.hasOwnProperty('type'))) continue;
            if(!(ctns.name === id)) continue;
            console.log(ctns.type+' canton '+ctns.cid+' appelée '+ctns.name)
            reponse.id=ctns.cid;

            reponse.name=ctns.name;

            reponse.states=ctns.states
            for (let train of ctns.trains){
                console.log(train)
                reponse.trains.push(train)
            }
        }
    }
    let complementALaReponseParcequeOnEnAJamaisAssez = getStationProperties(id)
    reponse.secIndex=complementALaReponseParcequeOnEnAJamaisAssez.secIndex;
    reponse.cIndex=complementALaReponseParcequeOnEnAJamaisAssez.cIndex;
    return reponse;
}

function getStationProperties(id){
    let reponse={name: false, id: false, secIndex: false, cIndex: false}
    for (let sec in data.SEC){
        for (let ctns in data.SEC[sec].cantons){
            if(typeof data.SEC[sec].cantons[ctns].type === 'undefined') continue;
            if(!(data.SEC[sec].cantons[ctns].name === id)) continue;
            reponse.id=data.SEC[sec].cantons[ctns].cid;
            reponse.name=data.SEC[sec].cantons[ctns].name;
            reponse.secIndex=sec;
            reponse.cIndex=ctns;
        }
    }
    return reponse;
}

selectMenu.addEventListener('input', () => {
    selectValue = selectMenu.value
    let station = getStationsInfo(selectMenu.value)
    quaiTitle.innerHTML=selectMenu.value
    console.log(station)
    updateVoy(station)
})

const blinkIntervalId = new Map()

let beepIntervalId = false

let blinkIdReturn = 0

function updateVoy(s){

    for(let interval of fileIntervals){
        if(interval===beepIntervalId) continue;
        clearInterval(interval)
    }

    sm.playSound('gongChange', 2)
    
    actualTime.value=s.states.actualTime

    
    for (let voy of document.getElementsByClassName('voyStationState')){
        let elemid = voy.id
        let elem=document.getElementById(elemid)

        switch(s.states[elemid]){
            case false:
                console.log(elemid+' faux.')
                voy.classList.remove('ok')
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                if(elemid==='IDPOAlreadyActiveByPLTP'){
                    btnInactiveDSO.disabled=false
                    btnActiveDSO.disabled=false
                }
                break;
            case true:
                console.log(elemid+' true.')
                voy.classList.toggle('ok', true)
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                if((elemid==='IDPOAlreadyActiveByPLTP' && s.states['PLTPIDPOInhibed']==false)||(elemid==='IDPOAlreadyActiveByALC' && s.states['ALCIDPOInhibed']==false)){
                    btnInactiveDSO.disabled=true
                    btnActiveDSO.disabled=true
                } else {
                    btnInactiveDSO.disabled=true
                    btnActiveDSO.disabled=true
                }
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
    if(s.trains[0]){
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
    }
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

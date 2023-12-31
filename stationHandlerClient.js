let selectMenu = document.getElementById('stationSelect');
let selectValue = false

let quaiTitle = document.getElementById('quaiTitle')

//voyants
let trainNumber = document.getElementById('trainNumber')

let btnActiveDSO = document.getElementById('btnActiveDSO')
let btnActiveSSO = document.getElementById('btnActiveSSO')
let btnInactiveSSO = document.getElementById('btnInactiveSSO')
let btnInactiveDSO = document.getElementById('btnInactiveDSO')
let btnIhibIDPOPLTP = document.getElementById('btnIhibIDPOPLTP')

let btnSetTime = document.getElementById('btnSetTime')
let newTime = document.getElementById('newTime')
let actualTime = document.getElementById('actualTime')

//commandes
let btnAFD = document.getElementById('btnAFD')
let btnRAZAFD = document.getElementById('btnRAZAFD')

let btnCMCC = document.getElementById('btnCMCC')
let btnCMCP = document.getElementById('btnCMCP')
let btnRAZCMC = document.getElementById('btnRAZCMC')
let btnSS = document.getElementById('btnSS')
let btnSSO = document.getElementById('btnSSO')
let btnRAZSS = document.getElementById('btnRAZSS')
let btnRP10 = document.getElementById('btnRP10')
let btnRP30 = document.getElementById('btnRP30')
let btnRAZRP = document.getElementById('btnRAZRP')
let btnPSV = document.getElementById('btnPSV')
let btnRAZPSV = document.getElementById('btnRAZPSV')
let btnAAHS = document.getElementById('btnAAHS')
let btnRAZAAHS = document.getElementById('btnRAZAAHS')

let btnDEPA = document.getElementById('btnDEPA')
let btnRAZdepa = document.getElementById('btnRAZdepa')
let btnIDPF = document.getElementById('btnIDPF')
let btnRAZidpf = document.getElementById('btnRAZidpf')
let btnISTA = document.getElementById('btnISTA')
let btnRAZista = document.getElementById('btnRAZista')
let btnMAPF = document.getElementById('btnMAPF')
let btnRAZmapf = document.getElementById('btnRAZmapf')

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

let listDef = document.getElementById('listDef')

quaiTitle.innerHTML=selectMenu.value
let copyConfig = document.getElementById('copyConfig')
let showRequest = document.getElementById('request')
//let window.WebSocket = new WebSocket('window.WebSocket://localhost:8081')
let data=false

let uuid = false;
let usrname = username

let keystroke = []

window.addEventListener('keydown', (e)=>{
    keystroke.push(e.code)
    if(keystroke[0]==='ControlLeft' && keystroke[1]==='ShiftLeft' && keystroke[2]==='AltLeft' && keystroke[3]==='KeyQ' && keystroke[4]==='KeyS'){
        keystroke = []
        window.WebSocket.send(JSON.stringify({
            op: 204,
            execute: "AQC-BTN",
            target: getStationsInfo(selectMenu.value),
            uuid: uuid
        }));
    } else {
        async function waitABit(){
            await sleep(500)
            keystroke = []
        }
        waitABit()
    }
})

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

//faireBip()

//window.WebSocket.addEventListener('open', ()=> {
    console.log('Connecté au WS')
    /*const weweOnAttends = async() => {
        await sleep(100)
        window.WebSocket.send(JSON.stringify({
            op: 1,
            from: "STATION",
            uname: username||localStorage.getItem('dUsername')
        }));
        console.log(username)
    }
    weweOnAttends()*/

    window.WebSocket.addEventListener('close', ()=>{
        window.notyf.open({
            type: 'error',
            message: `La connection a été interompue.`
        })
    })

    window.WebSocket.addEventListener('error',()=>{
        window.notyf.open({
            type: 'error',
            message: `Le serveur est injoignable.`
        })
    })

    window.WebSocket.addEventListener('message', msg =>{
        data = JSON.parse(msg.data);
        //console.log(data);

        if(!(data.op)){

            /*window.WebSocket.send(JSON.stringify({
                op: 2,
                demande: 'GET-UUID?'
            }))*/
        }else if(data.op===3){
            //uuid=data.uuid
            /*console.log(uuid)
            window.WebSocket.send(JSON.stringify({
                op: 4,
                demande: 'TEST-UUID?',
                uuid: uuid
            }))*/
        } else if ((data.op===300)||(data.op===2)||(data.op===10)){
            
            let op=data.op
            data=data.content
            if(op===2){
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
                        opt.classList='stationOpt'
                        opt.id=ctns.name
                        opt.class='staOpt'
                        gr.appendChild(opt)
                    }
                    inflationDuPrixDuCarburant++
                }
                console.log(sections)
            }
            let station = getStationsInfo(selectMenu.value)
            updateVoy(station)
        }
    })
//})

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
                let trainObj=data.trains[train]
                reponse.trains.push(trainObj)
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

function yaUnDefautQQPart(){
    for(let staOpt of document.getElementsByClassName('stationOpt')){
        staOpt.classList.remove('alarm')
        staOpt.innerText=staOpt.id
    }
    clearInterval(beepIntervalId)
    sm.stopSound('gong')
    listDef.innerHTML=''
    let defList=[]
    let anoList=[]
    for (let sec in data.SEC){
        for (let ctns in data.SEC[sec].cantons){
            if(typeof data.SEC[sec].cantons[ctns].type === 'undefined') continue;
            for(const property of Object.entries(data.SEC[sec].cantons[ctns].states)){
                if(!(property[1] === 1 || property[1] === 2)) continue;
                if(property[0]==='ldi'||property[0]==='pzo'||property[0]==='tcs'||property[0]==='pdp'||property[0]==='coupFs') continue;
                if(property[1] === 1){
                    defList.push(data.SEC[sec].cantons[ctns].name)
                }
                if(property[1] === 2){
                    anoList.push({name:data.SEC[sec].cantons[ctns].name,def:property[0]})
                }
            }
        }
    }
    console.log(defList)
    for (let sta in defList){
        console.log(defList)
        let elem = document.getElementById(defList[sta])
        console.log(elem)
        elem.innerText='🟥' +defList[sta]
    }
    for (let sta in anoList){
        let defDiv = document.createElement('div')
        defDiv.id=anoList[sta]
        let staName = document.createElement('mark')
        staName.innerText=anoList[sta].name
        let defName = document.createElement('span')
        defName.innerText=' '+anoList[sta].def
        defDiv.appendChild(staName)
        defDiv.appendChild(defName)
        listDef.appendChild(defDiv)
        let elem = document.getElementById(anoList[sta].name)
        elem.classList.add('alarm',true)
    }
    if (anoList.length >= 1){
        beepIntervalId = setInterval(async () => {
            sm.playSound('gong', 2)
            //sm.stopFreq(2959)
        }, 1000)
    } else {
        clearInterval(beepIntervalId)
        sm.stopSound('gong')
    }
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

let IQ = 
{
    "dso":document.getElementById('iq_dso'),
    "late":document.getElementById('iq_retard'),
    "aahs":document.getElementById('iq_aa_hs'),
    "psv":document.getElementById('iq_psv'),
    "sso":document.getElementById('iq_ss_sso'),
    "cm":document.getElementById('iq_cm'),
    "rp":document.getElementById('iq_rp')
}

function updateVoy(s){

    for(let interval of fileIntervals){
        if(interval===beepIntervalId) continue;
        clearInterval(interval)
    }

    yaUnDefautQQPart()

    if(s.states.DSO===true){
        IQ.dso.classList.add('on')
    } else {
        IQ.dso.classList.remove('on')
    }
    if(s.states.PSV===true){
        IQ.psv.classList.add('on')
    } else {
        IQ.psv.classList.remove('on')
    }
    if(s.states.AAHS===true){
        IQ.aahs.classList.add('on')
    } else {
        IQ.aahs.classList.remove('on')
    }
    if(s.states.SSO===true){
        IQ.sso.classList.add('on')
        IQ.sso.innerText='SSO'
    } else if(s.states.SS===true){
        IQ.sso.classList.add('on')
        IQ.sso.innerText='SS'
    } else if (s.states.SS===false&&s.states.SSO===false){
        IQ.sso.classList.remove('on')
    }
    if(s.states.CMCC===true){
        IQ.cm.classList.add('on')
        IQ.cm.innerText='CMCC'
    } else if(s.states.CMCP===true){
        IQ.cm.classList.add('on')
        IQ.cm.innerText='CMCP'
    } else if (s.states.CMCC===false&&s.states.CMCP===false){
        IQ.cm.classList.remove('on')
    }
    if(s.states.RP10===true){
        IQ.rp.classList.add('on')
        IQ.rp.innerText='RP10'
    } else if(s.states.RP30===true){
        IQ.rp.classList.add('on')
        IQ.rp.innerText='RP30'
    } else if (s.states.RP10===false&&s.states.RP30===false){
        IQ.rp.classList.remove('on')
    }  
    actualTime.value=s.states.actualTime
    IQ.late.innerText=s.states.late

    
    for (let voy of document.getElementsByClassName('voyStationState')){
        let elemid = voy.id
        let elem=document.getElementById(elemid)

        switch(s.states[elemid]){
            case false:
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
                    btnInactiveDSO.disabled=false
                    btnActiveDSO.disabled=false
                }
                break;
            case 1:
                voy.classList.remove('ok')
                voy.classList.toggle('alarm', true)
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                break;
            case 2:
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
    /*if (blinkIntervalId.size >= 1) {
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
    }*/
}

btnClosePP.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CLOSEPP-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnOpenPP.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "OPENPP-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.actualRequest = actualRequest
    window.WebSocket.send(actualRequest);
})

btnOpenPV.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    actualRequest = JSON.stringify({
        op: 204,
        execute: "OPENPV-BTN",
        target: trainId,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
    trainOrderAffect.style.backgroundColor='white'
})

btnClosePV.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CLOSEPV-BTN",
        target: trainId,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
    trainOrderAffect.style.backgroundColor='white'
})

btnPartialPPOpeningInc.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "GENRATEINC-PARTIALPPOPEN-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnPartialPPClosingInc.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "GENRATEINC-PARTIALPPCLOSE-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnTotalPPOpeningInc.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "GENRATEINC-TOTALPPOPEN-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnTotalPPClosingInc.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "GENRATEINC-TOTALPPCLOSE-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnReset.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "GENRATEINC-RESET-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnAcquitStation.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AQC-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

ckbZopp.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbZopp.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "ZOPP-ON-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "ZOPP-OFF-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

ckbSafe.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbSafe.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "SAFE-ON-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "SAFE-OFF-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

ckbObs.addEventListener('input', ()=>{
    if(ckbObs.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "OBS-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "OBS-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

ckbUnlockPMS.addEventListener('input', ()=>{
    if(ckbUnlockPMS.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSUNLOCK-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSUNLOCK-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

ckbManualExploit.addEventListener('input', ()=>{
    if(ckbManualExploit.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSMANUAL-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSMANUAL-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

ckbMaintenance.addEventListener('input', ()=>{
    if(ckbMaintenance.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSMAINT-ON-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "PMSMAINT-OFF-COM",
            target: getStationsInfo(selectMenu.value),
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

btnActiveDSO.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "DSO-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnInactiveDSO.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "DSO-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

//! CHANGE QUAI

btnSSO.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "SSO-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnSS.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "SS-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZSS.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "SS-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRP10.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "RP10-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRP30.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "RP30-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZRP.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "RP-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnCMCC.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CMCC-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnCMCP.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CMCP-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZCMC.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CMC-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnPSV.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "PSV-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZPSV.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "PSV-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnAAHS.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AAHS-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZAAHS.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AAHS-OFF-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnIhibIDPOPLTP.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "INHIBPLTPIDPO-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnIhibIDPOALC.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "INHIBALCIDPO-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

ckbObsVeh.addEventListener('input', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    if(ckbObsVeh.checked){
        actualRequest = JSON.stringify({
            op: 204,
            execute: "OBSVEH-ON-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else {
        actualRequest = JSON.stringify({
            op: 204,
            execute: "OBSVEH-OFF-COM",
            target: trainId,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

btnSetTime.addEventListener('click', ()=>{
    if(!newTime.value){
        newTime.style.backgroundColor='#EC2020'
        return;
    }
    actualRequest = JSON.stringify({
        op: 204,
        execute: "SETTIME-BTN",
        new: newTime.value,
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
    
})

btnEmCall.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    actualRequest = JSON.stringify({
        op: 204,
        execute: "EMCALL-BTN",
        target: trainId,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
    trainOrderAffect.style.backgroundColor='white'
})

btnAcqEmCall.addEventListener('click', ()=>{
    let trainId = parseFloat(trainOrderAffect.value)
    if(!trainId){
        trainOrderAffect.style.backgroundColor='#EC2020'
        return;
    }
    actualRequest = JSON.stringify({
        op: 204,
        execute: "ACQEMCALL-BTN",
        target: trainId,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
    trainOrderAffect.style.backgroundColor='white'
})

btnAFD.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AFD-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZAFD.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AFD-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnVVTS1.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS1-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZVVTS1.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS1-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnInhibVVTS1.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS1-INHIB-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnVVTS2.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS2-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZVVTS2.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS2-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnInhibVVTS2.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "VVTS2-INHIB-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnDEPA.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "DEPA-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZdepa.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "DEPA-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnIDPF.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "IDPF-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZidpf.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "IDPF-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnMAPF.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "MAPF-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZmapf.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "MAPF-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnISTA.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "ISTA-ON-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnRAZista.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "ISTA-RAZ-BTN",
        target: getStationsInfo(selectMenu.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
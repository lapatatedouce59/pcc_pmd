let selectMenuTrain = document.getElementById('trainSelect');
let selectValueTrain = false

let previousSelected = '2'

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

//BOUTONS CONTROLE
let btnAcquitTrain = document.getElementById('btnAcquitTrain')
let btnAcqComptFu = document.getElementById('btnAcqComptFu')
let fuCreate = document.getElementById('fuCreate')
let fuReleave = document.getElementById('fuReleave')

//BOUTONS RP
let btnEveil = document.getElementById('btnEveil')
let btnEndorm = document.getElementById('btnEndorm')
let btnPrep = document.getElementById('btnPrep')
let btnDeprep = document.getElementById('btnDeprep')

let copyConfig = document.getElementById('copyConfig')
let showRequest = document.getElementById('request')

let listDef=document.getElementById('listDef')

let keystroke = []

window.addEventListener('keydown', (e)=>{
    keystroke.push(e.code)
    if(keystroke[0]==='ControlLeft' && keystroke[1]==='ShiftLeft' && keystroke[2]==='AltLeft' && keystroke[3]==='KeyQ' && keystroke[4]==='KeyT'){
        keystroke = []
        window.WebSocket.send(JSON.stringify({
            op: 204,
            execute: "AQC-BTN-TRAIN",
            target: getTrainInfo(selectMenuTrain.value),
            uuid: uuid
        }));
    } else {
        async function waitABit(){
            await sleep(500)
            keystroke = []
        }
        waitABit()
}})
//let window.WebSocket = new WebSocket('window.WebSocket://localhost:8081')
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

//window.WebSocket.addEventListener('open', ()=> {
    console.log('Connecté au WS')
    /*const weweOnAttends = async() => {
        await sleep(100)
        window.WebSocket.send(JSON.stringify({
            op: 1,
            from: "TRAIN",
            uname: username||localStorage.getItem('dUsername')
        }));
        console.log(username)
    }
    weweOnAttends()*/

    window.WebSocket.addEventListener('message', msg =>{
        data = JSON.parse(msg.data);
        //console.log(data);

        if(!(data.op)){

            /*window.WebSocket.send(JSON.stringify({
                op: 2,
                demande: 'GET-UUID?'
            }))*/
        }/*else if(data.op===3){
            uuid=data.uuid
            console.log(uuid)
            window.WebSocket.send(JSON.stringify({
                op: 4,
                demande: 'TEST-UUID?',
                uuid: uuid
            }))
        }*/else if ((data.op===300)||(data.op===2)||(data.op===10)){
            let op = data.op
            data=data.content

            if(op===2){
                refreshTList()
            }
            refreshTList()
            let train = getTrainInfo(selectValueTrain || selectMenuTrain.value)
            console.log(train)
            updateVoy(train)
        }
    })
//})
let trainsAlreadyCreated = []
function refreshTList(){

    let inflationDuPrixDuCarburant = 0
    for (let sec of data.SEC){
        for (let ctns of sec.cantons){
            if(!(ctns.trains.length >=1)) continue;
            console.log('canton '+ctns.cid)
            for (let train of ctns.trains){
                if(trainsAlreadyCreated.includes(train.tid)) continue;
                console.log(train)
                trainsAlreadyCreated.push(train.tid)
                let opt = document.createElement('OPTION')
                opt.innerHTML=train.trainType + '-' +train.tid
                opt.setAttribute('name',train.trainType + '-' +train.tid)
                opt.value=train.tid
                opt.classList='trainOpt'
                opt.id=train.tid
                selectMenuTrain.appendChild(opt)
            }
        }
        inflationDuPrixDuCarburant++
    }
}

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

selectMenuTrain.addEventListener('input', () => {
    selectValueTrain = selectMenuTrain.value
    let train = getTrainInfo(selectMenuTrain.value)
    console.log(train)
    updateVoy(train)
})

const blinkIntervalId = new Map()

let beepIntervalId = false

let blinkIdReturn = 0

function josephineChercheLesDefauts(){

    for(let tOpt of document.getElementsByClassName('trainOpt')){
        tOpt.innerText=tOpt.getAttribute("name")
        tOpt.classList.remove('alarm')
    }
    //listDef.innerHTML=''
    clearInterval(beepIntervalId)
    sm.stopSound('gong')
    let defList=[]
    let anoList=[]
    for (let sec in data.SEC){
        for (let ctns in data.SEC[sec].cantons){
            for (let train in data.SEC[sec].cantons[ctns].trains){
                if(!(data.SEC[sec].cantons[ctns].trains[train])) continue;
                for(const property of Object.entries(data.SEC[sec].cantons[ctns].trains[train].states)){
                    if(!(property[1] === 1 || property[1] === 2)) continue;
                    if(property[1]===1){
                        defList.push({name: data.SEC[sec].cantons[ctns].trains[train].trainType + '-' + data.SEC[sec].cantons[ctns].trains[train].tid, id: data.SEC[sec].cantons[ctns].trains[train].tid})
                    }
                    if(property[1]===2){
                        anoList.push({name:data.SEC[sec].cantons[ctns].trains[train].trainType + '-' + data.SEC[sec].cantons[ctns].trains[train].tid,def:property[0],pos:data.SEC[sec].cantons[ctns].cid, id: data.SEC[sec].cantons[ctns].trains[train].tid})
                    }
                }
            }
        }
    }
    console.log(defList)
    for (let tr in defList){
        console.log(defList)
        let elem = document.getElementById(defList[tr].id)
        elem.innerText='🟥' +defList[tr].name
    }
    for (let tr in anoList){
        let defDiv = document.createElement('div')
        defDiv.id=anoList[tr].name+'DEF'
        let tName = document.createElement('mark')
        tName.innerText='Train '+anoList[tr].name
        let cName = document.createElement('strong')
        cName.innerText=' '+anoList[tr].pos
        let defName = document.createElement('span')
        defName.innerText=' '+anoList[tr].def
        defDiv.appendChild(tName)
        defDiv.appendChild(cName)
        defDiv.appendChild(defName)
        listDef.appendChild(defDiv)
        let elem = document.getElementById(anoList[tr].id)
        elem.classList.add('alarm')
    }
    if (anoList.length >= 1){
        console.log(anoList.length)
        beepIntervalId = setInterval(async () => {
            sm.playSound('gong', 2)
            //sm.stopFreq(2959)
        }, 1000)
    } else {
        clearInterval(beepIntervalId)
        sm.stopSound('gong')
    }

}

function updateVoy(c){

    josephineChercheLesDefauts()

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
        trainSpeed.value=actualTState.speed
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

    //sm.playSound('gongChange', 2)
    
    for (let voy of document.getElementsByClassName('voyTrainState')){
        let elemid = voy.id
        let elem=document.getElementById(elemid)

        switch(c.trains[0].states[elemid]){
            case false:
                voy.classList.remove('ok')
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
                break;
            case true:
                voy.classList.toggle('ok', true)
                voy.classList.remove('alarm')
                blinkIdReturn = blinkIntervalId.get(elemid)
                clearInterval(blinkIdReturn)
                clearInterval(blinkIdReturn-1)
                blinkIntervalId.delete(elemid)
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

btnAcquitTrain.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 204,
        execute: "AQC-BTN-TRAIN",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

fuCreate.addEventListener('click', () => {
    actualRequest = JSON.stringify({
        op: 204,
        execute: "FU-BTN-ON",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

fuReleave.addEventListener('click', () => {
    actualRequest = JSON.stringify({
        op: 204,
        execute: "FU-BTN-OFF",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnAcqComptFu.addEventListener('click', () => {
    actualRequest = JSON.stringify({
        op: 204,
        execute: "CPTFU-BTN-ACQ",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnPrep.addEventListener('click', () => {
    actualRequest = JSON.stringify({
        op: 204,
        execute: "PREP-BTN",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnDeprep.addEventListener('click', () => {
    actualRequest = JSON.stringify({
        op: 204,
        execute: "DEPREP-BTN",
        target: getTrainInfo(selectMenuTrain.value),
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
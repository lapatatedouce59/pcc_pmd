let selectMenu = document.getElementById('stationSelect');
let selectValue = false

let quaiTitle = document.getElementById('quaiTitle')

//voyants
let doorsOpened = document.getElementById('doorsOpened')
let doorsClosed = document.getElementById('doorsClosed')
let doorsOpenedPV = document.getElementById('doorsOpenedPV')
let doorsClosedPV = document.getElementById('doorsClosedPV')

let btnOpenPV = document.getElementById('btnOpenPV')
let btnClosePV = document.getElementById('btnClosePV')
let btnOpenPP = document.getElementById('btnOpenPP')
let btnClosePP = document.getElementById('btnClosePP')
let trainOrderAffect = document.getElementById('trainOrderAffect')

quaiTitle.innerHTML=selectMenu.value

let ws = new WebSocket('ws://localhost:8081')
let data=false

ws.addEventListener('open', ()=> {
    console.log('Connecté au WS')
    ws.send(JSON.stringify({
        op: 1,
        from: "STATION"
    }));

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

function updateVoy(s){
    for (let voy of document.getElementsByClassName('voyStation')){
        let elemid = voy.id
        let elem=document.getElementById(elemid)
        console.log(elem)

        switch(s.states[elemid]){
            case false:
                console.log(elemid+' faux.')
                voy.classList.remove('ok')
                break;
            case true:
                console.log(elemid+' true.')
                voy.classList.toggle('ok')
                break;
        }
    }
}

btnClosePP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "CLOSEPP-BTN",
        target: getStationsInfo(selectMenu.value)
    }));
})

btnOpenPP.addEventListener('click', ()=>{
    ws.send(JSON.stringify({
        op: 204,
        execute: "OPENPP-BTN",
        target: getStationsInfo(selectMenu.value)
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
        target: trainId
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
        target: trainId
    }));
    trainOrderAffect.style.backgroundColor='white'
})
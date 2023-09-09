let data=false
let actualRequest=false
let selectMenuPa = document.getElementById('selectMenuPaFormat')
let selected = false
let fileIntervals=[]
const blinkIntervalId = new Map()
let blinkIdReturn = 0
import sm from './sm.js'
sm.init()

sm.registerSound('def', './src/formats/default.mp3')
window.WebSocket.addEventListener('message', msg =>{
    data = JSON.parse(msg.data);
    if ((data.op===300)||(data.op===2)){
        let op = data.op
        data=data.content
        if(op===2){
            let pa = []
            for (let sec of data.SEC){
                console.log('PA '+sec.id)
                pa.push({paid: sec.id})
                let opt = document.createElement('OPTION')
                opt.innerHTML=sec.id
                opt.value=sec.id
                opt.classList='paOpt'
                opt.id=sec.id
                opt.setAttribute('name', `paOpt${sec.id}`)
                selectMenuPa.appendChild(opt)
            }

            let tempa=PaInfo(selected||'1')
            initFormat(tempa)
            //updateFormat(tempa)
        }
        let painfo = PaInfo(selected||'1')
        updateFormat(painfo)
        gerardMontreMoiLesDefautsDuPaStp()
    }
})

selectMenuPa.addEventListener('input', ()=>{
    selected=selectMenuPa.value
    let pa = PaInfo(selected)
    initFormat(pa)
})
let pa1dictionnary = false
let pa2dictionnary = false

let defaultSoundInter=false

let defList=false

let listDef = document.getElementById('listDef')
function gerardMontreMoiLesDefautsDuPaStp(){

    for(let paOpt of document.getElementsByClassName('paOpt')){
        paOpt.innerText=paOpt.id
        paOpt.classList.remove('alarm')
    }
    //listDef.innerHTML=''
    //clearInterval(beepIntervalId)
    sm.stopSound('gong')
    let defList2=[]
    let anoList=[]

    for (let sec of data.SEC){
        for(let statea of Object.entries(sec.states)){
            if(!(statea[1]===1 || statea[1]===2)) continue;
            if(statea[1]===1){
                defList2.push(sec.id)
            }
            if(statea[1]===2){
                anoList.push({id: sec.id, name: sec.id, def: statea[0]})
            }
        }
        for(let ctn of sec.cantons){
            for(let state of Object.entries(ctn.states)){
                if(!(state[1]===1 || state[1]===2)) continue;
                if(state[1]===1){
                    defList2.push(sec.id)
                }
                if(state[1]===2){
                    anoList.push({id: sec.id, name: ctn.cid, def: state[0]})
                }
            }
        }
    }

    for (let tr of defList2){
        console.log('def '+tr)
        let elem = document.getElementsByName(`paOpt${tr}`)
        elem[0].innerText='🟥' +tr
    }
    for (let tr of anoList){
        if(!(tr.def==='ldi'||tr.def==='pzo'||tr.def==='tcs'||tr.def==='pdp'||tr.def==='coupFs'||tr.def==='zoneManoeuvre1'||tr.def==='tnitne1'||tr.def==='lstpas1'||tr.def==='discord1'||tr.def==='zoneManoeuvre2'||tr.def==='tnitne2'||tr.def==='lstpas2'||tr.def==='discord2')) continue;
        let defDiv = document.createElement('div')
        defDiv.id=tr.name+'DEF'
        let tName = document.createElement('mark')
        tName.innerText='PA '+tr.id
        let cName = document.createElement('strong')
        cName.innerText=' '+tr.name
        let defName = document.createElement('span')
        defName.innerText=' '+tr.def
        defDiv.appendChild(tName)
        defDiv.appendChild(cName)
        defDiv.appendChild(defName)
        listDef.appendChild(defDiv)
        let elem = document.getElementsByName(`paOpt${tr.id}`)
        elem[0].classList.add('alarm')
    }
}

async function updateFormat(pa){
    defList=[]
    document.getElementById(`ctnStateTop${pa.id}`).innerHTML=''
    document.getElementById(`ctnStateBot${pa.id}`).innerHTML=''
    //gerardMontreMoiLesDefautsDuPaStp()
    for(let elem of document.getElementsByClassName('voyGestionItiState')){
        elem.classList.remove('ok')
        for(let sec of data.SEC){
            if(sec.states[elem.id]){
                elem.classList.add('ok')
            }
        }
    }
    console.log('UPDATE INTENT FOR '+pa.id)

    for(let voyHeader of document.getElementsByClassName('voyPaState')){
        for(let sec of data.SEC){
            if (!(sec.id===pa.id)) continue;

            let stateElem = sec.states[voyHeader.id]
            if(stateElem===true){
                voyHeader.classList.add('ok')
            } else {
                voyHeader.classList.remove('ok')
            }
        }
    }
    for(let sec of data.SEC){
        if (!(sec.id===pa.id)) continue;
        for(let ctn of sec.cantons){
            for(let states of Object.entries(ctn.states)){
                if(states[1]===2){
                    if(!((states[0]==='pzo')||(states[0]==='coupFs')||(states[0]==='tcs')||(states[0]==='ldi')||(states[0]==='pdp')||(states[0]==='selAcc'))) continue;
                    let text = document.createElement('span')
                    text.style.color='#C50000'
                    text.innerText=`${ctn.cid} >>> alarme ${states[0]}`
                    let br = document.createElement('br')
                    document.getElementById(`ctnStateTop${pa.id}`).appendChild(text)
                    document.getElementById(`ctnStateTop${pa.id}`).appendChild(br)
                }
            }
        }
    }

    for(let sec of data.SEC){
        for(let ctn of sec.cantons){
            for(let states of Object.entries(ctn.states)){
                if(states[1]===2){
                    if(!((states[0]==='pzo')||(states[0]==='coupFs')||(states[0]==='tcs')||(states[0]==='ldi')||(states[0]==='pdp')||(states[0]==='selAcc'))) continue;
                    defList.push(ctn.cid)
                }
            }
        }
        for(let state of Object.entries(sec.states)){
            if(state[1]===2){
                if(!(state[0]==='zoneManoeuvre1'||state[0]==='tnitne1'||state[0]==='lstpas1'||state[0]==='discord1'||state[0]==='zoneManoeuvre2'||state[0]==='tnitne2'||state[0]==='lstpas2'||state[0]==='discord2')) continue;
                defList.push(sec.id)
            }
        }
    }
    for(let interval of fileIntervals){
        if(interval===defaultSoundInter) continue;
        clearInterval(interval)
    }
    
    for (let voy of document.getElementsByClassName('voyPaFormat')){
        let elemid = voy.id

        for(let sec of data.SEC){
            //for(let state of Object.entries(sec.states)){
                if(!(sec.states[elemid])) continue;
                switch(sec.states[elemid]){
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
            //}
        }
    }
    
    clearInterval(defaultSoundInter)
    console.log(defList)
    if(defList.length>0){
        defaultSoundInter=setInterval( ()=> {
            sm.playSound('def')
        },1000)
    } else {
        sm.stopSound('def')
        clearInterval(defaultSoundInter)
    }
    loadItiTco(pa)
}

function PaInfo(id){
    console.log(id)
    let reponse={id: null||'1', states: Object, ctns: [], itis: [], cycles: []}

    for (let sec of data.SEC){
        if (!(sec.id===id)) continue;
        reponse.id=sec.id
        reponse.states=sec.states
        reponse.itis=sec.ITI
        reponse.cycles=sec.CYCLES
        for (let ctns of sec.cantons){
            reponse.ctns.push(ctns)
        }
    }
    console.log(reponse)
    return reponse;
}

async function initFormat(pa){
    //gerardMontreMoiLesDefautsDuPaStp()
    for(let divs of document.getElementsByClassName('paFormatAmovible')){
        if(divs.id===`paFormatAmovible${pa.id}`){
            divs.style.display='inline'
        } else {
            divs.style.display='none'
        }
    }
    document.getElementById(`ctnStateTop${pa.id}`).innerHTML=''
    document.getElementById(`ctnStateBot${pa.id}`).innerHTML=''

    if (pa.id==='1'){
        let tcoItiPa = document.getElementById('tcoFormPa1')
        tcoItiPa.innerHTML=''
        let tcoobj = document.createElement('object')
        tcoobj.data="src/formats/TCOPA1FORM.svg"
        tcoobj.id="paForm1svg"
        tcoobj.type="image/svg+xml"
        tcoItiPa.appendChild(tcoobj)
        tcoobj.addEventListener('load', () => {
            let pa1svgDoc = tcoobj.contentDocument;
            pa1dictionnary = {
                cantons: {
                    'c1101': pa1svgDoc.getElementById('c1101'),
                    'c1201': pa1svgDoc.getElementById('c1201'),
                    'c1301': pa1svgDoc.getElementById('c1301'),
                    'c1401': pa1svgDoc.getElementById('c1401'),
                    'c1501': pa1svgDoc.getElementById('c1501'),
                    'c2101': pa1svgDoc.getElementById('c2101'),
                    'c2201': pa1svgDoc.getElementById('c2201'),
                    'c2301': pa1svgDoc.getElementById('c2301'),
                    'c2401': pa1svgDoc.getElementById('c2401'),
                    'c2501': pa1svgDoc.getElementById('c2501')
                },
                aiguilles: {
                    'c1': {
                        tracks:{
                            'a1': pa1svgDoc.getElementById('c1a1'),
                            'a2': pa1svgDoc.getElementById('c1a2'),
                            'c1301n': pa1svgDoc.getElementById('c1301n'),
                            'c2301n': pa1svgDoc.getElementById('c2301n')
                        },
                        arrows:{
                            'up': pa1svgDoc.getElementById('c1up'),
                            'down': pa1svgDoc.getElementById('c1dw')
                        }
                    }
                }
            }
            console.log('MAJ 2')
            loadItiTco(pa)
        })
    } else if (pa.id==='2'){
        let tcoItiPa = document.getElementById('tcoFormPa2')
        tcoItiPa.innerHTML=''
        let tcoobj = document.createElement('object')
        tcoobj.data="src/formats/TCOPA2FORM.svg"
        tcoobj.id="paForm2svg"
        tcoobj.type="image/svg+xml"
        tcoItiPa.appendChild(tcoobj)
        tcoobj.addEventListener('load', () => {
            let pa2svgDoc = tcoobj.contentDocument;
            pa2dictionnary = {
                cantons: {
                    'c1102': pa2svgDoc.getElementById('c1102'),
                    'c1202': pa2svgDoc.getElementById('c1202'),
                    'c1302': pa2svgDoc.getElementById('c1302'),
                    'c1402': pa2svgDoc.getElementById('c1402'),
                    'c2102': pa2svgDoc.getElementById('c2102'),
                    'c2202': pa2svgDoc.getElementById('c2202'),
                    'c2302': pa2svgDoc.getElementById('c2302'),
                    'c2402': pa2svgDoc.getElementById('c2402'),
                    'cGPAG1': pa2svgDoc.getElementById('cGPAG1'),
                    'cGA2PAG': pa2svgDoc.getElementById('cGA2PAG')
                },
                aiguilles: {
                    'c2': {
                        tracks:{
                            'a1': pa2svgDoc.getElementById('c2a1'),
                            'a2': pa2svgDoc.getElementById('c2a2'),
                            'c1102n': pa2svgDoc.getElementById('c1102n'),
                            'c2402n': pa2svgDoc.getElementById('c2402n'),
                            'c1202n': pa2svgDoc.getElementById('c1202n')
                        },
                        arrows:{
                            'a1up': pa2svgDoc.getElementById('c2a1up'),
                            'a1down': pa2svgDoc.getElementById('c2a1dw'),
                            'a2up': pa2svgDoc.getElementById('c2a2up'),
                            'a2down': pa2svgDoc.getElementById('c2a2dw')
                        }
                    }
                }
            }
            console.log('MAJ 2')
            loadItiTco(pa)
        })
    }
    updateFormat(pa)
}

function loadItiTco(pa){
    console.log(pa)
    if(pa.id==='1'){
        if(pa1dictionnary===false) return;
        for(let ctno of Object.entries(pa1dictionnary.cantons)){
            ctno[1].style.fill = '#CDCDCD';
            for(let ctns of pa.ctns){
                if(!(ctns.cid===ctno[0])) continue;
                if(ctns.trains.length>0){
                    ctno[1].style.fill = '#D9DD0E';
                }
                for(let states of Object.entries(ctns.states)){
                    if(states[1]===2){
                        if(!((states[0]==='pzo')||(states[0]==='coupFs')||(states[0]==='tcs')||(states[0]==='ldi')||(states[0]==='pdp')||(states[0]==='selAcc'))) continue;
                        if(pa.id==='1'){
                            pa1dictionnary.cantons[ctns.cid].style.fill='#C50000'
                        }
                    }
                }
            }
        }
        for(let aig of Object.entries(pa1dictionnary.aiguilles.c1.tracks)){
            aig[1].style.fill = '#CDCDCD';
            for(let itil of Object.entries(pa.itis[0])){
                for(let iti of Object.entries(itil[1])){
                    if(!(iti[1].active)) continue;
                    if((iti[1].code==='2201_2401')||(iti[1].code==='2401_2201')){
                        if(!(aig[0]==='c2301n')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='1201_1401')||(iti[1].code==='1401_1201')){
                        if(!(aig[0]==='c1301n')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='1201_2201')||(iti[1].code==='2201_1201')){
                        if(!(aig[0]==='a2')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='2401_1401')||(iti[1].code==='1401_2401')){
                        if(!(aig[0]==='a1')) continue;
                        aig[1].style.fill='#148FB6'
                    }
                }
            }
        }
        for(let aigArr of Object.entries(pa1dictionnary.aiguilles.c1.arrows)){
            aigArr[1].style.fill = '#B1B1B1';
        }
        if((itiInfo('1201_2201'))||(itiInfo('1401_2401'))){
            pa1dictionnary.aiguilles.c1.arrows.up.style.fill='#148FB6'
        }
        if((itiInfo('2201_1201'))||(itiInfo('2401_1401'))){
            pa1dictionnary.aiguilles.c1.arrows.down.style.fill='#148FB6'
        }
    } else if(pa.id==='2'){
        if(pa2dictionnary===false) return;
        for(let ctn of Object.entries(pa2dictionnary.cantons)){
            ctn[1].style.fill = '#CDCDCD';
            for(let ctns of pa.ctns){
                if(!(ctns.cid===ctn[0])) continue;
                if(ctns.trains.length>0){
                    ctn[1].style.fill = '#D9DD0E';
                }
                for(let states of Object.entries(ctns.states)){
                    if(states[1]===2){
                        if(!((states[0]==='pzo')||(states[0]==='coupFs')||(states[0]==='tcs')||(states[0]==='ldi')||(states[0]==='pdp')||(states[0]==='selAcc'))) continue;
                        if(pa.id==='2'){
                            pa2dictionnary.cantons[ctns.cid].style.fill='#C50000'
                        }
                    }
                }
            }
            
        }
        for(let aig of Object.entries(pa2dictionnary.aiguilles.c2.tracks)){
            aig[1].style.fill = '#CDCDCD';
            for(let itil of Object.entries(pa.itis[0])){
                for(let iti of Object.entries(itil[1])){
                    if(!(iti[1].active)) continue;
                    if((iti[1].code==='1501_1202')||(iti[1].code==='1202_1501')){
                        if(!(aig[0]==='c1102n')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='2302_2101')||(iti[1].code==='2101_2302')){
                        if(!(aig[0]==='c2402n')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='1102_1302')||(iti[1].code==='1302_1102')){
                        if(!(aig[0]==='c1202n')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='1102_PAG1')||(iti[1].code==='PAG1_1102')){
                        if(!(aig[0]==='a2')) continue;
                        aig[1].style.fill='#148FB6'
                    } else if((iti[1].code==='2101_1202')||(iti[1].code==='1202_2101')){
                        if(!(aig[0]==='a1')) continue;
                        aig[1].style.fill='#148FB6'
                    }
                }
            }
        }
        for(let aigArr of Object.entries(pa2dictionnary.aiguilles.c2.arrows)){
            aigArr[1].style.fill = '#B1B1B1';
        }
        if(itiInfo('2101_1202')){
            pa2dictionnary.aiguilles.c2.arrows.a1down.style.fill='#148FB6'
        }
        if(itiInfo('1202_2101')){
            pa2dictionnary.aiguilles.c2.arrows.a1up.style.fill='#148FB6'
        }
        if(itiInfo('1102_PAG1')){
            pa2dictionnary.aiguilles.c2.arrows.a2down.style.fill='#148FB6'
        }
        if(itiInfo('PAG1_1102')){
            pa2dictionnary.aiguilles.c2.arrows.a2up.style.fill='#148FB6'
        }
    }
}

function itiInfo(id){
    if(!id) return console.error('[itiInfo] Aucun ID d\'iti indiqué!')
    for(let sec of data.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===id)) continue;
                return iti.active
            }
        }
    }
    console.info('[itiInfo] Aucun itinéraire correspondant.')
    return false;
}

document.getElementById('paFormAcq').addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 224,
        execute: "AQC-BTN",
        target: selectMenuPa.value,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
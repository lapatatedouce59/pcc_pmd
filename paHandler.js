let data=false
let actualRequest=false
window.WebSocket.addEventListener('message', msg =>{
    let selectMenuPa = document.getElementById('selectMenuPa')
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
                selectMenuPa.appendChild(opt)
            }

            let tempa=PaInfo('1')
            initFormat(tempa)
            updateFormat(tempa)
        }
        let painfo = PaInfo(selectMenuPa.value)
        updateFormat(painfo)
    }
})
let pa1dictionnary = false
const pa1 = document.getElementById('pa1svg')
pa1.addEventListener('load', () => {
    let pa1svgDoc = pa1.contentDocument;
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
        },
        arrows: {
            '2401_2501':pa1svgDoc.getElementById('2401_2501'),
            '2501_2401':pa1svgDoc.getElementById('2501_2401'),
            '1401_2401':pa1svgDoc.getElementById('1401_2401'),
            '2201_1201':pa1svgDoc.getElementById('2201_1201'),
            '2201_2401':pa1svgDoc.getElementById('2201_2401'),
            '2401_2201':pa1svgDoc.getElementById('2401_2201'),
            '2101_2201':pa1svgDoc.getElementById('2101_2201'),
            '2201_2101':pa1svgDoc.getElementById('2201_2101'),
            '2402_2101':pa1svgDoc.getElementById('2402_2101'),
            '2101_2402':pa1svgDoc.getElementById('2101_2402'),

            '1101_1201':pa1svgDoc.getElementById('1101_1201'),
            '1201_1101':pa1svgDoc.getElementById('1201_1101'),
            '1201_2201':pa1svgDoc.getElementById('1201_2201'),
            '2401_1401':pa1svgDoc.getElementById('2401_1401'),
            '1201_1401':pa1svgDoc.getElementById('1201_1401'),
            '1401_1201':pa1svgDoc.getElementById('1401_1201'),
            '1401_1501':pa1svgDoc.getElementById('1401_1501'),
            '1501_1401':pa1svgDoc.getElementById('1501_1401'),
            '1501_1102':pa1svgDoc.getElementById('1501_1102'),
            '1102_1501':pa1svgDoc.getElementById('1102_1501')
        }
    }
    let pa = PaInfo("1")
    loadItiTco(pa)
})

async function updateFormat(pa){
    for(let elem of document.getElementsByClassName('VOYITIP')){
        elem.classList.remove('voyPresenceCmdOn')
        elem.classList.add('voyPresenceCmdOff')
    }
    for(let elem of document.getElementsByClassName('VOYITIV')){
        elem.classList.remove('ok')
    }
    for(let elem of document.getElementsByClassName('voyGestionItiState')){
        elem.classList.remove('ok')
        for(let sec of data.SEC){
            if(sec.states[elem.id]){
                elem.classList.add('ok')
            }
        }
    }
    console.log('UPDATE INTENT FOR '+pa.id)
    for(let itilist of pa.itis){
        for(let itiv of Object.entries(itilist)){
            for(let iti of itiv[1]){
                if(iti.active){
                    let presenceVoytd = document.getElementById(`presence[${iti.code}]td`)
                    presenceVoytd.classList.add('ok')
                    let presenceVoyspan = document.getElementById(`presence[${iti.code}]span`)
                    presenceVoyspan.classList.add('ok')
                }
                console.log(iti.mode)
                switch(iti.mode){
                    
                    case 'SEL':
                        let presenceSel1 = document.getElementById(`presenceSel[${iti.code}]`)
                        let presenceDes1 = document.getElementById(`presenceDes[${iti.code}]`)
                        let presenceDu1 = document.getElementById(`presenceDu[${iti.code}]`)
                        console.log(presenceSel1)
                        presenceSel1.classList.remove('voyPresenceCmdOff')
                        //presenceDes1.classList.remove('voyPresenceCmdOn')
                        //presenceDu1.classList.remove('voyPresenceCmdOn')
                        presenceSel1.classList.add('voyPresenceCmdOn')
                        //presenceDes1.classList.add('voyPresenceCmdOff')
                        //presenceSel1.classList.add('voyPresenceCmdOff')
                        break;
                    case 'DES':
                        let presenceSel2 = document.getElementById(`presenceSel[${iti.code}]`)
                        let presenceDes2 = document.getElementById(`presenceDes[${iti.code}]`)
                        let presenceDu2 = document.getElementById(`presenceDu[${iti.code}]`)
                        //presenceSel2.classList.remove('voyPresenceCmdOn')
                        presenceDes2.classList.remove('voyPresenceCmdOff')
                        //presenceDu2.classList.remove('voyPresenceCmdOn')
                        //presenceSel2.classList.add('voyPresenceCmdOff')
                        presenceDes2.classList.add('voyPresenceCmdOn')
                        //presenceDu2.classList.add('voyPresenceCmdOff')
                        break;
                    case 'DU':
                        let presenceSel3 = document.getElementById(`presenceSel[${iti.code}]`)
                        let presenceDes3 = document.getElementById(`presenceDes[${iti.code}]`)
                        let presenceDu3 = document.getElementById(`presenceDu[${iti.code}]`)
                        //presenceSel3.classList.remove('voyPresenceCmdOn')
                        //presenceDes3.classList.remove('voyPresenceCmdOn')
                        presenceDu3.classList.remove('voyPresenceCmdOff')
                        //presenceSel3.classList.add('voyPresenceCmdOff')
                        //presenceDes3.classList.add('voyPresenceCmdOff')
                        presenceDu3.classList.add('voyPresenceCmdOn')
                        break;
                    case false:
                        let presenceSel4 = document.getElementById(`presenceSel[${iti.code}]`)
                        let presenceDes4 = document.getElementById(`presenceDes[${iti.code}]`)
                        let presenceDu4 = document.getElementById(`presenceDu[${iti.code}]`)
                        presenceSel4.classList.remove('voyPresenceCmdOn')
                        presenceDes4.classList.remove('voyPresenceCmdOn')
                        presenceDu4.classList.remove('voyPresenceCmdOn')
                        presenceSel4.classList.add('voyPresenceCmdOff')
                        presenceDes4.classList.add('voyPresenceCmdOff')
                        presenceDu4.classList.add('voyPresenceCmdOff')
                        break;
                }
            }
        }
    }
    loadItiTco(pa)
}

function PaInfo(id){
    let reponse={id: null, states: Object, ctns: [], itis: []}

    for (let sec of data.SEC){
        if (!(sec.id===id)) continue;
        reponse.id=sec.id
        reponse.states=sec.states
        reponse.itis=sec.ITI
        for (let ctns of sec.cantons){
            reponse.ctns.push(ctns)
        }
    }
    return reponse;
}

async function initFormat(pa){
    //?  Creating action board
    for(let itilist of pa.itis){
        for(let itis of itilist.V1){
            console.log(itis)
            let masterDiv=document.getElementById('manualItiTop')

            let parentdiv = document.createElement('div')
            parentdiv.style.backgroundColor='#E6E6E6'

            let controltable = document.createElement('table')
            controltable.style.margin='5px'

            let tr1 = document.createElement('tr')

            let tdbtnSel = document.createElement('td')
            tdbtnSel.colSpan='2'

            let btnSel = document.createElement('input')
            btnSel.type='button'
            btnSel.classList.add('btnControl')
            btnSel.id=`btnSel[${itis.code}]`
            btnSel.value='SEL'
            btnSel.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "SEL-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoySel = document.createElement('td')
            tdVoySel.classList.add('voyPresenceCmdOff')
            tdVoySel.classList.add('VOYITIP')
            tdVoySel.id=`presenceSel[${itis.code}]`

            let tr2 = document.createElement('tr')

            let tdbtnDes = document.createElement('td')
            tdbtnDes.colSpan='2'

            let btnDes = document.createElement('input')
            btnDes.type='button'
            btnDes.classList.add('btnControl')
            btnDes.id=`btnDes[${itis.code}]`
            btnDes.value='DES'
            btnDes.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "DES-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDes = document.createElement('td')
            tdVoyDes.classList.add('voyPresenceCmdOff')
            tdVoyDes.classList.add('VOYITIP')
            tdVoyDes.id=`presenceDes[${itis.code}]`

            let tr3 = document.createElement('tr')

            let tdbtnDu = document.createElement('td')
            tdbtnDu.colSpan='2'

            let btnDu = document.createElement('input')
            btnDu.type='button'
            btnDu.classList.add('btnControl')
            btnDu.id=`btnDu[${itis.code}]`
            btnDu.value='DU'
            btnDu.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "DU-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDu = document.createElement('td')
            tdVoyDu.classList.add('VOYITIP')
            tdVoyDu.classList.add('voyPresenceCmdOff')
            tdVoyDu.id=`presenceDu[${itis.code}]`

            let tr4 = document.createElement('tr')

            let tdVoyPresence = document.createElement('td')
            tdVoyPresence.colSpan='3'
            tdVoyPresence.classList.add('voyItiState')
            tdVoyPresence.classList.add('VOYITIV')
            tdVoyPresence.id=`presence[${itis.code}]td`

            let presenceSpan = document.createElement('span')
            presenceSpan.classList.add('voyItiState')
            presenceSpan.id=`presence[${itis.code}]span`
            presenceSpan.innerText=itis.code
            presenceSpan.classList.add('VOYITIV')

            tdbtnSel.appendChild(btnSel)
            tr1.appendChild(tdbtnSel)
            tr1.appendChild(tdVoySel)
            tdbtnDes.appendChild(btnDes)
            tr2.appendChild(tdbtnDes)
            tr2.appendChild(tdVoyDes)
            tdbtnDu.appendChild(btnDu)
            tr3.appendChild(tdbtnDu)
            tr3.appendChild(tdVoyDu)
            tdVoyPresence.appendChild(presenceSpan)
            tr4.appendChild(tdVoyPresence)
            controltable.appendChild(tr1)
            controltable.appendChild(tr2)
            controltable.appendChild(tr3)
            controltable.appendChild(tr4)
            parentdiv.appendChild(controltable)
            masterDiv.appendChild(parentdiv)
        }
        for(let itis of itilist.V2){
            console.log(itis)
            let masterDiv=document.getElementById('manualItiBot')

            let parentdiv = document.createElement('div')
            parentdiv.style.backgroundColor='#E6E6E6'

            let controltable = document.createElement('table')
            controltable.style.margin='5px'

            let tr1 = document.createElement('tr')

            let tdbtnSel = document.createElement('td')
            tdbtnSel.colSpan='2'

            let btnSel = document.createElement('input')
            btnSel.type='button'
            btnSel.classList.add('btnControl')
            btnSel.id=`btnSel[${itis.code}]`
            btnSel.value='SEL'
            btnSel.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "SEL-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoySel = document.createElement('td')
            tdVoySel.classList.add('VOYITIP')
            tdVoySel.classList.add('voyPresenceCmdOff')
            tdVoySel.id=`presenceSel[${itis.code}]`

            let tr2 = document.createElement('tr')

            let tdbtnDes = document.createElement('td')
            tdbtnDes.colSpan='2'

            let btnDes = document.createElement('input')
            btnDes.type='button'
            btnDes.classList.add('btnControl')
            btnDes.id=`btnDes[${itis.code}]`
            btnDes.value='DES'
            btnDes.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "DES-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDes = document.createElement('td')
            tdVoyDes.classList.add('VOYITIP')
            tdVoyDes.classList.add('voyPresenceCmdOff')
            tdVoyDes.id=`presenceDes[${itis.code}]`

            let tr3 = document.createElement('tr')

            let tdbtnDu = document.createElement('td')
            tdbtnDu.colSpan='2'

            let btnDu = document.createElement('input')
            btnDu.type='button'
            btnDu.classList.add('btnControl')
            btnDu.id=`btnDu[${itis.code}]`
            btnDu.value='DU'
            btnDu.addEventListener('click', ()=>{
                actualRequest = JSON.stringify({
                    op: 220,
                    execute: "DU-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDu = document.createElement('td')
            tdVoyDu.classList.add('VOYITIP')
            tdVoyDu.classList.add('voyPresenceCmdOff')
            tdVoyDu.id=`presenceDu[${itis.code}]`

            let tr4 = document.createElement('tr')

            let tdVoyPresence = document.createElement('td')
            tdVoyPresence.colSpan='3'
            tdVoyPresence.classList.add('voyItiState')
            tdVoyPresence.id=`presence[${itis.code}]td`
            tdVoyPresence.classList.add('VOYITIV')

            let presenceSpan = document.createElement('span')
            presenceSpan.classList.add('voyItiState')
            presenceSpan.id=`presence[${itis.code}]span`
            presenceSpan.classList.add('VOYITIV')
            presenceSpan.innerText=itis.code

            tdbtnSel.appendChild(btnSel)
            tr1.appendChild(tdbtnSel)
            tr1.appendChild(tdVoySel)
            tdbtnDes.appendChild(btnDes)
            tr2.appendChild(tdbtnDes)
            tr2.appendChild(tdVoyDes)
            tdbtnDu.appendChild(btnDu)
            tr3.appendChild(tdbtnDu)
            tr3.appendChild(tdVoyDu)
            tdVoyPresence.appendChild(presenceSpan)
            tr4.appendChild(tdVoyPresence)
            controltable.appendChild(tr1)
            controltable.appendChild(tr2)
            controltable.appendChild(tr3)
            controltable.appendChild(tr4)
            parentdiv.appendChild(controltable)
            masterDiv.appendChild(parentdiv)
        }
    }
}

function loadItiTco(pa){
    console.log(pa)
    for(let ctn of Object.entries(pa1dictionnary.cantons)){
        ctn[1].style.fill = '#CDCDCD';
        for(let ctns of pa.ctns){
            if(!(ctns.cid===ctn[0])) continue;
            if(ctns.trains.length>0){
                ctn[1].style.fill = '#D9DD0E';
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
    for(let arrows of Object.entries(pa1dictionnary.arrows)){
        arrows[1].style.fill = '#9F9F9F'
        for(let itil of Object.entries(pa.itis[0])){
            for(let iti of Object.entries(itil[1])){
                if(!(iti[1].code===arrows[0])) continue;
                //console.log(iti[1])
                if(iti[1].active===true){
                    arrows[1].style.fill = '#00FF19';
                } else if (iti[1].active===false){
                    arrows[1].style.fill = '#9F9F9F';
                }
            }
        }
    }
}

function itiInfo(id){
    if(!id) return console.error('[OGIA -> itiInfo] Aucun ID d\'iti indiqué!')
    for(let sec of data.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===id)) continue;
                return iti.active
            }
        }
    }
    console.info('[OGIA -> itiInfo] Aucun itinéraire correspondant.')
    return false;
}




let btnRetV201 = document.getElementById('btnRetV201')
let btnInjV201 = document.getElementById('btnInjV201')
let btnRetV101 = document.getElementById('btnRetV101')
let btnInjV101 = document.getElementById('btnInjV101')

btnRetV201.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "RET-BTN-ITI",
        target: "V201",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnInjV201.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "INJ-BTN-ITI",
        target: "V201",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnRetV101.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "RET-BTN-ITI",
        target: "V101",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnInjV101.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "INJ-BTN-ITI",
        target: "V101",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
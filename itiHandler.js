let data=false
let actualRequest=false
let selectMenuPa = document.getElementById('selectMenuPa')
let selected = false

window.WebSocket.addEventListener('message', msg =>{
    data = JSON.parse(msg.data);
    if ((data.op===300)||(data.op===2)||(data.op===10)){
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

            let tempa=PaInfo(selected||'1')
            initFormat(tempa)
            //updateFormat(tempa)
        }
        let painfo = PaInfo(selected||'1')
        updateFormat(painfo)
    }
})
selectMenuPa.addEventListener('input', ()=>{
    selected=selectMenuPa.value
    let pa = PaInfo(selected)
    initFormat(pa)
})
let pa1dictionnary = false
let pa2dictionnary = false


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
        elem.classList.remove('alarm')
        for(let sec of data.SEC){
            if(sec.states[elem.id]===true){
                elem.classList.add('ok')
            } else if(sec.states[elem.id]===1){
                elem.classList.add('alarm')
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
    for(let cycle of pa.cycles){
        let cyclePresence = document.getElementById(`voyPresence${cycle.code}`)
        let cycleImg = document.getElementById(`imgPresence${cycle.code}`)
        if(cycle.sel){
            cyclePresence.classList.add('voyPresenceCmdOn')
            cyclePresence.classList.remove('voyPresenceCmdOff')
        } else {
            cyclePresence.classList.remove('voyPresenceCmdOn')
            cyclePresence.classList.add('voyPresenceCmdOff')
        }
        if(cycle.active){
            cycleImg.src=cycle.imgl
        } else {
            cycleImg.src=cycle.imgn
        }
    }

    for(let voyHeader of document.getElementsByClassName('voyPaState')){
        for(let sec of data.SEC){
            if (!(sec.id===pa.id)) continue;
            /*for(let state of Object.entries(sec.states)){
                console.log(state)
                let stateElem = state[1][voyHeader.id]
                console.log(stateElem)
                if(stateElem===true){
                    voyHeader.classList.add('ok')
                } else {
                    voyHeader.classList.remove('ok')
                }
            }*/
            let stateElem = sec.states[voyHeader.id]
            if(stateElem===true){
                voyHeader.classList.add('ok')
                voyHeader.classList.remove('alarm')
            } else if(stateElem===false){
                voyHeader.classList.remove('ok')
                voyHeader.classList.remove('alarm')
            } else if(stateElem===1){
                voyHeader.classList.remove('ok')
                voyHeader.classList.add('alarm')
            }
        }
    }

    console.log('MAJ 1')
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
    for(let divs of document.getElementsByClassName('itiFormatAmovible')){
        if(divs.id===`itiFormatAmovible${pa.id}`){
            divs.style.display='inline'
        } else {
            divs.style.display='none'
        }
    }
    document.getElementById(`manualItiTop${pa.id}`).innerHTML=''
    document.getElementById(`manualItiBot${pa.id}`).innerHTML=''
    console.log('erase '+pa.id)
    document.getElementById(`masterTableCycles${pa.id}`).innerHTML=''
    console.log(pa.id)
    if (pa.id==='1'){
        let tcoItiPa = document.getElementById('tcoItiPa1')
        tcoItiPa.innerHTML=''
        let tcoobj = document.createElement('object')
        tcoobj.data="src/formats/TCOPA1.svg"
        tcoobj.id="pa1svg"
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
            console.log('MAJ 2')
            loadItiTco(pa)
        })
    } else if (pa.id==='2'){
        let tcoItiPa = document.getElementById('tcoItiPa2')
        tcoItiPa.innerHTML=''
        let tcoobj = document.createElement('object')
        tcoobj.data="src/formats/TCOPA2.svg"
        tcoobj.id="pa1svg"
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
                },
                arrows: {
                    '2202_2102':pa2svgDoc.getElementById('2202_2102'),
                    '2302_2202':pa2svgDoc.getElementById('2302_2202'),
                    '2102_2603':pa2svgDoc.getElementById('2102_2603'),
                    '1302_1402':pa2svgDoc.getElementById('1302_1402'),
                    '1402_1103':pa2svgDoc.getElementById('1402_1103'),
                    '1102_1302':pa2svgDoc.getElementById('1102_1302'),
                    '1501_1202':pa2svgDoc.getElementById('1501_1202'),
                    '2302_2101':pa2svgDoc.getElementById('2302_2101'),
                    '1302_1102':pa2svgDoc.getElementById('1302_1102'),
                    '1202_1501':pa2svgDoc.getElementById('1202_1501'),
                    '2101_2302':pa2svgDoc.getElementById('2101_2302'),
                    '2102_2202':pa2svgDoc.getElementById('2102_2202'),
                    '2202_2302':pa2svgDoc.getElementById('2202_2302'),
                    '2603_2102':pa2svgDoc.getElementById('2603_2102'),
                    '1402_1302':pa2svgDoc.getElementById('1402_1302'),
                    '1103_1402':pa2svgDoc.getElementById('1103_1402'),
                    '2101_1202':pa2svgDoc.getElementById('2101_1202'),
                    '1102_PAG1':pa2svgDoc.getElementById('1102_PAG1'),
                    '1202_1501':pa2svgDoc.getElementById('1202_1501'),
                    'PAG1_1102':pa2svgDoc.getElementById('PAG1_1102')
                }
            }
            console.log('MAJ 2')
            loadItiTco(pa)
        })
    }
    //?  Creating action board
    for(let itilist of pa.itis){
        for(let itis of itilist.V1){
            console.log(itis)
            let masterDiv=document.getElementById(`manualItiTop${pa.id}`)

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
            let masterDiv=document.getElementById(`manualItiBot${pa.id}`)

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
    //? Creating cycle board
    for(let sec of data.SEC){
        if(!(sec.id===pa.id)) continue;
        //document.getElementById(`masterTableCycles${pa.id}`).innerHTML=''
        for(let cycles of sec.CYCLES){
            console.log(cycles)
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            let cycleSelBtn = document.createElement('input')
            cycleSelBtn.classList.add('btnControl')
            cycleSelBtn.type='button'
            cycleSelBtn.value='  '
            cycleSelBtn.id=`btnSel${cycles.code}`
            cycleSelBtn.addEventListener('click',()=>{
                actualRequest = JSON.stringify({
                    op: 222,
                    execute: "SEL-BTN-CYCLE",
                    target: cycles.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let td2=document.createElement('td')
            td2.classList.add('voyPresenceCmdOff','VOYCYCLEP')
            if(cycles.sel){
                td2.classList.remove('voyPresenceCmdOff')
                td2.classList.add('voyPresenceCmdOn')
            }
            td2.id=`voyPresence${cycles.code}`

            let td3 = document.createElement('td')
            td3.colSpan='5'
            let statusImg = document.createElement('img')
            if(cycles.active){
                statusImg.src=cycles.imgl;
            } else {
                statusImg.src=cycles.imgn;
            }
            statusImg.id=`imgPresence${cycles.code}`

            td1.appendChild(cycleSelBtn)
            td3.appendChild(statusImg)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            document.getElementById(`masterTableCycles${pa.id}`).appendChild(tr)
        }
    }
    updateFormat(pa)
}

function loadItiTco(pa){
    console.log(pa)
    if(pa.id==='1'){
        if(pa1dictionnary===false) return;
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
    } else if(pa.id==='2'){
        if(pa2dictionnary===false) return;
        for(let ctn of Object.entries(pa2dictionnary.cantons)){
            ctn[1].style.fill = '#CDCDCD';
            for(let ctns of pa.ctns){
                if(!(ctns.cid===ctn[0])) continue;
                if(ctns.trains.length>0){
                    ctn[1].style.fill = '#D9DD0E';
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
        for(let arrows of Object.entries(pa2dictionnary.arrows)){
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






let btnRetV201 = document.getElementById('btnRetV201')
let btnInjV201 = document.getElementById('btnInjV201')
let btnRetV101 = document.getElementById('btnRetV101')
let btnInjV101 = document.getElementById('btnInjV101')
let btnSortieGla = document.getElementById('btnSortieGla')
let btnEntreeGla = document.getElementById('btnEntreeGla')
let btnSPSTO = document.getElementById('btnSPSTO')
let btnRAZSPSTO = document.getElementById('btnRAZSPSTO')

let btnDesUrgIti = document.getElementById('btnDesUrgIti')
let btnCancelCycles = document.getElementById('btnCancelCycles')

btnRetV201.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "RETV201",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnInjV201.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "INJV201",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnRetV101.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "RETV101",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnInjV101.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "INJV101",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnSortieGla.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "RETGLA",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnEntreeGla.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SEQUENCE",
        target: "INJGLA",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnSPSTO.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SP-ON",
        target: "STO",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnRAZSPSTO.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 221,
        execute: "SP-RAZ",
        target: "STO",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})



btnDesUrgIti.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 223,
        execute: "DUG-BTN-ITI",
        target: selectMenuPa.value,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
btnCancelCycles.addEventListener('click', ()=>{
    actualRequest = JSON.stringify({
        op: 223,
        execute: "CANCELCYCLES-BTN-ITI",
        target: selectMenuPa.value,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
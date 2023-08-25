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
        }
        let pa = PaInfo(selectMenuPa.value)
        console.log(pa)
        initFormat(pa)
        updateFormat(pa)
    }
})

async function updateFormat(pa){
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
                    op: 204,
                    execute: "SEL-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoySel = document.createElement('td')
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
                    op: 204,
                    execute: "DES-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDes = document.createElement('td')
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
                    op: 204,
                    execute: "DU-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDu = document.createElement('td')
            tdVoyDu.classList.add('voyPresenceCmdOff')
            tdVoyDu.id=`presenceDu[${itis.code}]`

            let tr4 = document.createElement('tr')

            let tdVoyPresence = document.createElement('td')
            tdVoyPresence.colSpan='3'
            tdVoyPresence.classList.add('voyItiState')
            tdVoyPresence.id=`presence[${itis.code}]td`

            let presenceSpan = document.createElement('span')
            presenceSpan.classList.add('voyItiState')
            presenceSpan.id=`presence[${itis.code}]span`
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
                    op: 204,
                    execute: "SEL-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoySel = document.createElement('td')
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
                    op: 204,
                    execute: "DES-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDes = document.createElement('td')
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
                    op: 204,
                    execute: "DU-BTN-ITI",
                    target: itis.code,
                    uuid: window.uuid
                })
                window.WebSocket.send(actualRequest);
                window.actualRequest = actualRequest
            })

            let tdVoyDu = document.createElement('td')
            tdVoyDu.classList.add('voyPresenceCmdOff')
            tdVoyDu.id=`presenceDu[${itis.code}]`

            let tr4 = document.createElement('tr')

            let tdVoyPresence = document.createElement('td')
            tdVoyPresence.colSpan='3'
            tdVoyPresence.classList.add('voyItiState')
            tdVoyPresence.id=`presence[${itis.code}]td`

            let presenceSpan = document.createElement('span')
            presenceSpan.classList.add('voyItiState')
            presenceSpan.id=`presence[${itis.code}]span`
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
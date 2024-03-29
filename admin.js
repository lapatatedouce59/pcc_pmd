//let data=false
let uuid = false

let incidentsTable = document.getElementById('incidents')
let backToTheBeginingBaby = document.getElementById('backToTheBeginingBaby')

window.WebSocket.addEventListener('open', ()=> {
    console.log('Connecté au WS')

    window.WebSocket.addEventListener('message', msg =>{
        data = JSON.parse(msg.data);
        console.log(data);
        if ((data.op===2)||(data.op===300)){
            if(data.op===2){
                window.uuid=data.uuid
            }
            console.log(window.uuid)
            data=data.content
            updatePannes()
        }
    })
})

let incMap = new Map()

function updatePannes(){
    console.log(data)
    for(let event of data.events){
        console.log(event)
        if(typeof incMap.get(event.id)==='undefined'){
            console.log('Elément non déclaré.')
            incMap.set(event.id, event.showState)
            let newTr = incidentsTable.insertRow(event.id)
    
            let tdVisual = newTr.insertCell(0)
            let tdNameInc = newTr.insertCell(1)
            let tdUsername = newTr.insertCell(2)
            let tdTime = newTr.insertCell(3)
            let tdActualState = newTr.insertCell(4)
            let tdTarget = newTr.insertCell(5)
            let tdActions = newTr.insertCell(6)

            let razButton=document.createElement('button')
            tdActions.appendChild(razButton)
            razButton.id='endIncident['+event.id+']'
            razButton.innerText='RAZ'
            razButton.classList.add('actionButtons')
            razButton.addEventListener('click',()=>{
                window.WebSocket.send(JSON.stringify({
                    op: 600,
                    inc: event.id,
                    uuid: window.uuid
                }));
            })
    
            switch(event.showState){
                case true:
                    tdVisual.classList.remove('eventFinished')
                    tdVisual.classList.remove('eventWaiting')
                    tdVisual.classList.remove('eventTerminating')
                    tdVisual.classList.toggle('eventActive',true)
                    break;
                case false:
                    tdVisual.classList.remove('eventActive')
                    tdVisual.classList.remove('eventWaiting')
                    tdVisual.classList.remove('eventTerminating')
                    tdVisual.classList.toggle('eventFinished',true)
                    var btn = document.getElementById('endIncident['+event.id+']')
                    btn.disabled=true
                    break;
                case 1:
                    tdVisual.classList.remove('eventActive')
                    tdVisual.classList.remove('eventFinished')
                    tdVisual.classList.remove('eventTerminating')
                    tdVisual.classList.toggle('eventWaiting',true)
                    break;
                case 2:
                    tdVisual.classList.remove('eventActive')
                    tdVisual.classList.remove('eventFinished')
                    tdVisual.classList.remove('eventWaiting')
                    tdVisual.classList.toggle('eventTerminating',true)
                    var btn = document.getElementById('endIncident['+event.id+']')
                    btn.disabled=true
                    break;
            }
            tdVisual.id='eventVisual'+event.id
            tdActualState.id='eventState'+event.id
            tdTime.id='eventTime'+event.id
    
            tdNameInc.innerHTML=event.name;
            tdActualState.innerHTML=event.state;
            tdUsername.innerHTML=event.user;
            tdTime.innerHTML=event.date;
            switch(event.targetType){
                case 'train':
                    tdTarget.innerHTML='Train n°'+data.SEC[parseInt(event.target.sIndex)].cantons[parseInt(event.target.cIndex)].trains[parseInt(event.target.tIndex)].tid+' à '+data.SEC[parseInt(event.target.sIndex)].cantons[parseInt(event.target.cIndex)].cid;
                    break;
            }
            continue;
        } else if (incMap.get(event.id)===event.showState){
            console.log('Elément évalué identique.')
            continue;
        }
        incMap.set(event.id, event.showState)
        let upTdVisual = document.getElementById('eventVisual'+event.id)
        let upTdState = document.getElementById('eventState'+event.id)
        let upTdTime = document.getElementById('eventTime'+event.id)

        upTdState.innerText=event.state;
        upTdTime.innerText=event.date;

        switch(event.showState){
            case true:
                upTdVisual.classList.remove('eventFinished')
                upTdVisual.classList.remove('eventWaiting')
                upTdVisual.classList.remove('eventTerminating')
                upTdVisual.classList.toggle('eventActive',true)
                break;
            case false:
                upTdVisual.classList.remove('eventActive')
                upTdVisual.classList.remove('eventWaiting')
                upTdVisual.classList.remove('eventTerminating')
                upTdVisual.classList.toggle('eventFinished',true)
                var btn = document.getElementById('endIncident['+event.id+']')
                btn.disabled=true
                break;
            case 1:
                upTdVisual.classList.remove('eventActive')
                upTdVisual.classList.remove('eventFinished')
                upTdVisual.classList.remove('eventTerminating')
                upTdVisual.classList.toggle('eventWaiting',true)
                break;
            case 2:
                upTdVisual.classList.remove('eventActive')
                upTdVisual.classList.remove('eventFinished')
                upTdVisual.classList.remove('eventWaiting')
                upTdVisual.classList.toggle('eventTerminating',true)
                var btn = document.getElementById('endIncident['+event.id+']')
                btn.disabled=true
                break;
        }
        continue;
    }
}


backToTheBeginingBaby.addEventListener('click',()=>{
    document.location.href='index.html'
})

for (let cmdButtons of document.getElementsByClassName('btnCommandeIncident')){
    cmdButtons.addEventListener('click',()=>{
        window.WebSocket.send(JSON.stringify({
            op: 601,
            pressedButton: cmdButtons.id,
            uuid: window.uuid
        }));
    })
}
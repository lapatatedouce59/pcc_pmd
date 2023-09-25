let adminData = false

let playerList = document.getElementById('playerList')
let trainList = document.getElementById('trainList')

window.WebSocket.addEventListener('message', msg => {
    data = JSON.parse(msg.data);

    if ((data.op === 300)||(data.op === 2)) {
        if(data.op===2){
            actualRequest = JSON.stringify({
                op: 15,
                time: 'ADMIN PAGE'
            })
            window.actualRequest = actualRequest
            window.WebSocket.send(actualRequest)
            if(data.uuid){
                window.uuid=data.uuid
                document.getElementById('uuidLigne').innerHTML = data.uuid
            }
            if(data.uname){
                window.uname=data.uname
                document.getElementById('uname').innerHTML = data.uname
            }
            if(data.role){
                window.role=data.role
                document.getElementById('roleOP').innerHTML = data.role
                if(!data.role==='chef') alert('Vous n\'avez pas accès à cette page à cause de votre rôle. Les fonctionalités seront bloquées.')
            }
        }
        let parsedJson = data.content
        data = parsedJson
        console.log(data)
        //adminData=data.admin
        reload()
        function reload(){
            listPlayers()
            listTrains()
        }

    }
})

window.WebSocket.addEventListener('close', ()=>{
   alert('Connexion au serveur perdue.')
})

function listPlayers(){
    playerList.innerHTML='';
    for(let player of data.players){
        let masterDiv = document.createElement('div')
        masterDiv.classList.add('divPlayers')
        let div1 = document.createElement('div')
        let titleSpan1 = document.createElement('span')
        let span1 = document.createElement('span')
        titleSpan1.style.fontWeight='bold';
        titleSpan1.innerText='Nom: '
        span1.innerText=player.name
        div1.appendChild(titleSpan1)
        div1.appendChild(span1)
        masterDiv.appendChild(div1)

        let div2 = document.createElement('div')
        let titleSpan2 = document.createElement('span')
        let span2 = document.createElement('span')
        titleSpan2.style.fontWeight='bold';
        titleSpan2.innerText='Rôle: '
        span2.innerText=player.role
        div2.appendChild(titleSpan2)
        div2.appendChild(span2)
        masterDiv.appendChild(div2)

        let div3 = document.createElement('div')
        let titleSpan3 = document.createElement('span')
        let span3 = document.createElement('span')
        titleSpan3.style.fontWeight='bold';
        titleSpan3.innerText='UUID: '
        span3.innerText=player.uuid
        div3.appendChild(titleSpan3)
        div3.appendChild(span3)
        masterDiv.appendChild(div3)

        playerList.appendChild(masterDiv)
    }
}
function listTrains(){
    trainList.innerHTML='';
    for(let sec of data.SEC){
        for(let ctn of sec.cantons){
            if(ctn.trains.length>0){
                for(let train of ctn.trains){
                    let masterDiv = document.createElement('div')
                    masterDiv.classList.add('divPlayers')
                    let div1 = document.createElement('div')
                    let titleSpan1 = document.createElement('span')
                    let span1 = document.createElement('span')
                    titleSpan1.style.fontWeight='bold';
                    titleSpan1.innerText='Identifiant: '
                    span1.innerText=train.tid
                    div1.appendChild(titleSpan1)
                    div1.appendChild(span1)
                    masterDiv.appendChild(div1)

                    let div2 = document.createElement('div')
                    let titleSpan2 = document.createElement('span')
                    let span2 = document.createElement('span')
                    titleSpan2.style.fontWeight='bold';
                    titleSpan2.innerText='Conducteur: '
                    span2.innerText=train.owner
                    div2.appendChild(titleSpan2)
                    div2.appendChild(span2)
                    masterDiv.appendChild(div2)

                    let div3 = document.createElement('div')
                    let titleSpan3 = document.createElement('span')
                    let span3 = document.createElement('span')
                    titleSpan3.style.fontWeight='bold';
                    titleSpan3.innerText='Position: '
                    if(ctn.cid.startsWith('cG')){
                        span3.innerText=`${sec.id} - ${ctn.cid} (GARAGES)`
                    } else {
                        if(ctn.type){
                            span3.innerText=`${sec.id} - ${ctn.cid} => ${ctn.name}`
                        } else {
                            span3.innerText=`${sec.id} - ${ctn.cid}`
                        }
                    }
                    div3.appendChild(titleSpan3)
                    div3.appendChild(span3)
                    masterDiv.appendChild(div3)

                    trainList.appendChild(masterDiv)
                }
            }
        }
    }
    for(let player of data.players){

    }
}

copyConfig.addEventListener('click', () => {
    navigator.clipboard.writeText(window.actualRequest)
})

document.getElementById('btnPcc').addEventListener('click', ()=>{
    document.location.href='index.html'
})

document.getElementById('stopServer').addEventListener('click',()=>{
    actualRequest = JSON.stringify({
        op: 900,
        command: "stopServer",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest)
    window.actualRequest = actualRequest
})

document.getElementById('trainDelete').addEventListener('click', ()=>{
    let trainId = prompt('Numéro du train à effacer')
    actualRequest = JSON.stringify({
        op: 900,
        command: "trainDelete",
        train: trainId,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest)
    window.actualRequest = actualRequest
})
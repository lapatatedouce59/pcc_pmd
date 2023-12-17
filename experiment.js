window.WebSocket.addEventListener('message', msg => {
    if(JSON.parse(msg.data).op===10) return;
    data = JSON.parse(msg.data);
    console.log(data)

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
        addCheckListeners()
        }
        let parsedJson = data.content
        data = parsedJson
        console.log(data)
        //console.log(data)
        //adminData=data.admin
        function reload(){
            constructCtn()
        }
        reload()
    }
})

function getTrainRadioValue(){
    for(let elem of document.getElementsByName('radioTrains')) if(elem.checked) return elem.value;
};

function constructCtn(){
    for(let sec of data.SEC){
        if(!(sec.id==='1')) continue;
        for(let ctn of sec.cantons){
            if(ctn.trains.includes(getTrainRadioValue())) document.getElementById(ctn.cid.replace('c','')).checked=true; else document.getElementById(ctn.cid.replace('c','')).checked=false;
        }
    }
}

function addCheckListeners(){
    for(let ctnElem of document.getElementsByClassName('ctnCheckbox')){
        ctnElem.id=ctnElem.getAttribute('data-ctn')
        ctnElem.addEventListener('input',()=>{
            actualRequest = JSON.stringify({
                op: 402,
                uuid: window.uuid,
                ctnId: ctnElem.getAttribute('data-ctn'),
                train: getTrainRadioValue(),
                value: ctnElem.checked
            })
            window.actualRequest = actualRequest
            window.WebSocket.send(actualRequest)
        })
    }
}

document.getElementById('reloadBtn').addEventListener('click',()=>{
    console.log(data)
    constructCtn()
})
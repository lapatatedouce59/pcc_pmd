window.WebSocket.addEventListener('message', msg =>{
    data = JSON.parse(msg.data);
    if ((data.op===300)||(data.op===2)){
        let op = data.op
        data=data.content
        if(op===2){
            let pa = []
            for (let sec of data.SEC){
                console.log('PA '+sec.paid)
                pa.push({paid: sec.paid})
                let opt = document.createElement('OPTION')
                opt.innerHTML=train.tid
                opt.value=train.tid
                opt.classList='trainOpt'
                opt.id=train.tid
                selectMenuTrain.appendChild(opt)
            }
        }
        let train = getTrainInfo(selectMenuTrain.value)
        console.log(train)
        updateVoy(train)
    }
})
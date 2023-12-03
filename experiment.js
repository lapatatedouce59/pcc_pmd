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

        }

    }
})

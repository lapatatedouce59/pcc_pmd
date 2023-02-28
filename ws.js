const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
const logger = require('./logger')
const fs = require('fs')

const pccApi=require('./server.json')

const clients = new Map();

wss.on('connection', (ws) => {
    logger.client(true)

    function apiSave(){
        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));

        wss.broadcast(JSON.stringify({
            op: 300,
            content: pccApi
        }))
        logger.message('broadcast','NEW SERVER DATA => REFRESH')
        //ws.send();
    }

    wss.broadcast = function broadcast(msg) {
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    };

    ws.on('message', msg => {
        let data
        try{
            data = JSON.parse(msg);
        } catch (error) {
            logger.error(error)
        }
        op = data.op;

        if(op==='300') return;
        
        switch(op){
            case 1 :
                logger.identify(data.ip, data.country, data.city)
                logger.message('outcome','server.json')
                //ws.send(JSON.stringify(pccApi));
                ws.send(JSON.stringify(pccApi));
                break;
            case 200 :
                logger.message('income',JSON.stringify(data))
                switch(data.execute){
                    case 'AG':
                        pccApi.comAG=true
                        console.log(pccApi.comAG)
                        pccApi.voyGAT=2
                        pccApi.voyABS=2
                        pccApi.voyHTV1=2
                        pccApi.voyHTV2=2
                        pccApi.voyFSV1=2
                        pccApi.voyFSV2=2
                        pccApi.voyHTGAT=2
                        pccApi.voyFSGAT=2
                        
                        apiSave();
                        break;
                    case 'AGreset':
                        pccApi.comAG=false
                        console.log(pccApi.comAG)
                        pccApi.voyABS=true
                        pccApi.voyGAT=true
                        if(pccApi.comHTV1){
                            pccApi.voyHTV1=true
                        }
                        pccApi.voyHTV2=true
                        if(!(pccApi.comFSCUT)){
                            pccApi.voyFSV1=true
                            pccApi.voyFSV2=true
                        }
                        pccApi.voyHTGAT=true
                        pccApi.voyFSGAT=true
                        apiSave();
                        break;
                    case 'LINE-ACQU':
                        if (pccApi.voyGAT===2) pccApi.voyGAT=1
                        if (pccApi.voyABS===2) pccApi.voyABS=1
                        if (pccApi.voyHTV1===2) pccApi.voyHTV1=1
                        if (pccApi.voyHTV2===2) pccApi.voyHTV2=1
                        if (pccApi.voyFSV1===2) pccApi.voyFSV1=1
                        if (pccApi.voyFSV2===2) pccApi.voyFSV2=1
                        if (pccApi.voyHTGAT===2) pccApi.voyHTGAT=1
                        if (pccApi.voyFSGAT===2) pccApi.voyFSGAT=1
                        apiSave();
                        break;
                }
                break;
            case 202 :
                logger.message('income',JSON.stringify(data))
                switch(data.execute){
                    case 'FS-LINE-COM':
                        if(data.state===false){
                            pccApi.comFSCUT=false
                            if(pccApi.comAG===false){
                                console.log('OK')
                                console.log(pccApi.comAG)
                                pccApi.voyFSV1=true
                                pccApi.voyFSV2=true
                            }
                        } else if(data.state===true){
                            pccApi.comFSCUT=true
                            pccApi.voyFSV1=2
                            pccApi.voyFSV2=2
                        }
                        break;
                    case 'HTAUT1-COM':
                        if(data.state===false){
                            pccApi.comHTV1=false
                            if(pccApi.comAG===false){
                                pccApi.voyHTV1=2
                            }
                        } else if(data.state===true){
                            pccApi.comHTV1=true
                            if(pccApi.comAG===false){
                                pccApi.voyHTV1=true
                            }
                        }
                        break;
                    case 'IDPO-COM':
                        if(data.state===false){
                            pccApi.comIDPO=false
                        } else if(data.state===true){
                            pccApi.comIDPO=true
                        }
                        break;
                    case 'UCAINHIB-COM':
                        if(data.state===false){
                            pccApi.comInhibUCA=false
                        } else if(data.state===true){
                            pccApi.comInhibUCA=true
                        }
                        break;
                }
                apiSave()
        }
    })

    ws.on('close', ()=>{
        logger.client(false)
    })
})


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
                    case 'AGreset': //TODO Empecher que la fs se rétablisse quand la coupure est cochée (comme fait avec la ht)
                        pccApi.comAG=false
                        console.log(pccApi.comAG)
                        if((pccApi.comAuthV1) && (pccApi.comAuthV2) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        }
                        if(pccApi.comAuthV1){
                            pccApi.voyHTV1=true
                        }
                        if(pccApi.comAuthV2){
                            pccApi.voyHTV2=true
                        }
                        if(!(pccApi.comFSLine)){
                            pccApi.voyFSV1=true
                            pccApi.voyFSV2=true
                        }
                        if(!(pccApi.comFSGAT)){
                            pccApi.voyFSGAT=true
                        }
                        if(pccApi.comAuthGAT){
                            pccApi.voyHTGAT=true
                        }
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
                            pccApi.comFSLine=false
                            if(pccApi.comAG===false){
                                console.log('OK')
                                console.log(pccApi.comAG)
                                pccApi.voyFSV1=true
                                pccApi.voyFSV2=true
                            }
                        } else if(data.state===true){
                            pccApi.comFSLine=true
                            pccApi.voyFSV1=2
                            pccApi.voyFSV2=2
                        }
                        if((pccApi.comAuthV1) && (pccApi.comAuthV2) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        } else {
                            pccApi.voyABS=2
                        }
                        break;
                    case 'FS-GAT-COM':
                        if(data.state===false){
                            pccApi.comFSGAT=false
                            if(pccApi.comAG===false){
                                console.log('OK')
                                console.log(pccApi.comAG)
                                pccApi.voyFSGAT=true
                            }
                        } else if(data.state===true){
                            pccApi.comFSGAT=true
                            pccApi.voyFSGAT=2
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        } else {
                            pccApi.voyGAT=2
                        }
                        break;
                    case 'HTAUT1-COM':
                        if(data.state===false){
                            pccApi.comAuthV1=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTV1=2
                            }
                        } else if(data.state===true){
                            pccApi.comAuthV1=true
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTV1=true
                            }
                        }
                        if((pccApi.comAuthV1) && (pccApi.comAuthV2) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        } else {
                            pccApi.voyABS=2
                        }
                        break;
                    case 'HTAUT2-COM':
                        if(data.state===false){
                            pccApi.comAuthV2=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTV2=2
                            }
                        } else if(data.state===true){
                            pccApi.comAuthV2=true
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTV2=true
                            }
                        }
                        if((pccApi.comAuthV1) && (pccApi.comAuthV2) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        } else {
                            pccApi.voyABS=2
                        }
                        break;
                    case 'HTAUTGAT-COM':
                        if(data.state===false){
                            pccApi.comAuthGAT=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTGAT=2
                            }
                        } else if(data.state===true){
                            pccApi.comAuthGAT=true
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTGAT=true
                            }
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        } else {
                            pccApi.voyGAT=2
                        }
                        break;

                    case 'FORCEHT-COM':
                        if(data.state===false){
                            pccApi.comForceHT=false
                            if(pccApi.comAG===true){
                                pccApi.voyHTV1=2
                                pccApi.voyHTV2=2
                                pccApi.voyHTGAT=2
                            }
                        } else if(data.state===true){
                            pccApi.comForceHT=true
                            if(pccApi.comAG===true){
                                pccApi.voyHTV1=true
                                pccApi.voyHTV2=true
                                pccApi.voyHTGAT=true
                            }
                        }
                        if((pccApi.comAuthV1) && (pccApi.comAuthV2) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        } else {
                            pccApi.voyABS=2
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        } else {
                            pccApi.voyGAT=2
                        }
                        break;
                    case 'IDPO-COM':
                        if(data.state===false){
                            pccApi.comIDPOTPAS=false
                        } else if(data.state===true){
                            pccApi.comIDPOTPAS=true
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


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
const logger = require('./logger')
const fs = require('fs')

const pccApi=require('./server.json')

const clients = new Map();

wss.on('connection', (ws) => {
    logger.client(true)

    ws.on('message', msg => {
        let data
        try{
            data = JSON.parse(msg);
        } catch (error) {
            logger.error(error)
        }
        op = data.op;
        
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
                        pccApi.voyGAT=1
                        pccApi.voyABS=1
                        pccApi.voyHTV1=1
                        pccApi.voyHTV2=1
                        pccApi.voyFSV1=1
                        pccApi.voyFSV2=1
                        pccApi.voyHTGAT=1
                        pccApi.voyFSGAT=1
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        ws.send(JSON.stringify({
                            op: 201,
                            content: pccApi
                        }));
                        break;
                    case 'AGreset':
                        pccApi.voyABS=true
                        pccApi.voyGAT=true
                        pccApi.voyHTV1=true
                        pccApi.voyHTV2=true
                        pccApi.voyFSV1=true
                        pccApi.voyFSV2=true
                        pccApi.voyHTGAT=true
                        pccApi.voyFSGAT=true
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        ws.send(JSON.stringify({
                            op: 201,
                            content: pccApi
                        }));
                        break;
                }
        }
    })

    ws.on('close', ()=>{
        logger.client(false)
    })
})


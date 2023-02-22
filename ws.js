const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
const logger = require('./logger')

const clients = new Map();

wss.on('connection', (ws, req) => {
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
                break;
        }
    })

    ws.on('close', ()=>{
        logger.client(false)
    })
})

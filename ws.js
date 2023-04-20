console.log('[@] Library init')
const logger = require('./logger')
const fs = require('fs')
const https = require('https')
console.log('[V] Library init logger and fs')
console.log('[@] WebSocket init')
const {WebSocket, WebSocketServer} = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
/*const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/patate.ddns.net/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/patate.ddns.net/privkey.pem')
})

const wss = new WebSocketServer({server});*/

console.log('[V] WebSocket init on port 8081')
console.log('[@] Server Api init')
const pccApi=require('./server.json');
console.log('[V] Server Api init')

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
                        if (pccApi.voyGAT===2) pccApi.voyGAT=1;
                        if (pccApi.voyABS===2) pccApi.voyABS=1;
                        if (pccApi.voyHTV1===2) pccApi.voyHTV1=1;
                        if (pccApi.voyHTV2===2) pccApi.voyHTV2=1;
                        if (pccApi.voyFSV1===2) pccApi.voyFSV1=1;
                        if (pccApi.voyFSV2===2) pccApi.voyFSV2=1;
                        if (pccApi.voyHTGAT===2) pccApi.voyHTGAT=1;
                        if (pccApi.voyFSGAT===2) pccApi.voyFSGAT=1;
                        //VOYANTS SS
                        console.log(pccApi.SS[0].voyDHTSS04)
                        if (pccApi.SS[0].voyAlimSS04===2) pccApi.SS[0].voyAlimSS04=1;
                        if (pccApi.SS[0].voyDHTSS04===2) pccApi.SS[0].voyDHTSS04=1;
                        if (pccApi.SS[0].voyDISS04===2) pccApi.SS[0].voyDISS04=1;
                        if (pccApi.SS[1].voyAlimSS05===2) pccApi.SS[1].voyAlimSS05=1;
                        if (pccApi.SS[1].voyDHTSS05===2) pccApi.SS[1].voyDHTSS05=1;
                        if (pccApi.SS[1].voyDISS05===2) pccApi.SS[1].voyDISS05=1;
                        if (pccApi.SS[2].voyAlimSS06===2) pccApi.SS[2].voyAlimSS06=1;
                        if (pccApi.SS[2].voyDHTSS06===2) pccApi.SS[2].voyDHTSS06=1;
                        if (pccApi.SS[2].voyDISS06===2) pccApi.SS[2].voyDISS06=1;
                        if (pccApi.SS[3].voyAlimSS07===2) pccApi.SS[3].voyAlimSS07=1;
                        if (pccApi.SS[3].voyDHTSS07===2) pccApi.SS[3].voyDHTSS07=1;
                        if (pccApi.SS[3].voyDISS07===2) pccApi.SS[3].voyDISS07=1;
                        if (pccApi.SS[4].voyAlimSS08===2) pccApi.SS[4].voyAlimSS08=1;
                        if (pccApi.SS[4].voyDHTSS08===2) pccApi.SS[4].voyDHTSS08=1;
                        if (pccApi.SS[4].voyDISS08===2) pccApi.SS[4].voyDISS08=1;
                        if (pccApi.SS[5].voyAlimSS09===2) pccApi.SS[5].voyAlimSS09=1;
                        if (pccApi.SS[5].voyDHTSS09===2) pccApi.SS[5].voyDHTSS09=1;
                        if (pccApi.SS[5].voyDISS09===2) pccApi.SS[5].voyDISS09=1;
                        if (pccApi.SS[6].voyAlimSS10===2) pccApi.SS[6].voyAlimSS10=1;
                        if (pccApi.SS[6].voyDHTSS10===2) pccApi.SS[6].voyDHTSS10=1;
                        if (pccApi.SS[6].voyDISS10===2) pccApi.SS[6].voyDISS10=1;
                        if (pccApi.SS[7].voyAlimSS11===2) pccApi.SS[7].voyAlimSS11=1;
                        if (pccApi.SS[7].voyDHTSS11===2) pccApi.SS[7].voyDHTSS11=1;
                        if (pccApi.SS[7].voyDISS11===2) pccApi.SS[7].voyDISS11=1;
                        if (pccApi.SS[8].voyAlimSS12===2) pccApi.SS[8].voyAlimSS12=1;
                        if (pccApi.SS[8].voyDHTSS12===2) pccApi.SS[8].voyDHTSS12=1;
                        if (pccApi.SS[8].voyDISS12===2) pccApi.SS[8].voyDISS12=1;
                        if (pccApi.SS[9].voyAlimSS13===2) pccApi.SS[9].voyAlimSS13=1;
                        if (pccApi.SS[9].voyDHTSS13===2) pccApi.SS[9].voyDHTSS13=1;
                        if (pccApi.SS[9].voyDISS13===2) pccApi.SS[9].voyDISS13=1;
                        if (pccApi.SS[10].voyAlimSS14===2) pccApi.SS[10].voyAlimSS14=1;
                        if (pccApi.SS[10].voyDHTSS14===2) pccApi.SS[10].voyDHTSS14=1;
                        if (pccApi.SS[10].voyDISS14===2) pccApi.SS[10].voyDISS14=1;
                        if (pccApi.SS[11].voyAlimSS15===2) pccApi.SS[11].voyAlimSS15=1;
                        if (pccApi.SS[11].voyDHTSS15===2) pccApi.SS[11].voyDHTSS15=1;
                        if (pccApi.SS[11].voyDISS15===2) pccApi.SS[11].voyDISS15=1;
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
                    case 'ARMPR-COM':
                        if(data.state===false){
                            pccApi.comArmPR=false
                            pccApi.SS[0].voyDHTSS04=2;
                            pccApi.SS[1].voyDHTSS05=2;
                            pccApi.SS[2].voyDHTSS06=2;
                            pccApi.SS[3].voyDHTSS07=2;
                            pccApi.SS[4].voyDHTSS08=2;
                            pccApi.SS[5].voyDHTSS09=2;
                            pccApi.SS[6].voyDHTSS10=2;
                            pccApi.SS[7].voyDHTSS11=2;
                            pccApi.SS[8].voyDHTSS12=2;
                            pccApi.SS[9].voyDHTSS13=2;
                            pccApi.SS[10].voyDHTSS14=2;
                            pccApi.SS[11].voyDHTSS15=2;
                        } else if(data.state===true){
                            pccApi.comArmPR=true
                            pccApi.SS[0].voyDHTSS04=true;
                            pccApi.SS[1].voyDHTSS05=true;
                            pccApi.SS[2].voyDHTSS06=true;
                            pccApi.SS[3].voyDHTSS07=true;
                            pccApi.SS[4].voyDHTSS08=true;
                            pccApi.SS[5].voyDHTSS09=true;
                            pccApi.SS[6].voyDHTSS10=true;
                            pccApi.SS[7].voyDHTSS11=true;
                            pccApi.SS[8].voyDHTSS12=true;
                            pccApi.SS[9].voyDHTSS13=true;
                            pccApi.SS[10].voyDHTSS14=true;
                            pccApi.SS[11].voyDHTSS15=true;
                        }
                        break;
                }
                apiSave()
                break;
            case 400:
                class Aiguille {
                    constructor(cantonPath){
                        this.cantonPath=cantonPath
                    }
                    get dir(){
                        let aigDir = this.cantonPath.dir
                        if(aigDir) return aigDir;
                        return false;
                    }
                }

                let a1301 = new Aiguille(pccApi.SEC[0].cantons[2])
                let a2301 = new Aiguille(pccApi.SEC[0].cantons[7])

                logger.message('income',JSON.stringify(data))

                if(data.sens === 1){
                    let train = JSON.parse(getCantonsInfo(data.train))
                    console.log(train)
                    let _cantonIndex = parseFloat(train.cantonIndex)   
                    let _trainIndex = parseFloat(train.trainIndex)
                    let _secIndex = parseFloat(train.secIndex)
                    console.log(_cantonIndex +' et '+ _trainIndex)                        
                    console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex])

                    //?    On va donc regarder la voie active du train -> vérifier la possibilité de mouvement -> vérifier le type -> vérifier la continuité du canton -> créer le mouvement avec les bons indexs        ////////////////////////


                    if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("c1")){
                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie 1 canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S1? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                logger.error('Pas de canton +1!')
                                console.log('[S1? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? V1 SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {   //check si y'a un iti
                            console.log("[S1? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            //? ITIS D'AIGUILLES
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="up" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
                                pccApi.SEC[_secIndex].cantons[7].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="up" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[6].cid)
                                pccApi.SEC[_secIndex].cantons[6].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position==="a1"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
                                pccApi.SEC[_secIndex].cantons[2].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }; //pas d'iti, on traite l'aiguille comme un canton normal
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                logger.error('Pas de canton +1!')
                                console.log('[S1? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? V1 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }



                    } else if (pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("c2")){




                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie 2 canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S1? V2] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                logger.error('Pas de canton -1!')
                                console.log('[S1? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? V2 SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {
                            console.log("[S1? V2] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            console.warn('pour l\'instant on s\'en fous des iti mais faudra les mettre!')    //?         METTRE LES ITIS
                            
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? V2 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
                                    pccApi.SEC[_secIndex].cantons[2].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                } else
                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[1].cid)
                                    pccApi.SEC[_secIndex].cantons[1].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                } else
                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="up" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position==="a1"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
                                    pccApi.SEC[_secIndex].cantons[7].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                };

                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                    logger.error('Pas de canton -1!')
                                    console.log('[S1? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)
    
                                    let _NEXTCINDEX = false

                                    switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                        case 'c2101':
                                            _NEXTCINDEX = 7
                                            break;
                                        default:
                                            _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                    }
    
                                    pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                }

                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                            } else {
                                console.log('[S1? V2 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2101':
                                        _NEXTCINDEX = 7
                                        break;
                                    default:
                                        _NEXTCINDEX = 0
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }
                    }

                    //?         FIN DE MOOVHANDLER V1            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                } else if(data.sens === 2){
                    let train = JSON.parse(getCantonsInfo(data.train))
                    console.log(train)
                    let _cantonIndex = parseFloat(train.cantonIndex)   
                    let _trainIndex = parseFloat(train.trainIndex)
                    let _secIndex = parseFloat(train.secIndex)
                    console.log(_cantonIndex +' et '+ _trainIndex)
                    console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex])
                    if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==='2501') return;
                    if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==='1101') return;

                    //?    On va donc regarder la voie active du train -> vérifier la possibilité de mouvement -> vérifier le type -> vérifier la continuité du canton -> créer le mouvement avec les bons indexs        ////////////////////////


                    if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("c1")){
                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie 1 canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S2? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                logger.error('Pas de canton -1!')
                                console.log('[S2? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c1102':
                                        _NEXTCINDEX = 4
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? V1 SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c1102':
                                        _NEXTCINDEX = 4
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {   //check si y'a un iti
                            console.log("[S2? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
                                pccApi.SEC[_secIndex].cantons[2].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[1].cid)
                                pccApi.SEC[_secIndex].cantons[1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else
                            if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="up" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position==="a1"){
                                console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
                                pccApi.SEC[_secIndex].cantons[7].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }; //pas d'iti, on traite l'aiguille comme un canton normal
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                logger.error('Pas de canton -1!')
                                console.log('[S2? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                console.log(_NEXTCINDEX)

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c1102':
                                        _NEXTCINDEX = 4
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? V1 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c1102':
                                        _NEXTCINDEX = 4
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }



                    } else if (pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("c2")){




                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie 2 canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S2? V2] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                logger.error('Pas de canton +1!')
                                console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2402':
                                        _NEXTCINDEX = 5
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? V2 SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)

                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2402':
                                        _NEXTCINDEX = 5
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {
                            console.log("[S2? V2] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            console.warn('pour l\'instant on s\'en fous des iti mais faudra les mettre!')
                            
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? V2 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)

                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
                                    pccApi.SEC[_secIndex].cantons[2].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                } else
                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="down" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position=="a2"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[1].cid)
                                    pccApi.SEC[_secIndex].cantons[1].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                } else
                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && pccApi.SEC[_secIndex].cantons[_cantonIndex].dir=="up" && pccApi.SEC[_secIndex].cantons[_cantonIndex].position==="a1"){
                                    console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
                                    pccApi.SEC[_secIndex].cantons[7].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                };

                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                    logger.error('Pas de canton +1!')
                                    console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)
    
                                    let _NEXTCINDEX = false
    
                                    switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                        case 'c2402':
                                            _NEXTCINDEX = 5
                                            break;
                                        //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                    }
    
                                    pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                }

                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V2 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = false

                                switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                                    case 'c2402':
                                        _NEXTCINDEX = 5
                                        break;
                                    //au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }
                    }

                    //?         FIN DE MOOVHANDLER V2            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
                break;
            case 500:
                logger.message('income',JSON.stringify(data))
                let args = data.cmd
                let cmd = args[0]

                let cmdargs = args
                args.shift()

                console.log(cmdargs)

                let aiguilles = []


                if(!((cmdargs[0])||(cmdargs[1]))){
                    console.log('aucun canton renseigné')
                    return;
                }
                console.log('commande '+cmd)
                for (let _CANTON_ of pccApi.SEC[0].cantons){
                    if(_CANTON_.hasOwnProperty('position')){
                        let index = pccApi.SEC[0].cantons.findIndex(obj => {
                            return obj.cid===_CANTON_.cid
                        })
                        aiguilles.push({c:_CANTON_, index:index})
                    }
                }
                console.log(aiguilles)

                if(cmd==="SET"){                        
                    if(cmdargs.length<2||cmdargs.length>2)   return;
                    if(cmdargs[0]==='1201' && cmdargs[1]==='2201'){
                        console.log('ITI A2 SENS 1 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='up';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='up';

                    } else
                    if(cmdargs[0]==='2201' && cmdargs[1]==='1201'){
                        console.log('ITI A2 SENS 2 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='down';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='down';

                    } else
                    if(cmdargs[0]==='2401' && cmdargs[1]==='1401'){
                        console.log('ITI A1 SENS 1 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='down';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='down';

                    } else
                    if(cmdargs[0]==='1401' && cmdargs[1]==='2401'){
                        console.log('ITI A1 SENS 2 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='up';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='up';

                    } else
                    if(cmdargs[0]==='A' && cmdargs[1]==='R'){ //commande de reset
                        console.log('ITI A RESET')
                        pccApi.SEC[0].cantons[aiguilles[0].index].position='r';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='r';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='r';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='r';
                    }
                    apiSave()
                }

        }
    })

    ws.on('close', ()=>{
        logger.client(false)
    })
})

/**
 * Cherche sur quel canton se trouve le train passé en paramètre
 * @param id l'ID du train
 */ 
function getCantonsInfo(id){
    let fresponse={ trains: [] }
    for (let _SEC_ in pccApi.SEC){
        for (let _CANTON_ in pccApi.SEC[_SEC_].cantons){
            _CANTON_ = parseInt(_CANTON_);
            _SEC_ = parseInt(_SEC_);
                console.log('[❔] ARRAY['+_CANTON_+'], SECTION['+_SEC_+']')
                //console.log(data.SEC[0].cantons[0].trains[0]) EXEMPLE DE CHEMIN
                if(pccApi.SEC[_SEC_].cantons[_CANTON_].trains.length >= 1){
                    console.log('[👉] canton '+(_CANTON_+1)+'section '+(_SEC_+1)+' occupé')
                
                    for(let _TRAIN_ in pccApi.SEC[_SEC_].cantons[_CANTON_].trains){
                        console.log(pccApi.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_]);
                        let tid = pccApi.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_].tid;
                        //canton_train.set(_TRAIN_, _CANTON_)
                        console.log('_TRAIN_ '+_TRAIN_+" _CANTON_ "+_CANTON_)
    
                        fresponse.trains.push( {
                            cantonId: pccApi.SEC[_SEC_].cantons[_CANTON_].cid,
                            cantonIndex: _CANTON_,
                            trainId: tid,
                            trainIndex: _TRAIN_,
                            secId: pccApi.SEC[_SEC_].id,
                            secIndex: _SEC_
                        } )
                    }
                }
            }
        }
    if (id){
        console.log(fresponse.trains)
        for(let rame of fresponse.trains){
            if(rame.trainId == id) return JSON.stringify(rame);
        }
        return false;
    } else return JSON.stringify(fresponse) //!!! CRASH DU WS QUAND 2 RAMES: LA 2EME RAME EST IMMOBILE ET CREE UN CRASH
}

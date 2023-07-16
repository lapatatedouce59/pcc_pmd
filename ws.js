console.log('[@] Library init')
const logger = require('./logger')
const ogia = require('./OGIA')
const gsa = require('./GSA')
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


const wss = new WebSocketServer({server});

server.listen(8081, function listening() {
    console.log('Address: ', wss.address());
});

const dotenv = require('dotenv');
dotenv.config();
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookToken = process.env.DISCORD_TOKEN
const webhookClient = new WebhookClient({ url: webhookToken });


wss.addListener('listening',()=>{
    const embed = new EmbedBuilder()
	    .setTitle('Status du PCC')
	    .setColor('#74C365')
        .setDescription('Le serveur général du PCC a démarré!');
    webhookClient.send({
	    content: '',
	    embeds: [embed],
    });
})*/
const {setTimeout} = require('timers/promises')

console.log('[V] WebSocket init on port 8081')
console.log('[@] Server Api init')
const pccApi=require('./server.json');
console.log('[V] Server Api init')

const {v4} = require('uuid')
const clients = {}

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

function isClientExisting(uuid){
    if(clients[uuid]) return true;
    /*for(let client of clients){
        console.log(client[0])
        if(uuid===client.uuid){
            return true;
        } else {
            continue;
        }
    }*/
    return false;
}
//PREFAB FUNCTIONS
let ss04CLIST = ['c1101','c1201','c1301','c1401','c1501','c2101','c2201','c2301','c2401','c2501']
let ss05CLIST = ['c1102','c1202','c1302','c1402','c2102','c2202','c2302','c2402']
function HTTrains(type,zone){
    function executeDwn(veh){
        if(veh.states.awakeMR===true){
            veh.states.abs750=2
            veh.states.btDelest=2
            veh.states.trainBattery=2
            veh.states.reguTrain=false
            veh.states.activeOnduls=false
            veh.states.trainLights=false
            veh.states.trainHeating=false
            veh.states.trainComp=false
            veh.states.defTech=2
            veh.states.defCvs=2
            veh.states.cmdTraction=false
        }
    }
    function executeUp(veh){
        if(veh.states.awakeMR===true){
            let timeFunc = async () => {
                await setTimeout(2700)
                veh.states.abs750=false
                veh.states.btDelest=false
                veh.states.trainBattery=false
                apiSave()
                await setTimeout(3400)
                veh.states.avarieOnduls=2
                veh.states.defTech=2
                veh.states.trainHeating=true
                veh.states.trainComp=true
                apiSave()
                await setTimeout(2500)
                veh.states.defCvs=false
                veh.states.trainLights=true
                apiSave()
                await setTimeout(120)
                veh.states.prodPert=true
                apiSave()
                await setTimeout(4900)
                veh.states.avarieOnduls=false
                veh.states.activeOnduls=true
                veh.states.defTech=false
                apiSave()
            }
            timeFunc()
        }
    }
    switch(zone){
        case 'SS04':
            var ss=pccApi.SS[0]
            if(type==='down'){
                ss.voyHTAut=2
                ss.voyHT=2
                ss.voyPA=2
                
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHTAutABS=true
                }
                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHT=true
                }
                if((pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHTAut=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss04CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        if(type === 'down'){
                            for(let veh of ctn.trains){
                                executeDwn(veh)
                            }
                        }
                        if(type === 'up'){
                            for(let veh of ctn.trains){
                                executeUp(veh)
                            }
                        }
                    }
                    
                }
            }
        break;
        case 'SS05':
            var ss=pccApi.SS[1]
            if(type==='down'){
                ss.voyHTAut=2
                ss.voyHT=2
                ss.voyPA=2
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHTAutABS=true
                }
                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHT=true
                }
                if((pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                    ss.voyHTAut=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss05CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        if(type === 'down'){
                            executeDwn(veh)
                        }
                        if(type === 'up'){
                            executeUp(veh)
                        }
                    }
                }
            }
        break;
        case 'all':
            if(type==='down'){
                let ss=pccApi.SS[0]
                ss.voyHTAut=2
                ss.voyHTAutABS=2
                ss.voyHT=2
                ss.voyPA=2
                ss=pccApi.SS[1]
                ss.voyHTAut=2
                ss.voyHTAutABS=2
                ss.voyHT=2
                ss.voyPA=2
            } else if(type==='up') {
                for(let ss of pccApi.SS){
                    if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                        ss.voyHTAutABS=true
                    }
                    if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                        ss.voyHT=true
                    }
                    if((pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                        ss.voyHTAut=true
                    }
                    if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                        ss.voyPA=true
                    }
                }
            }
            console.log('ABC')
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(ss04CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[0].comAutHT===false)&&(pccApi.SS[0].voyHTAut===true)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    executeDwn(veh)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    executeUp(veh)
                                }
                            }
                        }
                    } else
                    if(ss05CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[1].comAutHT===false)&&(pccApi.SS[1].voyHTAut===true)&&(pccApi.SS[1].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    executeDwn(veh)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    executeUp(veh)
                                }
                            }
                        }
                    } else continue;
                }
            }
        break;
    }
}

function FSTrains(type,zone){
    function executeDwn(veh){
        if(veh.states.awakeMR===true){
            veh.states.fsOk=2
            veh.states.fuNoFS=2
            veh.states.cmdFu=2
            veh.states.reguTrain=false
            veh.states.activeFU=true
            veh.states.cmdTraction=false
            let checkSpeedInter = setInterval(checkSpeed,100)
            function checkSpeed(){
                if(veh.states.speed===0){
                    clearInterval(checkSpeedInter)
                    veh.states.activeFI=true
                    apiSave()
                }
            }
        }
    }
    function executeUp(veh){
        if(veh.states.awakeMR===true){
            veh.states.fsOk=true
            veh.states.fuNoFS=false
            veh.states.cmdFu=false
            veh.states.activeFU=false
            veh.states.cmdTraction=true
            veh.states.activeFI=false
        }
    }
    switch(zone){
        case 'SS04':
            var ss=pccApi.SS[0]
            if(type==='down'){
                ss.voyFS=2
                ss.voyPA=2
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                    ss.voyFS=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss04CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        if(type === 'down'){
                            for(let veh of ctn.trains){
                                executeDwn(veh)
                            }
                        }
                        if(type === 'up'){
                            for(let veh of ctn.trains){
                                executeUp(veh)
                            }
                        }
                    }
                    
                }
            }
        break;
        case 'SS05':
            var ss=pccApi.SS[1]
            if(type==='down'){
                ss.voyFS=2
                ss.voyPA=2
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                    ss.voyFS=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss05CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        if(type === 'down'){
                            executeDwn(veh)
                        }
                        if(type === 'up'){
                            executeUp(veh)
                        }
                    }
                }
            }
        break;
        case 'all':
            if(type==='down'){
                let ss=pccApi.SS[0]
                ss.voyFS=2
                ss.voyPA=2
                ss=pccApi.SS[1]
                ss.voyFS=2
                ss.voyPA=2
            } else if(type==='up') {
                for(let ss of pccApi.SS){
                    if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                        ss.voyFS=true
                    }
                    if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                        ss.voyPA=true
                    }
                }
            }
            console.log('ABC')
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(ss04CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[0].comCoupFS===false)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    executeDwn(veh)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    executeUp(veh)
                                }
                            }
                        }
                    } else
                    if(ss05CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[1].comCoupFS===false)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    executeDwn(veh)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    executeUp(veh)
                                }
                            }
                        }
                    } else continue;
                }
            }
        break;
    }
}

wss.on('connection', (ws, req) => {
    let newUUID;
    logger.client(true)
    let clientIp=req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    newUUID = v4();

    ws.on('message', msg => {
        let data = false;
        let op = 0;
        try{
            data = JSON.parse(msg);
            op = data.op;
        } catch (error) {
            logger.error(error)
        }

        if(op==='300') return;
        
        switch(op){
            case 1 :
                const verificationProcess = async() => {
                    let whitelist = ['383637400099880964']
                    let chefs = ['383637400099880964']
                    /*await setTimeout(function (){
                        let discordVerif = discord.getUserInfo(data.token)
                        console.log(discordVerif)
                    },1000)*/
                    //await setTimeout(1000)
                    if(data.token){
                        fetch('https://discord.com/api/users/@me', {
                            headers:{Authorization:'Bearer '+data.token}}).then(res => {
                                if(res.status===401){
                                    logger.error('[DV] Utilisateur inconnu.')
                                    ws.send(JSON.stringify({ op: 999,error: 10, message: 'L\'utilisateur est inconnu.' }))
                                } else {
                                    res.json().then(usr => {
                                    if(whitelist.includes(usr.id)){
                                        logger.info('[DV] '+usr.username+' autorisé.')
                                        ws.id=newUUID
                                        ws.usr=usr
                                        ws.ip=clientIp
                                        ws.instance=data.from
                                        if(chefs.includes(usr.id)){
                                            ws.role='chef'
                                        } else {
                                            ws.role='operator'
                                        }
                                        wss.broadcast(JSON.stringify({
                                            op: 10,
                                            content: { uuid: ws.id, uname: ws.usr.username }
                                        }))
                                        ws.send(JSON.stringify({ op: 2, uuid: ws.id, content: pccApi, uname:ws.usr.username, role:ws.role }))
                                        clients[ws.id]=ws
                                        logger.identify(ws,Object.keys(clients).length)
                                    } else {
                                        logger.error('[DV] '+usr.username+' non whitelisté')
                                        ws.send(JSON.stringify({ op: 999,error: 20, message: 'L\'utilisateur n\'est pas whitelisté.' }))
                                    }})
                                }
                        })
                    } else {
                        logger.error('[DV] Pas de token renseigné!')
                        ws.send(JSON.stringify({ op: 999,error: 30, message: 'L\'utilisateur n\'a pas envoyé de token valide ou une erreur est survenue.' }))
                    }
                }
                verificationProcess()
                /*console.log(clientIp)
                let client = {uuid: newUUID, ip: clientIp, instance:data.from, uname: data.uname};
                clients.set(newUUID,client)
                console.log(clients)
                logger.identify(clientIp, newUUID, clients.get(newUUID).instance)
                logger.message('outcome','server.json')
                //ws.send(JSON.stringify(pccApi));
                ws.send(JSON.stringify(pccApi));*/
                break;
            /*case 2:
                console.log('Demande d\'UUID reçue. Envoi dans 1 seconde.')
                const bahOnVaAttendreSinonLautreIlVaPasEtreContent = async() => {
                    await setTimeout(500)
                    logger.message('outcome',newUUID)
                    ws.send(JSON.stringify({uuid: newUUID, op:3}))
                }
                bahOnVaAttendreSinonLautreIlVaPasEtreContent()
                console.log('UUID envoyée.')
                break;
            case 4:
                console.log('['+clients.get(data.uuid).uuid+'] Confirmation d\'UUID reçue. Envoi dans 1 seconde.')
                const goEncoreAttendre = async() => {
                    await setTimeout(200)
                    if(!isClientExisting(data.uuid)) return;
                    wss.broadcast(JSON.stringify({
                        op: 10,
                        content: { uuid: clients.get(data.uuid).uuid, uname: clients.get(data.uuid).uname }
                    }))
                    await setTimeout(200)
                    logger.message('broadcast','ARRIVAL')
                    wss.broadcast(JSON.stringify({
                        op: 300,
                        content: pccApi
                    }))
                    logger.message('outcome','server.json')
                }
                goEncoreAttendre()
                console.log('Serveur envoyée.')
                break;*/
            case 200 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                switch(data.execute){
                    case 'AG':
                        pccApi.comAG=true
                        console.log(pccApi.comAG)
                        pccApi.voyGAT=2
                        pccApi.voyABS=2
                        pccApi.voyHT=2
                        pccApi.voyFS=2
                        pccApi.voyHTGAT=2
                        pccApi.voyFSGAT=2
                        HTTrains('down','all')
                        FSTrains('down','all')
                        /*for (let sec of pccApi.SEC){
                            for(let ctn of sec.cantons){
                                for(let veh of ctn.trains){
                                    if(veh.states.awakeMR===true){
                                        veh.states.abs750=2
                                        veh.states.btDelest=2
                                        veh.states.trainBattery=2
                                        veh.states.fsOk=2
                                        veh.states.fuNoFS=2
                                        veh.states.cmdFu=2
                                        veh.states.reguTrain=false
                                        veh.states.activeFU=true
                                        veh.states.activeOnduls=false
                                        veh.states.trainLights=false
                                        veh.states.trainHeating=false
                                        veh.states.trainComp=false
                                        veh.states.defTech=2
                                        veh.states.defCvs=2
                                        veh.states.cmdTraction=false
                                        let checkSpeedInter = setInterval(checkSpeed,100)
                                        function checkSpeed(){
                                            if(veh.states.speed===0){
                                                clearInterval(checkSpeedInter)
                                                veh.states.activeFI=true
                                                apiSave()
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }*/
                        apiSave();
                        break;
                    case 'AGreset':
                        if(!(pccApi.comAG===true)) break;
                        pccApi.comAG=false
                        console.log(pccApi.comAG)
                        if((pccApi.comAuth) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        }
                        if(pccApi.comAuth){
                            pccApi.voyHT=true
                        }
                        if(!(pccApi.comFSLine)){
                            pccApi.voyFS=true
                        }
                        if(!(pccApi.comFSGAT)){
                            pccApi.voyFSGAT=true
                        }
                        if(pccApi.comAuthGAT){
                            pccApi.voyHTGAT=true
                        }
                        for(let ss of pccApi.SS){
                            if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                                ss.voyFS=true
                            }
                            if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                                ss.voyPA=true
                            }
                        }
                        for(let ss of pccApi.SS){
                            if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                ss.voyHTAutABS=true
                            }
                            if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                ss.voyHT=true
                            }
                            if((pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                ss.voyHTAut=true
                            }
                            if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                                ss.voyPA=true
                            }
                        }
                        for (let sec of pccApi.SEC){
                            for(let ctn of sec.cantons){
                                for(let veh of ctn.trains){
                                    if(veh.states.awakeMR===true){
                                        let timeFunc = async () => {
                                            await setTimeout(100)
                                            if(pccApi.voyFS===true){
                                                veh.states.fsOk=true
                                                veh.states.fuNoFS=false
                                            }
                                            apiSave()
                                            await setTimeout(600)
                                            if(pccApi.voyFS===true){
                                                veh.states.activeFI=false
                                                veh.states.activeFU=false
                                                veh.states.cmdFu=false
                                                veh.states.fuNoFS=false
                                            }
                                            apiSave()
                                            await setTimeout(300)
                                            if(pccApi.voyFS===true){
                                                veh.states.cmdTraction=true
                                                veh.states.tractionS1=true
                                            }
                                            apiSave()
                                            await setTimeout(5700)
                                            if(pccApi.voyHT===true){
                                                veh.states.abs750=false
                                                veh.states.btDelest=false
                                                veh.states.trainBattery=false
                                            }
                                            apiSave()
                                            await setTimeout(3400)
                                            if(pccApi.voyFS===true){
                                                veh.states.activeFU=true
                                                veh.states.tractionS1=false
                                                veh.states.cmdTraction=false
                                                veh.states.cmdFu=2
                                                veh.states.fuDiscMob=2
                                            }
                                            if(pccApi.voyHT===true){
                                                veh.states.avarieOnduls=2
                                                veh.states.defTech=2
                                                veh.states.trainHeating=true
                                                veh.states.trainComp=true
                                            }
                                            apiSave()
                                            await setTimeout(2500)
                                            if(pccApi.voyHT===true){
                                                veh.states.defCvs=false
                                                veh.states.trainLights=true
                                            }
                                            apiSave()
                                            await setTimeout(120)
                                            veh.states.prodPert=true
                                            apiSave()
                                            await setTimeout(4900)
                                            if(pccApi.voyHT===true){
                                                veh.states.avarieOnduls=false
                                                veh.states.activeOnduls=true
                                            }
                                            if(pccApi.voyFS===true){
                                                veh.states.activeFU=false
                                                veh.states.cmdFu=false
                                                veh.states.fuDiscMob=false
                                                veh.states.defTech=false
                                                veh.states.cmdTraction=true
                                            }
                                            apiSave()
                                        }
                                        timeFunc()
                                    }
                                }
                            }
                        }
                        apiSave();
                        break;
                    case 'LINE-ACQU':
                        if (pccApi.voyGAT===2) pccApi.voyGAT=1;
                        if (pccApi.voyABS===2) pccApi.voyABS=1;
                        if (pccApi.voyHT===2) pccApi.voyHT=1;
                        if (pccApi.voyFS===2) pccApi.voyFS=1;
                        if (pccApi.voyHTGAT===2) pccApi.voyHTGAT=1;
                        if (pccApi.voyFSGAT===2) pccApi.voyFSGAT=1;
                        if (pccApi.voyCC===2) pccApi.voyCC=1;
                        for (let ss of pccApi.SS){
                            for(let prop of Object.keys(ss)){
                                if(ss[prop]===2) ss[prop]=1
                            }
                        }
                        apiSave();
                        break;
                }
                break;
            case 202 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                switch(data.execute){
                    case 'FS-LINE-COM':
                        if(data.state===false){
                            pccApi.comFSLine=false
                            if(pccApi.comAG===false){
                                pccApi.voyFS=true
                                FSTrains('up','all')
                            }

                        } else if(data.state===true){
                            pccApi.comFSLine=true
                            pccApi.voyFS=2
                            FSTrains('down','all')
                            apiSave();
                        }
                        if((pccApi.comAuth) && !(pccApi.comFSLine)){
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
                    case 'HTAUT-COM':
                        if(data.state===false){
                            pccApi.comAuth=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHT=2
                                HTTrains('down','all')
                                apiSave();
                            }
                        } else if(data.state===true){
                            pccApi.comAuth=true
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHT=true
                                HTTrains('up','all')
                                apiSave();
                            }
                        }
                        if((pccApi.comAuth) && !(pccApi.comFSLine)){
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
                                pccApi.voyHT=2
                                pccApi.voyHTGAT=2
                            }
                        } else if(data.state===true){
                            pccApi.comForceHT=true
                            if(pccApi.comAG===true){
                                pccApi.voyHT=true
                                pccApi.voyHTGAT=true
                            }
                        }
                        if((pccApi.comAuth) && !(pccApi.comFSLine)){
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
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.DSO=false
                                    ctns.states.IDPOAlreadyActiveByPLTP=false
                                }
                            }
                        } else if(data.state===true){
                            pccApi.comIDPOTPAS=true
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.DSO=true
                                    ctns.states.IDPOAlreadyActiveByPLTP=true
                                }
                            }
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
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.alimDef=2
                                    ctns.states.IDPOAlreadyActiveByALC=true
                                    ctns.states.DSO=true
                                    if(ctns.trains[0]){
                                        let trainObj=ctns.trains[0]
                                        trainObj.states.forbiddenStart=2
                                    }
                                    
                                }
                            }
                            for (let ss of pccApi.SS){
                                ss.voyAlim=2
                                ss.voyHT=2
                                ss.voyHTAut=2
                                ss.voyHTAutABS=2
                                ss.voyPA=2
                            }
                            pccApi.voyABS=2
                            pccApi.voyHT=2
                            pccApi.voyCC=2
                        } else if(data.state===true){
                            pccApi.comArmPR=true
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.alimDef=false
                                    ctns.states.IDPOAlreadyActiveByALC=false
                                    if(ctns.trains[0]){
                                        let trainObj=ctns.trains[0]
                                        trainObj.states.forbiddenStart=false
                                    }
                                }
                            }
                            for (let ss of pccApi.SS){
                                ss.voyAlim=true
                                console.log(ss)
                                console.log(pccApi)
                                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                    ss.voyHTAutABS=true
                                }
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                    ss.voyHT=true
                                }
                                if((pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                    ss.voyHTAut=true
                                }
                                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                                    ss.voyPA=true
                                }
                            }
                            pccApi.voyCC=false
                            if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(pccApi.SS[0].voyHT===true)&&(pccApi.SS[1].voyHT==true)){
                                pccApi.voyHT=true
                            }
                            
                            if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(pccApi.SS[0].voyPA===true)&&(pccApi.SS[1].voyPA==true)&&(pccApi.comFSLine===false)&&(pccApi.voyALC===true)){
                                pccApi.voyABS=true
                            }
                        }
                        break;
                    case 'AUTHTSS04-COM':
                        if(data.state===false){
                            pccApi.SS[0].comAutHT=false
                            HTTrains('up','SS04')
                        } else if(data.state===true){
                            pccApi.SS[0].comAutHT=true
                            HTTrains('down','SS04')
                        }
                        break;
                    case 'AUTHTSS05-COM':
                        if(data.state===false){
                            pccApi.SS[1].comAutHT=false
                            HTTrains('up','SS05')
                        } else if(data.state===true){
                            pccApi.SS[1].comAutHT=true
                            HTTrains('down','SS05')
                        }
                        break;
                    case 'COUPFSSS04-COM':
                        if(data.state===false){
                            pccApi.SS[0].comCoupFS=false
                            FSTrains('up','SS04')
                        } else if(data.state===true){
                            pccApi.SS[0].comCoupFS=true
                            FSTrains('down','SS04')
                        }
                        break;
                    case 'COUPFSSS05-COM':
                        if(data.state===false){
                            pccApi.SS[1].comCoupFS=false
                            FSTrains('up','SS05')
                        } else if(data.state===true){
                            pccApi.SS[1].comCoupFS=true
                            FSTrains('down','SS05')
                        }
                        break;
                }
                apiSave()
                break;
            case 204 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if (data.execute==='OPENPV-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.doorsOpenedPV=true
                    trainObj.states.doorsClosedPV=false
                    trainObj.states.cmdOuvPortesTrain=true
                    if(trainObj.states.inZOPP) {
                        let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                        if(typeof stationObj.states === 'undefined') return apiSave();
                        stationObj.states.engagedPMS=false
                        stationObj.states.doorsOpened=true
                        stationObj.states.doorsClosed=false
                        stationObj.states.doorsClosedPAS=false
                        stationObj.states.doorsOpenedPAS=true
                        stationObj.states.defPartFerPP=false
                        stationObj.states.doorsObstacle=false
                    }
                    apiSave()
                } else
                if (data.execute==='CLOSEPV-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.doorsOpenedPV=false
                    trainObj.states.cmdOuvPortesTrain=false

                    if(trainObj.states.inZOPP) {

                        let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                        if(typeof stationObj.states === 'undefined') return apiSave();
                        stationObj.states.engagedPMS=false
                        stationObj.states.doorsOpened=false
                        stationObj.states.doorsClosedPAS=true
                        stationObj.states.doorsOpenedPAS=false
                        if(stationObj.states.activeObs){
                            stationObj.states.doorsObstacle=2
                            stationObj.states.defPartFerPP=2
                        } else {
                            stationObj.states.doorsClosed=true
                            stationObj.states.defPartFerPP=false
                        }
                    }
                    if(trainObj.states.obstalceActive){
                        trainObj.states.defCdeFerPV=2
                    } else {
                        trainObj.states.doorsClosedPV=true
                        trainObj.states.defCdeFerPV=false
                    }
                    apiSave()
                } else
                if (data.execute==='CLOSEPP-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    console.log(stationIndex, sectionIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.manualExpKeyEng) return;
                    stationObj.states.manuelPPOpening=false
                    stationObj.states.manuelPPClosing=2
                    stationObj.states.engagedPMS=2
                    stationObj.states.doorsOpened=false
                    stationObj.states.doorsOpenedPAS=false
                    stationObj.states.doorsClosedPAS=false
                    stationObj.states.doorsOpenedWithoutTrain=false
                    if(stationObj.states.activeObs){
                        stationObj.states.doorsObstacle=2
                        stationObj.states.defPartFerPP=2
                    } else {
                        stationObj.states.doorsClosed=true
                        stationObj.states.defPartFerPP=false
                    }
                    let trainObj=stationObj.trains[0]
                    if(trainObj.states.obstalceActive){
                        trainObj.states.defCdeFerPV=2
                    } else {
                        trainObj.states.doorsClosedPV=true
                        trainObj.states.defCdeFerPV=false
                    }
                    apiSave()
                } else
                if (data.execute==='OPENPP-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.manualExpKeyEng) return;
                    stationObj.states.engagedPMS=2
                    stationObj.states.manuelPPOpening=2
                    stationObj.states.manuelPPClosing=false
                    stationObj.states.doorsClosed=false
                    stationObj.states.doorsOpened=true
                    stationObj.states.doorsOpenedPAS=false
                    stationObj.states.doorsClosedPAS=false
                    stationObj.states.defPartFerPP=false
                    stationObj.states.doorsObstacle=false
                    console.log(stationObj.trains)
                    if(!(stationObj.trains[0])){
                        stationObj.states.doorsOpenedWithoutTrain=2
                        apiSave()
                        return;
                    }
                    if(!stationObj.trains[0].states.inZOPP){
                        stationObj.states.doorsOpenedWithoutTrain=2
                        apiSave()
                        return;
                    }
                    apiSave()
                } else
                if(data.execute==='GENRATEINC-PARTIALPPOPEN-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defPartOuvPP=2
                    apiSave()
                } else
                if(data.execute==='GENRATEINC-PARTIALPPCLOSE-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defPartFerPP=2
                    apiSave()
                } else
                if(data.execute==='GENRATEINC-TOTALPPOPEN-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defTotOuvPP=2
                    apiSave()
                } else
                if(data.execute==='GENRATEINC-TOTALPPCLOSE-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defTotFerPP=2
                    apiSave()
                } else
                if(data.execute==='GENRATEINC-RESET-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defPartOuvPP=false
                    stationObj.states.defPartFerPP=false
                    stationObj.states.defTotOuvPP=false
                    stationObj.states.defTotFerPP=false
                    apiSave()
                } else
                if(data.execute==='AQC-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    for(let alarm in stationObj.states){
                        if(!(stationObj.states[alarm]===2)) continue;
                        stationObj.states[alarm]=1
                    }
                    let trainObj = stationObj.trains[0]
                    if(trainObj){
                        for(let alarm in trainObj.states){
                            if(!(trainObj.states[alarm]===2)) continue;
                            trainObj.states[alarm]=1
                        }
                    }
                    apiSave()
                } else
                if (data.execute==='ZOPP-ON-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    if(stationObj.hasOwnProperty('type')){
                        stationObj.states.doorsOpenedWithoutTrain=false
                    }
                    trainObj.states.inZOPP=true
                    trainObj.states.lvsTrain=true
                    apiSave()
                } else
                if (data.execute==='ZOPP-OFF-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    if(stationObj.hasOwnProperty('type')){
                        if(stationObj.states.doorsOpened){
                            stationObj.states.doorsOpenedWithoutTrain=2
                        }
                    }
                    trainObj.states.inZOPP=false
                    trainObj.states.lvsTrain=true
                    apiSave()
                } else
                if (data.execute==='OBS-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.activeObs=true
                    apiSave()
                } else
                if (data.execute==='OBS-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.activeObs=false
                    stationObj.states.doorsObstacle=false
                    apiSave()
                } else
                if (data.execute==='PMSUNLOCK-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.unlockedPMS=2
                    apiSave()
                } else
                if (data.execute==='PMSUNLOCK-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.unlockedPMS=false
                    apiSave()
                } else
                if (data.execute==='PMSMANUAL-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.unlockedPMS) return;

                    stationObj.states.manualExpKeyEng=2
                    apiSave()
                } else
                if (data.execute==='PMSMANUAL-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.manualExpKeyEng=false
                    stationObj.states.engagedPMS=false
                    stationObj.states.manuelPPOpening=false
                    stationObj.states.manuelPPClosing=false
                    apiSave()
                } else
                if (data.execute==='PMSMAINT-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.unlockedPMS) return;

                    stationObj.states.maintKeyEng=2
                    apiSave()
                } else
                if (data.execute==='PMSMAINT-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.maintKeyEng=false
                    apiSave()
                } else
                if (data.execute==='SAFE-ON-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    
                    trainObj.states.trainSecurised=true
                    trainObj.states.trainInscrit=true
                    apiSave()
                } else
                if (data.execute==='SAFE-OFF-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    
                    trainObj.states.trainSecurised=false
                    trainObj.states.trainInscrit=false
                    apiSave()
                } else
                if (data.execute==='HLP-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.HLP=true
                    apiSave()
                } else
                if (data.execute==='HLP-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.HLP=false
                    apiSave()
                } else
                if (data.execute==='DSO-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.DSO=true
                    apiSave()
                } else
                if (data.execute==='DSO-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.DSO=false
                    apiSave()
                } else
                if (data.execute==='INHIBPLTPIDPO-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.DSO=false
                    apiSave()
                    const weweOnControleSale = async() => {
                        await setTimeout(5000)
                        if(stationObj.states.IDPOAlreadyActiveByPLTP===false) {console.log('Ah merde ah c\'est con ça')
                        return;}
                        stationObj.states.DSO=true
                        apiSave()
                    }
                    weweOnControleSale()
                } else
                if (data.execute==='INHIBALCIDPO-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.DSO=false
                    apiSave()
                    const weweOnControleSale = async() => {
                        await setTimeout(5000)
                        if(stationObj.states.IDPOAlreadyActiveByALC===false) {console.log('Ah merde ah c\'est con ça')
                        return;}
                        stationObj.states.DSO=true
                        apiSave()
                    }
                    weweOnControleSale()
                } else
                if (data.execute==='OBSVEH-ON-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.obstalceActive=true
                    apiSave()
                } else
                if (data.execute==='OBSVEH-OFF-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.obstalceActive=false
                    apiSave()
                } else
                if (data.execute==='SETTIME-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    let newTime = parseInt(data.new)

                    stationObj.states.actualTime=newTime
                    apiSave()
                } else
                if (data.execute==='EMCALL-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.trainEmCall=2
                    trainObj.states.forbiddenStart=2
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    if(stationObj.hasOwnProperty('type')){
                        stationObj.states.DSO=true
                        stationObj.states.IDPOAlreadyActiveByALC=true
                    }
                    apiSave()
                } else
                if (data.execute==='ACQEMCALL-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.trainEmCall=false
                    trainObj.states.forbiddenStart=false
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    stationObj.states.IDPOAlreadyActiveByALC=false
                    apiSave()
                } else
                if (data.execute==='AFD-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.afdActive=true
                    apiSave()
                } else
                if (data.execute==='AFD-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.afdActive=false
                    apiSave()
                } else
                if (data.execute==='VVTS1-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS1=true
                    apiSave()
                } else
                if (data.execute==='VVTS1-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS1=false
                    apiSave()
                } else
                if (data.execute==='VVTS2-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS2=true
                    apiSave()
                } else
                if (data.execute==='VVTS2-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS2=false
                    apiSave()
                } else
                if (data.execute==='DEPA-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.depaActive=true
                    apiSave()
                } else
                if (data.execute==='DEPA-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.depaActive=false
                    apiSave()
                } else
                if (data.execute==='IDPF-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.idpfActive=true
                    apiSave()
                } else
                if (data.execute==='IDPF-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.idpfActive=false
                    apiSave()
                } else
                if (data.execute==='MAPF-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.mapfActive=true
                    apiSave()
                } else
                if (data.execute==='MAPF-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.mapfActive=false
                    apiSave()
                } else
                if (data.execute==='ISTA-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.istaActive=true
                    apiSave()
                } else
                if (data.execute==='ISTA-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.istaActive=false
                    apiSave()
                } else
                if (data.execute==='VVTS1-INHIB-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.defOrderExec=2
                    const weweOnAttendLaFinDeLhinib = async() => {
                        await setTimeout(4000)
                        stationObj.states.defOrderExec=false
                        apiSave()
                    }
                    weweOnAttendLaFinDeLhinib()
                    apiSave()
                } else
                if (data.execute==='VVTS2-INHIB-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.defOrderExec=2
                    const weweOnAttendLaFinDeLhinib = async() => {
                        await setTimeout(4000)
                        stationObj.states.defOrderExec=false
                        apiSave()
                    }
                    weweOnAttendLaFinDeLhinib()
                    apiSave()
                } else                                       //TRAIN
                if(data.execute==='AQC-BTN-TRAIN'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    for(let alarm in trainObj.states){
                        if(!(trainObj.states[alarm]===2)) continue;
                        if(alarm==='cptFu') continue;
                        trainObj.states[alarm]=1
                    }
                    apiSave()
                } else
                if(data.execute==='FU-BTN-ON'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    trainObj.states.fuNoFS=2
                    trainObj.states.cmdFu=2
                    trainObj.states.cptFu++
                    trainObj.states.activeFU=true
                    if(trainObj.states.cptFu>2){
                        trainObj.states.defTech=2
                        trainObj.states.v0pas=2
                        trainObj.states.blockedTrain=2
                    }
                    apiSave()
                } else
                if(data.execute==='FU-BTN-OFF'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    trainObj.states.fuNoFS=false
                    trainObj.states.cmdFu=false
                    trainObj.states.activeFU=false
                    apiSave()
                } else
                if(data.execute==='CPTFU-BTN-ACQ'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    trainObj.states.cptFu=0
                    trainObj.states.defTech=false
                    trainObj.states.v0pas=false
                    trainObj.states.blockedTrain=false
                    apiSave()
                } else
                if(data.execute==='PREP-BTN'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    const goFaireDuRPInutile = async() => {
                        trainObj.states.TMSActive=true
                        trainObj.states.defLtpa=2
                        apiSave()
                        await setTimeout(2040)
                        trainObj.states.defTech=2
                        trainObj.states.defFN=2
                        trainObj.states.permBrake=true
                        trainObj.states.defLectBal=2
                        trainObj.states.activeFU=true
                        trainObj.states.cmdFu=2
                        trainObj.states.cptFu++
                        apiSave()
                        await setTimeout(1510)
                        trainObj.states.trainFrott=2
                        trainObj.states.defCvs=2
                        trainObj.states.trainBattery=2
                        trainObj.states.abs750=2
                        apiSave()
                        await setTimeout(2120)
                        trainObj.states.defDistBt=2
                        trainObj.states.btDelest=2
                        trainObj.states.avarieOnduls=2
                        apiSave()
                        await setTimeout(4015)
                        trainObj.states.awakeMR=true
                        trainObj.states.speed=0
                        trainObj.states.defLtpa=false
                        trainObj.states.defLectBal=false
                        trainObj.states.trainPilot=true
                        trainObj.states.v0pas=2
                        trainObj.states.trainFrott=true
                        apiSave()
                        await setTimeout(4015)
                        if(pccApi.voyHT===true){
                            trainObj.states.abs750=false
                            trainObj.states.trainBattery=false
                            trainObj.states.btDelest=false
                            trainObj.states.activeOnduls=true
                        }
                        trainObj.states.activeTests=true
                        trainObj.states.defDistBt=false
                        trainObj.states.defCvs=false
                        apiSave()
                        await setTimeout(1034)
                        trainObj.states.testAuto=2
                        trainObj.states.activeFI=true
                        trainObj.states.forbCommand=2
                        apiSave()
                        await setTimeout(10120)
                        trainObj.states.avarieOnduls=false
                        apiSave()
                        await setTimeout(4030)
                        trainObj.states.validTests=true
                        trainObj.states.activeTests=false
                        if(pccApi.voyHT===true){
                            trainObj.states.defTech=false
                        }
                        apiSave()
                        await setTimeout(4080)
                        if(pccApi.voyHT===true){
                            trainObj.states.trainLights=true
                            trainObj.states.trainHeating=true
                            trainObj.states.trainComp=true
                        }
                        trainObj.states.fsOk=2
                        trainObj.states.fuNoFS=2
                        trainObj.states.IOP=true
                        trainObj.states.blockedTrain=true
                        trainObj.states.vitModifPAS=true
                        trainObj.states.cptFu++
                        apiSave()
                        await setTimeout(10028)
                        trainObj.states.nullSpeed=true
                        trainObj.states.defFN=false
                        trainObj.states.testAuto=false
                        trainObj.states.waitingMission=true
                        trainObj.states.permBrake=false
                        trainObj.states.cmdTraction=true
                        apiSave()
                        await setTimeout(10021)
                        trainObj.states.pretTrain=true
                        trainObj.states.autoTrain=true
                        trainObj.states.forbCommand=false
                        trainObj.states.vitModifPAS=false
                        apiSave()
                        await setTimeout(400)
                        if(pccApi.voyFS===true){
                            trainObj.states.cmdFu=false
                            trainObj.states.fuNoFS=false
                            trainObj.states.fsOk=true
                        }
                    }
                    const refusPrep = async() => {
                        trainObj.states.echecPrep=2
                        apiSave()
                        await setTimeout(10000)
                        trainObj.states.echecPrep=false
                        apiSave()
                    }
                    if(trainObj.states.pretTrain){
                        refusPrep()
                    } else {
                        goFaireDuRPInutile()
                    }
                    apiSave()
                } else
                if(data.execute==='DEPREP-BTN'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    const goFaireDuRPInutile = async() => {
                        for(let alarm in trainObj.states){
                            if(alarm==='cptFu') continue;
                            trainObj.states[alarm]=false
                        }
                        trainObj.states.speed=0
                        trainObj.states.TMSActive=true
                        trainObj.states.pretTrain=true
                        trainObj.states.trainLights=true
                        trainObj.states.trainHeating=true
                        trainObj.states.trainComp=true
                        trainObj.states.trainFrott=true
                        trainObj.states.autoTrain=true
                        trainObj.states.trainPilot=true
                        trainObj.states.activeOnduls=true
                        trainObj.states.fsOk=2
                        trainObj.states.awakeMR=true

                        trainObj.states.fuNoFS=2
                        trainObj.states.cmdFu=2
                        trainObj.states.blockedTrain=true
                        trainObj.states.v0pas=2
                        trainObj.states.activeFU=true
                        trainObj.states.canceledMission=true
                        trainObj.states.IOP=true
                        trainObj.states.validTests=false
                        trainObj.states.deprepTrain=true
                        trainObj.states.cptFu++
                        apiSave()
                        await setTimeout(2000)
                        trainObj.states.autoTrain=false
                        trainObj.states.trainPilot=false
                        trainObj.states.defFN=2
                        trainObj.states.permBrake=true
                        apiSave()
                        await setTimeout(1500)
                        trainObj.states.trainLights=false
                        trainObj.states.trainHeating=false
                        trainObj.states.trainComp=false
                        trainObj.states.trainFrott=false
                        apiSave()
                        await setTimeout(1000)
                        trainObj.states.abs750=2
                        trainObj.states.activeOnduls=false
                        trainObj.states.avarieOnduls=2
                        apiSave()
                        await setTimeout(1000)
                        trainObj.states.pretTrain=false
                        trainObj.states.activeFI=true
                        trainObj.states.cptFu=0
                        trainObj.states.avarieOnduls=false
                        apiSave()
                        await setTimeout(5000)
                        for(let alarm in trainObj.states){
                            if(alarm==='cptFu') continue;
                            trainObj.states[alarm]=false
                        }
                        apiSave()
                    }
                    const refusDeprep = async() => {
                        trainObj.states.refusDeprep=2
                        apiSave()
                        await setTimeout(10000)
                        trainObj.states.refusDeprep=false
                        apiSave()
                    }
                    if(trainObj.states.pretTrain){
                        goFaireDuRPInutile()
                    } else {
                        refusDeprep()
                    }
                }

                break;
            case 400:
                if(!isClientExisting(data.uuid)) return;
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

                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)

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

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 1)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                console.log(trainCopy)

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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
                                
                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                console.log(trainCopy)
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 1)
                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {   //check si y'a un iti               //!                   OCCURENCE       ////////////////////////////
                            console.log("[S1? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            //? ITIS D'AIGUILLES
                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 1, wss)) return;
                            //pas d'iti, on traite l'aiguille comme un canton normal
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                logger.error('Pas de canton +1!')
                                console.log('[S1? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 1)
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 1)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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
                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 1, wss)) return;

                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? V2 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                //!                   OCCURENCE       ////////////////////////////

                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                    logger.error('Pas de canton -1!')
                                    console.log('[S1? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)
    
                                    let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)
    
                                    let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                    if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                        trainCopy.states.inZOPP=false
                                    }
                                    pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                    console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                }

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                            } else {
                                console.log('[S1? V2 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }
                    } else if (pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("cG")) {
                        logger.info('[WS] Canton évalué hors ligne')
                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie GAT canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S1? V2] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                logger.error('Pas de canton +1!')
                                console.log('[S1? VG SIM -> ELSE] Pas de continuité, passage à la section GAT')
                                logger.error('Abandon iti (pas de section GAT)')

                                /*let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 'GAT')

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()*/
                                return;
                            }
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? VG SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S1? VG SIM -> ELSE] Pas de continuité, passage à la section GAT')
                                logger.error('Abandon iti (pas de section GAT)')

                                /*let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()*/
                                return;
                            }
                        } else {
                            console.log("[S1? VG] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 'GAT', wss)) return;

                            if((/*pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && */pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S1? VG AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)


                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                    logger.error('Pas de canton +1!')
                                    console.log('[S1? VG SIM -> ELSE] Pas de continuité, passage à la section GAT')
    
                                    /*let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)
    
                                    pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                        tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                        name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                    } )
                                    console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()*/
                                    return;
                                }

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                            } else {
                                console.log('[S1? VG AIG -> ELSE] Pas de continuité, passage à la section GAT')

                                /*let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 1, 2)

                                pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains.push( {
                                    tid: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid,
                                    name: pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].name
                                } )
                                console.log(pccApi.SEC[_secIndex+1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()*/
                                return;
                            }
                        }
                    }
//! todo crash hors zopp ouverture porte (a fix pour sens 2)
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

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 1)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V1 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 1)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {   //check si y'a un iti                            //!                   OCCURENCE       ////////////////////////////
                            console.log("[S2? V1] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')
                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 2, wss)) return;
                            //pas d'iti, on traite l'aiguille comme un canton normal
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                logger.error('Pas de canton -1!')
                                console.log('[S2? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 1)
                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V1 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 1)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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
                                if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==='c2501') return logger.error('LIMITE DE LIGNE, AUCUNE ACTION!');
                                console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 2)
                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }

                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex+1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 2)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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

                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 2, wss)) return;
                            
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? V2 AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex+1].cid)
                                
                                //!                   OCCURENCE       ////////////////////////////

                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex+1])) {
                                    logger.error('Pas de canton +1!')
                                    console.log('[S2? V2 SIM -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)
    
                                    let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 2)
                                    let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                    if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                        trainCopy.states.inZOPP=false
                                    }
    
                                    pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                    console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                }

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex+1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex+1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? V2 AIG -> ELSE] Pas de continuité, passage à la section '+pccApi.SEC[_secIndex-1].id)

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 2)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        }



                    }else if (pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.startsWith("cG")){




                        console.log("Train "+pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex].tid+" voie GAT canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid)
                        if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].position==='undefined'){
                            console.log("[S2? VG] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' simple')
                            if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                logger.error('Pas de canton -1!')
                                console.log('[S2? VG SIM -> ELSE] Pas de continuité, passage à la section LIGNE')

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 'GAT')

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                            if((/*pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) &&*/pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? VG SIM -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? VG SIM -> ELSE] Pas de continuité, passage à la section LIGNE')

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 'GAT')

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            }
                        } else {
                            console.log("[S2? VG] Canton "+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' aiguille')

                            if(ogia.findCompatibleItis(_secIndex, _cantonIndex, _trainIndex, 'GAT', wss)) return;
                            
                            if((pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.endsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(-2)) && pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid.startsWith(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid.slice(0,2)))){
                                console.log('[S2? VG AIG -> CONTINUE] Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[_cantonIndex-1].cid)
                                
                                //!                   OCCURENCE       ////////////////////////////

                                if(!(pccApi.SEC[_secIndex].cantons[_cantonIndex-1])) {
                                    logger.error('Pas de canton -1!')
                                    console.log('[S2? VG SIM -> ELSE] Pas de continuité, passage à la section LIGNE')
    
                                    let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 'GAT')
                                    let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
    
                                    pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
                                    console.log(pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains[_trainIndex])
                                    pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
                                    if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                        logger.confirm('Mouvement effectué avec succès')
                                    }
                                    apiSave()
                                    return;
                                }

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex].cantons[_cantonIndex-1].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains.push( trainCopy )
                                console.log(pccApi.SEC[_secIndex].cantons[_cantonIndex-1].trains[_trainIndex])
                                pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();

                                if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                                    logger.confirm('Mouvement effectué avec succès')
                                }
                                apiSave()
                                return;
                            } else {
                                console.log('[S2? VG AIG -> ELSE] Pas de continuité, passage à la section LIGNE')

                                let _NEXTCINDEX = ogia.nextSectionIndex(_secIndex, _cantonIndex, 2, 'GAT')

                                let trainCopy={...pccApi.SEC[_secIndex].cantons[_NEXTCINDEX].trains[_trainIndex]}
                                if(!pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].hasOwnProperty('type')){
                                    trainCopy.states.inZOPP=false
                                }
                                pccApi.SEC[_secIndex-1].cantons[_NEXTCINDEX].trains.push( trainCopy )
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
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
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
                for (let _SECTION in pccApi.SEC){
                    for (let _CANTON_ of pccApi.SEC[_SECTION].cantons){
                        if(_CANTON_.hasOwnProperty('position')){
                            let index = pccApi.SEC[_SECTION].cantons.findIndex(obj => {
                                return obj.cid===_CANTON_.cid
                            })
                            aiguilles.push({c:_CANTON_, index:index})
                        }
                    }
                }

                //console.log(aiguilles)

                if(cmd==="SET"){                        
                    if(cmdargs.length<2||cmdargs.length>2)   return;
                    if(cmdargs[0]==='1201' && cmdargs[1]==='2201'){
                        console.log('ITI A2 C1 SENS 1 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='up';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='up';

                    } else
                    if(cmdargs[0]==='2201' && cmdargs[1]==='1201'){
                        console.log('ITI A2 C1 SENS 2 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='down';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a2';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='down';

                    } else
                    if(cmdargs[0]==='2401' && cmdargs[1]==='1401'){
                        console.log('ITI A1 C1 SENS 1 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='down';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='down';

                    } else
                    if(cmdargs[0]==='1401' && cmdargs[1]==='2401'){
                        console.log('ITI A1 C1 SENS 2 TRIGGER')

                        pccApi.SEC[0].cantons[aiguilles[0].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='up';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='a1';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='up';

                    } else
                    if(cmdargs[0]==='C1' && cmdargs[1]==='R'){ //commande de reset
                        console.log('ITI C1 RESET')
                        pccApi.SEC[0].cantons[aiguilles[0].index].position='r';
                        pccApi.SEC[0].cantons[aiguilles[0].index].dir='r';
                        pccApi.SEC[0].cantons[aiguilles[1].index].position='r';
                        pccApi.SEC[0].cantons[aiguilles[1].index].dir='r';
                    } else                                                            //SECTION 2
                    if(cmdargs[0]==='1202' && cmdargs[1]==='2101'){
                        console.log('ITI A1 C2 SENS 2 TRIGGER')

                        pccApi.SEC[1].cantons[aiguilles[2].index].position='a1';
                        pccApi.SEC[1].cantons[aiguilles[2].index].dir='up';
                        pccApi.SEC[1].cantons[aiguilles[4].index].position='a1';
                        pccApi.SEC[1].cantons[aiguilles[4].index].dir='up';

                    } else
                    if(cmdargs[0]==='2101' && cmdargs[1]==='1202'){
                        console.log('ITI A1 C2 SENS 1 TRIGGER')

                        pccApi.SEC[1].cantons[aiguilles[2].index].position='a1';
                        pccApi.SEC[1].cantons[aiguilles[2].index].dir='down';
                        pccApi.SEC[1].cantons[aiguilles[4].index].position='a1';
                        pccApi.SEC[1].cantons[aiguilles[4].index].dir='down';

                    } else
                    if(cmdargs[0]==='1102' && cmdargs[1]==='PAG1'){
                        console.log('ITI A2 C2B SENS 1 TRIGGER')

                        pccApi.SEC[1].cantons[aiguilles[3].index].position='a2';          //petite note: se réferer au console.log de aiguille[]
                        pccApi.SEC[1].cantons[aiguilles[3].index].dir='down';
                        pccApi.SEC[1].cantons[aiguilles[5].index].position='a2';
                        pccApi.SEC[1].cantons[aiguilles[5].index].dir='down';

                    } else
                    if(cmdargs[0]==='PAG1' && cmdargs[1]==='1102'){
                        console.log('ITI A2 C2B SENS 2 TRIGGER')

                        pccApi.SEC[1].cantons[aiguilles[3].index].position='a2';
                        pccApi.SEC[1].cantons[aiguilles[3].index].dir='up';
                        pccApi.SEC[1].cantons[aiguilles[5].index].position='a2';
                        pccApi.SEC[1].cantons[aiguilles[5].index].dir='up';

                    } else
                    if(cmdargs[0]==='C2' && cmdargs[1]==='R'){ //commande de reset
                        console.log('ITI C2 RESET')
                        pccApi.SEC[1].cantons[aiguilles[2].index].position='r';
                        pccApi.SEC[1].cantons[aiguilles[2].index].dir='r';
                        pccApi.SEC[1].cantons[aiguilles[4].index].position='r';
                        pccApi.SEC[1].cantons[aiguilles[4].index].dir='r';
                    } else
                    if(cmdargs[0]==='C2B' && cmdargs[1]==='R'){ //commande de reset
                        console.log('ITI C2B RESET')
                        pccApi.SEC[1].cantons[aiguilles[3].index].position='r';
                        pccApi.SEC[1].cantons[aiguilles[3].index].dir='r';
                        pccApi.SEC[1].cantons[aiguilles[5].index].position='r';
                        pccApi.SEC[1].cantons[aiguilles[5].index].dir='r';
                    }
                    apiSave()
                }
                break;
            case 600:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                for (let event of pccApi.events){
                    if(!(event.id===data.inc)) continue;
                    event.state='Résolution'
                    event.showState=2
                    let currentDate = new Date();
                    let currentHour = currentDate.getHours();
                    let currentMinute = currentDate.getMinutes();
                    let currentDay = currentDate.getDate();
                    let currentMonth = currentDate.getUTCMonth()+1
                    let currentYear = currentDate.getFullYear();
                    event.date=event.date+' - '+currentDay+'/'+currentMonth+'/'+currentYear+', '+currentHour+'h'+currentMinute;
                    apiSave()
                    gsa.cancelIncident(event, wss, event.id)
                }
                break;
            case 601:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                let prefix = data.pressedButton.slice(0,1)
                let command = data.pressedButton.substr(1)
                let user = clients[data.uuid]
                gsa.applyIncident(prefix,command,user,wss)
                break;
        }
    })
    ws.on("close", ()=>{

        if(clients[ws.id]){
            wss.broadcast(JSON.stringify({
                op: 11,
                name: ws.usr.username
            }))
            delete clients[ws.id];
            logger.client(false,ws,Object.keys(clients).length);
            apiSave()
        }
    });
})

/**
 * Cherche sur quel canton se trouve le train passé en paramètre
 * @param id l'ID du train
 */
/*function verifyExistingTrain(id){
    console.log('ON CHERCHE LE N° ' + id)
    let tidArray = []
    let trains = JSON.parse(getCantonsInfo()) //ça foire ici
    console.log(trains.trains)
    for (let train in trains.trains) {
        let _TID_ = trains.trains[train].trainId; //en gros on récupère l'id de chaque train existant
        console.log(_TID_)
        idArray.push(JSON.parse(_TID_))
    }
}*/

function getCantonsInfo(id){
    let fresponse={ trains: [] }
    for (let _SEC_ in pccApi.SEC){
        for (let _CANTON_ in pccApi.SEC[_SEC_].cantons){
            _CANTON_ = parseInt(_CANTON_);
            _SEC_ = parseInt(_SEC_);
                //console.log('[❔] ARRAY['+_CANTON_+'], SECTION['+_SEC_+']')
                //console.log(data.SEC[0].cantons[0].trains[0]) EXEMPLE DE CHEMIN
                if(pccApi.SEC[_SEC_].cantons[_CANTON_].trains.length >= 1){
                    //console.log('[👉] canton '+(_CANTON_+1)+'section '+(_SEC_+1)+' occupé')
                
                    for(let _TRAIN_ in pccApi.SEC[_SEC_].cantons[_CANTON_].trains){
                        //console.log(pccApi.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_]);
                        let tid = pccApi.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_].tid;
                        //canton_train.set(_TRAIN_, _CANTON_)
                        //console.log('_TRAIN_ '+_TRAIN_+" _CANTON_ "+_CANTON_)
    
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
        //console.log(fresponse.trains)
        for(let rame of fresponse.trains){
            if(rame.trainId == id) return JSON.stringify(rame);
        }
        return false;
    } else return JSON.stringify(fresponse)
}


function getStationsInfo(id){
    let reponse={name: false, id: false, states: false, trains: []}
    for (let sec of data.SEC){
        for (let ctns of sec.cantons){
            if(!(ctns.hasOwnProperty('type'))) continue;
            if(!(ctns.name === id)) continue;
            console.log(ctns.type+' canton '+ctns.cid+' appelée '+ctns.name)
            reponse.id=ctns.cid;

            reponse.name=ctns.name;

            reponse.states=ctns.states
            for (let train of ctns.trains){
                console.log(train)
                reponse.trains.push(train)
            }
        }
    }
    return reponse;
}
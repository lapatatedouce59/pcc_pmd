console.log('\x1b[44m\x1b[37m┌ CHARGEMENT DES MODULES NODE\x1b[0m')
console.log('├ Loading log-update...')
const logUpdate = require('log-update')
process.stdout.moveCursor(0, -1)
process.stdout.clearLine(1)
logUpdate('├ Loading fs...')
const fs = require('fs')
logUpdate('├ Loading timers/promises...')
const {setTimeout} = require('timers/promises')
logUpdate('├ Loading node-fetch...')
//const fetch = require("node-fetch");
/*logUpdate('├ Loading cluster...')
const {Worker} = require('node:cluster');
logUpdate('├ Loading cluster...')
const {numCPUs} = require('node:os').availableParallelism()
logUpdate('├ Loading cluster...')
const {process} = require('node:process');*/
/*logUpdate('├ Loading worker_threads...')
const {Worker} = require('worker_threads')
logUpdate('├ Building worker_thread...')
const worker1 = new Worker('./periodic_cluster.js')*/
logUpdate('├ Loading https...')
const https = require('https')
logUpdate('├ Loading ws...')
const {WebSocket, WebSocketServer} = require('ws');
logUpdate('├ Loading uuid...')
const {v4} = require('uuid')
logUpdate('├ Loading discord.js...')
const { EmbedBuilder, WebhookClient } = require('discord.js');
logUpdate('├ Loading dotenv...')
const dotenv = require('dotenv');
dotenv.config();
logUpdate('\x1b[42m\x1b[37m├ CHARGÉ\x1b[0m')
console.log('\x1b[44m\x1b[37m├ CHARGEMENT DES MODULES PERSONELS\x1b[0m')
console.log('├ Loading logger...')
const logger = require('./logger')
logUpdate('├ Loading OGIA...')
const ogia = require('./OGIA')
logUpdate('├ Loading OGDC...')
const ogdc = require('./IGC')
logUpdate('├ Loading GSA...')
const gsa = require('./GSA')
logUpdate('├ Loading OVSE...')
const ovse = require('./OVSE')
logUpdate('├ Loading itineraires...')
const itineraire = require('./ICI')
logUpdate('├ Loading seq...')
const seq = require('./IGS')
logUpdate('├ Loading writter...')
const writter = require('./writter')
writter.clean()
logUpdate('├ Loading server.json...')
const pccApi=require('./server.json');
logUpdate('\x1b[42m\x1b[37m├ CHARGÉ\x1b[0m')
console.log('\x1b[44m\x1b[37m├ CHARGEMENT DU SERVEUR\x1b[0m')

console.log('├ Loading socket...')
const wss = new WebSocket.Server({ port: 8081 });
logUpdate('\x1b[42m\x1b[37m├ CHARGÉ\x1b[0m')
/*
console.log('├ Creating securised server...')
const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/amaury.pmdapp.fr/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/amaury.pmdapp.fr/privkey.pem')
})

logUpdate('├ Defining socket...')
const wss = new WebSocketServer({server});

logUpdate('├ Starting server listening...')
server.listen(8081)

logUpdate('├ Creating webhook...')
const webhookToken = process.env.DISCORD_TOKEN
const webhookClient = new WebhookClient({ url: webhookToken });

logUpdate('├ Sending message...')
wss.addListener('listening',()=>{
    const embed = new EmbedBuilder()
	    .setTitle('Status du PCC')
	    .setColor('#74C365')
        .setDescription('Le serveur général du PCC a démarré!');
    webhookClient.send({
	    content: '',
	    embeds: [embed],
    });
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
    logUpdate('\x1b[42m\x1b[37m├ CHARGÉ\x1b[0m')
    console.log('\x1b[44m\x1b[37m└ PRÉPARATION TERMINÉE!\x1b[0m')
})*/

console.log('\x1b[44m\x1b[37m└ PRÉPARATION TERMINÉE!\x1b[0m')
let startDate = 0
let endDate = 0
let paraDate = 0

let msr = false

let work = false

let com = require('./com')

const clients = {}

pccApi.players=[]

exports.apiSave = function(){
    ovse.periodicUpdateVoy()
    let fx = setInterval(()=>{
    if(ovse.fUCA===true){
        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
        clearInterval(fx)
        ovse.fUCA=false
        ovse.work=true
    }
    },10)
    
    let workerInter=setInterval(()=>{
        //(work)
        if(ovse.work===false) return;
        clearInterval(workerInter)

        /*if(ovse.coupFS===true && ovse.done===false){
            ovse.coupFS=false
            ovse.done=true
            FSTrains('down', 'all')
            writter.simple('Défaut signalé OVSE.','UCA', 'FS')
        }
        if(ovse.coupFS==='RETABLISSEMENT'){
            console.log('UP')
            ovse.coupFS=false
            FSTrains('up', 'all')
            writter.simple('Défaut résolu OVSE.','UCA', 'FS')
        }*/

        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));

        wss.broadcast(JSON.stringify({
            op: 300,
            content: pccApi
        }))
        logger.message('broadcast','NEW SERVER DATA => REFRESH')
        endDate=Date.now()
        if(msr===false){
            msr=true
            if((endDate-startDate)>5000){
                logger.metric('Operation took '+(endDate-startDate) +'ms')
            } else {
                logger.metric('Operation took '+(endDate-startDate) +'ms','alert')
            }
        
            paraDate=(endDate-startDate)
            startDate=Date.now()
        } else {
            if((endDate-startDate)>5000){
                logger.metric('Next operation took '+(endDate-startDate) +'ms')
            } else {
                logger.metric('Next operation took '+(endDate-startDate) +'ms','alert')
            }
            startDate=Date.now()
        }
    },10)
    
    
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
let ss04CELIST = ['101','201','301','401','501']
let ss05CLIST = ['c1102','c1202','c1302','c1402','c2102','c2202','c2302','c2402']
let ss05CELIST = ['102','202','302','402']
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
                exports.apiSave()
                await setTimeout(3400)
                veh.states.avarieOnduls=2
                veh.states.defTech=2
                veh.states.trainHeating=true
                veh.states.trainComp=true
                exports.apiSave()
                await setTimeout(2500)
                veh.states.defCvs=false
                veh.states.trainLights=true
                exports.apiSave()
                await setTimeout(120)
                veh.states.prodPert=true
                exports.apiSave()
                await setTimeout(4900)
                veh.states.avarieOnduls=false
                veh.states.activeOnduls=true
                veh.states.defTech=false
                exports.apiSave()
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
                pccApi.ss.ss04=false
                for(let ectns of Object.entries(pccApi.ectns)){
                    if(!(ss04CELIST.includes(ectns[0]))) continue;
                    pccApi.ectns[ectns[0]]=false
                }
                writter.simple('NON SS04.','LIGNE', 'HT',3)
                pccApi.PR[0].DJVSS04MSTO=false
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
                writter.simple('OUI SS04.','LIGNE', 'HT',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss04CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        let train = pccApi.trains[veh]
                        if(type === 'down'){
                            executeDwn(train)
                        }
                        if(type === 'up'){
                            if((pccApi.SS[0].comAutHT===false)&&(pccApi.SS[0].voyHTAut===true)&&(pccApi.SS[0].voyRU===true)&&(pccApi.comAG===false)&&(pccApi.comArmPR===true)&&(pccApi.comAuth===true)){
                                executeUp(train)
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
                pccApi.ss.ss05=false
                for(let ectns of Object.entries(pccApi.ectns)){
                    if(!(ss05CELIST.includes(ectns[0]))) continue;
                    pccApi.ectns[ectns[0]]=false
                }
                pccApi.PR[0].DJVSS05MSTO=false
                pccApi.PR[1].DJVSS05GLANER=false
                writter.simple('NON SS05.','LIGNE', 'HT',3)
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
                writter.simple('OUI SS05.','LIGNE', 'HT',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss05CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        let train = pccApi.trains[veh]
                        if(type === 'down'){
                            executeDwn(train)
                        }
                        if(type === 'up'){
                            if((pccApi.SS[1].comAutHT===false)&&(pccApi.SS[1].voyHTAut===true)&&(pccApi.SS[1].voyRU===true)&&(pccApi.comAG===false)&&(pccApi.comArmPR===true)&&(pccApi.comAuth===true)){
                                executeUp(train)
                            }
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
                pccApi.ss.ss04=false
                pccApi.ss.ss05=false
                for(let ectns of Object.entries(pccApi.ectns)){
                    pccApi.ectns[ectns[0]]=false
                }
                pccApi.PR[0].DJVSS04MSTO=false
                pccApi.PR[0].DJVSS05MSTO=false
                pccApi.PR[1].DJVSS05GLANER=false
                writter.simple('NON.','LIGNE', 'HT',3)
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
                writter.simple('OUI.','LIGNE', 'HT',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(ss04CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[0].comAutHT===false)&&(pccApi.SS[0].voyHTAut===true)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeDwn(train)
                                }
                            }
                            if(type === 'up'){
                                if((pccApi.SS[0].comAutHT===false)&&(pccApi.SS[0].voyHTAut===true)&&(pccApi.SS[0].voyRU===true)&&(pccApi.comAG===false)&&(pccApi.comArmPR===true)&&(pccApi.comAuth===true)){
                                    for(let veh of ctn.trains){
                                        let train = pccApi.trains[veh]
                                        executeUp(train)
                                    }
                                }
                            }
                        }
                    } else
                    if(ss05CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[1].comAutHT===false)&&(pccApi.SS[1].voyHTAut===true)&&(pccApi.SS[1].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeDwn(train)
                                }
                            }
                            if(type === 'up'){
                                if((pccApi.SS[1].comAutHT===false)&&(pccApi.SS[1].voyHTAut===true)&&(pccApi.SS[1].voyRU===true)&&(pccApi.comAG===false)&&(pccApi.comArmPR===true)&&(pccApi.comAuth===true)){
                                    for(let veh of ctn.trains){
                                        let train = pccApi.trains[veh]
                                        executeUp(train)
                                    }
                                }
                            }
                        }
                    } else continue;
                }
            }
        break;
    }
}

function FSTrains (type,zone){
    ovse.coupFS=false
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
                writter.simple('NON SS04.','LIGNE', 'FS',3)
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                    ss.voyFS=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
                writter.simple('OUI SS04.','LIGNE', 'FS',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss04CLIST.includes(ctn.cid))) continue;
                    if(type === 'down'){
                        for(let veh of ctn.trains){
                            let train = pccApi.trains[veh]
                            executeDwn(train)
                        }
                    }
                    if(type === 'up'){
                        for(let veh of ctn.trains){
                            let train = pccApi.trains[veh]
                            executeUp(train)
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
                writter.simple('NON SS05.','LIGNE', 'FS',3)
            } else if(type==='up') {
                if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                    ss.voyFS=true
                }
                if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                    ss.voyPA=true
                }
                writter.simple('OUI SS05.','LIGNE', 'FS',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(!(ss05CLIST.includes(ctn.cid))) continue;
                    for(let veh of ctn.trains){
                        if(type === 'down'){
                            let train = pccApi.trains[veh]
                            executeDwn(train)
                        }
                        if(type === 'up'){
                            let train = pccApi.trains[veh]
                            executeUp(train)
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
                writter.simple('NON.','LIGNE', 'FS',3)
            } else if(type==='up') {
                for(let ss of pccApi.SS){
                    if((pccApi.comAG===false)&&(pccApi.comFSLine===false)&&(pccApi.voyUCA===true)&&(ss.voyRU===true)&&(ss.comCoupFS===false)){
                        ss.voyFS=true
                    }
                    if((pccApi.comAG===false)&&(pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.comCoupFS===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(ss.voyHT===true)&&(ss.voyFS===true)&&(ss.voyRU===true)&&(ss.voyAlim===true)){
                        ss.voyPA=true
                    }
                }
                writter.simple('OUI.','LIGNE', 'FS',2)
            }
            for(let sec of pccApi.SEC){
                for(let ctn of sec.cantons){
                    if(ss04CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[0].comCoupFS===false)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeDwn(train)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeUp(train)
                                }
                            }
                        }
                    } else
                    if(ss05CLIST.includes(ctn.cid)){
                        if(/*(pccApi.SS[1].comCoupFS===false)&&(pccApi.SS[0].voyRU===true)*/true){
                            if(type === 'down'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeDwn(train)
                                }
                            }
                            if(type === 'up'){
                                for(let veh of ctn.trains){
                                    let train = pccApi.trains[veh]
                                    executeUp(train)
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
        startDate = Date.now()
        msr=false
        let data = false;
        let op = 0;
        
        try{
            data = JSON.parse(msg);
            if(!(data.op)) return;
            op = data.op;
        } catch (error) {
            logger.error(error)
        }
        

        if(op==='300') return;
        ovse.work=false
        
        /*worker1.postMessage("MAJ");
        ('sent to worker')
        worker1.on('message', ()=>{
            work=true
        })*/
        switch(op){
            case 1 :
                if(!((data.token)||(data.from))) return;
                const verificationProcess = async() => {
                    let whitelist = ['383637400099880964','870004831744577677','620275174645956614','280638077008084992','348127629343195147','775325583626338316','747513013627519047','291632492622905354','1050875493458645013','269584519906983947','1040715219804098701','935952757716820009']
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
                                        ws.service=false

                                        ws.send(JSON.stringify({ op: 2, uuid: ws.id, content: pccApi, uname:ws.usr.username, role:ws.role, dInf: ws.usr}))
                                        clients[ws.id]=ws
                                        let firstUUID = newUUID.slice(0,10)
                                        pccApi.players.push({ uuid: `${firstUUID}...`, name: usr.username, role: ws.role })
                                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                        
                                        logger.identify(ws,Object.keys(clients).length)
                                        writter.simple(`+ Utilisateur ${ws.usr.username} (${ws.role})`,'GAME', 'USER')
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
            case 15:
                ws.loaded=data.time
                logger.confirm(ws.usr.username + ' loaded.')
                wss.broadcast(JSON.stringify({
                    op: 10,
                    joined: { role: ws.role, uname: ws.usr.username, dInf: ws.usr },
                    content: pccApi
                }))
                break;
            case 16:
                if(data.service===true){
                    ws.service=true
                    logger.info(ws.usr.username + ' now in service.')
                    wss.broadcast(JSON.stringify({
                        op: 17,
                        player: { uname: ws.usr.username },
                        content: pccApi
                    }))
                } else if(data.service===false){
                    ws.service=false
                    logger.info(ws.usr.username + ' left service.')
                    wss.broadcast(JSON.stringify({
                        op: 18,
                        player: { uname: ws.usr.username },
                        content: pccApi
                    }))
                }
                break;
            case 200 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                switch(data.execute){
                    case 'AG':
                        pccApi.comAG=true
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
                                                exports.apiSave()
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }*/
                        writter.simple('ACTIF.','PCC', 'CDP',3)
                        exports.apiSave();
                        break;
                    case 'AGreset':
                        writter.simple('INACTIF.','PCC', 'CDP',1)
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
                        let ss = pccApi.SS[0]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss04=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS04MSTO=true
                                }
                                ss = pccApi.SS[1]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss05=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS05MSTO=true
                                    pccApi.PR[1].DJVSS05GLANER=true
                                }
                        for (let sec of pccApi.SEC){
                            for(let ctn of sec.cantons){
                                for(let veh of ctn.trains){
                                    if(pccApi.trains[veh].states.awakeMR===true){
                                        let timeFunc = async () => {
                                            await setTimeout(100)
                                            if(pccApi.voyFS===true){
                                                pccApi.trains[veh].states.fsOk=true
                                                pccApi.trains[veh].states.fuNoFS=false
                                            }
                                            exports.apiSave()
                                            await setTimeout(600)
                                            if(pccApi.voyFS===true){
                                                pccApi.trains[veh].states.activeFI=false
                                                pccApi.trains[veh].states.activeFU=false
                                                pccApi.trains[veh].states.cmdFu=false
                                                pccApi.trains[veh].states.fuNoFS=false
                                            }
                                            exports.apiSave()
                                            await setTimeout(300)
                                            if(pccApi.voyFS===true){
                                                pccApi.trains[veh].states.cmdTraction=true
                                                pccApi.trains[veh].states.tractionS1=true
                                            }
                                            exports.apiSave()
                                            await setTimeout(5700)
                                            if(pccApi.voyHT===true){
                                                pccApi.trains[veh].states.abs750=false
                                                pccApi.trains[veh].states.btDelest=false
                                                pccApi.trains[veh].states.trainBattery=false
                                            }
                                            exports.apiSave()
                                            await setTimeout(3400)
                                            if(pccApi.voyFS===true){
                                                pccApi.trains[veh].states.activeFU=true
                                                pccApi.trains[veh].states.tractionS1=false
                                                pccApi.trains[veh].states.cmdTraction=false
                                                pccApi.trains[veh].states.cmdFu=2
                                                pccApi.trains[veh].states.fuDiscMob=2
                                            }
                                            if(pccApi.voyHT===true){
                                                pccApi.trains[veh].states.avarieOnduls=2
                                                pccApi.trains[veh].states.defTech=2
                                                pccApi.trains[veh].states.trainHeating=true
                                                pccApi.trains[veh].states.trainComp=true
                                            }
                                            exports.apiSave()
                                            await setTimeout(2500)
                                            if(pccApi.voyHT===true){
                                                pccApi.trains[veh].states.defCvs=false
                                                pccApi.trains[veh].states.trainLights=true
                                            }
                                            exports.apiSave()
                                            await setTimeout(120)
                                            pccApi.trains[veh].states.prodPert=true
                                            exports.apiSave()
                                            await setTimeout(4900)
                                            if(pccApi.voyHT===true){
                                                pccApi.trains[veh].states.avarieOnduls=false
                                                pccApi.trains[veh].states.activeOnduls=true
                                            }
                                            if(pccApi.voyFS===true){
                                                pccApi.trains[veh].states.activeFU=false
                                                pccApi.trains[veh].states.cmdFu=false
                                                pccApi.trains[veh].states.fuDiscMob=false
                                                pccApi.trains[veh].states.defTech=false
                                                pccApi.trains[veh].states.cmdTraction=true
                                            }
                                            exports.apiSave()
                                        }
                                        timeFunc()
                                    }
                                }
                            }
                        }
                        exports.apiSave();
                        break;
                    case 'LINE-ACQU':
                        writter.simple('REÇU.','PCC', 'ACQ')
                        ovse.uca.acquitAll()
                        if (pccApi.voyGAT===2) pccApi.voyGAT=1;
                        if (pccApi.voyABS===2) pccApi.voyABS=1;
                        if (pccApi.voyHT===2) pccApi.voyHT=1;
                        if (pccApi.voyFS===2) pccApi.voyFS=1;
                        if (pccApi.voyHTGAT===2) pccApi.voyHTGAT=1;
                        if (pccApi.voyFSGAT===2) pccApi.voyFSGAT=1;
                        if (pccApi.voyCC===2) pccApi.voyCC=1;
                        if (pccApi.voyALC===2) pccApi.voyALC=1;
                        for (let ss of pccApi.SS){
                            for(let prop of Object.keys(ss)){
                                if(ss[prop]===2) ss[prop]=1
                            }
                        }
                        exports.apiSave();
                        break;
                }
                break;
            case 202 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                switch(data.execute){
                    case 'FS-LINE-COM':
                        if(data.state===false){
                            writter.simple('OUI.','PCC', 'FS (LIGNE)')
                            pccApi.comFSLine=false
                            if(pccApi.comAG===false){
                                pccApi.voyFS=true
                                FSTrains('up','all')
                            }
                            exports.apiSave()

                        } else if(data.state===true){
                            pccApi.comFSLine=true
                            pccApi.voyFS=2
                            FSTrains('down','all')
                            writter.simple('NON.','PCC', 'FS (LIGNE)',3)
                            exports.apiSave()
                        }
                        if((pccApi.comAuth) && !(pccApi.comFSLine)){
                            pccApi.voyABS=true
                        } else {
                            pccApi.voyABS=2
                        }
                        break;
                    case 'FS-GAT-COM':
                        if(data.state===false){
                            writter.simple('OUI.','PCC', 'FS (GAT)')
                            pccApi.comFSGAT=false
                            if(pccApi.comAG===false){
                                pccApi.voyFSGAT=true
                            }
                        } else if(data.state===true){
                            pccApi.comFSGAT=true
                            pccApi.voyFSGAT=2
                            writter.simple('NON.','PCC', 'FS (GAT)',3)
                        }
                        if((pccApi.comAuthGAT) && !(pccApi.comFSGAT)){
                            pccApi.voyGAT=true
                        } else {
                            pccApi.voyGAT=2
                        }
                        break;
                    case 'HTAUT-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'HT (LIGNE)',3)
                            pccApi.comAuth=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHT=2
                                HTTrains('down','all')

                                exports.apiSave();
                            }
                        } else if(data.state===true){
                            pccApi.comAuth=true
                            writter.simple('OUI.','PCC', 'HT (LIGNE)')
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHT=true
                                HTTrains('up','all')
                                let ss = pccApi.SS[0]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss04=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss04CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS04MSTO=true
                                }
                                ss = pccApi.SS[1]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss05=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss05CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS05MSTO=true
                                    pccApi.PR[1].DJVSS05GLANER=true
                                }
                                exports.apiSave();
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
                            writter.simple('NON.','PCC', 'HT (GAT)',3)
                            pccApi.comAuthGAT=false
                            if(pccApi.comAG===false || pccApi.comForceHT===true){
                                pccApi.voyHTGAT=2
                            }
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'HT (GAT)')
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
                            writter.simple('NON.','PCC', 'FORCAGE HT')
                            pccApi.comForceHT=false
                            if(pccApi.comAG===true){
                                pccApi.voyHT=2
                                pccApi.voyHTGAT=2
                            }
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'FORCAGE HT',2)
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
                            writter.simple('NON.','PCC', 'IDPO',2)
                            pccApi.comIDPOTPAS=false
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.DSO=false
                                    ctns.states.IDPOAlreadyActiveByPLTP=false
                                    writter.simple('DSO NON.','EAS', `${stationObj.name}`)
                                }
                            }
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'IDPO',2)
                            pccApi.comIDPOTPAS=true
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.DSO=true
                                    ctns.states.IDPOAlreadyActiveByPLTP=true
                                    writter.simple('DSO OUI.','EAS', `${stationObj.name}`)
                                }
                            }
                        }
                        break;
                    case 'UCAINHIB-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'INHIBITION UCA',2)
                            pccApi.comInhibUCA=false
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'INHIBITION UCA',3)
                            pccApi.comInhibUCA=true
                        }
                        break;
                    case 'ARMPR-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'ARMEMENT PR',3)
                            pccApi.PR[0].DHTMSTO=false
                            pccApi.PR[1].DHTGLARNER=false
                            pccApi.comArmPR=false
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.alimDef=2
                                    ctns.states.IDPOAlreadyActiveByALC=true
                                    ctns.states.DSO=true
                                    writter.simple('OUI.','EAS', 'DEF ALIM',3)
                                    writter.simple('OUI.','EAS', 'DSO')
                                    writter.simple('OUI.','EAS', 'DSO PAR ALC')
                                    if(ctns.trains[0]){
                                        let trainObj=pccApi.trains[ctns.trains[0]]
                                        trainObj.states.forbiddenStart=2
                                        writter.simple('OUI.','TRAIN', 'DÉPART INTERDIT',3)
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
                            HTTrains('down','all')
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'ARMEMENT PR',2)
                            pccApi.comArmPR=true
                            pccApi.PR[0].DHTMSTO=true
                            pccApi.PR[1].DHTGLARNER=true
                            for (let sec of pccApi.SEC){
                                for (let ctns of sec.cantons){
                                    if(!(ctns.hasOwnProperty('type'))) continue;
                                    ctns.states.alimDef=false
                                    ctns.states.IDPOAlreadyActiveByALC=false
                                    if(ctns.trains[0]){
                                        let trainObj=pccApi.trains[ctns.trains[0]]
                                        trainObj.states.forbiddenStart=false
                                        writter.simple('NON.','TRAIN', 'DÉPART INTERDIT')
                                    }
                                    writter.simple('NON.','EAS', 'DEF ALIM')
                                    writter.simple('NON.','EAS', 'DSO PAR ALC')
                                }
                            }
                            let ss = pccApi.SS[0]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                    pccApi.ss.ss04=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss04CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS04MSTO=true
                                }
                                ss = pccApi.SS[1]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)){
                                    pccApi.ss.ss05=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss05CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS05MSTO=true
                                    pccApi.PR[1].DJVSS05GLANER=true
                                }
                            for (let ss of pccApi.SS){
                                ss.voyAlim=true
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
                            HTTrains('up','all')
                        }
                        break;
                    case 'AUTHTSS04-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'AUT HT (SS04)',3)
                            pccApi.SS[0].comAutHT=false
                            HTTrains('up','SS04')
                            let ss = pccApi.SS[0]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss04=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss04CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS04MSTO=true
                                }
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'AUT HT (SS04)',2)
                            pccApi.SS[0].comAutHT=true
                            HTTrains('down','SS04')
                        }
                        break;
                    case 'AUTHTSS05-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'AUT HT (SS05)',3)
                            pccApi.SS[1].comAutHT=false
                            HTTrains('up','SS05')
                                let ss = pccApi.SS[1]
                                if((pccApi.comAuth===true)&&(pccApi.voyUCA===true)&&(ss.comAutHT===false)&&(ss.voyDHT===true)&&(ss.voyDI===false)&&(pccApi.comArmPR===true)){
                                    pccApi.ss.ss05=true
                                    for(let ectns of Object.entries(pccApi.ectns)){
                                        if(!(ss05CELIST.includes(ectns[0]))) continue;
                                        if(pccApi.ru[ectns[0]]===true){
                                            pccApi.ectns[ectns[0]]=true
                                        }
                                    }
                                    pccApi.PR[0].DJVSS05MSTO=true
                                    pccApi.PR[1].DJVSS05GLANER=true
                                }
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'AUT HT (SS05)',2)
                            pccApi.SS[1].comAutHT=true
                            HTTrains('down','SS05')
                        }
                        break;
                    case 'COUPFSSS04-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'FS (SS04)')
                            pccApi.SS[0].comCoupFS=false
                            FSTrains('up','SS04')
                        } else if(data.state===true){
                            writter.simple('OUI.','PCC', 'FS (SS04)',3)
                            pccApi.SS[0].comCoupFS=true
                            FSTrains('down','SS04')
                        }
                        break;
                    case 'COUPFSSS05-COM':
                        if(data.state===false){
                            writter.simple('NON.','PCC', 'FS (SS05)')
                            pccApi.SS[1].comCoupFS=false
                            FSTrains('up','SS05')
                        } else if(data.state===true){
                            pccApi.SS[1].comCoupFS=true
                            writter.simple('OUI.','PCC', 'FS (SS05)',3)
                            FSTrains('down','SS05')
                        }
                        break;
                }
                exports.apiSave()
                break;
            case 204 :
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data.execute),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if (data.execute==='OPENPV-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.doorsOpenedPV=true
                    trainObj.states.doorsClosedPV=false
                    trainObj.states.cmdOuvPortesTrain=true
                    if(trainObj.states.inZOPP) {
                        let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                        if(typeof stationObj.states === 'undefined') return exports.apiSave();
                        stationObj.states.engagedPMS=false
                        stationObj.states.doorsOpened=true
                        stationObj.states.doorsClosed=false
                        stationObj.states.doorsClosedPAS=false
                        stationObj.states.doorsOpenedPAS=true
                        stationObj.states.defPartFerPP=false
                        stationObj.states.doorsObstacle=false
                    }
                    exports.apiSave()
                } else
                if (data.execute==='CLOSEPV-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.doorsOpenedPV=false
                    trainObj.states.cmdOuvPortesTrain=false

                    if(trainObj.states.inZOPP) {

                        let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                        if(typeof stationObj.states === 'undefined') return exports.apiSave();
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
                    exports.apiSave()
                } else
                if (data.execute==='CLOSEPP-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
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
                    exports.apiSave()
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
                    if(!(stationObj.trains[0])){
                        stationObj.states.doorsOpenedWithoutTrain=2
                        exports.apiSave()
                        return;
                    }
                    if(!stationObj.trains[0].states.inZOPP){
                        stationObj.states.doorsOpenedWithoutTrain=2
                        exports.apiSave()
                        return;
                    }
                    exports.apiSave()
                } else
                if(data.execute==='GENRATEINC-PARTIALPPOPEN-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defPartOuvPP=2
                    exports.apiSave()
                } else
                if(data.execute==='GENRATEINC-PARTIALPPCLOSE-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defPartFerPP=2
                    exports.apiSave()
                } else
                if(data.execute==='GENRATEINC-TOTALPPOPEN-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defTotOuvPP=2
                    exports.apiSave()
                } else
                if(data.execute==='GENRATEINC-TOTALPPCLOSE-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.defTotFerPP=2
                    exports.apiSave()
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
                    exports.apiSave()
                } else
                if(data.execute==='AQC-BTN'){
                    if(!data.target) return;

                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    writter.simple('COMMANDÉ.','PCC', `ACQUITTEMENT Q${pccApi.SEC[sectionIndex].cantons[stationIndex].name}`)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    for(let alarm in stationObj.states){
                        if(!(stationObj.states[alarm]===2)) continue;
                        stationObj.states[alarm]=1
                    }
                    let trainObj = pccApi.trains[stationObj.trains[0]]
                    if(trainObj){
                        for(let alarm in trainObj.states){
                            if(!(trainObj.states[alarm]===2)) continue;
                            trainObj.states[alarm]=1
                        }
                    }
                    exports.apiSave()
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
                    exports.apiSave()
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
                    exports.apiSave()
                } else
                if (data.execute==='OBS-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.activeObs=true
                    exports.apiSave()
                } else
                if (data.execute==='OBS-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.activeObs=false
                    stationObj.states.doorsObstacle=false
                    exports.apiSave()
                } else
                if (data.execute==='PMSUNLOCK-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.unlockedPMS=2
                    exports.apiSave()
                } else
                if (data.execute==='PMSUNLOCK-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.unlockedPMS=false
                    exports.apiSave()
                } else
                if (data.execute==='PMSMANUAL-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.unlockedPMS) return;

                    stationObj.states.manualExpKeyEng=2
                    exports.apiSave()
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
                    exports.apiSave()
                } else
                if (data.execute==='PMSMAINT-ON-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    if(!stationObj.states.unlockedPMS) return;

                    stationObj.states.maintKeyEng=2
                    exports.apiSave()
                } else
                if (data.execute==='PMSMAINT-OFF-COM'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.maintKeyEng=false
                    exports.apiSave()
                } else
                if (data.execute==='SAFE-ON-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    
                    trainObj.states.trainSecurised=true
                    trainObj.states.trainInscrit=true
                    exports.apiSave()
                } else
                if (data.execute==='SAFE-OFF-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    
                    trainObj.states.trainSecurised=false
                    trainObj.states.trainInscrit=false
                    exports.apiSave()
                } else
                if (data.execute==='HLP-ON-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('OUI.','QUAI', 'HLP')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.HLP=true
                    exports.apiSave()
                } else
                if (data.execute==='HLP-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('NON.','QUAI', 'HLP')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.HLP=false
                    exports.apiSave()
                } else
                if (data.execute==='DSO-ON-BTN'){
                    if(!data.target.cIndex) return;
                    
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('DSO OUI.','QUAI', `${stationObj.name}`)
                    stationObj.states.DSO=true
                    exports.apiSave()
                } else
                if (data.execute==='DSO-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('DSO NON.','QUAI', `${stationObj.name}`)
                    stationObj.states.DSO=false
                    exports.apiSave()
                } else
                if (data.execute==='SSO-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('SSO OUI.','QUAI', `${stationObj.name}`)

                    stationObj.states.SSO=true
                    exports.apiSave()
                } else
                if (data.execute==='SSO-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('SSO NON.','QUAI',`${stationObj.name}`)

                    stationObj.states.SSO=false
                    exports.apiSave()
                } else
                if (data.execute==='INHIBPLTPIDPO-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('INHIBITION IDPO PLTP COMMANDÉ.','QUAI', `${stationObj.name}`,2)
                    stationObj.states.DSO=false
                    exports.apiSave()
                    const weweOnControleSale = async() => {
                        await setTimeout(5000)
                        if(stationObj.states.IDPOAlreadyActiveByPLTP===false) {
                        return;}
                        stationObj.states.DSO=true
                        exports.apiSave()
                    }
                    weweOnControleSale()
                } else
                if (data.execute==='INHIBALCIDPO-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('COMMANDÉ.','QUAI', 'INHIBITION IDPO ALC',2)
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    stationObj.states.DSO=false
                    exports.apiSave()
                    const weweOnControleSale = async() => {
                        await setTimeout(5000)
                        if(stationObj.states.IDPOAlreadyActiveByALC===false) {
                        return;}
                        stationObj.states.DSO=true
                        exports.apiSave()
                    }
                    weweOnControleSale()
                } else
                if (data.execute==='OBSVEH-ON-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.obstalceActive=true
                    exports.apiSave()
                } else
                if (data.execute==='OBSVEH-OFF-COM'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.obstalceActive=false
                    exports.apiSave()
                } else
                if (data.execute==='SETTIME-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple(`TEMPS EDITÉ EN ${data.new}.`,'QUAI', `${stationObj.name}`)
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    let newTime = parseInt(data.new)

                    stationObj.states.actualTime=newTime
                    exports.apiSave()
                } else
                if (data.execute==='EMCALL-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.trains[pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]]
                    trainObj.states.trainEmCall=2
                    trainObj.states.forbiddenStart=2
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    if(stationObj.hasOwnProperty('type')){
                        stationObj.states.DSO=true
                        stationObj.states.IDPOAlreadyActiveByALC=true
                    }
                    exports.apiSave()
                } else
                if (data.execute==='ACQEMCALL-BTN'){
                    let response = JSON.parse(getCantonsInfo(data.target))
                    if(!response) return;
                    let trainObj=pccApi.SEC[response.secIndex].cantons[response.cantonIndex].trains[parseInt(response.trainIndex)]
                    trainObj.states.trainEmCall=false
                    trainObj.states.forbiddenStart=false
                    let stationObj = pccApi.SEC[response.secIndex].cantons[response.cantonIndex]
                    stationObj.states.IDPOAlreadyActiveByALC=false
                    exports.apiSave()
                } else
                if (data.execute==='AFD-ON-BTN'){
                    if(!data.target.cIndex) return;
                    
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('AUTORISATION FORCAGE DÉPART COMMANDÉ.','QUAI', `${stationObj.name}`,2)

                    stationObj.states.afdActive=true
                    exports.apiSave()
                } else
                if (data.execute==='AFD-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('AUTORISATION FORCAGE DÉPART RAZ.','QUAI', `${stationObj.name}`,2)

                    stationObj.states.afdActive=false
                    exports.apiSave()
                } else
                if (data.execute==='VVTS1-ON-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('OUI.','QUAI', 'VVT S1')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS1=true
                    exports.apiSave()
                } else
                if (data.execute==='VVTS1-RAZ-BTN'){
                    writter.simple('NON.','QUAI', 'VVT S1')
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS1=false
                    exports.apiSave()
                } else
                if (data.execute==='VVTS2-ON-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('OUI.','QUAI', 'VVT S2')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS2=true
                    exports.apiSave()
                } else
                if (data.execute==='VVTS2-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('NON.','QUAI', 'VVT S2')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.VVTS2=false
                    exports.apiSave()
                } else
                if (data.execute==='DEPA-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('DÉPART IMMÉDIAT ACTIONNÉ.','QUAI',`${stationObj.name}`)

                    stationObj.states.depaActive=true
                    exports.apiSave()
                } else
                if (data.execute==='DEPA-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('DÉPART IMMÉDIAT RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.depaActive=false
                    exports.apiSave()
                } else
                if (data.execute==='IDPF-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('INTERDICTION DÉPART PF ACTIONNÉ.','QUAI', `${stationObj.name}`)

                    stationObj.states.idpfActive=true
                    exports.apiSave()
                } else
                if (data.execute==='IDPF-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('INTERDICTION DÉPART PF RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.idpfActive=false
                    exports.apiSave()
                } else
                if (data.execute==='MAPF-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('MAINTIEN ARRÊT PF ACTIONNÉ.','QUAI', `${stationObj.name}`)

                    stationObj.states.mapfActive=true
                    exports.apiSave()
                } else
                if (data.execute==='MAPF-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('MAINTIEN ARRÊT PF RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.mapfActive=false
                    exports.apiSave()
                } else
                if (data.execute==='ISTA-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('INTERDICTION STATIONNEMENT ACTIONNÉ.','QUAI', `${stationObj.name}`)

                    stationObj.states.istaActive=true
                    exports.apiSave()
                } else
                if (data.execute==='ISTA-RAZ-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('INTERDICTION STATIONNEMENT RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.istaActive=false
                    exports.apiSave()
                } else
                if (data.execute==='SSO-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('SERVICE DE SECURITE SUR ORDRE ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.SSO=true
                    stationObj.states.SS=false
                    exports.apiSave()
                } else
                if (data.execute==='SS-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('SERVICE DE SECURITE SIMPLE ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.SS=true
                    stationObj.states.SSO=false
                    exports.apiSave()
                } else
                if (data.execute==='SS-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('SERVICE DE SECURITE RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.SSO=false
                    stationObj.states.SS=false
                    exports.apiSave()
                } else
                if (data.execute==='CMCC-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('CONDUITE MANUELLE A CONTROLE CONTINU ACTIF.','QUAI',`${stationObj.name}`)

                    stationObj.states.CMCC=true
                    stationObj.states.CMCP=false
                    exports.apiSave()
                } else
                if (data.execute==='CMCP-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('CONDUITE MANUELLE A CONTROLE PONCTUEL ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.CMCC=false
                    stationObj.states.CMCP=true
                    exports.apiSave()
                } else
                if (data.execute==='CMC-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('CONDUITE MANUELLE RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.CMCC=false
                    stationObj.states.CMCP=false
                    exports.apiSave()
                } else
                if (data.execute==='RP10-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('RALENTISSEMENT PROVISOIRE 10KMH ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.RP10=true
                    stationObj.states.RP30=false
                    exports.apiSave()
                } else
                if (data.execute==='RP30-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('RALENTISSEMENT PROVISOIRE 30KMH ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.RP10=false
                    stationObj.states.RP30=true
                    exports.apiSave()
                } else
                if (data.execute==='RP-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('RALENTISSEMENT PROVISOIRE RAZ.','QUAI',`${stationObj.name}`)

                    stationObj.states.RP10=false
                    stationObj.states.RP30=false
                    exports.apiSave()
                } else
                if (data.execute==='PSV-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('PERSONNEL SUR VOIES ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.PSV=true
                    exports.apiSave()
                } else
                if (data.execute==='PSV-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('PERSONNEL SUR VOIES RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.PSV=false
                    exports.apiSave()
                } else
                if (data.execute==='AAHS-ON-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('AVERTISSEUR D\'ALARME HS ACTIF.','QUAI', `${stationObj.name}`)

                    stationObj.states.AAHS=true
                    exports.apiSave()
                } else
                if (data.execute==='AAHS-OFF-BTN'){
                    if(!data.target.cIndex) return;
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]
                    writter.simple('AVERTISSEUR D\'ALARME HS RAZ.','QUAI', `${stationObj.name}`)

                    stationObj.states.AAHS=false
                    exports.apiSave()
                } else
                if (data.execute==='VVTS1-INHIB-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('ACTIONNÉ.','QUAI', 'INHIBITION VVT S1')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.defOrderExec=2
                    const weweOnAttendLaFinDeLhinib = async() => {
                        await setTimeout(4000)
                        stationObj.states.defOrderExec=false
                        exports.apiSave()
                    }
                    weweOnAttendLaFinDeLhinib()
                    exports.apiSave()
                } else
                if (data.execute==='VVTS2-INHIB-BTN'){
                    if(!data.target.cIndex) return;
                    writter.simple('RAZ.','QUAI', 'INHIBITION VVT S2')
                    let stationIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let stationObj = pccApi.SEC[sectionIndex].cantons[stationIndex]

                    stationObj.states.defOrderExec=2
                    const weweOnAttendLaFinDeLhinib = async() => {
                        await setTimeout(4000)
                        stationObj.states.defOrderExec=false
                        exports.apiSave()
                    }
                    weweOnAttendLaFinDeLhinib()
                    exports.apiSave()
                } else                                       //TRAIN
                if(data.execute==='AQC-BTN-TRAIN'){
                    if(!data.target.id) return;

                    writter.simple('COMMANDÉ.','TRAIN', `ACQUITTEMENT T${data.target.id}`)
                    let trainObj = pccApi.trains[data.target.id]
                    for(let alarm in trainObj.states){
                        if(!(trainObj.states[alarm]===2)) continue;
                        if(alarm==='cptFu') continue;
                        trainObj.states[alarm]=1
                    }
                    exports.apiSave()
                } else
                /*if(data.execute==='FU-BTN-ON'){
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
                    exports.apiSave()
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
                    exports.apiSave()
                } else*/
                if(data.execute==='CPTFU-BTN-ACQ'){
                    if(!data.target.id) return;
                    writter.simple('COMMANDÉ.','TRAIN', 'ACQUITTEMENT COMPTEUR FU',2)
                    let trainObj=pccApi.trains[data.target.id]
                    trainObj.states.cptFu=0
                    trainObj.states.defTech=false
                    trainObj.states.v0pas=false
                    trainObj.states.blockedTrain=false
                    exports.apiSave()
                } /*else
                if(data.execute==='PREP-BTN'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    writter.simple('COMMANDÉE.','TRAIN', 'PRÉPARATION')
                    let cantonIndex = parseInt(data.target.cIndex)
                    let sectionIndex = parseInt(data.target.secIndex)
                    let trainIndex = parseInt(data.target.tIndex)
                    let trainObj = pccApi.SEC[sectionIndex].cantons[cantonIndex].trains[trainIndex]
                    const goFaireDuRPInutile = async() => {
                        trainObj.states.TMSActive=true
                        trainObj.states.defLtpa=2
                        exports.apiSave()
                        await setTimeout(2040)
                        trainObj.states.defTech=2
                        trainObj.states.defFN=2
                        trainObj.states.permBrake=true
                        trainObj.states.defLectBal=2
                        trainObj.states.activeFU=true
                        trainObj.states.cmdFu=2
                        trainObj.states.cptFu++
                        exports.apiSave()
                        await setTimeout(1510)
                        trainObj.states.trainFrott=2
                        trainObj.states.defCvs=2
                        trainObj.states.trainBattery=2
                        trainObj.states.abs750=2
                        exports.apiSave()
                        await setTimeout(2120)
                        trainObj.states.defDistBt=2
                        trainObj.states.btDelest=2
                        trainObj.states.avarieOnduls=2
                        exports.apiSave()
                        await setTimeout(4015)
                        trainObj.states.awakeMR=true
                        trainObj.states.speed=0
                        trainObj.states.defLtpa=false
                        trainObj.states.defLectBal=false
                        trainObj.states.trainPilot=true
                        trainObj.states.v0pas=2
                        trainObj.states.trainFrott=true
                        exports.apiSave()
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
                        exports.apiSave()
                        await setTimeout(1034)
                        trainObj.states.testAuto=2
                        trainObj.states.activeFI=true
                        trainObj.states.forbCommand=2
                        exports.apiSave()
                        await setTimeout(10120)
                        trainObj.states.avarieOnduls=false
                        exports.apiSave()
                        await setTimeout(4030)
                        trainObj.states.validTests=true
                        trainObj.states.activeTests=false
                        if(pccApi.voyHT===true){
                            trainObj.states.defTech=false
                        }
                        exports.apiSave()
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
                        exports.apiSave()
                        await setTimeout(10028)
                        trainObj.states.nullSpeed=true
                        trainObj.states.defFN=false
                        trainObj.states.testAuto=false
                        trainObj.states.waitingMission=true
                        trainObj.states.permBrake=false
                        trainObj.states.cmdTraction=true
                        exports.apiSave()
                        await setTimeout(10021)
                        trainObj.states.pretTrain=true
                        trainObj.states.autoTrain=true
                        trainObj.states.forbCommand=false
                        trainObj.states.vitModifPAS=false
                        exports.apiSave()
                        await setTimeout(400)
                        if(pccApi.voyFS===true){
                            trainObj.states.cmdFu=false
                            trainObj.states.fuNoFS=false
                            trainObj.states.fsOk=true
                        }
                    }
                    const refusPrep = async() => {
                        trainObj.states.echecPrep=2
                        exports.apiSave()
                        await setTimeout(10000)
                        trainObj.states.echecPrep=false
                        exports.apiSave()
                    }
                    if(trainObj.states.pretTrain){
                        refusPrep()
                    } else {
                        goFaireDuRPInutile()
                    }
                    exports.apiSave()
                } else
                if(data.execute==='DEPREP-BTN'){
                    if(!data.target.secIndex) return;
                    if(!data.target.cIndex) return;
                    if(!data.target.tIndex) return;
                    writter.simple('COMMANDÉE.','TRAIN', 'DÉPRÉPARATION')
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
                        exports.apiSave()
                        await setTimeout(2000)
                        trainObj.states.autoTrain=false
                        trainObj.states.trainPilot=false
                        trainObj.states.defFN=2
                        trainObj.states.permBrake=true
                        exports.apiSave()
                        await setTimeout(1500)
                        trainObj.states.trainLights=false
                        trainObj.states.trainHeating=false
                        trainObj.states.trainComp=false
                        trainObj.states.trainFrott=false
                        exports.apiSave()
                        await setTimeout(1000)
                        trainObj.states.abs750=2
                        trainObj.states.activeOnduls=false
                        trainObj.states.avarieOnduls=2
                        exports.apiSave()
                        await setTimeout(1000)
                        trainObj.states.pretTrain=false
                        trainObj.states.activeFI=true
                        trainObj.states.cptFu=0
                        trainObj.states.avarieOnduls=false
                        exports.apiSave()
                        await setTimeout(5000)
                        for(let alarm in trainObj.states){
                            if(alarm==='cptFu') continue;
                            trainObj.states[alarm]=false
                        }
                        exports.apiSave()
                    }
                    const refusDeprep = async() => {
                        trainObj.states.refusDeprep=2
                        exports.apiSave()
                        await setTimeout(10000)
                        trainObj.states.refusDeprep=false
                        exports.apiSave()
                    }
                    if(trainObj.states.pretTrain){
                        goFaireDuRPInutile()
                    } else {
                        refusDeprep()
                    }
                }*/
                break;
            case 220:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if((pccApi.SEC[0].cantons[0].trains.length===0)||(pccApi.SEC[0].cantons[1].trains.length===0)){
                    pccApi.SEC[0].states.retDispoV101=true
                }
                if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
                    pccApi.SEC[0].states.injDispoV101=true
                } else {
                    pccApi.SEC[0].states.injDispoV101=false
                }
                if(data.execute==='SEL-BTN-ITI'){
                    if(!(data.target)) return;
                    itineraire.SEL(data.target)
                    /*for(let sec of pccApi.SEC){
                        for(let itilist of Object.entries(sec.ITI[0])){
                            for(let iti of itilist[1]){
                                //console.log(iti.code)
                                if(iti.code===data.target){
                                    const rpdelay = async() => {
                                        iti.mode='SEL'
                                        exports.apiSave()
                                        writter.simple('SÉLECTIONNÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                                        await setTimeout(2000)
                                        iti.active=true
                                        for(let aigIti of Object.entries(pccApi.aigItis)){
                                            if (aigIti[1].includes(iti.code)) {
                                                for(let aigGroup of pccApi.aiguilles){
                                                    if(!(aigGroup.id===aigIti[0])) continue;
                                                    aigGroup.actualIti.push(iti.code)
                                                }
                                            }
                                        }
                                        exports.apiSave()
                                        writter.simple('FORMÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                                    }
                                    rpdelay()
                                    return;
                                } else continue;
                            }
                        }
                    }*/
                } else if(data.execute==='DES-BTN-ITI'){
                    if(!(data.target)) return;
                    itineraire.DES(data.target)
                } else if(data.execute==='DU-BTN-ITI'){
                    if(!(data.target)) return;
                    itineraire.DU(data.target)
                    /*for(let sec of pccApi.SEC){
                        for(let itilist of Object.entries(sec.ITI[0])){
                            for(let iti of itilist[1]){
                                //console.log(iti.code)
                                if(iti.code===data.target){
                                    const rpdelay = async() => {
                                        iti.mode='DU'
                                        iti.mode=false
                                        iti.active=false
                                        for(let aigIti of Object.entries(pccApi.aigItis)){
                                            if (aigIti[1].includes(iti.code)) {
                                                for(let aigGroup of pccApi.aiguilles){
                                                    if(!(aigGroup.id===aigIti[0])) continue;
                                                    aigGroup.actualIti.splice(aigGroup.actualIti.indexOf(iti.code),1)
                                                }
                                            }
                                        }
                                        exports.apiSave()
                                        writter.simple('DÉTRUIT D\'URGENCE.','PA', `ITINÉRAIRE ${iti.code}`)
                                    }
                                    rpdelay()
                                    return;
                                } else continue;
                            }
                        }
                    }*/
                }
                break;
            case 221:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if((pccApi.SEC[0].cantons[0].trains.length===0)||(pccApi.SEC[0].cantons[1].trains.length===0)){
                    pccApi.SEC[0].states.retDispoV101=true
                }
                if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
                    pccApi.SEC[0].states.injDispoV101=true
                } else {
                    pccApi.SEC[0].states.injDispoV101=false
                }
                if(data.execute==="SEQUENCE") seq.appseq(data.target)
                /*if(data.execute==='RET-BTN-ITI'){
                    if(!(data.target)) return;
                    if(data.target==='V201'){
                        if(pccApi.SEC[0].cantons[9].trains.length>0) return;
                            for(let itides of ['2501_2401','2401_2201','2201_1201','2401_1401','1201_2201','2401_1401']){
                                if(itiInf(itides).active===true) itineraire.DES(itides)
                            }
                            for(let itisel of ['2201_2401','2401_2501']){
                                if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                            }
                            writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)
                        let endCycleIti = ()=>{
                            if(pccApi.SEC[0].cantons[9].trains.length>0){
                                clearInterval(endCycleInter)
                                pccApi.SEC[0].states.injDispoV201=true
                                pccApi.SEC[0].states.retDispoV201=false
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    }
                    if(data.target==='V101'){
                        if(pccApi.SEC[0].cantons[0].trains.length>0) return;
                            for(let itides of ['1401_2401','2401_1401','1201_2201','1101_1201','2201_2401','2401_2201','1201_1401','1401_1201']){
                                if(itiInf(itides).active===true) itineraire.DES(itides)
                            }
                            for(let itisel of ['2201_1201','1201_1101']){
                                if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                            }
                            writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)
                        let endCycleIti = ()=>{
                            if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
                                clearInterval(endCycleInter)
                                pccApi.SEC[0].states.injDispoV101=true
                                if((pccApi.SEC[0].cantons[0].trains.length>0)||(pccApi.SEC[0].cantons[1].trains.length>0)){
                                    pccApi.SEC[0].states.retDispoV101=true
                                } else {
                                    pccApi.SEC[0].states.retDispoV101=false
                                }
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    }
                    if(data.target==='GLA'){
                        if(pccApi.SEC[0].cantons[9].trains.length>0) return;
                            for(let itides of ['PAG1_1102','1202_1501','1202_2101','2101_1202']){
                                if(itiInf(itides).active===true) itineraire.DES(itides)
                            }
                            for(let itisel of ['1501_1202','1102_PAG1']){
                                if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                            }
                            writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)

                        let endCycleIti = ()=>{
                            if(pccApi.SEC[1].cantons[9].trains.length>0){
                                clearInterval(endCycleInter)
                                pccApi.SEC[1].states.entreeDispoGla=true
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE RETRAIT ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    }
                }
                if(data.execute==='INJ-BTN-ITI'){
                    if(!(data.target)) return;
                    if(data.target==='V201'){
                        if(pccApi.SEC[0].cantons[3].trains.length>0) return;
                            for(let itides of ['2401_2501','2401_2201','2201_2401','2201_1201','1201_2201']){
                                if(itiInf(itides).active===true) itineraire.DES(itides)
                            }
                            for(let itisel of ['2501_2401','2401_1401']){
                                if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                            }
                            writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                        let endCycleIti = ()=>{
                            if(pccApi.SEC[0].cantons[3].trains.length>0){
                                clearInterval(endCycleInter)
                                pccApi.SEC[0].states.injDispoV201=false
                                pccApi.SEC[0].states.retDispoV201=true 
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    } else if(data.target==='V101'){
                        if(pccApi.SEC[0].cantons[3].trains.length>0) return;
                        for(let itides of ['1401_1201','1201_1101','2201_1201','1201_2201','2401_1401','1401_2401']){
                            if(itiInf(itides).active===true) itineraire.DES(itides)
                        }
                        for(let itisel of ['1101_1201','1201_1401']){
                            if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                        }
                        writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                        let endCycleIti = ()=>{
                            if((pccApi.SEC[0].cantons[3].trains.length>0)){
                                clearInterval(endCycleInter)
                                
                                if((pccApi.SEC[0].cantons[1].trains.length>0)&&(pccApi.SEC[0].cantons[0].trains.length>0)){
                                    pccApi.SEC[0].states.injDispoV101=true
                                }
                                if((pccApi.SEC[0].cantons[1].trains.length>0)||(pccApi.SEC[0].cantons[0].trains.length>0)){
                                    pccApi.SEC[0].states.retDispoV101=true
                                }
                                if((pccApi.SEC[0].cantons[1].trains.length===0)&&(pccApi.SEC[0].cantons[0].trains.length===0)){
                                    pccApi.SEC[0].states.injDispoV101=false
                                }
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    } else if(data.target==='GLA'){
                        if(pccApi.SEC[0].cantons[5].trains.length>0) return;
                        for(let itides of ['1102_PAG1','2101_1202','1501_1202','1202_1501','2301_2101','2101_2302']){
                            if(itiInf(itides).active===true) itineraire.DES(itides)
                        }
                        for(let itisel of ['PAG1_1102','1202_2101']){
                            if(itiInf(itisel).active===false) itineraire.SEL(itisel)
                        }
                        writter.simple('SÉLECTIONNÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                        let endCycleIti = ()=>{
                            if((pccApi.SEC[0].cantons[5].trains.length>0)){
                                clearInterval(endCycleInter)
                                pccApi.SEC[1].states.entreeDispoGla=false
                                exports.apiSave()
                                writter.simple('TERMINÉ.','PA', `SEQUENCE INJECTION ${data.target}`)
                            }
                        }
                        let endCycleInter = setInterval(endCycleIti,2000)
                    }
                }*/
                if(data.execute==='SP-ON'){
                    if(!(data.target)) return;
                    if(data.target==='STO'){
                        if(cycleInfo('c1p2').active===true){
                            pccApi.SEC[1].states.spsto=true
                            writter.simple('DÉCLARÉ.','PA', `SP STO`,2)
                            this.apiSave()
                        } else {
                            const rpdelay = async() => {
                                writter.simple('EN ATTENTE.','PA', `SP STO`,2)
                                pccApi.SEC[1].states.spsto=1
                                exports.apiSave()
                                await setTimeout(5000)
                                if(cycleInfo('c1p2').active===true){
                                    pccApi.SEC[1].states.spsto=true
                                    writter.simple('DÉCLARÉ.','PA', `SP STO`,2)
                                } else {
                                    pccApi.SEC[1].states.spsto=false
                                    writter.simple('A L\'ABANDON.','PA', `SP STO`)
                                }
                                exports.apiSave()
                            }
                            rpdelay()
                        }
                    }
                }
                if(data.execute==='SP-RAZ'){
                    if(!(data.target)) return;
                    if(data.target==='STO'){
                        pccApi.SEC[1].states.spsto=false
                        writter.simple('SUPPRIMÉ.','PA', `SP STO`)
                    }
                    this.apiSave()
                }
                break;
            case 226:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if(data.execute==='EMCALL-TEST'){
                    console.log(com.triggerSpecialAction('train', '2', 'emCall', data.reqestBody))
                }
                if(data.execute==='EMCALL-ACQ'){
                    if(pccApi.emCalls.length>0){
                        pccApi.emCalls[0].active=true
                        exports.apiSave()
                        writter.simple('ACQUITTÉ.','PCC', `APPEL DÉTRESSE DE ${pccApi.emCalls[0].trid} PAR ${pccApi.emCalls[0].caller} A ${pccApi.emCalls[0].ctn}`,2)
                    }
                }
                if(data.execute==='EMCALL-RAZ'){
                    console.log(com.changeElementState('train', pccApi.emCalls[0].trid, 'trainSOS', false, true))
                    writter.simple('RAZ.','PCC', `APPEL DÉTRESSE DE ${pccApi.emCalls[0].trid} PAR ${pccApi.emCalls[0].caller} A ${pccApi.emCalls[0].ctn}`,2)
                    pccApi.emCalls.shift()
                    exports.apiSave()

                }
                break;
            case 222:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if(data.execute==='SEL-BTN-CYCLE'){
                    if(!(data.target)) return;
                    for(let sec of pccApi.SEC){
                        for(let cycle of sec.CYCLES){
                            if(!(cycle.code===data.target)){
                                cycle.active=false
                                cycle.sel=false
                                continue;
                            }
                            cycle.sel=true
                            exports.apiSave()
                            writter.simple(`CYCLE ${cycle.code} SÉLECTIONNÉ.`,'PA', `IGC`)
                            sec.states.cycleOngoing=true
                            if(cycle.code==='c1p1'){
                                let secureCnt = 0
                                let checkCycleClear = ()=>{
                                    secureCnt++
                                    if(secureCnt===5){
                                        clearInterval(checkCycleClearInter)
                                        cycle.sel=false
                                        exports.apiSave()
                                        writter.simple(`CYCLE ${cycle.code} ANNULÉ.`,'PA', `IGC`,2)
                                        return;
                                    }
                                    if(!(pccApi.SEC[0].cantons[8].trains.length>0)){
                                        clearInterval(checkCycleClearInter)
                                        ogdc.startCycle(cycle.code, wss, true)
                                        exports.apiSave()

                                    }
                                }
                                let checkCycleClearInter = setInterval(checkCycleClear,2000)
                            }
                            if(cycle.code==='c2p1'){
                                let secureCnt = 0
                                let checkCycleClear = ()=>{
                                    secureCnt++
                                    if(secureCnt===5){
                                        clearInterval(checkCycleClearInter)
                                        cycle.sel=false
                                        exports.apiSave()
                                        writter.simple(`CYCLE ${cycle.code} ANNULÉ.`,'PA', `IGC`,2)
                                        return;
                                    }
                                    if(!(pccApi.SEC[0].cantons[1].trains.length>0)){
                                        clearInterval(checkCycleClearInter)
                                        ogdc.startCycle(cycle.code, wss, true)
                                        exports.apiSave()
                                    }
                                }
                                let checkCycleClearInter = setInterval(checkCycleClear,2000)
                            }
                            if(cycle.code==='c1p2'){
                                let secureCnt = 0
                                let checkCycleClear = ()=>{
                                    secureCnt++
                                    if(secureCnt===5){
                                        clearInterval(checkCycleClearInter)
                                        cycle.sel=false
                                        exports.apiSave()
                                        writter.simple(`CYCLE ${cycle.code} ANNULÉ.`,'PA', `IGC`,2)
                                        return;
                                    }
                                    if(pccApi.SEC[0].cantons[5].trains.length===0){
                                        console.log('iti '+cycle.code+' activated')
                                        clearInterval(checkCycleClearInter)
                                        ogdc.startCycle(cycle.code, wss, true)
                                        exports.apiSave()
                                    }
                                }
                                let checkCycleClearInter = setInterval(checkCycleClear,2000)
                            }
                        }
                    }
                }
                break;
            case 223:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if(data.execute==='CANCELCYCLES-BTN-ITI'){
                    if(!(data.target)) return;
                    writter.simple(`CYCLES S${data.target} ANNULÉS.`,'PA', `IGC`,2)
                    for(let sec of pccApi.SEC){
                        if(!(sec.id===data.target)) continue;
                        for(let cycle of sec.CYCLES){
                            cycle.active=false
                            cycle.sel=false
                        }
                        //sec.states.cycleOngoing=false
                    }
                    ogdc.clearAll()
                    exports.apiSave()
                } else if(data.execute==='DUG-BTN-ITI'){
                    if(!(data.target)) return;
                    writter.simple(`DUG S${data.target} COMMANDÉE.`,'PA', `ICI`,2)
                    for(let sec of pccApi.SEC){
                        if(!(sec.id===data.target)) continue;
                        for(let itilist of Object.entries(sec.ITI[0])){
                            for(let iti of itilist[1]){
                                if(iti.active){
                                    changeItiState('du',iti.code)
                                }
                            }
                        }
                    }
                    return exports.apiSave()
                }
                break;
            case 224:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if(data.execute==='AQC-BTN'){
                    if(!(data.target)) return;
                    writter.simple('COMMANDÉ.','PCC', `ACQUITTEMENT S${data.target}`)
                    for(let sec of pccApi.SEC){
                        if(!(sec.id===data.target)) continue;
                        for(let state of Object.entries(sec.states)){
                            if(!(state[1]===2)) continue;
                            if(state[0].startsWith('zoneManoeuvre')||state[0].startsWith('discord')){
                                sec.states[state[0]]=false
                            } else {
                                sec.states[state[0]]=1
                            }
                        }
                        for(let ctn of sec.cantons){
                            for(let state of Object.entries(ctn.states)){
                                if(!((state[0]==='pzo')||(state[0]==='coupFs')||(state[0]==='tcs')||(state[0]==='ldi')||(state[0]==='pdp')||(state[0]==='selAcc'))) continue;
                                ctn.states[state[0]]=false
                                if(state[0]==='ldi' && pccApi.voyALC===2){
                                    pccApi.voyALC=false
                                }
                            }
                        }
                    }
                    exports.apiSave()
                }
                break;
            case 400:
                if(!isClientExisting(data.uuid)) return;

                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)

                moveHandler(data.train, data.sens)
                break;
            case 402:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                exports.dpManage(data.train,data.ctnId,data.value)
                break;
            case 500:
                if(!isClientExisting(data.uuid)) return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                let args = data.cmd
                let cmd = args[0]

                let cmdargs = args
                args.shift()


                let aiguilles = []


                if(!((cmdargs[0])||(cmdargs[1]))){
                    console.log('aucun canton renseigné')
                    return;
                }
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
                    exports.apiSave()
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
                    exports.apiSave()
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
            case 700:
                if(!isClientExisting(data.uuid)) return;
                if(data.method==="spawn") return console.log(com.manageTrains('spawn',data.train, { initial: "set", owner:"ADMIN", type:"14" }))
                if(data.method==="delete") return console.log(com.manageTrains('remove',data.train))
                break;
            case 900:
                if(!isClientExisting(data.uuid)) return;
                if(!ws.role==='chef') return;
                logger.message('income',JSON.stringify(data),clients[data.uuid].usr.username,clients[data.uuid].ip,clients[data.uuid].instance)
                if(data.command==='stopServer'){
                    logger.info(`ARRET DU SERVEUR! Opérateur: ${ws.usr.username}, depuis ${ws.ip}`)
                    writter.simple('COMMANDÉ.','PCC', `ARRÊT DU SERVEUR`,3)
                    exports.apiSave()
                    process.exit(0)
                } else if(data.command==='trainDelete'){
                    for(let sec of pccApi.SEC){
                        for(let ctn of sec.cantons){
                            if(!(ctn.trains.length>0)) continue;
                            for(let train of ctn.trains){
                                if(!(pccApi.trains[train].tid===data.train)) continue;
                                let availableCtn = ['cGPAG1','c1101','c1201','c1501']
                                if(availableCtn.includes(ctn.cid)){
                                    ctn.trains.shift()
                                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                    exports.apiSave()
                                    logger.confirm(`Suppression du train ${data.train}! Opérateur: ${ws.usr.username}, depuis ${ws.ip}`)
                                    writter.simple('COMMANDÉE.','PCC', `SUPPRESSION T${data.train}`,2)
                                } else {
                                    ctn.trains.shift()
                                    logger.info('FORCED SUPPRESION')
                                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                    exports.apiSave()
                                    logger.confirm(`Suppression du train ${data.train}! Opérateur: ${ws.usr.username}, depuis ${ws.ip}`)
                                    writter.simple('COMMANDÉE.','PCC', `SUPPRESSION FORCÉE T${data.train}`,3)
                                }
                            }
                        }
                    }
                }

                break;
        }
    })
    ws.on("close", ()=>{

        if(clients[ws.id]){
            wss.broadcast(JSON.stringify({
                op: 11,
                name: ws.usr.username,
                content: pccApi
            }))
            for(let player in pccApi.players){
                if((ws.id.slice(0,10)+'...') === pccApi.players[player].uuid){
                    pccApi.players.splice(player, 1)
                }
            }
            delete clients[ws.id];
            if(!ws.loaded){
                logger.error(ws.usr.username+' leaved without loading!')
            }
            
            logger.client(false,ws,Object.keys(clients).length);
            writter.simple(`- Utilisateur ${ws.usr.username} (${ws.role})`,'GAME', 'USER')
            exports.apiSave()
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

//? INTERNALS

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
                
                reponse.trains.push(train)
            }
        }
    }
    return reponse;
}

function changeItiState(mode, code){
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===code)) continue;
                if(mode==='sel'){
                    const rpdelay = async() => {
                        iti.mode='SEL'
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        await setTimeout(2000)
                        iti.active=true
                        for(let aigIti of Object.entries(pccApi.aigItis)){
                            if (aigIti[1].includes(iti.code)) {
                                for(let aigGroup of pccApi.aiguilles){
                                    if(!(aigGroup.id===aigIti[0])) continue;
                                    aigGroup.actualIti.push(iti.code)
                                }
                            }
                        }
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    }
                    rpdelay()
                } else if(mode==='des'){
                    const rpdelay = async() => {
                        iti.mode='DES'
                        iti.active=false
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        await setTimeout(2000)
                        iti.mode=false
                        for(let aigIti of Object.entries(pccApi.aigItis)){
                            if (aigIti[1].includes(iti.code)) {
                                for(let aigGroup of pccApi.aiguilles){
                                    if(!(aigGroup.id===aigIti[0])) continue;
                                    aigGroup.actualIti.splice(aigGroup.actualIti.indexOf(iti.code),1)
                                }
                            }
                        }
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    }
                    rpdelay()
            
                } else if(mode==='du'){
                    itineraire.DU(code,true)
                } else return false;
            }
        }
    }
    return false;
}

function isItiActive(code){
    if(!code) return console.error('[isItiActive] Aucun code d\'iti indiqué!')
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===code)) continue;
                return iti.active
            }
        }
    }
    console.info('[itiInfo] Aucun itinéraire correspondant.')
    return false;
}

function cycleInfo(code){
    for(let sec of pccApi.SEC){
        for(let cycle of sec.CYCLES){
            if(cycle.code===code) return cycle;
        }
    }
    return false;
}

function itiInf(code){
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    return iti
                } else continue;
            }
        }
    }
}


exports.dpManage = (tid,dp,value)=>{
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(ctn.cid===`c${dp}`){
                ovse.lastCtn=ctn.cid
                if(value===false){
                    ctn.trains.splice(ctn.trains.indexOf(tid),1)
                    writter.simple(`BOUCLE ${dp} TRAIN ${tid} -> INACTIVE`,'PA','DP')
                    if(pccApi.trainMouvements[tid]){
                        pccApi.trainMouvements[tid].splice(pccApi.trainMouvements[tid].indexOf(ctn.cid),1)
                    } else {
                        pccApi.trainMouvements[tid] = []
                        logger.error(`Échec pour la bascule de la DP ${dp}.`)
                    }
                    exports.apiSave();
                    return true;
                } else if (value===true){
                    ovse.lastDPOn=ctn.cid
                    ctn.trains.push(tid)
                    writter.simple(`BOUCLE ${dp} TRAIN ${tid} -> ACTIVE`,'PA','DP')
                    if(pccApi.trainMouvements[tid]){
                        pccApi.trainMouvements[tid].push(ctn.cid)
                    } else {
                        pccApi.trainMouvements[tid] = []
                        pccApi.trainMouvements[tid].push(ctn.cid)
                    }
                    exports.apiSave();
                    return true;
                }
            }
        }
    }
    logger.error(`Balise ${tid} non trouvée.`)
    writter.simple(`BOUCLE ${tid} NON IDENTIFIÉE`,'PCC','DÉFAUT',3)
    return false;
}
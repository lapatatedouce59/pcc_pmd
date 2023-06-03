/**
 * Gestionnaire des Scénarios Automatisés
 * @module GSA
 */

const logger = require('./logger')

const pccApi=require('./server.json');

const fs = require('fs')

const {setTimeout} = require('timers/promises')

/**
* Génère un chemin d'accès à un train choisi randomly
* @default false Aucun train n'a été trouvé
* @returns Indexs de chemin pour accéder au train
* @type {object}
*/

exports.getRandomTrain = function (){
    let trains = []
    for(let sec in pccApi.SEC){
        for(let ctn in pccApi.SEC[sec].cantons){
            for(let tr in pccApi.SEC[sec].cantons[ctn].trains){
                if(typeof pccApi.SEC[sec].cantons[ctn].trains[tr].tid === 'undefined') continue;
                trains.push({tIndex: tr, cIndex: ctn, sIndex: sec})
            }
        }
    }
    if (trains.length===0) return false
    let randomIndex = Math.floor(Math.random() * trains.length);
    let theChoosenOne = trains[randomIndex]
    return theChoosenOne;
}

/**
* Génère un chemin d'accès à une station choisie randomly
* @default false Aucune station n'a été trouvé
* @returns Indexs de chemin pour accéder à la station
* @type {object}
*/

exports.getRandomStation = function (){
    let stations = []
    for(let sec in pccApi.SEC){
        for(let ctn in pccApi.SEC[sec].cantons){
            if(!(pccApi.SEC[sec].cantons[ctn].hasOwnProperty('type'))) continue;
            stations.push({cIndex: ctn, sIndex: sec})
        }
    }
    if (stations.length===0) return false
    let randomIndex = Math.floor(Math.random() * stations.length);
    let theChoosenOne = stations[randomIndex]
    return theChoosenOne;
}

/**
* Génère un chemin d'accès à un PAS choisi randomly
* @default false Aucun PAS n'a été trouvé
* @returns Indexs de chemin pour accéder au PAS
* @type {object}
*/

exports.getRandomPAS = function (){
    let pas = []
    for(let sec in pccApi.SEC){
        pas.push(sec)
    }
    let randomIndex = Math.floor(Math.random() * pas.length);
    let theChoosenOne = pas[randomIndex]
    return theChoosenOne;
}

/**
* Applique un scénario d'incident commandé
* @param det Déterminant de la commande
* @param cmd Commande d'incident
* @param usr Utilisateur ayant émis la commande (déterminé par la Map)
* @param ws WebSeocket actif (permet de broadcast)
* @default error Le scénario donné n'a pas été listé
* @returns True si l'incident a été appliqué
* @type {boolean}
*/


exports.applyIncident = async function(det, cmd, usr, wss){
    let intervalId=false
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


    switch(det){
        case 'L':
            break;
        case 'S':
            break;
        case 'T':
            if(cmd==='btnDefEcl'){
                let panne = new incident('Défaut Éclairage',usr, wss, exports.getRandomTrain(), 'train')
                panne.publish()
                apiSave()
                await setTimeout(2000)
                panne.setActive()
                tInfo=panne.target
                let trainObj = pccApi.SEC[tInfo.sIndex].cantons[tInfo.cIndex].trains[tInfo.tIndex]
                trainObj.states.trainLights=2
                apiSave()
            } else if (cmd==='btnDefPVOuv'){
                let panne = new incident('Ouv. PV défectueuse',usr, wss, exports.getRandomTrain(), 'train')
                panne.publish()
                apiSave()
                tInfo=panne.target
                let trainObj = pccApi.SEC[tInfo.sIndex].cantons[tInfo.cIndex].trains[tInfo.tIndex]
                async function changeCallback() {
                    if (trainObj.states.cmdOuvPortesTrain===true) {
                        clearInterval(intervalId)
                        await setTimeout(1200)
                        panne.setActive()
                        let chance=Math.floor(Math.random()*2)
                        if(chance===0){
                            trainObj.states.defPartOuvPV=2
                            trainObj.states.defTech=2
                        } else if (chance===1){
                            trainObj.states.defTotOuvPV=2
                            trainObj.states.doorsOpenedPV=false
                            trainObj.states.defTech=2
                        }
                        apiSave()
                    }
                }
                intervalId=setInterval(changeCallback, 10)
            } else if (cmd==='btnPneuCreve'){
                let panne = new incident('Pneu crevé',usr, wss, exports.getRandomTrain(), 'train')
                panne.publish()
                apiSave()
                await setTimeout(2000)
                panne.setActive()
                tInfo=panne.target
                let trainObj = pccApi.SEC[tInfo.sIndex].cantons[tInfo.cIndex].trains[tInfo.tIndex]
                let chance=Math.floor(Math.random()*2)
                if(chance===0){
                    trainObj.states.trainDefGuideWheels=2
                    trainObj.states.blockedTrain=2
                } else if (chance===1){
                    trainObj.states.trainDefSupportWheels=2
                    trainObj.states.blockedTrain=2
                }
                apiSave()
                async function changeCallback() {
                    if (trainObj.states.speed===0) {
                        clearInterval(intervalId)
                        await setTimeout(100)
                        trainObj.states.activeFI=true
                        trainObj.states.v0pas=2
                        trainObj.states.v0pas=2
                        apiSave()
                    }
                }
                intervalId=setInterval(changeCallback, 10)
            }
            break;
        case 'P':
            break;
        case 'V':
            break;
        default:
            logger.error('Erreur déterminant invalide -> '+det)
            return false
    }
}

class incident{
    constructor(name, user, wss, target, type){
        console.log(target)
        this.name = name
        this.user = user.uname
        this.date = new Date()
        this.time = this.date.getTime()
        this.id = pccApi.events.length+1
        this.dateString = this.date.getDate() + '/' + (this.date.getMonth()+1) + '/' + this.date.getFullYear() + ', ' + this.date.getHours() + 'h' + this.date.getMinutes()
        this.wss = wss
        this.target = target
        this.type = type
    }

    async publish() {
        pccApi.events.push({
            id: this.id, 
            name: this.name, 
            user: this.user, 
            date: this.dateString,
            now: this.time,
            state: 'En attente',
            showState: 1,
            target: this.target,
            targetType: this.type
        })
        logger.info('[GSA] Publication de l\'évennement '+this.name+' d\'ID '+this.id+'.')
        return true;
    }

    setActive() {
        let originalObj = pccApi.events[this.index]
        console.log(originalObj)
        originalObj.state='En cours'
        originalObj.showState=true
    }

    indexResearch(exactDate){
        for(let ev in pccApi.events){
            if(!(pccApi.events[ev].now === exactDate)) continue;
            return ev;
        }
    }

    get index() {
        return this.indexResearch(this.time)
    }

    get ttarget() {
        return this.target
    }
}

/**
* Remet à zéro l'incident commandé au préalable
* @param event Utilisateur ayant émis la commande (déterminé par la Map)
* @param wss WebSeocket actif (permet de broadcast)
* @param evid ID de l'évennement, vérification
* @default false Rien n'a été effectué car pas listé.
* @returns True si l'incident a été remis à zéro
* @type {boolean}
*/

exports.cancelIncident=async function(event, wss, evid){
    let intervalId=false
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


    if(!(event.id === evid)) {
        logger.error('[GSA] Tentative de RAZ d\'évennement abandonnée -> ID incorecte')
        return false;
    }
    switch(event.name){
        case 'Défaut Éclairage':
            logger.info('[GSA] RAZ de l\'évennement '+event.name+' d\'ID '+event.id+'.')
            var target=event.target
            var trainObj = pccApi.SEC[parseInt(target.sIndex)].cantons[parseInt(target.cIndex)].trains[parseInt(target.tIndex)]
            trainObj.states.trainLights=false
            apiSave()
            await setTimeout(2000)
            event.showState=false
            trainObj.states.trainLights=true
            event.state='Terminé'
            apiSave()
            break;
        case 'Ouv. PV défectueuse':
            logger.info('[GSA] RAZ de l\'évennement '+event.name+' d\'ID '+event.id+'.')
            var target=event.target
            var trainObj = pccApi.SEC[parseInt(target.sIndex)].cantons[parseInt(target.cIndex)].trains[parseInt(target.tIndex)]
            function changeCallback() {
                if (trainObj.states.cmdOuvPortesTrain===false) {
                    clearInterval(intervalId)
                    trainObj.states.defTotOuvPV=false
                    trainObj.states.doorsOpenedPV=false
                    trainObj.states.defTech=false
                    trainObj.states.defPartOuvPV=false
                    event.showState=false
                    event.state='Terminé'
                    apiSave()
                }
            }
            intervalId=setInterval(changeCallback, 500)
            break;
        case 'Pneu crevé':
            logger.info('[GSA] RAZ de l\'évennement '+event.name+' d\'ID '+event.id+'.')
            var target=event.target
            var trainObj = pccApi.SEC[parseInt(target.sIndex)].cantons[parseInt(target.cIndex)].trains[parseInt(target.tIndex)]
            trainObj.states.trainDefSupportWheels=false
            trainObj.states.trainDefGuideWheels=false
            trainObj.states.v0pas=false
            trainObj.states.blockedTrain=false
            apiSave()
            await setTimeout(2000)
            event.showState=false
            event.state='Terminé'
            apiSave()
            break;
    }
    return true;
}
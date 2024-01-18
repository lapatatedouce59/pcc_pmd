const ws = require('./ws')

const pccApi = require('./server.json')

const fs = require('fs')
const writter = require("./writter");

/**
* @description Permet de gérer les détections positives
* @param tid (train id) ID du train qui doit être déplacé
* @param dp (détecteur positif) Nom de la boucle de détection positive (cid)
* @param value valeur du détecteur positif (bool)
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response" }
* @type {object}
*/

let DPtoggle = async(tid, dp, value)=>{
    if(!(tid)||!(dp)||!(value)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The train ID or detection loop or value have'nt been sent to the function. Please refer to the documentation." })
    try{
        let res = ws.dpManage(tid,dp,value)
        if(res===true) return JSON.stringify({ code: 202, verbose: "Accepted", message: "Train movement have been sucessfully initialised." })
        if(res===false) return JSON.stringify({ code: 500, verbose: "Internal Server Error", message: `Some error occured, maybe loop you specified don't exist.` })
    } catch (error){
        return JSON.stringify({ code: 500, verbose: "Internal Server Error", message: `The following error occured: ${error}` })
    }
}

/**
* @description Permet de récupérer l'object d'itinéraire
* @param code (code d'itinéraire) Si le mode est "online", spécifier le code de l'itinéraire à vérifier.
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

let itiInf = (code)=>{
    if(!(code)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The path code is'nt specified. Please refer to the documentation." })
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    return JSON.stringify({ code: 200, verbose: "OK", message: "Path object you asked for.", response:iti })
                } else continue;
            }
        }
    }
    return JSON.stringify({ code: 404, verbose: "Not Found", message: "The path code provided does'nt corresponds to any valid path. Please look at server's saves to view valid path codes."})
}


/**
* @description Permet de récupérer l'object de cantons
* @param code (code d'itinéraire) Si le mode est "online", spécifier le code de l'itinéraire à vérifier.
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

let ctnInf = (cid)=>{
    if(!(cid)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The block code is'nt specified. Please refer to the documentation." })
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return JSON.stringify({ code: 200, verbose: "OK", message: "Block object you asked for.", response:ctn });
        }
    }
    return JSON.stringify({ code: 404, verbose: "Not Found", message: "The block code provided does'nt corresponds to any valid block. Please look at server's saves to view valid block codes."})
}

/**
* @description Change les états d'un train ou d'une station
* @param element (train ou station) L'élement concerné par le changement
* @param id (identifiant d'élement) L'identifiant "littéral" de l'élement (nom de la station, n° du train...)
* @param state (état d'élement à changer) L'état de l'élément à changer.
* @param value (nouvelle valeur) La valeur de l'élement à remplacer (true, false ou 2)
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

let changeElementState = (element, id, state, value, force)=>{
    if(!(element)||!(id)||!(state))  return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function parametters are missing. Please refer to the documentation." })
    if(!(value===true||value===false||value===2)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The value of the element state is invalid. Please refer to the documentation." })
    if(element==='station'){
        let errResponse = []
        let errResponse2= []
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                if(!(ctn.name)) continue;
                errResponse.push( {id: ctn.name, ctn: ctn.cid, sec: sec.id} )
                if(!(ctn.name===id)) continue;
                for(let state of Object.entries(ctn.states)){
                    errResponse2.push(state[0])
                    if(!(state[0]===state)) continue;
                    if(state[0]==='coupFs'||state[0]==='pdp'||state[0]==='ldi'||state[0]==='tcs'||state[0]==='pzo'||state[0]==='selAcc') return JSON.stringify({ code: 423, verbose: "Locked", message: "While the state provided is valid, you don't have the permission to change it directly. Call the function triggerSpecialAction() or refer to the documentation.", reponse: errResponse2})
                    let formerState = state[1]
                    ctn.states[state[0]] = value
                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    ws.apiSave()
                    let litteralValue = false
                    let prio = false
                    if(value===true) {
                        litteralValue='OUI'
                        prio = 1
                    }
                    if(value===false) {
                        litteralValue='NON'
                        prio = 1
                    }
                    if(value===2) {
                        litteralValue='OUI'
                        prio = 3
                    }
                    writter.simple(`${litteralValue}`,'EAS', `${state}`,prio)
                    return JSON.stringify({ code: 200, verbose: "OK", message: `The element ${state[0]} have been successfully changed from ${formerState} to ${value}.`})
                }
                return JSON.stringify({ code: 404, verbose: "Not Found", message: "The state provided does'nt corresponds to any valid element state. Here is a list of valid states.", reponse: errResponse2})
            }
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The station name provided does'nt corresponds to any valid station. Here is a list of valid station names.", reponse: errResponse})
    } else if (element==='train'){
        let errResponse = []
        let errResponse2= []
        for(let train of Object.entries(pccApi.trains)){
            errResponse.push( {id: train[0]} )
            if(!(train[0]===id)) continue;
            for(let tstate of Object.entries(train[1].states)){
                errResponse2.push(state[0])
                //console.log(`${state}=${tstate[0]}?${state===tstate[0]}`)
                if(!(tstate[0]===state)) continue;
                if(tstate[0]==='trainSOS' && !(force)) return JSON.stringify({ code: 423, verbose: "Locked", message: "While the state provided is valid, you don't have the permission to change it directly. Call the function triggerSpecialAction() or refer to the documentation.", reponse: errResponse2})
                let formerState = tstate[1]
                pccApi.trains[train[0]].states[tstate[0]] = value
                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                ws.apiSave()
                let litteralValue = false
                let prio = false
                if(value===true) {
                    litteralValue='OUI'
                    prio = 1
                }
                if(value===false) {
                    litteralValue='NON'
                    prio = 1
                }
                if(value===2) {
                    litteralValue='OUI'
                    prio = 3
                }
                writter.simple(`${litteralValue} (${train[0]})`,'TRAIN', `${state}`,prio)
                return JSON.stringify({ code: 200, verbose: "OK", message: `The element ${tstate[0]} have been successfully changed from ${formerState} to ${value}.`})
            }
            return JSON.stringify({ code: 404, verbose: "Not Found", message: "The state provided does'nt corresponds to any valid element state. Here is a list of valid states.", reponse: errResponse2})
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The train id provided does'nt corresponds to any valid train. Here is a list of valid train identifiers.", reponse: errResponse})
    } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The element provided is invalid. Please refer to the documentation." })
}


/**
* @description Déclanche un évenement spécial sur un élement
* @param element (train ou station) L'élement concerné par le changement
* @param id (identifiant d'élement) L'identifiant "littéral" de l'élement (nom de la station, n° du train...)
* @param event (évennement) L'évenement à déclancher
* @param args Object contenant les informations relatives à l'évennement à déclancher.
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

let triggerSpecialAction=(element, id, event, args)=>{
    if(!(element)||!(id)||!(event)||!(args))  return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function parametters are missing. Please refer to the documentation." })
    if(!(typeof args === 'object')) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The args parametter is not an Object. Please refer to the documentation." })
    if(element==='train'){
        let errResponse = []
        for(let train of Object.entries(pccApi.trains)){
            errResponse.push( {id: train[0]} )
            if(!(train[0]===id)) continue;
            if(event==='emCall'){
                if(!(args.caller)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the event args is not provided. Please refer to the documentation." })
                let trainPos = whereIsTrain(train[0])[0]
                pccApi.emCalls.push({ caller: args.caller, ctn: trainPos, trid: train[0], active: 2})
                console.log(exports.changeElementState('train', train[0], 'trainSOS', 2, true))
                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                writter.simple('DÉCLANCHÉ.','PCC', `APPEL DÉTRESSE DE ${pccApi.emCalls[0].trid} PAR ${pccApi.emCalls[0].caller} A ${pccApi.emCalls[0].ctn}`,3)
                ws.apiSave()
                return JSON.stringify({ code: 200, verbose: "OK", message: `Event ${event} started for ${element} ${id}.`})
            } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The event type provided is invalid. Please refer to the documentation." })
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The train id provided does'nt corresponds to any valid train. Here is a list of valid train identifiers.", reponse: errResponse})
    } else if (element==='station'){
        return JSON.stringify({ code: 501, verbose: "Not Implemented", message: "While your request is valid, no functions are presents with this element." })
    }
}
let whereIsTrain = (tid)=>{
    let resp = []
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            for(let tids of ctn.trains){
                if(tids.includes(tid)) resp.push(ctn.cid)
            }
        }
    }
    return resp;
}

/**
* @description Permet de gérer les trains
* @param mode (spawn ou remove) L'opération a effectuer
* @param id (identifiant d'élement) L'identifiant du train
* @param args Les arguments annexes de la fonction
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

let manageTrains=(mode, id, args)=>{
    if(!(mode)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The function mode have'nt been specified. Please refer to the documentation." })
    
    if(mode==='spawn'){
        if(!(typeof args === 'object')) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The args parametter is not an Object. Please refer to the documentation." })
        if(!(args.initial)||!(id)||!(args.owner)||!(args.type)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function args is not provided. Please refer to the documentation." })
        if(pccApi.trains[id]) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The train you are trying to spawn already exist on the map. Did you mean to remove it instead?" })
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                let availableCtn = ['cGPAG1','c1101','c1201','c2501']
                if(availableCtn.includes(ctn.cid)&&ctn.trains.length===0){
                    let train = new Train(ctn, args.owner, args.initial, args.type, id)
                    train.spawn()
                    writter.simple(`${id}, ${ctn.cid}`,'GAME', `SPAWN`,2)
                    return JSON.stringify({ code: 200, verbose: "OK", message: `The train ${id} is successfully on the map.`})
                }
            }
        }
        return JSON.stringify({ code: 500, verbose: "Internal Server Error", message: `Something went wrong. It is maybe because all of the available spawn blocks are occupied. Please retry later.`})
    } else if (mode==='remove'){
        let errResponse = []
        for(let train of Object.entries(pccApi.trains)){
            errResponse.push( {id: train[0]} )
            if(!(train[0]===id)) continue;
            let availableCtn = ['cGPAG1','c1101','c1201','c2501']
            let trainPos = whereIsTrain(train[0])
            let ctnInvalid = []
            for(let ctnPos of trainPos){
                if(availableCtn.includes(ctnPos)) continue;
                ctnInvalid.push(ctnPos)
            }
            if(ctnInvalid.length===0){
                for(let ctnPos of trainPos){
                    ctnInfo(ctnPos).trains.splice(ctnInfo(ctnPos).trains.indexOf(train[0]))
                }
                delete pccApi.trains[train[0]]
                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                ws.apiSave()
                writter.simple(`${id}, ${trainPos[0]}`,'GAME', `DELETE`,2)
                return JSON.stringify({ code: 200, verbose: "OK", message: `The train ${id} is successfully deleted from the map.`})
            } else return JSON.stringify({ code: 403, verbose: "Forbidden", message: `You tried to delete a train without it beeing in a garage zone (${ctnInvalid.length} block(s) are invalid(s)). Here is a list a valid cantons.`, reponse: availableCtn})
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The train id provided does'nt corresponds to any valid train. Here is a list of valid train identifiers.", reponse: errResponse})
    } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The function mode provided is invalid. Please refer to the documentation." })
}

class Train {
    constructor(ctn, owner, mode, type, id) {
        this.ctn = ctn
        this.owner = owner
        this.mode = mode
        this.type = type
        this.id = id
    }

    spawn(){
        if(this.mode==='set'){
            this.ctn.trains.push(this.id)
            pccApi.trains[this.id] = {
                "tid": `${this.id}`,
                "owner": this.owner,
                "trainType": this.type,
                "states": {
                    "doorsOpenedPV": false,
                    "doorsClosedPV": false,
                    "inZOPP": false,
                    "failedStop": false,
                    "secureStop": false,
                    "trainEssai": false,
                    "trainIOP": false,
                    "forbiddenStart": false,
                    "trainEvac": false,
                    "trainEmCall": false,
                    "lsvDef": false,
                    "blockDef": false,
                    "defCdeOuvPV": false,
                    "defCdeFerPV": false,
                    "obstalceActive": false,
                    "longTrain": false,
                    "trainSecurised": false,
                    "TMSActive": true,
                    "EVACActive": false,
                    "defTech": false,
                    "defLtpa": false,
                    "tneHorsZGAT": false,
                    "fuKSEPO": false,
                    "fuSurvitesse": false,
                    "fuDiscMob": false,
                    "fuVacma": false,
                    "fuKPAMN": false,
                    "fuPil": false,
                    "fuObsColl": false,
                    "fuNoFS": false,
                    "fuRuptAtt": false,
                    "testAuto": false,
                    "defCvs": false,
                    "trainBattery": false,
                    "btDelest": false,
                    "defDistBt": false,
                    "defPart750": false,
                    "abs750": false,
                    "trainPAT": false,
                    "defPartOuvPV": false,
                    "defTotOuvPV": false,
                    "trainInscrit": false,
                    "evacUitp": false,
                    "IOP": true,
                    "nullSpeed": true,
                    "selOuvDroite": false,
                    "selOuvGauche": false,
                    "blockedTrain": false,
                    "defDCA": false,
                    "cmdOuvPortesTrain": false,
                    "opl": false,
                    "lvsTrain": false,
                    "seqDemTrain": false,
                    "asmd": false,
                    "v0pas": false,
                    "cmdFu": false,
                    "fsOk": true,
                    "fuFranch": false,
                    "inhibedCycleSeq": false,
                    "autoIti": false,
                    "defAppSeq": false,
                    "activeMission": false,
                    "waitingMission": true,
                    "defExeMission": false,
                    "canceledMission": false,
                    "autorisedTrain": false,
                    "fsForce": false,
                    "execAcc": false,
                    "accosting": false,
                    "endAcc": false,
                    "prodPert": false,
                    "modeDegr": false,
                    "trainLights": true,
                    "trainHeating": true,
                    "trainFans": false,
                    "trainSmoke": false,
                    "trainEstinguisher": false,
                    "trainTempBrakes": false,
                    "trainComp": true,
                    "trainSusp": false,
                    "trainKSA": false,
                    "trainDefSupportWheels": false,
                    "trainDefGuideWheels": false,
                    "trainFrott": true,
                    "autoTrain": true,
                    "manuTrain": false,
                    "doubleTrain": false,
                    "trainSOS": false,
                    "trainPilot": true,
                    "defSynthVoc": false,
                    "reguTrain": false,
                    "defLectBal": false,
                    "defKIBS": false,
                    "tractionS1": false,
                    "tractionS2": false,
                    "cmdTraction": true,
                    "activeOnduls": true,
                    "avarieOnduls": false,
                    "patEnr": false,
                    "neutralKDJ": false,
                    "alaVigil": false,
                    "activeFU": false,
                    "activeFI": false,
                    "defFN": false,
                    "defFU": false,
                    "permBrake": false,
                    "activeFMS": false,
                    "vitModifTrain": false,
                    "vitModifSta": false,
                    "vitModifPAS": false,
                    "cmd08ms": false,
                    "waitLectBal": false,
                    "cmd0ms": false,
                    "cmd5ms": false,
                    "defTelec": false,
                    "cmd10ms": false,
                    "survTelec": false,
                    "forbCommand": false,
                    "awakeMR": true,
                    "pretTrain": true,
                    "defEveil": false,
                    "deprepTrain": false,
                    "defEndorm": false,
                    "defDeprep": false,
                    "echecPrep": false,
                    "refusDeprep": false,
                    "validTests": true,
                    "echecTestFU": false,
                    "activeTests": false,
                    "unvalidTest": false,
                    "speed": 0,
                    "mission": false,
                    "cptFu": 0
                }
            }
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            ws.apiSave()
        } else if (this.mode==='unset'){
            this.ctn.trains.push(this.id)
            pccApi.trains[this.id] = {
                "tid": `${this.id}`,
                "owner": this.owner,
                "trainType": this.type,
                "states": {
                    "doorsOpenedPV": false,
                    "doorsClosedPV": false,
                    "inZOPP": false,
                    "failedStop": false,
                    "secureStop": false,
                    "trainEssai": false,
                    "trainIOP": false,
                    "forbiddenStart": false,
                    "trainEvac": false,
                    "trainEmCall": false,
                    "lsvDef": false,
                    "blockDef": false,
                    "defCdeOuvPV": false,
                    "defCdeFerPV": false,
                    "obstalceActive": false,
                    "longTrain": false,
                    "trainSecurised": false,
                    "TMSActive": true,
                    "EVACActive": false,
                    "defTech": false,
                    "defLtpa": false,
                    "tneHorsZGAT": false,
                    "fuKSEPO": false,
                    "fuSurvitesse": false,
                    "fuDiscMob": false,
                    "fuVacma": false,
                    "fuKPAMN": false,
                    "fuPil": 1,
                    "fuObsColl": false,
                    "fuNoFS": false,
                    "fuRuptAtt": false,
                    "testAuto": false,
                    "defCvs": false,
                    "trainBattery": 1,
                    "btDelest": 1,
                    "defDistBt": false,
                    "defPart750": false,
                    "abs750": 1,
                    "trainPAT": false,
                    "defPartOuvPV": false,
                    "defTotOuvPV": false,
                    "trainInscrit": false,
                    "evacUitp": false,
                    "IOP": true,
                    "nullSpeed": true,
                    "selOuvDroite": false,
                    "selOuvGauche": false,
                    "blockedTrain": false,
                    "defDCA": false,
                    "cmdOuvPortesTrain": false,
                    "opl": false,
                    "lvsTrain": false,
                    "seqDemTrain": false,
                    "asmd": false,
                    "v0pas": 1,
                    "cmdFu": false,
                    "fsOk": 1,
                    "fuFranch": false,
                    "inhibedCycleSeq": false,
                    "autoIti": false,
                    "defAppSeq": false,
                    "activeMission": false,
                    "waitingMission": false,
                    "defExeMission": false,
                    "canceledMission": false,
                    "autorisedTrain": false,
                    "fsForce": false,
                    "execAcc": false,
                    "accosting": false,
                    "endAcc": false,
                    "prodPert": false,
                    "modeDegr": false,
                    "trainLights": false,
                    "trainHeating": false,
                    "trainFans": false,
                    "trainSmoke": false,
                    "trainEstinguisher": false,
                    "trainTempBrakes": false,
                    "trainComp": false,
                    "trainSusp": false,
                    "trainKSA": false,
                    "trainDefSupportWheels": false,
                    "trainDefGuideWheels": false,
                    "trainFrott": false,
                    "autoTrain": false,
                    "manuTrain": false,
                    "doubleTrain": false,
                    "trainSOS": false,
                    "trainPilot": false,
                    "defSynthVoc": false,
                    "reguTrain": false,
                    "defLectBal": false,
                    "defKIBS": false,
                    "tractionS1": false,
                    "tractionS2": false,
                    "cmdTraction": false,
                    "activeOnduls": false,
                    "avarieOnduls": false,
                    "patEnr": false,
                    "neutralKDJ": false,
                    "alaVigil": false,
                    "activeFU": false,
                    "activeFI": true,
                    "defFN": false,
                    "defFU": false,
                    "permBrake": true,
                    "activeFMS": false,
                    "vitModifTrain": false,
                    "vitModifSta": false,
                    "vitModifPAS": false,
                    "cmd08ms": false,
                    "waitLectBal": false,
                    "cmd0ms": false,
                    "cmd5ms": false,
                    "defTelec": false,
                    "cmd10ms": false,
                    "survTelec": false,
                    "forbCommand": false,
                    "awakeMR": true,
                    "pretTrain": false,
                    "defEveil": false,
                    "deprepTrain": false,
                    "defEndorm": false,
                    "defDeprep": false,
                    "echecPrep": false,
                    "refusDeprep": false,
                    "validTests": false,
                    "echecTestFU": false,
                    "activeTests": false,
                    "unvalidTest": true,
                    "speed": 0,
                    "mission": false,
                    "cptFu": 0
                }
            }
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            ws.apiSave()
        }
    }
}

module.exports = { ctnInf, manageTrains, DPtoggle, itiInf, changeElementState, triggerSpecialAction,  }

let ctnInfo = (cid)=>{
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return ctn;
        }
    }
}
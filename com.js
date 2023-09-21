const ws = require('./ws')

const pccApi = require('./server.json')

const fs = require('fs')

/**
* @description Déplace un train d'un canton à un autre
* @param tid (train id) ID du train qui doit être déplacé
* @param sens (sens de marche) Sens de circulation du train (1 ou 2)
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response" }
* @type {object}
*/

exports.moveTrain = async(tid, sens)=>{
    if(!(tid)||!(sens)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The train ID or direction of the specified train have'nt been sent to the function. Please refer to the documentation." })
    if(typeof sens !== "number") return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The train direction is'nt a valid number (parsed int)." })
    try{
        ws.MH(tid, sens)
        return JSON.stringify({ code: 202, verbose: "Accepted", message: "Train movement have been sucessfully initialised." })
    } catch (error){
        return JSON.stringify({ code: 500, verbose: "Internal Server Error", message: `The following error occured: ${error}` })
    }
}

/**
* @description Gère les itinéraires (get)
* @param mode (mode d'appel) Si le mode est "list", la fonction retournera la liste des itinéraires de la ligne. Si le mode est sur "online", la fonction retournera true si l'itinéraire spécifié est actif.
* @param code (code d'itinéraire) Si le mode est "online", spécifier le code de l'itinéraire à vérifier.
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

exports.itiInfos = async(mode, code)=>{
    if(!(mode)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The function mode have'nt been specified. Please refer to the documentation." })
    if(mode==='list'){
        let response = []
        for(let sec of pccApi.SEC){
            for(let itil of Object.entries(sec.ITI[0])){
                for(let iti of itil[1]){
                    response.push({ code: iti.code, active: iti.active, section: sec.id })
                }
            }
        }
        return JSON.stringify({ code: 200, verbose: "OK", message: "There is the array of the line.", response: response})
    } else if (mode==='online'){
        if(!(code)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The function mode is set to 'online' but no code have been provided. Please refer to the documentation." })
        for(let sec of pccApi.SEC){
            for(let itil of Object.entries(sec.ITI[0])){
                for(let iti of itil[1]){
                    if(!(iti.code===code)) continue;
                    return JSON.stringify({ code: 200, verbose: "OK", message: "There is the provided itinerary status.", response: iti.active})
                }
            }
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The itinerary code provided does'nt corresponds to any valid itinerary. Please use the list mode to see a list of valid itinerary codes."})
    } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The mode provided is invalid. Please refer to the documentation." })
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

exports.changeElementState = (element, id, state, value)=>{
    if(!(element)||!(id)||!(state)||!(value))  return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function parametters are missing. Please refer to the documentation." })
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
                    return JSON.stringify({ code: 200, verbose: "OK", message: `The element ${state[0]} have been successfully changed from ${formerState} to ${value}.`})
                }
                return JSON.stringify({ code: 404, verbose: "Not Found", message: "The state provided does'nt corresponds to any valid element state. Here is a list of valid states.", reponse: errResponse2})
            }
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The station name provided does'nt corresponds to any valid station. Here is a list of valid station names.", reponse: errResponse})
    } else if (element==='train'){
        let errResponse = []
        let errResponse2= []
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                if(!(ctn.trains.length>0)) continue;
                for(let train of ctn.trains){
                    errResponse.push( {id: train.tid, ctn: ctn.cid, sec: sec.id} )
                    if(!(train.tid===id)) continue;
                    for(let state of Object.entries(train.states)){
                        errResponse2.push(state[0])
                        if(!(state[0]===state)) continue;
                        if(state[0]==='trainSOS') return JSON.stringify({ code: 423, verbose: "Locked", message: "While the state provided is valid, you don't have the permission to change it directly. Call the function triggerSpecialAction() or refer to the documentation.", reponse: errResponse2})
                        let formerState = state[1]
                        train.states[state[0]] = value
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        ws.apiSave()
                        return JSON.stringify({ code: 200, verbose: "OK", message: `The element ${state[0]} have been successfully changed from ${formerState} to ${value}.`})
                    }
                    return JSON.stringify({ code: 404, verbose: "Not Found", message: "The state provided does'nt corresponds to any valid element state. Here is a list of valid states.", reponse: errResponse2})
                }
            }
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

exports.triggerSpecialAction=(element, id, event, args)=>{
    if(!(element)||!(id)||!(event)||!(args))  return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function parametters are missing. Please refer to the documentation." })
    if(!(typeof args === 'object')) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The args parametter is not an Object. Please refer to the documentation." })
    if(element==='train'){
        let errResponse = []
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                if(!(ctn.trains.length>0)) continue;
                for(let train of ctn.trains){
                    errResponse.push( {id: train.tid, ctn: ctn.cid, sec: sec.id} )
                    if(!(train.tid===id)) continue;
                    if(event==='emCall'){
                        if(!(args.caller)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the event args is not provided. Please refer to the documentation." })
                        pccApi.emCalls.push({ caller: args.caller, ctn: ctn.cid, trid: train.tid, active: 2})
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        ws.apiSave()
                        return JSON.stringify({ code: 200, verbose: "OK", message: `Event ${event} started for ${element} ${id}.`})
                    } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The event type provided is invalid. Please refer to the documentation." })
                }
            }
        }
        return JSON.stringify({ code: 404, verbose: "Not Found", message: "The train id provided does'nt corresponds to any valid train. Here is a list of valid train identifiers.", reponse: errResponse})
    } else if (element==='station'){
        return JSON.stringify({ code: 501, verbose: "Not Implemented", message: "The element specified is valid, but no functions are usable for now. Please refer to the repos's changelog." })
    } else return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The element provided is invalid. Please refer to the documentation." })
}

/**
* @description Déclanche un évenement spécial sur un élement
* @param mode (spawn ou remove) L'opération a effectuer
* @param id (identifiant d'élement) L'identifiant "littéral" de l'élement (nom de la station, n° du train...)
* @param args Les arguments annexes de la fonction
* @returns { code: "HTTP Code", verbose: "HTTP Message", message: "Action response", response: array or boolean }
* @type {object}
*/

exports.manageTrains=(mode, id, args)=>{
    if(!(mode)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The function mode have'nt been specified. Please refer to the documentation." })
    if(!(typeof args === 'object')) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "The args parametter is not an Object. Please refer to the documentation." })
    if(mode==='spawn'){
        if(!(args.initial)||!(id)||!(args.owner)||!(args.type)) return JSON.stringify({ code: 400, verbose: "Bad Request", message: "At least one of the function args is not provided. Please refer to the documentation." })
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                let availableCtn = ['cGPAG1','c1101','c1201','c1501']
                for(let actn of availableCtn){
                    if(availableCtn.includes(ctn.cid)&&ctn.trains.length===0){
                        let train = new Train(ctn, args.owner, args.initial, args.type, id)
                        train.spawn()
                        return JSON.stringify({ code: 200, verbose: "OK", message: `The train ${id} is successfully on the map.`})
                    }
                }
            }
        }
    } else if (mode==='remove'){
        let errResponse = []
        for(let sec of pccApi.SEC){
            for(let ctn of sec.cantons){
                if(!(ctn.trains.length>0)) continue;
                for(let train of ctn.trains){
                    errResponse.push( {id: train.tid, ctn: ctn.cid, sec: sec.id} )
                    if(!(train.tid===id)) continue;
                    let availableCtn = ['cGPAG1','c1101','c1201','c1501']
                    if(availableCtn.includes(ctn.cid)){
                        ctn.trains.shift()
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        ws.apiSave()
                        return JSON.stringify({ code: 200, verbose: "OK", message: `The train ${id} is successfully deleted from the map.`})
                    } else return JSON.stringify({ code: 403, verbose: "Forbidden", message: "You tried to delete a train without it beeing in a garage zone. Here is a list a valid cantons.", reponse: availableCtn})
                }
            }
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
            this.ctn.trains.push({
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
                    "neutralManip": false,
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
            })
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            ws.apiSave()
        } else if (this.mode==='unset'){
            this.ctn.trains.push({
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
                    "neutralManip": false,
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
            })
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            ws.apiSave()
        }
    }
}
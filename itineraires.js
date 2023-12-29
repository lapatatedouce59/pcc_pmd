/**
 * Module de gestion des itinéraires
 * @module itineraires
 */

let pccApi = require('./server.json')

const logger = require('./logger')
let parent = require('./ws')
const writter = require("./writter");
const {setTimeout} = require('timers/promises')
const ovse = require('./OVSE');
const fs = require('fs')



let INTERVALS = []

exports.SEL=async(code)=>{
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    let itiParts = iti.code.split('_')
                    iti.mode='SEL'
                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    parent.apiSave()
                    writter.simple('SÉLECTIONNÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                    await setTimeout(1000)
                    if(ovse.isItiAnAigOne(iti.code)){
                        let onDesIti = []
                        for(let itiListOfAig of pccApi.aigItis[ovse.isItiAnAigOne(iti.code)]){
                            if(itiInf(itiListOfAig).mode==='DES') onDesIti.push(itiListOfAig)
                        }
                        if(onDesIti.length>0){
                            let desselInter = setInterval(()=>{
                                if(itiInf(onDesIti[0]).active===false&&itiInf(onDesIti[0]).mode===false){
                                    clearInterval(desselInter)
                                    INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
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
                                    parent.apiSave()
                                    writter.simple('FORMÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                                }
                            },250)
                            INTERVALS.push(desselInter)
                        } else {
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
                            parent.apiSave()
                            writter.simple('FORMÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                        }
                    } else {
                        if(itiInf(`${itiParts[1]}_${itiParts[0]}`).mode==='DES') {
                            let desselInter = setInterval(()=>{
                                if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===false&&itiInf(`${itiParts[1]}_${itiParts[0]}`).mode===false){
                                    clearInterval(desselInter)
                                    INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                    iti.active=true
                                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                    parent.apiSave()
                                    writter.simple('FORMÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                                }
                            },250)
                            INTERVALS.push(desselInter)
                        } else {
                            iti.active=true
                            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            parent.apiSave()
                            writter.simple('FORMÉ.','PA', `ITINÉRAIRE ${iti.code}`)
                        }
                    }
                    return;
                } else continue;
            }
        }
    }
}

exports.DES=async(code)=>{
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    let itiParts = iti.code.split('_')
                    iti.mode='DES'
                    parent.apiSave()
                    writter.simple('EN DESTRUCTION.','PA', `ITINÉRAIRE ${iti.code}`)
                    await setTimeout(0)
                    let modifiedCtn = []
                    for(let itiPart of itiParts){
                        if(itiPart==='PAG1'){modifiedCtn.push(`cGPAG1`); continue;}
                        modifiedCtn.push(`c${itiPart}`)
                    }
                    if(ovse.isItiAnAigOne(code)){
                        let ctnParts = []
                        let ctnList = []
                        for(let itiAigPart of pccApi.itiDescription[code]){
                            let itiAigParts = itiAigPart.split('_')
                            for(let itiAigPartBis of itiAigParts){
                                if(!(ctnParts.includes(itiAigPartBis))) ctnParts.push(itiAigPartBis);
                            }
                        }
                        for(let ctnPart of ctnParts){
                            if(ctnPart==='PAG1'){ctnList.push(`cGPAG1`); continue;}
                            ctnList.push(`c${ctnPart}`)
                        }
                        ctnList.pop()
                        let desselInter = setInterval(()=>{
                            let liste_des_cantons = []
                            for(let ctn of ctnList){
                                if(ctnInf(ctn).trains.length>0) liste_des_cantons.push(ctnInf(ctn).cid)
                            }
                            if(liste_des_cantons.length===0){
                                clearInterval(desselInter)
                                INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
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
                                parent.apiSave()
                                writter.simple('DÉTRUIT.','PA', `ITINÉRAIRE ${iti.code}`)
                            }
                        },250)
                        INTERVALS.push(desselInter)
                    } else {
                        let desselInter = setInterval(()=>{
                            if(ctnInf(modifiedCtn[0]).trains.length===0){
                                clearInterval(desselInter)
                                INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                iti.mode=false
                                iti.active=false
                                parent.apiSave()
                                writter.simple('DÉTRUIT.','PA', `ITINÉRAIRE ${iti.code}`)
                            }
                        },250)
                        INTERVALS.push(desselInter)
                    }
                    return;
                } else continue;
            }
        }
    }
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

function ctnInf(cid){
    for(let sec of pccApi.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===cid)) continue;
            return ctn;
        }
    }
}
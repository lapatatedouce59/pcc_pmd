/**
 * Informatique de controle des itinéraires
 * @module IGI
 */

let pccApi = require('./server.json')

const logger = require('./logger')
let parent = require('./ws')
const writter = require("./writter");
const {setTimeout} = require('timers/promises')
const ovse = require('./OVSE');
const fs = require('fs')



let INTERVALS = []
let INTERMAP=new Map()


exports.SEL=async(code)=>{
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    let itiParts = iti.code.split('_')
                    clearCorrespondingInterval(code)
                    if(iti.mode==='DU') {
                        writter.simple(`ITINÉRAIRE ${iti.code} : DU ANNULÉE.`,'PA', `ICI`)
                        for(let aigIti of Object.entries(pccApi.aigItis)){
                            if (aigIti[1].includes(iti.code)) {
                                for(let aigGroup of pccApi.aiguilles){
                                    if(!(aigGroup.id===aigIti[0])) continue;
                                    aigGroup.actualIti.splice(aigGroup.actualIti.indexOf(iti.code),1)
                                }
                            }
                        }
                    }
                    if(iti.mode==='DES') {
                        writter.simple(`ITINÉRAIRE ${iti.code} : DES ANNULÉE.`,'PA', `ICI`)
                        for(let aigIti of Object.entries(pccApi.aigItis)){
                            if (aigIti[1].includes(iti.code)) {
                                for(let aigGroup of pccApi.aiguilles){
                                    if(!(aigGroup.id===aigIti[0])) continue;
                                    aigGroup.actualIti.splice(aigGroup.actualIti.indexOf(iti.code),1)
                                }
                            }
                        }
                    }
                    iti.mode='SEL'
                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    parent.apiSave()
                    writter.simple(`ITINÉRAIRE ${iti.code} SÉLECTIONNÉ.`,'PA', `ICI`)
                    await setTimeout(1000)
                    if(ovse.isItiAnAigOne(iti.code)){
                        let incompatibleIti = []
                        let onDesIti = []
                        for(let itiListOfAig of pccApi.aigItis[ovse.isItiAnAigOne(iti.code)]){
                            if(itiInf(itiListOfAig).mode==='DES'||itiInf(itiListOfAig).mode==='DU') onDesIti.push(itiListOfAig)
                            if(itiInf(itiListOfAig).mode==='SEL'&&itiInf(itiListOfAig).active===true) incompatibleIti.push(itiListOfAig)
                        }
                        if(incompatibleIti.length>0){
                            writter.simple(`INCOMPATIBILITÉ ${iti.code}.`,'PA', `ICI`)
                            let incompatibleInter = setInterval(()=>{
                                for(let itiListOfAig of pccApi.aigItis[ovse.isItiAnAigOne(iti.code)]){
                                    if(itiInf(itiListOfAig).mode==='DES'||itiInf(itiListOfAig).mode==='DU') onDesIti.push(itiListOfAig)
                                    if(itiInf(itiListOfAig).mode==='SEL'&&itiInf(itiListOfAig).active===true) incompatibleIti.push(itiListOfAig)
                                }
                                if(onDesIti.length>0) {
                                    clearInterval(incompatibleInter)
                                    INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                    writter.simple(`COMPATIBILITÉ ${iti.code} SUR DESTRUCTION PROGRAMMÉE ${onDesIti[0]}.`,'PA', `ICI`)
                                    return this.suiteOnDesCond()
                                }
                            },250)
                            INTERVALS.push(incompatibleInter)
                            INTERMAP.set(`${code}`,incompatibleInter)
                        }
                        this.suiteOnDesCond = async function (){
                            if(onDesIti.length>0){
                                let desselInter = setInterval(()=>{
                                    if(itiInf(onDesIti[0]).active===false&&itiInf(onDesIti[0]).mode===false){
                                        clearInterval(desselInter)
                                        INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                        clearCorrespondingInterval(code)
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
                                        writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`)
                                    }
                                },250)
                                INTERVALS.push(desselInter)
                                INTERMAP.set(`${code}`,desselInter)
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
                                writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`)
                            }
                        }
                        this.suiteOnDesCond()
                    } else {
                        if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===true&&itiInf(`${itiParts[1]}_${itiParts[0]}`).mode==='SEL') {
                            writter.simple(`INCOMPATIBILITÉ ${iti.code}.`,'PA', `ICI`)
                            let desselInter = setInterval(()=>{
                                if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===false){
                                    clearInterval(desselInter)
                                    INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                    clearCorrespondingInterval(code)
                                    iti.active=true
                                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                    parent.apiSave()
                                    writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`)
                                }
                            },250)
                            INTERVALS.push(desselInter)
                            INTERMAP.set(`${code}`,desselInter)
                        } else {
                            iti.active=true
                            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            parent.apiSave()
                            writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`)
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
                    clearCorrespondingInterval(code)
                    iti.mode='DES'
                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    parent.apiSave()
                    writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION.`,'PA', `ICI`)
                    await setTimeout(0)
                    if(iti.active===false){
                        iti.mode=false
                        writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`)
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                        return parent.apiSave();
                    }
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
                                clearCorrespondingInterval(code)
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
                                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                parent.apiSave()
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`)
                            }
                        },250)
                        INTERVALS.push(desselInter)
                        INTERMAP.set(`${code}`,desselInter)
                    } else {
                        let desselInter = setInterval(()=>{
                            if(ctnInf(modifiedCtn[0]).trains.length===0){
                                clearInterval(desselInter)
                                INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                clearCorrespondingInterval(code)
                                iti.mode=false
                                iti.active=false
                                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                parent.apiSave()
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`)
                            }
                        },250)
                        INTERVALS.push(desselInter)
                        INTERMAP.set(`${code}`,desselInter)
                    }
                    return;
                } else continue;
            }
        }
    }
}

exports.DU=async(code,inhib)=>{ 
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]){
                if(iti.code===code){
                    let itiParts = iti.code.split('_')
                    clearCorrespondingInterval(code)
                    iti.mode='DU'
                    if(inhib===false) parent.apiSave()
                    if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION D'URGENCE.`,'PA', `ICI`)
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
                        let liste_des_cantons = []
                        for(let ctn of ctnList){
                            if(ctnInf(ctn).trains.length>0) liste_des_cantons.push(ctnInf(ctn).cid)
                        }
                        if(liste_des_cantons.length===0){
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
                            if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION D'URGENCE.`,'PA', `ICI`)
                        } else {
                            writter.simple(`COUPURE SECURITAIRE ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'PA','ICI')
                            writter.simple(`OUI ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'UCA','COUPURE FS')
                            for(let trueCtn of ctnList){
                                let actualCtn = ovse.returnCtnIteration(trueCtn)
                                actualCtn.states.coupFs = 2
                            }
                            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            parent.apiSave()
                            await setTimeout(10000)
                            if(iti.mode==='DU'){
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D'URGENCE (APRES COUP FS).`,'PA', `ICI`)
                                for(let trueCtn of ctnList){
                                    let actualCtn = ovse.returnCtnIteration(trueCtn)
                                    actualCtn.states.coupFs = false
                                }
                                for(let aigIti of Object.entries(pccApi.aigItis)){
                                    if (aigIti[1].includes(iti.code)) {
                                        for(let aigGroup of pccApi.aiguilles){
                                            if(!(aigGroup.id===aigIti[0])) continue;
                                            aigGroup.actualIti.splice(aigGroup.actualIti.indexOf(iti.code),1)
                                        }
                                    }
                                }
                                writter.simple(`NON ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'UCA','COUPURE FS')
                                iti.mode=false
                                iti.active=false
                                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                parent.apiSave()
                            }
                        }
                    } else {
                        if(ctnInf(modifiedCtn[0]).trains.length===0&&ctnInf(modifiedCtn[1]).trains.length===0){
                            iti.mode=false
                            iti.active=false
                            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            if(inhib===false) parent.apiSave()
                            
                            if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D'URGENCE (INSTANTANE).`,'PA', `ICI`)
                        } else {
                            writter.simple(`OUI ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'UCA','COUPURE FS')
                            writter.simple(`COUPURE SECURITAIRE ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'PA','ICI')
                            ctnInf(modifiedCtn[0]).states.coupFs = 2
                            ctnInf(modifiedCtn[1]).states.coupFs = 2
                            if(inhib===false) fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            if(inhib===false) parent.apiSave()
                            await setTimeout(10000)
                            if(iti.mode==='DU'){
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D\'URGENCE (APRES COUP FS).`,'PA', `ICI`)
                                iti.mode=false
                                iti.active=false
                                ctnInf(modifiedCtn[0]).states.coupFs = false
                                ctnInf(modifiedCtn[1]).states.coupFs = false
                                writter.simple(`NON ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'UCA','COUPURE FS')
                                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                parent.apiSave()
                            }
                        }
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

function clearCorrespondingInterval(code){
    if(INTERMAP.has(code)){
        clearInterval(INTERMAP.get(code))
        INTERMAP.delete(code)
        console.log(`Successfully cleared (${code})'s interval.`)
        return true;
    }
    return false;
}
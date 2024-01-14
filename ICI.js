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
                        writter.simple(`ITINÉRAIRE ${iti.code} : DU ANNULÉE.`,'PA', `ICI`,1)
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
                        writter.simple(`ITINÉRAIRE ${iti.code} : DES ANNULÉE.`,'PA', `ICI`,1)
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
                    writter.simple(`ITINÉRAIRE ${iti.code} SÉLECTIONNÉ.`,'PA', `ICI`,1)
                    await setTimeout(1000)
                    if(ovse.isItiAnAigOne(iti.code)){

                        //! INIT FUNC, NOT RUNING FIRST!
                        let suiteOnDesCond = async function (){
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
                                        writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`,1)
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
                                writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`,1)
                            }
                        }


                        //! FUNC STARTS RUNNING HERE
                        let incompatibleIti = []
                        let onDesIti = []
                        for(let itiListOfAig of pccApi.aigItis[ovse.isItiAnAigOne(iti.code)]){
                            let tempItiParts = itiListOfAig.split('_')
                            if(itiInf(itiListOfAig).mode==='DES'||itiInf(itiListOfAig).mode==='DU'&&onDesIti.includes(itiListOfAig)===false) onDesIti.push(itiListOfAig)
                            if(itiInf(itiListOfAig).mode==='SEL'&&itiInf(itiListOfAig).active===true){ //un itinéraire de l'aiguille est actif
                                if(itiListOfAig===iti.code) continue; //si l'itinéraire s'est autodétecté ça dégage
                                if(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(itiListOfAig)&&!(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(iti.code))){ //si l'itinéraire n'est pas paralèle à celui en question
                                    incompatibleIti.push(itiListOfAig)
                                }
                                if(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(iti.code)&&!(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(itiListOfAig))){ //si l'itinéraire n'est pas paralèle à celui en question
                                    incompatibleIti.push(itiListOfAig)
                                }
                            }
                        }
                        if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===true) incompatibleIti.push(iti.code)
                        for(let itiL of itiList()){
                            if(!(itiL.active)) continue;
                            if(itiL.code===iti.code) continue;
                            let allitiparts = itiL.code.split('_')
                            if(itiParts[1]===allitiparts[1]){
                                incompatibleIti.push(itiL)
                                //console.log(`BASE ${iti.code} et TROUVE ${itiL.code} INCOMPATIBLES`)
                                writter.simple(`INCOMPATIBILITÉ NAN ${iti.code}.`,'PA', `ICI`,2)
                            }
                        }
                        if(incompatibleIti.length>0){
                            writter.simple(`${incompatibleIti.length} INCOMPATIBILITÉ(S) POUR ${iti.code}.`,'PA', `ICI`,2)
                            let incompatibleInter = setInterval(()=>{
                                onDesIti = []
                                incompatibleIti = []

                                //?    Détection d'itinéraires incompatibles sur aiguille

                                for(let itiListOfAig of pccApi.aigItis[ovse.isItiAnAigOne(iti.code)]){
                                    let tempItiParts = itiListOfAig.split('_')
                                    if(itiInf(itiListOfAig).mode==='DES'||itiInf(itiListOfAig).mode==='DU'&&onDesIti.includes(itiListOfAig)===false) onDesIti.push(itiListOfAig)
                                    if(itiInf(itiListOfAig).mode==='SEL'&&itiInf(itiListOfAig).active===true){ //un itinéraire de l'aiguille est actif
                                        if(itiListOfAig===iti.code) continue; //si l'itinéraire s'est autodétecté ça dégage
                                        if(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(itiListOfAig)&&!(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(iti.code))){ //si l'itinéraire n'est pas paralèle à celui en question
                                            incompatibleIti.push(itiListOfAig)
                                        }
                                        if(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(iti.code)&&!(aigInf(ovse.isItiAnAigOne(iti.code)).exeption.includes(itiListOfAig))){ //si l'itinéraire n'est pas paralèle à celui en question
                                            incompatibleIti.push(itiListOfAig)
                                        }
                                    }
                                }

                                //?    Détection d'itinéraire contraire

                                if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===true) incompatibleIti.push(iti.code)

                                //?    Détection d'itinéraires nez-à-nez

                                for(let itiL of itiList()){
                                    if(!(itiL.active)) continue;
                                    if(itiL.code===iti.code) continue;
                                    let allitiparts = itiL.code.split('_')
                                    if(itiParts[1]===allitiparts[1]){
                                        incompatibleIti.push(itiL)
                                    }
                                }
                                if(onDesIti.length>0 && incompatibleIti.length===0) {
                                    clearInterval(incompatibleInter)
                                    INTERVALS.splice(INTERVALS.indexOf(incompatibleInter),1)
                                    writter.simple(`COMPATIBILITÉ ${iti.code} SUR DESTRUCTION PROGRAMMÉE ${onDesIti[0]}.`,'PA', `ICI`,2)
                                    return suiteOnDesCond()
                                }
                            },250)
                            INTERVALS.push(incompatibleInter)
                            INTERMAP.set(`${code}`,incompatibleInter)
                        } else suiteOnDesCond();
                    } else {
                        let incItiSimple = []
                        for(let itiL of itiList()){
                            if(!(itiL.active)) continue;
                            if(itiL.code===iti.code) continue;
                            let allitiparts = itiL.code.split('_')
                            if(itiParts[1]===allitiparts[1]){
                                incItiSimple.push(itiL)
                                writter.simple(`INCOMPATIBILITÉ NAN ${iti.code}.`,'PA', `ICI`,2)
                            }
                        }

                        let suiteFuncForDesWait = async function(){
                            if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===true&&itiInf(`${itiParts[1]}_${itiParts[0]}`).mode==='SEL') {
                                writter.simple(`INCOMPATIBILITÉ ${iti.code}.`,'PA', `ICI`,2)
                                let desselInter = setInterval(()=>{
                                    if(itiInf(`${itiParts[1]}_${itiParts[0]}`).active===false){
                                        clearInterval(desselInter)
                                        INTERVALS.splice(INTERVALS.indexOf(desselInter),1)
                                        clearCorrespondingInterval(code)
                                        iti.active=true
                                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                        parent.apiSave()
                                        writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`,1)
                                    }
                                },250)
                                INTERVALS.push(desselInter)
                                INTERMAP.set(`${code}`,desselInter)
                            } else {
                                iti.active=true
                                fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                                parent.apiSave()
                                writter.simple(`ITINÉRAIRE ${iti.code} FORMÉ.`,'PA', `ICI`,1)
                            }
                        }

                        if(incItiSimple.length===0){
                            suiteFuncForDesWait()
                        } else {
                            let incompInter = setInterval(async ()=>{
                                incItiSimple = []
                                for(let itiL of itiList()){
                                    if(!(itiL.active)) continue;
                                    if(itiL.code===iti.code) continue;
                                    let allitiparts = itiL.code.split('_')
                                    if(itiParts[1]===allitiparts[1]){
                                        incItiSimple.push(itiL)
                                    }
                                }
                                if(incItiSimple.length===0){
                                    clearInterval(incompInter)
                                    INTERVALS.splice(INTERVALS.indexOf(incompInter),1)
                                    return suiteFuncForDesWait();
                                }
                            },250)
                            INTERVALS.push(incompInter)
                            INTERMAP.set(`${code}`,incompInter)
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
                    writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION.`,'PA', `ICI`,1)
                    await setTimeout(0)
                    if(iti.active===false){
                        iti.mode=false
                        writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`,1)
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
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`,1)
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
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT.`,'PA', `ICI`,1)
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
                    if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION D'URGENCE.`,'PA', `ICI`,2)
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
                            if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} EN DESTRUCTION D'URGENCE.`,'PA', `ICI`,2)
                        } else {
                            writter.simple(`COUPURE SECURITAIRE ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'PA','ICI',2)
                            writter.simple(`OUI ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'UCA','COUPURE FS',3)
                            for(let trueCtn of ctnList){
                                let actualCtn = ovse.returnCtnIteration(trueCtn)
                                actualCtn.states.coupFs = 2
                            }
                            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            parent.apiSave()
                            await setTimeout(10000)
                            if(iti.mode==='DU'){
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D'URGENCE (APRES COUP FS).`,'PA', `ICI`,1)
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
                                writter.simple(`NON ${ovse.isItiAnAigOne(code)} + ${itiParts[0]},${itiParts[1]}.`,'UCA','COUPURE FS',1)
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
                            
                            if(inhib===false) writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D'URGENCE (INSTANTANE).`,'PA', `ICI`,2)
                        } else {
                            writter.simple(`OUI ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'UCA','COUPURE FS',3)
                            writter.simple(`COUPURE SECURITAIRE ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'PA','ICI',2)
                            ctnInf(modifiedCtn[0]).states.coupFs = 2
                            ctnInf(modifiedCtn[1]).states.coupFs = 2
                            if(inhib===false) fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                            if(inhib===false) parent.apiSave()
                            await setTimeout(10000)
                            if(iti.mode==='DU'){
                                writter.simple(`ITINÉRAIRE ${iti.code} DÉTRUIT D\'URGENCE (APRES COUP FS).`,'PA', `ICI`,1)
                                iti.mode=false
                                iti.active=false
                                ctnInf(modifiedCtn[0]).states.coupFs = false
                                ctnInf(modifiedCtn[1]).states.coupFs = false
                                writter.simple(`NON ${ctnInf(modifiedCtn[0]).cid},${ctnInf(modifiedCtn[1]).cid}.`,'UCA','COUPURE FS',1)
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

function aigInf(code){
    for(let aig of pccApi.aiguilles){
        if(aig.id===code) return aig;
    }
}

function itiList(){
    let itis = []
    for(let sec of pccApi.SEC){
        for(let itilist of Object.entries(sec.ITI[0])){
            for(let iti of itilist[1]) itis.push(iti)
        }
    }
    return itis;
}
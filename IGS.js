/**
 * Informatique de Gestion des Séquences 
 * @module IGS
 */

const logger = require('./logger')

const pccApi=require('./server.json');

const fs = require('fs')

const parent = require('./ws')

const {setTimeout} = require('timers/promises')

const writter = require("./writter");

const itineraire = require('./ICI');
const ovse = require('./OVSE');

let INTERVALS = []
let INTERMAP=new Map()

let SECMAP = new Map()
SECMAP.set('RETV201','1')
SECMAP.set('RETV101','1')
SECMAP.set('INJV201','1')
SECMAP.set('INJV101','1')
SECMAP.set('RETGLA','2')
SECMAP.set('INJGLA','2')


exports.appseq = async function( target ){
    if(!(pccApi.sequences[target])) return console.log(target);
    writter.simple(`SEQUENCE ${target} COMMANDÉE.`,'PA', `IGS`)
    let phase = 0
    let seq = pccApi.sequences[target]
    this.phase = async function (){
        //? Etape 1: vérifier la disponibilité du canton d'arrivée de la phase.
        if(ctnInf(seq.phases[phase].end).trains.length>0) {
            for(let sec of pccApi.SEC){
                if(!(sec.id===SECMAP.get(target))) continue;
                sec.states.echecSeq=1
                writter.simple(`SEQUENCE ${target} NON APPLICABLE.`,'PA', `IGS`)
                parent.apiSave()
                await setTimeout(3000)
                sec.states.echecSeq=false
                return parent.apiSave();
            }
        }
        for(let sec of pccApi.SEC){
            if(!(sec.id===SECMAP.get(target))) continue;
            sec.states.ongoingseq=true
            fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
            parent.apiSave()
        }

        //? Etape 2: modifier les itinéraires selon la phase.
        for(let itiDes of seq.phases[phase].DES){
            console.log(itiDes)
            if(itiInf(itiDes).active===true&&itiInf(itiDes).mode==='SEL') itineraire.DES(itiDes)
        }
        for(let itiSel of seq.phases[phase].SEL){
            console.log(itiSel)
            if(itiInf(itiSel).active===false&&!(itiInf(itiSel).mode==='SEL')) itineraire.SEL(itiSel)
        }

        //? Etape 3: attendre l'arrivée de la rame sur le canton d'arrivée.
        let endPhaseInter = setInterval(async ()=>{
            if(ctnInf(seq.phases[phase].end).trains.length>0){
                clearInterval(endPhaseInter)
                //? Etape 4: doit-on passer à la phase suivante?
                if(seq[phase+1]){
                    //? Etape finale: passage à la prochaine phase
                    phase++
                    writter.simple(`SEQUENCE ${target} PHASE ${phase+1}.`,'PA', `IGS`)
                    return this.phase();
                } else {
                    //? Etape finale: reset des itinéraires selon la base de la séquence
                    writter.simple(`SEQUENCE ${target} TERMINÉE.`,'PA', `IGS`)
                    for(let itiDes of seq.BASE.DES){
                        if(itiInf(itiDes).active===true&&itiInf(itiDes).mode==='SEL') itineraire.DES(itiDes)
                    }
                    for(let itiSel of seq.BASE.SEL){
                        if(itiInf(itiSel).active===false&&!(itiInf(itiSel).mode==='SEL')) itineraire.SEL(itiSel)
                    }
                    for(let sec of pccApi.SEC){
                        if(!(sec.id===SECMAP.get(target))) continue;
                        sec.states.ongoingseq=false
                    }
                    return parent.apiSave();
                }
            }
        })
        INTERVALS.push(endPhaseInter)
    }
    this.phase()
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
/**
 * Outil de gestion des demandes de cycles 
 * @module OGDC
 */

const logger = require('./logger')

const pccApi=require('./server.json');

const fs = require('fs')

const parent = require('./ws')

const {setTimeout} = require('timers/promises')


/**
* Applique le cycle rensigné
* @param code Code de cycle
* @param wss WebSeocket actif (permet de broadcast)
* @param cycleTrigger true en cas de réapplication du cycle (ou false si pas de réitération)
* @default false Le cycle n'a pas été appliqué
* @returns True si le cycle a été appliqué
* @type {boolean}
*/

exports.startCycle = function (code, wss, cycleTrigger) {
    if(!(code)) throw new Error ('[OGDC] Aucun code de cycle renseigné')
    if(!(wss)) throw new Error ('[OGDC] Le WebSocket n\'a pas été renseigné!')
    function apiSave(){
        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));

        parent.apiSave()
        //ws.send();
    }

    wss.broadcast = function broadcast(msg) {
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    };

    for(let sec of pccApi.SEC){
        for(let cycle of sec.CYCLES){
            if(!(cycle.code===code)) continue;
            if(code==='c1p1'){
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('sel','2201_2401')
    
                    changeItiState('des','2401_1401')
                    changeItiState('des','1401_2401')
                    changeItiState('des','2201_1201')
                    changeItiState('des','1201_2201')
                    await setTimeout(100)
                    apiSave()
                    await setTimeout(2000)
                    apiSave()
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[8].trains.length>0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[8].trains.length>0)&&(pccApi.SEC[0].cantons[3].trains.length===0)){
                                clearInterval(cycleClearInter)
                                if(true){
                                    const rpdelay2 = async() => {
                                        changeItiState('sel','2401_1401')
                        
                                        changeItiState('des','2201_2401')
                                        changeItiState('des','1401_2401')
                                        changeItiState('des','2201_1201')
                                        changeItiState('des','1201_2201')
                                        changeItiState('des','1201_1401')
                                        changeItiState('des','1401_1201')
                                        await setTimeout(100)
                                        apiSave()
                                        await setTimeout(2000)
                                        apiSave()
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[0].cantons[3].trains.length>0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }


            if(code==='c2p1'){
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('sel','1401_1201')
    
                    changeItiState('des','1201_1401')
                    changeItiState('des','1401_2401')
                    changeItiState('des','2401_1401')
                    changeItiState('des','2201_1201')
                    changeItiState('des','1201_2201')
                    await setTimeout(100)
                    apiSave()
                    await setTimeout(2000)
                    apiSave()
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[1].trains.length>0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[1].trains.length>0)){
                                clearInterval(cycleClearInter)
                                if((pccApi.SEC[0].cantons[6].trains.length===0)){
                                    const rpdelay2 = async() => {
                                        changeItiState('sel','1201_2201')
                        
                                        changeItiState('des','2201_2401')
                                        changeItiState('des','1401_2401')
                                        changeItiState('des','2201_1201')
                                        changeItiState('des','2401_1401')
                                        changeItiState('des','1401_1201')
                                        changeItiState('des','1201_1401')
                                        await setTimeout(100)
                                        apiSave()
                                        await setTimeout(2000)
                                        apiSave()
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[0].cantons[6].trains.length>0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }

            if(code==='c1p2'){
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('sel','2202_2302')
                    changeItiState('sel','2302_2101')
                    changeItiState('sel','2402_2101')
    
                    changeItiState('des','2302_2202')
                    changeItiState('des','2101_2302')
                    changeItiState('des','2101_2402')
                    changeItiState('des','2101_1202')
                    changeItiState('des','1202_2101')
                    await setTimeout(100)
                    apiSave()
                    await setTimeout(2000)
                    apiSave()
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[5].trains.length>0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[5].trains.length>0)){
                                clearInterval(cycleClearInter)
                                if((pccApi.SEC[1].cantons[2].trains.length===0)){
                                    const rpdelay2 = async() => {
                                        changeItiState('sel','2101_2402')
                                        changeItiState('sel','2101_1202')
                                        changeItiState('sel','1102_1302')
                        
                                        changeItiState('des','2402_2101')
                                        changeItiState('des','2302_2101')
                                        changeItiState('des','1202_2101')
                                        changeItiState('des','1302_1102')
                                        changeItiState('des','PAG1_1102')
                                        changeItiState('des','1102_PAG1')
                                        changeItiState('des','1202_1501')
                                        changeItiState('des','1501_1202')
                                        await setTimeout(100)
                                        apiSave()
                                        await setTimeout(2000)
                                        apiSave()
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[1].cantons[2].trains.length>0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }
            if(code==='c2p2'){
                cycle.active=true
                const rpdelay = async() => {
                    changeItiState('sel','2202_2302')
                    changeItiState('sel','2302_2101')
                    changeItiState('sel','2402_2101')
    
                    changeItiState('des','2302_2202')
                    changeItiState('des','2101_2302')
                    changeItiState('des','2101_2402')
                    changeItiState('des','2101_1202')
                    changeItiState('des','1202_2101')
                    await setTimeout(100)
                    apiSave()
                    await setTimeout(2000)
                    apiSave()
                }
                rpdelay()
                let suiteCycle = ()=>{
                    if((pccApi.SEC[0].cantons[5].trains.length>0)){
                        clearInterval(suiteCycleInter)
                        let cycleClear = ()=>{
                            if((pccApi.SEC[0].cantons[5].trains.length>0)){
                                clearInterval(cycleClearInter)
                                if((pccApi.SEC[1].cantons[9].trains.length===0)){
                                    const rpdelay2 = async() => {
                                        changeItiState('sel','2101_2402')
                                        changeItiState('sel','2101_1202')
                                        changeItiState('sel','1102_PAG1')
                        
                                        changeItiState('des','2402_2101')
                                        changeItiState('des','2302_2101')
                                        changeItiState('des','1202_2101')
                                        changeItiState('des','1302_1102')
                                        changeItiState('des','PAG1_1102')
                                        changeItiState('des','1102_1302')
                                        changeItiState('des','1202_1501')
                                        changeItiState('des','1501_1202')
                                        await setTimeout(100)
                                        apiSave()
                                        await setTimeout(2000)
                                        apiSave()
                                    }
                                    rpdelay2()
                                    if((cycleTrigger) && (cycle.active)){
                                        let resetCycle = ()=>{
                                            if((pccApi.SEC[1].cantons[9].trains.length>0)){
                                                clearInterval(resetCycleInter)
                                                exports.startCycle(code, wss, true)
                                            }
                                        }
                                        let resetCycleInter = setInterval(resetCycle,2000)
                                        apiSave()
                                    }
                                }
                            }
                        }
                        let cycleClearInter = setInterval(cycleClear,2000)
                        apiSave()
                    }
                }
                let suiteCycleInter = setInterval(suiteCycle,2000)
            }
        }
    }
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
                        fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                    }
                    rpdelay()
            
                } else if(mode==='du'){
                    iti.mode=false
                    iti.active=false
                    fs.writeFileSync('./server.json', JSON.stringify(pccApi, null, 2));
                } else return false;
            }
        }
    }
    return false;
}
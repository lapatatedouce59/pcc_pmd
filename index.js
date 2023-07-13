let btnACQU = document.getElementById('btnACQU')
let btnAG = document.getElementById('btnAG')
let btnAG2 = document.getElementById('btnAG2')

let toast= document.getElementById('snackbar')

let showuname = document.getElementById('uname')

let usrname = username
let copyConfig = document.getElementById('copyConfig')
let actualRequest=''
window.actualRequest = actualRequest
let showRequest = document.getElementById('request')
let roleOP = document.getElementById('roleOP')

let comForceHT = document.getElementById('comForceHT')
let comAuth = document.getElementById('comAuth')
let comFSLine = document.getElementById('comFSLine')
let comAuthGAT = document.getElementById('comAuthGAT')
let comFSGAT = document.getElementById('comFSGAT')
let comArmPR = document.getElementById('comArmPR')
let comInhibUCA = document.getElementById('comInhibUCA')
let comIDPOTPAS = document.getElementById('comIDPOTPAS')

let trainAffect = document.getElementById('trainAffect')
let btnForward = document.getElementById('forward')
let btnDownward = document.getElementById('downward')
let btnExp = document.getElementById('experiment')
let btnSend = document.getElementById('sendCmd')
let commandInput = document.getElementById('commandInput')
let btnReload = document.getElementById('reload')
let TEXTE_POUR_FAIRE_ATTENTION_SA_MERE = document.getElementById('attention')
let tiensCatherineTonUUID =  document.getElementById('uuidLigne')

setInterval(async function() {
    TEXTE_POUR_FAIRE_ATTENTION_SA_MERE.classList.toggle('warn')
}, 500)

let cantonsS1 = false

let keystroke = []

window.addEventListener('keydown', (e)=>{
    keystroke.push(e.code)
    //console.log(keystroke)
    if(keystroke[0]==='ControlLeft' && keystroke[1]==='ShiftLeft' && keystroke[2]==='AltLeft' && keystroke[3]==='KeyQ' && keystroke[4]==='KeyL'){
        keystroke = []
        window.WebSocket.send(JSON.stringify({
            op: 200,
            execute: "LINE-ACQU",
            uuid: uuid
        }));

    } else if(keystroke[0]==='ControlLeft' && keystroke[1]==='ShiftLeft' && keystroke[2]==='AltLeft' && keystroke[3]==='KeyQ' && keystroke[4]==='KeyG'){
        keystroke = []
        actualRequest = JSON.stringify({
            op: 200,
            execute: "AG",
            uuid: uuid
        })
        window.WebSocket.send(actualRequest);
    } else if(keystroke[0]==='ControlLeft' && keystroke[1]==='ShiftLeft' && keystroke[2]==='AltLeft' && keystroke[3]==='KeyP'){
        keystroke = []
        if (comIDPOTPAS.checked === false) {
            actualRequest = JSON.stringify({
                op: 202,
                execute: "IDPO-COM",
                state: true,
                uuid: uuid
            })
            window.actualRequest = actualRequest
            comIDPOTPAS.checked = false
            window.WebSocket.send(actualRequest);
        } else
        if (comIDPOTPAS.checked === true) {
            actualRequest = JSON.stringify({
                op: 202,
                execute: "IDPO-COM",
                state: false,
                uuid: uuid
            })
            window.actualRequest = actualRequest
            comIDPOTPAS.checked = true
            window.WebSocket.send(actualRequest);
        }
    } else {
        async function waitABit(){
            await sleep(500)
            keystroke = []
        }
        waitABit()
    }
})


let S1 = document.getElementById('s1svg')
S1.addEventListener('load', () => {
    let s1svgDoc = S1.contentDocument;
    cantonsS1 = {
        1: s1svgDoc.getElementById('1'),
        2: s1svgDoc.getElementById('2'),
        3: [s1svgDoc.getElementById('3'), s1svgDoc.getElementById('4'), s1svgDoc.getElementById('5')],
        4: s1svgDoc.getElementById('6'),
        5: s1svgDoc.getElementById('7'),
        6: s1svgDoc.getElementById('8'),
        7: s1svgDoc.getElementById('9'),
        8: [s1svgDoc.getElementById('10'), s1svgDoc.getElementById('11'), s1svgDoc.getElementById('12')],
        9: s1svgDoc.getElementById('13'),
        10: s1svgDoc.getElementById('14'),
        aiguilles: [{
            id: 'C1',
            a1c1301: [s1svgDoc.getElementById('15'), s1svgDoc.getElementById('19')],
            a1c2301: [s1svgDoc.getElementById('17'), s1svgDoc.getElementById('20')],
            a2c1301: [s1svgDoc.getElementById('16'), s1svgDoc.getElementById('19')],
            a2c2301: [s1svgDoc.getElementById('18'), s1svgDoc.getElementById('20')]
        }],
        arrows: [
            [s1svgDoc.getElementById('21'), s1svgDoc.getElementById('22')],
            [s1svgDoc.getElementById('23'), s1svgDoc.getElementById('24')]
        ],
        lights: {
            'S1C1': s1svgDoc.getElementById('S1C1'),
            'S2C1': s1svgDoc.getElementById('S2C1'),
            'S3C1': s1svgDoc.getElementById('S3C1'),
            'S1C2': s1svgDoc.getElementById('S1C2'),
            'S3C2': s1svgDoc.getElementById('S3C2')
        },
        screens: {
            '2201': [s1svgDoc.getElementById('sc2201'), s1svgDoc.getElementById('txtSc2201')],
            '1401': [s1svgDoc.getElementById('sc1401'), s1svgDoc.getElementById('txtSc1401')]
        },
        voys: {
            'NOR': s1svgDoc.getElementById('voyC1Nor'),
            'A1Dev': s1svgDoc.getElementById('voyC1A1Dev'),
            'A2Dev': s1svgDoc.getElementById('voyC1A2Dev'),
            'GAR': s1svgDoc.getElementById('voyC1Gar'),
            'INSR': s1svgDoc.getElementById('voyC1Insr'),
            'AUTO': s1svgDoc.getElementById('voyC1Auto')
        }

    }
    getCantonsInfo()
})
let cantonsS2 = false

let S2 = document.getElementById('s2svg')
S2.addEventListener('load', () => {
    let s2svgDoc = S2.contentDocument;
    cantonsS2 = {
        1: [s2svgDoc.getElementById('1'), s2svgDoc.getElementById('2'), s2svgDoc.getElementById('3')],
        2: [s2svgDoc.getElementById('4'), s2svgDoc.getElementById('5'), s2svgDoc.getElementById('6')],
        3: s2svgDoc.getElementById('7'),
        4: s2svgDoc.getElementById('8'),
        5: s2svgDoc.getElementById('9'),
        6: s2svgDoc.getElementById('10'),
        7: s2svgDoc.getElementById('11'),
        8: [s2svgDoc.getElementById('12'), s2svgDoc.getElementById('13'), s2svgDoc.getElementById('14')],
        9: [s2svgDoc.getElementById('20'), s2svgDoc.getElementById('22'), s2svgDoc.getElementById('19')],
        10: s2svgDoc.getElementById('15'),
        aiguilles: [{
            id: 'C2',
            a1c1102: [s2svgDoc.getElementById('16'), s2svgDoc.getElementById('21')],
            a1c2402: [s2svgDoc.getElementById('17'), s2svgDoc.getElementById('23')],
            a2c1202: [s2svgDoc.getElementById('18'), s2svgDoc.getElementById('24')],
            a2cEND: [s2svgDoc.getElementById('19'), s2svgDoc.getElementById('22')]
        }],
        arrows: [
            [s2svgDoc.getElementById('25'), s2svgDoc.getElementById('26')], //haute A1
            [s2svgDoc.getElementById('29'), s2svgDoc.getElementById('30')], //basse A1
            [s2svgDoc.getElementById('27'), s2svgDoc.getElementById('28')], //haute A2
            [s2svgDoc.getElementById('31'), s2svgDoc.getElementById('32')] //basse A2
        ],
        lights: {
            'S2C2': s2svgDoc.getElementById('S2C2'),
            'S4C2': s2svgDoc.getElementById('S4C2'),
            'S5C2': s2svgDoc.getElementById('S5C2'),
            'S6C2': s2svgDoc.getElementById('S6C2'),
            'DEPC2': s2svgDoc.getElementById('DEPC2')
        },
        screens: {
            '2202': [s2svgDoc.getElementById('sc2202'), s2svgDoc.getElementById('txtSc2202')],
            '1302': [s2svgDoc.getElementById('sc1302'), s2svgDoc.getElementById('txtSc1302')],
            'PAG1': [s2svgDoc.getElementById('scPAG1'), s2svgDoc.getElementById('txtScPAG1')]
        },
        voys: {
            'NORA1': s2svgDoc.getElementById('voyC2Nor'),
            'NORA2': s2svgDoc.getElementById('voyC2BNor'),
            'A1Dev': s2svgDoc.getElementById('voyC2A1Dev'),
            'A2Dev': s2svgDoc.getElementById('voyC2A2Dev'),
            'ENT': s2svgDoc.getElementById('voyC2ENT'),
            'DEP': s2svgDoc.getElementById('voyC2DEP'),
            'AUTO': s2svgDoc.getElementById('voyC2Auto'),
            'SP': s2svgDoc.getElementById('voyC2SP')
        }

    }
    getCantonsInfoS2()
})


sm.registerSound("bip", './src/pltp/snds/bip.mp3');
sm.registerSound("join", './src/global/join.mp3');
sm.registerSound("left", './src/global/leave.mp3');
sm.registerSound("enter", './src/global/enter.mp3');
sm.registerSound("wb", './src/global/wb.mp3');

const blinkIntervalId = new Map()

let beepIntervalId = false

let alreadyBeep = false

import sm from './sm.js'
sm.init()

let data = false

async function isWsRunning(){
    await sleep(500)
    //getCantonsInfo()
    //getCantonsInfoS2()
    await sleep(500)
    if(!(cantonsS2.aiguilles)){
        alert('Le cache doit être vidé pour continuer, désolé :(')
        return;
    }
    await sleep(1000)
    if(!(data)){
        alert('Le websocket semble être hors ligne! Merci de signaler à La Patate Douce sur Discord!')
        return;
    }
}
    //ws = new WebSocket('ws://localhost:8081')

    //window.WebSocket.addEventListener('open', () => {
        console.log("Connecté au WS")
        /*const weweOnAttends = async() => {
            await sleep(100)
            window.WebSocket.send(JSON.stringify({
                op: 1,
                from: "TCO-LIGNE",
                uname: username||localStorage.getItem('dUsername')
            }));
            sm.playSound('wb')
            console.log(username)
            showuname.innerHTML=localStorage.getItem('dUsername')
        }
        weweOnAttends()*/

        window.WebSocket.addEventListener('message', msg => {
            data = JSON.parse(msg.data);
            //console.log(data)
            if (!data.op) {
                let iteration = 0
                let count = 0

                for (let voy of document.getElementsByClassName('voy')) {
                    let elemid = voy.id
                    if (data[elemid] === false) {
                        //console.log("Voyant "+voy.id+" est faux")
                        let elem = document.getElementById(elemid)
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)
                    } else
                    if (data[elemid] === true) {
                        //console.log('Voyant '+voy.id+' est vrai.')
                        let elem = document.getElementById(elemid)
                        elem.classList.toggle('ok')
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)
                    } else
                    if (data[elemid] === 1) {
                        //console.log('Voyant '+voy.id+' est en anomalie.')
                        let elem = document.getElementById(elemid)
                        elem.classList.toggle('alarm')
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)
                    } else
                    if (data[elemid] === 2) {
                        //console.log('Voyant '+voy.id+' est en anomalie.')
                        let elem = document.getElementById(elemid)
                        elem.classList.remove('ok')
                        elem.classList.toggle('alarm')
                        blinkIntervalId.set(elemid, setInterval(async function() {
                            elem.classList.toggle('alarm')
                        }, 500))
                        console.log(blinkIntervalId.get(elemid))
                        console.log(blinkIntervalId.size)
                    }



                    /*if (elemid.includes('SS')) {
                        console.log(elemid)
                        console.log(data.SS[count])
                        console.log(data.SS[count][elemid])
                        if (data.SS[count][elemid] === false) {
                            console.log("Voyant " + voy.id + " est faux")
                            let elem = document.getElementById(elemid)
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === true) {
                            console.log('Voyant ' + voy.id + ' est vrai.')
                            let elem = document.getElementById(elemid)
                            elem.classList.toggle('ok')
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === 1) {
                            //console.log('Voyant '+voy.id+' est en anomalie.')
                            let elem = document.getElementById(elemid)
                            elem.classList.toggle('alarm')
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === 2) {
                            //console.log('Voyant '+voy.id+' est en anomalie.')
                            let elem = document.getElementById(elemid)
                            elem.classList.remove('ok')
                            elem.classList.toggle('alarm')
                            blinkIntervalId.set(elemid, setInterval(async function() {
                                elem.classList.toggle('alarm')
                            }, 500))
                            console.log(blinkIntervalId.get(elemid))
                            console.log(blinkIntervalId.size)
                        }
                        iteration++
                        if (iteration === 3) {
                            count++;
                            iteration = 0
                        }
                    }*/
                }

                for (let com of document.getElementsByClassName('com')) {
                    let elemid = com.id
                    let elem = document.getElementById(elemid)
                    if (data[elemid] === false) {
                        console.log("Commutateur " + com.id + " est faux")
                        elem.checked = false
                    } else
                    if (data[elemid] === true) {
                        console.log('Commutateur ' + com.id + ' est vrai.')
                        elem.checked = true
                    }
                }

                //isWsRunning()

                /*if(data.PR[elemid] === false){
                    console.log("Voyant "+voy.id+" est faux")
                    let elem = document.getElementById(elemid)
                    clearInterval(blinkIntervalId.get(elemid))
                    blinkIntervalId.delete(elemid)
                    clearInterval(beepIntervalId)
                } else
                if (data[elemid] === true){
                    console.log('Voyant '+voy.id+' est vrai.')
                    let elem = document.getElementById(elemid)
                    elem.classList.toggle('ok')
                    clearInterval(blinkIntervalId.get(elemid))
                    blinkIntervalId.delete(elemid)
                    clearInterval(beepIntervalId)
                } else
                if (data[elemid] === 1){
                    console.log('Voyant '+voy.id+' est en anomalie.')
                    let elem = document.getElementById(elemid)
                    elem.classList.toggle('alarm')
                    clearInterval(blinkIntervalId.get(elemid))
                    blinkIntervalId.delete(elemid)
                    clearInterval(beepIntervalId)
                }else
                if (data[elemid] === 2){
                    console.log('Voyant '+voy.id+' est en anomalie.')
                    let elem = document.getElementById(elemid)
                    elem.classList.remove('ok')
                    elem.classList.toggle('alarm')
                    blinkIntervalId.set(elemid, setInterval(async function(){
                        elem.classList.toggle('alarm')
                    }, 500))
                    console.log(blinkIntervalId.get(elemid))
                    console.log(blinkIntervalId.size)
                }*/



                if (blinkIntervalId.size >= 1) {
                    sm.playSound('bip', 0.5)
                    beepIntervalId = setInterval(async () => {
                        sm.playSound('bip', 0.5)
                        console.log('bip')
                        //sm.stopFreq(2959)
                    }, 1000)
                } else {
                    sm.stopSound('bip')
                }
            }

            /*if(data.op===3){
                console.log(uuid)
                uuid=data.uuid
                tiensCatherineTonUUID.innerHTML = uuid
                window.WebSocket.send(JSON.stringify({
                    op: 4,
                    demande: 'TEST-UUID?',
                    uuid: uuid
                }))
            }*/

            if(data.op===10){
                let uuid=data.content.uuid
                let newUserName=data.content.uname
                toast.innerHTML='L\'utilisateur '+newUserName+' a rejoins le PCC avec l\'UUID '+uuid+' !'
                sm.playSound('enter')
                toast.className="show";
                setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
                
            }

            if(data.op===11){
                toast.innerHTML=data.name+' a quitté la page.'
                toast.className="show";
                sm.playSound('left')
                setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
            }

            if ((data.op === 300)||(data.op === 2)) {
                console.log('maj recue')
                if(data.op===2){
                    if(data.uuid){
                        window.uuid=data.uuid
                        tiensCatherineTonUUID.innerHTML = data.uuid
                    }
                    if(data.uname){
                        window.uname=data.uname
                        showuname.innerHTML = data.uname
                    }
                    if(data.role){
                        window.role=data.role
                        roleOP.innerHTML = data.role
                    }
                }
                let parsedJson = data.content
                data = parsedJson
                let iteration = 0
                let count = 0

                for (let voy of document.getElementsByClassName('voy')) {
                    let elemid = voy.id
                    //console.log(parsedJson[elemid])

                    //-> VOYANTS NORMAUX
                    if (data[elemid] === false) {
                        console.log("Voyant " + voy.id + " est faux")
                        let elem = document.getElementById(elemid)
                        elem.classList.remove('alarm', 'ok')
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)
                    } else
                    if (data[elemid] === true) {
                        console.log('Voyant ' + voy.id + ' est vrai.')
                        let elem = document.getElementById(elemid)
                        elem.classList.remove('alarm')
                        elem.classList.toggle('ok', true)
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)
                    } else
                    if (data[elemid] === 1) {
                        console.log('Voyant ' + voy.id + ' est en défaut.')
                        let elem = document.getElementById(elemid)
                        elem.classList.remove('ok')
                        elem.classList.remove('alarm')
                        elem.classList.toggle('alarm', true)
                        console.log(blinkIntervalId.get(elemid))
                        clearInterval(blinkIntervalId.get(elemid))
                        blinkIntervalId.delete(elemid)
                        clearInterval(beepIntervalId)

                    } else
                    if (data[elemid] === 2 && !(blinkIntervalId.get(elemid))) {
                            //console.log('Voyant '+voy.id+' est en anomalie.')
                            let elem = document.getElementById(elemid)
                            elem.classList.remove('ok')
                            elem.classList.toggle('alarm')
                            blinkIntervalId.set(elemid, setInterval(async function() {
                                elem.classList.toggle('alarm')
                            }, 500))
                            console.log(blinkIntervalId.get(elemid))
                            console.log(blinkIntervalId.size)
                    }
                    for(let ss of data.SS){
                        let name = ss.name //expected: SS04 ou SS05
                        for(let prop of Object.keys(ss)){
                            console.log((prop+name)+' et '+elemid)
                            if(!(elemid===(prop+name))) continue;//si voyHTSS04 === voyHT + SS04
                            console.log(ss)

                            console.log(elemid)
                            console.log(ss[prop])
                            if (ss[prop] === false) {
                                console.log("Voyant " + elemid + " est faux")
                                let elem = document.getElementById(elemid)
                                elem.classList.remove('alarm', 'ok')
                                clearInterval(blinkIntervalId.get(elemid))
                                blinkIntervalId.delete(elemid)
                                clearInterval(beepIntervalId)
                                continue;
                            } else
                            if (ss[prop] === true) {
                                console.log('Voyant ' + elemid + ' est vrai.')
                                let elem = document.getElementById(elemid)
                                elem.classList.remove('alarm')
                                elem.classList.toggle('ok', true)
                                clearInterval(blinkIntervalId.get(elemid))
                                blinkIntervalId.delete(elemid)
                                clearInterval(beepIntervalId)
                                continue;
                            } else
                            if (ss[prop] === 1) {
                                console.log('Voyant ' + elemid + ' est en défaut.')
                                let elem = document.getElementById(elemid)
                                elem.classList.remove('ok')
                                elem.classList.remove('alarm')
                                elem.classList.toggle('alarm', true)
                                console.log(blinkIntervalId.get(elemid))
                                clearInterval(blinkIntervalId.get(elemid))
                                blinkIntervalId.delete(elemid)
                                clearInterval(beepIntervalId)
                                continue;
        
                            } else
                            if (ss[prop] === 2 && !(blinkIntervalId.get(elemid))) {
                                    //console.log('Voyant '+voy.id+' est en anomalie.')
                                    let elem = document.getElementById(elemid)
                                    elem.classList.remove('ok')
                                    elem.classList.toggle('alarm')
                                    blinkIntervalId.set(elemid, setInterval(async function() {
                                        elem.classList.toggle('alarm')
                                    }, 500))
                                    console.log(blinkIntervalId.get(elemid))
                                    console.log(blinkIntervalId.size)
                                    continue;
                                }
                        }
                    }
                    //-> VOYANTS SS
                    /*if (elemid.includes('SS')) {
                        //console.log(elemid)
                        //console.log(data.SS[count])
                        //console.log(data.SS[count][elemid])
                        if (data.SS[count][elemid] === false) {
                            console.log("Voyant " + voy.id + " est faux")
                            let elem = document.getElementById(elemid)
                            elem.classList.remove('ok')
                            elem.classList.remove('alarm')
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === true) {
                            console.log('Voyant ' + voy.id + ' est vrai.')
                            let elem = document.getElementById(elemid)
                            elem.classList.remove('alarm')
                            elem.classList.toggle('ok', true)
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === 1) {
                            //console.log('Voyant '+voy.id+' est en anomalie.')
                            let elem = document.getElementById(elemid)
                            elem.classList.remove('ok')
                            elem.classList.toggle('alarm', true)
                            clearInterval(blinkIntervalId.get(elemid))
                            blinkIntervalId.delete(elemid)
                            clearInterval(beepIntervalId)
                        } else
                        if (data.SS[count][elemid] === 2) {
                            //console.log('Voyant '+voy.id+' est en anomalie.')
                                let elem = document.getElementById(elemid)
                                elem.classList.remove('ok')
                                elem.classList.toggle('alarm', true)
                                blinkIntervalId.set(elemid, setInterval(async function() {
                                    elem.classList.toggle('alarm')
                                }, 500))
                                console.log(blinkIntervalId.get(elemid))
                                console.log(blinkIntervalId.size)
                        }

                        iteration++
                        if (iteration === 3) {
                            count++;
                            iteration = 0
                        }
                    }*/

                }
                for (let com of document.getElementsByClassName('com')) {
                    let elemid = com.id
                    let elem = document.getElementById(elemid)
                    console.log("Commutateur " + com.id + " est " + data[elemid])
                    com.checked = data[elemid]
                }
                //if(alreadyBeep===false){
                if (blinkIntervalId.size >= 1) {
                    sm.playSound('bip', 0.5)
                    beepIntervalId = setInterval(async () => {
                        sm.playSound('bip', 0.5)
                        console.log('bip')
                        //sm.stopFreq(2959)
                    }, 1000)
                } else {
                    console.log('y\'a un truc qui déconne')
                    sm.stopSound('bip')
                }
                //}
                getCantonsInfo();
                getCantonsInfoS2()
            }
        })
    //})

btnAG.addEventListener("click", () => {
    actualRequest = JSON.stringify({
        op: 200,
        execute: "AG",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnAG2.addEventListener("click", () => {
    actualRequest = JSON.stringify({
        op: 200,
        execute: "AGreset",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

btnACQU.addEventListener("click", () => {
    actualRequest = JSON.stringify({
        op: 200,
        execute: "LINE-ACQU",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

comFSLine.addEventListener("input", () => {
    if (comFSLine.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "FS-LINE-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comFSLine.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "FS-LINE-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comFSGAT.addEventListener("input", () => {
    if (comFSGAT.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "FS-GAT-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comFSGAT.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "FS-GAT-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comIDPOTPAS.addEventListener("input", () => {
    if (comIDPOTPAS.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "IDPO-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comIDPOTPAS.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "IDPO-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comInhibUCA.addEventListener("input", () => {
    if (comInhibUCA.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "UCAINHIB-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comInhibUCA.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "UCAINHIB-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comAuth.addEventListener("input", () => {
    if (comAuth.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "HTAUT-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comAuth.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "HTAUT-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comAuthGAT.addEventListener("input", () => {
    if (comAuthGAT.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "HTAUTGAT-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comAuthGAT.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "HTAUTGAT-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comForceHT.addEventListener("input", () => {
    if (comForceHT.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "FORCEHT-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comForceHT.checked === false) {
        actualRequest = 
        JSON.stringify({
            op: 202,
            execute: "FORCEHT-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})

comArmPR.addEventListener("input", () => {
    if (comArmPR.checked === true) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "ARMPR-COM",
            state: true,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    } else
    if (comArmPR.checked === false) {
        actualRequest = JSON.stringify({
            op: 202,
            execute: "ARMPR-COM",
            state: false,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest);
        window.actualRequest = actualRequest
    }
})



btnForward.addEventListener('click', () => {
    let trainAffectTxt = trainAffect.value;

    if (!isDigit(trainAffectTxt)) return;

    let TTARGET = parseInt(trainAffectTxt)


    if (verifyExistingTrain(TTARGET)) {
        console.log('bon bah on ordonne au serveur d\'avancer')
        actualRequest = JSON.stringify({
            op: 400,
            sens: 1,
            train: TTARGET,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest)
        window.actualRequest = actualRequest
        console.log('Ordre 400 pour le train ' + TTARGET)
    }
})
btnDownward.addEventListener('click', () => {
    let trainAffectTxt = trainAffect.value;

    if (!isDigit(trainAffectTxt)) return;

    let TTARGET = parseInt(trainAffectTxt)


    if (verifyExistingTrain(TTARGET)) {
        console.log('bon bah on ordonne au serveur de reculer')
        actualRequest = JSON.stringify({
            op: 400,
            sens: 2,
            train: TTARGET,
            uuid: window.uuid
        })
        window.WebSocket.send(actualRequest)
        window.actualRequest = actualRequest
        console.log('Ordre 400 pour le train ' + TTARGET)
    }
})

btnExp.addEventListener('click', () => {
    console.log('EXP')
    /*console.log(_GLIST_[1])
    console.log(canton_train.get('1'))
    console.log(canton_train)*/
    //console.log(JSON.parse(getCantonsInfo()))
    console.log(_GLIST_[2].length)
    console.log(_GLIST_[6].length)
    for (let _CANTON_ in _GLIST_) {
        if (typeof _GLIST_[_CANTON_].length === 'undefined') {
            console.log((_CANTON_) + ' est un canton simple')
        } else {
            console.log(_CANTON_ + ' est une aiguille')
        }
    }
})

btnSend.addEventListener('click', () => {
    let args = commandInput.value.split(" ")
    if (!(args[0] === 'SET' || 'REM')) return;
    actualRequest = JSON.stringify({
        op: 500,
        cmd: args,
        uuid: window.uuid
    })
    window.actualRequest = actualRequest
    window.WebSocket.send(actualRequest)
})

btnReload.addEventListener('click', () => {
    getCantonsInfo()
    getCantonsInfoS2()
})



function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getCantonsInfo() {
    //data=data.content
    console.log(data)
    let _GLIST_ = cantonsS1
    clearAllCantons('S1');
    let fresponse = {
        trains: []
    }
    for (let _CANTON_ in _GLIST_) {
        console.log(_CANTON_)
        if (_CANTON_ === 'aiguilles') continue;
        if (_CANTON_ === 'arrows') continue;
        if (_CANTON_ === 'lights') continue;
        if (_CANTON_ === 'screens') continue;
        if (_CANTON_ === 'voys') continue;
        _CANTON_--;
        console.log('[❔] ARRAY[' + _CANTON_ + ']')
        //fill des fleches de dir
        let dir = data.SEC[0].cantons[2].dir;
        if (dir === 'up') {
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#707070';
            }
        } else if (dir === 'down') {
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#707070';
            }
        } else {
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#707070';
            }
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#707070';
            }
        }
        if (data.SEC[0].cantons[_CANTON_].position === 'r') {
            _GLIST_.voys['NOR'].setAttribute('href', '../ON.png');
            _GLIST_.voys['A1Dev'].setAttribute('href', '../OFF.png')
            _GLIST_.voys['A2Dev'].setAttribute('href', '../OFF.png')
        } else if (data.SEC[0].cantons[_CANTON_].position === 'a1') {
            _GLIST_.voys['NOR'].setAttribute('href', '../OFF.png');
            _GLIST_.voys['A1Dev'].setAttribute('href', '../ON.png')
            _GLIST_.voys['A2Dev'].setAttribute('href', '../OFF.png')
        } else if (data.SEC[0].cantons[_CANTON_].position === 'a2') {
            _GLIST_.voys['NOR'].setAttribute('href', '../OFF.png');
            _GLIST_.voys['A1Dev'].setAttribute('href', '../OFF.png')
            _GLIST_.voys['A2Dev'].setAttribute('href', '../ON.png')
        }
        //console.log(data.SEC[0]._GLIST_[0].trains[0]) EXEMPLE DE CHEMIN
        if (data.SEC[0].cantons[_CANTON_].cid === 'c2201') {
            if (data.SEC[0].cantons[_CANTON_].trains.length >= 1) {
                _GLIST_.screens['2201'][1].textContent = data.SEC[0].cantons[_CANTON_].trains[0].tid
                _GLIST_.screens['2201'][0].style.fill = '#3C0A0A'
            } else {
                _GLIST_.screens['2201'][1].textContent = ''
                _GLIST_.screens['2201'][0].style.fill = '#000000'
            }
        }

        if (data.SEC[0].cantons[_CANTON_].cid === 'c1401') {
            if (data.SEC[0].cantons[_CANTON_].trains.length >= 1) {
                _GLIST_.screens['1401'][1].textContent = data.SEC[0].cantons[_CANTON_].trains[0].tid
                _GLIST_.screens['1401'][0].style.fill = '#3C0A0A'
            } else {
                _GLIST_.screens['1401'][1].textContent = ''
                _GLIST_.screens['1401'][0].style.fill = '#000000'
            }
        }
        if (data.SEC[0].cantons[_CANTON_].trains.length >= 1) { //CANTON OCCUPE
            console.log('[👉] canton ' + (_CANTON_ + 1) + ' occupé')
            console.log(_GLIST_[_CANTON_ + 1])

            if (typeof _GLIST_[_CANTON_ + 1].length === 'undefined') {
                console.log((_CANTON_ + 1) + ' est un canton simple')
                console.log('[🚫] canton ' + (_CANTON_ + 1) + ' occupé')
                let CTARGET = _GLIST_[_CANTON_ + 1]
                CTARGET.style.fill = '#E1A712';


                console.log(_GLIST_.screens)



            } else {
                console.log((_CANTON_ + 1) + ' est une aiguille')
                console.log('[🚫] aiguille ' + (_CANTON_ + 1) + ' occupé')

                /*for(let bits in _GLIST_[_CANTON_+1]){
                    console.log(_GLIST_[_CANTON_+1][bits])
                    _GLIST_[_CANTON_+1][bits].style.fill='#E1A712'
                }*/


                if (data.SEC[0].cantons[_CANTON_].position === 'r') {
                    clearAllCantons('S1', _CANTON_)
                    for (let bits in _GLIST_[_CANTON_ + 1]) {
                        console.log(_GLIST_[_CANTON_ + 1][bits])
                        _GLIST_[_CANTON_ + 1][bits].style.fill = '#E1A712';
                    }
                } else if (data.SEC[0].cantons[_CANTON_].position === 'a1') {
                    //clearAllCantons(_CANTON_, 'a1')
                    switch (data.SEC[0].cantons[_CANTON_].cid) {
                        case 'c1301':
                            clearAllCantons('S1', _CANTON_)
                            for (let bits in _GLIST_.aiguilles[0].a1c1301) {
                                console.log(_GLIST_.aiguilles[0].a1c1301[bits])
                                _GLIST_.aiguilles[0].a1c1301[bits].style.fill = '#E1A712';
                            }
                            break;
                        case 'c2301':
                            for (let bits in _GLIST_.aiguilles[0].a1c2301) {
                                console.log(_GLIST_.aiguilles[0].a1c2301[bits])
                                _GLIST_.aiguilles[0].a1c2301[bits].style.fill = '#E1A712';
                            }
                            break;
                    }
                } else if (data.SEC[0].cantons[_CANTON_].position === 'a2') {
                    //clearAllCantons(_CANTON_, 'a2')
                    switch (data.SEC[0].cantons[_CANTON_].cid) {
                        case 'c1301':
                            clearAllCantons('S1', _CANTON_)
                            for (let bits in _GLIST_.aiguilles[0].a2c1301) {
                                console.log(_GLIST_.aiguilles[0].a2c1301[bits])
                                _GLIST_.aiguilles[0].a2c1301[bits].style.fill = '#E1A712';
                            }
                            break;
                        case 'c2301':
                            for (let bits in _GLIST_.aiguilles[0].a2c2301) {
                                console.log(_GLIST_.aiguilles[0].a2c2301[bits])
                                _GLIST_.aiguilles[0].a2c2301[bits].style.fill = '#E1A712';
                            }
                            break;
                    }
                }
            }

            for (let _SEC_ in data.SEC) {
                for (let _TRAIN_ in data.SEC[_SEC_].cantons[_CANTON_].trains) {
                    console.log(data.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_]);
                    let tid = data.SEC[_SEC_].cantons[_CANTON_].trains[_TRAIN_].tid;
                    //canton_train.set(_TRAIN_, _CANTON_)
                    console.log('_TRAIN_ ' + _TRAIN_ + " _CANTON_ " + _CANTON_)

                    fresponse.trains.push({
                        cantonId: data.SEC[_SEC_].cantons[_CANTON_].cid,
                        cantonIndex: _CANTON_,
                        trainId: tid,
                        trainIndex: _TRAIN_,
                        secId: data.SEC[_SEC_].id,
                        secIndex: _SEC_
                    })
                }
            }

        } else {
            if (typeof _GLIST_[_CANTON_ + 1].length === 'undefined') { //CANTON LIBRE
                console.log((_CANTON_ + 1) + ' est un canton simple')
                console.log('[🚫] canton ' + (_CANTON_ + 1) + ' libre')
                let CTARGET = _GLIST_[_CANTON_ + 1]
                CTARGET.style.fill = '#707070';
            } else {
                console.log((_CANTON_ + 1) + ' est une aiguille')
                console.log('[🚫] aiguille ' + (_CANTON_ + 1) + ' libre')
                console.log(data.SEC[0].cantons[_CANTON_])

                if (data.SEC[0].cantons[_CANTON_].position === 'r') {
                    console.log(data.SEC[0].cantons[_CANTON_].cid + ' en neutre')
                    clearAllCantons('S1', _CANTON_)
                    for (let bits in _GLIST_[_CANTON_ + 1]) {
                        console.log(_GLIST_[_CANTON_ + 1][bits])
                        _GLIST_[_CANTON_ + 1][bits].style.fill = '#66D264';
                    }
                    _GLIST_.lights.S1C1.setAttribute('href', '../V1S1_GREEN.png')
                    _GLIST_.lights.S2C1.setAttribute('href', '../V2S2_GREEN.png')
                    _GLIST_.lights.S3C1.setAttribute('href', '../V1S1_RED.png')
                } else if (data.SEC[0].cantons[_CANTON_].position === 'a1') {
                    clearAllCantons('S1', _CANTON_, 'deleteCenter')
                    console.log(data.SEC[0].cantons[_CANTON_].cid + ' en aiguille a1')
                    //clearAllCantons(_CANTON_, 'a1')
                    switch (data.SEC[0].cantons[_CANTON_].cid) {
                        case 'c1301':
                            clearAllCantons('S1', _CANTON_)
                            console.log(data.SEC[0].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c1301 a1')
                            for (let bits in _GLIST_.aiguilles[0].a1c1301) {
                                console.log(_GLIST_.aiguilles[0].a1c1301[bits])
                                _GLIST_.aiguilles[0].a1c1301[bits].style.fill = '#66D264';
                            }
                            break;
                        case 'c2301':
                            console.log(data.SEC[0].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c2301 a1')
                            for (let bits in _GLIST_.aiguilles[0].a1c2301) {
                                console.log(_GLIST_.aiguilles[0].a1c2301[bits])
                                _GLIST_.aiguilles[0].a1c2301[bits].style.fill = '#66D264';
                            }
                            break;
                    }
                    switch (data.SEC[0].cantons[_CANTON_].dir) {
                        case 'up':
                            _GLIST_.lights.S1C1.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S2C1.setAttribute('href', '../V2S2_RED.png')
                            _GLIST_.lights.S3C1.setAttribute('href', '../V1S1_RED.png')
                            break;
                        case 'down':
                            _GLIST_.lights.S1C1.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S2C1.setAttribute('href', '../V2S2_RED.png')
                            _GLIST_.lights.S3C1.setAttribute('href', '../V1S1_GREEN.png')
                    }

                } else if (data.SEC[0].cantons[_CANTON_].position === 'a2') {
                    clearAllCantons('S1', _CANTON_, 'deleteCenter')
                    console.log(data.SEC[0].cantons[_CANTON_].cid + ' en aiguille a2')
                    //clearAllCantons(_CANTON_, 'a2')
                    switch (data.SEC[0].cantons[_CANTON_].cid) {
                        case 'c1301':
                            clearAllCantons('S1', _CANTON_)
                            console.log(data.SEC[0].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c1301 a2')
                            for (let bits in _GLIST_.aiguilles[0].a2c1301) {
                                console.log(_GLIST_.aiguilles[0].a2c1301[bits])
                                _GLIST_.aiguilles[0].a2c1301[bits].style.fill = '#66D264';
                            }
                            break;
                        case 'c2301':
                            console.log(data.SEC[0].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c2301 a2')
                            for (let bits in _GLIST_.aiguilles[0].a2c2301) {
                                console.log(_GLIST_.aiguilles[0].a2c2301[bits])
                                _GLIST_.aiguilles[0].a2c2301[bits].style.fill = '#66D264';
                            }
                            break;
                    }
                    switch (data.SEC[0].cantons[_CANTON_].dir) {
                        case 'up':
                            _GLIST_.lights.S1C1.setAttribute('href', '../V1S1_GREEN.png')
                            _GLIST_.lights.S2C1.setAttribute('href', '../V2S2_RED.png')
                            _GLIST_.lights.S3C1.setAttribute('href', '../V1S1_RED.png')
                            break;
                        case 'down':
                            _GLIST_.lights.S1C1.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S2C1.setAttribute('href', '../V2S2_GREEN.png')
                            _GLIST_.lights.S3C1.setAttribute('href', '../V1S1_RED.png')
                    }
                }
            }
        }
    }
    return JSON.stringify(fresponse)
}

function getCantonsInfoS2() {
    console.log('-------S2-------')
    let _GLIST_ = cantonsS2
    clearAllCantons('S2');
    let fresponse = {
        trains: []
    }
    for (let _CANTON_ in _GLIST_) {

        console.log(_CANTON_)
        if (_CANTON_ === 'aiguilles') continue;
        if (_CANTON_ === 'arrows') continue;
        if (_CANTON_ === 'lights') continue;
        if (_CANTON_ === 'screens') continue;
        if (_CANTON_ === 'voys') continue;
        _CANTON_--;
        console.log('[❔] ARRAY[' + _CANTON_ + ']')
        /*if(!(data.SEC[1].cantons[_CANTON_].cid)){
            alert('Le cache doit être vidé pour continuer, désolé :(')
        }*/
        console.log(data.SEC[1].cantons[_CANTON_].cid)
        //fill des fleches de dir
        let dir = data.SEC[1].cantons[0].dir;
        /*cantonsS1.lights.S1C2.setAttribute('href', '../V1S1_GREEN.png')
        _GLIST_.lights.S5C2.setAttribute('href', '../V2S2_RED.png')
        _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
        _GLIST_.lights.S2C2.setAttribute('href', '../V2S2_GREEN.png')
        _GLIST_.lights.S4C2.setAttribute('href', '../DS_OFF.png')
        cantonsS1.lights.S3C2.setAttribute('href', '../V1S1_GREEN.png')
        _GLIST_.lights.DEPC2.setAttribute('href', '../V2S2_RED.png')*/
        if (dir === 'up') {
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#707070';
            }
        } else if (dir === 'down') {
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#707070';
            }
        } else {
            for (let bits in _GLIST_.arrows[0]) {
                _GLIST_.arrows[0][bits].style.fill = '#707070';
            }
            for (let bits in _GLIST_.arrows[1]) {
                _GLIST_.arrows[1][bits].style.fill = '#707070';
            }
        }
        dir = data.SEC[1].cantons[1].dir;
        if (dir === 'up') {
            for (let bits in _GLIST_.arrows[2]) {
                _GLIST_.arrows[2][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[3]) {
                _GLIST_.arrows[3][bits].style.fill = '#707070';
            }
        } else if (dir === 'down') {
            for (let bits in _GLIST_.arrows[3]) {
                _GLIST_.arrows[3][bits].style.fill = '#66D264';
            }
            for (let bits in _GLIST_.arrows[2]) {
                _GLIST_.arrows[2][bits].style.fill = '#707070';
            }
        } else {
            for (let bits in _GLIST_.arrows[2]) {
                _GLIST_.arrows[2][bits].style.fill = '#707070';
            }
            for (let bits in _GLIST_.arrows[3]) {
                _GLIST_.arrows[3][bits].style.fill = '#707070';
            }
        }
        if (data.SEC[1].cantons[_CANTON_].position === 'r' && data.SEC[1].cantons[_CANTON_].cid === 'c1102') {
            _GLIST_.voys['NORA1'].setAttribute('href', '../ON.png');
            _GLIST_.voys['A1Dev'].setAttribute('href', '../OFF.png')
        }
        if (data.SEC[1].cantons[_CANTON_].position === 'r' && data.SEC[1].cantons[_CANTON_].cid === 'c1202') {
            _GLIST_.voys['NORA2'].setAttribute('href', '../ON.png');
            _GLIST_.voys['A2Dev'].setAttribute('href', '../OFF.png')
            _GLIST_.voys['ENT'].setAttribute('href', '../OFF.png')
            _GLIST_.voys['DEP'].setAttribute('href', '../OFF.png')
        }
        if (data.SEC[1].cantons[_CANTON_].cid === 'c1102' && data.SEC[1].cantons[_CANTON_].position === 'a1') {
            _GLIST_.voys['NORA1'].setAttribute('href', '../OFF.png');
            _GLIST_.voys['A1Dev'].setAttribute('href', '../ON.png')
        }
        if (data.SEC[1].cantons[_CANTON_].cid === 'c1202' && data.SEC[1].cantons[_CANTON_].dir === 'up') {
            _GLIST_.voys['NORA2'].setAttribute('href', '../OFF.png');
            _GLIST_.voys['A2Dev'].setAttribute('href', '../ON.png')
            _GLIST_.voys['ENT'].setAttribute('href', '../ON.png')
            _GLIST_.voys['DEP'].setAttribute('href', '../OFF.png')
        }
        if (data.SEC[1].cantons[_CANTON_].cid === 'c1202' && data.SEC[1].cantons[_CANTON_].dir === 'down') {
            _GLIST_.voys['NORA2'].setAttribute('href', '../OFF.png');
            _GLIST_.voys['A2Dev'].setAttribute('href', '../ON.png')
            _GLIST_.voys['ENT'].setAttribute('href', '../OFF.png')
            _GLIST_.voys['DEP'].setAttribute('href', '../ON.png')
        }
        //console.log(data.SEC[0]._GLIST_[0].trains[0]) EXEMPLE DE CHEMIN
        if (data.SEC[1].cantons[_CANTON_].cid === 'c2202') {
            if (data.SEC[1].cantons[_CANTON_].trains.length >= 1) {
                _GLIST_.screens['2202'][1].textContent = data.SEC[1].cantons[_CANTON_].trains[0].tid
                _GLIST_.screens['2202'][0].style.fill = '#3C0A0A'
            } else {
                _GLIST_.screens['2202'][1].textContent = ''
                _GLIST_.screens['2202'][0].style.fill = '#000000'
            }
        }

        if (data.SEC[1].cantons[_CANTON_].cid === 'c1302') {
            if (data.SEC[1].cantons[_CANTON_].trains.length >= 1) {
                _GLIST_.screens['1302'][1].textContent = data.SEC[1].cantons[_CANTON_].trains[0].tid
                _GLIST_.screens['1302'][0].style.fill = '#3C0A0A'
            } else {
                _GLIST_.screens['1302'][1].textContent = ''
                _GLIST_.screens['1302'][0].style.fill = '#000000'
            }
        }

        if (data.SEC[1].cantons[_CANTON_].cid === 'cGPAG1') {
            if (data.SEC[1].cantons[_CANTON_].trains.length >= 1) {
                _GLIST_.screens['PAG1'][1].textContent = data.SEC[1].cantons[_CANTON_].trains[0].tid
                _GLIST_.screens['PAG1'][0].style.fill = '#3C0A0A'
            } else {
                _GLIST_.screens['PAG1'][1].textContent = ''
                _GLIST_.screens['PAG1'][0].style.fill = '#000000'
            }
        }

        if (data.SEC[1].cantons[_CANTON_].trains.length >= 1) { //CANTON OCCUPE
            console.log('[👉] canton ' + (_CANTON_ + 1) + ' occupé')
            console.log(_GLIST_[_CANTON_ + 1])

            if (typeof _GLIST_[_CANTON_ + 1].length === 'undefined') {
                console.log((_CANTON_ + 1) + ' est un canton simple')
                console.log('[🚫] canton ' + (_CANTON_ + 1) + ' occupé')
                let CTARGET = _GLIST_[_CANTON_ + 1]
                CTARGET.style.fill = '#E1A712';


                console.log(_GLIST_.screens)



            } else {
                console.log((_CANTON_ + 1) + ' est une aiguille')
                console.log('[🚫] aiguille ' + (_CANTON_ + 1) + ' occupé')

                /*for(let bits in _GLIST_[_CANTON_+1]){
                    console.log(_GLIST_[_CANTON_+1][bits])
                    _GLIST_[_CANTON_+1][bits].style.fill='#E1A712'
                }*/


                if (data.SEC[1].cantons[_CANTON_].position === 'r') {
                    //clearAllCantons('S2',_CANTON_)
                    for (let bits in _GLIST_[_CANTON_ + 1]) {
                        console.log(_GLIST_[_CANTON_ + 1][bits])
                        _GLIST_[_CANTON_ + 1][bits].style.fill = '#E1A712';
                    }
                } else if (data.SEC[1].cantons[_CANTON_].position === 'a1') {
                    //clearAllCantons(_CANTON_, 'a1')
                    switch (data.SEC[1].cantons[_CANTON_].cid) {
                        case 'c1102':
                            //clearAllCantons('S2',_CANTON_)
                            for (let bits in _GLIST_.aiguilles[0].a1c1102) {
                                console.log(_GLIST_.aiguilles[0].a1c1102[bits])
                                _GLIST_.aiguilles[0].a1c1102[bits].style.fill = '#E1A712';
                            }
                            break;
                        case 'c2402':
                            for (let bits in _GLIST_.aiguilles[0].a1c2402) {
                                console.log(_GLIST_.aiguilles[0].a1c2402[bits])
                                _GLIST_.aiguilles[0].a1c2402[bits].style.fill = '#E1A712';
                            }
                            break;
                    }
                } else if (data.SEC[1].cantons[_CANTON_].position === 'a2') {
                    //clearAllCantons(_CANTON_, 'a2')
                    switch (data.SEC[1].cantons[_CANTON_].cid) {
                        case 'c1202':
                            //clearAllCantons('S2',_CANTON_)
                            for (let bits in _GLIST_.aiguilles[0].a2c1202) {
                                console.log(_GLIST_.aiguilles[0].a2c1202[bits])
                                _GLIST_.aiguilles[0].a2c1202[bits].style.fill = '#E1A712';
                            }
                            break;
                        case 'cGA2PAG':
                            for (let bits in _GLIST_.aiguilles[0].a2cEND) {
                                console.log(_GLIST_.aiguilles[0].a2cEND[bits])
                                _GLIST_.aiguilles[0].a2cEND[bits].style.fill = '#E1A712';
                            }
                            break;
                    }
                }
            }

            for (let _TRAIN_ in data.SEC[1].cantons[_CANTON_].trains) {
                console.log(data.SEC[1].cantons[_CANTON_].trains[_TRAIN_]);
                let tid = data.SEC[1].cantons[_CANTON_].trains[_TRAIN_].tid;
                //canton_train.set(_TRAIN_, _CANTON_)
                console.log('_TRAIN_ ' + _TRAIN_ + " _CANTON_ " + _CANTON_)

                fresponse.trains.push({
                    cantonId: data.SEC[1].cantons[_CANTON_].cid,
                    cantonIndex: _CANTON_,
                    trainId: tid,
                    trainIndex: _TRAIN_
                })
            }
        } else {
            if (typeof _GLIST_[_CANTON_ + 1].length === 'undefined') { //CANTON LIBRE
                console.log((_CANTON_ + 1) + ' est un canton simple')
                console.log('[🚫] canton ' + (_CANTON_ + 1) + ' libre')
                let CTARGET = _GLIST_[_CANTON_ + 1]
                CTARGET.style.fill = '#707070';
            } else {
                console.log((_CANTON_ + 1) + ' est une aiguille')
                console.log('[🚫] aiguille ' + (_CANTON_ + 1) + ' libre')
                console.log(data.SEC[1].cantons[_CANTON_])

                if (data.SEC[1].cantons[_CANTON_].position === 'r') {
                    console.log(data.SEC[1].cantons[_CANTON_].cid + ' en neutre')
                    //clearAllCantons('S2',_CANTON_)
                    for (let bits in _GLIST_[_CANTON_ + 1]) {
                        console.log(_GLIST_[_CANTON_ + 1][bits])
                        _GLIST_[_CANTON_ + 1][bits].style.fill = '#66D264';
                    }
                    if (data.SEC[1].cantons[_CANTON_].cid === 'c1102') {
                        cantonsS1.lights.S1C2.setAttribute('href', '../V1S1_GREEN.png')
                        _GLIST_.lights.S5C2.setAttribute('href', '../V2S2_RED.png')
                        _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
                        _GLIST_.lights.S2C2.setAttribute('href', '../V2S2_GREEN.png')
                        _GLIST_.lights.S4C2.setAttribute('href', '../DS_OFF.png')
                    } else if (data.SEC[1].cantons[_CANTON_].cid === 'c1202') {
                        cantonsS1.lights.S3C2.setAttribute('href', '../V1S1_GREEN.png')
                        _GLIST_.lights.DEPC2.setAttribute('href', '../V2S2_RED.png')
                    }
                } else if (data.SEC[1].cantons[_CANTON_].position === 'a1') {
                    //clearAllCantons('S2',_CANTON_,'deleteCenter')
                    console.log(data.SEC[1].cantons[_CANTON_].cid + ' en aiguille a1')
                    //clearAllCantons(_CANTON_, 'a1')
                    switch (data.SEC[1].cantons[_CANTON_].cid) {
                        case 'c1102':
                            clearAllCantons('S2', _CANTON_, 'a1p')
                            console.log(data.SEC[1].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c1102 a1')
                            for (let bits in _GLIST_.aiguilles[0].a1c1102) {
                                console.log(_GLIST_.aiguilles[0].a1c1102[bits])
                                _GLIST_.aiguilles[0].a1c1102[bits].style.fill = '#66D264';
                            }
                            break;
                        case 'c2402':
                            clearAllCantons('S2', _CANTON_, 'a1p')
                            console.log(data.SEC[1].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c2402 a1')
                            for (let bits in _GLIST_.aiguilles[0].a1c2402) {
                                console.log(_GLIST_.aiguilles[0].a1c2402[bits])
                                _GLIST_.aiguilles[0].a1c2402[bits].style.fill = '#66D264';
                            }
                            break;
                    }
                    switch (data.SEC[1].cantons[_CANTON_].dir) {
                        case 'up':
                            cantonsS1.lights.S1C2.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S5C2.setAttribute('href', '../V2S2_GREEN.png')
                            _GLIST_.lights.S6C2.setAttribute('href', '../DS_ON.png')
                            _GLIST_.lights.S4C2.setAttribute('href', '../DS_OFF.png')
                            _GLIST_.lights.S2C2.setAttribute('href', '../V2S2_RED.png')
                            break;
                        case 'down':
                            cantonsS1.lights.S1C2.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S5C2.setAttribute('href', '../V2S2_RED.png')
                            _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
                            _GLIST_.lights.S2C2.setAttribute('href', '../V2S2_RED.png')
                            _GLIST_.lights.S4C2.setAttribute('href', '../DS_ON.png')
                            break;
                        case 'r':
                            cantonsS1.lights.S1C2.setAttribute('href', '../V1S1_GREEN.png')
                            _GLIST_.lights.S5C2.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
                            _GLIST_.lights.S2C2.setAttribute('href', '../V2S2_GREEN.png')
                            _GLIST_.lights.S4C2.setAttribute('href', '../DS_OFF.png')
                            break;
                    }

                } else if (data.SEC[1].cantons[_CANTON_].position === 'a2') {
                    //clearAllCantons('S2',_CANTON_,'deleteCenter')
                    console.log(data.SEC[1].cantons[_CANTON_].cid + ' en aiguille a2')
                    //clearAllCantons(_CANTON_, 'a2')
                    switch (data.SEC[1].cantons[_CANTON_].cid) {
                        case 'c1202':
                            clearAllCantons('S2', _CANTON_, 'a2p')
                            console.log(data.SEC[1].cantons[_CANTON_].cid + ' démarre son itération de peinture pour c1202 a2')
                            for (let bits in _GLIST_.aiguilles[0].a2c1202) {
                                console.log(_GLIST_.aiguilles[0].a2c1202[bits])
                                _GLIST_.aiguilles[0].a2c1202[bits].style.fill = '#66D264';
                            }
                            break;
                        case 'cGA2PAG':
                            clearAllCantons('S2', _CANTON_, 'a2p')
                            console.log(data.SEC[1].cantons[_CANTON_].cid + ' démarre son itération de peinture pour cPAG1 a2')
                            for (let bits in _GLIST_.aiguilles[0].a2cEND) {
                                console.log(_GLIST_.aiguilles[0].a2cEND[bits])
                                _GLIST_.aiguilles[0].a2cEND[bits].style.fill = '#66D264';
                            }
                            break;
                    }
                    switch (data.SEC[1].cantons[_CANTON_].dir) {
                        case 'up':
                            cantonsS1.lights.S3C2.setAttribute('href', '../V1S1_RED.png')
                            _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
                            _GLIST_.lights.DEPC2.setAttribute('href', '../V2S2_GREEN.png')
                            break;
                        case 'down':
                            cantonsS1.lights.S3C2.setAttribute('href', '../V1S1_GREEN.png')
                            _GLIST_.lights.S6C2.setAttribute('href', '../DS_OFF.png')
                            _GLIST_.lights.DEPC2.setAttribute('href', '../V2S2_RED.png')
                            break;
                        case 'r':
                            cantonsS1.lights.S3C2.setAttribute('href', '../V1S1_GREEN.png')
                            _GLIST_.lights.DEPC2.setAttribute('href', '../V2S2_RED.png')
                            break;
                    }
                }
            }
        }
    }
    return JSON.stringify(fresponse)
}

function verifyExistingTrain(id) {
    console.log('-------IL EXISTE????---------')
    console.log('ON CHERCHE LE N° ' + id)
    let idArray = []
    let trains = JSON.parse(getCantonsInfo()) //ça foire ici
    console.log(trains.trains)
    for (let train in trains.trains) {
        let _TID_ = trains.trains[train].trainId; //en gros on récupère l'id de chaque train existant
        console.log(_TID_)
        idArray.push(JSON.parse(_TID_))
    }
    trains = JSON.parse(getCantonsInfoS2())
    for (let train in trains.trains) {
        let _TID_ = trains.trains[train].trainId; //en gros on récupère l'id de chaque train existant
        console.log(_TID_)
        idArray.push(JSON.parse(_TID_))
    }
    console.log(idArray)
    if (!(idArray.includes(id))) {
        return false
    }
    console.log('ALLELUYA IL EXISTE')
    return true;
}

function isDigit(n) {
    if (!n) return false; //en gros c'est vide
    let TTARGET = parseInt(n)
    if (isNaN(TTARGET)) return false; //en gros c'est pas digit, c'est une lettre
    console.log(TTARGET)
    return true;
}

/**
 * Peint tout les _GLIST_ d'aiguille en gris afin de les reset
 * @param _CANTON_ il faut fournir l'iteration _canton_
 * @param exeption une aiguille qui ne sera pas reset
 */
function clearAllCantons(list, _CANTON_, mode) {
    let _GLIST_ = false
    switch (list) {
        case 'S1':
            _GLIST_ = cantonsS1
            if (!(mode)) {

                console.log('ordre d\'effacement avec it ' + _CANTON_)
                for (let bits in _GLIST_[_CANTON_ + 1]) {
                    //console.log(_GLIST_[_CANTON_+1][bits])
                    _GLIST_[_CANTON_ + 1][bits].style.fill = '#707070';
                    console.log('effacage de ' + (_CANTON_ + 1))
                }
                /*if(!(_GLIST_.aiguilles)){
                    alert('Le cache doit être vidé pour continuer, désolé :(')
                    return;
                }*/
                for (let bits in _GLIST_.aiguilles[0].a1c1301) {
                    //console.log(_GLIST_.aiguilles[0].a1c1301[bits])
                    _GLIST_.aiguilles[0].a1c1301[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a1c2301) {
                    //console.log(_GLIST_.aiguilles[0].a1c2301[bits])
                    _GLIST_.aiguilles[0].a1c2301[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a2c1301) {
                    //console.log(_GLIST_.aiguilles[0].a2c1301[bits])
                    _GLIST_.aiguilles[0].a2c1301[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a2c2301) {
                    //console.log(_GLIST_.aiguilles[0].a2c2301[bits])
                    _GLIST_.aiguilles[0].a2c2301[bits].style.fill = '#707070'
                }
            } else {
                if (mode === 'deleteCenter') {
                    for (let bits in _GLIST_[3]) {
                        _GLIST_[3][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }

                    for (let bits in _GLIST_[8]) {
                        _GLIST_[8][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }
                }
            }
            break;
        case 'S2':
            _GLIST_ = cantonsS2
            if (!(mode)) {

                console.log('ordre d\'effacement avec it ' + _CANTON_)
                for (let bits in _GLIST_[_CANTON_ + 1]) {
                    //console.log(_GLIST_[_CANTON_+1][bits])
                    _GLIST_[_CANTON_ + 1][bits].style.fill = '#707070';
                    console.log('effacage de ' + (_CANTON_ + 1))
                }
                for (let bits in _GLIST_.aiguilles[0].a1c1102) {
                    //console.log(_GLIST_.aiguilles[0].a1c1301[bits])
                    _GLIST_.aiguilles[0].a1c1102[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a1c2402) {
                    //console.log(_GLIST_.aiguilles[0].a1c2301[bits])
                    _GLIST_.aiguilles[0].a1c2402[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a2c1202) {
                    //console.log(_GLIST_.aiguilles[0].a2c1301[bits])
                    _GLIST_.aiguilles[0].a2c1202[bits].style.fill = '#707070'
                }
                for (let bits in _GLIST_.aiguilles[0].a2cEND) {
                    //console.log(_GLIST_.aiguilles[0].a2c2301[bits])
                    _GLIST_.aiguilles[0].a2cEND[bits].style.fill = '#707070'
                }
            } else {
                if (mode === 'deleteCenter') {
                    for (let bits in _GLIST_[1]) {
                        _GLIST_[1][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }

                    for (let bits in _GLIST_[2]) {
                        _GLIST_[2][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }

                    for (let bits in _GLIST_[8]) {
                        _GLIST_[8][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }
                    _GLIST_[10].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                } else if (mode === 'a1p') {
                    for (let bits in _GLIST_[1]) {
                        _GLIST_[1][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }
                    for (let bits in _GLIST_[8]) {
                        _GLIST_[8][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }
                } else if (mode === 'a2p') {
                    for (let bits in _GLIST_[2]) {
                        _GLIST_[2][bits].style.fill = '#707070'; //suppression des couleurs sur les parallèles
                    }
                }
            }
            break;
    }
}

copyConfig.addEventListener('click', () => {
    showRequest.innerHTML=window.actualRequest
})

let btnAdminAccess = document.getElementById('btnAdminAccess')
btnAdminAccess.addEventListener('click',()=>{
    document.location.href='admin.html'
})
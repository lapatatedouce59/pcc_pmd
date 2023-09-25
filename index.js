let startLoad = Date.now()

let btnACQU = document.getElementById('btnACQU')
let btnAG = document.getElementById('btnAG')
let btnAG2 = document.getElementById('btnAG2')

let electricLoaded = false
let dataLoaded = false
let tco1Loaded = false
let tco2Loaded = false

let fileIntervals=[]

//? LOAD FORMAT SELECT
let formatSelect = document.getElementById('formatSelect')
let groupFormatPA = document.getElementById('groupFormatPA')
let fstation = document.getElementById('fstation')
let ftrain = document.getElementById('ftrain')
let zebiTaRienSelectionne = document.getElementById('zebiTaRienSelectionne')

groupFormatPA.style.display='none'
fstation.style.display='none'
ftrain.style.display='none'

formatSelect.addEventListener('input', ()=>{
    zebiTaRienSelectionne.style.display='none'
    if(formatSelect.value==='groupFormatPA'){
        fstation.style.display='none'
        ftrain.style.display='none'
        groupFormatPA.style.display='inline'
    }
    if(formatSelect.value==='fstation'){
        groupFormatPA.style.display='none'
        ftrain.style.display='none'
        fstation.style.display='inline'
    }
    if(formatSelect.value==='ftrain'){
        groupFormatPA.style.display='none'
        ftrain.style.display='inline'
        fstation.style.display='none'
    }

})


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

let comAutHTSS04 = document.getElementById('comAutHTSS04')
let comAutHTSS05 = document.getElementById('comAutHTSS05')
let comCoupFSSS04 = document.getElementById('comCoupFSSS04')
let comCoupFSSS05 = document.getElementById('comCoupFSSS05')

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
let dictS1 = false

let S1 = document.getElementById('s1svg')
S1.addEventListener('load', () => {
    let s1svgDoc = S1.contentDocument;
    dictS1 = {
        cantons: {
            'c1101': s1svgDoc.getElementById('1'),
            'c1201': s1svgDoc.getElementById('2'),
            'c1301': [s1svgDoc.getElementById('3'), s1svgDoc.getElementById('4'), s1svgDoc.getElementById('5')],
            'c1401': s1svgDoc.getElementById('6'),
            'c1501': s1svgDoc.getElementById('7'),
            'c2101': s1svgDoc.getElementById('8'),
            'c2201': s1svgDoc.getElementById('9'),
            'c2301': [s1svgDoc.getElementById('10'), s1svgDoc.getElementById('11'), s1svgDoc.getElementById('12')],
            'c2401': s1svgDoc.getElementById('13'),
            'c2501': s1svgDoc.getElementById('14'),
        },
        aiguilles: [
            {
                id: 'C1',
                a1c1301: [s1svgDoc.getElementById('15'), s1svgDoc.getElementById('19')],
                a1c2301: [s1svgDoc.getElementById('17'), s1svgDoc.getElementById('20')],
                a2c1301: [s1svgDoc.getElementById('16'), s1svgDoc.getElementById('19')],
                a2c2301: [s1svgDoc.getElementById('18'), s1svgDoc.getElementById('20')]
            }
        ],
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
            '1401': [s1svgDoc.getElementById('sc1401'), s1svgDoc.getElementById('txtSc1401')],
            '1101': [s1svgDoc.getElementById('sc1101'), s1svgDoc.getElementById('txtSc1101')],
            '1201': [s1svgDoc.getElementById('sc1201'), s1svgDoc.getElementById('txtSc1201')],
            '2401': [s1svgDoc.getElementById('sc2401'), s1svgDoc.getElementById('txtSc2401')],
            '2501': [s1svgDoc.getElementById('sc2501'), s1svgDoc.getElementById('txtSc2501')]
        },
        voys: {
            'NOR': s1svgDoc.getElementById('voyC1Nor'),
            'A1Dev': s1svgDoc.getElementById('voyC1A1Dev'),
            'A2Dev': s1svgDoc.getElementById('voyC1A2Dev'),
            'GAR': s1svgDoc.getElementById('voyC1Gar'),
            'INSR': s1svgDoc.getElementById('voyC1Insr'),
            'AUTO': s1svgDoc.getElementById('voyC1Auto')
        },
        stationVoy:[
            {
                'name': "c1401",
                'dso': s1svgDoc.getElementById('dsoMSTOV1'),
                'sso': s1svgDoc.getElementById('ssoMSTOV1'),
                'voy': s1svgDoc.getElementById('voyMSTOV1')
            },
            {
                'name': "c2201",
                'dso': s1svgDoc.getElementById('dsoMSTOV2'),
                'sso': s1svgDoc.getElementById('ssoMSTOV2'),
                'voy': s1svgDoc.getElementById('voyMSTOV2')
            }
        ]

    }
    tco1Loaded=true
})
let dictS2 = false

let S2 = document.getElementById('s2svg')
S2.addEventListener('load', () => {
    let s2svgDoc = S2.contentDocument;
    dictS2 = {
        cantons: {
            'c1102': [s2svgDoc.getElementById('1'), s2svgDoc.getElementById('2'), s2svgDoc.getElementById('3')],
            'c1202': [s2svgDoc.getElementById('4'), s2svgDoc.getElementById('5'), s2svgDoc.getElementById('6')],
            'c1302': s2svgDoc.getElementById('7'),
            'c1402': s2svgDoc.getElementById('8'),
            'c2102': s2svgDoc.getElementById('9'),
            'c2202': s2svgDoc.getElementById('10'),
            'c2302': s2svgDoc.getElementById('11'),
            'c2402': [s2svgDoc.getElementById('12'), s2svgDoc.getElementById('13'), s2svgDoc.getElementById('14')],
            'cGA2PAG': [s2svgDoc.getElementById('20'), s2svgDoc.getElementById('22'), s2svgDoc.getElementById('19')],
            'cGPAG1': s2svgDoc.getElementById('15')
        },
        aiguilles: [
            {
                id: 'C2',
                a1c1102: [s2svgDoc.getElementById('16'), s2svgDoc.getElementById('21')],
                a1c2402: [s2svgDoc.getElementById('17'), s2svgDoc.getElementById('23')],
                a2c1202: [s2svgDoc.getElementById('18'), s2svgDoc.getElementById('24')],
                a2cEND: [s2svgDoc.getElementById('19'), s2svgDoc.getElementById('22')]
            }
        ],
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
        },
        stationVoy:[
            {
                'name': "c1302",
                'dso': s2svgDoc.getElementById('dsoSTOV1'),
                'sso': s2svgDoc.getElementById('ssoSTOV1'),
                'voy': s2svgDoc.getElementById('voySTOV1')
            },
            {
                'name': "c2202",
                'dso': s2svgDoc.getElementById('dsoSTOV2'),
                'sso': s2svgDoc.getElementById('ssoSTOV2'),
                'voy': s2svgDoc.getElementById('voySTOV2')
            }
        ]

    }
    tco2Loaded=true
})

let elecInfo = false
let ELEC = document.getElementById('elecSvg')
ELEC.addEventListener('load', () => {
    let elecSvgDoc = ELEC.contentDocument;
    elecInfo = {
        ctns: {
            '101':[elecSvgDoc.getElementById('ce101a'),elecSvgDoc.getElementById('ce101b')],
            '201':[elecSvgDoc.getElementById('ce201a'),elecSvgDoc.getElementById('ce201b')],
            '301':[elecSvgDoc.getElementById('ce301a'),elecSvgDoc.getElementById('ce301b')],
            '401':[elecSvgDoc.getElementById('ce401a'),elecSvgDoc.getElementById('ce401b')],
            '501':[elecSvgDoc.getElementById('ce501a'),elecSvgDoc.getElementById('ce501b')],
            '102':[elecSvgDoc.getElementById('ce102a'),elecSvgDoc.getElementById('ce102b')],
            '202':[elecSvgDoc.getElementById('ce202a'),elecSvgDoc.getElementById('ce202b')],
            '302':[elecSvgDoc.getElementById('ce302a'),elecSvgDoc.getElementById('ce302b')],
            '402':[elecSvgDoc.getElementById('ce402a'),elecSvgDoc.getElementById('ce402b')]
        },
        ru: {
            '101': elecSvgDoc.getElementById('r101'),
            '201': elecSvgDoc.getElementById('r201'),
            '301': elecSvgDoc.getElementById('r301'),
            '401': elecSvgDoc.getElementById('r401'),
            '501': elecSvgDoc.getElementById('r501'),
            '102': elecSvgDoc.getElementById('r102'),
            '202': elecSvgDoc.getElementById('r202'),
            '302': elecSvgDoc.getElementById('r302'),
            '402': elecSvgDoc.getElementById('r402')
        },
        ss: {
            'ss04': [elecSvgDoc.getElementById('ss04'), elecSvgDoc.getElementById('ss04a'),elecSvgDoc.getElementById('ss04b'), elecSvgDoc.getElementById('ss04c'), elecSvgDoc.getElementById('ss04d'), elecSvgDoc.getElementById('ss04e')],
            'ss05': [elecSvgDoc.getElementById('ss05'), elecSvgDoc.getElementById('ss05a'),elecSvgDoc.getElementById('ss05b'), elecSvgDoc.getElementById('ss05c'), elecSvgDoc.getElementById('ss05d')]
        },
        pr: {
            'MSTO': {
                "DHTMSTO": elecSvgDoc.getElementById('dhtMSTO'),
                "DJVSS04MSTO": elecSvgDoc.getElementById('dvMSTOSS04'),
                "DJVSS05MSTO": elecSvgDoc.getElementById('dvMSTOSS05')
            },
            'GLARNER':{
                "DHTGLARNER": elecSvgDoc.getElementById('dhtGLA'),
                "DJVSS05GLANER": elecSvgDoc.getElementById('dvGLASS05')
            }
        }
    }
    electricLoaded=true
})


sm.registerSound("bip", './src/pltp/snds/bip.mp3');
sm.registerSound("join", './src/global/join.mp3');
sm.registerSound("left", './src/global/leave.mp3');
sm.registerSound("enter", './src/global/enter.mp3');
sm.registerSound("wb", './src/global/wb.mp3');
sm.registerSound("ring", './src/formats/det/ring.mp3');

const blinkIntervalId = new Map()

let beepIntervalId = false

let alreadyBeep = false

import sm from './sm.js'
sm.init()

let data = false

let reloadInter = 0

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
            if(data.op===10){
                let uuid=data.joined.uuid
                let newUserName=data.joined.uname
                data=data.content
                toast.innerHTML='L\'utilisateur '+newUserName+' a rejoins le PCC avec l\'UUID '+uuid+' !'
                sm.playSound('enter')
                toast.className="show";
                setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
            }

            if(data.op===11){
                toast.innerHTML=data.name+' a quitté la page.'
                toast.className="show";
                data=data.content
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
                dataLoaded=true
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
                            if(!(elemid===(prop+name))) continue;//si voyHTSS04 === voyHT + SS04
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
                    
                    if(data[elemid]){
                        com.checked = data[elemid]
                    } else if(data.SS[0][elemid]) {
                        for(let ss of data.SS){
                            com.checked=ss[elemid]
                        }
                    }
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
                reload()
                //}
                /*if((elecInfo===false)||(cantonsS1===false)||(cantonsS2===false)){
                    setInterval(reload, 250)
                } else {
                    clearInterval(reloadInter)
                }*/
                function reload(){
                    //getCantonsInfo()
                    //getCantonsInfoS2()
                    loadElectricalInfos()
                    refreshTCO()
                    refreshComPlat()
                }
                
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



comAutHTSS04.addEventListener('input', ()=>{
    actualRequest = JSON.stringify({
        op: 202,
        execute: "AUTHTSS04-COM",
        state: comAutHTSS04.checked,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
comAutHTSS05.addEventListener('input', ()=>{
    actualRequest = JSON.stringify({
        op: 202,
        execute: "AUTHTSS05-COM",
        state: comAutHTSS05.checked,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

comCoupFSSS04.addEventListener('input', ()=>{
    actualRequest = JSON.stringify({
        op: 202,
        execute: "COUPFSSS04-COM",
        state: comCoupFSSS04.checked,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})
comCoupFSSS05.addEventListener('input', ()=>{
    actualRequest = JSON.stringify({
        op: 202,
        execute: "COUPFSSS05-COM",
        state: comCoupFSSS05.checked,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
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
    refreshTCO()
})



function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getCantonsInfo(id) {
    let response = { cid: false, sindex: false, cindex: false, trains:[], paItis:[], states: {}, station: Boolean}
    for(let sec in data.SEC){
        response.paItis=data.SEC[sec].ITI
        for(let ctn in data.SEC[sec].cantons){
            if (!(data.SEC[sec].cantons[ctn].cid===id)) continue;
            response.cid=data.SEC[sec].cantons[ctn].cid
            response.sindex=sec
            response.cindex=ctn
            response.states=data.SEC[sec].cantons[ctn].states
            response.trains=data.SEC[sec].cantons[ctn].trains
            if(data.SEC[sec].cantons[ctn].type){
                if(data.SEC[sec].cantons[ctn].type==='quai') response.station=true;
            }
        }
    }
    return response;
}

/*function getItiInfo(cid){
    for(let sec of data.SEC){
        for(let itil of Object.entries(sec.ITI)){
            for(let vitil of Object.entries(itil[1])){
                for(let iti of vitil[1]){
                    let ctnCode = cid.replace('c','')
                    console.log(ctnCode)
                    console.log(iti.code.search(ctnCode))
                    if(!(iti.code.search(ctnCode))) continue;
                    console.log(iti)
                }
            }
        }
    }
}*/

function refreshTCO(){
    for(let voys of Object.entries(dictS1.voys)){
        voys[1].setAttribute('href', '../OFF.png')
    }
    for(let voys of Object.entries(dictS2.voys)){
        voys[1].setAttribute('href', '../OFF.png')
    }
    for(let sta of dictS1.stationVoy){
        for(let sec of data.SEC){
            if(!(sec.id==='1')) continue;
            for(let ctn of sec.cantons){
                if(!(ctn.cid===sta.name)) continue;
                if(ctn.states.DSO===true){
                    sta.dso.setAttribute('href', '../DSO_ON.png')
                } else {
                    sta.dso.setAttribute('href', '../DSO_OFF.png')
                }
                if(ctn.states.SSO===true){
                    sta.sso.setAttribute('href', '../SSO_ON.png')
                } else {
                    sta.sso.setAttribute('href', '../SSO_OFF.png')
                }
                if(ctn.states.status===false){
                    sta.voy.style.fill='#6B6B6B'
                } else if(ctn.states.status==='valid'){
                    sta.voy.style.fill='#377BFF'
                } else if(ctn.states.status==='inscrit'){
                    sta.voy.style.fill='#37DBFF'
                } else if(ctn.states.status==='sharing'){
                    sta.voy.style.fill='#FFFFFF'
                } else if(ctn.states.status==='departure'){
                    sta.voy.style.fill='#FFE500'
                } else if(ctn.states.status==='def'){
                    let cnt = 0
                    let intervalId = setInterval(async()=>{
                        sta.voy.style.fill='#FF0000'
                        await sleep(200)
                        sta.voy.style.fill='#6B6B6B'
                        await sleep(200)
                        cnt++
                        if(cnt===30){
                            clearInterval(intervalId)
                            if(ctn.states.status===false){
                                sta.voy.style.fill='#6B6B6B'
                            } else if(ctn.states.status==='valid'){
                                sta.voy.style.fill='#377BFF'
                            } else if(ctn.states.status==='inscrit'){
                                sta.voy.style.fill='#37DBFF'
                            } else if(ctn.states.status==='sharing'){
                                sta.voy.style.fill='#FFFFFF'
                            } else if(ctn.states.status==='departure'){
                                sta.voy.style.fill='#FFE500'
                            }
                        }
                    },400)
                }
            }
        }
    }

    for(let sta of dictS2.stationVoy){
        for(let sec of data.SEC){
            if(!(sec.id==='2')) continue;
            for(let ctn of sec.cantons){
                if(!(ctn.cid===sta.name)) continue;
                if(ctn.states.DSO===true){
                    sta.dso.setAttribute('href', '../DSO_ON.png')
                } else {
                    sta.dso.setAttribute('href', '../DSO_OFF.png')
                }
                if(ctn.states.SSO===true){
                    sta.sso.setAttribute('href', '../SSO_ON.png')
                } else {
                    sta.sso.setAttribute('href', '../SSO_OFF.png')
                }
            }
        }
    }
    for(let ctn of Object.entries(dictS1.cantons)){
        if(ctn[1].length===3){
            for(let part of ctn[1]){
                part.style.fill='#707070'
            }
        } else ctn[1].style.fill='#707070'
    }
    for(let ctn of Object.entries(dictS2.cantons)){
        if(ctn[1].length===3){
            for(let part of ctn[1]){
                part.style.fill='#707070'
            }
        } else ctn[1].style.fill='#707070'
    }
    for(let aig of Object.entries(dictS1.aiguilles[0])){
        if(aig[0]==='id') continue;
        for(let part of aig[1]){
            part.style.fill='#707070'
        }
    }
    for(let aig of Object.entries(dictS2.aiguilles[0])){
        if(aig[0]==='id') continue;
        for(let part of aig[1]){
            part.style.fill='#707070'
        }
    }
    for(let arrlist of dictS1.arrows){
        for(let arr of arrlist){
            arr.style.fill='#707070'
        }
    }
    for(let arrlist of dictS2.arrows){
        for(let arr of arrlist){
            arr.style.fill='#707070'
        }
    }
    
    for(let sec of data.SEC){
        //? Gestion feux S1
        for(let lights of Object.entries(dictS1.lights)){
            lights[1].setAttribute('href', '../signals/SM-RNT.png');
        }
        for(let lights of Object.entries(dictS2.lights)){
            lights[1].setAttribute('href', '../signals/SM-RNT.png');
        }
        if(itiInfo('2201_2401')){
            if(isOccupied('c2301')||isOccupied('c2401')){
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            } else {
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-VT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            }
        } 
        if(itiInfo('2401_2201')){
            if(isOccupied('c2301')||isOccupied('c2201')){
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
            } else {
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-VT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
            }
        } 
        if(itiInfo('2401_1401')){
            if(isOccupied('c2301')||isOccupied('c1401')||isOccupied('c1301')){
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RT.png');
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
            } else {
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-JT.png');
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
            }
        } 
        if(itiInfo('2201_1201')){
            if(isOccupied('c2301')||isOccupied('c1201')||isOccupied('c1301')){
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RT.png');
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            } else {
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-JT.png');
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            }
        } 
        if(itiInfo('1201_1401')){
            if(isOccupied('c2301')||isOccupied('c1401')){
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-VT.png');
            }
        } 
        if(itiInfo('1201_2201')){
            if(isOccupied('c2301')||isOccupied('c2201')||isOccupied('c1301')){
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-RT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            } else {
                dictS1.lights['S1C1'].setAttribute('href', '../signals/SM-JT.png');
                dictS1.lights['S2C1'].setAttribute('href', '../signals/SM-RNT.png');
                dictS1.lights['S3C1'].setAttribute('href', '../signals/SM-RNT.png');
            }
        } 
        if(itiInfo('1501_1202')){
            if(isOccupied('c1102')||isOccupied('c1202')){
                dictS1.lights['S1C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS1.lights['S1C2'].setAttribute('href', '../signals/SM-VT.png');
            }
        } 
        if(itiInfo('1102_1302')){
            if(isOccupied('c1202')||isOccupied('c1302')){
                dictS1.lights['S3C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS1.lights['S3C2'].setAttribute('href', '../signals/SM-VT.png');
            }
        } 
        if(itiInfo('1102_PAG1')){
            if(isOccupied('c1102')||isOccupied('c1202')||isOccupied('cGA2PAG')||isOccupied('cGPAG1')){
                dictS1.lights['S3C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS1.lights['S3C2'].setAttribute('href', '../signals/SM-JT.png');
            }
        }

        //? Gestion feux S2

        if(itiInfo('PAG1_1102')&&(itiInfo('1202_2101')||itiInfo('1202_1501'))){
            if(isOccupied('c1102')||isOccupied('c1202')||isOccupied('cGA2PAG')||isOccupied('cGPAG1')){
                dictS2.lights['DEPC2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['DEPC2'].setAttribute('href', '../signals/SM-JT.png');
            }
        }
        if(itiInfo('1202_2101')){
            if(isOccupied('c1102')||isOccupied('c2402')||isOccupied('c2101')){
                dictS2.lights['S5C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['S5C2'].setAttribute('href', '../signals/SM-JT.png');
            }
        }
        if(itiInfo('1202_1501')){
            if(isOccupied('c1102')||isOccupied('c1501')){
                dictS2.lights['S5C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['S5C2'].setAttribute('href', '../signals/SM-VT.png');
            }
        }
        if(itiInfo('2302_2101')){
            if(isOccupied('c2302')||isOccupied('c2402')||isOccupied('c2101')){
                dictS2.lights['S2C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['S2C2'].setAttribute('href', '../signals/SM-VT.png');
            }
        }
        if(itiInfo('2101_1202')&&(itiInfo('1102_PAG1')||itiInfo('1102_1302'))){
            if(isOccupied('c2402')||isOccupied('c1102')||isOccupied('c1202')){
                dictS2.lights['S4C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['S4C2'].setAttribute('href', '../signals/SM-JT.png');
            }
        }
        if(itiInfo('1302_1102')&&(itiInfo('1202_1501')||itiInfo('1202_2101'))){
            if(isOccupied('c1202')||isOccupied('c1102')||isOccupied('c2401')){
                dictS2.lights['S6C2'].setAttribute('href', '../signals/SM-RT.png');
            } else {
                dictS2.lights['S6C2'].setAttribute('href', '../signals/SM-VT.png');
            }
        }

        //? Gestion voyants
        if((itiInfo('2201_2401'))){
            dictS1.voys['NOR'].setAttribute('href', '../ON.png')
        }
        if(itiInfo('1201_1401')){
            dictS1.voys['INSR'].setAttribute('href', '../ON.png')
        }
        if(itiInfo('2201_1201')){
            dictS1.voys['GAR'].setAttribute('href', '../ON.png')
        }
        if(itiInfo('2302_2101')&&itiInfo('1501_1202')){
            dictS2.voys['NORA1'].setAttribute('href', '../ON.png')
        }
        if(itiInfo('1102_1302')){
            dictS2.voys['NORA2'].setAttribute('href', '../ON.png')
        }
        if(cycleInfo('c6p2')){
            dictS2.voys['ENT'].setAttribute('href', '../ON.png')
        }
        if(cycleInfo('c7p2')||cycleInfo('c2p2')){
            dictS2.voys['DEP'].setAttribute('href', '../ON.png')
        }
        if(cycleInfo('c1p2')){
            dictS2.voys['SP'].setAttribute('href', '../ON.png')
        }
        for(let ctn of sec.cantons){
            let ctninfo = getCantonsInfo(ctn.cid)
            if((ctninfo.cid==='c1401')||(ctninfo.cid==='c2201')||(ctninfo.cid==='cGPAG1')||(ctninfo.cid==='c2202')||(ctninfo.cid==='c1302')||(ctninfo.cid==='c1101')||(ctninfo.cid==='c1201')||(ctninfo.cid==='c2401')||(ctninfo.cid==='c2501')){
                if(ctn.cid==='c1401'){
                    if(ctn.trains.length>0){
                        dictS1.screens['1401'][0].style.fill = '#3C0A0A'
                        dictS1.screens['1401'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['1401'][0].style.fill = '#000'
                        dictS1.screens['1401'][1].textContent=''
                    }
                }
                if(ctn.cid==='c2201'){
                    if(ctn.trains.length>0){
                        dictS1.screens['2201'][0].style.fill = '#3C0A0A'
                        dictS1.screens['2201'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['2201'][0].style.fill = '#000'
                        dictS1.screens['2201'][1].textContent=''
                    }
                }
                if(ctn.cid==='cGPAG1'){
                    if(ctn.trains.length>0){
                        dictS2.screens['PAG1'][0].style.fill = '#3C0A0A'
                        dictS2.screens['PAG1'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS2.screens['PAG1'][0].style.fill = '#000'
                        dictS2.screens['PAG1'][1].textContent=''
                    }
                }
                if(ctn.cid==='c2202'){
                    if(ctn.trains.length>0){
                        dictS2.screens['2202'][0].style.fill = '#3C0A0A'
                        dictS2.screens['2202'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS2.screens['2202'][0].style.fill = '#000'
                        dictS2.screens['2202'][1].textContent=''
                    }
                }
                if(ctn.cid==='c1302'){
                    if(ctn.trains.length>0){
                        dictS2.screens['1302'][0].style.fill = '#3C0A0A'
                        dictS2.screens['1302'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS2.screens['1302'][0].style.fill = '#000'
                        dictS2.screens['1302'][1].textContent=''
                    }
                }
                if(ctn.cid==='c1101'){
                    if(ctn.trains.length>0){
                        dictS1.screens['1101'][0].style.fill = '#3C0A0A'
                        dictS1.screens['1101'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['1101'][0].style.fill = '#000'
                        dictS1.screens['1101'][1].textContent=''
                    }
                }
                
                if(ctn.cid==='c2401'){
                    if(ctn.trains.length>0){
                        dictS1.screens['2401'][0].style.fill = '#3C0A0A'
                        dictS1.screens['2401'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['2401'][0].style.fill = '#000'
                        dictS1.screens['2401'][1].textContent=''
                    }
                }
                if(ctn.cid==='c2501'){
                    if(ctn.trains.length>0){
                        dictS1.screens['2501'][0].style.fill = '#3C0A0A'
                        dictS1.screens['2501'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['2501'][0].style.fill = '#000'
                        dictS1.screens['2501'][1].textContent=''
                    }
                }
                if(ctn.cid==='c1201'){
                    if(ctn.trains.length>0){
                        dictS1.screens['1201'][0].style.fill = '#3C0A0A'
                        dictS1.screens['1201'][1].textContent=ctn.trains[0].tid
                    } else {
                        dictS1.screens['1201'][0].style.fill = '#000'
                        dictS1.screens['1201'][1].textContent=''
                    }
                }
            }
            if((ctninfo.cid==='c1301')||(ctninfo.cid==='c2301')){
                //console.log('lol')
                for(let itil of Object.entries(sec.ITI)){
                    for(let vitil of Object.entries(itil[1])){
                        for(let iti of vitil[1]){
                            //console.log(iti)
                            if(((iti.code==='1201_1401')&&(iti.active))||((iti.code==='1401_1201')&&(iti.active))){
                                if(ctn.cid==='c1301'){
                                    if(ctn.trains.length>0){
                                        for(let parts of dictS1.cantons.c1301){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else {
                                        for(let parts of dictS1.cantons.c1301){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } else if(((iti.code==='2201_2401')&&(iti.active))||((iti.code==='2401_2201')&&(iti.active))){
                                if(ctn.cid==='c2301'){
                                    if(ctn.trains.length>0){
                                        for(let parts of dictS1.cantons.c2301){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else {
                                        for(let parts of dictS1.cantons.c2301){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } else if(((iti.code==='1201_2201')&&(iti.active))||((iti.code==='2201_1201')&&(iti.active))){
                                //? Gestion fleches
                                if((iti.code==='1201_2201')&&(iti.active)){
                                    for(let arr of dictS1.arrows[0]){
                                        arr.style.fill='#66D264'
                                    }
                                } else if((iti.code==='2201_1201')&&(iti.active)){
                                    for(let arr of dictS1.arrows[1]){
                                        arr.style.fill='#66D264'
                                    }
                                }
                                dictS1.voys['A2Dev'].setAttribute('href', '../ON.png')
                                //? Gestion colorimétrie des cantons et aiguilles
                                if(ctn.trains.length>0){
                                    if(ctn.cid==='c1301'){
                                        for(let parts of dictS1.aiguilles[0].a2c1301){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else if(ctn.cid==='c2301'){
                                        for(let parts of dictS1.aiguilles[0].a2c2301){
                                            parts.style.fill='#E1A712'
                                        }
                                    }
                                } else {
                                    if(ctn.cid==='c1301'){
                                        for(let parts of dictS1.aiguilles[0].a2c1301){
                                            parts.style.fill='#66D264'
                                        }
                                    } else if(ctn.cid==='c2301'){
                                        for(let parts of dictS1.aiguilles[0].a2c2301){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } else if(((iti.code==='2401_1401')&&(iti.active))||((iti.code==='1401_2401')&&(iti.active))){
                                //? Gestion fleches
                                if((iti.code==='1401_2401')&&(iti.active)){
                                    for(let arr of dictS1.arrows[0]){
                                        arr.style.fill='#66D264'
                                    }
                                } else if((iti.code==='2401_1401')&&(iti.active)){
                                    for(let arr of dictS1.arrows[1]){
                                        arr.style.fill='#66D264'
                                    }
                                }
                                dictS1.voys['A1Dev'].setAttribute('href', '../ON.png')
                                //? Gestion colorimétrie des cantons et aiguilles
                                if(ctn.trains.length>0){
                                    if(ctn.cid==='c1301'){
                                        for(let parts of dictS1.aiguilles[0].a1c1301){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else if(ctn.cid==='c2301'){
                                        for(let parts of dictS1.aiguilles[0].a1c2301){
                                            parts.style.fill='#E1A712'
                                        }
                                    }
                                } else {
                                    if(ctn.cid==='c1301'){
                                        for(let parts of dictS1.aiguilles[0].a1c1301){
                                            parts.style.fill='#66D264'
                                        }
                                    } else if(ctn.cid==='c2301'){
                                        for(let parts of dictS1.aiguilles[0].a1c2301){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } else continue;
                        }
                    }
                }
                //? S2
            } else if((ctninfo.cid==='c1102')||(ctninfo.cid==='c2402')||(ctninfo.cid==='c1202')||(ctninfo.cid==='cGA2PAG')){
                for(let itil of Object.entries(sec.ITI)){
                    for(let vitil of Object.entries(itil[1])){
                        for(let iti of vitil[1]){
                            //console.log(iti)
                            if(((iti.code==='1501_1202')&&(iti.active))||((iti.code==='1202_1501')&&(iti.active))){
                                if(ctn.cid==='c1102'){
                                    if(ctn.trains.length>0){
                                        for(let parts of dictS2.cantons.c1102){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else {
                                        for(let parts of dictS2.cantons.c1102){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } 
                            if(((iti.code==='2302_2101')&&(iti.active))||((iti.code==='2101_2302')&&(iti.active))){
                                if(ctn.cid==='c2402'){
                                    if(ctn.trains.length>0){
                                        for(let parts of dictS2.cantons.c2402){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else {
                                        for(let parts of dictS2.cantons.c2402){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            }
                            if(((iti.code==='1102_1302')&&(iti.active))||((iti.code==='1302_1102')&&(iti.active))){
                                if(ctn.cid==='c1202'){
                                    if(ctn.trains.length>0){
                                        for(let parts of dictS2.cantons.c1202){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else {
                                        for(let parts of dictS2.cantons.c1202){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            }
                            if(((iti.code==='1202_2101')&&(iti.active))||((iti.code==='2101_1202')&&(iti.active))){
                                //? Gestion fleches
                                if((iti.code==='1202_2101')&&(iti.active)){
                                    for(let arr of dictS2.arrows[0]){
                                        arr.style.fill='#66D264'
                                    }
                                } else if((iti.code==='2101_1202')&&(iti.active)){
                                    for(let arr of dictS2.arrows[1]){
                                        arr.style.fill='#66D264'
                                    }
                                }
                                dictS2.voys['A1Dev'].setAttribute('href', '../ON.png')
                                //? Gestion colorimétrie des cantons et aiguilles
                                if(ctn.trains.length>0){
                                    if(ctn.cid==='c1102'){
                                        for(let parts of dictS2.aiguilles[0].a1c1102){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else if(ctn.cid==='c2402'){
                                        for(let parts of dictS2.aiguilles[0].a1c2402){
                                            parts.style.fill='#E1A712'
                                        }
                                    }
                                } else {
                                    if(ctn.cid==='c1102'){
                                        for(let parts of dictS2.aiguilles[0].a1c1102){
                                            parts.style.fill='#66D264'
                                        }
                                    } else if(ctn.cid==='c2402'){
                                        for(let parts of dictS2.aiguilles[0].a1c2402){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } 
                            if(((iti.code==='1102_PAG1')&&(iti.active))||((iti.code==='PAG1_1102')&&(iti.active))){
                                //? Gestion fleches
                                if((iti.code==='1102_PAG1')&&(iti.active)){
                                    for(let arr of dictS2.arrows[3]){
                                        arr.style.fill='#66D264'
                                    }
                                } else if((iti.code==='PAG1_1102')&&(iti.active)){
                                    for(let arr of dictS2.arrows[2]){
                                        arr.style.fill='#66D264'
                                    }
                                }
                                dictS2.voys['A2Dev'].setAttribute('href', '../ON.png')
                                //? Gestion colorimétrie des cantons et aiguilles
                                if(ctn.trains.length>0){
                                    if(ctn.cid==='c1202'){
                                        for(let parts of dictS2.aiguilles[0].a2c1202){
                                            parts.style.fill='#E1A712'
                                        }
                                    } else if(ctn.cid==='cGA2PAG'){
                                        for(let parts of dictS2.aiguilles[0].a2cEND){
                                            parts.style.fill='#E1A712'
                                        }
                                    }
                                } else {
                                    if(ctn.cid==='c1202'){
                                        for(let parts of dictS2.aiguilles[0].a2c1202){
                                            parts.style.fill='#66D264'
                                        }
                                    } else if(ctn.cid==='cGA2PAG'){
                                        for(let parts of dictS2.aiguilles[0].a2cEND){
                                            parts.style.fill='#66D264'
                                        }
                                    }
                                }
                            } else continue;
                        }
                    }
                }
            } else {
                if(ctn.trains.length>0){
                    console.log(ctn.cid)
                    if(dictS1.cantons[ctn.cid]){
                        dictS1.cantons[ctn.cid].style.fill='#E1A712'
                    } else if(dictS2.cantons[ctn.cid]){
                        dictS2.cantons[ctn.cid].style.fill='#E1A712'
                    }
                }
            }
        }
    }
}
let blinkIntervalIdEM = new Map()
let comSoundInter=0
function refreshComPlat(){
    for(let interval of fileIntervals){
        if(interval===comSoundInter) continue;
        clearInterval(interval)
    }
    let voyDetresseComm = document.getElementById('voyDetresseComm')
    let voyDetresseFromPilot = document.getElementById('voyDetresseFromPilot')
    let voyDetresseFromUCA = document.getElementById('voyDetresseFromUCA')
    let screenTrainID = document.getElementById('screenTrainID')
    let screenTrainLoc = document.getElementById('screenTrainLoc')

    let defListt = [];
    let defListtA = [];
    for(let call of data.emCalls){
        if(call.active===false) continue;
        switch(call.active){
            case true:
                defListtA.push(call)
                let blinkIdReturn = blinkIntervalIdEM.get('detresseComVoy')
                clearInterval(blinkIdReturn)
                blinkIntervalId.delete('detresseComVoy')
                if(call.caller==='UCA'){
                    let blinkInterval = blinkIntervalIdEM.get('detresseComUCA')
                    clearInterval(blinkInterval)
                    voyDetresseFromUCA.src='./src/formats/det/voy_on.png'
                } else {
                    let blinkInterval = blinkIntervalIdEM.get('detresseComPilot')
                    clearInterval(blinkInterval)
                    voyDetresseFromPilot.src='./src/formats/det/voy_on.png'
                }
                voyDetresseComm.src='./src/formats/det/voy_on.png'
                screenTrainID.value=call.trid
                screenTrainID.classList.add('scrOn')
                screenTrainID.classList.remove('scrOff')
                screenTrainLoc.value=call.ctn.replace('c','')
                screenTrainLoc.classList.add('scrOn')
                screenTrainLoc.classList.add('scrOff')
                break;
            case 2:
                defListt.push(call)
                console.log('A L\'AIDE')
                let blinkId1 = setInterval(async function () {
                    voyDetresseComm.src='./src/formats/det/voy_on.png'
                    await sleep(500);
                    voyDetresseComm.src='./src/formats/det/voy_off.png'
                }, 1000)
                if(call.caller==='UCA'){
                    let blinkId2 = setInterval(async function () {
                        voyDetresseFromUCA.src='./src/formats/det/voy_on.png'
                        await sleep(500);
                        voyDetresseFromUCA.src='./src/formats/det/voy_off.png'
                    }, 1000)
                    blinkIntervalIdEM.set('detresseComUCA', blinkId2)
                    fileIntervals.push(blinkId2)
                } else if(call.caller==='PILOT'){
                    let blinkId2 = setInterval(async function () {
                        voyDetresseFromPilot.src='./src/formats/det/voy_on.png'
                        await sleep(500);
                        voyDetresseFromPilot.src='./src/formats/det/voy_off.png'
                    }, 1000)
                    blinkIntervalIdEM.set('detresseComPilot', blinkId2)
                    fileIntervals.push(blinkId2)
                }
                blinkIntervalIdEM.set('detresseComVoy', blinkId1)
                fileIntervals.push(blinkId1)
                screenTrainID.value=call.trid
                screenTrainID.classList.add('scrOn')
                screenTrainID.classList.remove('scrOff')
                screenTrainLoc.value=call.ctn.replace('c','')
                screenTrainLoc.classList.add('scrOn')
                screenTrainLoc.classList.add('scrOff')
                break;
        }
    }
    if(defListt.length>0){
        comSoundInter=setInterval( ()=> {
            sm.playSound('ring')
        },750)
    } else if(defListt.length===0){
        clearInterval(comSoundInter)
        sm.stopSound('ring')
        if(defListtA.length===0){
            voyDetresseFromPilot.src='./src/formats/det/voy_off.png'
            voyDetresseFromUCA.src='./src/formats/det/voy_off.png'
            voyDetresseComm.src='./src/formats/det/voy_off.png'

            screenTrainID.src='./src/formats/det/sc_off.png'
            screenTrainID.classList.remove('scrOn')
            screenTrainID.classList.add('scrOff')
            screenTrainLoc.src='./src/formats/det/sc_off.png'
            screenTrainLoc.classList.remove('scrOn')
            screenTrainLoc.classList.add('scrOff')
            screenTrainID.value=''
            screenTrainLoc.value=''
        }
    }
}



function loadElectricalInfos(){
    console.log('LOADING ELECTRICAL CANTONS')
    for(let ectns of Object.entries(elecInfo.ctns)){
        console.log(data.ectns)
        let ctnsStatus = data.ectns[ectns[0]]
        console.log(ctnsStatus)
        switch(ctnsStatus){
            case true:
                for(let sectns of ectns[1]){
                    sectns.style.stroke = '#FFDF35';
                }
            break;
            case false:
                for(let sectns of ectns[1]){
                    sectns.style.stroke = '#FF5734';
                }
            break;
        }
    }
    console.log('LOADING RUPTORS')
    for(let ru of Object.entries(elecInfo.ru)){
        let ruStatus = data.ru[ru[0]]
        console.log(ruStatus)
        switch(ruStatus){
            case true:
                ru[1].style.stroke = '#FFDF35';
            break;
            case false:
                ru[1].style.stroke = '#FF5734';
            break;
        }
    }
    console.log('LOADING SS')
    for(let ss of Object.entries(elecInfo.ss)){
        let ssStatus = data.ss[ss[0]]
        switch(ssStatus){
            case true:
                for(let ssBits of ss[1]){
                    ssBits.style.stroke = '#FFDF35';
                }
            break;
            case false:
                for(let ssBits of ss[1]){
                    ssBits.style.stroke = '#FF5734';
                }
            break;
        }
    }
    console.log('LOADING PR')
    let index = 0
    for(let pr of Object.entries(elecInfo.pr)){
        for(let prProps of Object.entries(pr[1])){
            let propStatus=data.PR[index][prProps[0]]
            switch(propStatus){
                case true:
                    prProps[1].style.stroke = '#FFDF35';
                break;
                case false:
                    prProps[1].style.stroke = '#FF5734';
                break;
            }
        }
        index++
    }
}

function verifyExistingTrain(id) {
    /*console.log('-------IL EXISTE????---------')
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
    console.log('ALLELUYA IL EXISTE')*/
    return true;
}

function itiInfo(id){
    if(!id) return console.error('[itiInfo] Aucun ID d\'iti indiqué!')
    for(let sec of data.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===id)) continue;
                return iti.active
            }
        }
    }
    //console.info('itiInfo] Aucun itinéraire correspondant.')
    return false;
}

function cycleInfo(id){
    if(!id) return console.error('[cycleInfo] Aucun ID de cycle indiqué!')
    for(let sec of data.SEC){
        for(let cycle of sec.CYCLES){
            if(!(cycle.code===id)) continue;
            if(!(cycle.active)) continue;
            return true;
        }
    }
    //console.info('[cycleInfo] Aucun cycle correspondant.')
    return false;
}

function isOccupied(id){
    if(!id) return console.error('[isOccupied] Aucun canton indiqué')
    for(let sec of data.SEC){
        for(let ctn of sec.cantons){
            if(!(ctn.cid===id)) continue;
            if(ctn.trains.length>0) return true;
        }
    }
    return false;
}

function isDigit(n) {
    if (!n) return false; //en gros c'est vide
    let TTARGET = parseInt(n)
    if (isNaN(TTARGET)) return false; //en gros c'est pas digit, c'est une lettre
    console.log(TTARGET)
    return true;
}

copyConfig.addEventListener('click', () => {
    navigator.clipboard.writeText(window.actualRequest)
})

let btnAdminAccess = document.getElementById('btnAdminAccess')
btnAdminAccess.addEventListener('click',()=>{
    document.location.href='admin.html'
})

let loadCount = 0
let verifFunc = ()=>{
    loadCount++
    if(loadCount===30){
        document.location.reload()
    }
    if(dataLoaded&&electricLoaded&&tco1Loaded&&tco2Loaded){
        console.log('resolved')
        clearInterval(verifLoadInter)
        loadElectricalInfos()
        refreshTCO()
        let endLoad = Date.now()
        console.log('Pre-load in '+(endLoad-startLoad)+' ms.')
        actualRequest = JSON.stringify({
            op: 15,
            time: (endLoad-startLoad)
        })
        window.actualRequest = actualRequest
        window.WebSocket.send(actualRequest)
    }
}
let verifLoadInter = setInterval(verifFunc,50)

document.getElementById('createEmCall').addEventListener('click', ()=>{
    let reqbody = prompt('REQUEST BODY')
    //let parsedBody = JSON.parse(reqbody)
    actualRequest = JSON.stringify({
        op: 226,
        execute: "EMCALL-TEST",
        //reqestBody: parsedBody,
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

document.getElementById('acqAlerteUrgence').addEventListener('click',()=>{
    actualRequest = JSON.stringify({
        op: 226,
        execute: "EMCALL-ACQ",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

document.getElementById('razAlerteUrgence').addEventListener('click',()=>{
    actualRequest = JSON.stringify({
        op: 226,
        execute: "EMCALL-RAZ",
        uuid: window.uuid
    })
    window.WebSocket.send(actualRequest);
    window.actualRequest = actualRequest
})

document.getElementById('btnSupervisionPage').addEventListener('click', ()=>{
    if(window.role==='chef'){
        document.location.href='supervision.html'
    }
})
/**
 * Outil de gestion des itinéraires d'aiguilles et de sections
 * @module OGIA
 */

const logger = require('./logger')

const pccApi=require('./server.json');

const fs = require('fs')

const parent = require('./ws')

/**
* Véirifie l'existance d'un itinéraire et l'applique si besoins en retourant true. Retourne false dans le cas échéant
* @param _secIndex Itération d'index de section actif
* @param _cantonIndex Itération d'index de canton actif
* @param _trainIndex Itération d'index du train actif
* @param voie Voie active du train (c1 ou c2)
* @param wss WebSeocket actif (permet de broadcast)
* @default false Aucun itinéraire n'a été appliqué car aucun n'a été trouvé
* @returns True si un itinéraire a été trouvé
* @type {boolean}
*/

exports.findCompatibleItis = function (_secIndex, _cantonIndex, _trainIndex, voie, wss) {
    if((!(typeof _trainIndex === 'number'))||(!(typeof _secIndex === 'number'))||(!(typeof _cantonIndex === 'number'))||(typeof voie === 'undefined')) throw new Error ('[OGIA] Un des arguments ('+voie+') n\'est pas un nombre!')
    if(!(wss)) throw new Error ('[OGIA] Le WebSocket n\'a pas été renseigné!')
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

    if(voie === 1){
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && itiInfo('1201_2201')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
            pccApi.SEC[_secIndex].cantons[7].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && itiInfo('1201_2201')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[6].cid)
            pccApi.SEC[_secIndex].cantons[6].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && itiInfo('2401_1401')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
            pccApi.SEC[_secIndex].cantons[2].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else                  //?    SECTION 2
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1202" && itiInfo('1102_PAG1')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[8].cid)
            pccApi.SEC[_secIndex].cantons[8].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2402" && itiInfo('2101_1202')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[0].cid)
            pccApi.SEC[_secIndex].cantons[0].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        }
    } else if (voie === 2){
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c2301" && itiInfo('2201_1201')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[2].cid)
            pccApi.SEC[_secIndex].cantons[2].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && itiInfo('2201_1201')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[1].cid)
            pccApi.SEC[_secIndex].cantons[1].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1301" && itiInfo('1401_2401')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
            pccApi.SEC[_secIndex].cantons[7].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        } else            //? SECTION 2
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="c1102" && itiInfo('1202_2101')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[7].cid)
            pccApi.SEC[_secIndex].cantons[7].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        }
        logger.info('[OGIA] L\'OGIA n\'a pas trouvé d\'itinéraire valide.')
        return false;
    } else if(voie==='GAT'){
        if(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid==="cGA2PAG" && itiInfo('PAG1_1102')){
            logger.info('Mouvement pris en charge par l\'OGIA')
            console.log('Bon, on va supprimer le train du canton '+pccApi.SEC[_secIndex].cantons[_cantonIndex].cid+' jusque au '+pccApi.SEC[_secIndex].cantons[1].cid)
            pccApi.SEC[_secIndex].cantons[1].trains.push( {...pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]} )
            pccApi.SEC[_secIndex].cantons[_cantonIndex].trains.pop();
            if(typeof pccApi.SEC[_secIndex].cantons[_cantonIndex].trains[_trainIndex]==='undefined'){
                logger.confirm('Mouvement effectué avec succès')
            }
            apiSave()
            return true;
        }
        logger.info('[OGIA] L\'OGIA n\'a pas trouvé d\'itinéraire valide.')
    } else throw new Error ('[OGIA] La voie renseignée ('+voie+') n\'est pas valide.')
}

/**
* Donne l'index du canton d'arrivée de la prochaine section
* @param _secIndex Itération d'index de section actif
* @param _cantonIndex Itération d'index de canton actif
* @param sens Sens de circulation du train actif
* @param voie Voie du train actif
* @default 0 Il n'y a pas besoins de modifier l'index de canton 
* @returns L'index correct de canton pour la section concernée
* @type {number}
*/

//au fur et a mesure, il faudra rajouter les évennements (si le train est sur 1102 et qu'il va voie 1, il ira sur le canton d'index 4 de la section précédente)

exports.nextSectionIndex = function (_secIndex, _cantonIndex, sens, voie){
    if((!(typeof _secIndex === 'number'))||(!(typeof _cantonIndex === 'number'))) throw new Error ('Un des paramètres n\'est pas un nombre valide!');

    let _NEXTCINDEX = 0

    if(sens === 1){
        switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
            case 'c2101':
                logger.info('[OGIA] Un index de canton a été trouvé.')
                _NEXTCINDEX = 7
                break;
            default:
                logger.info('[OGIA] Aucun index de canton trouvé. Valeur défaut.')
                _NEXTCINDEX = 0
        }
        return _NEXTCINDEX;
    } else if (sens === 2){
        if(voie === 1){
            switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                case 'c1102':
                    logger.info('[OGIA] Un index de canton a été trouvé.')
                    _NEXTCINDEX = 4
                    break;
                default:
                    logger.info('[OGIA] Aucun index de canton trouvé. Valeur défaut.')
                    _NEXTCINDEX = 0
            }
        } else if (voie === 2){
            switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                case 'c2402':
                    logger.info('[OGIA] Un index de canton a été trouvé.')
                    _NEXTCINDEX = 5
                    break;
                default:
                    logger.info('[OGIA] Aucun index de canton trouvé. Valeur défaut.')
                    _NEXTCINDEX = 0
            }
        } else if (voie === 'GAT'){
            switch(pccApi.SEC[_secIndex].cantons[_cantonIndex].cid){
                case 'cGA2PAG':
                    logger.info('[OGIA] Un index de canton a été trouvé.')
                    _NEXTCINDEX = 1
                    break;
                default:
                    logger.info('[OGIA] Aucun index de canton trouvé. Valeur défaut.')
                    _NEXTCINDEX = 0
            }
        } else throw new Error ('[OGIA] La voie renseigné ('+voie+') n\'est pas valide.')

        return _NEXTCINDEX;
    } else throw new Error ('[OGIA] Le sens renseigné ('+sens+') n\'est pas valide.')
}

function itiInfo(id){
    if(!id) return logger.error('[OGIA -> itiInfo] Aucun ID d\'iti indiqué!')
    for(let sec of pccApi.SEC){
        for(let itil of Object.entries(sec.ITI[0])){
            for(let iti of itil[1]){
                if(!(iti.code===id)) continue;
                return iti.active
            }
        }
    }
    logger.info('[OGIA -> itiInfo] Aucun itinéraire correspondant.')
    return false;
}
/*export function client(state, ip){
    switch (state){
        case 'new':
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] '+ip);
    }
}*/

exports.client = function (state, ws, len) {
    switch (state){
        case true:
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] Client connecté');
        case false:
            return console.log(`\x1b[37m[\x1b[31m-\x1b[37m] ${ws.usr.username} déconnecté. Désormais ${len} utilisateurs.`);
  };
}

exports.message = function (type,data,uname,ip,instance){
    switch (type){
        case 'income':
            return console.log('\x1b[44m'+ip+'\x1b[0m\n\x1b[37m[\x1b[32mINCOMING MESSAGE\x1b[37m] \x1b[47m\x1b[30m{'+uname+'}->'+instance+'\x1b[0m\n'+data);
        case 'outcome':
            return console.log('\x1b[37m[\x1b[35mOUTCOMING MESSAGE\x1b[37m] '+data);
        case 'broadcast':
            return console.log('\x1b[37m[\x1b[35mBROADCAST\x1b[37m] '+data);
    }
}

exports.error = function (error){
    return console.log('\x1b[41m\x1b[37m[\x1b[30mERROR\x1b[37m]\x1b[0m '+error);
}

exports.confirm = function (text){
    return console.log('\x1b[42m\x1b[37m[\x1b[30mCONFIRM\x1b[37m]\x1b[0m '+text);
}

exports.identify = function (ws, len){
    return console.log(`\x1b[37m[\x1b[32m⁂ \x1b[37m] ${ws.usr.username} s'est connecté avec l'IP ${ws.ip}. Rôle ${ws.role}. Désormais ${len} utilisateurs. UUID ${ws.id}`);
}



exports.info = function (text){
    return console.log('\x1b[37m\x1b[44m[INFO]\x1b[0m '+text);
}

exports.metric = function (text,type){
    if(type==='alert'){
        return console.log('\x1b[37m[\x1b[36mMETRICS\x1b[37m]\x1b[0m '+text);
    } else {
        return console.log('\x1b[30m\x1b[43m[METRIC ALERT]\x1b[0m \x1b[33m'+text+'\x1b[0m');
    }
}
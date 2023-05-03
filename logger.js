/*export function client(state, ip){
    switch (state){
        case 'new':
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] '+ip);
    }
}*/

exports.client = function (state) {
    switch (state){
        case true:
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] Client connecté');
        case false:
            return console.log('\x1b[37m[\033[31m-\x1b[37m] Client déconnecté');
  };
}

exports.message = function (type,data,uname,ip,instance){
    switch (type){
        case 'income':
            return console.log('                   \033[44m'+ip+'\033[0m\n\x1b[37m[\x1b[32mINCOMING MESSAGE\x1b[37m] \033[47m\033[30m{'+uname+'}->'+instance+'\033[0m\n'+data);
        case 'outcome':
            return console.log('\x1b[37m[\x1b[35mOUTCOMING MESSAGE\x1b[37m] '+data);
        case 'broadcast':
            return console.log('\x1b[37m[\x1b[35mBROADCAST\x1b[37m] '+data);
    }
}

exports.error = function (error){
    return console.log('\033[41m\x1b[37m[\x1b[30mERROR\x1b[37m]\033[0m '+error);
}

exports.confirm = function (text){
    return console.log('\033[42m\x1b[37m[\x1b[30mCONFIRM\x1b[37m]\033[0m '+text);
}

exports.identify = function (ip, uuid, from){
    return console.log('\x1b[37m[\x1b[32m=\x1b[37m] Client d\'IP '+ip+' d\'UUID '+uuid+'\n PROVIENS DE L\'INSTANCE '+from);
}

exports.info = function (text){
    return console.log('\x1b[37m\033[44m[INFO]\033[0m '+text);
}


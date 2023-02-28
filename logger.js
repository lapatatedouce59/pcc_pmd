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

exports.message = function (type,data){
    switch (type){
        case 'income':
            return console.log('\x1b[37m[\x1b[32mINCOMING MESSAGE\x1b[37m] '+data);
        case 'outcome':
            return console.log('\x1b[37m[\x1b[35mOUTCOMING MESSAGE\x1b[37m] '+data);
        case 'broadcast':
            return console.log('\x1b[37m[\x1b[35mBROADCAST\x1b[37m] '+data);
    }
}

exports.error = function (error){
    return console.log('\033[41m\x1b[37m[\x1b[30mERROR\x1b[37m]\033[0m '+error);
}

exports.identify = function (ip, co, ci){
    return console.log('\x1b[37m[\x1b[32m=\x1b[37m] Client situé à '+ci+' en '+co+' avec l\'ip '+ip);
}

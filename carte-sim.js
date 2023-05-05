let ws = new WebSocket('ws://localhost:8081')

let wsOpen = false

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let username = false

ws.onopen=function(){wsOpen=true};

let tahLesBonsGateauxSaMereMerciSimon = {}

let tableauDeSecuriteJeSuisVigileOuQuoi = ['383637400099880964']

for(const el of document.cookie.split("; ")){
    tahLesBonsGateauxSaMereMerciSimon[el.split("=")[0]] = el.split("=")[1]
}
console.log(tahLesBonsGateauxSaMereMerciSimon)

if(tahLesBonsGateauxSaMereMerciSimon.discord_token){
    fetch('https://discord.com/api/users/@me', {
        headers:{Authorization:'Bearer '+tahLesBonsGateauxSaMereMerciSimon.discord_token}
        }).then(res => {
            if(res.status===401){
                alert('Un problème est survenu. Merci de vous reconnecter.')
                document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
            } else {
                res.json().then(usr => { 
                    if(tableauDeSecuriteJeSuisVigileOuQuoi.includes(usr.id)){
                        console.log(usr)
                        const weweOnAttends = async() => {
                            let int = setInterval(function(){
                                if(wsOpen){
                                    localStorage.setItem('dUsername',usr.username)
                                    username=usr.username
                                    clearInterval(int)
                                    //ws.send(JSON.stringify({op: 1, exept: 'VERIFICATION', username: usr.username}))
                                }
                            })
                        }
                        weweOnAttends()
                    } else {
                        document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
                    }
                })
            }
        })
} else {
    document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
}
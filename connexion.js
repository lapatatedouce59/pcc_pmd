
let wsOpen = false
let data=false
window.WebSocket = new WebSocket('ws://localhost:8081')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let username = false

let cookies = {}

for(const el of document.cookie.split("; ")){
    cookies[el.split("=")[0]] = el.split("=")[1]
}
console.log(cookies)

if(cookies.discord_token){
    window.WebSocket.addEventListener('open', () => {
        window.WebSocket.send(JSON.stringify({
            op: 1,
            from: "FORMATS-ADMIN",
            token: cookies.discord_token
        }))
        window.WebSocket.addEventListener('message', msg =>{
            data = JSON.parse(msg.data);
    
            if(data.op===999){
                if(data.error===20){
                    alert(data.message)
                    document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
                }
                if(data.error===30){
                    alert(data.message)
                    document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
                }
                if(data.error===10){
                    alert(data.message)
                    document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
                }
            }
        })
    })

} else {
    document.location.href='https://discord.com/api/oauth2/authorize?client_id=1102519610848313344&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fverify.html&response_type=token&scope=identify'
}
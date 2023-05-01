const { WebSocket } = require('ws')
let ws=false
const {setTimeout} = require('timers/promises')

console.log('AAAAA')
const dotenv = require('dotenv');
dotenv.config();
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookToken = process.env.DISCORD_TOKEN
const webhookClient = new WebhookClient({ url: webhookToken });
function Aconnect(){
    try{
        ws = new WebSocket('wss://patate.ddns.net:8081')
    } catch {
        console.log('ERREUR')
    }
    ws.addEventListener('open', ()=> {
        console.log('Connecté au WS')
    
        /*ws.addEventListener('close', ()=>{
            const embed = new EmbedBuilder()
                .setTitle('Status du PCC')
                .setColor('#e69138')
                .setDescription('Le serveur général du PCC a été stoppé volontairement!')
        
            webhookClient.send({
                content: '',
                embeds: [embed],
            });
        })*/
    
        ws.addEventListener('close',(event)=>{
            if(JSON.stringify(event)==='{}'){
                event='Aucun détails'
            }
            const embed = new EmbedBuilder()
                .setTitle('Status du PCC')
                .setColor('#B20710')
                .setDescription('Le serveur général du PCC a crashé!')
                .addFields({ name: 'Erreur: ', value: '`'+JSON.stringify(event)+'`', inline: true })
        
            webhookClient.send({
                content: '',
                embeds: [embed],
            });
            setTimeout(function() {
                console.log('Crash. Tentative de reconnexion...')
                try{
                    Aconnect();
                } catch {
                    console.log(event)
                }
            }, 3000);
        })
    })
    /*ws.on('error',(event)=>{
        if(JSON.stringify(event)==='{}'){
            event='Aucun détails'
        }
        const embed = new EmbedBuilder()
        .setTitle('Status du PCC')
        .setColor('#B20710')
        .setDescription('Le serveur général du PCC a crashé!')
        .addFields({ name: 'Erreur: ', value: '`'+event+'`', inline: true })

        webhookClient.send({
            content: '',
            embeds: [embed],
        });
    })*/
}
setTimeout(3000)
Aconnect()
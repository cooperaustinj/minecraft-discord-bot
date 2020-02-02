require('dotenv').config();
const Discord = require('discord.js');
const request = require('request');
require('log-timestamp');

const url = `http://mcapi.us/server/status?ip=${process.env.SERVER_IP}`;

const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

const updateStatus = function () {
    console.log('Updating status...');
    request(url, function (err, res, body) {
        if (err) {
            console.log(err);
            client.user.setActivity('Error');
            return;
        }
        body = JSON.parse(body);
        if (!body.online) {
            client.user.setActivity('Offline');
            return;
        }
        const msg = `${body.players.now} players online`;
        console.log(msg);
        client.user.setActivity(msg, { type: "WATCHING", url: 'https://google.com' });
    });
}

client.on('ready', () => {
    console.log('Client connected');
    updateStatus();
    setInterval(updateStatus, 2 * 60 * 1000);
});

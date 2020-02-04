require('dotenv').config();
const Discord = require('discord.js');
const request = require('request');
require('log-timestamp');

const url = `http://mcapi.us/server/query?ip=${process.env.SERVER_IP}`;

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

client.on('message', msg => {
    if (msg.author.equals(client.user)) {
        return;
    }
    if (msg.channel.type !== 'dm') {
        return;
    }
    switch (msg.content) {
        case 'who':
            request(url, function (err, res, body) {
                if (err) {
                    console.log(err);
                    msg.reply('Error getting server info');
                    return;
                }
                body = JSON.parse(body);
                if (!body.online) {
                    msg.reply('Server is offline');
                    return;
                }
                if (!body.players.now) {
                    msg.reply('No players online');
                    return;
                }
                msg.reply(body.players.list);
            });
            break;

        default:
            msg.reply('Unknown command');
            break;
    }
});

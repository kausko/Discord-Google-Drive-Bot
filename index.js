const Discord = require('discord.js');
const fs = require('fs');
const { google } = require('googleapis');
const phrases = require('./phrases.json');
const errors = require('./errors.json');
const driveToken = require('./token.json');
const credentials = require('./credentials.json');
const { createServer } = require('http');
require("dotenv").config();

const randomArrElement = (list = []) => list[Math.floor(Math.random() * (list.length - 1))]

const PORT = process.env.PORT || 3000

createServer((req, res) => {
  console.log(req.url)
  res.writeHead(302, { location: `https://discord.com/oauth2/authorize?client_id=${process.env.APP_ID}&scope=bot`})
  res.end()
}).listen(PORT, () => {
  console.log(`${process.env.BOT_NAME} listening on PORT ${PORT}`)
})

const client = new Discord.Client();

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(driveToken);

const drive = google.drive({ version: 'v3', auth: oAuth2Client })

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (msg.content.startsWith(`${process.env.BOT_COMMAND} `)) {
        try {
            const list = await drive.files.list({
                q: `parents in '${process.env.DRIVE_DIR}' and ${msg.content.replace(`${process.env.BOT_COMMAND} `, "").split(" ").map(keyword => `name contains '${keyword}'`).join(" and ")}`,
                spaces: 'drive'
            })
            if (!!list.data.files.length) {
                const index = Math.floor(Math.random() * (list.data.files.length - 1));
                const fID = list.data.files[index].id;
                const mimeType = list.data.files[index].mimeType;
                const { data } = await drive.files.get(
                    {
                        fileId: fID,
                        alt: "media"
                    },
                    { responseType: "stream" }
                )
                const fileName = fID + "." + mimeType.split("/")[1];
                const file = fs.createWriteStream(fileName)
                data
                    .on("end", () => {
                        msg
                            .reply(
                                randomArrElement(phrases),
                                {
                                    files: [fileName]
                                }
                            )
                            .then(() => {
                                file.end()
                                fs.unlinkSync(fileName)
                            })
                    })
                    .on("error", error => msg.reply(randomArrElement(errors) + " Error: " + error.message))
                    .pipe(file)
            }
            else {
                msg.reply(randomArrElement(errors), { files: [process.env.FOF] })
            }
        } catch (error) {
            console.log(error)
            msg.reply(randomArrElement(errors) + " Error: " + error.message)
        }
    }
});

client.login(process.env.BOT_TOKEN);
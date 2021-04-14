# Discord-Google-Drive-Bot

A Discord bot that pulls media from your Google Drive, and sends it to your servers. You can also DM the bot!

The link in the description points to a private bot, and is only meant for demonstration purposes. You need to [Setup](https://github.com/kausko/Discord-Google-Drive-Bot#setup) your own bot to try it out.

## Setup
As the bot deals with Google OAuth and requires access to sensitive `scopes`, I have not deployed it as a customizable public bot. The server admins must deploy it themselves.

### Project setup

1. Clone this repository
1. Install all dependencies using `yarn`<sup>*</sup>

**`Node.js v12+` must be installed on your system. `npm` commands are also supported*

### Google Drive setup

1. [Create a new Google Cloud Platform (GCP) project](https://developers.google.com/workspace/guides/create-project#create_a_new_google_cloud_platform_gcp_project)
1. [Configure the OAuth Consent Screen](https://developers.google.com/workspace/guides/create-credentials#configure_the_oauth_consent_screen). In this step, select the scope `https://www.googleapis.com/auth/drive` when prompted.
1. [Create credentials](https://developers.google.com/workspace/guides/create-credentials#create_a_credential) and choose [Desktop credentials](https://developers.google.com/workspace/guides/create-credentials#desktop)
1. Download the credentials and save the JSON file as `credentials.json` in the base directory of the project
1. Run `yarn generate` in the base directory of the project. This step should open a link in your browser
1. Select the Google Account associated with your drive
1. This will take you to an OAuth consent screen. Click on `show advanced` and `Go to <app-name> (unsafe)`<sup>#</sup>
1. Paste the generated code in the terminal from step 5
1. The script will generate the tokens, test them and save them in `token.json`

*<sup>#</sup> This appears if GCP app requires access to sensitive scopes and the OAuth consent screen is not approved by Google. As this is your own app, you don't need to worry about this.*

`credentials.json` format

```json
{
  "installed": {
      "client_id": "<client-id>.apps.googleusercontent.com",
      "project_id": "<project-name>-<project-id>",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "<client-secret>",
      "redirect_uris": [
          "abc:defg:hi:oauth:2.0:jkl",
      ]
  }
}
```

`token.json` format

```json
{
  "access_token": "<access-token>",
  "refresh_token": "<refresh-token>",
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer",
  "expiry_date": "time-in-ms-since-epoch"
}
```

### Discord Bot setup

1. [Create a Discord Application](https://discord.com/developers/applications)
1. Select your application and create a Discord Bot

### Environment Variables setup
In your project directory, create a `.env` file and add the following fields

```dosini
DRIVE_DIR=
APP_ID=
BOT_TOKEN=
BOT_NAME=
BOT_COMMAND=
FOF=https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/page_not_found_su7k.svg
```

| Variable | Description |
| --- | --- |
| `DRIVE_DIR` | <li>The Drive ID of the folder where your media is stored</li><li>It is visible in the final part of the URI, when the folder is opened in a browser</li><li>Optionally, you can set it to `root`. </li><li>This is NOT RECOMMENDED as it will allow server members to access your entire drive.</li> |
| `APP_ID` | The Application ID of your Discord Application |
| `BOT_TOKEN` | The authorization token of your Discord Application's Bot
| `BOT_NAME` | The name of your bot |
| `BOT_COMMAND` | The command that the bot should respond to. Example: `!fs` used by Rhythm |
| `FOF` | Fallback 404 image URI when the requested media is not found |

## Deployment
The project can be deployed using any cloud provider (Azure, GCP, AWS, etc). I used Azure App Services / Azure Pipelines and chose the Node.js configuration.

NOTE:
- Discord Bots use websockets for real-time communication. So it can't be deployed on a serverless platform like Vercel.
- Free services like Heroku, Glitch, etc. will force your app to sleep after some time of inactivity. Your bot will go offline and not respond in this case.
- This can be fixed using workers or cron jobs, but you may run out of your monthly limits.

## Usage
- Head over to your deployment url, (or `localhost:3000`, when testing) or open `https://discord.com/oauth2/authorize?client_id=APP_ID&scope=bot` and replace the `APP_ID` with your Discord Application ID
- Login to Discord and add the bot to your server. If the bot is private, only the owner of the bot can do this.
- Add files in your selected drive folder with keywords in the file name. Example: `tinder meme 2020.png`
- Send a command in your server/Bot DM. Example: `BOT_COMMAND tinder meme`, where `<BOT_COMMAND>` is the command stored in the `.env` file (like `!fs`).
- The bot will send any random file from your selected folder that contains these keywords.

## Customization
- `phrases.json` is a set of reply messages. The bot will use one of these in standard replies.
- `errors.json` is a set of error messages. The bot will use one of these if the command is incorrect or the requested file(s) is/are missing.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)






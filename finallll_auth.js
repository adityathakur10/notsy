const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Authentication using OAuth 2.0
async function authenticate() {
    const credentials = require('./credentials.json');
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token
    try {
        const token = fs.readFileSync('token.json');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (err) {
        return getAccessToken(oAuth2Client);
    }
}

// Get OAuth2 access token
async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.force-ssl']
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', async (code) => {
            rl.close();
            try {
                const { tokens } = await oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(tokens);
                fs.writeFileSync('token.json', JSON.stringify(tokens));
                resolve(oAuth2Client);
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function listCaptions() {
    const auth = await authenticate();
    const youtube = google.youtube({
        version: 'v3',
        auth: auth
    });

    const videoId = 'qwfE7fSVaZM'; // Replace 'VIDEO_ID' with the ID of the YouTube video

    try {
        const response = await youtube.captions.list({
            part: 'snippet',
            videoId: videoId
        });

        const captions = response.data.items;
        captions.forEach(async caption => {
            console.log(`Caption ID: ${caption.id}, Language: ${caption.snippet.language}`);

            // Download the caption content
            try {
                const downloadResponse = await youtube.captions.download({
                    id: caption.id,
                    tfmt: 'srt' // SubRip format
                });

                console.log(`Caption Content: ${downloadResponse.data}`);
            } catch (err) {
                console.error('Error downloading caption:', err);
            }
        });
    } catch (err) {
        console.error('Error fetching captions:', err);
    }
}

listCaptions();

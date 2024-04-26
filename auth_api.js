const { google } = require('googleapis');
const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

const app = express();

// Define OAuth 2.0 credentials
const CLIENT_ID = '52953697088-fq2bm9thqe8tt7jivl35b2ov544a286d.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/transcript'; // This should match the redirect URI specified in your OAuth client configuration

// Create OAuth 2.0 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Define route to obtain OAuth 2.0 access token
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange authorization code for access token
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;

    // Make authorized request to fetch transcript
    const transcript = await fetchTranscript(accessToken);

    // Send transcript as response
    res.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'An error occurred while fetching transcript.' });
  }
});

// Define route to initiate OAuth 2.0 authentication flow
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/youtube.readonly', // Specify the required scopes
  });

  res.redirect(authUrl);
});

// Function to fetch transcript using OAuth 2.0 access token
async function fetchTranscript(accessToken) {
  try {
    const videoId = 'm3nWnuhPZzM';

    // Make authorized request to fetch captions
    const response = await axios.get('https://www.googleapis.com/youtube/v3/captions', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'snippet',
        videoId: videoId,
      },
    });

    // Extract caption ID
    const captionId = response.data.items[0].id;

    // Make authorized request to fetch transcript
    const transcriptResponse = await axios.get(`https://www.googleapis.com/youtube/v3/captions/${captionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        format: 'srt',
      },
    });

    // Parse transcript from SRT format
    const transcript = await parseSRT(transcriptResponse.data);
    return transcript;
  } catch (error) {
    throw error;
  }
}

// Helper function to parse SRT format
function parseSRT(data) {
  return new Promise((resolve, reject) => {
    // Split data into lines
    const lines = data.trim().split('\n');

    // Initialize transcript array
    let transcript = [];

    // Iterate over lines
    for (let i = 0; i < lines.length; i++) {
      // Ignore line number
      if (!isNaN(parseInt(lines[i]))) {
        continue;
      }

      // Parse time codes and text
      const timeCodes = lines[++i].split(' --> ');
      const startTime = timeCodes[0];
      const endTime = timeCodes[1];
      const text = lines[++i];

      // Add to transcript array
      transcript.push({ startTime, endTime, text });
    }

    // Resolve with transcript
    resolve(transcript);
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

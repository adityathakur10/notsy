// Import required modules
const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');

// Create Express app
const app = express();

// Define API key
// const API_KEY = 'AIzaSyBammCYSlQLmcEMz7LEtE2QTntDxGaq2No';
const API_KEY = 'AIzaSyBLZrOljsN9L8A2J4IwcB88DWXk7RI6r4w';

// Define route to fetch transcript
app.get('/transcript', async (req, res) => {
  try {
    // Video ID (Replace with your desired video ID)
    const videoId = 'm3nWnuhPZzM';

    // Make request to YouTube Data API to fetch captions
    const response = await axios.get('https://www.googleapis.com/youtube/v3/captions', {
      params: {
        key: API_KEY,
        part: 'snippet',
        videoId: videoId,
      },
    });

    // Extract caption ID
    const captionId = response.data.items[0].id;
    console.log(captionId)

    // Make request to YouTube Data API to fetch transcript
    const transcriptResponse = await axios.get('https://www.googleapis.com/youtube/v3/captions/' + captionId, {
      params: {
        key: API_KEY,
        format: 'srt', // Specify the format of the transcript (e.g., 'srt' or 'ttml')
      },
    });

    // Parse transcript from SRT format
    const transcript = await parseSRT(transcriptResponse.data);

    // Send transcript as response
    res.json({ transcript });
    
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'An error occurred while fetching transcript.' });
  }
});

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

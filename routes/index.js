var express = require('express');
var router = express.Router();

const upload=require('./multer')
const path=require('path')
const axios=require('axios')
const FormData = require('form-data');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: true }));

                                                        //for getting pdf from vedio url

//for to pdf
const PDFDocument = require('pdfkit');
const url=require('url')


//modules required 
const fs=require('fs') //
const YoutubeMp3Downloader=require('youtube-mp3-downloader') //
const { Deepgram } = require('@deepgram/sdk')  //
const ffmpeg = require('ffmpeg-static')  //

//deepgram api key
const deepgram = new Deepgram('ccb8597f37a0e52273575912ff27c96193d796cb')
 
                                                                 // end //
    
router.get('/', function(req, res, next) {
  res.render('Homepage');
});
router.get('/chatpdf', function(req, res, next) {
  res.render('Chatpdf');
});
router.get('/chatvideo', function(req, res, next) {
  res.render('Chatvideo');
});
router.get('/form', function(req, res, next) {
  res.render('form');
});



//downloadinf function
// const YD = new YoutubeMp3Downloader({
//   ffmpegPath: ffmpeg,
//   outputPath: './',
//   youtubeVideoQuality: 'highestaudio'
// })

const ydDownload=require('../controllers/pdfToText')
router.post('/api/toText',async(req,res)=>{
  const {name}=req.body
  console.log(typeof name)
  const inputUrl=url.parse(name,true)
  const data=inputUrl.query

  const id=data.v
  console.log(inputUrl)
  try {
    const pdfFileName=await ydDownload(id);
    // Render the chatting HTML page with the PDF name
    res.render('chatvideo', { pdfName: pdfFileName });
  } catch (error) {
    console.error("Error occurred during download and transcription:", error);
    res.status(500).send("Error occurred during download and transcription");
  }

//   YD.download(id)
//   YD.on('progress', data => {
//       console.log(data.progress.percentage + '% downloaded')
//       // res.send(data.progress.percentage + '% downloaded')
//     })

//   YD.on('finished', async (err, video) => {
//       const videoFileName = video.file
//       console.log(`Downloaded ${videoFileName}`)
    
//       const file = {
//         buffer: fs.readFileSync(videoFileName),
//         mimetype: 'audio/mp3'
//       }
//       const options = {
//         punctuate: true
//       }
    
//       const result = await deepgram.transcription
//               .preRecorded(file, options)
//               .catch(e => console.log(e))
//       const transcript = result.results.channels[0].alternatives[0].transcript
    
//       fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`)
//       fs.unlinkSync(videoFileName)
       
//        const textFile=`${videoFileName}.txt`
//       //  console.log(videoFileName)
//       //  console.log(textFile)
//       //  console.log('i just printed the vedioFile name and then texFile')

//       const filePath=`./${textFile}`;
//       let filedata='';
//       const fd=fs.readFileSync(filePath, 'utf8');

//       // create a document the same way as above
//       const doc = new PDFDocument;
//       // add your content to the document here, as usual
//       doc.text(fd);
//       // get a blob when you're done   ${textFile}.pdf
//       doc.pipe(fs.createWriteStream(`./public/pdf/${textFile}.pdf`));
//       doc.end();

//       //render chatting html page
//       res.render('chatvideo',{pdfName:textFile})


      
// })

})



const uploadPdfAndGetSourceId=async(filePath)=>{
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const options = {
        headers: {
            'x-api-key': 'sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5', // Replace with your API key
            ...formData.getHeaders(),
        },
    };

    const response = await axios.post('https://api.chatpdf.com/v1/sources/add-file', formData, options);
    return response.data.sourceId;
    
  } catch (error) {
    console.error('error while uploading pdf :',error.message);
    throw error
    
  }
}
const sendMessageToPDF = async (sourceId, message) => {
  try {
      const config = {
          headers: {
              'x-api-key': 'sec_yJf5jl4JpvI8loktTAUTflujsyCBDxv5', // Replace with your API key
              'Content-Type': 'application/json',
          },
      };

      const data = {
          sourceId: sourceId,
          messages: [
              {
                  role: 'user',
                  content: message,
              },
          ],
      };

      const response = await axios.post('https://api.chatpdf.com/v1/chats/message', data, config);
      return response.data.content;
  } catch (error) {
      console.error('Error sending message:', error.message);
      throw error;
  }
}





router.post('/chat',(req,res)=>{
  const  data= req.body;
  console.log(typeof ques)
  const str=data.question
  const pName=data.Name
  console.log( 'hello')

  const startServer = async () => {
      try {
          const sourceId = await uploadPdfAndGetSourceId(`./public/pdf/${pName}.pdf`); // Replace with your PDF file path
          console.log('PDF uploaded successfully. Source ID:', sourceId);
          let question = str;
          const messageResult = await sendMessageToPDF(sourceId,question);
          console.log('\n\nMessage Result:', messageResult);
          res.json(
            {ans:messageResult}
          )
          
          // const answer=messageResult
          // res.render('try',{ans:messageResult})
  
          
      } catch (error) {
          console.error('Error:', error.message);
      }
  }
  startServer()



})


module.exports = router;



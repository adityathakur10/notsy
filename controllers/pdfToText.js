
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
//downloadinf function
const YD = new YoutubeMp3Downloader({
    ffmpegPath: ffmpeg,
    outputPath: './',
    youtubeVideoQuality: 'highestaudio'
  })


async function ydDownload(id){
   return new Promise((res,reject)=>{
    YD.download(id)
    YD.on('progress', data => {
        console.log(data.progress.percentage + '% downloaded')
        // res.send(data.progress.percentage + '% downloaded')
      })
  
    YD.on('finished', async (err, video) => {
        const videoFileName = video.file
        console.log(`Downloaded ${videoFileName}`)
      
        const file = {
          buffer: fs.readFileSync(videoFileName),
          mimetype: 'audio/mp3'
        }
        const options = {
          punctuate: true
        }
      
        const result = await deepgram.transcription
                .preRecorded(file, options)
                .catch(e => console.log(e))
        const transcript = result.results.channels[0].alternatives[0].transcript
      
        fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`)
        fs.unlinkSync(videoFileName)
         
         const textFile=`${videoFileName}.txt`
        //  console.log(videoFileName)
        //  console.log(textFile)
        //  console.log('i just printed the vedioFile name and then texFile')
  
        const filePath=`./${textFile}`;
        let filedata='';
        const fd=fs.readFileSync(filePath, 'utf8');
  
      // create a document the same way as above
        const doc = new PDFDocument;
        // add your content to the document here, as usual
        doc.text(fd);
        // get a blob when you're done   ${textFile}.pdf
        doc.pipe(fs.createWriteStream(`./public/pdf/${textFile}.pdf`));
        doc.end();
  
res(textFile)
    // return `${textFile}`;
        //render chatting html page
        // res.render('chatvideo',{pdfName:textFile})
  
   }) 
  
        
  }
)}
  




  module.exports=ydDownload


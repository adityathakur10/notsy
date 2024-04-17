const multer=require('multer')
const {v4:uuidv4}=require('uuid')
const path=require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')   //destination folder for upload
    },
    filename: function (req, file, cb) {
        const uniqueName=uuidv4();   //gives a unique name to uploaded file
        cb(null, uniqueName + path.extname(file.originalname))     //path.extname(file.originalname).....gives us the ext. of original file uploaded
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports=upload
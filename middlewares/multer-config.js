import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export default multer({
  storage: diskStorage({
    destination: (req, file, callback) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const imgPath = process.env.IMGURL ? process.env.IMGURL : '/uploads/images';
      callback(null, join(__dirname, "..", imgPath));  // Ensure the correct path is used
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|JPG|PNG|JPEG)$/)) {
      return cb(new Error("Please upload an Image"));
    }
    cb(undefined, true);
  },
}).single("upload");

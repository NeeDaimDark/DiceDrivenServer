import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const databaseName = process.env.DBNAME;
// badel hedhi ki bech taamel docker-compose up DOCKERDBURL
const databaseURL = process.env.DOCKERDBURL;
mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const connectDb = () => {
  mongoose
    .connect(`mongodb://127.0.0.1:27017/DiceDrivenDb`)
    .then(() => {
      console.log(`Connected to database`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDb;

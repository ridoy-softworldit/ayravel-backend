import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

const port = config.port || 5000;

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(port, () => {
      console.log(`Milko Server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

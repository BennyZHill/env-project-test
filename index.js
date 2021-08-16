const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const mongoose = require("mongoose");
const argv = yargs(hideBin(process.argv)).argv;
require("dotenv").config();

mongoose.connect(
  `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connected to mongo");
});
const Cat = new mongoose.model("Cat", {
  name: { type: String, require: true, unique: true },
  agae: { type: Number },
});
const main = async () => {
  if (argv.add) {
    try {
      const cat = new Cat({ name: argv.name, age: argv.age });
      await cat.save();
    } catch (error) {
      console.log(`cant add ${argv.name}, already exists`);
    }
  } else if (argv.edit) {
    console.log(`editing: ${argv.name} -> ${argv.newName}`);
  } else if (argv.show) {
    const cats = await Cat.find({});
    console.log(`Showing: ${cats}`);
  } else if (argv.remove) {
    console.log(`Removing: ${argv.name}`);
  }
  process.exit();
};
main();

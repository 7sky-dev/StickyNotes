const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "your_db_name";
const collectionName = "your_collection_name";

client.connect((err) => {
  console.log(err);
});

const db = client.db(dbName);
const collection = db.collection(collectionName);

app.set("view engine", "ejs");

const port = 5555;

app.use(express.static(__dirname + "\\public"));

app.get("/", async (req, res) => {
  let data = await collection.find().toArray();
  res.render("index.ejs", {
    template: data,
  });
});

app.get("/adding", async (req, res) => {
  const { title, description } = req.query;
  let d = new Date();
  let dane = await collection.find().toArray();
  let dl = dane.length;

  if (dl == 0) {
    let id = 1;
    collection.insertOne({
      id: Number(`${id}`),
      name: title,
      note: description,
      date: `${d.getDate()}.${d.getMonth() + 1}.${d.getUTCFullYear()}`,
    });
  } else {
    dl = dl - 1;
    let id = dane[dl].id + 1;

    if (title != "" && description != "")
      collection.insertOne({
        id: Number(`${id}`),
        name: title,
        note: description,
        date: `${d.getDate()}.${d.getMonth() + 1}.${d.getUTCFullYear()}`,
      });
  }

  res.redirect("/");
});

app.get("/delete.:i", (req, res) => {
  const i = req.params.i;
  collection.deleteOne({ id: Number(`${i}`) });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://volunTeer:GLKpDWudG1c94VjW@cluster0.gkpf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const pictureCollection = client.db("volunteer").collection("picture");
    const singleCollection = client.db("volunteer").collection("single");
    const userCollection = client.db("users").collection("user");

    //All data get items
    app.get("/pictures", async (req, res) => {
      const query = {};
      const cursor = pictureCollection.find(query);
      const pictures = await cursor.toArray();
      res.send(pictures);
    });

    //Single data load
    app.get("/pictures/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const picture = await pictureCollection.findOne(query);
      res.send(picture);
    });

    //data added (post)
    app.post("/pictures", async (req, res) => {
      const { name, date, description, img } = req.body;
      const doc = {
        name,
        date,
        description,
        img,
      };
      const result = await pictureCollection.insertOne(doc);
      res.send(result);
    });
    //===================Single ==============
    //data added (post)
    app.post("/picture", async (req, res) => {
      const picture = req.body;
      const { img, name, date } = picture.picture;
      const doc = {
        img,
        name,
        date,
      };
      const result = await singleCollection.insertOne(doc);
      res.send(result);
    });
    //Single data post
    app.get("/picture", async (req, res) => {
      const query = {};
      const cursor = singleCollection.find(query);
      const picture = await cursor.toArray();
      res.send(picture);
    });
    //Single picture Delete;
    app.delete("/picture/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await singleCollection.deleteOne(query);
      res.send(result);
    });
    //=================================================
    //data count
    // app.get("/pictureCount", async (req, res) => {
    //   const count = await pictureCollection.estimatedDocumentCount();
    //   res.send(count);
    // });

    //users added (post)
    app.post("/users", async (req, res) => {
      const { name, date, description, email, organize } = req.body;
      const doc = {
        name,
        email,
        organize,
        date,
        description,
      };
      const result = await userCollection.insertOne(doc);
      res.send(result);
    });

    // //All data get user
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //Single user Delete;
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.dir);
app.get("/", (req, res) => {
  res.send("Hello How are You Server");
});
app.listen(port, () => {
  console.log(port, "Example port connected");
});

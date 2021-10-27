const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB_USER= geniusMechanic
// DB_PASS= YZPHoVBSje7uWVx6

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fgg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('genius server running');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here');
})

app.listen(port, () => {
    console.log('Running genius server on port', port);
})

/* Steps for heroku deploy One time:
1.heroku acount open
2.heroku software install

Steps for heroku deploy every project:
1.git init
2.gitignore(node_module, .env)
3.git push everything like normal
4.make sure that you have this script in package.json:"start": "node index.js"
5.make sure that : put process.env.PORT in the port variable
6.heroku login
7.heroku create project only one time for a project
8.command: git push heroku main
--------
Update:
1.check everything and save
2.git add. , git commit -m"",git push
3.git push heroku main

*/
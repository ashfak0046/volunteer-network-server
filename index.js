const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID =  require('mongodb').ObjectID;
require('dotenv').config()


const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plb4i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World! Its Connected')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("organicdb").collection("events");
    
    app.post('/addEvent',(req,res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/events',(req,res) => {
        eventCollection.find()
        .toArray((err,documents) => {
            res.send(documents);
        })
    })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
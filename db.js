import { MongoClient } from "mongodb";
const dbUri = 'mongodb+srv://dhayvid17:Iloveyou77@cluster0.c0cgraj.mongodb.net/dhayvid17?retryWrites=true&w=majority&appName=Cluster0';

let dbConnection;

//Database Connection
const connectToDb = (cb) => {

    MongoClient.connect(dbUri)
        .then((client) => {
            dbConnection = client.db()
            console.log('connected to database');
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
}

const getDb = () => dbConnection;

export { connectToDb, getDb };
























// , { useNewUrlParser: true, useUnifiedTopology: true }
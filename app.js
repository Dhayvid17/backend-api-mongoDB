import express from "express";
import { ObjectId } from "mongodb";
import { connectToDb, getDb } from './db.js';

//Initialize Express and Middleware
const app = express();
app.use(express.json());

//Database connection
let db

connectToDb((err) => {
    if (!err) {
        app.listen(7000, () => {
            console.log("app running on port 7000")
        })
        db = getDb()
    }
})

//ROUTE TO GET ALL BOOKS
app.get('/books', (req, res) => {
    let books = [];

    db.collection('books').find().sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            console.log('Fetched books...');
            res.status(200).json(books)
        })
        .catch((err) => {
            console.log(err, 'could not fetch documents')
            res.status(500).json({ error: 'Could not fetch documents' })
        });
});

//ROUTE TO GET A SINGLE BOOK
app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books').findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not find document' })
            })
    } else {
        res.status(500).json({ error: 'Not a valid document' })
    }
});

//ROUTE TO POST A NEW BOOK
app.post('/books', (req, res) => {
    const newBook = req.body;

    db.collection('books').insertOne(newBook)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not add new document' })
        })
});

//ROUTE TO DELETE A BOOK
app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not delete document' })
        })
    } else {
        res.status(500).json({ error: 'Not a valid document' })
    } 
});

//ROUTE TO UPDATE A BOOK
app.patch('/books/:id', (req, res) => {

    const updates = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books').updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not update book' })
        })
    } else {
        res.status(500).json({ error: 'Not a valid document' })
    } 
})



export default app;


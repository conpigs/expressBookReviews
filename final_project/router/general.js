const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password){
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can log in."});
        }else{
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const promise = new Promise((resolve, reject)=>{
        resolve(books);
    });
    promise.then((data)=>{
        res.send(JSON.stringify(data,null,4));
    })
    promise.catch((error)=>{
        res.status(500).send(error.toString());
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const promise = new Promise((resolve, reject)=>{
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    });
    promise.then((data)=>{
        res.send(JSON.stringify(data,null,4));
    })
    promise.catch((error)=>{
        res.status(500).send(error.toString());
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const promise = new Promise((resolve, reject)=>{
        const author = req.params.author;
        const keys = Object.keys(books);
        const output = [];
        let count = 1;
        keys.forEach((key)=>{
            if(books[key].author === author){
                const details = {...books[key]};
                details["isbn"] = count;
                output.push(details);
            }
            count++
        });
        resolve(output);
    });
    promise.then((data)=>{
        res.send(JSON.stringify(data,null,4));
    })
    promise.catch((error)=>{
        res.status(500).send(error.toString());
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const promise = new Promise((resolve, reject)=>{
        const title = req.params.title;
        const keys = Object.keys(books);
        const output = [];
        let count = 1;
        keys.forEach((key)=>{
            if(books[key].title === title){
                const details = books[key];
                details["isbn"] = count;
                output.push(details);
            }
            count++
        });
        resolve(output);
    });
    promise.then((data)=>{
        res.send(JSON.stringify(data,null,4));
    })
    promise.catch((error)=>{
        res.status(500).send(error.toString());
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = parseInt(req.params.isbn);
    let BookDetails = Object.values(books)
    Review = (BookDetails[ISBN]);
    console.log(Review);
    res.send(Review.reviews);
});

module.exports.general = public_users;

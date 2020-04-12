'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 4000 ;
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
  res.render('pages/index');
});


app.get('/search/show',(req,res)=>{
  res.render('pages/searches/show');
});

app.post('/search', (req, res) => {
  let testArr = [];
  let url;
  if (req.body.search === 'title'){
    url = `https://www.googleapis.com/books/v1/volumes?q=search+intitle:${req.body.catagory}`;
  }else if (req.body.search === 'author') {
    url = `https://www.googleapis.com/books/v1/volumes?q=search+inauthor:${req.body.catagory}`;
  }
  superagent.get(url)
    .then(data =>{
      data.body.items.map( element =>{
        const book= new Book(element);
        testArr.push(book);
      });
      res.send(testArr);
    });
});


function Book(info){
  this.img = info.volumeInfo.imageLinks.smallThumbnail;
  this.title = info.volumeInfo.title;
  this.authors = info.volumeInfo.authors;
  this.description = info.volumeInfo.description;
  Book.all.push(this);
}
Book.all = [];

app.get('*',(req,res)=>{
  res.status(404).send('Not quit my tempo');
});

app.listen(PORT, () => console.log(`running on line ${PORT}`));






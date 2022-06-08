const express=require('express');
      app=express();
      morgan=require('morgan');
      bodyParser = require('body-parser'),
      uuid = require('uuid');
      mongoose= require('mongoose');
      Models= require('./models.js');
      Movies= Models.Movie;
      Users= Models.User;
      

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(morgan('common'));

//return list of all movies to client
app.get('/movies',(req,res)=>{
  Movies.find()
  .then(movies=>res.json(movies))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//return data about a single movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({Title:req.params.title})
  .then(movie=>res.json(movie))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//return description of a genre by genre name
app.get('/movies/genre/:genreName', (req, res) => {
  Movies.findOne({"Genre.Name":req.params.genreName})
  .then(movie=>res.json(movie.Genre.Description))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
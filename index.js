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

//return data about a director by director's name
app.get('/movies/director/:directorName',(req,res)=>{
  Movies.findOne({"Director.Name":req.params.directorName})
  .then(movie=>res.json(movie.Director))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//Create user
app.post('/users',(req,res)=>{
  Users.findOne({Username:req.body.Username})
  .then(user=>{
    if(user){
      res.status(400).send(req.body.Username + ' already exists!')
    }else{
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(user=> res.status(201).json(user))
      .catch(error=>{
        console.error(error);
        res.status(500).send('Error: ' + error)
      })
    }
  })
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//Update user info by username
app.put('/users/:username', (req,res)=>{
  Users.findOneAndUpdate({Username:req.params.username
  },{ $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  {new:true}
  )
  .then(updatedUser=>{
    res.status(201).json(updatedUser)
  })
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error :' + error)
  })
});


 //Delete user by name
 app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({Username:req.params.username})
  .then(user=>{
    if(!user){
      res.status(400).send(req.params.username + ' was not found')
    }else{
      res.status(200).send(req.params.username + ' was deleted.')
    }
  }).catch(error=>{
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
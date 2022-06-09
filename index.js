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
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//return list of all movies 
app.get('/movies',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Movies.find()
  .then(movies=>res.json(movies))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//return data about a single movie by title
app.get('/movies/:title',passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.findOne({Title:req.params.title})
  .then(movie=>res.json(movie))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//return description of a genre by genre name
app.get('/movies/genre/:genreName',passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({"Genre.Name":req.params.genreName})
  .then(movie=>res.json(movie.Genre.Description))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

//return data about a director by director's name
app.get('/movies/director/:directorName',passport.authenticate('jwt', { session: false }),(req,res)=>{
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
app.put('/users/:username',passport.authenticate('jwt', { session: false }),(req,res)=>{
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


 //Add new movie to list of favourite movies
app.put('/users/:username/movies/:MovieID',passport.authenticate('jwt', { session: false }),(req,res)=>{
   Users.findOneAndUpdate({Username:req.params.username
  },
  {$push:{FavouritesMovies:req.params.MovieID}},
  {new:true})
  .then(newMovie=>res.json(newMovie))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
  });

  //Delete movie from user's list of favourite movies
app.delete('/users/:username/movies/:MovieID',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Users.findOneAndUpdate({Username:req.params.username
 },
 {$pull:{FavouritesMovies:req.params.MovieID}},
 {new:true})
 .then(movieId=>res.json(movieId))
 .catch(error=>{
   console.error(error);
   res.status(500).send('Error: ' + error)
 })
 });


 //Delete user by name
 app.delete('/users/:username',passport.authenticate('jwt', { session: false }), (req, res) => {
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




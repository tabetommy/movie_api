const express=require('express');
      app=express(),
      morgan=require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose= require('mongoose'),
      Models= require('./models.js'),
      Movies= Models.Movie,
      Users= Models.User,
      cors = require('cors');
const { check, validationResult } = require('express-validator');

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


app.get('/',(req, res)=>{
  res.send('This ia an API for movie catalogs')
})

/**
 * Retrieve all movies from movie schema 
 *@returns{promise} Promise object represents data of all movies(id,title, Genre,Director,Description,Imagepath and Feature)
 */
app.get('/movies',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Movies.find()
  .then(movies=>res.json(movies))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});


/**
 * Retrieve all movies from movie schema for admin(verfication nor required)
 *@returns{promise} Promise object represents data of all movies(id,title, Genre,Director,Description,Imagepath and Feature)
 */
app.get('/movieadminroute',(req,res)=>{
  Movies.find()
  .then(movies=>res.json(movies))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

/**
 * Finds a single movie by movie name
 * @param{string} title
 * @returns{promise} Promise object represents the information about a single movie(
 * title,director,genre,summary)
 */
app.get('/movies/:title',passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.findOne({Title:req.params.title})
  .then(movie=>res.json(movie))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

/**
 * Finds by genre name the genre of a single movie
 * @param{string} genreName
 * @returns{promise} Promise object represents the information about the genre of single movie(
 * genre name and description)
 */
app.get('/movies/genre/:genreName',passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({"Genre.Name":req.params.genreName})
  .then(movie=>res.json(movie.Genre.Description))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});


/**
 * Finds one director in the movie schema by director name
 * @param{string} directorName
 * @returns{promise} Promise object represents the movie's director data
 * name,biography(bio), birth and death years
 */
app.get('/movies/director/:directorName',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Movies.findOne({"Director.Name":req.params.directorName})
  .then(movie=>res.json(movie.Director))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});


/**
 * Creates a user account
 * post methods contains Username, Passsword
 * Email and Birthday
 */
app.post('/users',[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday does not appear to be valid').isDate()
],(req,res)=>{
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username:req.body.Username})
  .then(user=>{
    if(user){
      res.status(400).send(req.body.Username + ' already exists!')
    }else{
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
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

/**
 * Finds a user by username from Users schema
 * @param{String} username
 * @returns{Promise} promise object represents data about the user.
 * should contain id, username, password, Email, Birthday and FavouritesMovies fields
 */
app.get('/users/:username',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Users.findOne({Username:req.params.username})
  .then(user=>res.json(user))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
});

/**
 * Finds one user and updates user data, with 
 * the given(new data)
 */
app.put('/users/:username',[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday does not appear to be valid').isDate()
],passport.authenticate('jwt', { session: false }),(req,res)=>{
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({Username:req.params.username
  },{ $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
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


/**
  * finds one user by name, navigates to the user's FavouritesMovies field and adds a 
  * movie a new movie id to it.
  * @param{string} username
  * @param{string} MovieID
 */
app.put('/users/:username/movies/:MovieID',passport.authenticate('jwt', { session: false }),(req,res)=>{
   Users.findOneAndUpdate({Username:req.params.username
  },
  {$addToSet:{FavouritesMovies:req.params.MovieID}},
  {new:true})
  .then(newMovie=>res.json(newMovie))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
  });


/** 
 * finds one user by username and retrieve its FavouriteMovies field
 * @param{string}username
 * @return{promise} Promise object represents an arrayof users favourite movies
 */ 
 app.get('/users/:username/movies',passport.authenticate('jwt', { session: false }),(req,res)=>{
  Users.findOne({Username:req.params.username})
  .then(user=>res.json(user.FavouritesMovies))
  .catch(error=>{
    console.error(error);
    res.status(500).send('Error: ' + error)
  })
  });

/**
 * find one user by username, navigates to favouriteMovies field 
 * and deletes movie by MovieID 
 * @param{string} username
 * @param{string} MovieID
 */
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


 /**
  * Find one user by username from user schema and delete user account
  * @param{string} username
  */
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



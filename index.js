const express=require('express');
      app=express();
      morgan=require('morgan');
      bodyParser = require('body-parser'),
      uuid = require('uuid');

app.use(bodyParser.json());

let users=[
    {
      id:"1",
      username:"Tommy Tabe",
      born:"January 25 1995",
      email:"xyz@yahoo.com",
      password:"xyz!",
      favMovies:["King of the boys", "Game of Thrones","Happy"]
    },
    {
      id:"2",
      username:"John Knox",
      born:"March 23 1990",
      email:"abc@yahoo.com",
      password:"abc?",
      favMovies:["Abejoye", "War room"]
    }
  ];

  let movies=[
    {
        title:'Game of Thrones',
        year:2011,
        genre:{
          name:'Adventure',
          description:'contain many of the same features of action movies, but are usually set in exotic locations. The main theme is adventure, with the characters often exploring places they have not been before or doing things they have not done before'
        },
        director:{
          name:'Alan Taylor',
          born:'January 13,1959'
        }

    },
    {
        title:'Abejoye',
        year:2018,
        genre:{
          name:'Gospel',
          description:'Movies containing inspired messages the God of the Bible, Jesus and God\'s'
      },
        director:{
          name:'Damilola Mike-Bamiloye',
          born:'September 16,1989'
        }
    },
    {
        title:'War Room',
        year:2015,
        genre:{
          name:'Gospel',
          description:'Movies containing inspired messages the God of the Bible, Jesus and God\'s'
          },
        director:{
          name:'Alex kendrick',
          born:'June 11,1970'
        }
    },
    {
        title:'The Blacklist',
        year:2013,
        genre:{
          name:'Thriller',
          description:'a work of fiction or drama designed to hold the interest by the use of a high degree of intrigue, adventure, or suspense.'
          },
        director:{
          name:'Joe Carnahan',
          born:'May 9,1969'
        }
    },
    {
        title:'Legend of the Seeker',
        year:2008,
        genre:{
          name:'Adventure',
          description:'contain many of the same features of action movies, but are usually set in exotic locations. The main theme is adventure, with the characters often exploring places they have not been before or doing things they have not done before'
        },
        director:{
          name:'Sam Raimi',
          born:'October 23,1959'
        }
    },
];

app.use(morgan('common'));

//return list of all movies to client
app.get('/movies',(req,res)=>{
    res.json(movies);
});

//return data about a single movie
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) =>movie.title === req.params.title));
  });

//return data about a genre by genre name
app.get('/movies/genre/:name', (req, res) => {
    const movieGenre = movies.find(movie => movie.genre.name === req.params.name);
    if (movieGenre) {
        res.status(200).json(movieGenre.genre.description);
    } else {
        res.status(400).send(req.params.name + ' not found')
    }
});

//return data about a director by name
app.get('/movies/director/:name',(req,res)=>{
    const movieDirector=movies.find(movie=>movie.director.name=req.params.name);
    if(movieDirector){
      res.status(200).json(movieDirector.director)
    }else{
      res.status(400).send('No movie directed by' + req.params.name + ' found')
    }
  });

//get all users
app.get('/users',(req,res)=>{
    res.json(users);
  });
  
//Allow  new users to register
  app.post('/users',(req,res)=>{
    let newUser=req.body;
    if(!newUser.username){
      res.status(400).send('Username is missing in the request body')
    }else{
      newUser.id=uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser)
    }
  });

//Allow users update their  password 
app.put('/users/:username/:password', (req,res)=>{
    let user=users.find(user=>user.username===req.params.username);
    if(user){
      user.password=req.params.password
      res.status(201).send( user.username +'\'s passowrd has been succesfully updated')
    }else{
      res.status(400).send(req.params.username +' not found')
    }
 });

 //Allow users to add movies to their list of favourite movies
app.put('/users/:username/favMovies/:favMovies',(req,res)=>{
    let user=users.find(user=>user.username===req.params.username);
    if(user){
      const message=user.username +' succesfully added ' + req.params.favMovies + ' to his list of favourite movies ' 
      user.favMovies.push(req.params.favMovies)
      res.status(201).send(message)
    }else{
      res.status(400).send('The user ' + req.params.username +' is not found')
    }
  });

  //Allow users to remove a movie from their list of favourite movies
app.delete('/users/:username/favMovies/:removeMovie',(req,res)=>{
    const {removeMovie}=req.params;
    const {username}=req.params;
  
    let user=users.find(user=>user.username===username && user.favMovies.includes(removeMovie));
    if(user){
      const movieIndex=user.favMovies.indexOf(removeMovie)
      const message= removeMovie + ' has been succesfully deleted from ' + username + '\'s list of favourite movies';
      user.favMovies.splice(movieIndex,1)
      res.status(200).send(message)
    }else{
      res.status(400).send( 'usrname :' + username + ' or movie:' +  removeMovie +' is not found')
    }
  
  });

  //Allow user to deregister himself or herself by id(*+sauber)
app.delete('/users/:id', (req, res) => {
    let user = users.find(user =>user.id === req.params.id);
    if (user) {
      users = users.filter(obj => obj.id !== req.params.id);
      res.status(201).send('User with id ' + req.params.id + ' was deleted.');
    }else{
      res.status(400).send(req.params.id + ' not found')
    }
  });

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
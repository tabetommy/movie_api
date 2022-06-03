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

let favouriteMovies=[
    {
        title:'Game of Thrones',
        year:2011,
        genre:'Adventure'

    },
    {
        title:'Abejoye',
        year:2018,
        genre:'Gospel'
    },
    {
        title:'War Room',
        year:2015,
        genre:'Gospel'
    },
    {
        title:'Blacklist',
        year:2013,
        genre:'Crime'
    },
    {
        title:'Legend of the Seeker',
        year:2008,
        genre:'Adventure'
    },
    {
        title:'King of the Boys',
        year:2018,
        genre:'Political Thriller'
    },
    {
        title:'24',
        year:2001,
        genre:'Crime thriller'
    },
    {
        title:'House of Cards',
        year:2013,
        genre:'Political Drama'
    },
    {
        title:'Power',
        year:2014,
        genre:'Crime Drama'
    },
    {
        title:'THe Weddding Party 1',
        year:2016,
        genre:'Comedy'
    },
];

app.use(morgan('common'));
//return route
app.get('/',(req,res)=>{
    res.send('Welcome to my favourite movies of all time!');

});

//return list of all movies to client
app.get('/movies',(req,res)=>{
    res.json(favouriteMovies);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
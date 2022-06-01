const express=require('express');
const app=express();
const morgan=require('morgan');


const favouriteMovies=[
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

app.get('/movies',(req,res)=>{
    res.json(favouriteMovies);

});

app.get('/',(req,res)=>{
    res.send('Welcome to my favourite movies of all time!');

});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
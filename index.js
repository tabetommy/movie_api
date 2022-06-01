const express=require('express');
const app=express();
const morgan=require('morgan');


const favouriteMovies=[
    {
        title:'Game of Thrones',
        year:2011,
        category:'Adventure'

    },
    {
        title:'Abejoye',
        year:2018,
        category:'Gospel'
    },
    {
        title:'War Room',
        year:2015,
        category:'Gospel'
    },
    {
        title:'Blacklist',
        year:2013,
        category:'Crime'
    },
    {
        title:'Legend of the Seeker',
        year:2008,
        category:'Adventure'
    },
    {
        title:'King of the Boys',
        year:2018,
        category:'Political Thriller'
    },
    {
        title:'24',
        year:2001,
        category:'Crime thriller'
    },
    {
        title:'House of Cards',
        year:2013,
        category:'Political Drama'
    },
    {
        title:'Power',
        year:2014,
        category:'Crime Drama'
    },
    {
        title:'THe Weddding Party 1',
        year:2016,
        category:'Comedy'
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

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
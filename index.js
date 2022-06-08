const express=require('express');
      app=express();
      morgan=require('morgan');
      bodyParser = require('body-parser'),
      uuid = require('uuid');
      

app.use(bodyParser.json());



app.use(morgan('common'));



app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080,()=>{
    console.log('This app is being listened to on port 8080');
});
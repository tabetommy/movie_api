const passport=require('passport'),
      LocalStrategy=require('passport-local'),
      Models=require('./models'),
      passportJWT=require('passport-jwt');

let Users=Models.Users,
    JWTStrategy=passportJWT.Strategy,
    ExtractJWT=passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField:'Username',
    passwordField:'Password'
},(username,password,callback)=>{
    console.log(username + ' ' + password);
    Users.findOne({Username:username},(error, user)=>{
        if(error){
            console.log(error);
            return callback(error);
        }

        if(!user){
            console.log('incorrect username');
            return callback(null, flase, {message:'Incorrect username or passowrd'})
        }
    console.log('finished');
    return callback(null,user)
    })
}
));

passport.use(new JWTStrategy({
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'my_jwt_secret'
},(jwtPayload, callback)=>{
    return Users.findById(jwtPayload._id)
    .then(user=>{
        return callback(null, user)
    })
    .catch(error=>{
        return callback(error)
    });
}));
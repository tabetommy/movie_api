# Movie REST API

This api serve data on movies

## Get list of all movies

### Request

`GET /movies/`

### Response

    JSON object of all movies consising of key value pairs eg.
    {
    	"id":"123",
    	"Title":"Sleeping horses",
    	"Description":"Write a nice description here",
    	"Genre":{
    		"Name":"Adventure",
    		"Description":"Genre descrip here."
    	},
    	"Director":{
    		"Name":"Director's name",
    		"Bio":"Director's bio",
    		"Birth":"Director's date of birth"
    	},
    	"ImagePath":"A url to movies portrait",
    	"Feature": "A boolean"
    }



## Get a movie by title

### Request

`GET /movies/:title`

### Response

A single movie JSON object


## Get movie genre

### Request

`Get /movies/genre/:genreName`

### Response

 The genre object of a single movie


## Get movie Director

### Request

`Get /movies/director/:directorName`

### Response

 The director object of a single movie


## Creat a user profile

### Request

`POST /users`

### Request body

    {
		Username:"John Doe",
	    Password: "123§",
	    Email: "johndoe@yahoo.com"
	    Birthday: "20.03.2003"
    }


## Get a user by username

### Request

`GET /users/:username`

### Response
    
    A JSON object containing users date eg.
    {
		"Username":"John Doe",
	    "Password": "123§",
	    "Email": "johndoe@yahoo.com"
	    "Birthday": "20.03.2003"
    }
    
  

## Update user info

### Request

`PUT /users/:username`



## Add a movie to the list of user's favorite movies

### Request

`GET /users/:username/movies/:MovieID`


## Remove a movie from a user'S list of favorite movies

### Request

`DELETE /users/:username/movies/:MovieID`


## Delete user account

### Request

`DELETE/users/:username`


👤 **Author1**

- Website : [portfolio](https://tabetommy.github.io/website-portfolio/)
- Github: [tabetommy](https://github.com/tabetommy)
- Linkedin: [tabetommy](https://www.linkedin.com/in/tommy-egbe-304464116/)

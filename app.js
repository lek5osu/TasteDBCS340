/*
    SETUP
*/

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 9244;                  // Set a port number at the top so it's easy to change in the future
app.use(express.json());  
app.use(express.static('public')); // dev note: this was causing so many issues

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    }); 


// Route for Restaurants, Dishes and RestaurantsDishes Browse
app.get('/restaurantsDishes', function(req, res) {
    // Query to get data from the Restaurants_Dishes, Restaurants, and Dishes tables
    let query1 = 'SELECT * FROM Restaurants_Dishes;';
    let query2 = 'SELECT * FROM Restaurants;';
    let query3 = 'SELECT * FROM Dishes;';

    // Execute query1 (Restaurants_Dishes)
    db.pool.query(query1, function(error, results1) {
        if (error) throw error;  // Handle any query errors
        
        // Execute query2 (Restaurants)
        db.pool.query(query2, function(error, results2) {
            if (error) throw error;  // Handle any query errors
            
            // Execute query3 (Dishes)
            db.pool.query(query3, function(error, results3) {
                if (error) throw error;  // Handle any query errors
                
                res.render('restaurantsDishes', {
                    data1: results1,  // Data from Restaurants_Dishes
                    data2: results2,  // Data from Restaurants
                    data3: results3   // Data from Dishes
                });
            });
        });
    });
});

// Route for Users Browse
app.get('/users', function(req, res) {
    let query1 = 'SELECT * FROM Users;';

    db.pool.query(query1, function(error, results1) {
        if (error) throw error;
            res.render('users', {
                data1: results1,  
                });
            });
        });

// Route for Reviews Browse
app.get('/reviews', function (req, res) {
    // Query to retrieve Reviews
    let query = `
        SELECT 
            Reviews.ReviewID,
            CONCAT(Users.UserFirstName, ' ', Users.UserLastName) AS UserName,
            Restaurants.RestaurantName,
            Dishes.DishName,
            DATE_FORMAT(Reviews.ReviewDate, '%m-%d-%Y') AS ReviewDate,
            Reviews.ReviewComment,
            Reviews.Taste,
            Reviews.Presentation
        FROM Reviews
        JOIN Users ON Reviews.UserID = Users.UserID
        JOIN Restaurants ON Reviews.RestaurantID = Restaurants.RestaurantID
        JOIN Dishes ON Reviews.DishID = Dishes.DishID;
    `;

    // Dropdown Queries
    let queryRestaurants = `SELECT RestaurantID, RestaurantName FROM Restaurants;`;
    let queryDishes = `SELECT DishID, DishName FROM Dishes;`;
    let queryUsers = `SELECT UserID, CONCAT(UserFirstName, ' ', UserLastName) AS UserName FROM Users;`;

    // Run the main Reviews query
    db.pool.query(query, function (error, rows, fields) {
        if (error) throw error;

        // Save the Reviews data
        let reviews = rows;
        console.log("Reviews:", reviews);
        // Run Restaurants query
        db.pool.query(queryRestaurants, function (error, rows, fields) {
            if (error) throw error;

            // Save the Restaurants data
            let restaurants = rows;
            console.log("Restaurants:", restaurants);
            // Run Dishes query
            db.pool.query(queryDishes, function (error, rows, fields) {
                if (error) throw error;

                // Save the Dishes data
                let dishes = rows;
                console.log("Dishes:", dishes);
                // Run Users query
                db.pool.query(queryUsers, function (error, rows, fields) {
                    if (error) throw error;

                    // Save the Users data
                    let users = rows;
                    console.log("Users:", users);
                    // Render the reviews page with all the data
                    // REF: https://stackoverflow.com/questions/54388669/mapping-data-with-dynamic-variables
                    // used to map entity attributes to work with "this.id" and "this.name" in hbs
                    return res.render('reviews', {
                        data1: reviews,
                        restaurants: restaurants.map(r => ({ id: r.RestaurantID, name: r.RestaurantName })),
                        dishes: dishes.map(d => ({ id: d.DishID, name: d.DishName })),
                        users: users.map(u => ({ id: u.UserID, name: u.UserName }))
                    });
                });
            });
        });
    });
});


// Route for RestaurantsAddresses Browse
app.get('/restaurantsAddresses', function(req, res) {
    let query1 = 'SELECT * FROM Restaurant_Address;';

    db.pool.query(query1, function(error, results) {
        if (error) throw error;
        res.render('restaurantsAddresses', {data1: results});
    });
});

// Add Restaurant Route (POST)
app.post('/add-restaurant', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Restaurants (RestaurantName) VALUES ('${data.RestaurantName}')`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } 
        else {
            // If the insert was successful, fetch the updated list of restaurants
            query2 = `SELECT * FROM Restaurants;`;

            // Fetch the updated list of restaurants
            db.pool.query(query2, function(error, rows, fields) {
                // Check if there was an error with the SELECT query
                if (error) {
                    console.log(error);  // Log any error
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            });
        }
    });
});

// Add Dish Route (POST)
app.post('/add-dish', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Dishes (DishName, CuisineType) VALUES ('${data.DishName}', '${data.CuisineType}')`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } 
        else {
            // If the insert was successful, fetch the updated list of restaurants
            query2 = `SELECT * FROM Dishes;`;

            // Fetch the updated list of restaurants
            db.pool.query(query2, function(error, rows, fields) {
                // Check if there was an error with the SELECT query
                if (error) {
                    console.log(error);  
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            });
        }
    });
});

// Add User Route (POST)
app.post('/add-user', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    query1 = `INSERT INTO Users (UserFirstName, UserLastName, UserEmail)  VALUES ('${data.UserFirstName}', '${data.UserLastName}', '${data.UserEmail}')`;
    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } 
        else {
            // If the insert was successful, fetch the updated list of restaurants
            query2 = `SELECT * FROM Users;`;

            // Fetch the updated list of restaurants
            db.pool.query(query2, function(error, rows, fields) {
                // Check if there was an error with the SELECT query
                if (error) {
                    console.log(error);  // Log any error
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            });
        }
    });
});

// Add Review Route (POST)
app.post('/add-review', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Reviews (RestaurantID, DishID, UserID, ReviewDate, ReviewComment, Taste, Presentation) 
              VALUES ('${data.RestaurantID}', '${data.DishID}', '${data.UserID}', '${data.ReviewDate}', '${data.ReviewComment}', '${data.Taste}', '${data.Presentation}')`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } 
        else {
            // If the insert was successful, fetch the updated list of reviews
            query2 = `SELECT * FROM Reviews;`;

            // Fetch the updated list of reviews
            db.pool.query(query2, function(error, rows, fields) {
                // Check if there was an error with the SELECT query
                if (error) {
                    console.log(error);  
                    res.sendStatus(400);
                } 
                else {
                    res.send(rows);
                }
            });
        }
    });
});


// Update RestaurantsDishes
app.put('/put-restaurant-ajax', function(req, res, next) {
    let data = req.body;
    let RestaurantDishID = parseInt(data.RestaurantDishID);
    let DishID = parseInt(data.DishID);
    let RestaurantID = parseInt(data.RestaurantID);

    let queryUpdateRestaurantsDishes = `UPDATE RestaurantsDishes SET RestaurantID = ?, DishID = ?`;

    db.pool.query(queryUpdateRestaurantsDishes, [RestaurantDishID, RestaurantID, DishID], function(error, rows, fields){
        if (error){
            console.log(error);
            return res.sendStatus(400);
        }
    })
});
// Delete Restaurants
app.delete('/delete-restaurant-ajax/', function(req,res,next){
    let data = req.body;
    let RestaurantID = parseInt(data.RestaurantID);
    let deleteRestaurantsDishes = `DELETE FROM Restaurants_Dishes WHERE RestaurantID = ?`;
    let deleteRestaurants= `DELETE FROM Restaurants WHERE RestaurantID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteRestaurantsDishes, [RestaurantID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              console.log("Request Body:", req.body);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteRestaurants, [RestaurantID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
// Delete RestaurantsDishes
app.delete('/delete-restaurantsDishes-ajax', function(req, res, next){
    let data = req.body;
    let RestaurantDishID = parseInt(data.RestaurantDishID);
    let deleteRestaurantsDishes = `DELETE FROM RestaurantsDishes WHERE RestaurantDishID = ?`;

    // Run the query
    db.pool.query(deleteRestaurantsDishes, [RestaurantDishID], function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else{
            res.sendStatus(204);
        }
    })
});
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});

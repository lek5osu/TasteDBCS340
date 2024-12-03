// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 9241;                  // Set a port number at the top so it's easy to change in the future
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

// Add Restaurant and Dish
app.post('/add-RestaurantDish', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    query1 = `INSERT INTO Restaurants_Dishes (RestaurantID, DishID) VALUES ('${data.RestaurantID}', '${data.DishID}')`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } else {
            // If the insert was successful, fetch the updated list of restaurants
            query2 = `SELECT * FROM Restaurants_Dishes;`;

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

// Update Restaurants & Dishes
app.put('/put-restaurantDish-ajax', function(req, res, next) {
    let data = req.body;
    let RestaurantDishID = parseInt(data.RestaurantDishID);
    let DishID = parseInt(data.DishID);
    let RestaurantID = parseInt(data.RestaurantID);

    let queryUpdateRestaurantsDishes = `UPDATE Restaurants_Dishes SET RestaurantID = ?, DishID = ?`;
    let querySelect = `SELECT * FROM Restaurants_Dishes WHERE RestaurantDishID = ?`;

    db.pool.query(queryUpdateRestaurantsDishes, [RestaurantDishID, RestaurantID, DishID], function(error, rows, fields){
        if (error){
            console.log(error);
            return res.sendStatus(400);
        } else{
            db.pool.query(querySelect, [RestaurantDishID], function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } else{
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Dishes
app.delete('/delete-dish-ajax/', function(req,res,next){
    let data = req.body;
    let DishID = parseInt(data.DishID);
    let deleteRestaurantsDishes = `DELETE FROM Restaurants_Dishes WHERE DishID = ?`;
    console.log("There was an error");
    let deleteDishes = `DELETE FROM Dishes WHERE DishID = ?`;
        // Run the 1st query
        db.pool.query(deleteRestaurantsDishes, [DishID], function(error, rows, fields){
            if (error){
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                console.log("Request Body:", req.body);
                res.sendStatus(400);
            } else{
                // Run the second query
                db.pool.query(deleteDishes, [DishID], function(error, rows, fields) {
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } else{
                    res.sendStatus(204);
                }
            })
        }
    })
});

// Delete Restaurants
app.delete('/delete-restaurant-ajax/', function(req,res,next){
    let data = req.body;
    let RestaurantID = parseInt(data.RestaurantID);
    let deleteRestaurantsDishes = `DELETE FROM Restaurants_Dishes WHERE RestaurantID = ?`;
    let deleteRestaurants = `DELETE FROM Restaurants WHERE RestaurantID = ?`;
        // Run the 1st query
        db.pool.query(deleteRestaurantsDishes, [RestaurantID], function(error, rows, fields){
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                console.log("Request Body:", req.body);
                res.sendStatus(400);
            }  
            else{
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
        })
});

// Delete RestaurantsDishes
app.delete('/delete-restaurantDish-ajax', function(req, res, next){
    let data = req.body;
    let RestaurantDishID = parseInt(data.RestaurantDishID);
    let deleteRestaurantsDishes = `DELETE FROM Restaurants_Dishes WHERE RestaurantDishID = ?`;

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

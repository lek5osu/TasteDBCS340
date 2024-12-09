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
    // Dropdown Queries
    let queryRestaurants = `SELECT RestaurantID, RestaurantName FROM Restaurants;`;
    let queryDishes = `SELECT DishID, DishName FROM Dishes;`;

    // Execute query1 (Restaurants_Dishes table)
    db.pool.query(query1, function(error, results1) {
        if (error) throw error;

        // Execute query2 (Restaurants table)
        db.pool.query(query2, function(error, results2) {
            if (error) throw error;

            // Execute query3 (Dishes table)
            db.pool.query(query3, function(error, results3) {
                if (error) throw error;

                // Run Restaurants query
                db.pool.query(queryRestaurants, function(error, rows, fields) {
                    if (error) throw error;

                    // Save the Restaurants data
                    let restaurants = rows;
                    console.log("Restaurants:", restaurants);

                    // Run Dishes query
                    db.pool.query(queryDishes, function(error, rows, fields) {
                        if (error) throw error;

                        // Save the Dishes data
                        let dishes = rows;
                        console.log("Dishes:", dishes);

                        res.render('restaurantsDishes', {
                            data1: results1,  // Data from Restaurants_Dishes
                            data2: results2,  // Data from Restaurants
                            data3: results3,  // Data from Dishes
                            // map dropdowns in add form
                            restaurants: restaurants.map(r => ({ id: r.RestaurantID, name: r.RestaurantName })),
                            dishes: dishes.map(d => ({ id: d.DishID, name: d.DishName })),
                        });
                    });
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
app.get('/restaurantsAddresses', function (req, res) {
    // Query to retrieve Restaurant Addresses
    let query = `
        SELECT 
            Restaurant_Address.AddressID,
            Restaurants.RestaurantName,
            Restaurant_Address.Address,
            Restaurant_Address.City,
            Restaurant_Address.State,
            Restaurant_Address.Zipcode,
            Restaurant_Address.Suite
        FROM Restaurant_Address
        JOIN Restaurants ON Restaurant_Address.RestaurantID = Restaurants.RestaurantID;
    `;

    // Dropdown Query for Restaurants
    let queryRestaurants = `SELECT RestaurantID, RestaurantName FROM Restaurants;`;

    // Run the main Restaurant Addresses query
    db.pool.query(query, function (error, rows, fields) {
        if (error) throw error;

        // Save the Restaurant Addresses data
        let restaurantAddresses = rows;
        console.log("Restaurant Addresses:", restaurantAddresses);

        // Run the Restaurants query for the dropdown
        db.pool.query(queryRestaurants, function (error, rows, fields) {
            if (error) throw error;

            // Save the Restaurants data
            let restaurants = rows;
            console.log("Restaurants:", restaurants);

            // Render the restaurantAddresses page with all the data
            return res.render('restaurantsAddresses', {
                data1: restaurantAddresses,
                restaurants: restaurants.map(r => ({ id: r.RestaurantID, name: r.RestaurantName }))
            });
        });
    });
});


// Add Restaurant Route 
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

// Add Dish Route 
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

// Add Restaurant and Dish Route
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

// Add User Route 
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

// Add Review Route 
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

// Add Restaurant Address Route 
app.post('/add-restaurantAddress', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Construct the SQL query to insert the new restaurant address
    query1 = `
        INSERT INTO Restaurant_Address (RestaurantID, Address, City, State, Zipcode, Suite) 
        VALUES ('${data.RestaurantID}', '${data.Address}', '${data.City}', '${data.State}', '${data.Zipcode}', ${data.Suite ? `'${data.Suite}'` : 'NULL'})
    `;

    // Execute the insertion query
    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error with the insertion
        if (error) {
            console.log(error);  // Log the error for debugging
            res.sendStatus(400);
        } 
        else {
            // If the insert was successful, fetch the updated list of restaurant addresses
            query2 = `
                SELECT 
                    Restaurant_Address.AddressID,
                    Restaurants.RestaurantName,
                    Restaurant_Address.Address,
                    Restaurant_Address.City,
                    Restaurant_Address.State,
                    Restaurant_Address.Zipcode,
                    Restaurant_Address.Suite
                FROM Restaurant_Address
                JOIN Restaurants ON Restaurant_Address.RestaurantID = Restaurants.RestaurantID;
            `;

            // Fetch the updated list of restaurant addresses
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

// Update Restaurants & Dishes
app.put('/put-restaurantDish-ajax', function(req, res, next) {
    let data = req.body;
    let RestaurantDishID = parseInt(data.RestaurantDishID);
    let DishID = parseInt(data.DishID);
    let RestaurantID = parseInt(data.RestaurantID);

    let queryUpdateRestaurantsDishes = `UPDATE Restaurants_Dishes SET RestaurantID = ?, DishID = ? WHERE RestaurantDishID = ?`;
    let querySelect = `SELECT 
    Restaurants_Dishes.RestaurantDishID, 
    Restaurants.RestaurantName, 
    Dishes.DishName
    FROM Restaurants_Dishes
    INNER JOIN Restaurants ON Restaurants_Dishes.RestaurantID = Restaurants.RestaurantID
    INNER JOIN Dishes ON Restaurants_Dishes.DishID = Dishes.DishID
    ORDER BY Restaurants_Dishes.RestaurantDishID DESC;`

    db.pool.query(queryUpdateRestaurantsDishes, [RestaurantID, DishID, RestaurantDishID], function(error, results, fields) {
        if (error) {
            console.log("Update Error:", error);
            return res.sendStatus(400); 
        } else {
            db.pool.query(querySelect, [RestaurantDishID], function(error, rows, fields) {
                if (error) {
                    console.log(" Select Error:", error);
                    res.sendStatus(400); 
                } else {
                    res.send(rows); 
                }
            });
        }
    });
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

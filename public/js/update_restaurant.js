// Get the objects we need to modify
let updateRestaurantForm = document.getElementById('update-RestaurantsDishes-form-ajax');

// Modify the objects we need
updateRestaurantForm.addEventListener ("submit", function(e){
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRestaurantDishID = document.getElementById("input-RestaurantDishID-update");
    let inputRestaurantID = document.getElementById("input-RestaurantID-update");
    let inputDishID = document.getElementById("input-DishID-update");

    // Get the values from the form fields
    let restaurantDishIDValue = inputRestaurantDishID.value;
    let restaurantIDValue = inputRestaurantID.value;
    let dishIDValue = inputDishID.value;

    if (isNaN(restaurantIDValue)){
        return;
    }
    if (isNaN(dishIDValue)){
        return;
    }    

    // Put our data we want to send in a javascript object
    let data = {
        RestaurantDishID: restaurantDishIDValue,
        RestaurantID: restaurantIDValue,
        DishID: dishIDValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-restaurantDish-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200){

            // Add the new data to the table
            updateRow(xhttp.response, restaurantDishIDValue);

        } else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow (data, RestaurantDishID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("Restaurants-Dishes-Table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == RestaurantDishID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of restaurantID value
            let tdRestaurantID = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of dishID value
            let tdDishID = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign old values to our new value we updated to
            tdRestaurantID.innerHTML = parsedData[0].RestaurantID;
            tdDishID.innerHTML = parsedData[0].DishID; 
       }
    }
}

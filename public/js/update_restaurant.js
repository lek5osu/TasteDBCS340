// Get the objects we need to modify
let updateRestaurantForm = document.getElementById('update-restaurant-form-ajax');

// Modify the objects we need
updateRestaurantForm.addEventListener ("submit", function(e){
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRestaurantDish = document.getElementById("mySelect");
    let inputRestaurant = document.getElementById("input-Restaurant-update");
    let inputDish = document.getElementById("input-Dish-update");

    // Get the values from the form fields
    let restaurantValue = inputRestaurant.value;
    let dishValue = inputDish.value;

    // Put our data we want to send in a javascript object
    let data = {
        Restaurant: restaurantValue,
        Dish: dishValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-restaurant-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200){

            // Add the new data to the table
            updateRow(xhttp.response, restaurantValue);

        } else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow (data, RestaurantDishID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("restaurant-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == RestaurantDishID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of dish value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign dish to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}

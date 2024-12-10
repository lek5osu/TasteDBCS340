// Get the objects we need to modify
let updateRestaurantDishForm = document.getElementById('update-RestaurantsDishes-form-ajax');

// Modify the objects we need
updateRestaurantDishForm.addEventListener ("submit", function(e){
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRestaurantDishID = document.getElementById("input-RestaurantDishID-update");
    let inputRestaurantName = document.getElementById("input-RestaurantName-update");
    let inputDishName = document.getElementById("input-DishName-update");

    // Get the values from the form fields
    let restaurantDishIDValue = inputRestaurantDishID.value;
    let restaurantNameValue = inputRestaurantName.value;
    let dishNameValue = inputDishName.value;

    // REF: https://www.w3schools.com/js/js_validation.asp 
    // Form Validation
    if (!restaurantNameValue || !dishNameValue) {
        alert("Error: Restaurant/Dish combination exists already. Please select a new restaurant and dish combination.");
        return;
    }
    if (isNaN(restaurantNameValue)){
        return;
    }
    if (isNaN(dishNameValue)){
        return;
    }    
    // Retrieve the IDs for the selected restaurant and dish
    let restaurantIDValue = inputRestaurantName.options[inputRestaurantName.selectedIndex].getAttribute("data-id");
    let dishIDValue = inputDishName.options[inputDishName.selectedIndex].getAttribute("data-id");
    
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
    console.log(data) // Debugging
    xhttp.send(JSON.stringify(data));

})

function updateRow (data, RestaurantDishID){
    let parsedData = JSON.parse(data);
    console.log("Parsed Data:", parsedData); // debugging
    let table = document.getElementById("Restaurants-Dishes-Table");
    console.log("Table:", table); // debugging
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == RestaurantDishID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of dishName value
            let tdDishID = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of restaurantName value
            let tdRestaurantID = updateRowIndex.getElementsByTagName("td")[2];
            console.log(tdRestaurantID)
            console.log(tdDishID)
            // Reassign old values to our new value we updated to 
            // Note: parse using specific database row name
            tdRestaurantID.innerHTML = parsedData[0].RestaurantID;
            tdDishID.innerHTML = parsedData[0].DishID;

       }
    }
}function openUpdateForm(RestaurantDishID, RestaurantID, DishID) {
    // Populate the update form fields with current data
    document.getElementById("input-RestaurantDishID-update").value = RestaurantDishID;

    // Populate dropdowns
    let restaurantDropdown = document.getElementById("input-RestaurantName-update");
    let dishDropdown = document.getElementById("input-DishName-update");

    for (let option of restaurantDropdown.options) {
        if (option.getAttribute("data-id") == RestaurantID) {
            option.selected = true;
            break;
        }
    }

    for (let option of dishDropdown.options) {
        if (option.getAttribute("data-id") == DishID) {
            option.selected = true;
            break;
        }
    }

    
    document.getElementById("update-RestaurantDish-form").style.display = "block";
    //REF: https://www.w3schools.com/jsref/met_element_scrollintoview.asp
    //REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    // Scroll form into view
    const formElement = document.getElementById("update-RestaurantDish-form");
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


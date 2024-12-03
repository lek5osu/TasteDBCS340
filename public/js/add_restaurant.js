// Get the objects we need to modify
let addRestaurantForm = document.getElementById('add-restaurant-form-ajax');

// Modify the objects we need
addRestaurantForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields from restaurantsDishes.hbs
    let inputRestaurantName = document.getElementById("input-restaurant-name");

    
    // Get the values from the form fields
    let restaurantNameValue = inputRestaurantName.value;

    // Put our data we want to send in a javascript object
    let data = {
        RestaurantName: restaurantNameValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-restaurant", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new restaurant data to the table
            addRowToRestaurantTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRestaurantName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    console.log(data);
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from
// the Restaurants table
addRowToRestaurantTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("Restaurants-Table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to new row from database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells for each property
    let row = document.createElement("TR");

    // Create the Edit and Delete cells with links
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Create the Edit link
    let editLink = document.createElement("A");
    editLink.href = "#";
    editLink.innerText = "Edit";
    // Add the event listener for the Edit button (you can define the edit function)
    editLink.addEventListener("click", function() {
        editRestaurant(newRow.RestaurantID); // Replace with your edit function
    });

    // Create the Delete link
    let deleteLink = document.createElement("A");
    deleteLink.href = "#";
    deleteLink.innerText = "Delete";
    // Add the event listener for the Delete button (you can define the delete function)
    deleteLink.addEventListener("click", function() {
        deleteRestaurant(newRow.RestaurantID); // Replace with your delete function
    });


     // Create the data cells for RestaurantID and RestaurantName
    let restaurantIDCell = document.createElement("TD");
    let restaurantNameCell = document.createElement("TD");
    restaurantIDCell.innerText = newRow.RestaurantID;
    restaurantNameCell.innerText = newRow.RestaurantName;

    // Append all cells to the row
    editCell.appendChild(editLink);
    deleteCell.appendChild(deleteLink);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    row.appendChild(restaurantIDCell);
    row.appendChild(restaurantNameCell);
    currentTable.appendChild(row);

}

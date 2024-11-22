// Get the objects we need to modify
let addDishForm = document.getElementById('add-dish-form-ajax');

// Modify the objects we need
addDishForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields from restaurantsDishes.hbs
    let inputDishName = document.getElementById("input-dish-name");
    let inputCuisineType = document.getElementById("input-cuisine-type");

    
    // Get the values from the form fields
    let dishNameValue = inputDishName.value;
    let cuisineTypeValue = inputCuisineType.value;

    // Put our data we want to send in a javascript object
    let data = {
        DishName: dishNameValue,
        CuisineType: cuisineTypeValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dish", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new dish data to the table
            addRowToDishTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDishName.value = '';
            inputCuisineType.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    console.log(data); // dev note: new entries are not immediately populating
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from
// the Dishs table
addRowToDishTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("Dishes-Table");

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
        editDish(newRow.DishID); // Replace with your edit function
    });

    // Create the Delete link
    let deleteLink = document.createElement("A");
    deleteLink.href = "#";
    deleteLink.innerText = "Delete";
    // Add the event listener for the Delete button (you can define the delete function)
    deleteLink.addEventListener("click", function() {
        deleteDish(newRow.DishID); // Replace with your delete function
    });


     // Create the data cells for DishID and DishName
    let dishIDCell = document.createElement("TD");
    let dishNameCell = document.createElement("TD");
    let cuisineTypeCell = document.createElement("TD");
    dishIDCell.innerText = newRow.DishID;
    dishNameCell.innerText = newRow.DishName;
    cuisineTypeCell.innerText = newRow.CuisineType;

    // Append all cells to the row
    editCell.appendChild(editLink);
    deleteCell.appendChild(deleteLink);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    row.appendChild(dishIDCell);
    row.appendChild(dishNameCell);
    row.appendChild(cuisineTypeCell);
    currentTable.appendChild(row);

}

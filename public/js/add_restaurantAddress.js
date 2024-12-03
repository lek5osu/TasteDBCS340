// Get the objects we need to modify
let addRestaurantAddressForm = document.getElementById('add-restaurantAddresses-form-ajax');

// Modify the objects we need
addRestaurantAddressForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields from restaurantAddresses.hbs
    let inputRestaurantID = document.getElementById("input-restaurant-id");
    let inputAddress = document.getElementById("input-address");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputZipcode = document.getElementById("input-zipcode");
    let inputSuite = document.getElementById("input-suite");

    // Get the values from the form fields
    let restaurantIDValue = inputRestaurantID.value;
    let addressValue = inputAddress.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipcodeValue = inputZipcode.value;
    let suiteValue = inputSuite.value || null; // Handle optional Suite field

    // Put our data we want to send in a JavaScript object
    let data = {
        RestaurantID: restaurantIDValue,
        Address: addressValue,
        City: cityValue,
        State: stateValue,
        Zipcode: zipcodeValue,
        Suite: suiteValue,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-restaurantAddress", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new restaurantAddress data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRestaurantID.value = '';
            inputAddress.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZipcode.value = '';
            inputSuite.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }
    console.log("Data:", data);

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// the RestaurantAddresses table
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("RestaurantAddresses-Table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells for each property
    let row = document.createElement("TR");

    // Create the data cells for ReviewID and other fields
    let addressIDCell = document.createElement("TD");
    let restaurantIDCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipcodeCell = document.createElement("TD");
    let suiteCell = document.createElement("TD");

    addressIDCell.innerText = newRow.AddressID;
    restaurantIDCell.innerText = newRow.RestaurantID;
    addressCell.innerText = newRow.Address;
    cityCell.innerText = newRow.City;
    stateCell.innerText = newRow.State;
    zipcodeCell.innerText = newRow.Zipcode;
    suiteCell.innerText = newRow.Suite || "N/A"; // Optional 

    // Append all cells to the row
    row.appendChild(addressIDCell);
    row.appendChild(restaurantIDCell);
    row.appendChild(addressCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipcodeCell);
    row.appendChild(suiteCell);
    currentTable.appendChild(row);
};
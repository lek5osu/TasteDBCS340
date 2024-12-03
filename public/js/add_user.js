// Get the objects we need to modify
let addUserForm = document.getElementById('add-users-form-ajax');

// Modify the objects we need
addUserForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields from users.hbs
    let inputUserFirstName = document.getElementById("input-user-first-name");
    let inputUserLastName = document.getElementById("input-user-last-name");
    let inputUserEmail = document.getElementById("input-user-email");

    
    // Get the values from the form fields
    let userFirstNameValue = inputUserFirstName.value;
    let userLastNameValue = inputUserLastName.value;
    let userEmailValue = inputUserEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        UserFirstName: userFirstNameValue,
        UserLastName: userLastNameValue,
        UserEmail: userEmailValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new user data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUserFirstName.value = '';
            inputUserLastName.value = '';
            inputUserEmail.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }
    console.log("Data to send:", data);

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from
// the Users table
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("Users-Table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to new row from database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells for each property
    let row = document.createElement("TR");

     // Create the data cells for UserID and UserName
    let userIDCell = document.createElement("TD");
    let userFirstNameCell = document.createElement("TD");
    let userLastNameCell = document.createElement("TD");
    let userEmailCell = document.createElement("TD");
    userIDCell.innerText = newRow.UserID;
    userFirstNameCell.innerText = newRow.UserFirstName;
    userLastNameCell.innerText = newRow.UserLastName;
    userEmailCell.innerText = newRow.UserEmail;

    // Append all cells to the row
    row.appendChild(userIDCell);
    row.appendChild(userFirstNameCell);
    row.appendChild(userLastNameCell);
    row.appendChild(userEmailCell);
    currentTable.appendChild(row);

}

let btnCreateTicket = document.querySelector(".ticket-action-create");
let btnDeleteTicket = document.querySelector(".ticket-action-delete");

let ticketModalCont = document.querySelector(".ticket-modal-cont");

let displayTicketsMainCont = document.querySelector(".main-cont");

let textareaTicketDescription = document.querySelector(".textarea-ticket-description");

let createTicketPriorityAll = document.querySelectorAll(".create-ticket-priority");

let ticketPriorityAll = document.querySelectorAll(".ticket-priority");

let msgBoxCont = document.querySelector(".msg-box-cont");

let ticketLockCont = "";

let isTicketModalOpen = false;

let priorityColors = ["color-blueviolet", "color-aqua", "color-brown", "color-chartreuse", "color-salmon"]; // array of all priority colors
let currentSelectedPriorityColor = priorityColors[0];   // This will store current selected priority color, right now initialized with default priority color as "color-blueviolet"

let allTicketsArray = []; // This array will store all the tickets data that are created

loadAndSetAllTicketsFromLocalStorage();

// This function will load all the tickets from the local storage and displays it in the main-cont
function loadAndSetAllTicketsFromLocalStorage() {
    if (getStoredTicketsFromLocalStorage()) {
        // Tickets are stored in the local storage
        allTicketsArray = getStoredTicketsFromLocalStorage();
        allTicketsArray.forEach((tempTicket) => {
            createNewTicket(tempTicket.ticketColor, tempTicket.ticketTaskDescription, tempTicket.ticketId);
        });
    }
}


btnCreateTicket.addEventListener("click", (e) => {
    isTicketModalOpen = !isTicketModalOpen;
    if (isDeleteActive) {
        isDeleteActive = false; // Setting false as delete is inactive now
        btnDeleteTicket.classList.remove("border");
        btnCreateTicket.classList.add("border");
    }
    ticketModalShowAndHideController(isTicketModalOpen);
});

let isDeleteActive = false;

// Handling ticket delete functionality
btnDeleteTicket.addEventListener("click", (e) => {
    isDeleteActive = !isDeleteActive;
    if (isTicketModalOpen) {
        // Hiding ticket modal if open
        isTicketModalOpen = false;
        ticketModalShowAndHideController(false);
    }
    if (isDeleteActive) {
        // Activating ticket deleted functionality
        btnCreateTicket.classList.remove("border");
        btnDeleteTicket.classList.add("border");
    }
    else {
        // Deactivating ticket deleted functionality
        btnDeleteTicket.classList.remove("border");
    }
});

// This will set border on current selected priority color and also set the currentSelectedPriorityColor with selected priority color value
createTicketPriorityAll.forEach((ticketPirorityColor, idx) => {

    // Setting click event listener on each priority color
    ticketPirorityColor.addEventListener("click", (e) => {

        // Removing .border form the class list of all the Priority colors 
        createTicketPriorityAll.forEach((xTicketPriorityColor, idx) => {
            xTicketPriorityColor.classList.remove("border");
        });

        // Adding .border in the class list of current selected Priority color 
        ticketPirorityColor.classList.add("border");

        // Changing the value to new ticket priority color 
        currentSelectedPriorityColor = ticketPirorityColor.classList[0];
    });
});

// Handling ticket sorting based on ticket priority color
ticketPriorityAll.forEach((tempTicketPriorityColor, idx) => {
    tempTicketPriorityColor.addEventListener("click", (e) => {
        ticketPriorityAll.forEach((xtempTicketPriorityColor, idx) => {
            xtempTicketPriorityColor.classList.remove("border");    // Removing border class from the class list of all the ticket priority colors
        });
        tempTicketPriorityColor.classList.add("border");   // Adding border class in the class list of only ticket priority color i.e clicked
        console.log(`Clicked on color : ${tempTicketPriorityColor.classList[0]}`);
        sortTicketsByColor(tempTicketPriorityColor.classList[0], false);
    });

    // Displaying all tickets when double clicks on any priority color in the header area
    tempTicketPriorityColor.addEventListener("dblclick", (e) => {
        sortTicketsByColor(tempTicketPriorityColor.classList[0], true);

        // Adding .border class to all the ticket priority colors 
        ticketPriorityAll.forEach((xTempTicketPriorityColor, idx) => {
            xTempTicketPriorityColor.classList.add('border');
        });
    });
});


textareaTicketDescription.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        if (textareaTicketDescription.value === "") {
            return
        }

        createNewTicket(currentSelectedPriorityColor, textareaTicketDescription.value);
    }
});


function createNewTicket(ticketColor, ticketTaskDescription, ticketId) {
    let uniqueTicketId = "#" + shortid();
    /*
      shortid() will generate unique ticket id (shortid() is comming from the script )
      "https://unpkg.com/shortid-dist@1.0.5/dist/shortid-2.2.13.min.js" (This script is inside index.html)
  */

    let id = ticketId || uniqueTicketId;    // if ticketId is undefined then uniqueTicketId will be assigned to the variable id
    // if ticketId is not undefined i.e it has some value then ticketId will be assigned to the variable id


    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "display-ticket-cont");
    newTicket.innerHTML = `<div class="${ticketColor} display-ticket-color-cont"></div>
    <div class="display-ticket-id-cont">${id}</div>
    <div class="display-ticket-description-cont">
        ${ticketTaskDescription}
    </div>
    <div class="display-ticket-lock-cont">
    <i class="fas fa-lock"></i>
    </div>`;
    displayTicketsMainCont.appendChild(newTicket);
    let ticketData = { ticketColor, ticketId: id, ticketTaskDescription };
    if (!ticketId) {
        allTicketsArray.push(ticketData);   // Adding each newly created data inside allTicketsArray
        storeTicketsInLocalStorage();   // Storing allTicketsArray inside local storage
    }

    handleTicketLock(newTicket, id);    // Setting ticket lock functionaly for each newly created ticket
    handleDisplayedTicketColor(newTicket, id);
    handleTicketDelete(newTicket, ticketData, id);

    isTicketModalOpen = false;  // Setting false as closing the create-ticket-modal
    ticketModalShowAndHideController(isTicketModalOpen);

    // Displaying msg box only if ticket is created newly
    if(!ticketId)
    {
        showMessageInMessageBox(id, "created"); // showing msg-box for ticket creation
    }
}

// This function will store all the tickets inside local storage 
function storeTicketsInLocalStorage() {
    // storing allTicketsArray inside local storage
    localStorage.setItem("JIRA-Ticket-Management(Storage)", JSON.stringify(allTicketsArray));
}

// This function will return all the stored tickets from the local storage by parsing it
function getStoredTicketsFromLocalStorage() {
    // Returning all the stored tickets from the local storage 
    return JSON.parse(localStorage.getItem("JIRA-Ticket-Management(Storage)"));
}

// This function will return index of the ticket, for given ticket id
function getIndexOfTicketFromArray(id) {
    let index = allTicketsArray.findIndex((tempTicketObj) => {
        return tempTicketObj.ticketId === id;
    });
    return index;
}

// This function will delete ticket from the display as well as from the allTicketArray
function handleTicketDelete(ticket, ticketData, id) {

    // Setting click listener on ticket
    ticket.addEventListener("click", (e) => {
        if (isDeleteActive) {
            // Deleting tickets only if delete button is active, other wise not deleting
            ticket.remove();    // removing the ticket div class from the main container
            let indexOfTicket = getIndexOfTicketFromArray(id);
            let deletedTicket = allTicketsArray.splice(indexOfTicket, 1); // deleting the ticket data from the array allTicketArray
            // console.log(`Deleted ticket : ${deletedTicket}`);
            storeTicketsInLocalStorage();
            showMessageInMessageBox(id, "deleted"); // showing msg-box for ticket deletion
        }
    });
}

function handleTicketLock(ticket, id) {
    // This function will add the lock functionality on each newly created ticket
    let displayTicketLockCont = ticket.querySelector(".display-ticket-lock-cont");
    let ticketLock = displayTicketLockCont.children[0]; // Getting first children as it only has one children i.e lock
    let lockIcon = "fa-lock"    // Icon for lock ticket
    let unlockIcon = "fa-lock-open" // Icon for unlock ticket

    let ticketTaskTextarea = ticket.querySelector(".display-ticket-description-cont");

    // adding click event listener on the lock
    ticketLock.addEventListener("click", (e) => {
        // console.log(`ticket id : ${id}`);
        // Checking if lockIcon class is in the class list of ticket lock or not
        if (ticketLock.classList.contains(lockIcon)) {
            ticketLock.classList.remove(lockIcon);
            ticketLock.classList.add(unlockIcon);
            ticketTaskTextarea.setAttribute("contenteditable", "true");  // Making the ticket task decription area editable
        }
        else {
            ticketLock.classList.remove(unlockIcon);
            ticketLock.classList.add(lockIcon);
            ticketTaskTextarea.setAttribute("contenteditable", "false"); // Making the ticket task decription area uneditable
        }

        // console.log(`task description : ${ticketTaskTextarea.innerHTML}`);
        // updating ticket task decription in the allTicketsArray for the given ticket id
        let indexOfTicket = getIndexOfTicketFromArray(id);
        allTicketsArray[indexOfTicket].ticketTaskDescription = ticketTaskTextarea.innerHTML;    // Getting updated tast description and updating in the array
        storeTicketsInLocalStorage();
    });
}


function handleDisplayedTicketColor(ticket, id) {
    let displayTicketColorCont = ticket.querySelector(".display-ticket-color-cont");
    let thisTicketColor = displayTicketColorCont.classList[0];  // Getting color class attribute i.e at index 0
    let indexOfColor = priorityColors.indexOf(thisTicketColor); // Getting index of current selected priority color of the ticket displayed

    // Adding click listener on ticket color container
    displayTicketColorCont.addEventListener("click", (e) => {
        thisTicketColor = priorityColors[indexOfColor];
        if (indexOfColor < 4) {
            indexOfColor++;
        }
        else {
            indexOfColor = 0;
        }
        // Replacing curret ticket color class with new ticket color class
        displayTicketColorCont.classList.replace(thisTicketColor, priorityColors[indexOfColor]);

        // updating ticket color in the allTicketsArray for the given ticket id
        let indexOfTicket = getIndexOfTicketFromArray(id);
        allTicketsArray[indexOfTicket].ticketColor = priorityColors[indexOfColor];
        storeTicketsInLocalStorage();
    });
}




function ticketModalShowAndHideController(shouldShow) {
    // This function will simply controll the hiding and showing of .ticket-modal-cont based on the value of shouldShow
    if (shouldShow) {
        ticketModalCont.style.display = "flex";
        btnCreateTicket.classList.add("border");
    }
    else {
        textareaTicketDescription.value = "";   // Setting ticket task description textarea as "" i.e empty
        ticketModalCont.style.display = "none"; // Hiding create-ticket-modal
        btnCreateTicket.classList.remove("border"); // Removing border from the class list of .ticket-action-create
    }
}

// This function will sort tickets based on their priority color and then displays it
function sortTicketsByColor(ticketColor, shouldDisplayAllTickets) {

    // Removing all displayed tickets
    // displayTicketsMainCont.innerHTML = "";   // This will simply remove everything from the main container
    //                      Or below code
    let allDisplayedTickets = document.querySelectorAll(".display-ticket-cont");
    for (let i = 0; i < allDisplayedTickets.length; i++)// Removing each ticket one by one from the main container
    {
        allDisplayedTickets[i].remove();
    }
    let sortedTickets;
    // if shouldDisplayAllTickets is true that means have to display all the tickets 
    // if shouldDisplayAllTickets is false then display only selected priority color ticket
    if (!shouldDisplayAllTickets) {
        // Sorting tickets based on the given priority color
        sortedTickets = allTicketsArray.filter((tempTicket, idx) => {
            return ticketColor === allTicketsArray[idx].ticketColor;
        });
    }
    else {
        // To display all the tickets when double click on any priority color
        sortedTickets = allTicketsArray;
    }

    // Creating and displaying sorted tickets
    sortedTickets.forEach((tempTicket, idx) => {
        createNewTicket(tempTicket.ticketColor, tempTicket.ticketTaskDescription, tempTicket.ticketId);
    });
}


function showMessageInMessageBox(xTicketId, msgType) {
    // Ticket with id #aDkldDFlE deleted 
    // Ticket with id #aDkldDFlE created
    let msg = "";

    // Creating new msg box
    let msgBox = document.createElement("div");
    msgBox.setAttribute("class", "msg-box");
    
    if (msgType === "created") {
        // Showing message for ticket creation
        msg = `Ticket with id ${xTicketId} created`;
        msgBox.classList.add("color-ticket-created")
    }
    else {
        // Showing message for ticket deletion
        msg = `Ticket with id ${xTicketId} deleted`;
        msgBox.classList.add("color-ticket-deleted")
    }
    msgBox.innerHTML = msg;
    msgBoxCont.appendChild(msgBox); // appending new msg-box in msg-box-cont

    // Removing msgBox after 5sec
    setTimeout(() => {
        msgBoxCont.removeChild(msgBox); 
    }, 5000);
}
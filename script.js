let btnCreateTicket = document.querySelector(".ticket-action-create");

let ticketModalCont = document.querySelector(".ticket-modal-cont");

let displayTicketsMainCont = document.querySelector(".main-cont");

let textareaTicketDescription = document.querySelector(".textarea-ticket-description");

let createTicketPriorityAll = document.querySelectorAll(".create-ticket-priority");

let ticketLockCont = "";

let isTicketModalOpen = false;

let priorityColors = ["color-blueviolet", "color-aqua", "color-brown", "color-chartreuse", "color-salmon"]; // array of all priority colors
let currentSelectedPriorityColor = priorityColors[0];   // This will store current selected priority color, right now initialized with default priority color as "color-blueviolet"

btnCreateTicket.addEventListener("click", (e) => {
    isTicketModalOpen = !isTicketModalOpen;
    ticketModalShowAndHideController(isTicketModalOpen);
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


textareaTicketDescription.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        if (textareaTicketDescription.value === "") {
            return
        }
        let uniqueTicketId = "#" + shortid();
        /*
            shortid() will generate unique ticket id (shortid() is comming from the script )
            "https://unpkg.com/shortid-dist@1.0.5/dist/shortid-2.2.13.min.js" (This script is inside index.html)
        */
        createNewTicket(currentSelectedPriorityColor, uniqueTicketId, textareaTicketDescription.value);
    }
});


function createNewTicket(ticketColor, ticketId, ticketTaskDescription) {
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "display-ticket-cont");
    newTicket.innerHTML = `<div class="${ticketColor} display-ticket-color-cont"></div>
    <div class="display-ticket-id-cont">${ticketId}</div>
    <div class="display-ticket-description-cont">
        ${ticketTaskDescription}
    </div>
    <div class="display-ticket-lock-cont">
    <i class="fas fa-lock"></i>
    </div>`;
    displayTicketsMainCont.appendChild(newTicket);

    handleTicketLock(newTicket);    // Setting ticket lock functionaly for each newly created ticket

    isTicketModalOpen = false;  // Setting false as closing the create-ticket-modal
    ticketModalShowAndHideController(isTicketModalOpen);


}


function handleTicketLock(ticket)
{
    // This function will add the lock functionality on each newly created ticket
    let displayTicketLockCont = ticket.querySelector(".display-ticket-lock-cont");
    let ticketLock = displayTicketLockCont.children[0]; // Getting first children as it only has one children i.e lock
    let lockIcon = "fa-lock"    // Icon for lock ticket
    let unlockIcon = "fa-lock-open" // Icon for unlock ticket

    let ticketTaskTextarea = ticket.querySelector(".display-ticket-description-cont");

    // adding click event listener on the lock
    ticketLock.addEventListener("click",(e)=>{

        // Checking if lockIcon class is in the class list of ticket lock or not
        if(ticketLock.classList.contains(lockIcon)){
            ticketLock.classList.remove(lockIcon);
            ticketLock.classList.add(unlockIcon);
            ticketTaskTextarea.setAttribute("contenteditable","true");  // Making the ticket task decription area editable
        }
        else{
            ticketLock.classList.remove(unlockIcon);
            ticketLock.classList.add(lockIcon);
            ticketTaskTextarea.setAttribute("contenteditable","false"); // Making the ticket task decription area uneditable
        }
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
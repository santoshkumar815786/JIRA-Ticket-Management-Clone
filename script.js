let btnCreateTicket = document.querySelector(".ticket-action-create");

let ticketModalCont = document.querySelector(".ticket-modal-cont");

let displayTicketsMainCont = document.querySelector(".main-cont");

let textareaTicketDescription = document.querySelector(".textarea-ticket-description");

let isTicketModalOpen = false;

btnCreateTicket.addEventListener("click", (e) => {
    isTicketModalOpen = !isTicketModalOpen;
    ticketModalShowAndHideController(isTicketModalOpen);
});


textareaTicketDescription.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        createNewTicket("color-chartreuse", "#SAN5526K", "Sample ticket generation");
    }
});


function createNewTicket(ticketColor, ticketId, ticketTaskDescription) {
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "display-ticket-cont");
    newTicket.innerHTML = `<div class="${ticketColor} display-ticket-color-cont"></div>
    <div class="display-ticket-id-cont">${ticketId}</div>
    <div class="display-ticket-description-cont">
        ${ticketTaskDescription}
    </div>`;
    displayTicketsMainCont.appendChild(newTicket);

    isTicketModalOpen = false;  // Setting false as closing the create-ticket-modal
    ticketModalShowAndHideController(isTicketModalOpen);
}

function ticketModalShowAndHideController(shouldShow) 
{
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
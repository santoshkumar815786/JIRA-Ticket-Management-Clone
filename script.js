let btnCreateTicket = document.querySelector(".ticket-action-create");

let ticketModalCont = document.querySelector(".ticket-modal-cont");

let displayTicketsMainCont = document.querySelector(".main-cont");

let textareaTicketDescription = document.querySelector(".textarea-ticket-description");

let isTicketModalOpen = false;

btnCreateTicket.addEventListener("click", (e)=>{
    isTicketModalOpen = !isTicketModalOpen;
    if(isTicketModalOpen)
    {
        ticketModalCont.style.display = "flex";
        btnCreateTicket.classList.add("border");
    }
    else
    {
        ticketModalCont.style.display = "none";
        btnCreateTicket.classList.remove("border");
    }
});


textareaTicketDescription.addEventListener("keydown",(e)=>{
    if(e.key === "Shift")
    {
        createNewTicket("color-chartreuse","#SAN5526K","Sample ticket generation");
    }
});


function createNewTicket(ticketColor, ticketId, ticketTaskDescription)
{
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "display-ticket-cont"); 
    newTicket.innerHTML = `<div class="${ticketColor} display-ticket-color-cont"></div>
    <div class="display-ticket-id-cont">${ticketId}</div>
    <div class="display-ticket-description-cont">
        ${ticketTaskDescription}
    </div>`;
    displayTicketsMainCont.appendChild(newTicket);
}
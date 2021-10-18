let btnCreateTicket = document.querySelector(".ticket-action-create");

let ticketModalCont = document.querySelector(".ticket-modal-cont");

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

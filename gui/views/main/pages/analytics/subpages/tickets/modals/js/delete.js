// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const MODAL_NAME = 'delete';

const MODAL_OPTIONS_TEMPLATE = {
  tickets: []
};

window.modalOptions = {};
window.resetModalOptions = () => {
  window.parent.parent.parent.memory.syncObject(window.modalOptions, window.parent.parent.parent.memory.copyObj(MODAL_OPTIONS_TEMPLATE));
}
window.resetModalOptions();

window.deleteApp = new Vue({
  el: "#Rewrite___Delete_Modal",
  data: {
    companionSettings: window.parent.parent.parent.companionSettings,
    modalOptions: modalOptions
  },
  methods: {
    confineTextWidth: window.parent.parent.parent.confineTextWidth,
    getTextWidth: window.parent.parent.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.parent.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.parent.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.parent.parent.tryTranslate,
    getThemeColor: window.parent.parent.parent.getThemeColor,
    finalizeModal: function() {
      for (var ticket of window.modalOptions.tickets) window.parent.removeTicket(window.parent.getTicketByID(ticket.id), false);
      if (window.modalOptions.tickets.length > 0) { // do the if statement in case user presses enter on tickets page
        window.parent.ticketsApp.applyDateSearch();
        this.closeModal();
      }
    },
    closeModal: function() {
      window.parent.modals[MODAL_NAME].visible = false;
      window.resetModalOptions();
      if (window.parent.getSelectedTickets().length == 1) window.parent.setAllTicketsSelected(false, false);
    }
  }
});

// DISABLE SELECT ALL TEXT FROM Ctrl + A
$(function(){
  $(document).keydown(function(objEvent) {
    if (objEvent.ctrlKey && objEvent.keyCode == 65 && objEvent.target.tagName != "INPUT" && objEvent.target.tagName != "TEXTAREA") objEvent.preventDefault();
  });
});

// KEYBINDS
document.onkeyup = function(e) {
  if (e.which == 13) { // Enter: submit
    window.deleteApp.finalizeModal();
  }
};

window.onload = window.parent.modalLoadedCallback(MODAL_NAME);
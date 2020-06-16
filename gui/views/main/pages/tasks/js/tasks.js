// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// variables
window.tasks = [];

window.modals = {
  'configure': {
    visible: false
  },
  'create': {
    visible: false
  }
}

window.openModal = (modalName) => {
  window.modals[modalName].visible = true;
}

window.modalLoadedCallback = (modalName) => {
  if (modalName == 'configure') {
    tasksApp.configureModal = window.frames['configure-modal'].modalOptions;
  } else if (modalName == 'create') {
    tasksApp.createModal = window.frames['create-modal'].modalOptions;
  }
}

let allowNewTaskCreation = true;

window.tasksApp = new Vue({
  el: "#Rewrite___Tasks",
  data: {
    companionSettings: window.parent.companionSettings,
    tasks: window.tasks,
    modals: window.modals,
    activeTaskIndex: -1,
    configureModal: {},
    createModal: {}
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    getThemeColor: window.parent.getThemeColor,
    formatTimestampExpanded: window.parent.formatTimestampExpanded,
    openModal: window.openModal,
    getTitleSwitchLeft: function(maxWidth, title) {
      let titleWidth = window.parent.getTextWidth(title, 'bold 17px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + 60)/2) + 25;
      }
      return 0;
    },
    openNewTaskModal: function() {
      window.frames['create-modal'].resetModalOptions();
      this.openModal('create');
    },
    getColor: function(color) {
      if (color == 'green') {
        return 'rgba(53,178,57,1)';
      } else if (color == 'yellow') {
        return 'rgba(253,213,53,1)';
      } else if (color == 'red') {
        return 'rgba(253,53,53,1)';
      }
      return this.getThemeColor('rgba(190,190,190,1)');
    },
    getTaskStatusColor: function(taskIndex) {
      if (tasks[taskIndex].nodes.length > 0) {
        let numYellowStatuses = 0;
        let numGreenStatuses = 0;
        let numRedStatuses = 0;
        for (var node of tasks[taskIndex].nodes) {
          if (node.status.color == "yellow") {
            numYellowStatuses++;
          } else if (node.status.color == "green") {
            numGreenStatuses++;
          } else if (node.status.color == "red") {
            numRedStatuses++;
          }
        }
        if (numGreenStatuses > numYellowStatuses && numGreenStatuses > numRedStatuses) {
          return this.getColor('green');
        } else if (numYellowStatuses > numGreenStatuses && numYellowStatuses > numRedStatuses) {
          return this.getColor('yellow');
        } else if (numRedStatuses > numGreenStatuses && numRedStatuses > numYellowStatuses) {
          return this.getColor('red');
        }
      }
      return this.getThemeColor('rgba(190,190,190,1)');
    },
    removeTaskNode: function(nodeIndex) {
      tasks[this.activeTaskIndex].nodes.splice(nodeIndex, 1);
    },
    toggleAllTaskNodes: function(enabled = true) {
      for (var node of tasks[this.activeTaskIndex].nodes) {
        node.enabled = enabled;
      }
    },
    getDisplayedSizes: function(node) {
      return node.configuration.useRandomSize ? this.tryTranslate('Random') : node.configuration.sizes.join(", ");
    },
    shouldDisplayStartButton: function() {
      for (var node of tasks[this.activeTaskIndex].nodes) {
        if (node.enabled) return false;
      }
      return true;
    },
    setActiveTask: function(taskIndex) {
      if (this.activeTaskIndex == taskIndex) return;
      this.activeTaskIndex = taskIndex;
      if (this.activeTaskIndex >= tasks.length) this.activeTaskIndex = tasks.length > 0 ? 0 : -1;
      setTimeout(applyButtonTransitions, 50);
    },
    removeTask: function(taskIndex) {
      if (this.activeTaskIndex == taskIndex) this.setActiveTask(tasks[taskIndex-1] ? taskIndex - 1 : (tasks[taskIndex + 1] ? taskIndex + 1 : -1));
      tasks.splice(taskIndex, 1);
      allowNewTaskCreation = false;
      setTimeout(function() {
        allowNewTaskCreation = true;
      }, 35);
    },
    shouldDisplayModals: function() {
      for (var modal in modals) {
        if (modals[modal].visible) return true;
      }
      return false;
    },
    addProduct: function(options = {}) {
      if (!allowNewTaskCreation) return;
      let separatedDate = separateDate();
      let taskTemplate = {
        configuration: {
          nickname: this.tryTranslate("Product") + " " + (tasks.length + 1),
          imageURL: "",
          rawKeywords: "",
          beginMonitoringAt: {
            enabled: false,
            launched: false,
            date: separatedDate.date,
            time: separatedDate.time,
            timestamp: getTimestampFromDateAndTime(separatedDate.date, separatedDate.time)
          }
        },
        nodes: []
      };
      for (var key in options) {
        taskTemplate.configuration[key] = options[key];
      }
      tasks.push(taskTemplate);
      if (this.activeTaskIndex == -1 && tasks.length == 1) this.setActiveTask(0);
      return tasks.length;
    },
    updateBeginMonitoringAtTimestamp: function() {
      tasks[this.activeTaskIndex].configuration.beginMonitoringAt.launched = false;
      return tasks[this.activeTaskIndex].configuration.beginMonitoringAt.timestamp = getTimestampFromDateAndTime(tasks[this.activeTaskIndex].configuration.beginMonitoringAt.date, tasks[this.activeTaskIndex].configuration.beginMonitoringAt.time);
    }
  }
});

function separateDate(timestamp = new Date().getTime()) {
  let date = new Date(timestamp);
  let dateString = date.getFullYear() + '-' + (String(date.getMonth() + 1).length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (String(date.getDate() + 1).length == 1 ? ("0" + date.getDate()) : date.getDate());
  let timeString = (String(((date.getHours() + 1) + 1) > 24 ? 0 : ((date.getHours() + 1) + 1)).length == 1 ? "0" + (((date.getHours() + 1) + 1) > 24 ? 0 : ((date.getHours() + 1) + 1)) : (((date.getHours() + 1) + 1) > 24 ? 0 : ((date.getHours() + 1) + 1))) + ':' + 55;
  return { date: dateString, time: timeString, timestamp: timestamp };
}

function getTimestampFromDateAndTime(date, time) {
  return new Date(date).getTime() + (parseInt(time.split(":")[0]) * 60 * 60 * 1000) + (parseInt(time.split(":")[1]) * 60 * 1000) + (new Date().getTimezoneOffset() * 60 * 1000);
}

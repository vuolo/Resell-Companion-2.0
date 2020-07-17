function setupContextMenu() {
  $(function() {
    for (var contextMenu of CONTEXT_MENUS) $.contextMenu(contextMenu);
  });
}

window.setContextMenuTheme = async (theme) => {
  $.contextMenu('destroy');
  setupContextMenu();
  // wait for context menu to be rendered
  while (!document.querySelector('.context-menu-item')) window.parent.sleep ? await window.parent.sleep(50) : await window.parent.parent.sleep(50);
  // apply theme to each context menu item
  for (var item of document.querySelectorAll('.context-menu-item')) {
    for (var classItem of item.classList) if (classItem.includes('-theme')) { item.classList.remove(classItem); break; }
    item.classList.add(theme + '-theme');
    for (var classItem of item.querySelector('span').classList) if (classItem.includes('-theme')) { item.querySelector('span').classList.remove(classItem); break; }
    item.querySelector('span').classList.add(theme + '-theme');
    item.querySelector('span').style.background = "transparent";
    for (var classItem of item.querySelector('i').classList) if (classItem.includes('-theme')) { item.querySelector('i').classList.remove(classItem); break; }
    item.querySelector('i').classList.add(theme + '-theme');
    item.querySelector('span').innerText = window.parent.companionSettings ? window.parent.tryTranslate(item.querySelector('span').innerText) : window.parent.parent.tryTranslate(item.querySelector('span').innerText);
  }
  // apply theme to context menu list
  for (var list of document.querySelectorAll('.context-menu-list')) list.style.background = window.parent.getThemeColor ? window.parent.getThemeColor('rgba(247,247,247,1)') : window.parent.parent.getThemeColor('rgba(247,247,247,1)');
};

window.onload = async function() {
  window.setContextMenuTheme(window.parent.companionSettings ? window.parent.companionSettings.theme : window.parent.parent.companionSettings.theme);

  while (!document.querySelector('.context-menu-item')) window.parent.sleep ? await window.parent.sleep(50) : await window.parent.parent.sleep(50);
  for (var item of document.querySelectorAll('.context-menu-item')) {
    item.addEventListener("mouseenter", function(event) {
      if (window.parent.companionSettings ? window.parent.companionSettings.theme : window.parent.parent.companionSettings.theme == "dark") {
        event.srcElement.querySelector("i").style.background = "#b89d96";
        event.srcElement.querySelector("i").classList.add('hovering-icon');
      }
    });
    item.addEventListener("mouseleave", function(event) {
      if (window.parent.companionSettings ? window.parent.companionSettings.theme : window.parent.parent.companionSettings.theme == "dark") {
        event.srcElement.querySelector("i").style.background = "rgba(30,30,39,1)";
        event.srcElement.querySelector("i").classList.remove('hovering-icon');
      }
    });
  }
};

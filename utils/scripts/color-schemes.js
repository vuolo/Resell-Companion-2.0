const colorSchemes = [
  {
    light: 'rgba(251,247,241,1)', // background
    dark: 'rgba(35,35,39,1)'
  },
  {
    light: 'rgba(255,255,255,1)', // 2nd background of social+ or task background
    dark: 'rgba(15,15,16,1)'
  },
  {
    light: 'rgba(247,247,247,1)', // social+ feeds (light gray)
    dark: 'rgba(30,30,39,1)'
  },
  {
    light: 'rgba(190,190,190,1)', // separator
    dark: 'rgba(42,42,51,1)'
  },
  {
    light: 'rgba(242,242,242,1)', // release info text box (or monitors more details text box)
    dark: 'rgba(38,38,49,1)'
  },
  {
    light: 'rgba(243,224,185,1)', // top and bottom borders
    dark: '#755277'
  },
  {
    light: 'rgba(255,237,200,1)', // user area on top bar
    dark: '#836685'
  },
  {
    light: 'rgba(29,29,29,1)', // text (#1d1d1d but as RGB)
    dark: '#efefef'
  },
  {
    light: '#1d1d1d', // text
    dark: '#efefef'
  },
  {
    light: 'rgba(30,65,166,1)', // blue text
    dark: '#b89d96'
  }
];

window.setTheme = (theme) => {
  companionSettings.theme = theme;
};

window.getThemeColor = (incomingLightColor) => {
  if (companionSettings.theme != "light" && colorSchemes[0][companionSettings.theme]) { // validate it needs to look for color
    for (var colorScheme of colorSchemes) {
      if (colorScheme.light == incomingLightColor) {
        return colorScheme[companionSettings.theme];
      }
    }
  }
  return incomingLightColor;
};

window.setTheme(companionSettings.theme);

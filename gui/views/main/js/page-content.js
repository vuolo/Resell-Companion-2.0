const contentApp = new Vue({
  el: "#pageContent",
  data: {
    pages: pages,
    activePageIndex: window.activePageIndex
  },
  methods: {
    getThemeColor: window.getThemeColor
  }
});

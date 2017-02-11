new Vue({
  el: '#app',
  data: {
    schedules: [],
    greeting: 'hello world',
    refreshing: false,
  },
  mounted: function() {
    var self = this;
    refreshData();
    setInterval(refreshData, 5000);
    
    function refreshData() {
      axios.get('/api/buses')
        .then(function(response) {
          self.schedules = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  methods: {}
});

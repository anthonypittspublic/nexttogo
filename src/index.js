
//global constructor
var jurisdiction = 'NSW';
var nextToGoUrl = 'https://api.beta.tab.com.au/v1/tab-info-service/racing/next-to-go/races?jurisdiction=' + jurisdiction;
var initialShowAmount = 5;
var currentDateTime = moment().format();

//Race component constructor
Vue.component('race-component', {
  template: `#race-template`,
  props: ['item', 'datetime'],
  data: function () {
    return {
      moment: moment
    }
  }
})

//App constructor
var app = new Vue({
  el: '#racesWidget',
  data: {
    moment: moment,
    datetime: currentDateTime,
    greyhounds: [],
    horses: [],
    harness: [],
    limitAmount: initialShowAmount,
    timeToRefresh: 0
  },
  mounted: GetAllNextToGoRaces(),
  methods: {
    refreshNextToGoRaces: function () { GetAllNextToGoRaces(); },
    showMoreRaces: function () { app.limitAmount += initialShowAmount; GetAllNextToGoRaces(); }
  },
  //refresh the races whenever the timeToRefresh is up
    watch: {
    
    timeToRefresh: function () {
      setTimeout(function(){
        GetAllNextToGoRaces(); 
      }, app.timeToRefresh);
    }
  }
});

//Gets all races, orders them and divides them into categories
function GetAllNextToGoRaces() {
  $.ajax({
    type: 'GET',
    url : nextToGoUrl,
    async : true,
    dataType: "json",
    success : function(response) {
      //Order all races start time order
      var sortedRaces = response.races.sort(function(a,b){
        return moment(a.raceStartTime) - moment(b.raceStartTime);
      });
            
      //Remove any races that have already started
      //I wanted to implement a proper promise system here
      var itemsProcessed = 0;
      var totalItems = sortedRaces.length -1;
      sortedRaces.forEach(function(item) {
          if(moment(item.raceStartTime).isSameOrBefore(app.datetime))
          {
            var index = sortedRaces.indexOf(item);
            sortedRaces.splice(index, 1);
          }
          itemsProcessed++;
          if(itemsProcessed === totalItems) {
            updateCurrentNextToGoCandidate(sortedRaces[0]);
            setTimeToRefresh(sortedRaces);
            splitRacesIntoType(sortedRaces);
          }
      });
    }
  })
}

function setTimeToRefresh(sortedRaces)
{
    var nextRaceStartTime = moment(sortedRaces[0].raceStartTime).add(5, 'seconds');
    var currentTime = moment(app.datetime);
    var raceTimeDifference = nextRaceStartTime - currentTime;

    //This is a break glass refresh if the sortedRaces[0] item has a dud time
    if(raceTimeDifference < 0)
      raceTimeDifference = 5000;
    app.timeToRefresh = raceTimeDifference;
}

//Split up the races based on type
function splitRacesIntoType(sortedRaces)
{
  var itemsProcessed = 0;
  var totalItems = sortedRaces.length -1;
  app.greyhounds = [];
  app.horses = [];
  app.harness = [];
  sortedRaces.forEach(function(item) {
    switch(item.meeting.raceType) {
      case "G":
            app.greyhounds.push(item);
        break;
      case "H":
            app.harness.push(item);
        break;
      case "R":
            app.horses.push(item);
        break;
      default:
          break;
    }
    itemsProcessed++;
    if(itemsProcessed === totalItems) {
      app.greyhounds = app.greyhounds.splice(0, app.limitAmount);
      app.harness = app.harness.splice(0, app.limitAmount);
      app.horses = app.horses.splice(0, app.limitAmount);
    }
  })
  
  ;
}

//Set the first race, regardless of type, to have a flag
function updateCurrentNextToGoCandidate(item) {
  item.nextToGo = true;
}

//Small timer to keep count down the races with less than a minute to go
setInterval(function(){ setDateTime() }, 1000);
function setDateTime() {
    app.datetime = moment().format();
    currentDateTime = moment().format();
} 
  const WEATHER_SEARCH_URL = 'https://api.darksky.net/forecast';
  const API_KEY = '58b9faa457bb82b97af590775731c37a';
  
  let autocompleteList = [];
  
  function getDataFromApi(latitude, longitude, time, callback) {
    // Build api url based on parameters
    let completeUrl = `${WEATHER_SEARCH_URL}/${API_KEY}/${latitude},${longitude},${time}`;
    
    let settings = {
      url: completeUrl,
      data: {
        exclude: 'currently,minutely,hourly,alerts,flags',
      },
      dataType: 'jsonp',
      type: 'GET',
      success: callback
    };
  
    $.ajax(settings);
  }
  
  function displaySearchData(data) {
    // display search navigation
    debugger;
    $('#results').text(`Weather summary: ${data.daily.data[0].summary}`);
  }
  
  
  function initGoogleMaps(autocompleteInputIds) {
    autocompleteInputIds.forEach(function(element) {
      autocomplete = new google.maps.places.Autocomplete(
              (
                document.getElementById(element)), {
                types: ['(cities)'],
                componentRestrictions: {country: 'us'}
              });
      autocompleteList.push(autocomplete);
    });
  }
  
  
  
  function displayItineraryForm(numberOfDays) {
    // we need to populate itinerary form with numberOfDays number of inputs
    let itineraryFormContents = '';
    let autocompleteInputIds = [];
    for(let i=0; i< numberOfDays; i++) {
      itineraryFormContents = itineraryFormContents.concat(`<label for="city-autocomplete${i}">Day ${i+1}</label>
        <input type="text" id="city-autocomplete${i}">
        `);
      autocompleteInputIds.push(`city-autocomplete${i}`);
    }
  
    $('#stops').html(itineraryFormContents);
    // init itinerary form with Google Maps autocomplete
    initGoogleMaps(autocompleteInputIds);
    
    // and then show it
    $('.itinerary').toggleClass("invisible");
  }
  
  
  function handleDatesComplete() {
    $('.dates').on('click', '#submit1', function(event) {
      event.preventDefault();
      let numberOfDays = $('#numberOfDays').val();
      displayItineraryForm(numberOfDays);
    });
  }
  
  function handleItineraryComplete() {
    $('.itinerary').on('click', '#submit2', function(event) {
      event.preventDefault();
      // get location information from autocompleteInputIds
      const startDate = $('#startDate').val();
      // request weather forecast for this location 
      let latitude=autocompleteList[0].getPlace().geometry.location.lat();
      let longitude=autocompleteList[0].getPlace().geometry.location.lng();
      let time=`${startDate}T00:00:00`;
      
      console.log(`latitude: ${latitude}, longitude: ${longitude}, time: ${time}`);
      
      getDataFromApi(latitude,longitude,time,displaySearchData);
    });
  }
  
  function processTrip() {
    handleDatesComplete();
    handleItineraryComplete();
  }
  
  
  
  $(processTrip);

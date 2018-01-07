    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAuMLNOI0ZIxnY8bF9Ex1Xnjzyzve5wOE0",
    authDomain: "trainschedule-7e35a.firebaseapp.com",
    databaseURL: "https://trainschedule-7e35a.firebaseio.com",
    storageBucket: "trainschedule-7e35a.appspot.com"
    };

    firebase.initializeApp(config);
    var dataRef = firebase.database();
    // Initial Values
    var name = "";
    var destination = "";
    var firstTrainTime = 0;
    var frequency = 0;

    $("#add-train").on("click", function(event) {
      event.preventDefault();

      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrainTime = $("#time-input").val().trim();
      frequency = $("#freq-input").val().trim();      

      // Code for the push
      dataRef.ref().push({
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataRef.ref().on("child_added", function(childSnapshot) {
      // Log everything that's coming out of snapshot
      // console.log(childSnapshot.val().name);
      // console.log(childSnapshot.val().destination);
      // console.log(childSnapshot.val().firstTrainTime);
      // console.log(childSnapshot.val().frequency);

      var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(1, "years");
      //console.log("TIME CONVERTED: " + firstTimeConverted);
        
      var diffTime = moment.duration(moment().diff(moment(childSnapshot.val().firstTrainTime, "HH:mm")), 'milliseconds').asMinutes();
        
      //console.log("DIFFERENCE IN TIME: " + diffTime);

      var timeRemaining = childSnapshot.val().frequency - (Math.floor(diffTime) % childSnapshot.val().frequency);
      //console.log(timeRemaining);

      var nextTrain = diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(childSnapshot.val().firstTrainTime, "HH:mm") ;
      //console.log("ARRIVAL TIME: " + moment(childSnapshot.val().firstTrainTime).format("HH:mm"));
      
      var minTilTrain = Math.ceil(moment.duration(moment(nextTrain).diff(moment()), 'milliseconds').asMinutes());
      //console.log("MINUTES TILL TRAIN: " + minTilTrain);

      // Add each train's data into the table
      $("#current-train-schedule > tbody").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
      childSnapshot.val().frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minTilTrain + "</td></tr>");
           
    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    
    //calculate current time to show in jumbotron
    setInterval(function(){
      $("#current-time").html("Current Time: " + moment().format('hh:mm:ss A'))
    }, 1000);
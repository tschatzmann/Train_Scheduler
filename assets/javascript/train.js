$(document).ready(function(){
 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBXczEwVBR-vQAGD8uF-yEjXRDqj6_rasI",
    authDomain: "train-schedule-8bf86.firebaseapp.com",
    databaseURL: "https://train-schedule-8bf86.firebaseio.com",
    projectId: "train-schedule-8bf86",
    storageBucket: "train-schedule-8bf86.appspot.com",
    messagingSenderId: "706340611933"
  };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    var trainName = "";
    var destination = "";
    var firstTime = 0;
    var frequency = 0;


    // Whenever a user clicks the submit-bid button
    $("#addTrainButton").on("click", function(event){
        // Prevent form from submitting
        event.preventDefault();

        // Get the input values
        ({ trainName, destination, frequency, firstTime } = GetTrainValues(trainName, destination, frequency, firstTime));


        if(trainName != "" && destination != "" && firstTime != "" && frequency != "")
        {
            // Change what is saved in firebase
            database.ref().push({
                trainName: trainName,
                destin: destination,
                first: firstTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            // clear the input boxes
            cleanInputFields();
        }
        else
        {
            alert("Error!  Missing train data");
        }

    });


    // At the initial load and whenever a new train is added.
    database.ref().on("child_added", function(childSnapshot) {

        // update display
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destin;
        frequency = childSnapshot.val().frequency;
        firstTime = childSnapshot.val().first;
        dateAdded = childSnapshot.val().dateAdded;
        console.log("dateAdded: " + dateAdded);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // Convert the current time to Unix time for moment.js
        var currentTimeConverted = moment(currentTime).format("X");
        console.log("CURRENT TIME CONVERTED TO UNIX: " + currentTimeConverted);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "X").subtract(1, "years");
        console.log("First Time Conv: " + firstTimeConverted);


        // Difference between the times
        var diffTime = moment(currentTimeConverted, "X").diff(moment(firstTimeConverted, "X"), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("tMinutesTillTrain: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        console.log("nextTrain: " + nextTrain);
// template is now working
        var $newRow = `<tr id =${dateAdded}>
        <td> ${trainName}</td><td>${destination}</td><td>${frequency}</td><td>${nextTrain}</td><td>${tMinutesTillTrain}</td>
        <td><input id='Button' type='button' value='Delete' class='deleteButton' data-key="${dateAdded}"/></td>
    </tr>`
        $("#trainbody").append($newRow)

        // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code)  
    });


    // deleteTrain function will delete the train clicked on from
    // the database.
    function deleteTrain(dateAddedValue){
        // tried to get a query to get the child records to delete
        // Find all train-schedule whose height is exactly 25 meters.
//var ref = firebase.database().ref(child);
//ref.orderByChild("dateAdded").equalTo(dateAddedValue).on("child_added", function(snapshot) {
  //console.log(snapshot.key);
  // delete from database not working?????
       // database.ref().child('dateAdded').remove(dateAddedValue);
        console.log('trainremoved ' + dateAddedValue);
   // })
};


    // this is triggered when the delete button is clicked
    $(document).on("click", '.deleteButton', function(event){
        console.log('at delete')
        console.log($(this).attr('data-key'));
        var dateAddedValue = $(this).attr('data-key')
        // remove this table row
        $(this).closest('tr').remove();
        // go delete from database
        console.log('dateAddedValue ' + dateAddedValue)
        //deleting from the database not working
        //deleteTrain(dateAddedValue);
    });


}); // end doument ready

function GetTrainValues(trainName, destination, frequency, firstTime) {
    trainName = $("#trainNameInput").val().trim();
    destination = $("#destinationInput").val().trim();
    frequency = $("#frequencyInput").val().trim();
    firstTime = moment($("#firstTimeInput").val().trim(), "HH:mm").format("X");
    return { trainName, destination, frequency, firstTime };
};

function cleanInputFields() {
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#frequencyInput").val("");
    $("#firstTimeInput").val("");
};



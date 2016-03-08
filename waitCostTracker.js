TimeData = new Mongo.Collection("timeData");

if (Meteor.isClient) {
    Template.timers.events({
        "click .btn-success": function() {
          currentTime = new Date();
            if(Meteor.user){
              TimeData.insert({ 
                userId: Meteor.userId(),
                userName: Meteor.user().userName,
                createdAt: currentTime
              });
            }
          Session.set("currentTime", currentTime);
          console.log("currentTime: " + currentTime);
        },

        "click .btn-danger": function() {
          Meteor.call("updateTimeElapsed", Session.get("currentTime"));
        }
    });

    Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  updateTimeElapsed : function(createdAt){
    findEvent = TimeData.findOne({ "userId": Meteor.userId(), createdAt: createdAt });
    timeElapsed = new Date() - findEvent.createdAt;
    TimeData.update({createdAt: createdAt}, {$set: {timeElapsed : timeElapsed}});
  }
});

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });


}


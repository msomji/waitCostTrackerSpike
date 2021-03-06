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

    Template.personallyWasted.helpers({
      totalWasted: function() {
        return totalWasted();
      },
      totalCost: function(){
        return (totalWasted()/60)/60 * 50;
      }

    });

    function totalWasted(){
        allEntries = TimeData.find().fetch();
        time = 0;
        allEntries.forEach(function(event){
          if (Meteor.userId() === event.userId){
            time += event.timeElapsed != null ? event.timeElapsed : 0;
          }
        })
        return time / 1000;
      }

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


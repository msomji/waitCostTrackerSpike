TimeData = new Mongo.Collection("timeData");

if (Meteor.isClient) {
    Template.timers.events({
        "click .btn-success": function() {
            currentTime = new Date();
            if (Meteor.user) {
                TimeData.insert({
                    userId: Meteor.userId(),
                    userName: Meteor.user().userName,
                    teamName: Meteor.user().profile.team,
                    createdAt: currentTime
                });
            }
            Session.set("currentTime", currentTime);
            console.log("currentTime: " + currentTime);
        },

        "click .btn-danger": function() {
            Meteor.call("updateTimeElapsed", Session.get("currentTime"));
            Session.set("currentTime", null);
        }
    });

    Template.personallyWasted.helpers({
        totalPersonalWasted: function() {
          return claculateEntries("userId()", "userId" )
        },
        totalTeamWasted: function() {
          return claculateEntries("profile.team", "teamName")
        },
        team: function() {
            return Meteor.user().profile.team;
        }
    });
}

function claculateEntries(pathTofieldOnUser, pathTofieldOnTimeData) {
    allEntries = TimeData.find().fetch();
    time = 0;
    allEntries.forEach(function(event) {
        if (Meteor.pathTofieldOnUser === event.pathTofieldOnTimeData) {
            time += event.timeElapsed != null ? event.timeElapsed : 0;
        }
    })
    return time / 1000;
}

AccountsTemplates.addField({
    _id: "team",
    type: "text",
    displayName: "Team Name",
    required: true,
});

Meteor.methods({
    updateTimeElapsed: function(createdAt) {
        findEvent = TimeData.findOne({ "userId": Meteor.userId(), createdAt: createdAt });
        timeElapsed = new Date() - findEvent.createdAt;
        TimeData.update({ createdAt: createdAt }, { $set: { timeElapsed: timeElapsed } });
    }

});

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}

const mongoose = require("mongoose");

//Schema
const IncidentSchema =  new mongoose.Schema(
  {
    date: {
      type: Date //date of incident --> capture from screenshot/audio
    },
    day: {
      type: String //day derived from date
    },
    unit: {
      type: String //unit
    },
    file: {
      type: String //.png file of frame taken from video camera of incident
    },
    sentEmail: {
      type: Boolean //if email notification has been sent
    },
  },
);

const Incident = mongoose.model('Incident', IncidentSchema);
module.exports = Incident;
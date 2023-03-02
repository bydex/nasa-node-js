const { mongoose } = require("mongoose");

const planetsSchema = new mongoose.Schema({
  kepler_name: {
    type: String,
    required: true,
  },
});

const planets = mongoose.model("Planet", planetsSchema);

module.exports = {
  planets,
};

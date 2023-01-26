const {
  getAllLaunches,
  addNewLaunch,
  hasLaunch,
  abortLaunch,
} = require("../../models/launches.model");
const httpGetLaunches = (req, res) => {
  return res.json(getAllLaunches());
};

const httpAddNewLaunch = (req, res) => {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.target ||
    !launch.mission ||
    !launch.rocket
  ) {
    return res.status(400).json({
      error: "Some fields filled wrong!",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate.valueOf())) {
    return res.status(400).json({
      error: "launchDate is invalid!",
    });
  }

  addNewLaunch(launch);

  return res.status(201).json(launch);
};

const httpAbortLaunch = (req, res) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !hasLaunch(id)) {
    return res.status(404).json({
      error: "id is invalid!",
    });
  }

  const abortedLaunch = abortLaunch(id);

  return res.status(200).json(abortedLaunch);
};

module.exports = {
  httpGetLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};

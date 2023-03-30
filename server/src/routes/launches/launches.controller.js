const {
  getAllLaunches,
  scheduleNewLaunch,
  hasLaunch,
  abortLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");
const httpGetLaunches = async (req, res) => {
  const { query } = req;
  const { skip, limit } = getPagination({
    page: query.page,
    limit: query.limit,
  });
  const launches = await getAllLaunches({
    skip,
    limit,
  });

  return res.json(launches);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch ||
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

  try {
    await scheduleNewLaunch(launch);
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    });
  }

  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const id = Number(req.params.id);
  const existsLaunch = await hasLaunch(id);

  if (!id || isNaN(id) || !existsLaunch) {
    return res.status(404).json({
      error: "id is invalid!",
    });
  }

  const abortedLaunch = await abortLaunch(id);

  if (!abortedLaunch) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    message: "Launched successfully aborted!",
  });
};

module.exports = {
  httpGetLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};

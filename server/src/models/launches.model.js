const { launches } = require("./launches.mongo");
const { planets } = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 0;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date(2030, 11, 15),
  target: "Kepler-452 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

const getAllLaunches = async () => await launches.find({}, { _id: 0, __v: 0 });

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planets was found!");
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

const scheduleNewLaunch = async (launch) => {
  const flightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero To Mastery", "NASA"],
    flightNumber,
  });
  await saveLaunch(newLaunch);
};

const hasLaunch = async (id) => {
  const launch = await launches.findOne({ flightNumber: id });
  return Boolean(launch);
};

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort("-flightNumber");

  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

const abortLaunch = async (id) => {
  const aborted = await launches.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.ok && aborted.nModified;
};

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  hasLaunch,
  abortLaunch,
};

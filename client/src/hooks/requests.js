const API_VERSION = "v1";
const API_URL = "http://localhost:8000";
const ROOT_BACKEND_URL = `${API_URL}/${API_VERSION}`;

async function httpGetPlanets() {
  const response = await fetch(`${ROOT_BACKEND_URL}/planets`);

  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${ROOT_BACKEND_URL}/launches`);

  const launches = await response.json();

  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${ROOT_BACKEND_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${ROOT_BACKEND_URL}/launches/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

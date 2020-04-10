import axios from "axios";

const instanceData = axios.create({
  baseURL: "https://corona-api.com/",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

async function getTimelineDetails() {
  try {
    const res = await instanceData.get("timeline");
    let { data } = res.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function getCountryDetails() {
  try {
    const res = await instanceData.get("countries");
    let { data } = res.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
async function getCountryWithTimelineDetails() {
  try {
    const res = await instanceData.get("countries?include=timeline");
    let { data } = res.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

const fetchData = () => {};

export { fetchData };

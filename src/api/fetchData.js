import React, { createContext, useReducer } from "react";
import axios from "axios";
import AppReducer from "./AppReducer";

const instanceData = axios.create({
  baseURL: "https://corona-api.com/",

  headers: { "Content-Type": "application/json" },
});

//Initial State
const initialState = {
  countryData: [],
  timeline: [],
  error: null,
  loading: true,
};

//Create Context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //Actions
  async function getTimelineDetails() {
    try {
      const res = await instanceData.get("timeline");
      dispatch({
        type: "GET_TIMELINE_DETAILS",
        payload: res.data.data[0],
      });
    } catch (err) {
      dispatch({
        type: "RECEIVED_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function getCountryDetails() {
    try {
      const res = await instanceData.get("countries?include=timeline");
      dispatch({
        type: "GET_COUNTRY_WITH_TIMELINE_DETAILS",
        payload: res.data.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "RECEIVED_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        countryData: state.countryData,
        timeline: state.timeline,
        error: state.error,
        loading: state.loading,
        getCountryDetails,
        getTimelineDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

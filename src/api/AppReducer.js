export default (state, action) => {
  switch (action.type) {
    case "GET_TIMELINE_DETAILS":
      return {
        ...state,
        loading: false,
        timeline: action.payload,
      };
    case "GET_COUNTRY_WITH_TIMELINE_DETAILS":
      return {
        ...state,
        loading: false,
        countryData: action.payload,
      };
    case "RECEIVED_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

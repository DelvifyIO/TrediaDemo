import {
  SET_QUERY,
  SET_SEARCHING_STATUS,
  SET_RESULT,
  SET_FILTERS,
} from "../actions/types";

import { SEARCH_STATUS } from "../utils/enum";

const initialState = {
  query: null,
  status: SEARCH_STATUS.IDLE,
  result: [],
  filters: {
    brands: [],
    materials: [],
    features: [],
    origins: [],
    usages: [],
    sizes: [],
    tapeColors: [],
    teethColors: [],
  },
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_QUERY:
      return {
        ...state,
        query: payload.query,
      };
    case SET_SEARCHING_STATUS:
      return {
        ...state,
        status: payload.status,
      };
    case SET_RESULT:
      return {
        ...state,
        result: payload.result,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: payload.filters,
      };
    default:
      return state;
  }
}

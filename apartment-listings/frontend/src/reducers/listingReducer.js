import { GET_LISTINGS } from '../actions/types';
import { GET_LISTING } from '../actions/types';

const initialState = {
  loading: false,
  listings: null,
  listing: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LISTINGS:
      return {
        ...state,
        listings: action.payload,
        loading: false
      };
    case GET_LISTING:
      return {
        ...state,
        listing: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

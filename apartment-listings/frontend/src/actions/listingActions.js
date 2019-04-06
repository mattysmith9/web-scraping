import axios from 'axios';
import { GET_LISTINGS } from './types';
import { GET_LISTING } from './types';

/* GET ALL LISTINGS */
export const getListings = () => dispatch => {
  dispatch(setListingLoading());
  axios
    .get('/api/listings/all')
    .then(res =>
      dispatch({
        type: GET_LISTINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_LISTINGS,
        payload: null
      })
    );
};

/* GET LISTING BY ID */
export const getListingById = id => dispatch => {
  dispatch(setListingLoading());
  axios
    .get(`/api/listing/id/${id}`)
    .then(res =>
      dispatch({
        type: GET_LISTING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_LISTING,
        payload: null
      })
    );
};

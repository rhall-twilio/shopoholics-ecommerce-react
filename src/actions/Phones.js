import { count } from "ramda";
import {
  fetchPhones as fetchPhonesApi,
  loadMore as loadMoreApi,
  fetchPhoneById as fetchPhoneByIdApi,
  fetchCategories as fetchCategoriesApi,
} from "../api/fetchPhones";
import { getRenderedPhonesLength } from "../selectors/Phones";

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
export const applyDiscount = (invertedDiscount, code) => (dispatch) => {
  dispatch({
    type: "APPLY_COUPON_CODE",
    payload: { invertedDiscount, code },
  });
};

export const fetchPhones = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: "FETCH_PHONE_START",
      });
      const phones = await fetchPhonesApi();
      dispatch({
        type: "FETCH_PHONE_SUCCESS",
        payload: phones,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_PHONE_FAIL",
        payload: err,
        error: true,
      });
    }
  };
};

export const fetchCategories = () => {
  return async (dispatch, getState) => {
    // console.log("Fetching entire state ", getState());
    try {
      dispatch({
        type: "FETCH_CATEGORIES_START",
      });
      const categories = await fetchCategoriesApi();
      dispatch({
        type: "FETCH_CATEGORIES_SUCCESS",
        payload: categories,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_CATEGORIES_FAILURE",
        payload: err,
        error: true,
      });
    }
  };
};

export const loadMore = () => {
  return async (dispatch, getState) => {
    const offset = getRenderedPhonesLength(getState());
    try {
      dispatch({
        type: "LOAD_MORE_START",
      });
      const phones = await loadMoreApi({ offset });
      dispatch({
        type: "LOAD_MORE_SUCCESS",
        payload: phones,
      });
    } catch (err) {
      dispatch({
        type: "LOAD_MORE_FAILURE",
        payload: err,
        error: true,
      });
    }
  };
};

export const fetchPhoneById = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: "FETCH_PHONE_BY_ID_START",
      });
      const phone = await fetchPhoneByIdApi(id);
      dispatch({
        type: "FETCH_PHONE_BY_ID_SUCCESS",
        payload: phone,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_PHONE_BY_ID_FAILURE",
        payload: err,
        error: true,
      });
    }
  };
};

export const addPhoneToBasket = (id) => (dispatch) => {
  dispatch({
    type: "ADD_PHONE_TO_BASKET",
    payload: id,
  });
};

export const searchPhone = (text) => (dispatch) => {
  console.log("searching ", text);
  dispatch({
    type: "SEARCH_PHONE",
    payload: text,
  });
};

export const removePhoneFromBasket =
  (id, price, count) => async (dispatch, fetchPhoneById) => {
    let phonePrice = price;
    dispatch({
      type: "REMOVE_PHONE_FROM_BASKET",
      payload: id,
    });
    const removedPhoneId = id;
    const removedPhone = fetchPhoneById(id).phone[removedPhoneId];
    //const removedPhoneQuantity = removedPhoneId.length;
    //console.log(removedPhoneId);
    //console.log(fetchPhoneById(id));
    //old implementation below, keeping because it is mapped in Segment
    analytics.track("Product Removed", {
      seg_client_id: segClientId ? segClientId[0] : undefined,
      seg_session_id: segSessionId ? segSessionId[0] : undefined,
      value: removedPhone.price,
      currency: "USD",
      product: {
        product_id: id,
        product_name: removedPhone.name,
        product_price: price / count,
        product_quantity: count,
        product_category: "phone",
        product_currency: "USD",
      },
    });
  };

export const cleanBasket = () => (dispatch) => {
  dispatch({
    type: "CLEAN_BASKET",
  });
};

export const basketCheckout = (phones) => (dispatch, getState) => {
  const { code: coupon, invertedDiscount } = getState().Coupon;
  const revenue = phones.reduce(
    (a, b) => a + (b.price * invertedDiscount || 0),
    0
  );

  alert(JSON.stringify(phones));
};

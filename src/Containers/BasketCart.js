import React from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import {
  getTotalBasketCount,
  getTotalBasketPrice,
  getBasketPhonesWithCount,
} from "../selectors/Phones";
import phone from "../reducers/phone";

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
export const BasketCart = (props) => {
  const { totalBasketCount, totalPrice, phones } = props;
  let phoneBasket = phones.map((phone) => ({
    product_id: phone.id,
    product_name: phone.name,
    product_value: phone.price,
    product_quantity: phone.count,
    product_category: "phone",
    product_currency: "USD",
  }));
  let itemBasket = phones.map((phone) => ({
    item_id: phone.id,
    item_name: phone.name,
    price: phone.price,
    quantity: phone.count,
    item_category: "phone",
    currency: "USD",
  }));

  const goToBasket = () => {
    analytics.track("Checkout Started", {
      seg_client_id: segClientId ? segClientId[0] : undefined,
      seg_session_id: segSessionId ? segSessionId[0] : undefined,
      seg_no_cid_session: localStorage.getItem("cidSession"),
      currency: "USD",
      value: totalPrice,
      product: phoneBasket,
      items: itemBasket,
      //GTM Datalayer config ecommerce object required
      ecommerce: {
        affiliation: "Demo Phone",
        currency: "USD",
        value: totalPrice,
        items: itemBasket,
      },
    });
    browserHistory.push("/basket");
  };

  return (
    //<Link to="/basket" id="dLabel">
    <button
      className="btn btn-default btn-block"
      title="View Basket"
      onClick={() => goToBasket()}
    >
      <span className="glyphicon glyphicon-shopping-cart" />
      {" : "}
      {totalBasketCount} item(s) (${totalPrice})
    </button>
    // </Link>
  );
};

const mapStateToProps = (state) => ({
  totalBasketCount: getTotalBasketCount(state),
  phones: getBasketPhonesWithCount(state),
  totalPrice: getTotalBasketPrice(state),
});

export default connect(mapStateToProps)(BasketCart);

import React from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import {
  getTotalBasketCount,
  getTotalBasketPrice,
  getBasketPhonesWithCount,
} from "../selectors/Phones";
import phone from "../reducers/phone";

export const BasketCart = (props) => {
  const { totalBasketCount, totalPrice, phones } = props;
  let phoneBasket = phones.map((phone) => ({
    product_id: phone.id,
    product_name: phone.name,
    product_value: phone.price,
    product_quantity: phone.count,
    product_category: "phone",
  }));

  phoneBasket = phones.map((phone) => {
    return {
      product_id: phone.id,
      product_name: phone.name,
      product_value: phone.price,
      product_quantity: phone.count,
      product_category: "phone",
    };
  });

  phones.map((phone) => {
    phoneBasket.push({
      product_id: phone.id,
      product_name: phone.name,
      product_value: phone.price,
      product_quantity: phone.count,
      product_category: "phone",
    });
  });

  const goToBasket = () => {
    analytics.track("Checkout Start", { phones: phoneBasket });
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

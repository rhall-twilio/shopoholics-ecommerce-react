import React from "react";
import { connect } from "react-redux";
import {
  getTotalBasketPrice,
  getBasketPhonesWithCount,
  getPhones,
} from "../selectors/Phones";
import R from "ramda";
import {
  removePhoneFromBasket,
  cleanBasket,
  basketCheckout,
} from "../actions/Phones";
import { Link } from "react-router";
import Coupon from "./Coupon";
import phone from "../reducers/phone";

const Basket = ({
  phones,
  totalPrice,
  removePhoneFromBasket,
  cleanBasket,
  basketCheckout,
}) => {
  const phoneBasket = [];
  const isBasketEmpty = R.isEmpty(phones);
  const renderContent = () => {
    return (
      <div>
        {isBasketEmpty && <div> Your shopping cart is empty </div>}
        <div className="table-responsive">
          <table className="table-bordered table-striped table-condensed cf">
            <tbody>
              {phones.map((phone, index) => (
                <tr key={index} className="item-checout">
                  <td className="first-column-checkout">
                    <img
                      className="img-thumbnail"
                      src={phone.image}
                      alt={phone.name}
                    />
                  </td>
                  <td>{phone.name}</td>
                  <td>${phone.price}</td>
                  <td>{phone.count}</td>
                  <td>
                    <span
                      className="glyphicon glyphicon-remove"
                      onClick={() => removePhoneFromBasket(phone.id)}
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
            {phones.map((phone, index) =>
              phoneBasket.push({
                product_id: phone.id,
                product_name: phone.name,
                product_value: phone.price,
                product_quantity: phone.count,
                product_category: "phone",
              })
            )}
          </table>
        </div>
        {R.not(isBasketEmpty) && (
          <div className="row">
            <div className="pull-right total-user-checkout">
              <b>Total:</b>${totalPrice}
            </div>
          </div>
        )}
      </div>
    );
  };

  const phoneList = [];
  const renderSidebar = () => {
    return (
      <div>
        <Coupon />
        {R.not(isBasketEmpty) && (
          <div>
            <button
              className="btn btn-danger"
              onClick={() => cleanBasket()}
              onMouseDown={() =>
                phones.map(
                  (phone, index) =>
                    phoneList.push({
                      product_id: phone.id,
                      product_name: phone.name,
                      product_value: phone.price,
                      product_quantity: phone.count,
                      product_category: "phone",
                    }),
                  analytics.track("Cart Emptied", { product: phoneList })
                )
              }
            >
              <span className="glyphicon glyphicon-trash" />
              Clean Cart
            </button>
            <button
              className="btn btn-success"
              id="success"
              onClick={() => basketCheckout(phones)}
              onMouseDown={() =>
                phones.map(
                  (phone, index) =>
                    phoneList.push({
                      product_id: phone.id,
                      product_name: phone.name,
                      product_value: phone.price,
                      product_quantity: phone.count,
                      product_category: "phone",
                    }),
                  analytics.track("Order Completed", { product: phoneList })
                )
              }
            >
              <span className="glyphicon glyphicon-envelope" />
              Checkout
            </button>
          </div>
        )}
        <Link className="btn btn-default" to="/">
          <span className="glyphicon glyphicon-circle-arrow-left" />
          <span> Continue Shopping</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="view-container">
      <div className="container">
        <div className="row">
          <div className="col-md-9">{renderContent()}</div>
          <div className="col-md-3 btn-user-checkout">{renderSidebar()}</div>
          <script>
            {analytics.page("Basket", {
              cart_status: totalPrice ? "Cart Full" : "Cart Empty",
            })}
            ;
            {analytics.track("Cart Viewed", {
              product: phoneBasket,
            })}
          </script>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  phones: getBasketPhonesWithCount(state),
  totalPrice: getTotalBasketPrice(state),
});

const mapDispatchToProps = (dispatch) => ({
  removePhoneFromBasket: (id) => dispatch(removePhoneFromBasket(id)),
  cleanBasket: () => dispatch(cleanBasket()),
  basketCheckout: (phones) => dispatch(basketCheckout(phones)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Basket);

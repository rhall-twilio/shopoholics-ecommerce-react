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

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
const Basket = ({
  phones,
  totalPrice,
  removePhoneFromBasket,
  cleanBasket,
  basketCheckout,
}) => {
  const phoneBasket = [];
  const itemBasket = [];
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
                      onClick={() => {
                        removePhoneFromBasket(
                          phone.id,
                          phone.price,
                          phone.count
                        ),
                          analytics.track("Product Removed v2", {
                            seg_client_id: segClientId
                              ? segClientId[0]
                              : undefined,
                            seg_session_id: segSessionId
                              ? segSessionId[0]
                              : undefined,
                            seg_no_cid_session:
                              localStorage.getItem("cidSession"),
                            value: phone.price * phone.count,
                            currency: "USD",
                            product: {
                              product_id: phone.id,
                              product_name: phone.name,
                              product_price: phone.price,
                              product_quantity: phone.count,
                              product_category: "phone",
                              product_currency: "USD",
                            },
                            //GTM Ecommerce Object Required for Datalayer
                            ecommerce: {
                              currency: "USD",
                              value: phone.price * phone.count,
                              items: [
                                {
                                  affiliation: "Demo Phone",
                                  item_id: phone.id,
                                  item_name: phone.name,
                                  price: phone.price,
                                  quantity: phone.count,
                                  item_category: "phone",
                                  currency: "USD",
                                },
                              ],
                            },
                          });
                      }}
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
                product_currency: "USD",
              })
            )}
            {phones.map((phone, index) =>
              itemBasket.push({
                item_id: phone.id,
                item_name: phone.name,
                price: phone.price,
                quantity: phone.count,
                item_category: "phone",
                currency: "USD",
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
  const itemList = [];
  const cart_id_value = Math.random().toString(36).slice(2);
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
                      product_currency: "USD",
                    }),
                  phones.map(
                    (phone, index) =>
                      itemList.push({
                        item_id: phone.id,
                        item_name: phone.name,
                        price: phone.price,
                        quantity: phone.count,
                        item_category: "phone",
                        currency: "USD",
                      }),
                    analytics.track("Cart Emptied", {
                      seg_client_id: segClientId ? segClientId[0] : undefined,
                      seg_session_id: segSessionId
                        ? segSessionId[0]
                        : undefined,
                      seg_no_cid_session: localStorage.getItem("cidSession"),
                      product: phoneList,
                      items: itemList,
                      value: totalPrice,
                      currency: "USD",
                      //GTM Datalayer config ecommerce object required
                      ecommerce: {
                        affiliation: "Demo Phone",
                        currency: "USD",
                        value: totalPrice,
                        items: itemList,
                      },
                    })
                  )
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
                      product_currency: "USD",
                    }),
                  phones.map(
                    (phone, index) =>
                      itemList.push({
                        item_id: phone.id,
                        item_name: phone.name,
                        price: phone.price,
                        quantity: phone.count,
                        item_category: "phone",
                        currency: "USD",
                      }),
                    analytics.track("Order Completed", {
                      seg_client_id: segClientId ? segClientId[0] : undefined,
                      seg_session_id: segSessionId
                        ? segSessionId[0]
                        : undefined,
                      seg_no_cid_session: localStorage.getItem("cidSession"),
                      cart_currency: "USD",
                      cart_id: cart_id_value,
                      cart_total: totalPrice,
                      product: phoneList,
                      items: itemList,
                      //GTM Datalayer config ecommerce object required
                      ecommerce: {
                        affiliation: "Demo Phone",
                        currency: "USD",
                        transaction_id: cart_id_value,
                        value: totalPrice,
                        items: itemList,
                      },
                    })
                  )
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
              seg_client_id: segClientId ? segClientId[0] : undefined,
              seg_session_id: segSessionId ? segSessionId[0] : undefined,
              seg_no_cid_session: localStorage.getItem("cidSession"),
            })}
            ;
            {analytics.track("Cart Viewed", {
              seg_client_id: segClientId ? segClientId[0] : undefined,
              seg_session_id: segSessionId ? segSessionId[0] : undefined,
              seg_no_cid_session: localStorage.getItem("cidSession"),
              product: phoneBasket,
              items: itemBasket,
              value: totalPrice,
              currency: "USD",
              //GTM Datalayer config ecommerce object required
              ecommerce: {
                affiliation: "Demo Phone",
                currency: "USD",
                value: totalPrice,
                items: itemBasket,
              },
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

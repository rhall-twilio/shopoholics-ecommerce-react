import React from "react";
import { connect } from "react-redux";
import { fetchPhones, fetchCategories } from "../actions/Phones";
import { getPhones } from "../selectors/Phones";
import { Link } from "react-router";
import R from "ramda";
import { addPhoneToBasket } from "../actions/Phones";
import phone from "../reducers/phone";

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
class Phones extends React.Component {
  componentDidMount() {
    window.analytics.page({
      seg_client_id: segClientId ? segClientId[0] : undefined,
      seg_session_id: segSessionId ? segSessionId[0] : undefined,
    });
    this.props.fetchPhones();
    this.props.fetchCategories();
  }

  renderPhone = (phone, index) => {
    const { addPhoneToBasket } = this.props;
    const shortDesc = `${R.take(60, phone.description)}...`;
    return (
      <div className="col-sm-4 col-lg-4 col-md-4 book-list" key={index}>
        <div className="thumbnail">
          <img className="img-thumbnail" src={phone.image} alt={phone.name} />
        </div>
        <div className="caption">
          <h4 className="pull-right">${phone.price}</h4>
          <h4>{phone.name}</h4>
          <p> {shortDesc}</p>
          <p className="itemButton">
            <button
              className="btn btn-primary"
              onClick={() => addPhoneToBasket(phone.id)}
              onMouseDown={() =>
                analytics.track("Product Added", {
                  seg_client_id: segClientId ? segClientId[0] : undefined,
                  seg_session_id: segSessionId ? segSessionId[0] : undefined,
                  product: {
                    product_id: phone.id,
                    product_name: phone.name,
                    product_value: phone.price,
                    product_category: "phone",
                    product_currency: "USD",
                  },
                  //GTM Ecommerce Object Required for Datalayer
                  ecommerce: {
                    currency: "USD",
                    value: phone.price,
                    items: [
                      {
                        affiliation: "Demo Phone",
                        item_id: phone.id,
                        item_name: phone.name,
                        price: phone.price,
                        item_category: "phone",
                        currency: "USD",
                      },
                    ],
                  },
                })
              }
            >
              Buy Now
            </button>
            <Link to={`/Phones/${phone.id}`} className="btn btn-default">
              More Info
            </Link>
          </p>
        </div>
      </div>
    );
  };

  render() {
    const { phones } = this.props;
    return (
      <div>
        <div className="books row">
          {phones.map((phone, index) => {
            return this.renderPhone(phone, index);
          })}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchPhones: () => dispatch(fetchPhones()),
  addPhoneToBasket: (id) => dispatch(addPhoneToBasket(id)),
  fetchCategories: () => dispatch(fetchCategories()),
});
//ownProps are available here because this component is defined directly on route.
//child componenets must include compose withRoutes
const mapStateToProps = (state, ownProps) => ({
  phones: getPhones(state, ownProps),
});

export default connect(mapStateToProps, mapDispatchToProps)(Phones);

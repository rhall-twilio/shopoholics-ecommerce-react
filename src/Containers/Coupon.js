import React from "react";
import { connect } from "react-redux";
import { applyDiscount } from "../actions/Phones";

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
class Coupon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      couponCode: "",
      message: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCouponCodeInputChange = this.onCouponCodeInputChange.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.couponCode === "SEGMENT") {
      this.setState({
        couponCode: this.state.couponCode,
        message: "10% discount applied",
      });
      this.props.applyDiscount(0.9, this.state.couponCode);
    } else
      this.setState({
        couponCode: this.state.couponCode,
        message: "Invalid Coupon Code",
      });
  };

  onCouponCodeInputChange = (e) => {
    const couponCode = e.target.value;
    this.setState({
      couponCode,
    });
  };

  render() {
    return (
      <div className="well blosd">
        <span className="lead">Apply Coupon Code</span>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={this.state.couponCode}
              onChange={this.onCouponCodeInputChange}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                onClick={() =>
                  analytics.track("Coupon Added", {
                    seg_client_id: segClientId ? segClientId[0] : undefined,
                    seg_session_id: segSessionId ? segSessionId[0] : undefined,
                    coupon_status:
                      this.state.couponCode === "SEGMENT"
                        ? "Applied"
                        : "Denied",
                    coupon_name: this.state.couponCode,
                    coupon_discount:
                      this.state.couponCode === "SEGMENT"
                        ? "10%"
                        : "Invalid Coupon",
                    coupon_currency: "USD",
                  })
                }
              >
                <span className="glyphicon glyphicon-gift" />
              </button>
            </span>
          </div>
        </form>
        {this.state.message}{" "}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  applyDiscount: (invertedDiscount, code) =>
    dispatch(applyDiscount(invertedDiscount, code)),
});

export default connect(undefined, mapDispatchToProps)(Coupon);

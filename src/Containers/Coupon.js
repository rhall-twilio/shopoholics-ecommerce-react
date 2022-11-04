import React from "react";
import { connect } from "react-redux";
import { applyDiscount } from "../actions/Phones";

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
      analytics.track("Coupon Applied", {
        coupon_name: this.state.couponCode,
        coupon_discount: "10%",
      });
    } else
      this.setState({
        couponCode: this.state.couponCode,
        message: "Invalid Coupon Code",
      });
    analytics.track("Coupon Denied", {
      coupon_name: this.state.couponCode,
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
              <button className="btn btn-default">
                <span className="glyphicon glyphicon-gift" />
              </button>
            </span>
          </div>
        </form>
        {this.state.message}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  applyDiscount: (invertedDiscount, code) =>
    dispatch(applyDiscount(invertedDiscount, code)),
});

export default connect(undefined, mapDispatchToProps)(Coupon);

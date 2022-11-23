import React from "react";
import { connect } from "react-redux";

const segClientId = cookieObjCid.get("_ga").match(/[0-9]+\S[0-9]+$/g);
const segSessionId = cookieObjSid.get("_ga_LW0DP01W31").match(/[0-9]{9,10}/g);
class Newsletter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailValue: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onNewsletterInputChange = this.onNewsletterInputChange.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
  };

  onNewsletterInputChange = (e) => {
    const emailValue = e.target.value;
    this.setState({
      emailValue,
    });
  };

  render() {
    return (
      <div className="well blosd">
        <span className="lead">Newsletter Subscription</span>

        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={this.state.searchValue}
              onChange={this.onNewsletterInputChange}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                onClick={() => {
                  analytics.identify(null, {
                    seg_client_id: segClientId ? segClientId[0] : undefined,
                    email: this.state.emailValue,
                    signup_source: "newsletter",
                    platform_111422: "app",
                    created_at: new Date().toDateString(),
                  });
                  analytics.track("Account Created", {
                    seg_client_id: segClientId ? segClientId[0] : undefined,
                    seg_session_id: segSessionId ? segSessionId[0] : undefined,
                    product_type: "phone",
                    email: this.state.emailValue,
                    signup_type: "organic",
                    signup_source: "newsletter",
                    content_type: "newsletter",
                  });
                }}
              >
                <span className="glyphicon glyphicon-envelope" />
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({});

export default connect(undefined, mapDispatchToProps)(Newsletter);

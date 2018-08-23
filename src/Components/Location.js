import React, { Component } from "react";
import PropTypes from "prop-types";

class Location extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    markers: PropTypes.array.isRequired,
    google: PropTypes.object.isRequired
  };

  // Trigger click on the associated marker
  locationClick(e, i) {
    i = e.target.dataset.id;
    var marker = this.props.markers[i]
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    this.props.google.maps.event.trigger(marker, 'click');
  }

  // Handling keypress added for accessbility
  locationPress(e, i) {
  	if (e.key === 'Enter'){
  		i = e.target.dataset.id;
	    var marker = this.props.markers[i]
	    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
	    this.props.google.maps.event.trigger(marker, 'click');
  	}
  }

  render() {
    const { location, index } = this.props;

    return (
      <li
        tabIndex="0"
        onClick={this.locationClick.bind(this)}
        onKeyPress={this.locationPress.bind(this)}
        data-id={index}
      >
        {location.name}
      </li>
    );
  }
}

export default Location;
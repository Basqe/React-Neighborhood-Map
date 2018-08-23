import React, { Component } from "react";
import PropTypes from "prop-types";
import Marker from "./Marker";
import { Map, InfoWindow } from "google-maps-react";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

export class MapContainer extends Component {
  static propTypes = {
    locationsarray: PropTypes.array.isRequired,
    matchedlocations: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    markers: PropTypes.array.isRequired
  };

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    infowindow: "",
    openedMarker: {}
  };

  // Check if the marker is the same and only opens the Info Window and set the
  // animations if it's different.
  onMarkerClick = (props, marker, e) => {
  	if (this.state.openedMarker !== marker) {
  		if (this.state.showingInfoWindow) {
	    	this.onInfoWindowClosed();
	    }
	    this.setState({
	      selectedPlace: props,
	      activeMarker: marker,
	      showingInfoWindow: true,
	      openedMarker: marker
	    });
	    marker.setAnimation(window.google.maps.Animation.BOUNCE);
		this.infoToInfoWindow(marker);
  	}
  };

  onInfoWindowClosed = (props, marker, e) => {
  	this.state.activeMarker.setAnimation(null);
    this.setState({
		showingInfoWindow: false,
	    infowindow: "",
	    activeMarker: null
    });
  };

  onMapClick = props => {
    if (this.state.showingInfoWindow) {
	    this.onInfoWindowClosed();
    }
  };

  //Gets information from FourSquare API and sends it to the infoWindow state
  infoToInfoWindow = (marker) => {
    var self = this;

    //API keys taken from FourSquare site
    var clientId = "0FXFZPCMJRR3NWPC3Z3DWPZ1HHDWC0OZWS3VBAI5BYMRS24L";
    var clientSecret = "ZMEOFMEZQE30TYMCTTNHBC3S0KQ4ASXO4OUYLB2PCIYW5ABK";

    var url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&v=20130815&ll=" +
      marker.position.lat() +
      "," +
      marker.position.lng() +
      "&limit=1";
    self.setState({
      infowindow: "Data loading..."
    });

    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.setState({
            infowindow: "Oops, Something went wrong. Please try again or come back later."
          });
          return;
        }

        response.json().then(function(data) {
          var location_data = data.response.venues[0];
          var fullAddress;

          if ( (location_data.location.city === undefined) || (location_data.location.address === undefined) ) {
          	fullAddress = "Sorry, no full address found!"
          } else (
          	fullAddress =
            "<b>Full address: </b>" +
            location_data.location.city +
            ", " +
            location_data.location.address
          )
          self.setState({
            infowindow: fullAddress
          });
        });
      })
      .catch(function(err) {
        self.setState({
          infowindow: "Oops, Something went wrong. Please try again or come back later."
        });
      });
  };

  render() {
    const { locationsarray, query, markers } = this.props;
    let { matchedlocations } = this.props;

    if (query) {
      const match = new RegExp(escapeRegExp(query), "i");
      matchedlocations = locationsarray.filter(location =>
        match.test(location.name)
      );
    } else {
      matchedlocations = locationsarray;
    }

    matchedlocations.sort(sortBy("name"));

    return (
      <Map
        google={this.props.google}
        onClick={this.onMapClick}
        onReady={this.onChangeMarker}
        zoom={15}
        role="application"
        initialCenter={{
          lat: 54.3475,
          lng: 18.645278
        }}
      >
        {matchedlocations.map((location, index) => (
          <Marker
            markers={markers}
            key={index}
            data-markernumber={index}
            google={this.props.google}
            onClick={this.onMarkerClick}
            map={this.map}
            name={location.name}
            position={location.latlng}
          />
        ))}
        <InfoWindow
          marker={this.state.activeMarker}
          onClose={this.onInfoWindowClosed}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h2>{this.state.selectedPlace.name}</h2>
            <div dangerouslySetInnerHTML={{ __html: this.state.infowindow }} />
            <span className="infoprovider">Information provided by Foursquare</span>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default MapContainer;

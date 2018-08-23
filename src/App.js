import React, { Component } from "react";
import LocationList from "./Components/LocationList";
import MapContainer from "./Components/MapContainer";
import * as mapdata from "./locations";
import { GoogleApiWrapper } from "google-maps-react";
import "./App.css";

class App extends Component {
  state = {
    locationsarray: [],
    matchedlocations: [],
    markers: [],
    query: ""
  };

  // Pushing each location from the data to an array
  componentWillMount() {
    var locationsarray = this.state.locationsarray;
    mapdata.locations.forEach(function(e) {
      locationsarray.push(e);
    });
  }

  updateQuery = query => {
    this.setState({ query: query.trim() });
  };

  // Render the compontents of Location List/Filter and Google Map
  render() {
    return (
      <main className="main-wrapper">
        <LocationList
          locationsarray={this.state.locationsarray}
          matchedlocations={this.state.matchedlocations}
          updateQuery={this.updateQuery}
          query={this.state.query}
          markers={this.state.markers}
          google={this.props.google}
        />
        <div role="application" aria-label="Google Map">
          <MapContainer
            locationsarray={this.state.locationsarray}
            matchedlocations={this.state.matchedlocations}
            query={this.state.query}
            markers={this.state.markers}
            google={this.props.google}
          />
        </div>
      </main>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAehr1RwyJJ0UJsj9wxsjECF5o-sb6hfyI"
})(App);

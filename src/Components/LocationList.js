import React, { Component } from "react";
import PropTypes from "prop-types";
import Location from "./Location";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

class LocationList extends Component {
  static propTypes = {
    locationsarray: PropTypes.array.isRequired,
    matchedlocations: PropTypes.array.isRequired,
    updateQuery: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    markers: PropTypes.array.isRequired,
    google: PropTypes.object.isRequired
  };

  showHide() {
    let locationList = this.refs.locations;
    locationList.classList.toggle("hide");
  }

  render() {
    const { locationsarray, updateQuery, query, markers, google } = this.props;
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
      <aside className="location-list" role="search">
        <div
          tabIndex="1"
          role="button"
          onClick={() => this.showHide()}
          className="show-hide"
          aria-label="Open or close location filter list"
        >
          <span>Filter locations</span>
        </div>
        <div className="locations" ref="locations">
          <h1>Zabytki Gdańskie</h1>
          <input
            tabIndex="2"
            type="text"
            placeholder="Filter by name"
            className="location-filter"
            role="search"
            aria-labelledby="Filter by name"
            value={this.props.query}
            onChange={event => updateQuery(event.target.value)}
          />
          <ul className="locationsul" role="navigation">
            {matchedlocations.map((location, index) => (
              <Location
                index={index}
                key={index}
                location={location}
                markers={markers}
                google={google}
              />
            ))}
          </ul>
        </div>
      </aside>
    );
  }
}

export default LocationList;

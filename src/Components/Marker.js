import React from "react";
import PropTypes from "prop-types";

import { camelize } from "./String";

const evtNames = [
  "click",
  "dblclick",
  "dragend",
  "mousedown",
  "mouseout",
  "mouseover",
  "mouseup",
  "recenter"
];

const wrappedPromise = function() {
  var wrappedPromise = {},
    promise = new Promise(function(resolve, reject) {
      wrappedPromise.resolve = resolve;
      wrappedPromise.reject = reject;
    });
  wrappedPromise.then = promise.then.bind(promise);
  wrappedPromise.catch = promise.catch.bind(promise);
  wrappedPromise.promise = promise;

  return wrappedPromise;
};

export class Marker extends React.Component {
  componentDidMount() {
    this.markerPromise = wrappedPromise();
    this.renderMarker();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.map !== prevProps.map ||
      this.props.position !== prevProps.position ||
      this.props.icon !== prevProps.icon
    ) {
      if (this.marker) {

        this.marker.setMap(null);
      }
      this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  renderMarker() {
    const {
      map,
      google,
      position,
      mapCenter,
      icon,
      label,
      draggable,
      title,
      markers,
      ...props
    } = this.props;
    if (!google) {
      return null;
    }

    let pos = position || mapCenter;
    if (!(pos instanceof google.maps.LatLng)) {
      pos = new google.maps.LatLng(pos.lat, pos.lng);
    }

    const pref = {
      map,
      position: pos,
      icon,
      label,
      title,
      draggable,
      ...props
    };
    this.marker = new google.maps.Marker(pref);

    evtNames.forEach(e => {
      this.marker.addListener(e, this.handleEvent(e));
    });

    this.markerPromise.resolve(this.marker);

    // This part is added to the original package
    // Push the marker to markers array if it doesn't exists
    // eslint-disable-next-line
    Array.prototype.inArray = function(comparer) {
      for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
      }
      return false;
    };

    // eslint-disable-next-line
    Array.prototype.pushIfNotExist = function(element, comparer) {
      if (!this.inArray(comparer)) {
        this.push(element);
      }
    };

    var array = markers;
    var element = this.marker;
    array.pushIfNotExist(element, function(e) {
      return e.name === element.name && e.text === element.text;
    });
    // End of added part
  }

  getMarker() {
    return this.markerPromise;
  }

  handleEvent(evt) {
    return e => {
      const evtName = `on${camelize(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      }
    };
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
  markers: PropTypes.array
};

evtNames.forEach(e => (Marker.propTypes[e] = PropTypes.func));

Marker.defaultProps = {
  name: "Marker"
};

export default Marker;

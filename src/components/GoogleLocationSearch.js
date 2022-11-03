import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";

let autoComplete;

const keysConfig = require('../config/keys');

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, handleGoogleAddress) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { /*types: ["(cities)"], componentRestrictions: { country: "us" }*/ }
  );
  autoComplete.setFields([/*"address_components", */"formatted_address", "geometry"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, handleGoogleAddress)
  );
}

async function handlePlaceSelect(updateQuery, handleGoogleAddress) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  //console.log(addressObject);
  let lat = addressObject.geometry.location.lat();
  let lng = addressObject.geometry.location.lng();
  handleGoogleAddress(query, lat, lng);
}

function GoogleLocationSearch(props) {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      'https://maps.googleapis.com/maps/api/js?key='+keysConfig.google.apiKey+'&libraries=places',
      () => handleScriptLoad(setQuery, autoCompleteRef, handleGoogleAddress)
    );
  }, []);
  
  function handleGoogleAddress(query, lat, lng){
  	props.handleGoogleAddress(query, lat, lng);
  }

  return (
    <div className="search-location-input">
		<Form.Control type="text" ref={autoCompleteRef} placeholder="Enter address" onChange={event => setQuery(event.target.value)} value={query} />
    </div>
  );
}

export default GoogleLocationSearch;
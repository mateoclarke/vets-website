import React, { useState } from 'react';
import LocationConfirmationScreen from './LocationConfirmationScreen';
import LocationSelectorScreen from './LocationSelectorScreen';
import LandingScreen from './LandingScreen';
import CaseNumberScreen from './CaseNumberScreen';

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [location, setLocation] = useState({});

  switch (pageNumber) {
    case 1:
      return <LandingScreen onPageChange={setPageNumber} />;
    case 2:
      return (
        <LocationSelectorScreen
          onPageChange={setPageNumber}
          location={location}
          setLocation={setLocation}
        />
      );
    case 3:
      return (
        <LocationConfirmationScreen
          onPageChange={setPageNumber}
          location={location}
        />
      );
    case 4:
      return <CaseNumberScreen />;
    default:
      return <LandingScreen onPageChange={setPageNumber} />;
  }
}

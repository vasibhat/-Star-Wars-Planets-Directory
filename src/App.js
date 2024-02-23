// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const Planet = ({ planet }) => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const fetches = planet.residents.map(residentUrl =>
          fetch(residentUrl).then(res => res.json())
        );
        const residentData = await Promise.all(fetches);
        setResidents(residentData);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, [planet.residents]);

  return (
    <div className="planet-card">
      <h2>{planet.name}</h2>
      <p>Climate: {planet.climate}</p>
      <p>Population: {planet.population}</p>
      <p>Terrain: {planet.terrain}</p>
      <h3>Residents:</h3>
      {residents.length > 0 ? (
        <ul>
          {residents.map(resident => (
            <li key={resident.url}>
              <Resident resident={resident} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No residents found for this planet.</p>
      )}
    </div>
  );
};

const Resident = ({ resident }) => (
  <div>
    <p>Name: {resident.name}</p>
    <p>Height: {resident.height}</p>
    <p>Mass: {resident.mass}</p>
    <p>Gender: {resident.gender}</p>
  </div>
);

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/planets/?format=json');
        const data = await response.json();
        setPlanets(data.results);
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
    };

    fetchPlanets();
  }, []);

  const handleNextPlanet = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handlePreviousPlanet = () => {
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  const currentPlanet = planets[currentIndex];

  return (
    <div className="App">
      <h1>Star Wars Planets Directory</h1>
      {currentPlanet && (
        <Planet planet={currentPlanet} />
      )}
      <div className="button-container">
        <button onClick={handlePreviousPlanet} disabled={currentIndex === 0}>
          &#9664; Previous Planet
        </button>
        <button onClick={handleNextPlanet} disabled={currentIndex === planets.length - 1}>
          Next Planet &#9654;
        </button>
      </div>
    </div>
  );
};

export default App;

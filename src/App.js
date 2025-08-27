import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import axios from 'axios';
import MapModal from './MapModal'; // Import the new MapModal component
import './App.css';

function App() {
  const auth = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isMapVisible, setMapVisible] = useState(false); // State to control map visibility

  // Calls the public Django API endpoint
  const callPublicApi = async () => {
    try {
      setApiResponse(null);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/public/');
      setApiResponse(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calls the protected Django API endpoint
  const callProtectedApi = async () => {
    try {
      setApiResponse(null);
      setError(null);
      if (!auth.user?.access_token) {
        setError("No access token available. Please log in.");
        return;
      }
      // Make the API call with the Authorization header
      const response = await axios.get('http://localhost:8000/api/protected/', {
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      });
      setApiResponse(response.data);
    } catch (err) {
      const errorMsg = err.response ? 
        `${err.response.status}: ${JSON.stringify(err.response.data)}` : 
        err.message;
      setError(errorMsg);
    }
  };

  // Handle different authentication states
  if (auth.isLoading) {
    return <div className="container"><h1>Authenticating...</h1></div>;
  }

  if (auth.error) {
    return <div className="container"><h1>Authentication Error: {auth.error.message}</h1></div>;
  }

  return (
    <div className="container">
      {/* Render the map modal if isMapVisible is true */}
      {isMapVisible && <MapModal onClose={() => setMapVisible(false)} />}

      <header>
        <h1>Keycloak, React & Django</h1>
        <div className="auth-controls">
          {!auth.isAuthenticated ? (
            <button onClick={() => auth.signinRedirect()}>Log In</button>
          ) : (
            <>
              <span>Hello, <strong>{auth.user?.profile.preferred_username}</strong></span>
              <button onClick={() => auth.signoutRedirect()}>Log Out</button>
            </>
          )}
        </div>
      </header>

      <main>
        <div className="card api-controls">
          <h2>API Calls</h2>
          <p>Use the buttons below to interact with the Django backend.</p>
          <div className="buttons">
            <button onClick={callPublicApi}>Call Public API</button>
            <button onClick={callProtectedApi} disabled={!auth.isAuthenticated}>
              Call Protected API
            </button>
            {/* This button is only shown when the user is authenticated */}
            {auth.isAuthenticated && (
              <button onClick={() => setMapVisible(true)}>Show Map</button>
            )}
          </div>
        </div>

        {(apiResponse || error) && (
          <div className="card api-display">
            <h2>API Response</h2>
            {error && <pre className="error-box">{error}</pre>}
            {apiResponse && <pre>{JSON.stringify(apiResponse, null, 2)}</pre>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
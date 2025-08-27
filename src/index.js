
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from 'react-oidc-context';
import reportWebVitals from './reportWebVitals';


// Configuration for the OIDC client
const oidcConfig = {
  authority: 'http://localhost:8080/realms/realm-prova',
  client_id: 'react-app',
  redirect_uri: 'http://localhost:3000',
  // This function is called after a successful login
  onSigninCallback: () => {
    // Removes the auth codes from the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

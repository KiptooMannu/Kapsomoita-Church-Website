import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const repoName = 'Kapsomoita-Church-Website'
const isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === 'true'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={isGitHubPages ? `/${repoName}` : '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter >
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );




// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter basename="/Kapsomoita-Church-Website/">
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

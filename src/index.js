import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter basename="/chat-app"> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { MemoryRouter } from 'react-router-dom';
// import App from './App';

// const RouterCheck = ({ children }) => {
//   // We don't need to use useRoutes here, just pass children through
//   // The fact that this component renders means we're in a Router context
//   console.log('✅ Router context is available');
//   return children;
// };

// window.ChatWidget = {
//   init: function (config) {

//     // Prevent duplicate mounting
//     if (document.getElementById("chat-widget-container")) return;

//     const container = document.createElement("div");
//     container.id = "chat-widget-container";
//     document.body.appendChild(container);

//     const root = ReactDOM.createRoot(container);

//     root.render(
//       <MemoryRouter>
//         <RouterCheck>
//           <App config={config} />
//         </RouterCheck>
//       </MemoryRouter>
//     );
//   }
// };




// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { MemoryRouter } from 'react-router-dom';
// import App from './App';

// (function () {
//   window.ChatWidget = {
//     init: function (config) {

//       if (document.getElementById("chat-widget-container")) return;

//       const container = document.createElement("div");
//       container.id = "chat-widget-container";
//       document.body.appendChild(container);

//       const root = ReactDOM.createRoot(container);

//       root.render(
//         <MemoryRouter>
//           <App config={config} />
//         </MemoryRouter>
//       );
//     }
//   };
// })();
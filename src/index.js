// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* <BrowserRouter basename="/chat-app"> */}
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();




import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import socket from './utils/socket';

const RouterCheck = ({ children }) => {
  // We don't need to use useRoutes here, just pass children through
  // The fact that this component renders means we're in a Router context
  console.log('✅ Router context is available');
  return children;
};

window.ChatWidget = {
  init: function (config) {
    this.config = config;
    const container = document.getElementById("my-chat-widget");

    if (!container) {
      console.error("Chat widget container not found");
      return;
    }

    // Prevent duplicate mount
    if (container.shadowRoot) return;

    // 1️⃣ Create Shadow DOM
    const shadowRoot = container.attachShadow({ mode: "open" });

    this.shadowRoot = shadowRoot;

    // 2️⃣ Mount node inside shadow
    const mountPoint = document.createElement("div");
    mountPoint.classList.add("h-100");
    shadowRoot.appendChild(mountPoint);

    // 3️⃣ Inject widget CSS INSIDE shadow
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://bigstuffmovers.au/widget/build/static/css/main.4932e919.css";
    shadowRoot.appendChild(link);

    this.injectTheme(config);
    this.updateLanguage(config.lang)

    // 5️⃣ Render React inside shadow
    const root = ReactDOM.createRoot(mountPoint);

    root.render(
      <MemoryRouter>
        <RouterCheck>
          <App config={config} shadowRoot={shadowRoot} />
        </RouterCheck>
      </MemoryRouter>
    );
  },

  injectTheme: function (config) {
    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) return;

    const existing = shadowRoot.getElementById("chat-theme-style");
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = "chat-theme-style";

    const lightPrimaryGreen = config?.theme?.light?.primaryGreen || "#3883F9";
    const lightPrimaryRed = config?.theme?.light?.primaryRed || "#f93c65";
    const lightPrimaryDarkBg = config?.theme?.light?.primaryDarkBg || "#ffffff";
    const lightSecondaryDarkBg = config?.theme?.light?.secondaryDarkBg || "#ffffff";

    const darkPrimaryGreen = config?.theme?.dark?.primaryGreen || "#3883F9";
    const darkPrimaryRed = config?.theme?.dark?.primaryRed || "#f93c65";
    const darkPrimaryDarkBg = config?.theme?.dark?.primaryDarkBg || "#ffffff";
    const darkSecondaryDarkBg = config?.theme?.dark?.secondaryDarkBg || "#ffffff";

    style.textContent = `
      :host {
        --chat-primary-green: ${config.isDarkMode ? darkPrimaryGreen : lightPrimaryGreen};
        --chat-primary-red: ${config.isDarkMode ? darkPrimaryRed : lightPrimaryRed};
        --chat-primary-dark-bg: ${config.isDarkMode ? darkPrimaryDarkBg : lightPrimaryDarkBg};
        --chat-secondary-dark-bg: ${config.isDarkMode ? darkSecondaryDarkBg : lightSecondaryDarkBg};
        --chat-bg: ${config.isDarkMode ? darkPrimaryDarkBg : '#ebeef2b3'};
        --chat-head-bg: ${config.isDarkMode ? darkSecondaryDarkBg : '#fff'};
        --chat-name-color: ${config.isDarkMode ? '#fff' : '#364a63'};
        --chat-text-color: ${config.isDarkMode ? '#fff' : '#526484'};
        --chat-msg-color: ${config.isDarkMode ? darkSecondaryDarkBg : '#000'};
        --chat-my-msg-color: ${config.isDarkMode ? darkSecondaryDarkBg : '#fff'};
      }
    `;

    shadowRoot.appendChild(style);
  },

  updateTheme: function (isDarkMode) {
    if (!this.config) return;

    this.config.isDarkMode = isDarkMode;
    this.injectTheme(this.config);
  },

  createChat: async function (userData) {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
    console.log('Socket working');
    socket.emit("create-conversation", { userData });
  },

  updateLanguage: function (lang) {
    console.log('updated lang in chat widget', lang)
    this.config.lang = lang;


    // if (this.root) {
    //   this.root.render(
    //     <MemoryRouter>
    //       <App config={this.config} />
    //     </MemoryRouter>
    //   );
    // }
  }
};




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
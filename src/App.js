import React, { useState } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? <Chat user={user} /> : <Login onLogin={setUser} />}
    </>
  );
};

export default App;

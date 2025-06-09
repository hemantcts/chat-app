// OnlineUsersContext.js
import { createContext, useContext } from 'react';
export const OnlineUsersContext = createContext({});
export const useOnlineUsers = () => useContext(OnlineUsersContext);

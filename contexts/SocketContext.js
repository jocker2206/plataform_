import { createContext, useContext, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { ws } from '../env.json';
import { AuthContext } from '../contexts/AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    // auth
    const { auth, is_logged } = useContext(AuthContext);

    // hooks
    const { socket, online, connectSocket, disconnectSocket } = useSocket(ws.API_SOCKET);

    // connectar
    useEffect(() => {
        if (is_logged) connectSocket();
    }, [auth, connectSocket]);

    // desconnectar
    useEffect(() => {
        return () => disconnectSocket();
    }, [disconnectSocket]);

    // render
    return <SocketContext.Provider value={{ socket, online }}>
        {children}
    </SocketContext.Provider>
}
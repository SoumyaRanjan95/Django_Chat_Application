import React,{Children, createContext, useContext, useEffect, useRef, useState} from "react";

export const WebSocketContext = createContext(false, null, () => {});

export const WebSocketProvider = ({children}) =>{

    const [isReady, setIsReady] = useState(false);
    const [val, setVal] = useState(null);


    const ws = useRef(null);


    useEffect(() => {

        const socket = new WebSocket(
            'ws://'
            + window.location.host
            +'/ws/chat/'
        );

        socket.onopen = () => setIsReady(true)
        socket.onclose = () => setIsReady(false)
        socket.onmessage = (event) => setVal(event.data)
    
        ws.current = socket
    
        return () => {
          socket.close()
        }
    })

    const ret = [isReady, val, ws.current?.send.bind(ws.current)]

    return <WebSocketContext.Provider value={ret}>
        {children}
    </WebSocketContext.Provider>
}
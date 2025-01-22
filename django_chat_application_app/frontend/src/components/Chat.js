import React,{useContext, useEffect,useRef, useState} from "react";

import MessageView from "./MessageView";
import MessageBox from "./MessageBox";
import SideBar from "./SideBar";
import ShowContacts from "./ShowContacts";


import { GlobalContext } from "../store";

function Chat(){

    const GlobalData = useContext(GlobalContext);
    const {authState} = useContext(GlobalContext);
    const {chatState, chatDispatch} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);
    const {msgViewState, msgViewDispatch} = useContext(GlobalContext);


    console.log(GlobalData)

    const [showContacts, setShowContacts] = useState(false);
    const [isReady,setIsReady] = useState(false)
    const [val,setVal] = useState(false);


    const ws = useRef(null);

    
    useEffect(() => {

        /*
            Websocket is instantiated inside the useEffect Hook for the following reasons:
            1) Create the websocket only once and prevent it from being disconnected due to repeated reloads as state changes[the dependency array is kept empty]
            2) Use a useRef hook to hook the websocket instance and pass it down as props whenever you need to 
               send message using websockets.
            3)
        */

        const socket = new WebSocket(
            'ws://'
            + window.location.host
            +'/ws/chat/'
            +'user'
            +'/'
        );

        socket.onopen = () => setIsReady(true)
        socket.onclose = () => setIsReady(false)
        socket.onmessage = function(event){
            const Event = JSON.parse(event.data)
            /*
                The event has attribute type and data 
                {
                    type: 'Eventtype',
                    data: 'Event data',
                }
                The type attributes helps in identifying the approriate event to fire using the switch case statement
             */
            switch(Event.type){
                case 'CHAT_LOADED': // Event type on initial return of the data after the connection is acccepted
                    chatDispatch({type:"CHAT_LOADING_SUCCESS",payload:Event.data.contacts})
                    userContactsDispatch({type:'USERCONTACTS_LOADING_SUCCESS',payload:Event.data.user_contacts})
                    break;
                case 'CONTACTS_ADDED': // Event type after the contacts is added successfully
                    alert('Contacts added successfully')
                    console.log(Event.data)
                    chatDispatch({type:"ADD_CONTACT_TO_CHAT_STATE", payload: Event.data.to_chat_state})
                    userContactsDispatch({type: 'USERCONTACTS_ADDED', payload: Event.data.user_contacts})
                    break;
                case 'FAILED_ADDING_CONTACTS': // Event type returned if failed to add contacts
                    alert('Failed Adding Contact')
                    break
                case 'MESSAGE_RECEIVED': // Event type returned after the message is received
                    console.log("Message Delivered",Event.data)
                    chatDispatch({type:'UPDATE_GROUP_MESSAGE_ON_RECEIVE', payload: Event.data})
                default:
                    break;
            }

        }
    
        ws.current = socket
    
        return () => {
          socket.close()
        }
    },[])
    

    function AuthenticatedChatRoom({ref}){


        return (<>

        <div className="w-screen h-screen flex flex-col items-center justify-center bg-black relative">
            <div className="chatroom flex flex-row justify-start items-center rounded-md">
                <div className="h-full">
                    <SideBar/>
                </div>
                <div className="w-1/3 h-full bg-slate-900 flex flex-col relative">
                        <MessageBox showContacts={showContacts} setShowContacts={setShowContacts}/>
                        <ShowContacts ws={ws} showContacts={showContacts} setShowContacts={setShowContacts}/>
                </div>
                {msgViewState.show?(<>
                    <div className="w-2/3 h-full bg-gray-800 flex flex-col justify-end">
                        <MessageView ws={ws}/>
                    </div>
                </>):(<>
                    <div className="w-2/3 h-full bg-gray-800 text-slate-50 flex flex-col justify-center items-center">
                        <p>Your Messages Will Appear Here</p>
                    </div>
                </>)}

            </div>
        </div>

        </>)
    }



    return (
        <>
            {chatState.mobile?(<AuthenticatedChatRoom ref={ws}/>):(<p>Loading</p>)}
        </>
    )

}

export default Chat;
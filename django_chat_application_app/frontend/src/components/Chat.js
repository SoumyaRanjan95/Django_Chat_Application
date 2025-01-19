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
            switch(Event.type){
                case 'CHAT_LOADED':
                    chatDispatch({type:"CHAT_LOADING_SUCCESS",payload:Event.data.contacts})
                    userContactsDispatch({type:'USERCONTACTS_LOADING_SUCCESS',payload:Event.data.user_contacts})
                    break;
                case 'CONTACTS_ADDED':
                    alert('Contacts added successfully')
                    console.log(Event.data)
                    chatDispatch({type:"ADD_CONTACT_TO_CHAT_STATE", payload: Event.data.to_chat_state})
                    userContactsDispatch({type: 'USERCONTACTS_ADDED', payload: Event.data.user_contacts})
                    break;
                case 'FAILED_ADDING_CONTACTS':
                    alert('Failed Adding Contact')
                    break
                case 'MESSAGE_RECEIVED':
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
            {chatState.mobile?(<AuthenticatedChatRoom ref={ws}/>):(<p>404 Not Found</p>)}
        </>
    )

}

export default Chat;
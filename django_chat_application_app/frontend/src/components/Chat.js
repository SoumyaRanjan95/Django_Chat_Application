import React,{useState} from "react";

import MessageView from "./MessageView";
import MessageStack from "./MessageStack";
import SideBar from "./SideBar";
import ShowContacts from "./ShowContacts";

function Chat(){

    const dummyVar = true;
    const [showContacts, setShowContacts] = useState(false);



    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        +'/ws/chat/'
        + "user"
        +'/'
    );

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data)
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };



    // Functions

    /*                 <MessageStack/>
                <MessageView chatSocket={chatSocket} /> */
    return (
        <>
        <div className="chatroom flex flex-row justify-start items-center bg-indigo-300 rounded-md">
            <div className="h-full">
                <SideBar/>
            </div>
            <div className="w-1/3 h-full bg-rose-100 flex flex-col relative">
                    <MessageStack showContacts={showContacts} setShowContacts={setShowContacts}/>
                    <ShowContacts showContacts={showContacts} setShowContacts={setShowContacts}/>
            </div>
            {dummyVar?(<>
                <div className="w-2/3 h-full bg-green-100 flex flex-col justify-end">
                    <MessageView chatSocket={chatSocket} />
                </div>
            </>):(<>
                <div className="w-2/3 h-full bg-green-100 flex flex-col justify-center items-center">
                    <p>Your Messages Will Appera Here</p>
                </div>
            </>)}

        </div>
        </>
    )

}

export default Chat;
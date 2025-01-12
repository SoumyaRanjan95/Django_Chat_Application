import React,{useState} from "react";

function MessageView({chatSocket}){

    const [message, setMessage] = useState('');
    const img = false;

    function handleSubmitMessage(chatSocket){
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        setMessage('')
    }

    function MessageItem(){
        return(
            <>
            <div className="my-2 w-1/3 p-2 flex flex-col justify-start bg-indigo-100 rounded-md">
                <div className="p-1 w-full bg-indigo-200">
                    <p className="text-sm">This is a message</p>
                </div>
                <div className="w-full flex flex-row justify-end">
                    <p className="text-xs text-rose-600">10:34pm</p>
                </div>
            </div>
            </>
        )
    }

    return (
        <>
        <div className="p-2 w-full m-1 flex flex-row justify-start items-center">
            {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
            <p className="mx-4 text-xl font-bold m-2 ">Username</p>
        </div>
        <div className="w-full h-11/12 bg-rose-50 flex flex-col justify-center items-center overflow-y-scroll">
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>
                <MessageItem/>

        </div>
        <div className="w-full m-1 flex flex-row justify-center items-center">
                <input className="w-90p mx-1 p-2 indent-2 w-11/12 outline-none" type="text" placeholder="Enter Your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="w-10p mx-1 p-2 bg-indigo-300 rounded-md font-bold" onClick={() => handleSubmitMessage(chatSocket)}>Send</button>
        </div>
        </>
    )
}
export default MessageView;
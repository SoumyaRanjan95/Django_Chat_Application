import React,{useState, useContext,useRef, useEffect} from "react";
import { GlobalContext } from "../store";

function MessageView({ws}){

    const {msgViewState, msgViewDispatch} = useContext(GlobalContext);
    const {chatState, chatReducer} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);
    const img = false;


    function MessageItem({elem}){


        return(
            <>
            <div className={`w-full ${chatState.user == elem.from_user_id?'justify-start':'justify-end'} flex`}>
                <div className={`my-2 w-1/3 p-2 flex flex-col justify-start bg-indigo-100 rounded-md`}>
                    <div className="p-1 w-full bg-indigo-200">
                        <p className="text-sm">{elem.content}</p>
                    </div>
                    <div className="w-full flex flex-row justify-end">
                        <p className="text-xs text-rose-600">{new Date(elem.timestamp).toISOString()}</p>
                    </div>
                </div>
            </div>
            </>
        )
    }


    function MessageInput(){
        const [message, setMessage] = useState('');

        function handleSubmitMessage(){

            let from = msgViewState.viewContents.group_users.filter((elem) => elem['mobile'] == chatState.mobile)[0]['mobile']
            let to = msgViewState.viewContents.group_users.filter((elem) =>  elem['mobile'] != chatState.mobile)[0]['mobile']
            let group_name = msgViewState.viewContents.group_name

            const msg = {
                type:'chat.message',
                group_name: msgViewState.viewContents.group_name,
                data: {
                    to: to,
                    from_user: from, 
                    group_name: group_name,
                    content: message,
                    timestamp: new Date().toISOString(),
                }
            }
            ws.current?.send.bind(ws.current)(JSON.stringify(msg))
            console.log(msg)
            setMessage('')
        }
        return (<>

            <div className="w-full my-2 flex flex-row justify-center items-center bg-slate-100 absolute bottom-0">
                    <input className="w-3/4 mx-1 p-2 indent-2 outline-none" type="text" placeholder="Enter Your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className="w-1/4 mx-1 p-2 bg-indigo-300 rounded-md font-bold" onClick={() => handleSubmitMessage()}>Send</button>
            </div>
        </>)
    }


    let msglist = []
    if (msgViewState.viewContents.messages.length != 0){
        msglist = msgViewState.viewContents.messages.map((elem, index) => {
            return <MessageItem key={index} elem={elem}/>
        })
    }

    const containerRef = useRef(null);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [msglist]);

    let mobile = msgViewState.viewContents.group_users.filter((elem) => elem.mobile != chatState.mobile)[0]['mobile']
    let username = userContactsState.user_contacts.filter((elem) => elem.contact_mobile == mobile)[0]['contact_name']??"Anonymous";

    return (
        <>
        <div className="w-full h-full flex flex-col-reverse justify-start items-center relative">

            <div className="p-2 w-full my-1 flex flex-row justify-start items-center bg-indigo-100 absolute top-0">
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <p className="mx-4 text-xl font-bold m-2">{username}</p>
            </div>
            <div ref={containerRef} className="w-full my-2 mt-20 mb-16 bg-cyan-600 overflow-y-auto"> 
                <div className="w-full my-1 bg-slate-100 flex flex-col justify-end">
                    {msglist.length > 0?msglist:<></>}
                </div>
            </div>
            <MessageInput/>

        </div>
        </>
    )
}
export default MessageView;
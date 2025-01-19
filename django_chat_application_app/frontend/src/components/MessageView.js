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
            <div className={`w-full px-3 ${chatState.mobile == elem.from_user?'justify-end':'justify-start'} flex flex-row`}>
                <div className={`my-2 w-1/3 p-2 ${chatState.mobile == elem.from_user?'bg-green-800':'bg-gray-500'} flex flex-col justify-start rounded-md`}>
                    <div className={`p-1 w-full rounded-sm ${chatState.mobile == elem.from_user?'bg-green-950':'bg-gray-700'}`}>
                        <p className="text-sm text-slate-50">{elem.content}</p>
                    </div>
                    <div className="w-full flex flex-row justify-end">
                        <p className="text-xs text-slate-200">{new Date(elem.timestamp).toISOString().substring(0,10)+' '+new Date(elem.timestamp).toISOString().substring(11,16)}</p>
                    </div>
                </div>
            </div>
            </>
        )
    }


    function MessageInput(){
        const [message, setMessage] = useState('');

        function handleSubmitMessage(){

            if (message!=''){
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
            }

            setMessage('')
        }
        return (<>

            <div className="w-full my-2 flex flex-row justify-center items-center bg-gray-800 absolute bottom-0">
                    <input className="w-3/4 mx-1 p-2 indent-2 outline-none border-2 border-slate-600 rounded-md customized-input focus:text-slate-300" type="text" placeholder="Enter Your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className="w-1/4 mx-1 p-2 bg-slate-600 text-white border-2 border-slate-500 rounded-md font-bold hover:bg-slate-800" onClick={() => handleSubmitMessage()}>Send</button>
            </div>
        </>)
    }


    let msglist = [];
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

    function inUsersContacts(mobile){
        const user_contact_name = userContactsState.user_contacts.filter((elem) => elem.contact_mobile == mobile)[0]//['contact_name']
        if (user_contact_name == null){
            return [false, user_contact_name]
        }{
            return [true,user_contact_name['contact_name']]
        }
    }



    let mobile = msgViewState.viewContents.group_users.filter((elem) => elem.mobile != chatState.mobile)[0]['mobile']
    let [contact_exists,user_contact_name] = inUsersContacts(mobile)


    return (
        <>
        <div className="w-full h-full flex flex-col-reverse justify-start items-center relative">

            <div className="p-2 w-full flex flex-row justify-start items-center bg-slate-900 absolute top-0">
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <p className="mx-4 text-xl text-slate-50 font-bold m-2">{contact_exists?user_contact_name:mobile}</p>
            </div>

            <div ref={containerRef} className="w-full my-2 mt-20 mb-16 bg-gray-800 customized-scrollbar overflow-y-auto"> 
                <div className="w-full my-1 bg-gray-800 flex flex-col justify-end">
                    {msglist.length > 0?msglist:<></>}
                    {contact_exists?(<></>):(<>
                        <div className="w-full p-3 flex flex-col justify-center items-center">
                            <p className=" p-2 text-slate-200"> This message was send by someone not in your Contacts</p>
                            <div className="w-full flex flex-row justify-center items-center p-2 ">
                                <button class='p-3 bg-green-700 text-base font-bold text-slate-100 rounded-md mx-3 hover:bg-green-800 transition-all'>Add</button>
                                <button class='p-3 bg-red-700 text-base font-bold text-slate-100 rounded-md mx-3 hover:bg-red-800 transition-all'> Remove</button>

                            </div>
                        </div>
                    </>)}
                </div>
            </div>
            <MessageInput/>

        </div>
        </>
    )
}
export default MessageView;
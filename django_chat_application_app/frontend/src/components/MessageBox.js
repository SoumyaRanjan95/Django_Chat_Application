import React,{useContext, useState} from "react";
import { useNavigate } from "react-router-dom";


import ShowContacts from "./ShowContacts";
import { logout } from "../store/action/action";
import { GlobalContext } from "../store";


function MessageBox({showContacts,setShowContacts}){


    const [showDropDown,setShowDropDown] = useState(false);
    const navigate = useNavigate();
    const {authDispatch} = useContext(GlobalContext);
    const {chatState, chatDispatch} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);
    const {msgViewState, msgViewDispatch} = useContext(GlobalContext);

    console.log(chatState)
    function handleShowContacts(){
        setShowContacts(!showContacts)
    }

    function handleShowDropDown(){
        setShowDropDown(!showDropDown);
    }

    function handleShowMessageView(elem){
        msgViewDispatch({type:'REMOVE_CONTENT'})
        msgViewDispatch({type:'LOAD_CONTENT',payload: elem})
    }

    async function handleLogout(){
        // Handle Logout logic
        const logoutAction = logout(authDispatch)
        logoutAction()
        .then((response) => {
            if(response.status !== 204){
                throw new Error(`HTTP Error : ${response.status}`)
            }
            authDispatch({type:'LOGOUT'})
            chatDispatch({type:'CHAT_LOADING_ERROR'})
            userContactsDispatch({type:'USERCONTACTS_ERROR'})
            navigate('/login-site/')

        })
        .catch((error) => {
            console.error(`${error}`)
        })
    }


    function ShowMoreDropDown(){

        return(<>
            {showDropDown?(<>
                <div className="show-dropdown flex flex-col justify-evenly items-start bg-black text-slate-50 absolute top-8 right-4 z-10 rounded-sm overflow-hidden cursor-pointer">
                    <p onClick={handleLogout} className="w-full p-1 px-3 text-left cursor-pointer">Log Out</p>
                    <p className="w-full p-1 px-3 text-left cursor-pointer">Some Option</p>
                    <p className="w-full p-1 px-3 text-left cursor-pointer">Other Option</p>
                </div>
            </>):(<>

                <></>
            </>)}
        </>)
    }

    function MessageStackItem({elem}){

        const img = false
        const mobile = elem.group_users.filter((elem) => elem.mobile != chatState.mobile)[0]['mobile']
        const user_contact_name = userContactsState.user_contacts.filter((elem) => elem.contact_mobile == mobile)[0]['contact_name']
        const messages = elem.messages
        return (
            <>
            <div className="p-2 w-full flex flex-row justify-start items-center  border-b-2 border-black" onClick={() => handleShowMessageView(elem)}>
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-2 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-rose-600 font-bold">{user_contact_name}</p>
                    <p className="text-indigo-600 text-sm">{messages.length > 0 ?messages.slice(-1)[0].content:<></>}</p>
                </div>
                <div className="h-full m-1 flex flex-col justify-center items-start">
                    <p className="text-xs">{messages.length > 0 ?messages.slice(-1)[0].timestamp:<></>}</p>
                    <p className="text-xs">10:34pm</p>
                </div>
            </div>
            </>
        )
    }

    function MessageStack(){
        let msgItems = [];

        if (chatState.contacts.length != 0){
            if(userContactsState.user_contacts.length !=0){
                msgItems = chatState.contacts.map((elem, index) => {
                    return <MessageStackItem key={index} elem={elem}/>
                })
            }
    
        }
        return(<>
                {msgItems}
        </>)
    }




    return(
        <>
            <div className="p-3 my-3 w-full flex flex-row">
                    <p className="text-xl font-bold">Chats</p>
                    <div className=" w-full flex flex-row justify-end items-center">
                        <i onClick={handleShowContacts} className="material-icons cursor-pointer mx-2">add</i>
                        <div className="relative">
                            <i onClick={handleShowDropDown} className="material-icons cursor-pointer p-1 mx-1 rounded-full hover:bg-indigo-300">more_vert</i>
                            <ShowMoreDropDown/>
                        </div>
                    </div>
            </div>
            <div className="w-full h-full flex flex-col justify-start items-start overflow-y-scroll">
                {chatState.contacts !=0?(<>
                    <MessageStack/>
                </>):(<>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <p>No Messages to to Show</p>
                    </div>
                </>)}
            </div>
        </>
    )
}

export default MessageBox;
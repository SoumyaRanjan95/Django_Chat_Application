import React,{useContext, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";


import ShowContacts from "./ShowContacts";
import { logout } from "../store/action/action";
import { GlobalContext } from "../store";


function MessageBox({showContacts,setShowContacts}){


    const navigate = useNavigate();
    const {authDispatch} = useContext(GlobalContext);
    const {chatState, chatDispatch} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);
    const {msgViewState, msgViewDispatch} = useContext(GlobalContext);

    let dropdownRef = useRef(null);
    const [showDropDown,setShowDropDown] = useState(false);

    useEffect(() => {

        // Close the dropdown if there is a click event outside the dropdown component
        const closeDropDown = (e) =>{
            const contgt1 = dropdownRef.current.contains(e.target) 
            if(!contgt1){
                setShowDropDown(false)
            }            
        }
        document.body.addEventListener('click',closeDropDown);

        return () => document.body.removeEventListener('click',closeDropDown)
    },[])

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
            window.location.replace(`${process.env.APP_URL}/login/`)

        })
        .catch((error) => {
            console.error(`${error}`)
        })
    }

    function ShowMoreDropDown(){

        return(<>
            {showDropDown?(<>
                <div className="show-dropdown flex flex-col justify-evenly items-start bg-slate-800 text-slate-50 absolute top-8 right-4 z-10 rounded-sm overflow-hidden cursor-pointer">
                    <p onClick={handleLogout} className="w-full p-1 px-3 text-left text-sm cursor-pointer">Log Out</p>
                    <p onClick={''} className="w-full p-1 px-3 text-left text-sm cursor-pointer">Lock Screen</p>
                </div>
            </>):(<>

                <></>
            </>)}
        </>)
    }

    function MessageStackItem({elem}){

        function inUsersContacts(elem,mobile){
            const user_contact_name = userContactsState.user_contacts.filter((elem) => elem.contact_mobile == mobile)[0]//['contact_name']
            if (user_contact_name == null){
                return [false, user_contact_name]
            }{
                return [true,user_contact_name['contact_name']]
            }
        }

        const img = false
        const mobile = elem.group_users.filter((elem) => elem.mobile != chatState.mobile)[0]['mobile']
        let [contact_exists,user_contact_name] = inUsersContacts(elem,mobile)
        const messages = elem.messages
        return (
            <>
            <div className="p-2 my-1 w-full flex flex-row justify-start items-center" onClick={() => handleShowMessageView(elem)}>
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-5 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-white font-bold">{contact_exists?user_contact_name:mobile}</p>
                    <p className="text-slate-200 text-sm">{messages.length > 0 ?messages.slice(-1)[0].content:<></>}</p>
                </div>
                <div className="h-full m-1 flex flex-col justify-center items-start">
                    <p className="text-xs text-slate-200">{messages.length > 0 ?new Date(messages.slice(-1)[0].timestamp).toISOString().substring(0,10):<></>}</p>
                    <p className="text-xs text-slate-200">{messages.length > 0 ?new Date(messages.slice(-1)[0].timestamp).toISOString().substring(11,16):<></>}</p>
                </div>
            </div>
            </>
        )
    }

    function MessageStack(){
        let msgItems = [];

        function partition(arr, low, high){
            let pivot = arr[high]
            let i = low - 1
        
            for(let j=low;j<high;j++){
                if(arr[j].last_message_time > pivot.last_message_time){
                    i = i + 1
                    let temp = arr[i]
                    arr[i] = arr[j]
                    arr[j] = temp
                }
            }
            i = i + 1
            let temp = arr[i]
            arr[i] = pivot
            arr[high]=temp
        
            return i
        }
        
        function quick_sort(arr, low, high){
            if(low<high){
                let pidx = partition(arr,low,high)
                quick_sort(arr,low,pidx-1)
                quick_sort(arr,pidx+1,high)
            }
        }

        if (chatState.contacts.length != 0){
            if(userContactsState.user_contacts.length !=0){
                quick_sort(chatState.contacts,0, chatState.contacts.length - 1)
                msgItems = chatState.contacts.map((elem, index) => {
                    if (elem.messages.length !=0){
                        return <MessageStackItem key={index} elem={elem}/>
                    }else{
                        return
                    }
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
                    <p className="text-xl font-bold  text-slate-50">Chats</p>
                    <div className=" w-full flex flex-row justify-end items-center">
                        <i onClick={handleShowContacts} className="material-icons cursor-pointer mx-2 p-1 rounded-full text-slate-50 hover:bg-slate-300 hover:text-black">add</i>
                        <div className="relative">
                            <i ref={dropdownRef}  onClick={handleShowDropDown} className="material-icons cursor-pointer p-1 mx-1 rounded-full text-slate-50 hover:bg-slate-300 hover:text-black">more_vert</i>
                            <ShowMoreDropDown/>
                        </div>
                    </div>
            </div>
            <div className="w-full h-full flex flex-col justify-start items-start customized-scrollbar overflow-y-scroll">
                {chatState.contacts !=0?(<>
                    <MessageStack/>
                </>):(<>
                    <div className="w-full h-full flex flex-col justify-center items-center text-slate-50">
                        <p>No Messages to to Show</p>
                    </div>
                </>)}
            </div>
        </>
    )
}

export default MessageBox;
import React,{useState} from "react";
import { useNavigate } from "react-router-dom";


import ShowContacts from "./ShowContacts";


function MessageStack({showContacts,setShowContacts}){


    const [showDropDown,setShowDropDown] = useState(false);
    const navigate = useNavigate();
    

    function handleShowContacts(){
        setShowContacts(!showContacts)
        document.getElementById('show-contact').style = `${showContacts?'display:flex;':'display:none;'}`;
        alert(showContacts)
    }

    function handleShowDropDown(){
        setShowDropDown(!showDropDown);
    }

    function handleLogout(){
        // Handle Logout logic
        navigate('/')
    }


    function ShowMoreDropDown(){

        return(<>
            {showDropDown?(<>
                <div className="show-dropdown flex flex-col justify-evenly items-start bg-black text-slate-50 absolute top-8 right-4 z-10 rounded-sm overflow-hidden">
                    <p onClick={handleLogout} className="w-full p-1 px-3 text-left cursor-pointer">Log Out</p>
                    <p className="w-full p-1 px-3 text-left cursor-pointer">Some Option</p>
                    <p className="w-full p-1 px-3 text-left cursor-pointer">Other Option</p>
                </div>
            </>):(<>

                <></>
            </>)}
        </>)
    }

    function MessageStackItem({from, message}){

        const img = false
        
        return (
            <>
            <div className="p-2 w-full flex flex-row justify-start items-center  border-b-2 border-black">
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-2 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-rose-600 font-bold">{from}</p>
                    <p className="text-indigo-600 text-sm">{message.length < 20 ?message:message.slice(0,20)+'...'}</p>
                </div>
                <div className="h-full m-1 flex flex-col justify-center items-start">
                    <p className="text-xs">Tue,19</p>
                    <p className="text-xs">10:34pm</p>
                </div>
            </div>
            </>
        )
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
                <MessageStackItem from={"Usernamesdsd"} message={"Some"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>
                <MessageStackItem from={"Usernamesdsd"} message={"Some Random Logn jlkasalksalskalskalskalskalskalskalska"}/>

            </div>
        </>
    )
}

export default MessageStack;
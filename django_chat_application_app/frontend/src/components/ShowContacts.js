import React, { useState } from "react";


function ShowContacts({showContacts,setShowContacts}){

    const [popUp,setPopUp] = useState(false);

    function handleClose(){
        setShowContacts(!showContacts)
    }

    function handleAddContactPopUp(){
        setPopUp(!popUp)
    }


    function AddContact(){

        return(
            <>
                <div className="fixed w-full h-full top-0 left-0 flex flex-col items-center justify-center z-50 bg-black">
                <div className="p-6 w-1/3 flex flex-col justify-center items-start bg-slate-100 rounded-md">
                        <div className="p-2 w-full flex flex-row justify-between items-center bg-slate-200">
                            <p className="text=xl font-bold">Add Contact</p>
                            <i onClick={handleAddContactPopUp} className="material-icons cursor-pointer">close</i>
                        </div>
                        <form className="p-2 w-full flex flex-col justify-center items-center">
                            <input className="py-2 my-1 w-full indent-2" type="text" name="fullname" placeholder="Name" required></input>
                            <input className="py-2 my-1 w-full indent-2" type="text" name="mobile" placeholder="Mobile Number" required></input>
                            <input className="py-2 my-1 w-full bg-indigo-300 rounded-md font-bold" type="submit" value="Add"/>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    function ContactHeaders(){
        return(
            <>
            <div className={`w-full flex flex-row justify-start bg-cyan-100`}>
                    <p className={`w-full text-xl font-bold p-2 my-2`}>Contacts</p>
                    <i onClick={handleClose} className="material-icons p-2 my-2 cursor-pointer">arrow_back</i>
            </div>
            <div className="w-full flex flex-row justify-start items-center">
                    <i onClick={handleAddContactPopUp} className="material-icons p-2 mx-3 cursor-pointer rounded-full text-green=300 bg-slate-50">person_add</i>
                    <p className="text-slate-300 text-center p-2 my-2">Add Contact</p>
                    {popUp?(<AddContact/>):(<></>)}
            </div>
            <div className="w-full flex flex-row justify-start">
                    <input className="w-full indent-2 outline-none" placeholder="Search"/>
                    <i className="material-icons p-2 cursor-pointer text-green=300 bg-slate-50">search</i>
            </div>
            </>
        )
    }

    function ContactItem({user}){

        const img = false
        
        return (
            <>
            <div className="p-2 w-full flex flex-row justify-start items-center  border-b-2 border-black">
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-2 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-rose-600 font-bold">{user}</p>
                </div>
            </div>
            </>
        )
    }

    return(
        <div className={`${showContacts?'show-contact':'hide-contact'} h-full flex flex-col justify-start items-center z-10 absolute top-0 left-0 bg-black`}>
            <div className="w-full flex flex-col justify-start items-start overflow-y-scroll">
                <ContactHeaders/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
                <ContactItem user={"User -GenzX"}/>
            </div>            
        </div>
    )
}


export default ShowContacts;
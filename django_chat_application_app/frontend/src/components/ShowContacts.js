import React, { useState, useContext } from "react";
import { GlobalContext } from "../store";

function ShowContacts({ws,showContacts,setShowContacts}){

    const [popUp,setPopUp] = useState(false);
    const {chatState, chatReducer} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);



    function handleClose(){
        setShowContacts(!showContacts)
    }

    function handleAddContactPopUp(){
        setPopUp(!popUp)
    }



    function AddContact(){

        // If the state is mentioned outside the AddContact Component it caused the entire ShowContact component to re-render
        // But we only want Add Contact to re-render therefore we place it here.
        const [contact, setContact] = useState({
            name : '',
            mobile : '',
        })

        const handleAddContact = (e) => {
            const {name, value} = e.target;
            setContact({...contact,[name]:value})
        }

        async function handleAddContactSubmit(){
            // Sending add-contact through http wont be immediately reflected

            const msg = {
                type:'chat.add_contact',
                group_name: chatState.user_group_name,
                data: {
                    name:contact.name,
                    mobile:contact.mobile,
                }
            }
            ws.current?.send.bind(ws.current)(JSON.stringify(msg))
           setContact({...contact,name:'',mobile:''})
        }

        return(
            <>
                <div className="fixed w-full h-full top-0 left-0 flex flex-col items-center justify-center z-50 bg-black">
                <div className="p-6 w-1/3 flex flex-col justify-center items-start bg-slate-100 rounded-md">
                        <div className="p-2 w-full flex flex-row justify-between items-center bg-slate-200">
                            <p className="text=xl font-bold">Add Contact</p>
                            <i onClick={handleAddContactPopUp} className="material-icons cursor-pointer">close</i>
                        </div>
                        <div className="p-2 w-full flex flex-col justify-center items-center">
                            <input key='name' className="py-2 my-1 w-full indent-2" type="text" name="name" placeholder="Name" value={contact.name} onChange={handleAddContact} required></input>
                            <input key='mobile'className="py-2 my-1 w-full indent-2" type="text" name="mobile" placeholder="Mobile Number" value={contact.mobile} onChange={handleAddContact} required></input>
                            <button key='add' className="py-2 my-1 w-full bg-indigo-300 rounded-md font-bold" onClick={handleAddContactSubmit}>Add</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function ContactHeaders(){

        const [searchContact, setSearchContact] = useState('');


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
                    <input value={searchContact} onChange={(e) => setSearchContact(e.target.value)}  className="w-full indent-2 outline-none" placeholder="Search"/>
                    <i className="material-icons p-2 cursor-pointer text-green=300 bg-slate-50">search</i>
            </div>
            </>
        )
    }

    function ContactItem({elem}){

        const img = false
        
        return (
            <>
            <div className="p-2 w-full flex flex-row justify-start items-center  border-b-2 border-black">
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-2 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-rose-600 font-bold">{elem.contact_name}</p>
                </div>
            </div>
            </>
        )
    }

    let contactItems = [];

    if (userContactsState.user_contacts.length != 0){
        contactItems = userContactsState.user_contacts.map((elem, index) => {
            return <ContactItem key={index} elem={elem}/>
        })
    }


    return(
        <div className={`${showContacts?'show-contact':'hide-contact'} h-full flex flex-col justify-start items-center z-10 absolute top-0 left-0 bg-slate-50`}>
            <div className="w-full h-full flex flex-col justify-start items-start no-scrollbar overflow-y-scroll">
                <ContactHeaders/>
                {contactItems.length > 0 ?(<>
                        {contactItems}

                </>):(<>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <p>No Contacts to Show</p>
                    </div>

                </>)}

            </div>            
        </div>
    )
}


export default ShowContacts;
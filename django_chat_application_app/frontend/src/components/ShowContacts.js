import React, { useState, useContext, useEffect, useRef } from "react";
import { GlobalContext } from "../store";

function ShowContacts({ws,showContacts,setShowContacts}){

    const [popUp,setPopUp] = useState(false);
    const {chatState, chatReducer} = useContext(GlobalContext);
    const {userContactsState, userContactsDispatch} = useContext(GlobalContext);
    const {msgViewState, msgViewDispatch} = useContext(GlobalContext);

    function handleClose(){
        setShowContacts(!showContacts)
    }

    function handleAddContactPopUp(){
        setPopUp(!popUp)
    }

    function handleShowMessageView(contactItem){
        console.log(contactItem)
        let data = chatState.contacts.filter((chatElem) => {
            let other_user = chatElem.group_users.filter((elem) => elem.mobile == contactItem.contact_mobile)[0]
            if(other_user != null){
                return chatElem
            }
        })[0]
        console.log("This is data",data)
        msgViewDispatch({type:'REMOVE_CONTENT'})
        msgViewDispatch({type:'LOAD_CONTENT',payload: data})
    }


    function AddContact(){

        const [contact, setContact] = useState({
            name : '',
            mobile : '',
        })

        const handleAddContact = (e) => {
            const {name, value} = e.target;
            setContact({...contact,[name]:value})
        }

        async function handleAddContactSubmit(){

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
                <div className="p-6 w-1/3 flex flex-col justify-center items-start bg-slate-800 rounded-md">
                        <div className="p-2 w-full flex flex-row justify-between items-center">
                            <p className="text=xl font-bold text-slate-200">Add Contact</p>
                            <i onClick={handleAddContactPopUp} className="material-icons cursor-pointer text-slate-50">close</i>
                        </div>
                        <div className="p-2 w-full flex flex-col justify-center items-center">
                            <input key='name' className="py-2 my-1 w-full indent-2 border-2 border-slate-500 rounded-md customized-input focus:text-slate-300" type="text" name="name" placeholder="Name" value={contact.name} onChange={handleAddContact} required></input>
                            <input key='mobile'className="py-2 my-1 w-full indent-2 border-2 border-slate-500 rounded-md customized-input focus:text-slate-300" type="text" name="mobile" placeholder="Mobile Number" value={contact.mobile} onChange={handleAddContact} required></input>
                            <button key='add' className="py-2 my-1 w-full bg-slate-600 text-white border-2 border-slate-500 rounded-md font-bold hover:bg-slate-800" onClick={handleAddContactSubmit}>Add</button>
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
            <div className={`w-full flex flex-row justify-start my-2`}>
                    <p className={`w-full text-xl font-bold p-2 mx-3 text-slate-50 border-b-2 border-slate-600`}>Contacts</p>
                    <i onClick={handleClose} className="material-icons p-2  cursor-pointer text-slate-50">arrow_back</i>
            </div>
            <div className="w-full flex flex-row justify-start items-center my-2">
                    <i onClick={handleAddContactPopUp} className="material-icons p-2 mx-3 cursor-pointer rounded-full text-slate-300 bg-slate-800">person_add</i>
                    <p className="text-slate-50 text-center p-2 my-2">Add Contact</p>
                    {popUp?(<AddContact/>):(<></>)}
            </div>
            <div className="w-full flex flex-row justify-start p-2 mb-3">
                    <input value={searchContact} onChange={(e) => setSearchContact(e.target.value)}  className="w-full mx-2 p-1 indent-2 customized-input focus:text-slate-300 outline-none" placeholder="Search"/>
                    <i className="material-icons p-1 mx-3 cursor-pointer text-slate-300 text-center">search</i>
            </div>
            </>
        )
    }

    function ContactItem({elem}){

        const img = false
        
        return (
            <>
            <div className="p-2 mx-3 w-full flex flex-row justify-start items-center my-2" onClick={()=>handleShowMessageView(elem)}>
                {img?(<><img className="" src=""/></>):(<i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>)}
                <div className="mx-4 w-full flex flex-col justify-start items-start rounded-sm cursor-pointer">
                    <p className="text-slate-50 font-bold">{elem.contact_name}</p>
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
        <div className={`${showContacts?'show-contact':'hide-contact'} h-full flex flex-col justify-start items-center z-10 absolute top-0 left-0 bg-slate-900`}>
            <div className="w-full h-full flex flex-col justify-start items-start no-scrollbar overflow-y-scroll">
                <ContactHeaders/>
                {contactItems.length > 0 ?(<>
                        {contactItems}

                </>):(<>
                    <div className="w-full h-full flex flex-col justify-center items-center text-slate-50">
                        <p>No Contacts to Show</p>
                    </div>

                </>)}

            </div>            
        </div>
    )
}


export default ShowContacts;
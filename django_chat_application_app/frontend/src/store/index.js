import React, {createContext, useContext, useReducer} from "react";
import { authReducer,
         registerReducer,
         chatReducer,
         userContactsReducer,
         msgViewReducer,
} from "./reducers/reducers";


const initialAuthState = {
    mobile: null,
    name: null,
    token: null,
    loading: false,
    error: null,
}

const initialRegisterState = {
    processing: false,
    success: false,
}


const initiaChatState = {
    id: null,
    user: null,
    name:null,
    mobile: null,
    user_group_name: null,
    contacts:[],
    loading: false,
    error: false,
}

const intialUserContactsState= {
    user_contacts: [],
    loading: false,

}

const initialMsgViewState = {
    show: false,
    viewContents:[],
}

 
export const GlobalContext = createContext();

const GlobalProvider = ({children}) => {

    const [authState, authDispatch] = useReducer(authReducer,initialAuthState)
    const [registerState, registerDispatch] = useReducer(registerReducer, initialRegisterState)
    const [chatState, chatDispatch] = useReducer(chatReducer, initiaChatState)
    const [userContactsState, userContactsDispatch] = useReducer(userContactsReducer, intialUserContactsState)
    const [msgViewState, msgViewDispatch] = useReducer(msgViewReducer, initialMsgViewState)

    return <GlobalContext.Provider value={{
        authState: authState,
        authDispatch: authDispatch,
        registerState:registerState,
        registerDispatch:registerDispatch,
        chatState:chatState,
        chatDispatch:chatDispatch,
        userContactsState:userContactsState,
        userContactsDispatch:userContactsDispatch,
        msgViewState: msgViewState, 
        msgViewDispatch: msgViewDispatch,
    }}>
        {children}
    </GlobalContext.Provider>

}

export default GlobalProvider;
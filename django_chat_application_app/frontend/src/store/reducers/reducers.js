

export function authReducer(state, action) {
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return { ...state, loading: true, error: null };
      case 'LOGIN_SUCCESS':
        return { ...state, loading: false, mobile: action.payload.mobile, token: action.payload.token, name:action.payload.name };
      case 'LOGIN_FAILURE':
        return { ...state, mobile: null, token:null, name:null, loading: false, error: action.payload };
      case 'LOGOUT':
        return { ...state, mobile: null, token: null, name:null, loading: false, error: null};
      default:
        return state;
    }
  }


export function registerReducer(state, action){

  switch(action.type){
    case 'REGISTER_REQUEST':
      return {
        ...state,processing: true
      }
      case 'REGISTER_SUCCESS':
        return {
          ...state,processing: false,success: true
      }
      case 'REGISTER_FAILURE':
        return {
          ...state,processing: false,success: false
      }
  }
}

export function chatReducer(state, action){

  switch(action.type){
    case 'CHAT_LOADING':
      return {
        ...state,loading: true
      }
    case 'ADD_CONTACT_TO_CHAT_STATE':
      return {
        ...state,
        contacts: [...state.contacts, action.payload],

      }

    case 'CHAT_LOADING_SUCCESS':
      console.log("From reducer chat loaded successfully")
      return {
        ...state,
        id: action.payload.id,
        user: action.payload.user,
        name:action.payload.name,
        mobile: action.payload.mobile,
        user_group_name: action.payload.user_group_name,
        contacts:action.payload.contacts,
        loading: false,
        error: false,
    }
    case 'UPDATE_GROUP_MESSAGE_ON_RECEIVE':

      let filteredOut = [...state.contacts.filter((elem) =>elem.group_name != action.payload.group_name)]
      let top = [...state.contacts.filter((elem) =>elem.group_name == action.payload.group_name)][0]
      top.messages.push(action.payload)
      top.last_message_time = action.payload.timestamp

      console.log("New array from reducer : ", [top, ...filteredOut])
      return {
        ...state,
        contacts:[top, ...filteredOut],
      }
    case 'CHAT_LOADING_ERROR':
      return {
        ...state,
        id: null,
        user: null,
        name: null,
        mobile: null,
        user_group_name: null,
        contacts:[],
        loading: false,
        error: false,
    }
  }
}


export function userContactsReducer(state, action){
  switch(action.type){
    case 'USERCONTACTS_LOADING':
      return {
        ...state,loading: true
      }
      case 'USERCONTACTS_LOADING_SUCCESS':
        return {
          ...state,
          user_contacts: action.payload,
          loading: false,
      }
      case 'USERCONTACTS_ADDED':
        return {
          ...state,
          user_contacts: [ ...state.user_contacts, action.payload],
          loading: false,
      }
      case 'USERCONTACTS_ERROR':
        return {
          ...state,
          user_contacts: [],
          loading: false,
      }
  }
}


export function msgViewReducer(state,action){
  switch(action.type){
    case 'LOAD_CONTENT':
        return {
          ...state,
          show: true,
          viewContents: action.payload,
      }
      case 'REMOVE_CONTENT':
        return {
          ...state,
          show: false,
          viewContents:[],
      }
  }
}
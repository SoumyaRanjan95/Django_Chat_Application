import { data } from "react-router";


export const login = (dispatch) => async (credentials) => {

    dispatch({type:"LOGIN_REQUEST"})



    const URL = `${process.env.APP_URL}/api/login/`;
    return fetch(URL, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then((response) =>{
        if(!response.ok){
            throw new Error(`HTTP Error : ${response.status}`)
        }
        return response.json()
    })
}



export const register = (dispatch) => async (signUpData) => {
    dispatch({type:"REGISTER_REQUEST"})

    try{

        const URL = `${process.env.APP_URL}/api/register/`;
        fetch(URL, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signUpData)
        })
        .then((response) => {
            if(response.status !== 201){
                throw new Error(`HTTP Error : ${response.status}`)
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            if(data.mobile){
                dispatch({type:'REGISTER_SUCCESS', payload: data})
                alert("Registration Successful...")
            }
        })
        .catch((error) => {
            console.error(`${error}`)
            dispatch({type:'REGISTER_FAILURE', payload: error})

        })


    }catch(error){
        console.log(error)
    }

}

export const logout = (dispatch) => async () => {


    try{

        const URL = `${process.env.APP_URL}/api/logout/`;
        return fetch(URL, {
            method: 'GET',
        })



    }catch(error){
        console.log(error)
    }


}


export const addcontact = () => async (contactData) =>{
    try{
        
        const URL = `${process.env.APP_URL}/api/add-contact/`;
        return fetch(URL, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        })

    }catch(error){
        console.log(error)
    }
}
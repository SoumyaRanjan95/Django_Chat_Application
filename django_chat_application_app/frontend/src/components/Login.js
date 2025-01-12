import React,{ useState } from "react";
import { Link } from "react-router";
function Login(){

    const [inputValue, setInputValue] = useState({mobile:"",password:""})

    function handleSubmit(){
        
    }

    function handleChange(){

    }


    return (
        <>
        <div className="p -6 w-screen h-screen flex flex-col justify-center items-center backdrop-blur-sm rounded-md">
            <Link className="p-3 bg-white text-base font-bold text-indigo-600 rounded-md mx-3 hover:text-indigo-800 hover:bg-slate-200 transition-all absolute top-0 left-0" to={'/'}>Home</Link>

            <div className="p-6 w-2/5 flex flex-col justify-center items-start bg-slate-100">
                <h5 className="p-2">Login</h5>
                <p className="p-2">Mobile Number</p>
                <form className="p-2 w-full flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                    <input className="py-2 my-1 w-full indent-2" type="text" name="mobile" value={inputValue.mobile} onChange={handleChange} placeholder="Enter you Number"></input>
                    <input className="py-2 my-1 w-full indent-2" type="password" name="password" value={inputValue.password} onChange={handleChange} placeholder="Enter Password" required></input>
                    <input className="py-2 my-1 w-full indent-2 bg-indigo-300 rounded-md font-bold" type="submit" value="Submit"/>
                </form>
            <div className="p-2">
                <p>Don't have an Account <Link className="text-rose-600 font-bold"  to={'/register/'}>Sign Up</Link></p>
            </div>
            </div>
        </div>
        </>
    )
}

export default Login;
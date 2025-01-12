import React,{useState} from "react";
import { Link } from "react-router";
function Register(){

    
        const [signUpData, setSignUpData] = useState({mobile:"", fullname:"",password:""})
        const [passwd2, setPasswd2] = useState("")

    
        const handleChange = (e) => {
            const { name, value } = e.target;
    
            setSignUpData({...signUpData,[name]: value})
        }
    
        const handleSubmit = (e) => {
            e.preventDefault();
    
            if(passwd2 == signUpData.password){
    
            }else{
            }
            setSignUpData({mobile:"", fullname:"",password:""})
            setPasswd2("")            
    
        }
    

    return (
        <>


                <div className="p -6 w-screen h-screen flex flex-col justify-center items-center backdrop-blur-sm rounded-md">
                    <Link className="p-3 bg-white text-base font-bold text-indigo-600 rounded-md mx-3 hover:text-indigo-800 hover:bg-slate-200 transition-all absolute top-0 left-0" to={'/'}>Home</Link>
        
                    <div className="p-6 w-2/5 flex flex-col justify-center items-start bg-slate-100">
                        <h5 className="p-2">Register</h5>
                        <form className="p-2 w-full flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                            <input className="py-2 my-1 w-full indent-2" type="text" name="mobile" value={signUpData.mobile} onChange={handleChange} placeholder="Enter you Mobile Number" required></input>
                            <input className="py-2 my-1 w-full indent-2" type="text" name="fullname" value={signUpData.fullname} onChange={handleChange} placeholder="Enter you Name" required></input>
                            <input className="py-2 my-1 w-full indent-2" type="password" name="password" value={signUpData.password} onChange={handleChange} placeholder="Enter Password" required></input>
                            <input className="py-2 my-1 w-full indent-2" type="password" name="passwd2" value={passwd2} onChange={(e) => setPasswd2(e.target.value)} placeholder="Re-Enter Password" required></input>
                            <input className="py-2 my-1 w-full bg-indigo-300 rounded-md font-bold" type="submit" value="Register"/>
                        </form>
                    <div className="p-2">
                        <p className="">Don't have an Account <Link className="text-rose-600 font-bold" to={'/login/'}>Login</Link></p>
                    </div>
                    </div>
                </div>
        </>
    )
}

export default Register;
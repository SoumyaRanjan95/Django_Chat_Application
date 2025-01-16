import React, { useContext, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  function handleLogin(){
    navigate('/login-site/');
  }
  function handleRegister(){
    navigate('/register-site/');
  }

  return (
    <>
        <section className="w-screen h-screen flex flex-col justify-center">
            <nav className="w-full p-3 flex flex-row justify-end">
              <button className="p-3 bg-white text-base font-bold text-indigo-600 rounded-md mx-3 hover:text-indigo-800 hover:bg-slate-200 transition-all" onClick={handleLogin}>Login</button>
              <button className='p-3 bg-white text-base font-bold text-indigo-600 rounded-md mx-3 hover:text-indigo-800 hover:bg-slate-200 transition-all' onClick={handleRegister}>Register</button>
            </nav>
            <div className="w-full h-4/5  flex flex-row justify-center items-center">
              <p> Django Chat Application</p>
            </div>
            <footer className="w-full h-1/5  flex flex-row justify-center items-end">
              <p>Made with React, Django and Love</p>
            </footer>
        </section>
    </>
  );
}


 


export default App;

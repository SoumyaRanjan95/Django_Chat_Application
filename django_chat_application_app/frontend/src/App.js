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
        <section className="w-screen h-screen flex flex-col justify-center bg-green-900">
            <nav className="w-full p-3 flex flex-row justify-end">
              <button className="p-3 bg-green-800 text-base font-bold text-slate-100 rounded-md mx-3 hover:text-green-700 hover:bg-slate-200 transition-all" onClick={handleLogin}>Login</button>
              <button className='p-3 bg-green-800 text-base font-bold text-slate-100 rounded-md mx-3 hover:text-green-700 hover:bg-slate-200 transition-all' onClick={handleRegister}>Register</button>
            </nav>
            <div className="w-full h-4/5 text-5xl text-slate-50 bg-green-900  flex flex-row justify-center items-center">
              <p> Django Chat Application</p>
            </div>
            <footer className="w-full h-1/5 text-sm text-slate-50 bg-green-900 py-2 flex flex-row justify-center items-end">
              <p>Made with React, Django and Love <span className="text-xl">&#x1F496;</span></p>
            </footer>
        </section>
    </>
  );
}


 


export default App;

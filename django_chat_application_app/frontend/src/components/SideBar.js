import React from "react";

function SideBar(){

    return(
        <>
        <div className="h-full w-16 bg-gray-800 flex flex-col items-center">

            <div className="flex flex-col items-center my-3">
                <i className="material-icons my-2 p-1 rounded-full text-slate-50 hover:bg-slate-300 hover:text-black cursor-pointer">menu</i>
                <i className="material-icons my-2 p-1 rounded-full text-slate-50 hover:bg-slate-300 hover:text-black">notifications</i>
            </div>

            <div className="flex flex-col items-center my-3 absolute bottom-0">
                <i className="material-icons my-2 p-1 rounded-full text-slate-50 hover:bg-slate-300 hover:text-black cursor-pointer">settings</i>
                <i className="material-icons rounded-full text-5xl cursor-pointer text-slate-50 bg-slate-800">account_circle</i>
            </div>


        </div>
        </>
    )
}

export default SideBar;
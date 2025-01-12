import React from "react";

function SideBar(){

    return(
        <>
        <div className="h-full w-16 bg-green-300 flex flex-col items-center">

            <div className="flex flex-col items-center my-3">
                <i className="material-icons my-2 hover:text-rose-300 cursor-pointer">menu</i>
                <i className="material-icons my-2 hover:text-rose-300">notifications</i>
            </div>

            <div className="flex flex-col items-center my-3 absolute bottom-0">
                <i className="material-icons my-2 hover:text-rose-300 cursor-pointer">settings</i>
                <i className="material-icons text-slate-100 bg-slate-300 rounded-full text-5xl">account_circle</i>
            </div>


        </div>
        </>
    )
}

export default SideBar;
import React, { useState } from 'react';
import { faSignOutAlt, faBars, faTachometerAlt, faUsers, faBowlFood, faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function NavbarComponent({ now }) {
    const admin = localStorage.getItem("admin")
    
    // navigate
    const navigate = useNavigate()

    // states
    const [renderSideBar, setRenderSidebar] = useState(false)
    const [current, setCurrent] = useState(now)

    // logout
    const logout = () => {
        if (admin === "canteen") {
            localStorage.removeItem("canteentoken")
        } else {
            localStorage.removeItem("collegetoken")
        }
        localStorage.removeItem('admin');
        navigate('/landing')
    }

    // return
    return (
        <>
            <div className="flex flex-row w-full h-16 fixed bg-yellow-500 px-9 z-50">
                {
                    now &&
                    <div className='flex justify-center items-center md:hidden'>
                        <FontAwesomeIcon onClick={() => setRenderSidebar(!renderSideBar)} icon={faBars} color='black' size="lg" />
                    </div>
                }
                <div className="flex w-20 h-16 justify-center items-center ml-3">
                    <h1 className="text-lg font-bold text-black">My App</h1>
                </div>
                {
                    now &&
                    <div className='flex justify-center items-center ml-auto'>
                        <FontAwesomeIcon onClick={logout} icon={faSignOutAlt} color='black' size="lg" />
                    </div>
                }
            </div>
            {/* sm side bar */}
            {
                renderSideBar && now &&
                <div className="w-52 min-h-screen bg-gray-900 fixed border border-gray-600 border-right p-3 mt-16 md:hidden">
                    <div className="w-full min-h-screen">
                        <div onClick={() => { setCurrent('dashboard'); navigate('/') }} className={current === "dashboard" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-700 rounded-md mt-4 px-5 py-2"}>
                            <FontAwesomeIcon className="mt-1" icon={faTachometerAlt} color={current === "dashboard" ? "black" : "white"} size="md" />
                            <h1 className={current === "dashboard" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Dashboard</h1>
                        </div>
                        <div onClick={() => { setCurrent('students'); navigate('/students') }} className={current === "students" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-700 rounded-md mt-4 px-5 py-2"}>
                            <FontAwesomeIcon className="mt-1" icon={faUsers} color={current === "students" ? "black" : "white"} size="md" />
                            <h1 className={current === "students" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Students</h1>
                        </div>
                        <div onClick={() => { setCurrent('menus'); navigate('/menus') }} className={current === "menus" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-700 rounded-md mt-4 px-5 py-2"}>
                            <FontAwesomeIcon className="mt-1" icon={faBowlFood} color={current === "menus" ? "black" : "white"} size="md" />
                            <h1 className={current === "menus" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Menus</h1>
                        </div>
                        {
                            admin === "canteen" &&
                            <div onClick={() => { setCurrent('orders'); navigate('/orders') }} className={current === "orders" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-700 rounded-md mt-4 px-5 py-2"}>
                                <FontAwesomeIcon className="mt-1" icon={faBook} color={current === "orders" ? "black" : "white"} size="md" />
                                <h1 className={current === "orders" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Orders</h1>
                            </div>
                        }
                        <div onClick={() => { setCurrent('payment_dues'); navigate('/payment_dues') }} className={current === "payment_dues" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-700 rounded-md mt-4 px-5 py-2"}>
                            <FontAwesomeIcon className="mt-1" icon={faBook} color={current === "payment_dues" ? "black" : "white"} size="md" />
                            <h1 className={current === "payment_dues" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Payment Dues</h1>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default NavbarComponent;

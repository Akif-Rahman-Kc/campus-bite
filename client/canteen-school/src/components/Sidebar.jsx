import React, { useState } from 'react';
import { faTachometerAlt, faUsers, faBowlFood, faBook, faScroll, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function SidebarComponent({ now }) {
    const admin = localStorage.getItem("admin")

    // navigate
    const navigate = useNavigate()

    // states
    const [current, setCurrent] = useState(now)

    // return
    return (
        <div className="hidden md:block md:w-60 lg:w-full max-w-80 min-h-screen fixed border border-gray-500 border-right p-3 mt-16 bg-gray-900">
            <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5">
                <div onClick={() => {setCurrent('dashboard'); navigate('/')}} className={current === "dashboard" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-500 rounded-md mt-4 px-5 py-2"}>
                    <FontAwesomeIcon className="mt-1" icon={faTachometerAlt} color={current === "dashboard" ? "black" : "white"} size="md" />
                    <h1 className={current === "dashboard" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Dashboard</h1>
                </div>
                <div onClick={() => {setCurrent('students'); navigate('/students')}} className={current === "students" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-500 rounded-md mt-4 px-5 py-2"}>
                    <FontAwesomeIcon className="mt-1" icon={faUsers} color={current === "students" ? "black" : "white"} size="md" />
                    <h1 className={current === "students" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Students</h1>
                </div>
                <div onClick={() => {setCurrent('menus'); navigate('/menus')}} className={current === "menus" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-500 rounded-md mt-4 px-5 py-2"}>
                    <FontAwesomeIcon className="mt-1" icon={faBowlFood} color={current === "menus" ? "black" : "white"} size="md" />
                    <h1 className={current === "menus" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Menus</h1>
                </div>
                {
                    admin === "canteen" &&
                    <div onClick={() => {setCurrent('orders'); navigate('/orders')}} className={current === "orders" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-500 rounded-md mt-4 px-5 py-2"}>
                        <FontAwesomeIcon className="mt-1" icon={faScroll} color={current === "orders" ? "black" : "white"} size="md" />
                        <h1 className={current === "orders" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Orders</h1>
                    </div>
                }
                <div onClick={() => {setCurrent('payment_dues'); navigate('/payment_dues')}} className={current === "payment_dues" ? "flex flex-row w-full bg-yellow-500 rounded-md mt-4 px-5 py-2" : "flex flex-row w-full hover:bg-gray-500 rounded-md mt-4 px-5 py-2"}>
                    <FontAwesomeIcon className="mt-1" icon={faCreditCard} color={current === "payment_dues" ? "black" : "white"} size="md" />
                    <h1 className={current === "payment_dues" ? "text-md font-semibold text-black ml-2" : "text-md font-semibold text-white ml-2"}>Payment Dues</h1>
                </div>
            </div>
        </div>
    );
}

export default SidebarComponent;

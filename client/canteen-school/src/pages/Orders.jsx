import { useEffect, useState } from "react";
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
import Dropdown from "../components/Dropdown";
import PopupAlert from "../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { CanteenAuthApi, CanteenOrderList, CanteenOrderStatusUpdate } from "../apis/canteen";
import { CollegeAuthApi, CollegeOrderList } from "../apis/college";


const OrdersPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( canteen or college )
    const admin = localStorage.getItem("admin")

    // const all_orders = [
    //     {
    //         "order_id": "844128301060",
    //         "ordered_user_id": "VICKI_46738",
    //         "order_items": [
    //             {
    //                 "name": "Chicken Biriyani",
    //                 "quantity": "1",
    //                 "price": "150"
    //             },
    //             {
    //                 "name": "Porotta",
    //                 "quantity": "3",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Egg Curry",
    //                 "quantity": "1",
    //                 "price": "50"
    //             }
    //         ],
    //         "order_total_amount": "230",
    //         "order_time": "1736243013000",
    //         "status": "PLACED"
    //     },
    //     {
    //         "order_id": "935956125942",
    //         "ordered_user_id": "IRFAD_00394",
    //         "order_items": [
    //             {
    //                 "name": "Chappathi",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Veg Curry",
    //                 "quantity": "1",
    //                 "price": "40"
    //             }
    //         ],
    //         "order_total_amount": "60",
    //         "order_time": "1736241013000",
    //         "status": "PAYMENT PENDING"
    //     },
    //     {
    //         "order_id": "398970536448",
    //         "ordered_user_id": "RAHMAN_08976",
    //         "order_items": [
    //             {
    //                 "name": "Idli",
    //                 "quantity": "1",
    //                 "price": "30"
    //             },
    //             {
    //                 "name": "Dosa",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Lime Juice",
    //                 "quantity": "2",
    //                 "price": "15"
    //             }
    //         ],
    //         "order_total_amount": "80",
    //         "order_time": "1736240013000",
    //         "status": "COMPLETED"
    //     },
    //     {
    //         "order_id": "987784169818",
    //         "ordered_user_id": "KIRTHI_09845",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "5",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Lime Juice",
    //                 "quantity": "1",
    //                 "price": "15"
    //             }
    //         ],
    //         "order_total_amount": "65",
    //         "order_time": "1736149913000",
    //         "status": "READY"
    //     },
    //     {
    //         "order_id": "506231675546",
    //         "ordered_user_id": "ADITHYA_98084",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "3",
    //                 "price": "10"
    //             }
    //         ],
    //         "order_total_amount": "30",
    //         "order_time": "1736149813000",
    //         "status": "PREPARING"
    //     },
    //     {
    //         "order_id": "890069634276",
    //         "ordered_user_id": "SALMAN_01285",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Egg Puffs",
    //                 "quantity": "2",
    //                 "price": "15"
    //             }
    //         ],
    //         "order_total_amount": "50",
    //         "order_time": "1736148913000",
    //         "status": "COMPLETED"
    //     },
    //     {
    //         "order_id": "583856156418",
    //         "ordered_user_id": "KIRTHI_09845",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "1",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Chicken Roll",
    //                 "quantity": "1",
    //                 "price": "15"
    //             }
    //         ],
    //         "order_total_amount": "25",
    //         "order_time": "1736148513000",
    //         "status": "COMPLETED"
    //     },
    //     {
    //         "order_id": "830575854302",
    //         "ordered_user_id": "AFLAHA_95401",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "1",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Chicken Roll",
    //                 "quantity": "1",
    //                 "price": "15"
    //             },
    //             {
    //                 "name": "Egg Puffs",
    //                 "quantity": "1",
    //                 "price": "15"
    //             },
    //         ],
    //         "order_total_amount": "40",
    //         "order_time": "1736148313000",
    //         "status": "PREPARING"
    //     },
    //     {
    //         "order_id": "560925663694",
    //         "ordered_user_id": "ADITHYA_98084",
    //         "order_items": [
    //             {
    //                 "name": "Tea",
    //                 "quantity": "1",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Chicken Puffs",
    //                 "quantity": "1",
    //                 "price": "20"
    //             },
    //         ],
    //         "order_total_amount": "30",
    //         "order_time": "1736148013000",
    //         "status": "PLACED"
    //     },
    //     {
    //         "order_id": "887626166291",
    //         "ordered_user_id": "RISAL_25486",
    //         "order_items": [
    //             {
    //                 "name": "Chicken Biriryani",
    //                 "quantity": "1",
    //                 "price": "150"
    //             },
    //             {
    //                 "name": "Tea",
    //                 "quantity": "1",
    //                 "price": "10"
    //             },
    //         ],
    //         "order_total_amount": "160",
    //         "order_time": "1736147013000",
    //         "status": "PLACED"
    //     },
    //     {
    //         "order_id": "433115833554",
    //         "ordered_user_id": "RESHMA_84012",
    //         "order_items": [
    //             {
    //                 "name": "Meal",
    //                 "quantity": "1",
    //                 "price": "50"
    //             },
    //             {
    //                 "name": "Fish Fry",
    //                 "quantity": "1",
    //                 "price": "60"
    //             },
    //         ],
    //         "order_total_amount": "110",
    //         "order_time": "1736146013000",
    //         "status": "PREPARING"
    //     },
    //     {
    //         "order_id": "563277582671",
    //         "ordered_user_id": "SALMAN_01285",
    //         "order_items": [
    //             {
    //                 "name": "Meal",
    //                 "quantity": "1",
    //                 "price": "50"
    //             },
    //         ],
    //         "order_total_amount": "50",
    //         "order_time": "1736145013000",
    //         "status": "READY"
    //     },
    //     {
    //         "order_id": "827122314645",
    //         "ordered_user_id": "RISAL_25486",
    //         "order_items": [
    //             {
    //                 "name": "Meal",
    //                 "quantity": "2",
    //                 "price": "50"
    //             },
    //             {
    //                 "name": "Tea",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //         ],
    //         "order_total_amount": "120",
    //         "order_time": "1736144013000",
    //         "status": "CANCELLED"
    //     },
    //     {
    //         "order_id": "982936652415",
    //         "ordered_user_id": "ADITHYA_98084",
    //         "order_items": [
    //             {
    //                 "name": "Porotta",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Chappathi",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //         ],
    //         "order_total_amount": "40",
    //         "order_time": "1736143013000",
    //         "status": "COMPLETED"
    //     },
    //     {
    //         "order_id": "215228606096",
    //         "ordered_user_id": "NABEEL_65284",
    //         "order_items": [
    //             {
    //                 "name": "Porotta",
    //                 "quantity": "2",
    //                 "price": "10"
    //             },
    //             {
    //                 "name": "Chicken Fry",
    //                 "quantity": "1",
    //                 "price": "60"
    //             },
    //         ],
    //         "order_total_amount": "80",
    //         "order_time": "1736142013000",
    //         "status": "PLACED"
    //     },
    //     {
    //         "order_id": "302516207990",
    //         "ordered_user_id": "RISAL_25486",
    //         "order_items": [
    //             {
    //                 "name": "Chicken Fry",
    //                 "quantity": "2",
    //                 "price": "60"
    //             },
    //             {
    //                 "name": "Ghee Rice",
    //                 "quantity": "2",
    //                 "price": "70"
    //             },
    //         ],
    //         "order_total_amount": "260",
    //         "order_time": "1736141013000",
    //         "status": "PREPARING"
    //     }
    // ]

    // states
    const [refresh, setRefresh] = useState(false)
    const [orderRefresh, setOrderRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                if (token) {
                    const auth = await CanteenAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                if (token) {
                    const auth = await CollegeAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } 
        }
        auth()
    }, []);

    // use effect fetching order list
    useEffect(() => {
        async function fetchData() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                const response = await CanteenOrderList(token)
                if (response && response.status === "success") {
                    setOrders(response.orders)
                    setAllOrders(response.orders)
                } else {
                    alert(response?.message)
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                const response = await CollegeOrderList(token)
                if (response && response.status === "success") {
                    setOrders(response.orders)
                    setAllOrders(response.orders)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [orderRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // status filtering
    useEffect(() => {
        if (selectedValue) {
            const filterd_orders = allOrders.filter(order => order.status.toLowerCase() === selectedValue.toLowerCase());
            setOrders(filterd_orders)
            setRefresh(!refresh)
        } else {
            setOrders(allOrders)
        }
    }, [selectedValue]);

    // status change
    const changeStatus = async (index, status) => {
        if ((orders[index].status === "COMPLETED" && status !== "COMPLETED") || (orders[index].status === "CANCELLED" && status !== "CANCELLED")) {
            triggerAlert()
        } else {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                if (token) {
                    const response = await CanteenOrderStatusUpdate(token, { _id: orders[index]._id, status })
                    if (response && response.status === "success") {
                        setOrderRefresh(!orderRefresh)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    alert("You cant change order, Please login first")
                }
            } else {
                alert("You cannot change order details, you dont have access")   
            }
        }
    }

    // popup alert trigger
    const triggerAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Auto-close after 3 seconds
    };

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_orders = allOrders.filter(order => order.order_id.toLowerCase().includes(lowercase_value) || order.student_id.toLowerCase().includes(lowercase_value));
            setOrders(filterd_orders)
            setRefresh(!refresh)
        } else {
            setOrders(allOrders)
        }
    }

    // view modal open
    const viewModalOpen = (index) => {
        setSelectedOrder(orders[index])
        setIsViewModalOpen(true)
    }

    // timestamp foramat
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        // Extract the components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Format as dd/mm/yyyy 00:00
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    // return
    return (
        <>
            <NavbarComponent now={'orders'} />
            <SidebarComponent now={'orders'} />
            {/* Popup Alert Start */}
            {
                showAlert && (
                    <PopupAlert
                        message="You cant change this status!"
                        type="error"
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
            {/* Popup Alert End */}
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-900">
                <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5 mt-3">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center">
                        {/* Dropdown Start */}
                        <div className="w-1/2 flex">
                            <Dropdown key_name={"status"} items={["Placed", "Preparing", "Ready", "Payment Pending", "Completed", "Cancelled"]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                        </div>
                        {/* Dropdown End */}
                        {/* Search Bar Start */}
                        <div className="w-1/2 flex justify-end">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search..."
                                className="flex px-4 w-7/12 lg:w-4/12 py-1 bg-gray-900 border border-gray-300 rounded-full text-white text-xs lg:text-sm"
                                // value={search}
                                onChange={(e) => search(e.target.value)}
                            />
                        </div>
                        {/* Search Bar End */}
                    </div>
                    {/* Table */}
                    <div className="w-full bg-gray-900 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Order ID
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Ordered Student ID
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Order Items
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Total Amount
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Order Time
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            ORDER_ID: {item.order_id}
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            #{item.student_id}
                                        </td>
                                        <td onClick={() => viewModalOpen(index)} className="border text-white text-sm border-gray-500 px-4 py-2 hover:bg-gray-800 active:bg-gray-700">
                                            {item.items.length > 1 ? item.items[0]?.item_name + " . . ." : item.items[0]?.item_name }
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            ₹{item.cart_total}
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            {formatTimestamp(parseInt(item.created_at))}
                                        </td>
                                        <td className={`border border-gray-500 px-4 py-2 text-center`}>
                                            {/* {item.status} */}
                                            <select className={`w-full text-xs font-bold bg-gray-900 capitalize p-2 rounded-md border border-gray-500 ${
                                                        item.status === "PLACED" ?
                                                            "text-blue-400"
                                                        :
                                                            item.status === "PREPARING" ?
                                                                "text-orange-400"
                                                            :
                                                                item.status === "READY" ?
                                                                    "text-yellow-400"
                                                                :
                                                                    item.status === "PAYMENT PENDING" ?
                                                                        "text-gray-400"
                                                                    :
                                                                        item.status === "COMPLETED" ?
                                                                            "text-green-400"
                                                                        :
                                                                            "text-red-400"
                                            }`} name={"order_status"} id={"order_status"} value={item.status} onChange={(e) => changeStatus(index, e.target.value)}>
                                                {["PLACED", "PREPARING", "READY", "PAYMENT PENDING", "COMPLETED", "CANCELLED"].map((item) => (
                                                    <option className="text-center" key={item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table */}
                    {/* View Modal Start */}
                    {isViewModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-700 p-6 rounded shadow-lg w-96 relative">
                                {/* zigzag border top */}
                                <div className="absolute -top-3 left-0 w-full">
                                    <svg
                                        className="w-full h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 100 10"
                                        preserveAspectRatio="none"
                                    >
                                        <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10" fill="#374151" />
                                    </svg>
                                </div>
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsViewModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold text-center mb-2">Order Bill</h2>
                                <div className="flex flex-row">
                                    <h6 className="text-xxs text-gray-400 font-bold mb-3">ORDER_ID: #{selectedOrder?.order_id}</h6>
                                    <h6 className="text-xxs text-gray-400 font-bold mb-3 ml-auto">DATE: {formatTimestamp(parseInt(selectedOrder.order_time))}</h6>
                                </div>
                                {/* order items */}
                                <div className="bg-gray-800 rounded p-4 mb-3">
                                    <h3 className="text-sm text-white font-semibold mb-2">Items:</h3>
                                    <ul className="space-y-2">
                                        {selectedOrder?.order_items?.map((item, index) => (
                                            <li key={index} className="flex justify-between text-gray-300 text-xs">
                                                <span>{item.name}</span>
                                                <span>{item.quantity} x ₹{item.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* total */}
                                <div className="bg-gray-800 rounded p-4">
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Subtotal:</span>
                                        <span>₹{parseInt(selectedOrder?.order_total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 text-sm">
                                        <span>Tax (5%):</span>
                                        <span>₹{(parseInt(selectedOrder?.order_total_amount) * 5) / 100}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-md mt-2">
                                        <span>Total:</span>
                                        <span>₹{parseInt(selectedOrder?.order_total_amount) + (parseInt(selectedOrder?.order_total_amount) * 5) / 100}</span>
                                    </div>
                                </div>

                                {/* thank you message */}
                                <div className="mt-4 text-center">
                                    <p className="text-gray-300 text-xs italic">
                                        Thank you for dining with us! We hope to serve you again.
                                    </p>
                                </div>

                                {/* zigzag border bottom */}
                                <div className="absolute -bottom-3 left-0 w-full">
                                    <svg
                                        className="w-full h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 100 10"
                                        preserveAspectRatio="none"
                                    >
                                        <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0" fill="#374151" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* View Modal End */}
                </div>
            </div>
        </>
    );
}

export default OrdersPage;
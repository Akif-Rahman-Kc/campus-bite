import { useEffect, useState } from "react";
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faBell, faPhone } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from 'date-fns';
import PopupAlert from "../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { CanteenAuthApi, CanteenNotificationCreate, CanteenStudentPaymentDues } from "../apis/canteen";
import { CollegeAuthApi, CollegeStudentPaymentDues } from "../apis/college";

const PaymentDuesPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( canteen or college )
    const admin = localStorage.getItem("admin")

    // const all_payment_dues = [
    //     {
    //         "student_id": "FATHIMA_07465",
    //         "name": "fathima",
    //         "mobile_no": "1515151515",
    //         "due_amount": "80",
    //         "due_orders": [
    //             { "order_id": "215228606096", "order_total_amount": "80" }
    //         ],
    //         "due_start_date": "1704279263000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "RAHMAN_08976",
    //         "name": "rahman",
    //         "mobile_no": "3333333333",
    //         "due_amount": "210",
    //         "due_orders": [
    //             { "order_id": "563277582671", "order_total_amount": "50" },
    //             { "order_id": "827122314645", "order_total_amount": "120" },
    //             { "order_id": "982936652415", "order_total_amount": "40" }
    //         ],
    //         "due_start_date": "1709463263000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "KIRTHI_09845",
    //         "name": "kirthi",
    //         "mobile_no": "2222222222",
    //         "due_amount": "230",
    //         "due_orders": [
    //             { "order_id": "844128301060", "order_total_amount": "230" }
                
    //         ],
    //         "due_start_date": "1729141663000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "AKIF_00045",
    //         "name": "akif",
    //         "mobile_no": "4444444444",
    //         "due_amount": "530",
    //         "due_orders": [
    //             { "order_id": "887626166291", "order_total_amount": "160" },
    //             { "order_id": "302516207990", "order_total_amount": "260" },
    //             { "order_id": "433115833554", "order_total_amount": "110" }
    //         ],
    //         "due_start_date": "1732538196700", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "ADITHYA_98084",
    //         "name": "adithya",
    //         "mobile_no": "5555555555",
    //         "due_amount": "140",
    //         "due_orders": [
    //             { "order_id": "935956125942", "order_total_amount": "60" },
    //             { "order_id": "398970536448", "order_total_amount": "80" }
    //         ],
    //         "due_start_date": "1734540463000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "IRSHAD_90321",
    //         "name": "irshad",
    //         "mobile_no": "6666666666",
    //         "due_amount": "30",
    //         "due_orders": [
    //             { "order_id": "560925663694", "order_total_amount": "30" },
    //         ],
    //         "due_start_date": "1734940463000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "BILAL_54692",
    //         "name": "bilal",
    //         "mobile_no": "1414141414",
    //         "due_amount": "160",
    //         "due_orders": [
    //             { "order_id": "987784169818", "order_total_amount": "65" },
    //             { "order_id": "506231675546", "order_total_amount": "30" },
    //             { "order_id": "583856156418", "order_total_amount": "25" },
    //             { "order_id": "830575854302", "order_total_amount": "40" }
    //         ],
    //         "due_start_date": "1735040463000", // This means array first data date, that is the start date
    //     },
    //     {
    //         "student_id": "MAJEED_00120",
    //         "name": "majeed",
    //         "mobile_no": "1616161616",
    //         "due_amount": "50",
    //         "due_orders": [
    //             { "order_id": "890069634276", "order_total_amount": "50" },
    //         ],
    //         "due_start_date": "1736074463000", // This means array first data date, that is the start date
    //     }
    // ]
    // states
    const [refresh, setRefresh] = useState(false)
    const [paymentDuesrefresh, setPaymentDuesRefresh] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [copiedOrderId, setCopiedOrderId] = useState(null);
    const [hoveredOrderId, setHoveredOrderId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [paymentDues, setPaymentDues] = useState([])
    const [allPaymentDues, setAllPaymentDues] = useState([])

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

    // use effect fetching students payment dues
    useEffect(() => {
        async function fetchData() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                const response = await CanteenStudentPaymentDues(token)
                console.log(response);
                
                if (response && response.status === "success") {
                    setPaymentDues(response.due_orders)
                    setAllPaymentDues(response.due_orders)
                } else {
                    alert(response?.message)
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                const response = await CollegeStudentPaymentDues(token)
                console.log(response);
                
                if (response && response.status === "success") {
                    setPaymentDues(response.due_orders)
                    setAllPaymentDues(response.due_orders)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [paymentDuesrefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_payment_dues = allPaymentDues.filter(payment_due => payment_due.name.toLowerCase().includes(lowercase_value) || payment_due.mobile_no.toLowerCase().includes(lowercase_value));
            setPaymentDues(filterd_payment_dues)
            setRefresh(!refresh)
        } else {
            setPaymentDues(allPaymentDues)
        }
    }

    const triggerAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Auto-close after 3 seconds
    };

    // view modal open
    const viewModalOpen = (index) => {
        setSelectedStudent(allPaymentDues[index])
        setIsViewModalOpen(true)
    }

    // timestamp foramat
    const formatTimeAgo = (timestamp) => {
        const date = new Date(Number(timestamp)); // convert timestamp to date object
        return formatDistanceToNow(date, { addSuffix: true }); // returns time ago (e.g., "1 day ago")
    };

    // mark finding
    const markFinding = (due_start_date) => {
        const current_date = Date.now();
        const two_months_ago = current_date - 2 * 30 * 24 * 60 * 60 * 1000; // 2 months in milliseconds
        const one_month_ago = current_date - 1 * 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds

        console.log(due_start_date, ">=", one_month_ago);
        console.log(due_start_date, "<=", two_months_ago);

        if (due_start_date < two_months_ago) {
            return "🟥"; // more than 2 months ago
        } else if (due_start_date <= one_month_ago && due_start_date >= two_months_ago) {
            return "🟨"; // 1 to 2 months range
        } else {
            return "⬜️"; // less than 1 month
        }
    };

    // create notification
    const createNotification = async (student_id, type) => {
        let title = "";
        let message = "";
        switch (type) {
            case "🟥":
                title = `🔴 Urgent`
                message = `Your payment is overdue! Please pay immediately to avoid penalties.`;
                break;
            case "🟨":
                title = `🟡 Reminder`
                message = `Your payment is due soon. Kindly clear your dues before the deadline.`;
                break;
            case "⬜️":
                title = `⚪ Info`
                message = `Payment window is open. Please check your dues and pay at your convenience.`;
                break;
            default:
                title = `⚪ Info`
                message = `Payment window is open. Please check your dues and pay at your convenience.`;
        }

        if (admin === "canteen") {
            const token = localStorage.getItem("canteentoken")
            const response = await CanteenNotificationCreate(token, {student_id, title, message})
            if (response && response.status === "success") {
                triggerAlert()
            } else {
                alert(response?.message)
            }
        } else {
            alert("You dont have access for this one")
        }
    }

    // return
    return (
        <>
            <NavbarComponent now={'payment_dues'} />
            <SidebarComponent now={'payment_dues'} />
            {/* Popup Alert Start */}
            {
                showAlert && (
                    <PopupAlert
                        message="Notification sent successfully."
                        type="success"
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
            {/* Popup Alert End */}
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-900">
                <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5 mt-3">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center">
                        <div className="w-1/2 flex"></div>
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
                                        Mark
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Student Id
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Name
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Mobile No
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Due Amount
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Due Orders
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Due Start Date
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentDues.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2 text-center">
                                            {markFinding(parseInt(item.due_start_date))}
                                        </td>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2">
                                            {item.student_id}
                                        </td>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2">
                                            {item.due_amount}
                                        </td>
                                        <td onClick={() => viewModalOpen(index)} className="border text-white text-sm border-gray-500 px-4 py-2 hover:bg-gray-800 active:bg-gray-700">
                                            #{item.due_orders.length > 1 ? item.due_orders[0]?.order_id + " . . ." : item.due_orders[0]?.order_id }
                                        </td>
                                        <td className="border text-white text-sm text-md border-gray-500 px-4 py-2">
                                            {formatTimeAgo(parseInt(item.due_start_date))}
                                        </td>
                                        <td className="border text-xs border-gray-300 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <a href="tel:+919562696976"><FontAwesomeIcon className="mt-1 mr-2" icon={faPhone} color="#60A5FA" size="md" /></a>
                                                <FontAwesomeIcon onClick={() => createNotification(item._id, markFinding(parseInt(item.due_start_date)))} className="mt-1 ml-2" icon={faBell} color="#60A5FA" size="md" />
                                            </div>
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
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsViewModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold text-center mb-2">Due Orders</h2>
                                {/* dues order items */}
                                <div className="bg-gray-800 rounded p-4 mb-3">
                                    <ul className="space-y-2">
                                        {selectedStudent?.due_orders?.map((item, index) => (
                                            <li key={index} className="flex justify-between text-gray-300 text-xs relative">
                                                <div className="flex items-center">
                                                    {/* popover container */}
                                                    <div className="relative">
                                                        {/* copy icon */}
                                                        <FontAwesomeIcon
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(item.order_id);
                                                                setCopiedOrderId(item.order_id); // set the copied order ID
                                                                setTimeout(() => setCopiedOrderId(null), 2000); // reset after 2 seconds
                                                            }}
                                                            onMouseEnter={() => setHoveredOrderId(item.order_id)} // show "Copy" on hover
                                                            onMouseLeave={() => setHoveredOrderId(null)} // hide "Copy" on leave
                                                            className="mr-1 hover:text-gray-500 active:text-gray-400 cursor-pointer"
                                                            icon={faCopy}
                                                            color="#4B5563"
                                                            size="md"
                                                        />
                                                        {/* popover box */}
                                                        {hoveredOrderId === item.order_id && !copiedOrderId && (
                                                            <div className="absolute -top-8 left-0 bg-gray-500 text-white text-xxs rounded-t-lg rounded-r-lg px-2 py-1 shadow-md">
                                                                Copy
                                                            </div>
                                                        )}
                                                        {copiedOrderId === item.order_id && (
                                                            <div className="absolute -top-8 left-0 bg-gray-500 text-white text-xxs rounded-t-lg rounded-r-lg px-2 py-1 shadow-md">
                                                                Copied
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span>ORDER_ID: #{item.order_id}</span>
                                                </div>
                                                <span>{item.order_total_amount}</span>
                                            </li>
                                        ))}
                                    </ul>
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

export default PaymentDuesPage;
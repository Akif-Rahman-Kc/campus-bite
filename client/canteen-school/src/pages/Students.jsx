import { useEffect, useState } from "react";
import { faEdit, faTrash, faAngleDown, faAngleUp, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
import FilterDropdown from "../components/FilterDropdown";
import PopupAlert from "../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { CanteenAuthApi, CanteenStudentList } from "../apis/canteen";
import { CollegeAuthApi, CollegeStudentDelete, CollegeStudentList, CollegeStudentStatusUpdate, CollegeStudentUpdate } from "../apis/college";


const StudentsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( canteen or college )
    const admin = localStorage.getItem("admin")

    // const all_students = [
    //     {
    //         "student_id": "IRFAD_00394",
    //         "name": "irfad",
    //         "mobile_no": "0000000000",
    //         "age": "22",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "VICKI_46738",
    //         "name": "vicki",
    //         "mobile_no": "1111111111",
    //         "age": "25",
    //         "gender": "male",
    //         "year": "Second",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "KIRTHI_09845",
    //         "name": "kirthi",
    //         "mobile_no": "2222222222",
    //         "age": "27",
    //         "gender": "other",
    //         "year": "First",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "RAHMAN_08976",
    //         "name": "rahman",
    //         "mobile_no": "3333333333",
    //         "age": "22",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Electronics",
    //         "status": "INACTIVE"
    //     },
    //     {
    //         "student_id": "AKIF_00045",
    //         "name": "akif",
    //         "mobile_no": "4444444444",
    //         "age": "23",
    //         "gender": "male",
    //         "year": "Third",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "ADITHYA_98084",
    //         "name": "adithya",
    //         "mobile_no": "5555555555",
    //         "age": "20",
    //         "gender": "female",
    //         "year": "First",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "IRSHAD_90321",
    //         "name": "irshad",
    //         "mobile_no": "6666666666",
    //         "age": "21",
    //         "gender": "male",
    //         "year": "Third",
    //         "department": "Computer",
    //         "status": "PENDING"
    //     },
    //     {
    //         "student_id": "ARYA_56243",
    //         "name": "arya",
    //         "mobile_no": "7777777777",
    //         "age": "23",
    //         "gender": "female",
    //         "year": "Second",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "SALMAN_01285",
    //         "name": "salman",
    //         "mobile_no": "8888888888",
    //         "age": "25",
    //         "gender": "male",
    //         "year": "Second",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "AKSHAYA_20165",
    //         "name": "akshaya",
    //         "mobile_no": "9999999999",
    //         "age": "24",
    //         "gender": "female",
    //         "year": "First",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "VISHNU_54012",
    //         "name": "vishnu",
    //         "mobile_no": "1010101010",
    //         "age": "22",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "GOPAL_80125",
    //         "name": "gopal",
    //         "mobile_no": "1212121212",
    //         "age": "20",
    //         "gender": "male",
    //         "year": "Second",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "RISAL_25486",
    //         "name": "risal",
    //         "mobile_no": "1313131313",
    //         "age": "23",
    //         "gender": "male",
    //         "year": "Second",
    //         "department": "Computer",
    //         "status": "INACTIVE"
    //     },
    //     {
    //         "student_id": "BILAL_54692",
    //         "name": "bilal",
    //         "mobile_no": "1414141414",
    //         "age": "20",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "FATHIMA_07465",
    //         "name": "fathima",
    //         "mobile_no": "1515151515",
    //         "age": "26",
    //         "gender": "female",
    //         "year": "Second",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "MAJEED_00120",
    //         "name": "majeed",
    //         "mobile_no": "1616161616",
    //         "age": "25",
    //         "gender": "male",
    //         "year": "Third",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "RAEES_94000",
    //         "name": "raees",
    //         "mobile_no": "1717171717",
    //         "age": "26",
    //         "gender": "male",
    //         "year": "Second",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "AFLAHA_95401",
    //         "name": "aflaha",
    //         "mobile_no": "1818181818",
    //         "age": "25",
    //         "gender": "female",
    //         "year": "First",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "RESHMA_84012",
    //         "name": "reshma",
    //         "mobile_no": "1919191919",
    //         "age": "21",
    //         "gender": "female",
    //         "year": "First",
    //         "department": "Computer",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "MOHAN_45120",
    //         "name": "mohan",
    //         "mobile_no": "2020202020",
    //         "age": "27",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "NABEEL_65284",
    //         "name": "nabeel",
    //         "mobile_no": "2121212121",
    //         "age": "26",
    //         "gender": "male",
    //         "year": "Third",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "KARTHIKA_78420",
    //         "name": "karthika",
    //         "mobile_no": "2323232323",
    //         "age": "26",
    //         "gender": "female",
    //         "year": "Second",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "LUKKU_84214",
    //         "name": "lukku",
    //         "mobile_no": "2424242424",
    //         "age": "23",
    //         "gender": "male",
    //         "year": "Third",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "AFRAS_10245",
    //         "name": "afras",
    //         "mobile_no": "2525252525",
    //         "age": "23",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Electronics",
    //         "status": "ACTIVE"
    //     },
    //     {
    //         "student_id": "ANSAF_45123",
    //         "name": "ansaf",
    //         "mobile_no": "2626262626",
    //         "age": "22",
    //         "gender": "male",
    //         "year": "First",
    //         "department": "Mechanical",
    //         "status": "ACTIVE"
    //     }
    // ]
    // states
    const [refresh, setRefresh] = useState(false)
    const [studentRefresh, setStudentRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState({department: "", year: "", gender: "", status: ""});
    const [showFilter, setShowFilter] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [index, setIndex] = useState(0);
    const [formData, setFormData] = useState({
        username: "",
        mobile_no: "",
        age: "",
        gender: ""
    });
    const [students, setStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

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

    // use effect fetching student list
    useEffect(() => {
        async function fetchData() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                const response = await CanteenStudentList(token)
                if (response && response.status === "success") {
                    setStudents(response.students)
                    setAllStudents(response.students)
                } else {
                    alert(response?.message)
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                const response = await CollegeStudentList(token)
                if (response && response.status === "success") {
                    setStudents(response.students)
                    setAllStudents(response.students)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [studentRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // status change
    const changeStatus = async (index, status) => {
        if (admin === "college") {
            const token = localStorage.getItem("collegetoken")
            if (token) {
                const response = await CollegeStudentStatusUpdate(token, { _id: students[index]._id, status })
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant change student, Please login first")
            }
        } else {
            alert("You cannot change student details, you dont have access")   
        }
    }

    // popup alert trigger
    const triggerAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Auto-close after 3 seconds
    };

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_students = allStudents.filter(students => students.username.toLowerCase().includes(lowercase_value) || students.mobile_no.toLowerCase().includes(lowercase_value));
            setStudents(filterd_students)
            setRefresh(!refresh)
        } else {
            setStudents(allStudents)
        }
    }

    // filter
    const filter = () => {
        const filterd_students = allStudents.filter(student => 
            (!selectedValue.department || student.department.toLowerCase() === selectedValue.department.toLowerCase()) &&
            (!selectedValue.year || student.year.toLowerCase() === selectedValue.year.toLowerCase()) &&
            (!selectedValue.gender || student.gender.toLowerCase() === selectedValue.gender.toLowerCase()) &&
            (!selectedValue.status || student.status.toLowerCase() === selectedValue.status.toLowerCase())
        );
        setStudents(filterd_students)
        setRefresh(!refresh)
        setShowFilter(false)
    }

    // clear
    const clear = () => {
        setStudents(allStudents)
        setSelectedValue({department: "", year: "", gender: "", status: ""})
        setRefresh(!refresh)
        setShowFilter(false)
    }

    // edit modal open
    const editModalOpen = (index) => {
        setIndex(index)
        setIsEditModalOpen(true)
        setFormData(students[index]);
    }

    // edit modal change
    const editModalChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // edit modal submit
    const editModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        if (admin === "college") {
            const token = localStorage.getItem("collegetoken")
            if (token) {
                const response = await CollegeStudentUpdate(token, formData)
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                    setIsEditModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant edit student, Please login first")
            }
        } else {
            alert("You cannot edit student details, you dont have access")   
        }
    };

    // delete modal open
    const deleteModalOpen = (index) => {
        setIndex(index)
        setIsDeleteModalOpen(true)
    }

    // edit modal confirm
    const deleteModalConfirm = async () => {
        if (admin === "college") {
            const token = localStorage.getItem("collegetoken")
            if (token) {
                const response = await CollegeStudentDelete(token, students[index]._id)
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                    setIsDeleteModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant delete student, Please login first")
            }
        } else {
            alert("You cannot delete student details, you dont have access")   
        }
    };

    // approve
    const approve = (index) => {
        changeStatus(index, "ACTIVE")
        triggerAlert("Approved", "success")
    }

    // reject
    const reject = (index) => {
        setIndex(index)
        deleteModalConfirm()
        triggerAlert("Rejected", "error")
    }

    // return
    return (
        <>
            <NavbarComponent now={'students'} />
            <SidebarComponent now={'students'} />
            {
                showAlert && (
                    <PopupAlert
                        message={alertMessage}
                        type={alertType}
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-900">
                <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5 mt-3">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center relative">
                        {/* Filter Box Button Start */}
                        <div className="w-1/2 flex">    
                            {
                                showFilter ?
                                <button onClick={() => setShowFilter(false)} className="mt-4 mb-2 text-gray-300 hover:text-white text-xs rounded font-semibold capitalize">
                                    Hide Filters
                                    <FontAwesomeIcon className="ml-1 hover:text-white" icon={faAngleUp} color="#D1D5DB" size="md" />
                                </button>
                                :
                                <button onClick={() => setShowFilter(true)} className="mt-4 mb-2 text-gray-300 hover:text-white text-xs rounded font-semibold capitalize">
                                    Show Filters
                                    <FontAwesomeIcon className="ml-1 hover:text-white" icon={faAngleDown} color="#D1D5DB" size="md" />
                                </button>
                            }
                        </div>
                        {/* Filter Box Button End */}
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
                        {/* Filter box Start */}
                        {
                            showFilter &&
                            <div className="absolute top-10 left-0 w-full bg-gray-900 border border-gray-600 z-40 rounded-lg">
                                <div className="w-full p-4">
                                    {/* content inside the filter box */}
                                    {/* dropdown */}
                                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <FilterDropdown key_name={"department"} items={["Mechanical", "Electronics", "Computer"]} selectedValue={selectedValue.department} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"year"} items={["First", "Second", "Third"]} selectedValue={selectedValue.year} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"gender"} items={["male", "female", "other"]} selectedValue={selectedValue.gender} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"status"} items={["Pending", "Active", "Inactive"]} selectedValue={selectedValue.status} setSelectedValue={setSelectedValue} />
                                    </div>
                                    {/* button */}
                                    <div className="flex justify-center mt-4">
                                        <button onClick={filter} className="mr-1 border-2 border-blue-500 text-blue-500 hover:text-white px-8 py-1.5 text-xxs rounded font-bold uppercase hover:bg-blue-500 active:bg-blue-600">
                                            Search
                                        </button>
                                        <button onClick={clear} className="ml-1 border-2 border-red-500 text-red-500 hover:text-white px-8 py-1.5 text-xxs rounded font-bold uppercase hover:bg-red-500 active:bg-red-600">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* Filter box End */}
                    </div>
                    {/* Table Start */}
                    <div className={`w-full bg-gray-900 overflow-x-auto rounded-xl ${showFilter ? "mt-96 sm:mt-56 lg:mt-36" : ""}`}>
                        <table className="w-full table-auto border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Sudent ID
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Name
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Mobile No
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Age
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Gender
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Year
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Department
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Status
                                    </th>
                                    {
                                        admin === "college" &&
                                        <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                            Options
                                        </th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2 capitalize">
                                            #{item.student_id}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2 capitalize">
                                            {item.username}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2">
                                            {item.age}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2">
                                            {item.gender}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2">
                                            {item.year}
                                        </td>
                                        <td className="border text-sm text-white text-md border-gray-500 px-4 py-2">
                                            {item.department}
                                        </td>
                                        {
                                            admin === "college" ?
                                            <td className="border text-white text-xs border-gray-500 px-4 py-2">
                                                <div className="w-full flex justify-center">
                                                    {
                                                        item.status === "PENDING" ?
                                                        <h3 className="text-yellow-400 text-xxs font-bold">{item.status}</h3>
                                                        :
                                                        <div onClick={() => changeStatus(index, item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className="w-20 bg-gray-600 rounded-full shadow-md shadow-inner">
                                                            {
                                                                item.status === "ACTIVE" ?
                                                                    <div className="flex w-14 py-1 bg-green-700 rounded-full text-white font-bold ml-auto justify-center status-box cursor-pointer">
                                                                        {item.status}
                                                                    </div>
                                                                    :
                                                                    <div className="flex w-14 py-1 bg-red-600 rounded-full text-white font-bold justify-center status-box cursor-pointer">
                                                                        {item.status}
                                                                    </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            :
                                            <td className={`border text-sm text-center text-md border-gray-500 px-4 py-2 font-semibold ${item.status === "ACTIVE" ? "text-green-400" : "text-red-400"}`}>
                                                {item.status}
                                            </td>
                                        }
                                        {
                                            admin === "college" &&
                                            <td className="border text-xs border-gray-300 w-1/12 px-4 py-2">
                                                {
                                                    item.status === "PENDING" ?
                                                    <div className="w-full flex justify-center">
                                                        <FontAwesomeIcon className="mt-1 mr-2 cursor-pointer" onClick={() => approve(index)} icon={faCircleCheck} color="#4ade80" size="md" />
                                                        <FontAwesomeIcon className="mt-1 ml-2 cursor-pointer" onClick={() => reject(index)} icon={faCircleXmark} color="#f54242" size="md" />
                                                    </div>
                                                    :
                                                    <div className="w-full flex justify-center">
                                                        <FontAwesomeIcon className="mt-1 mr-2 cursor-pointer" onClick={() => editModalOpen(index)} icon={faEdit} color="#6961ff" size="md" />
                                                        <FontAwesomeIcon className="mt-1 ml-2 cursor-pointer" onClick={() => deleteModalOpen(index)} icon={faTrash} color="#f54242" size="md" />
                                                    </div>
                                                }
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table End */}
                    {/* Edit Modal Start */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">Edit Student</h2>
                                {/* form */}
                                <form onSubmit={editModalSubmit}>
                                    {/* username field */}
                                    <div className="mb-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Enter name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.username}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* mobile no field */}
                                    <div className="mb-4">
                                        <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-300">
                                            Mobile No
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="mobile_no"
                                            name="mobile_no"
                                            placeholder="Enter mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.mobile_no}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* age no field */}
                                    <div className="mb-4">
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                                            Age
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="age"
                                            name="age"
                                            placeholder="Enter age"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.age}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* gender no field */}
                                    <div className="mb-4">
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                                            Gender
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center mt-2">
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === "male"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Male
                                            </label>
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === "female"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Female
                                            </label>
                                            <label className="text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="other"
                                                    checked={formData.gender === "other"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>

                                    {/* submit button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className="mt-4 border-2 border-blue-500 text-blue-500 hover:text-white px-4 py-2 text-xxs rounded font-bold uppercase hover:bg-blue-500 active:bg-blue-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Edit Modal End */}
                    {/* Delete Modal Start */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-700 p-6 rounded shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold mb-2">Are you sure?</h2>
                                <p className="mb-7 text-sm text-gray-300">Do you want to delete this students data?</p>
                                {/* yes or no button */}
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="border-2 border-red-500 text-red-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-red-500 active:bg-red-600"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={deleteModalConfirm}
                                        className="border-2 border-green-500 text-green-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-green-500 active:bg-green-600"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Delete Modal End */}
                </div>
            </div>
        </>
    );
}

export default StudentsPage;
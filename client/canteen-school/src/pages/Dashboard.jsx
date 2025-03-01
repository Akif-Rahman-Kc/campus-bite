import { useEffect } from "react";
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { CanteenAuthApi } from "../apis/canteen";
import { CollegeAuthApi } from "../apis/college";


const DashboardPage = () => {
    // navigate
    const navigate = useNavigate()

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            const admin = localStorage.getItem("admin")
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                if (token) {
                    const auth = await CanteenAuthApi(token)
                    if (!auth || !auth.auth) {
                        navigate("/landing")
                    }
                } else {
                    navigate("/landing")
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                if (token) {
                    const auth = await CollegeAuthApi(token)
                    if (!auth || !auth.auth) {
                        navigate("/landing")
                    }
                } else {
                    navigate("/landing")
                }
            } 
        }
        auth()
    }, []);

    // return
    return (
        <>
            <NavbarComponent now={'dashboard'} />
            <SidebarComponent now={'dashboard'} />
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-900">
                <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5 mt-3">
                    <h1 className="text-3xl text-white font-bold text-center">Dashboard</h1>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import { CanteenAuthApi } from "../apis/canteen";
import { CollegeAuthApi } from "../apis/college";

const LandingPage = () => {
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
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/")
                    }
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                if (token) {
                    const auth = await CollegeAuthApi(token)
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/")
                    }
                }
            } 
        }
        auth()
    }, []);

    // handle submit
    const handleSubmit = (admin) => {
        localStorage.setItem("admin", admin)
        navigate("/login")
    }

    // return
    return (
        <>
            <NavbarComponent now={''} />
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-900 px-4">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://t3.ftcdn.net/jpg/07/52/70/26/360_F_752702693_UcYNYcWgDY5fEwG3xN7j5iwFIPQGC3jx.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2, // Adjust for transparency
                        zIndex: 0,
                    }}
                ></div>

                {/* Content */}
                <div className="relative flex">
                    <div
                        onClick={() => handleSubmit('college')}
                        className="flex w-72 h-40 mr-3 justify-center items-center border-2 border-yellow-500 hover:bg-yellow-500 text-white hover:text-black rounded-lg px-10 py-10 font-bold text-lg uppercase"
                    >
                        <h1>College</h1>
                    </div>
                    <div
                        onClick={() => handleSubmit('canteen')}
                        className="flex w-72 h-40 ml-3 justify-center items-center border-2 border-yellow-500 hover:bg-yellow-500 text-white hover:text-black rounded-lg px-10 py-10 font-bold text-lg uppercase"
                    >
                        <h1>Canteen</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;
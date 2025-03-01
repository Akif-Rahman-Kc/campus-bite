import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import { CanteenAuthApi, CanteenLoginApi } from "../apis/canteen";
import { CollegeAuthApi, CollegeLoginApi } from "../apis/college";
import { async } from "rxjs";

const LoginPage = () => {
    // navigate
    const navigate = useNavigate()

    // states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorUsername, setErrorUsername] = useState("")
    const [errorPassword, setErrorPassword] = useState("")

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
    const handleSubmit = async () => {
        if (username || password) {
            if (username) {
                setErrorUsername("")
            }
            if (password) {
                if (password.length >= 8) {
                    setErrorPassword("")
                } else {
                    setErrorPassword("Please enter valid password")
                }
            }
            if (username && password) {
                if (password.length >= 8) {
                    const admin = localStorage.getItem("admin")
                    if (admin === "canteen") {
                        const login = await CanteenLoginApi({ username, password })
                        if (login && login.status === "success" && login.auth) {
                            setErrorUsername("")
                            setErrorPassword("")
                            localStorage.setItem("canteentoken", login.token)
                            navigate("/")
                        } else {
                            if (login.type) {
                                login.type === "username" ? setErrorUsername(login?.message) : setErrorPassword(login?.message)
                            } else {
                                alert(login?.message)
                            }
                        }
                    } else {
                        const login = await CollegeLoginApi({ username, password })
                        if (login && login.status === "success" && login.auth) {
                            setErrorUsername("")
                            setErrorPassword("")
                            localStorage.setItem("collegetoken", login.token)
                            navigate("/")
                        } else {
                            if (login.type) {
                                login.type === "username" ? setErrorUsername(login?.message) : setErrorPassword(login?.message)
                            } else {
                                alert(login?.message)
                            }
                        }
                    }
                }
            }
        } else {
            if (username === "") {
                setErrorUsername("Please enter username")
            }
            if (password === "") {
                setErrorPassword("Please enter password")
            }
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={''} />
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-900">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/022/576/369/small/image-of-wooden-table-in-front-of-abstract-blurred-background-of-resturant-lights-wood-table-top-on-blur-of-lighting-in-night-cafe-restaurant-background-selective-focus-generative-ai-photo.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2, // Adjust this for the transparency of the image
                        zIndex: 0,
                    }}
                ></div>

                {/* Content Container */}
                <div className="relative w-96 border border-yellow-500 rounded-lg px-10 py-10 z-10">
                    <h1 className="text-3xl font-bold text-center mt-3 mb-6 text-white">Login</h1>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        className={`shadow appearance-none border bg-gray-900 rounded-md w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-4 ${errorUsername ? 'border-red-500' : 'border-gray-500'}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errorUsername && <p className="text-red-500 text-xs">{errorUsername}</p>}
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        className={`shadow appearance-none border bg-gray-900 rounded-md w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-4 ${errorPassword ? 'border-red-500' : 'border-gray-500'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorPassword && <p className="text-red-500 text-xs">{errorPassword}</p>}
                    <button
                        onClick={handleSubmit}
                        className="w-full border-2 border-yellow-500 hover:bg-yellow-500 text-white hover:text-black text-md font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-8 mb-8"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
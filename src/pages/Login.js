import { useEffect, useRef } from 'react';
import { useAuth } from "../hooks/AuthProvider";
import './../App.css';
import { useCookies } from 'react-cookie';

export function Login() {
    // Correct use of useCookies for cookie handling
    const [cookies, setCookie] = useCookies(['skripsi-form']);
    
    const hasRendered = useRef(false);

    const input = {
        email: useRef(),
        password: useRef()
    };

    const auth = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if both email and password have values
        if (input.email.current.value !== "" && input.password.current.value !== "") {
            const data = {
                email: input.email.current.value,
                password: input.password.current.value
            };

            // Call the loginAction from the auth context
            auth.loginAction(data);
        }
    };

    useEffect(() => {
        if (!hasRendered.current) {
            hasRendered.current = true;
            return;
        }

        // Cek token di kukis
        if (cookies['skripsi-form']) {
            // Optional: Handle token loading logic
            console.log("Token from cookie: ", cookies['skripsi-form']);
        }
    }, [cookies]); // Re-run if cookies change

    return (

        <div className="w-full min-h-screen flex justify-center items-center bg-white relative overflow-hidden">
        {/* Background image */}
        <img className="absolute w-[837px] h-[543px]" src="logo_fti.png" alt="Background" />

        {/* Blurred overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[25px]"></div>

        {/* Form */}
        <form
            onSubmit={handleSubmit}
            method="POST"
            className="p-[30px] bg-white rounded-lg shadow-lg relative z-10 flex flex-col items-center gap-6 max-w-[400px] w-full"
        >
            {/* Logo */}
            <img className="w-[67px] h-12" src="logo_fti.png" alt="FTI Logo" />

            {/* Email Input */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-gray-800 text-base font-semibold">Email</label>
                <input
                    type="text"
                    placeholder="Masukan Username"
                    ref={input.email}
                    defaultValue="admin@email.com"
                    className="w-full h-10 bg-white rounded border border-blue-500 px-2"
                />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-gray-800 text-base font-semibold">Kata Sandi</label>
                <input
                    type="password"
                    placeholder="Masukan Password"
                    ref={input.password}
                    defaultValue="123"
                    className="w-full h-10 bg-white rounded border border-blue-500 px-2"
                />
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full py-3.5 bg-[#3dc0ef] rounded-[41px] text-white text-center">
                Login
            </button>
        </form>

        {/* Footer */}
        <div className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-lg font-semibold">
            @2024. Universitas Kristen Duta Wacana
        </div>
    </div>
    );
}

// import { useEffect, useRef } from 'react';
// import { useAuth } from "../hooks/AuthProvider";
// import './../App.css';
// import { useCookies } from 'react-cookie';

// export function Login() {
//     // Correct use of useCookies for cookie handling
//     const [cookies, setCookie] = useCookies(['skripsi-form']);
    
//     const hasRendered = useRef(false);

//     const input = {
//         email: useRef(),
//         password: useRef()
//     };

//     const auth = useAuth();

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         // Check if both email and password have values
//         if (input.email.current.value !== "" && input.password.current.value !== "") {
//             const data = {
//                 email: input.email.current.value,
//                 password: input.password.current.value
//             };

//             // Call the loginAction from the auth context
//             auth.loginAction(data);
//         }
//     };

//     useEffect(() => {
//         if (!hasRendered.current) {
//             hasRendered.current = true;
//             return;
//         }

//         // Check if a token is available in cookies and do something with it
//         if (cookies['skripsi-form']) {
//             // Optional: Handle token loading logic
//             console.log("Token from cookie: ", cookies['skripsi-form']);
//         }
//     }, [cookies]); // Re-run if cookies change

//     return (
//         <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen'>
//             <form onSubmit={handleSubmit} method="POST" className='border-2 p-6 rounded-md space-y-4'>
//                 <h1 className='text-2xl font-semibold'>Masukkan Email dan Password</h1>

//                 <div className='text-gray-500'>dummy@email.com</div>
//                 <div className='text-gray-500'>123</div>

//                 <div className='bottom-4'>
//                     <input
//                         type='text'
//                         placeholder='Username'
//                         ref={input.email}
//                         defaultValue={"dummy@email.com"}
//                         className='border-2 w-full rounded-3xl p-2'
//                     />
//                 </div>

//                 <div>
//                     <input
//                         type='password'
//                         placeholder='Password'
//                         ref={input.password}
//                         defaultValue={"123"}
//                         className='border-2 w-full rounded-3xl p-2'
//                     />
//                 </div>

//                 <div>
//                     <button
//                         type="submit"
//                         value="Submit"
//                         className='w-full border-2 rounded-3xl bg-blue-500 text-white p-2'
//                     >
//                         Login
//                     </button>
//                 </div>
//             </form>
//         </section>
//     );
// }

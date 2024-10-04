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

        // Check if a token is available in cookies and do something with it
        if (cookies['skripsi-form']) {
            // Optional: Handle token loading logic
            console.log("Token from cookie: ", cookies['skripsi-form']);
        }
    }, [cookies]); // Re-run if cookies change

    return (
        //             <form onSubmit={handleSubmit} method="POST" className='border-2 p-6 rounded-md space-y-4'>

        <div  className="w-full h-full flex bg-white">
            <img className="w-[837px] h-[543px] left-[301px] top-[278px] absolute" src="logo_fti.png" />
            <div className="w-[1440px] h-[882px] left-0 top-[142px] absolute bg-white/10 backdrop-blur-[25px]"></div>
            <div className="w-[1440px] h-[68px] left-0 top-[957px] absolute">
                <div className="w-[1440px] px-[117px] py-[18px] left-0 top-0 absolute bg-white justify-end items-center inline-flex">
                    <div className="text-right text-gray-500 text-lg font-semibold font-['Inter'] leading-7">@2024. Universitas Kristen Duta Wacana</div>
                </div>
                <img className="w-[79px] h-[50.43px] left-[117px] top-[9.08px] absolute" src="logo_fti.png" />
            </div>

            <form onSubmit={handleSubmit} method="POST" className="p-[30px] left-[508px] top-[306px] absolute bg-white rounded-lg justify-start items-start gap-2.5 inline-flex">
                <div className="flex-col justify-start items-center gap-6 inline-flex">
                    <img className="w-[67px] h-12" src="logo_fti.png" />
                    <div className="flex-col justify-start items-start gap-14 flex">
                        <div className="flex-col justify-start items-center gap-6 flex">
                            <div className="h-[72px] flex-col justify-start items-start gap-2 flex">
                                <div className="self-stretch justify-start items-start inline-flex">
                                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
                                        <div className="text-gray-800 text-base font-semibold font-['Inter'] leading-normal">Email</div>
                                    </div>
                                </div>
                                <div className="self-stretch h-10 bg-green-500 shadow-inner flex-col justify-start items-start gap-2 flex">
                                    <input
                                        type='text'
                                        placeholder='Username'
                                        ref={input.email}
                                        defaultValue={"dummy@email.com"}
                                        className="self-stretch h-10 bg-white rounded border border-red-500 justify-start items-center gap-2 inline-flex">
                                        
                                    </input>
                                </div>
                            </div>

                            <div className="h-[72px] flex-col justify-start items-start gap-2 flex">
                                <div className="self-stretch justify-start items-start inline-flex">
                                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
                                        <div className="text-gray-800 text-base font-semibold font-['Inter'] leading-normal">Kata Sandi</div>
                                    </div>
                                </div>
                                <div className="self-stretch h-10 flex-col justify-start items-start gap-2 flex">
                                    <div className="self-stretch h-10 bg-white rounded border border-gray-300 justify-start items-center gap-2 inline-flex">
                                        <input 
                                            type='password'
                                            placeholder='Password'
                                            ref={input.password}
                                            defaultValue={"123"}
                                            className="self-stretch h-10 bg-white rounded border border-red-500 justify-start items-center gap-2 inline-flex">
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Login Button */}
                        <button type="submit" value="Submit" className="w-[363px] px-4 py-3.5 bg-[#3dc0ef] rounded-[41px] justify-center items-center gap-2 inline-flex">
                            Login
                        </button>
                    </div>
                </div>
            </form>
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

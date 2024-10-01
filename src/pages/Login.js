import { useEffect, useRef } from 'react';
import { useAuth } from "../hooks/AuthProvider";
import './../App.css';
import { useCookies } from 'react-cookie';


export function Login() {
    const cookie = useCookies();
    const hasRendered = useRef(false);

    const input = {
        email: useRef(),
        password: useRef()
    }

    const auth = useAuth();
    const handleSubmit = (event) => {
        event.preventDefault()
        if (input.email.current.value !== "" && input.password.current.value !== "") {
            const data = {
                email: input.email.current.value,
                password: input.password.current.value
            }
            auth.loginAction(data);
            return;
        }
    }

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        //if (cookie[0]['skripsi-form']) handleLoad({ token: cookie[0]['skripsi-form'] });
    }, [])

    return (
//         <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen'>
//   <img className="w-[837px] h-[543px] left-[301px] top-[278px] absolute" src="https://via.placeholder.com/837x543" />
  
//   <div className="w-[1440px] h-[882px] left-0 top-[142px] absolute bg-white/10 backdrop-blur-[25px]" />
//   <div className="w-7 h-7 left-[1357px] top-[64px] absolute">
//     <div className="w-7 h-7 left-0 top-0 absolute bg-[#d9d9d9] rounded-full" />
//     <div className="w-7 h-[0px] left-[24.12px] top-[4.38px] absolute origin-top-left rotate-[135deg] border border-white"></div>
//     <div className="w-7 h-[0px] left-[24.12px] top-[23.66px] absolute origin-top-left rotate-[-135deg] border border-white"></div>
//   </div>
//   <div className="w-[1440px] h-[68px] left-0 top-[957px] absolute">
//     <div className="w-[1440px] px-[117px] py-[18px] left-0 top-0 absolute bg-white justify-between items-center inline-flex">
//       <div className="text-right text-gray-500 text-lg font-semibold font-['Inter'] leading-7">@2024. Universitas Kristen Duta Wacana</div>
//     </div>
//     <img className="w-[79px] h-[50.43px] left-[117px] top-[9.08px] absolute" src="https://via.placeholder.com/79x50" />
//   </div>
//   <div className="p-[30px] left-[508px] top-[306px] absolute bg-white rounded-lg justify-start items-start gap-2.5 inline-flex">
//     <div className="flex-col justify-start items-center gap-6 inline-flex">
//       <img className="w-[67px] h-12" src="https://via.placeholder.com/67x48" />
//       <div className="flex-col justify-start items-start gap-14 flex">
//         <div className="flex-col justify-start items-center gap-6 flex">
//           <div className="h-[72px] flex-col justify-start items-start gap-2 flex">
//             <div className="self-stretch justify-start items-start inline-flex">
//               <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
//                 <div className="text-gray-800 text-base font-semibold font-['Inter'] leading-normal">Email</div>
//               </div>
//             </div>
//             <div className="self-stretch h-10 bg-green-500 shadow-inner flex-col justify-start items-start gap-2 flex">
//               <div className="self-stretch h-10 bg-white rounded border border-red-500 justify-start items-center gap-2 inline-flex">
//                 <div className="w-[0px] h-10 relative">
//                   <div className="w-10 h-[0px] left-0 top-[40px] absolute origin-top-left -rotate-90" />
//                 </div>
//                 <div className="grow shrink basis-0 h-6 justify-start items-center flex">
//                   <input type='text' placeholder='Username' ref={input.email} defaultValue={"dummy@email.com"} className='border-2 w-full rounded-3xl'/>
//                 </div>
//                 <div className="w-[0px] h-10 relative">
//                   <div className="w-10 h-[0px] left-0 top-[40px] absolute origin-top-left -rotate-90" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="h-[72px] flex-col justify-start items-start gap-2 flex">
//             <div className="self-stretch justify-start items-start inline-flex">
//               <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
//                 <div className="text-gray-800 text-base font-semibold font-['Inter'] leading-normal">Kata Sandi</div>
//               </div>
//             </div>
//             <div className="self-stretch h-10 flex-col justify-start items-start gap-2 flex">
//               <div className="self-stretch h-10 bg-white rounded border border-gray-300 justify-start items-center gap-2 inline-flex">
//                 <div className="w-[0px] h-10 relative">
//                   <div className="w-10 h-[0px] left-0 top-[40px] absolute origin-top-left -rotate-90" />
//                 </div>
//                 <div className="grow shrink basis-0 h-6 justify-start items-center flex">
//                   <input type='password' placeholder='Password' ref={input.password} defaultValue={"123"} className='border-2 w-full rounded-3xl'/>
//                 </div>
//                 <div className="w-5 h-5 relative" />
//                 <div className="w-[0px] h-10 relative">
//                   <div className="w-10 h-[0px] left-0 top-[40px] absolute origin-top-left -rotate-90" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-[363px] px-4 py-3.5 bg-[#3dc0ef] rounded-[41px] justify-center items-center gap-2 inline-flex">
//           <button type="submit" value="Submit" className='w-full border-2 rounded-3xl'>Login</button>
//         </div>
//       </div>
//     </div>
//   </div>
  
        <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen'>
            <form onSubmit={handleSubmit}  method="POST" className='border-2 p-6 rounded-md space-y-4'>
                <h1>Masukkan Email dan Password</h1>
                <div>dummy@email.com</div>
                <div>123</div>
                <div className='bottom-4'>
                    <input type='text' placeholder='Username' ref={input.email} defaultValue={"dummy@email.com"} className='border-2 w-full rounded-3xl'/>
                </div>

                <div>
                    <input type='password' placeholder='Password' ref={input.password} defaultValue={"123"} className='border-2 w-full rounded-3xl'/>
                </div>
                <div className=''>
                    <button type="submit" value="Submit" className='w-full border-2 rounded-3xl'>Login</button>
                </div>
            </form>
        </section>
    )
}
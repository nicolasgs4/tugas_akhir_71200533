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
import './../App.css';

import Headbar from '../components/Headbar';
import Sidebar from '../components/Sidebar';
import Create from './Create';
import Dashboard from './Dashboard';
// import View from './View';
import Analysis from './Analysis';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

export function Main({content}) {  
    const cookie = useCookies(['skripsi-form']);
    const [userData, setUserData] = useState([]);
    
    const handleLoad = async (data) => {
        try {
            const response = await fetch("/main", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            //tunggu res server.js /main
            const res = await response.json();

            if (res) {
                setUserData(res);
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {
        handleLoad({token: cookie[0]['skripsi-form']});
    }, [])


    const contentLoader = () => {
        switch (content) {
            case 0:
                return <Dashboard/>
            case 1: 
                return <Create email={userData.email} username={userData.username} />
            // case 2:
            //     return <View email={userData.email} username={userData.username}></View>
            case 3:
                return <Analysis email={userData.email} username={userData.username}></Analysis>
        }
    }

    return (
        <div className='flex'>
            <Sidebar content={content}/>

            <div className='w-full'>
                {
                    userData ?
                    <div className='h-[100px]'>
                        <Headbar
                            email={userData.email} username={userData.username}
                        /> 
                    </div>
                    : null
                }
                <div className='h-[88%]'>
                    {contentLoader()}
                </div>
            </div>

        </div>
    )
}
export default Main;
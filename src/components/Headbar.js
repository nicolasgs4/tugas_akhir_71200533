import './../App';
import { useAuth } from "../hooks/AuthProvider";

const Headbar = ({email, username}) => {
    const auth = useAuth();
    const handleLogOut = (event) => {
        event.preventDefault();
        auth.logOut();
    }

    return (
        <div className="w-full fixed top-0 z-10 px-10 py-[15px] pr-80 bg-neutral-50 border border-sky-400 flex justify-between items-center box-border">
            <div className="text-sky-400 text-2xl font-black font-['Montserrat']">DASHBOARD</div>
            <div className="h-14 justify-center items-center gap-3 flex">
                <img className="w-14 h-14 relative rounded-2xl" src="https://via.placeholder.com/56x56" />
                <div className="gap-5 justify-center items-start inline-flex justify-end">
                <div className="flex-col">
                <div className="flex justify-end items-center gap-5">
                    <div className="w-[150px] text-zinc-950 text-base font-bold font-['Open Sans']">{username}</div>
                    </div>
                    <div className="text-neutral-800 text-sm font-normal font-['Open Sans']">{email}</div>
                    </div>
                    <button className="w-[105px] h-[37px] px-2.5 py-2 bg-red-500 rounded-[41px] justify-center items-center gap-1 flex" onClick={handleLogOut}>
                <div className="text-white text-sm font-semibold font-['Inter'] leading-[21px]" >Logout</div>
            </button>
                </div>
            </div>
            
        </div>
    )
}
export default Headbar;
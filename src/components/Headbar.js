import './../App';
import { useAuth } from "../hooks/AuthProvider";

const Headbar = ({email, username}) => {
    const auth = useAuth();
    const handleLogOut = (event) => {
        event.preventDefault();
        auth.logOut();
    }

    return (
        <div className="w-full h-[70px] px-10 py-[15px] bg-neutral-50 border border-sky-400 justify-end items-center gap-2.5 inline-flex">
            <div className="text-sky-400 text-2xl font-black font-['Montserrat']">Buat Kuesioner</div>
            <div className="h-14 justify-center items-center gap-3 flex">
                <img className="w-14 h-14 relative rounded-2xl" src="https://via.placeholder.com/56x56" />
                <div className="flex-col justify-center items-start inline-flex">
                    <div className="w-[150px] text-zinc-950 text-base font-bold font-['Open Sans']">{username}</div>
                    <div className="text-neutral-800 text-sm font-normal font-['Open Sans']">{email}</div>
                </div>
            </div>
            <button className="w-[105px] h-[37px] px-2.5 py-2 bg-red-500 rounded-[41px] justify-center items-center gap-1 flex" onClick={handleLogOut}>
                <div className="text-white text-sm font-semibold font-['Inter'] leading-[21px]" >Logout</div>
            </button>
        </div>
    )
}
export default Headbar;
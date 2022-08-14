import { useRouter } from 'next/router'

export default function AskMe() {
    const router = useRouter();
    const { accountID } = router.query;

    return (
        <div className="bg-slate-800 w-screen h-screen font-Prompt text-4xl">
            <div className="w-full h-[15%]"/>
            <div className="bg-slate-500 w-10/12 pb-10 overflow-clip rounded-3xl mx-auto text-center text-2xl shadow-2xl shadow-slate-700">
                <p className="bg-text py-2 text-black font-extrabold">@{accountID}</p>
                <p className="w-10/12 mx-auto mt-4">{'กระต่ายกับเต่าอะไรเกิดก่อนกัน'}</p>
                <div className="mt-4 w-3/4 bg-white bg-opacity-60 mx-auto p-1 rounded-full">
                    <input className="px-2 w-full bg-transparent text-black focus:outline-none"></input>
                </div>
            </div>

            <div className="bg-text text-slate-800 w-1/2 text-center py-3 rounded-full mx-auto mt-[25vh] text-3xl shadow-2xl shadow-slate-700 font-bold active:scale-[0.98]">
                ส่ง
            </div>
        </div>
    );
}
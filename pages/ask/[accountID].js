import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

export default function AskMe() {
    const router = useRouter();
    const { accountId } = router.query;

    const [question, setQuestion] = useState('');

    useEffect(() => {
        if (!accountId) return;

        const fetchData = async () => {
            var data = await fetch(`/api/question/${accountId}`);
            var json = await data.json();

            if (data.status == 200) {
                return setQuestion(json.data.title);
            }

            console.log(json); // For Error
        };

        fetchData().catch(error => console.error(error));
    }, [accountId]);

    return (
        <div className="bg-slate-800 w-screen h-screen font-Prompt text-4xl flex justify-center">
            <div className="my-auto w-full">
                <div className="bg-slate-500 w-10/12 pb-10 overflow-clip rounded-3xl mx-auto text-center text-2xl shadow-2xl shadow-slate-700 lg:w-1/3">
                    <p className="bg-text py-2 text-black font-extrabold">@{accountId}</p>
                    <p className="w-10/12 mx-auto mt-4">{question}</p>
                    <div className="mt-4 w-3/4 bg-white bg-opacity-60 mx-auto p-1 rounded-full">
                        <input className="px-2 w-full bg-transparent text-black focus:outline-none"></input>
                    </div>
                </div>

                <div className="bg-text text-slate-800 w-1/2 text-center py-3 rounded-full mx-auto mt-[25vh] text-3xl shadow-2xl shadow-slate-700 font-bold active:scale-[0.98] lg:w-2/12">
                    ส่ง
                </div>
            </div>
        </div>
    );
}
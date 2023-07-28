import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router'

import LoadingSpinner from '../../components/LoadingSpinner';
import BaseHead from '../../components/BaseHead';

export default function AskMe() {
    const router = useRouter();
    const { accountId } = router.query;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [responseError, setResponseError] = useState(false);
    const [response, setResponse] = useState('');

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        if (!accountId) return;

        const fetchData = async () => {
            const res = await fetch(`/api/question/${accountId}`);
            const json = await res.json();
            setLoading(false);

            if (res.status == 200) {
                return setQuestion(json.data.title);
            }

            if ('error' in json) {
                return setError(json.error.message);
            }

            console.log(json); // For Error
        };

        fetchData().catch(error => console.error(error));
    }, [accountId]);

    function handleAnswerChange(text) {
        return setAnswer(text);
    }

    function handleSendAnswer() {
        if (answer == '') {
            setResponseError(true);
            setResponse('Answet can\'t be emptied');
            return;
        }

        const sendData = async () => {
            const res = await fetch(`/api/question/${accountId}?text=${answer}`, {
                method: 'POST'
            });
            const json = await res.json();

            if (res.status == 200) {
                setResponseError(false);
                setResponse('Added answer successfully!');
                return;
            }

            if ('error' in json) {
                setResponseError(true);
                setResponse(json.error.message);
                return;
            }
            console.log(json); // For Error
        };

        sendData().catch(error => console.error(error));
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner className="scale-150 sm:scale-100" />
        </div>
    );

    if (error) return error;

    return (
        <div className="bg-slate-800 w-screen h-screen font-Prompt text-4xl flex justify-center">
            <BaseHead title={`@${accountId} | AskMe`} />

            <div className="my-auto w-full">
                <div className="bg-slate-500 w-10/12 pb-10 overflow-clip rounded-3xl mx-auto text-center text-2xl shadow-2xl shadow-slate-700 lg:w-1/3">
                    <p className="bg-text py-2 text-black font-extrabold">@{accountId}</p>
                    <p className="w-10/12 mx-auto mt-4">{question}</p>

                    {/* Input */}
                    <div className="mt-4 w-3/4 bg-white bg-opacity-60 mx-auto p-1 rounded-full ">
                        <input className="px-2 w-full bg-transparent text-black focus:outline-none" onChange={(e) => handleAnswerChange(e.target.value)}></input>
                    </div>
                </div>

                {/* Resposne */}
                {response && <p className={`font-mono text-center text-xl mt-5 ${responseError ? 'text-red-500' : 'text-green-500'}`}>
                    {response}
                </p>}

                {/* Send Button */}
                <div
                    className="bg-text text-slate-800 select-none w-1/2 text-center py-3 rounded-full mx-auto mt-[25vh] text-3xl shadow-2xl shadow-slate-700 font-bold active:scale-[0.98] lg:w-2/12 hover:cursor-pointer"
                    onClick={(e) => handleSendAnswer()}
                >ส่ง!
                </div>
            </div>
        </div>
    );
}
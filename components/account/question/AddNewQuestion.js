import React, { useState } from 'react';

export default function AddNewQuestion(props) {
    console.log('test');

    const [isPrimary, setIsPrimary] = useState(false);
    const [title, setTitle] = useState('');

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    function handleAddNewQuestion() {
        if (title == '' || title == undefined) {
            setError(true);
            setMessage('กรุณากรอกคำถาม');
            return;
        }

        postQuestion().catch(error => {
            console.log(error);
            
            setError(true);
            setMessage(error);
        });
    }

    async function postQuestion() {
        const res = await fetch(`/api/account/question?title=${title}&isPrimary=${isPrimary}`, {
            method: 'POST'
        });
        const json = await res.json();

        if (res.status == 200) {
            setError(false);
            setMessage('คำถามสร้างเรียบร้อย!');
            return;
        }

        if ('error' in json) {
            setError(true);
            setMessage(json.error.message);
            return;
        }
    }

    return (
        <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50">
            <div className="absolute w-80 h-min top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow rounded-md text-black font-Prompt">
                {/* Head */}
                <p className="text-2xl m-3 ml-5 py-1 select-none">เพิ่มคำถาม</p>
                <div className="bg-gray-300 w-full h-[1px]" />

                <div className="m-3 sm:m-4">
                    {/* Question Title */}
                    <div className="font-semibold mb-1 ml-1 flex select-none">คำถาม<p className="text-red-500 ml-1">*</p></div>
                    <input onChange={(e) => setTitle(e.target.value)} type="text" className="bg-gray-100 shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>

                    {/* Check Box */}
                    <div className="mt-3">
                        <input type="checkbox" className="text-blue-600 bg-gray-100 rounded border-gray-300" onChange={(e) => setIsPrimary(e.target.checked)}></input>
                        <label className="font-semibold select-none ml-1">ตั้งเป็นคำถามหลัก</label>
                    </div>

                    {/* Alert */}
                    {(message != '') &&
                        <p className={`${error ? "text-red-500" : "text-green-500"} py-3 text-right font-semibold font-Prompt`}>{message}</p>
                    }

                    {/* Bottons */}
                    <div className="flex mt-5">
                        <button className="bg-gray-200 px-3 py-1 rounded shadow mx-auto mr-2" onClick={() => props.toggleAddQuestionMenu()}>ปิด</button>
                        <button className="bg-green-400 px-3 py-1 rounded shadow text-white" onClick={() => handleAddNewQuestion()}>ยืนยัน</button>
                    </div>
                </div>
            </div>
        </div>
    );

}
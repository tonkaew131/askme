import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';

// Icons
import { AiFillPlusCircle } from 'react-icons/ai';

// Component
function SearchMenu(props) {
    return (
        <div className="text-black font-Prompt mx-4 mt-4">
            {/* Head */}
            <div className="flex">
                <p className="text-3xl font-semibold select-none">My Questions</p>
                <AiFillPlusCircle size="2em" className="my-auto ml-2 hover:cursor-pointer" color="#3B82F6" onClick={() => props.toggleAddQuestionMenu()} />
            </div>

            {/* Body */}
            <div className="mt-3 sm:flex sm:mt-5">
                {/* Search */}
                <div className="sm:flex">
                    <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">ค้นหา: </p>
                    <input placeholder={`${props.count} คำถาม...`} className="bg-white shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>
                </div>

                <div className="flex">
                    {/* Types */}
                    <div className="sm:flex mt-1 sm:mt-0 sm:ml-5">
                        <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">ประเภท: </p>
                        <select name="types" id="types" defaultValue="ALL" className="bg-white shadow py-2 px-3 rounded focus:outline-none">
                            <option value="ALL">All</option>
                        </select>
                    </div>

                    {/* Sort by */}
                    <div className="sm:flex mt-1 ml-5">
                        <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">เรียงโดย: </p>
                        <select name="sortBy" id="sortBy" defaultValue="DATE_ASCENT" className="bg-white shadow py-2 px-3 rounded focus:outline-none">
                            <option value="DATE_ASCENT">ล่าสุด</option>
                            <option value="DATE_DESCENT">เก่าสุด</option>
                            <option value="NUMBER_OF_ANSWER_ASCENT">จำนวนคำตอบ</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Component
function AddNewQuestion(props) {
    return (
        <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50">
            <div className="absolute w-80 h-min top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow rounded-md text-black font-Prompt">
                {/* Head */}
                <p className="text-2xl m-3 ml-5 py-1 select-none">เพิ่มคำถาม</p>
                <div className="bg-gray-300 w-full h-[1px]" />

                <div className="m-3 sm:m-4">
                    {/* Question Title */}
                    <div className="font-semibold mb-1 ml-1 flex select-none">คำถาม<p className="text-red-500 ml-1">*</p></div>
                    <input onChange={(e) => props.onTitleChange(e.target.value)} type="text" className="bg-gray-100 shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>

                    {/* Alert */}
                    {(props.message != '') &&
                        <p className={`${props.error ? "text-red-500" : "text-green-500"} py-3 text-right font-mono`}>{props.message}</p>
                    }

                    {/* Bottons */}
                    <div className="flex mt-5">
                        <button className="bg-gray-200 px-3 py-1 rounded shadow mx-auto mr-2" onClick={() => props.toggleAddQuestionMenu()}>ปิด</button>
                        <button className="bg-green-400 px-3 py-1 rounded shadow text-white" onClick={() => props.addNewUser()}>ยืนยัน</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Component
function UserTable(props) {
    let length = props.questions.length;

    if (length == 0) {
        return (
            <div className="text-black font-mono font-bold flex justify-center items-center h-48 text-center text-lg">
                Can&apos;t seem to<br />
                find any questions!
            </div>
        );
    }

    return (
        <div className="mx-4 mt-4 rounded overflow-clip shadow font-Prompt">
            {props.questions.map((question, index) => {
                return (
                    <div key={question.id} className={`text-black w-full ${index % 2 == 1 ? 'bg-white' : 'bg-blue-100'}`}>
                        <div className="flex">
                            <div className="py-2 px-3 mx-auto ml-0">
                                <div className="flex">
                                    {/* Question Title */}
                                    <p className="font-bold text-lg">{question.title}</p>
                                </div>

                                {/* Click to see answer */}
                                <button type="button" className="text-blue-500 underline font-bold">&gt; ดูคำตอบ ({question._count.answers})</button>
                            </div>
                            <button type="button" className="mr-2 underline text-blue-500 font-bold px-3">แก้ไข</button>
                        </div>

                        {(index < length - 1) && <div className="w-full h-[1px] bg-gray-300" />}
                    </div>
                );
            })}
        </div>
    );
}

export default withPageAuthRequired(function Profile({ user }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [questionData, setQuestionData] = useState([]);
    const [addQuestionMenu, setAddQuestionMenu] = useState(false);

    function handleToggleAddQuestionMenu() {
        if (!addQuestionMenu) {
            setAddQuestionMenu('');
        }

        return setAddQuestionMenu(!addQuestionMenu);
    }

    async function fetchQuestion() {
        var data = await fetch(`/api/account/question`);
        var json = await data.json();

        if (data.status == 200) {
            setQuestionData(json.data.questions);
            setLoading(false);
            return;
        }

        if ('error' in json) {
            return setError(json.error.message);
        }

        console.log(json); // For Error
    }

    useEffect(() => {
        fetchQuestion().catch(error => console.error(error));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner className="scale-150 sm:scale-100" />
        </div>
    );

    if (error) return error;

    return (
        <div className="bg-gray-100 w-screen min-h-screen h-full pb-5">
            <Head>
                <title>Manage Questions | AskMe</title>
            </Head>

            <Navbar />
            <SearchMenu
                toggleAddQuestionMenu={() => handleToggleAddQuestionMenu()}
                count={questionData.length}
            />
            <UserTable
                questions={questionData}
            />

            {addQuestionMenu && <AddNewQuestion
                toggleAddQuestionMenu={() => handleToggleAddQuestionMenu()}
            // addNewUser={() => handleAddNewUser()}
            // error={addUserError}
            // message={addUserMessage}
            // onEmailChange={(email) => setAddUserEmail(email)}
            // onInstagramIdChange={(instagramId) => setAddUserInstagramId(instagramId)}
            />}
        </div>
    );
});
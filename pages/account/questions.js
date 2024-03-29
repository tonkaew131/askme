import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { formatTimeAgo } from '../../shared/utils';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// Main components
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import BaseHead from '../../components/BaseHead';

// Page components
import AddNewQuestion from '../../components/account/question/AddNewQuestion';

// Icons
import { AiFillPlusCircle, AiFillClockCircle, AiFillStar } from 'react-icons/ai';

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
function QuestionTable(props) {
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
                                {/* Question Title */}
                                <div className="flex">
                                    {props.id == question.id &&
                                        <AiFillStar className="my-auto mr-1 text-blue-500" />
                                    }
                                    <p className="font-bold text-lg break-all">{question.title}</p>
                                </div>

                                {/* Time ago */}
                                <div className="flex text-gray-500 text-sm">
                                    <AiFillClockCircle className="my-auto mr-1" />
                                    {formatTimeAgo(new Date(question.createdAt))}
                                </div>

                                {/* Click to see answer */}
                                <Link href={`/account/question/${question.id}`}>
                                    <button type="button" className="text-blue-500 underline font-bold select-none">&gt; ดูคำตอบ ({question._count.answers})</button>
                                </Link>
                            </div>

                            {/* Edit button */}
                            <button type="button" className="mr-2 underline text-blue-500 font-bold px-3 select-none">แก้ไข</button>
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

    const [questionId, setQuestionId] = useState();
    const [questionData, setQuestionData] = useState([]);
    const [addQuestionMenu, setAddQuestionMenu] = useState(false);

    function handleToggleAddQuestionMenu() {
        if (addQuestionMenu) {
            fetchQuestion().catch(error => console.error(error));
        }

        return setAddQuestionMenu(!addQuestionMenu);
    }

    async function fetchQuestion() {
        var data = await fetch(`/api/account/question`);
        var json = await data.json();

        if (data.status == 200) {
            setQuestionId(json.data.primaryQuestionId);
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
            <BaseHead title="Manage Questions | AskMe" />

            <Navbar />
            <SearchMenu
                toggleAddQuestionMenu={() => handleToggleAddQuestionMenu()}
                count={questionData.length}
            />
            <QuestionTable
                id={questionId}
                questions={questionData}
            />

            {addQuestionMenu && <AddNewQuestion
                toggleAddQuestionMenu={() => handleToggleAddQuestionMenu()}
            />}
        </div>
    );
});
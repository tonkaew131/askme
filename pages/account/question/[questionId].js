import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';

// Main Component
import Navbar from '../../../components/Navbar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import BaseHead from '../../../components/BaseHead';

// Pages Component
import AnswerTable from '../../../components/account/question/Answer/AnswerTable';

// Icons
import { IoMdReturnLeft } from 'react-icons/io';

// Component
function SearchMenu(props) {
    return (
        <div className="text-black font-Prompt ml-4 mt-4">
            {/* Head */}
            <div className="flex w-11/12">
                <Link href="/account/questions">
                    <div className="bg-blue-500 my-auto px-3 py-1 rounded-lg mr-3 hover:cursor-pointer">
                        <IoMdReturnLeft className="" color="white" />
                    </div>
                </Link>

                <p className="text-3xl font-semibold break-all">&quot;{props.title}&quot;</p>
            </div>

            {/* Body */}
            <div className="mt-3 sm:flex sm:mt-5">
                {/* Search */}
                <div className="sm:flex">
                    <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">ค้นหา: </p>
                    <input placeholder={`${props.count} คำตอบ...`} className="bg-white shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>
                </div>

                <div className="flex">
                    {/* Sort by */}
                    <div className="sm:flex mt-1 sm:ml-5 ml-0">
                        <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">เรียงโดย: </p>
                        <select name="sortBy" id="sortBy" defaultValue="DATE_ASCENT" className="bg-white shadow py-2 px-3 rounded focus:outline-none">
                            <option value="DATE_ASCENT">ล่าสุด</option>
                            <option value="DATE_DESCENT">เก่าสุด</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withPageAuthRequired(function Profile({ user }) {
    const router = useRouter();
    const { questionId } = router.query;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [answers, setAnswers] = useState([]);
    const [data, setData] = useState();

    useEffect(() => {
        if (questionId == undefined) return;

        fetchAnswer().catch(error => console.error(error));
    }, [questionId]);

    async function fetchAnswer() {
        const res = await fetch(`/api/account/question/${questionId}`);
        const json = await res.json();
        setLoading(false);

        if (res.status == 200) {
            setData(json.data);
            setAnswers(json.data.answers);
            return;
        }

        if ('error' in json) {
            setError(json.error.message);
            return;
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen w-screen">
            <LoadingSpinner className="scale-150 sm:scale-100" />
        </div>
    );

    if (error) return error;

    return (
        <div className="bg-gray-100 w-screen min-h-screen h-full pb-5 text-black font-Prompt">
            <BaseHead title={`${data.title} | AskMe`} />

            <Navbar />

            <SearchMenu
                title={data.title}
                count={answers.length}
            />
            <AnswerTable
                answers={answers}
                question={data.title}
            />
        </div>
    );
});
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Head from 'next/head';

import Navbar from '../../components/Navbar';

// Icons
import { AiFillPlusCircle } from 'react-icons/ai';

// Component
function SearchMenu(props) {
    return (
        <div className="text-black font-Prompt mx-4 mt-4">
            {/* Head */}
            <div className="flex">
                <p className="text-3xl font-semibold select-none">My Questions</p>
                <AiFillPlusCircle size="2em" className="my-auto ml-2 hover:cursor-pointer" color="#3B82F6" onClick={() => props.toggleAddUserMenu()} />
            </div>

            {/* Body */}
            <div className="mt-3 sm:flex sm:mt-5">
                {/* Search */}
                <div className="sm:flex">
                    <p className="mb-1 sm:my-auto sm:mr-3 select-none font-bold text-lg">ค้นหา: </p>
                    <input placeholder={`${props.count} questions...`} className="bg-white shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>
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
                                <button type="button" className="text-blue-500 underline font-bold">&gt; ดูคำตอบ (0)</button>
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
    let data = { "data": { "questions": [{ "id": "62fa53b2fd2c6dacc6ca24f4", "createdAt": "2022-08-15T14:09:54.722Z", "isDeleted": false, "title": "กระต่ายกับเต่าใครเกิดก่อนกัน", "userId": "62f9107f82af3d4e53663789" }, { "id": "62fa5688ce4956981e6a5f60", "createdAt": "2022-08-15T14:22:00.775Z", "isDeleted": false, "title": "จะถามอะไรนักหนาว่ะ", "userId": "62f9107f82af3d4e53663789" }, { "id": "62fa57f641bb549d0f31da01", "createdAt": "2022-08-15T14:28:06.002Z", "isDeleted": false, "title": "System test 2", "userId": "62f9107f82af3d4e53663789" }] } };
    data = data.data.questions;

    return (
        <div className="bg-gray-100 w-screen min-h-screen h-full pb-5">
            <Head>
                <title>Manage Questions | AskMe</title>
            </Head>

            <Navbar />
            <SearchMenu />
            <UserTable
                questions={data}
            />
        </div>
    );
});
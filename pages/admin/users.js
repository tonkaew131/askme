import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import NavbarAdmin from '../../components/NavbarAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

import { FaWrench } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';

// Component
function SearchMenu(props) {
    return (
        <div className="text-black font-Prompt mx-4 mt-4">
            {/* Head */}
            <div className="flex">
                <p className="text-3xl font-semibold select-none">Manage user</p>
                <AiFillPlusCircle size="2em" className="my-auto ml-2 hover:cursor-pointer" color="#3B82F6" onClick={() => props.toggleAddUserMenu()} />
            </div>

            {/* Body */}
            <div className="mt-3 sm:flex sm:mt-5">
                {/* Search */}
                <div className="sm:flex">
                    <p className="mb-1 sm:my-auto sm:mr-3 select-none">Search: </p>
                    <input placeholder={`${props.count} users...`} className="bg-white shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>
                </div>

                {/* Roles */}
                <div className="sm:flex mt-1 sm:mt-0 sm:ml-5">
                    <p className="mb-1 sm:my-auto sm:mr-3 select-none">Roles: </p>
                    <select name="roles" id="roles" defaultValue="ALL" className="bg-white shadow py-2 px-3 rounded focus:outline-none">
                        <option value="ALL">All</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                        <option value="REVORKED">Revorked</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

// Component
function UserTable(props) {
    let length = props.users.length;
    // console.log(props.users);

    if (length == 0) {
        return (
            <div className="text-black font-mono font-bold flex justify-center items-center h-48 text-center text-lg">
                Can&apos;t seem to<br />
                find any users!
            </div>
        );
    }

    return (
        <div className="mx-4 mt-4 rounded overflow-clip shadow font-Prompt">
            {props.users.map((user, index) => {
                return (
                    <div key={user.id} className={`text-black w-full ${index % 2 == 1 ? 'bg-white' : 'bg-blue-100'}`}>
                        <div className="flex">
                            <div className="py-2 px-3 mx-auto ml-0">
                                <div className="flex">
                                    <p className="font-bold text-lg">@{user.instagramId}</p>
                                    {user.role == 'ADMIN' ?
                                        <FaWrench className="my-auto ml-2" color="#3B82F6" />
                                        : undefined
                                    }
                                </div>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <button type="button" className="mr-2 underline text-blue-500 font-bold px-3">Edit</button>
                        </div>

                        {index < length - 1 ?
                            <div className="w-full h-[1px] bg-gray-300" />
                            : undefined
                        }
                    </div>
                );
            })}
        </div>
    );
}

// Component
function AddNewUser(props) {
    return (
        <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50">
            <div className="absolute w-80 h-min top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow rounded-md text-black font-Prompt">
                {/* Head */}
                <p className="text-2xl m-3 ml-5 py-1 select-none">Add user</p>
                <div className="bg-gray-300 w-full h-[1px]" />

                <div className="m-3 sm:m-4">
                    {/* Email */}
                    <div className="font-semibold mb-1 ml-1 flex select-none">Email<p className="text-red-500 ml-1">*</p></div>
                    <input type="text" className="bg-gray-100 shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>

                    {/* Instagram Id */}
                    <div className="font-semibold mb-1 mt-3 ml-1 flex select-none">Instagram Id<p className="text-red-500 ml-1">*</p></div>
                    <input type="text" className="bg-gray-100 shadow py-2 px-3 rounded focus:outline-none w-full ring-blue-500 focus:ring-2"></input>

                    {/* Bottons */}
                    <div className="flex mt-5">
                        <button className="bg-gray-200 px-3 py-1 rounded shadow mx-auto mr-2" onClick={() => props.toggleAddUserMenu()}>Close</button>
                        <button className="bg-green-400 px-3 py-1 rounded shadow text-white">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withPageAuthRequired(function User({ user }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [usersData, setUsersData] = useState([]);
    const [userCount, setUserCount] = useState(0);

    const [addUserMenu, setAddUserMenu] = useState(false);

    function handleToggleAddUserMenu() {
        return setAddUserMenu(!addUserMenu);
    }

    useEffect(() => {
        const fetchData = async () => {
            var data = await fetch(`/api/admin/user`);
            var json = await data.json();
            setLoading(false);

            if (data.status == 200) {
                setUsersData(json.data.users);
                setUserCount(json.data.count);
                return;
            }

            if ('error' in json) {
                return setError(json.error.message);
            }

            console.log(json); // For Error
        };

        fetchData().catch(error => console.error(error));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner className="scale-150 sm:scale-100" />
        </div>
    );

    if (error) return error;

    return (
        <div className='bg-gray-100 w-screen h-screen'>
            <Head>
                <title>Manage Users | AskMe</title>
                {/* <meta name="description" content="Generated by create next app" /> */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavbarAdmin />
            <SearchMenu
                count={userCount}
                toggleAddUserMenu={() => handleToggleAddUserMenu()}
            />
            <UserTable users={usersData} />

            {addUserMenu ?
                <AddNewUser toggleAddUserMenu={() => handleToggleAddUserMenu()} />
                : undefined
            }
        </div>
    );
});
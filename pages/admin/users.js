import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React, { useEffect, useState } from 'react';

import NavbarAdmin from '../../components/NavbarAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

function SearchMenu(props) {
    return (
        <div className="text-black font-Prompt mx-4 mt-4">
            <p className="text-3xl font-semibold">Manage users</p>

            <div className="mt-3 sm:flex sm:mt-5">
                <div className="sm:flex">
                    <p className="mb-1 sm:my-auto sm:mr-3">Search: </p>
                    <input placeholder={`${props.count} users...`} className="bg-white shadow py-2 px-3 rounded focus:outline-none w-full"></input>
                </div>
                <div className="sm:flex mt-1 sm:mt-0 sm:ml-5">
                    <p className="mb-1 sm:my-auto sm:mr-3">Roles: </p>
                    <select name="roles" id="roles" className="bg-white shadow py-2 px-3 rounded focus:outline-none">
                        <option value="ADMIN">Admin</option>
                        <option value="USER" selected="selected">User</option>
                        <option value="REVORKED">Revorked</option>
                    </select>
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
            <NavbarAdmin />

            <SearchMenu
                count={userCount}
            />
        </div>
    );
});
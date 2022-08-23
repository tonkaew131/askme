import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React, { useEffect, useState } from 'react';

import NavbarAdmin from '../../components/NavbarAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';

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
                setError(json.error.message);
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

    if (error) return 'Unauthorized';

    return (
        <div className='bg-white w-screen h-screen'>
            <NavbarAdmin />

            <div className='text-black font-Montserrat font-bold text-3xl'>
                <p>Users</p>
            </div>
        </div>
    );
});
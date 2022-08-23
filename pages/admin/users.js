import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import NavbarAdmin from '../../components/NavbarAdmin';

export default withPageAuthRequired(function User({ user }) {
    console.log(user.email);

    return (
        <div className='bg-white w-screen h-screen'>
            <NavbarAdmin />

            <div className='text-black font-Montserrat font-bold text-3xl'>
                <p>Users</p>
            </div>
        </div>
    );
});
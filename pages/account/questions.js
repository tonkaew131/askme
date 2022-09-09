import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Head from 'next/head';

import Navbar from '../../components/Navbar';

export default withPageAuthRequired(function Profile({ user }) {
    return (
        <div>
            <Head>
                <title>Manage Questions | AskMe</title>
            </Head>

            <Navbar />
            <p>Hello World!</p>
        </div>
    );
});
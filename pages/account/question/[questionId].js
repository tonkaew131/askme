import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function Profile({ user }) {
    return (
        <div className="bg-gray-100 w-screen min-h-screen h-full pb-5">
            Hello World!
        </div>
    );
});
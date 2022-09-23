import Head from 'next/head';

export default function BaseHead(props) {
    const title = props.title || 'AskMe by tonkaew131';
    const description = props.description || 'Anonymously ask question, send songs / images / drawing to specific instagram account';

    return <Head>
        <link rel="icon" href="/favicon.ico" />

        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

        <meta name="og:title" property="og:title" content={title}></meta>
        <meta property="og:description" content={description} />

        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* <meta name="twitter:image" content="https://html.sammy-codes.com/images/large-profile.jpg" /> */}
        {/* <meta name="twitter:site" content="@tonkaew131" /> */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
    </ Head>;
}
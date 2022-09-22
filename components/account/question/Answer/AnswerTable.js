import { formatTimeAgo } from '../../../../shared/utils';

import React, { useRef } from 'react';
import { toCanvas, toBlob } from 'html-to-image';

// Icons
import { AiFillClockCircle } from 'react-icons/ai';
import { FaRegCopy } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

// Card
function AnswerCard(props) {
    const exportRef = useRef();

    const copyImageToClipboard = async () => {
        const element = exportRef.current;
        const pngBlob = await toBlob(element, {
            pixelRatio: 3
        });

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [pngBlob.type]: pngBlob
                })
            ]);
            console.log('Image copied!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownloadImage = async () => {
        const element = exportRef.current;
        const canvas = await toCanvas(element, {
            pixelRatio: 3
        });

        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.setAttribute(
            'style',
            'visibility: hidden;',
        );

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = 'askme.jpg';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };

    return (
        <div className="border border-white w-96 rounded-lg text-xl font-semibold bg-slate-200">
            <div className="w-11/12 mx-auto mt-4">
                {/* Rendered Card */}
                <div ref={exportRef} className="bg-gradient-to-bl from-red-400 to-pink-500 text-white rounded-3xl text-center py-10">
                    <p className="mb-4">{props.question}</p>
                    <div className="bg-gray-100 py-2 w-4/5 mx-auto text-black rounded break-words">
                        <p className="mx-auto w-11/12 text-lg">{props.text}</p>
                    </div>
                </div>
            </div>

            {/* Time ago */}
            <div className="flex text-gray-500 mt-4 ml-4">
                <AiFillClockCircle className="my-auto mr-1" />
                {formatTimeAgo(props.date)}
            </div>

            {/* Copy to Clipboard & Download */}
            <div className="flex my-4 ml-4">
                <div className="bg-blue-500 rounded-lg p-2 hover:cursor-pointer active:scale-95" onClick={(e) => copyImageToClipboard()}>
                    <FaRegCopy color="white" />
                </div>
                <div className="bg-blue-500 rounded-lg p-2 hover:cursor-pointer active:scale-95 ml-2" onClick={(e) => handleDownloadImage()}>
                    <FiDownload color="white" />
                </div>
            </div>
        </div>
    );
}

export default function AnswerTable(props) {
    let answers = props.answers || [];

    if (answers.length == 0) {
        return (
            <div className="text-black font-Prompt font-bold flex justify-center items-center h-48 text-center text-xl select-none">
                ¯\_(ツ)_/¯ ไม่พบคำตอบ!
            </div>
        );
    }

    return (
        <div className="mt-5 mx-auto flex w-fit">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3">
                {answers.map(a => {
                    return <AnswerCard
                        key={a.id}
                        text={a.text}
                        date={new Date(a.createdAt)}
                        question={props.question}
                    />;
                })}
            </div>
        </div>
    );
}
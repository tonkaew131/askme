import { formatTimeAgo } from '../../../../shared/utils';

// Icons
import { AiFillClockCircle } from 'react-icons/ai';

// Card
function AnswerCard(props) {
    return (
        <div className="border border-white w-96 rounded text-xl font-semibold bg-slate-200">
            <p className="">{props.text}</p>
            <div className="flex text-gray-500">
                <AiFillClockCircle className="my-auto mr-1"/>
                {formatTimeAgo(props.date)}
            </div>
        </div>
    );
}

export default function AnswerTable(props) {
    let answers = props.answers || [];
    console.log(answers);

    if (answers.length == 0) {
        return (
            <div className="text-black font-Prompt font-bold flex justify-center items-center h-48 text-center text-xl select-none">
                ไม่พบคำตอบ!
            </div>
        );
    }

    return (
        <div className="mt-5 flex">
            <div className="mx-auto">
                {answers.map(a => {
                    return <AnswerCard
                        key={a.id}
                        text={a.text}
                        date={new Date(a.createdAt)}
                    />;
                })}
            </div>
        </div>
    );
}
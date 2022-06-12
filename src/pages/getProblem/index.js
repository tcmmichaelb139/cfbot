import Head from "next/head";
import { useState, useRef } from "react";

import Header from "../../components/Header";
import GetProblem from "../../components/GetProblem";

import SubmitButton from "../../components/Forms/SubmitButton";

function GetProblemHome() {
    const userHandle = useRef();
    const problemRating = useRef();
    const [jsxGetProblem, setJsxGetProblem] = useState();

    const onFormSubmit = (event) => {
        event.preventDefault();
        if (userHandle.current.value && problemRating.current.value) {
            setJsxGetProblem(
                <GetProblem
                    handle={userHandle.current.value}
                    rating={problemRating.current.value}
                />
            );
        }
    };

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Codeforces Bot for stats, problems, and more."
                />
                <meta name="og:url" content="https://cfbot.michaelbao.io" />
                <meta name="og:title" content="Codeforces Bot" />
                <meta
                    name="og:description"
                    content="Codeforces Bot for stats, problems, and more."
                />
            </Head>

            <Header />

            <main className="ml-64">
                <form onSubmit={onFormSubmit}>
                    <input
                        ref={userHandle}
                        type="text"
                        placeholder="Handle"
                        className="bg-neutral-900 border-[1px] border-neutral-800 placeholder-neutral-600 rounded-md p-4 m-4 shadow-md"
                    />
                    <input
                        ref={problemRating}
                        type="text"
                        placeholder="Rating"
                        className="bg-neutral-900 border-[1px] border-neutral-800 placeholder-neutral-600 rounded-md p-4 my-4 shadow-md"
                    />
                    <SubmitButton />
                </form>
                <div className="mx-4">{jsxGetProblem}</div>
            </main>
        </>
    );
}

export default GetProblemHome;

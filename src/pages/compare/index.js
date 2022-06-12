import Head from "next/head";
import { useState } from "react";

import Header from "../../components/Header";
import GetProblem from "../../components/GetProblem";

function GetProblemHome() {
    const [userHandle, setUserHandle] = useState();

    const onFormSubmit = (event) => {
        event.preventDefault();
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
                <div className="m-4">
                    <form onSubmit={onFormSubmit}>
                        <input
                            type="text"
                            placeholder="Handle"
                            className="p-4"
                            onChange={(event) =>
                                setUserHandle(event.target.value)
                            }
                        />
                        <button type="submit" className="p-4">
                            Submit
                        </button>
                    </form>
                    {/* <GetProblem handle={userHandle} rating="1800" /> */}
                </div>
            </main>
        </>
    );
}

export default GetProblemHome;

import Head from "next/head";
import Header from "../components/Header";
import GetUserStats from "../components/GetUserStats";
import GetProblem from "../components/GetProblem";

export default function Home() {
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
                <GetUserStats handle="tcmmichaelb139" />
                {/* <GetProblem handle="tcmmichaelb139" /> */}
            </main>
        </>
    );
}

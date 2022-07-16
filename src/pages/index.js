import Head from "next/head";
import { useRef, useState } from "react";

import Header from "../components/Header";
import GetUserStats from "../components/GetUserStats";

import SubmitButton from "../components/Forms/SubmitButton";

export default function Home() {
  const userHandle = useRef();
  const [jsxCharts, setJsxCharts] = useState();

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (userHandle.current.value) {
      setJsxCharts(<GetUserStats handle={userHandle.current.value} />);
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

      <main className="ml-[17rem]">
        <div className="m-4">
          <form onSubmit={onFormSubmit}>
            <input
              ref={userHandle}
              type="text"
              placeholder="Handle"
              className="bg-neutral-900 outline-none focus:ring ring-neutral-500 ring-opacity-50 border border-neutral-800 placeholder-neutral-600 rounded-md p-4 m-4 shadow-md transition"
            />
            <SubmitButton />
          </form>
          {jsxCharts}
        </div>
      </main>
    </>
  );
}

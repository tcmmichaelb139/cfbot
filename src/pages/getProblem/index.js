import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Header from "../../components/Header";
import GetProblem from "../../components/GetProblem";

import SubmitButton from "../../components/Forms/SubmitButton";

function GetProblemHome() {
  const [problemsetProblems, setProblemsetProblems] = useState();

  const userHandle = useRef();
  const problemRating = useRef();
  const [jsxGetProblem, setJsxGetProblem] = useState();

  useEffect(() => {
    axios
      .get("https://codeforces.com/api/problemset.problems")
      .then((response) => {
        setProblemsetProblems(response.data.result.problems);
      })
      .catch((error) => {
        setProblemsetProblems(error.code);
      });
  }, []);

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (userHandle.current.value && problemRating.current.value) {
      setJsxGetProblem(
        <GetProblem
          handle={userHandle.current.value}
          rating={problemRating.current.value}
          problemset={problemsetProblems}
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
        <div className="">
          <form onSubmit={onFormSubmit}>
            <input
              ref={userHandle}
              type="text"
              placeholder="Handle"
              className="bg-neutral-900 outline-none focus:ring ring-neutral-500 ring-opacity-50 border border-neutral-800 placeholder-neutral-600 rounded-md p-4 m-4 shadow-md transition"
            />
            <input
              ref={problemRating}
              type="text"
              placeholder="Rating"
              className="bg-neutral-900 outline-none focus:ring ring-neutral-500 ring-opacity-50 border border-neutral-800 placeholder-neutral-600 rounded-md p-4 m-4 shadow-md transition"
            />
            <SubmitButton />
          </form>
          <div className="mx-4">{jsxGetProblem}</div>
        </div>
      </main>
    </>
  );
}

export default GetProblemHome;

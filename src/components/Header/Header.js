import Link from "next/link";

function Header() {
  return (
    <div className="fixed top-0 h-full w-[17rem] flex flex-col items-start justify-start bg-neutral-800/80 text-neutral-300 text-xl p-10">
      {/* Codeforces Bot Home link */}
      <div className="font-bold mb-5">
        <Link href="/">Codeforces Bot</Link>
      </div>
      {/* different links */}
      <nav className="">
        <div className="mb-5">
          <Link href="/getProblem">Get Problem</Link>
        </div>
      </nav>
      {/* Canvas Version */}
      <div className="mt-auto mb-5">
        <Link href="/chartjsVersion">Chart.js Version</Link>
      </div>
      {/* Github link */}
      <div className="font-normal">
        <Link href="https://github.com/tcmmichaelb139/cfbot">Github</Link>
      </div>
    </div>
  );
}

export default Header;

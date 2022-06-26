import Link from "next/link";

function Header() {
  return (
    <div className="fixed top-0 h-full w-[16rem] flex flex-col items-start justify-start bg-neutral-800/80 text-neutral-300 text-xl p-10">
      {/* Codeforces Bot Home link */}
      <div className="font-bold mb-10">
        <Link href="/">Codeforces Bot</Link>
      </div>
      {/* different links */}
      <nav className="">
        <div className="mb-5">
          <Link href="/getProblem">Get Problem</Link>
        </div>
      </nav>
      {/* Github link */}
      <div className="mt-auto">
        <Link href="https://github.com/tcmmichaelb139/cfbot">Github</Link>
      </div>
    </div>
  );
}

export default Header;

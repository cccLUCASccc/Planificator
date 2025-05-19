import Link from "next/link";

type MyLinksProps = {
  to?: string;
  define?: string;
};

export default function MyLink({ to, define }: MyLinksProps) {

  const className = `font-fascinate text-white bg-green-700 hover:outline outline-4 hover:bg-green-900 pl-6 pr-6 pt-2 pb-2 rounded-md m-4 outline-green-100`;

  return (
    <Link className={className} href={`/${to}`}>
      {define}
    </Link>
  );
}

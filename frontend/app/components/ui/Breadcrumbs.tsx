'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const CRUMB_MAP: Record<string, string> = {
  "boards": "Boards",
  "login": "Login",
  "register": "Register",
};

type Props = {
  boardTitle?: string;
};

function getCrumbs(pathname: string, boardTitle?: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let url = "";
  for (let i = 0; i < parts.length; i++) {
    url += "/" + parts[i];
    let text;
    if (parts[i] === "boards" && parts[i + 1] && Number(parts[i + 1]) && boardTitle) {
      crumbs.push({
        text: CRUMB_MAP[parts[i]],
        href: url,
        isLast: false,
        key: url + '-boards',
      });
      crumbs.push({
        text: boardTitle,
        href: url + '/' + parts[i + 1],
        isLast: true,
        key: url + '/' + parts[i + 1] + '-' + boardTitle,
      });
      break;
    }
    if (CRUMB_MAP[parts[i]]) {
      text = CRUMB_MAP[parts[i]];
    } else if (Number(parts[i])) {
      text = boardTitle ? boardTitle : "Board #" + parts[i];
    } else {
      text = parts[i];
    }
    crumbs.push({
      text,
      href: url,
      isLast: i === parts.length - 1,
      key: url + '-' + text,
    });
  }
  if (crumbs.length === 0) {
    crumbs.push({ text: "Home", href: "/", isLast: true, key: "/-Home" });
  }
  return crumbs;
}

export function Breadcrumbs({ boardTitle }: Props) {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname, boardTitle);

  return (
    <nav aria-label="Breadcrumb" >
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {crumbs.map((crumb, idx) => (
          <li key={crumb.key} className="flex items-center">
            {crumb.isLast ? (
              <span className="font-semibold text-red-500">{crumb.text}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline hover:text-red-500">{crumb.text}</Link>
            )}
            {idx < crumbs.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
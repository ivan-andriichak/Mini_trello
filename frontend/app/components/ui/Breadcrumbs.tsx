import Link from "next/link";
import { usePathname } from "next/navigation";

const CRUMB_MAP: Record<string, string> = {
  "boards": "Boards",
  "login": "Login",
  "register": "Register",
};

function getCrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let url = "";
  for (let i = 0; i < parts.length; i++) {
    url += "/" + parts[i];
    crumbs.push({
      text: CRUMB_MAP[parts[i]] || (Number(parts[i]) ? "Board #" + parts[i] : parts[i]),
      href: url,
      isLast: i === parts.length - 1,
    });
  }
  if (crumbs.length === 0) {
    crumbs.push({ text: "Home", href: "/", isLast: true });
  }
  return crumbs;
}

const Breadcrumbs = () => {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {crumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center">
            {crumb.isLast ? (
              <span className="font-semibold text-amber-50">{crumb.text}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline hover:text-amber-200">{crumb.text}</Link>
            )}
            {idx < crumbs.length - 1 && (
              <span className="mx-2 text-">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export  { Breadcrumbs };
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./TransitionProvider";

type TransitionLinkProps = React.ComponentProps<typeof Link>;

export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hrefStr = typeof href === "string" ? href : href.pathname || "";

    // Don't intercept: external links, hash links, same-page, new-tab
    if (
      hrefStr.startsWith("http") ||
      hrefStr.startsWith("mailto") ||
      hrefStr.startsWith("#") ||
      hrefStr === pathname ||
      props.target === "_blank"
    ) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);
    navigateTo(hrefStr);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

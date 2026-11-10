"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { NAV_ITEMS, type NavKey } from "@/lib/content";
import logo from "@/picture/logo.png";

function activeKey(pathname: string): NavKey | null {
  const match = NAV_ITEMS.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return match?.key ?? null;
}

export default function Header() {
  const pathname = usePathname();
  const active = activeKey(pathname);

  const [menu, setMenu] = useState({ open: false, path: "" });
  const isOpen = menu.open && menu.path === pathname;
  const [scrolled, setScrolled] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelId = useId();

  const setOpen = (open: boolean) =>
    setMenu({ open, path: pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    firstLinkRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu({ open: false, path: pathname });
        toggleRef.current?.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) return;

      if (
        panelRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) return;

      setMenu({ open: false, path: pathname });
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, pathname]);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}`}
        style={{
          width: "100%",
          zIndex: 1000,
          position: "sticky",
          top: 0,
        }}
      >
        <div
          className="header-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Company Logo */}
          <Link
            href="/"
            aria-label="The Damac Global Home"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              textDecoration: "none",
            }}
          >
            <Image
              src={logo}
              alt="The Damac Global"
              width={180}
              height={65}
              priority
             style={{
  display: "block",
  width: "clamp(160px, 20vw, 240px)",
  height: "auto",
  maxHeight: "85px",
  objectFit: "contain",
  objectPosition: "left center",
}}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="site-nav" aria-label="Primary">
            <ul className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={
                      active === item.key ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        id={panelId}
        ref={panelRef}
        className={`mobile-panel${isOpen ? " is-open" : ""}`}
        inert={!isOpen}
      >
        <nav aria-label="Mobile">
          <ul className="mobile-nav">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.key}>
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  className={`nav-link${active === item.key ? " is-active" : ""}`}
                  aria-current={
                    active === item.key ? "page" : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}

                  <span className="nav-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

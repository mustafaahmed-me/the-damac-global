import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { ArrowUpRight } from "@/components/icons";

export default function NotFound() {
  return (
    <PageHero
      id="not-found-title"
      variant="center"
      eyebrow="Error 404"
      title={
        <>
          Page <span className="accent">not found</span>
        </>
      }
      lead="The page you are looking for may have moved. Let us help you find the right place."
      actions={
        <>
          <Link href="/" className="btn btn-gold">
            Back to home <ArrowUpRight />
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </>
      }
    />
  );
}

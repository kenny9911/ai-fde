"use client";

import { useT } from "@/lib/i18n";

/**
 * The claim / rebuttal / revision triptych. Showing all three side by side is
 * the point — a reader sees what was believed, what was argued against it, and
 * what survived, without having to trust anyone's summary of the exchange.
 */
export function ClaimTriptych({
  claim,
  challenge,
  revision,
}: {
  claim: string;
  challenge: string;
  revision?: string;
}) {
  const t = useT();
  return (
    <div className="grid gap-2 md:grid-cols-3">
      <div className="rounded-md border border-border bg-muted/40 p-2.5">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("challenge.claim")}
        </p>
        <p className="text-[11px] leading-relaxed">{claim}</p>
      </div>
      <div className="rounded-md border border-phase-challenge/30 bg-phase-challenge/5 p-2.5">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-phase-challenge">
          {t("challenge.rebuttal")}
        </p>
        <p className="text-[11px] leading-relaxed">{challenge}</p>
      </div>
      <div
        className={
          revision
            ? "rounded-md border border-success/30 bg-success/5 p-2.5"
            : "rounded-md border border-dashed border-border p-2.5"
        }
      >
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("challenge.revision")}
        </p>
        <p className="text-[11px] leading-relaxed">
          {revision ?? (
            <span className="italic text-muted-foreground">{t("common.none")}</span>
          )}
        </p>
      </div>
    </div>
  );
}

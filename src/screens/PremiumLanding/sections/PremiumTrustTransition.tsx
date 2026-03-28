export const PremiumTrustTransition = (): JSX.Element => {
  return (
    <div className="relative bg-gradient-to-b from-white via-[#f7f5f2] to-[#f0ebe3]">
      <div
        className="mx-auto max-w-6xl px-6 py-16 text-center"
        aria-hidden="false"
      >
        <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          Qualitätssicherung
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-lato text-base leading-relaxed text-stone-700">
          Der folgende Block fasst Prüfpunkte zusammen, die Sie zur Einordnung
          unserer Arbeitsweise heranziehen können — ohne Marketingversprechen.
        </p>
      </div>
      <div
        className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"
        aria-hidden
      />
    </div>
  );
};

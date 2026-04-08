import { useState } from "react";

// Footer navigation data
const patientInfoLinks = [
  "Über uns",
  "Praxisgeschichte",
  "Vorher / Nachher",
  "Patientenstimmen",
  "Kontakt",
];
const servicesLinks = [
  "Prophylaxe",
  "Implantologie",
  "Ästhetische Zahnmedizin",
  "Unsichtbare Zahnspange",
  "Notdienst",
];
const legalLinks = ["Datenschutz", "AGB", "Versicherungen"];

export const SiteFooterSection = (): JSX.Element => {
  const [email, setEmail] = useState("");

  return (
    <footer id="kontakt" className="w-full flex flex-wrap bg-[#1e1e1e] px-16 py-[76px]">
      {/* Patient Information Column */}
      <div className="flex flex-col gap-[17px] w-[276px] mr-3">
        <h3 className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0.63px] leading-[normal]">
          Patienteninformationen
        </h3>
        <nav className="flex flex-col">
          {patientInfoLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Services Column */}
      <div className="flex flex-col gap-[17px] w-[276px] mr-3">
        <h3 className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0.63px] leading-[normal]">
          Leistungen
        </h3>
        <nav className="flex flex-col">
          {servicesLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Legal Column */}
      <div className="flex flex-col gap-[17px] w-[276px] mr-3">
        <h3 className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0.63px] leading-[normal]">
          Rechtliches
        </h3>
        <nav className="flex flex-col">
          {legalLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Contact Us Column */}
      <div className="flex flex-col gap-0 w-[319px] mr-[113px]">
        <h3 className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0.63px] leading-[normal] mb-[22px]">
          Kontakt
        </h3>
        <address className="not-italic [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-[26px] mb-[17px]">
          Hauptstraße 123
          <br />
          2. Etage
          <br />
          10115 Berlin
        </address>
        <div className="flex items-center gap-[18px] mb-2">
          <img
            className="w-6 h-6 object-cover flex-shrink-0"
            alt="Icon phone"
            src="/icon-phone.png"
          />
          <span className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9">
            030 1234 5678
          </span>
        </div>
        <div className="flex items-center gap-[18px]">
          <img
            className="w-6 h-6 object-cover flex-shrink-0"
            alt="Icon mail"
            src="/icon-mail.png"
          />
          <span className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-lg tracking-[1.26px] leading-9">
            kontakt@zahnarztpraxis.de
          </span>
        </div>
      </div>

      {/* Stay Connected Column */}
      <div className="flex flex-col w-[421px]">
        <h3 className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0.63px] leading-[normal] mb-7">
          Bleiben Sie verbunden
        </h3>

        {/* Email subscription row */}
        <div className="flex h-12 w-[420px]">
          <div className="relative flex-1 max-w-[288px] h-12 border border-solid border-white">
            <input
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full bg-transparent px-4 [font-family:'Kollektif-Regular',Helvetica] font-normal text-white text-sm tracking-[0.98px] leading-[26px] outline-none placeholder:text-[#a7adaf] focus:border-[#7DC9E8]"
            />
          </div>
          <button className="w-32 h-12 bg-white flex items-center justify-center flex-shrink-0 hover:bg-[#7DC9E8] transition-colors group">
            <span className="[font-family:'Kollektif-Bold',Helvetica] font-bold text-[#282828] group-hover:text-white text-[10px] text-center tracking-[0.70px] leading-[normal] transition-colors">
              ABSENDEN
            </span>
          </button>
        </div>

        {/* Social media icons */}
        <img
          className="w-[416px] h-5 mt-[35px]"
          alt="Social Media"
          src="/social.png"
        />

        {/* Copyright */}
        <p className="mt-[25px] [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#a7adaf] text-sm text-right tracking-[0.98px] leading-[26px] whitespace-nowrap self-end">
          Copyright © 2026 Zahnarztpraxis Dr. Schmidt.
        </p>
      </div>
    </footer>
  );
};

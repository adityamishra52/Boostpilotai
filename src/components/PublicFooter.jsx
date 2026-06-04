import { Facebook, Instagram, Linkedin, Mail, Send, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";
import Logo from "./Logo";

const sections = [
  ["Product", [["How it works", "/how-it-works"], ["Features", "/features"], ["Pricing", "/pricing"], ["Analyze", "/analyze"], ["Content Library", "/library"]]],
  ["Tools", [["Trend Finder", "/trends"], ["Growth Coach", "/coach"], ["AI Rewrite Studio", "/analyze"], ["Media Enhancer", "/analyze"]]],
  ["Company", [["Contact", "/contact"], ["Help Center", "/help"], ["Support", "/support"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"]]]
];

const socials = [
  ["Facebook", "https://facebook.com", Facebook],
  ["Instagram", "https://instagram.com", Instagram],
  ["LinkedIn", "https://linkedin.com", Linkedin],
  ["Twitter/X", "https://x.com", Twitter],
  ["YouTube", "https://youtube.com", Youtube]
];

const PublicFooter = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-zinc-600 dark:text-zinc-300">
            AI content optimization for creators, marketers, and agencies.
          </p>
          <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm font-extrabold">Get creator growth tips</p>
            <form className="mt-3 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <input className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-300/30 dark:border-zinc-700 dark:bg-zinc-950" placeholder="Email address" type="email" />
              <Button aria-label="Subscribe" icon={Send} variant="accent" />
            </form>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-zinc-700 dark:text-zinc-300">{title}</h3>
              <div className="mt-3 grid gap-2">
                {links.map(([label, to]) => (
                  <Link className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white" key={to} to={to}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-zinc-700 dark:text-zinc-300">Social</h3>
            <div className="mt-3 grid gap-2">
              {socials.map(([label, href, Icon]) => (
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white" href={href} key={label} rel="noreferrer" target="_blank">
                  <Icon size={16} />
                  {label}
                </a>
              ))}
            </div>
            <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-200" href="mailto:support@boostpilotai.com">
              <Mail size={16} />
              support@boostpilotai.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200 px-4 py-5 text-center text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
        © 2026 BoostPilot AI. All rights reserved. Private uploads • No auto posting • Secure login
      </div>
    </footer>
  );
};

export default PublicFooter;

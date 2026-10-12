"use client";

import React from "react";
import { ChevronDown, ArrowRight, Copy, Check, Blocks, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "vote" | "admin" | "ledger" | "insights" | "slides";
  setActiveTab: (tab: "vote" | "admin" | "ledger" | "insights" | "slides") => void;
  onCopyDemoCreds: () => void;
  copiedDemo: boolean;
  blockNumber: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onCopyDemoCreds,
  copiedDemo,
  blockNumber,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Coral Geometric Mark (Nerdstack Signature Style) */}
          <div 
            onClick={() => setActiveTab("vote")}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            {/* Geometric coral cross logo */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#f87171] opacity-90 flex items-center justify-center transform rotate-45 group-hover:rotate-90 transition-transform duration-300 shadow-xs">
                <div className="w-3.5 h-3.5 bg-white rounded-xs transform -rotate-45" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-zinc-900">
                AnonVote
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                SRM IST
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Nerdstack Style with chevrons) */}
          <nav className="hidden md:flex items-center space-x-7 text-[14px] font-medium text-zinc-600">
            <button
              onClick={() => setActiveTab("vote")}
              className={`flex items-center space-x-1 hover:text-zinc-950 transition-colors cursor-pointer ${
                activeTab === "vote" ? "text-zinc-950 font-semibold" : ""
              }`}
            >
              <span>Vote</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center space-x-1 hover:text-zinc-950 transition-colors cursor-pointer ${
                activeTab === "admin" ? "text-zinc-950 font-semibold" : ""
              }`}
            >
              <span>Admin Hub</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setActiveTab("ledger")}
              className={`hover:text-zinc-950 transition-colors cursor-pointer ${
                activeTab === "ledger" ? "text-zinc-950 font-semibold" : ""
              }`}
            >
              Ledger
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex items-center space-x-1 hover:text-zinc-950 transition-colors cursor-pointer ${
                activeTab === "insights" ? "text-zinc-950 font-semibold" : ""
              }`}
            >
              <span>iNSIGHTS AI</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setActiveTab("slides")}
              className={`hover:text-zinc-950 transition-colors cursor-pointer ${
                activeTab === "slides" ? "text-zinc-950 font-semibold" : ""
              }`}
            >
              Pitch Deck
            </button>
          </nav>

          {/* Right Action Buttons (Sign In + Black Pill CTA) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCopyDemoCreds}
              className="text-[14px] font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer hidden sm:flex items-center space-x-1.5"
            >
              {copiedDemo ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copiedDemo ? "Copied Demo ID" : "Demo Pass"}</span>
            </button>

            <button
              onClick={() => setActiveTab("vote")}
              className="px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-[14px] font-semibold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Links */}
        <div className="flex md:hidden items-center space-x-2 py-3 overflow-x-auto border-t border-zinc-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("vote")}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "vote" ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100"
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "admin" ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100"
            }`}
          >
            Admin Hub
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "ledger" ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100"
            }`}
          >
            Blockchain Ledger
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "insights" ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100"
            }`}
          >
            iNSIGHTS AI
          </button>
          <button
            onClick={() => setActiveTab("slides")}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap ${
              activeTab === "slides" ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100"
            }`}
          >
            Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
};

import Link from "next/link";
import {
    BarChart2, Bell, Shield, Zap,
    ActivitySquare, Mail, Settings2, ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
    { icon: Shield, title: "Secure Authentication", desc: "Sign in with Google via Firebase — enterprise-grade security without the complexity." },
    { icon: ActivitySquare, title: "Real-Time Dashboard", desc: "Visualize your analytics with beautiful charts, metrics, and customizable views." },
    { icon: Mail, title: "Smart Email Alerts", desc: "Receive daily, weekly, or monthly analytics digests straight to your inbox." },
    { icon: Settings2, title: "Customizable Settings", desc: "Fine-tune your dashboard, manage GA properties, and control notification preferences." },
];

const steps = [
    { number: "01", title: "Sign In", desc: "Authenticate securely with your Google account via Firebase." },
    { number: "02", title: "Add Your GA Key", desc: "Enter your Google Analytics Measurement ID to connect your property." },
    { number: "03", title: "View & Monitor", desc: "Explore your dashboard and set up automated email alerts." },
];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#F7F5F0]">

            {/* ─── NAVBAR ─── */}
            <nav className="fixed top-0 left-0 right-0 z-30 glass border-b border-[#E5E0D8]/60">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6.5">
                        <div className="w-8 h-8 bg-[#1B3A6B] rounded-lg flex items-center justify-center">
                            <BarChart2 size={15} className="text-white" />
                        </div>
                        <span className="text-lg font-semibold text-[#1A1814]" style={{ fontFamily: "var(--font-display)" }}>
                            SwytchAnalytics
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8C8578]">
                        <a href="#features" className="hover:text-[#1A1814] transition-colors duration-300">Features</a>
                        <a href="#how-it-works" className="hover:text-[#1A1814] transition-colors duration-300">How It Works</a>
                    </div>

                    <Link href="/login">
                        <Button variant="primary" size="sm">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="absolute top-20 right-[15%] w-[420px] h-[420px] rounded-full bg-[#C4956A]/8 blur-[100px] float" />
                <div className="absolute bottom-20 left-[10%] w-[320px] h-[320px] rounded-full bg-[#1B3A6B]/6 blur-[80px] float" style={{ animationDelay: "3s" }} />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDE8E0] text-[#8C8578] text-xs font-medium mb-8 fade-up">
                        <Zap size={12} className="text-[#C4956A]" />
                        Powered by SwytchCode CLI
                    </div>

                    <h1 className="text-5xl md:text-7xl text-[#1A1814] leading-[1.1] mb-6 fade-up fade-up-delay-1" style={{ fontFamily: "var(--font-display)" }}>
                        Your Analytics,
                        <br />
                        <span className="italic text-[#C4956A]">Simplified.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#8C8578] max-w-lg mx-auto mb-12 leading-relaxed fade-up fade-up-delay-2">
                        Connect your Google Analytics properties, visualize key metrics,
                        and receive smart alerts — all in one clean dashboard.
                    </p>

                    <div className="flex items-center justify-center gap-4 fade-up fade-up-delay-3">
                        <Link href="/login">
                            <Button size="lg">
                                Start for Free
                                <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button size="lg" variant="outline">Explore Features</Button>
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8C8578]/50">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <div className="w-px h-8 bg-[#E5E0D8]" />
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="min-h-screen flex items-center py-24 px-6 bg-white border-y border-[#E5E0D8]">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-[0.2em] uppercase text-[#C4956A] font-medium mb-4">What we offer</p>
                        <h2 className="text-3xl md:text-5xl text-[#1A1814] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                            Everything you need to{" "}
                            <span className="italic text-[#C4956A]">understand your traffic</span>
                        </h2>
                        <p className="text-base text-[#8C8578] max-w-md mx-auto">
                            Powerful features wrapped in a simple, intuitive interface.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map(({ icon: Icon, title, desc }, i) => (
                            <div
                                key={title}
                                className="bg-[#F7F5F0] rounded-2xl border border-[#E5E0D8] p-7 card-hover group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#EDE8E0] flex items-center justify-center mb-5 group-hover:bg-[#1B3A6B] transition-colors duration-300">
                                    <Icon size={18} className="text-[#C4956A] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#1A1814] mb-2">{title}</h3>
                                <p className="text-xs text-[#8C8578] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" className="min-h-screen flex items-center py-24 px-6">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-[0.2em] uppercase text-[#C4956A] font-medium mb-4">Getting started</p>
                        <h2 className="text-3xl md:text-5xl text-[#1A1814] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                            Up and running in{" "}
                            <span className="italic text-[#C4956A]">three steps</span>
                        </h2>
                    </div>

                    {/* Steps container card */}
                    <div className="bg-white rounded-3xl border border-[#E5E0D8] p-10 md:p-14">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                            {/* Connector line */}
                            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-[#E5E0D8]" />

                            {steps.map(({ number, title, desc }) => (
                                <div key={number} className="flex flex-col items-center text-center relative">
                                    <div
                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1B3A6B] to-[#2A5298] text-white flex items-center justify-center text-sm font-semibold mb-6 z-10 shadow-lg shadow-[#1B3A6B]/20"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        {number}
                                    </div>
                                    <h3 className="text-base font-semibold text-[#1A1814] mb-2">{title}</h3>
                                    <p className="text-sm text-[#8C8578] leading-relaxed max-w-[220px]">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA BANNER ─── */}
            <section className="min-h-[60vh] flex items-center py-24 px-6 bg-[#1B3A6B] relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C4956A]/10 blur-[120px]" />

                <div className="max-w-2xl mx-auto text-center relative z-10">
                    <p className="text-xs tracking-[0.2em] uppercase text-[#C4956A] font-medium mb-6">Ready?</p>
                    <h2 className="text-3xl md:text-5xl text-white mb-5" style={{ fontFamily: "var(--font-display)" }}>
                        Ready to simplify
                        <br />your analytics?
                    </h2>
                    <p className="text-[#B8C7DB] text-base mb-10 max-w-md mx-auto">
                        Join teams already using SwytchAnalytics to make data-driven decisions.
                    </p>
                    <Link href="/login">
                        <button className="px-8 py-3.5 bg-white text-[#1B3A6B] rounded-lg text-sm font-semibold hover:bg-[#F7F5F0] transition-all duration-300 cursor-pointer btn-hover shadow-lg shadow-white/10">
                            Get Started for Free
                            <ArrowRight size={15} className="inline ml-2" />
                        </button>
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-10 px-6 border-t border-[#E5E0D8] bg-[#F7F5F0]">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-[#1B3A6B] rounded-md flex items-center justify-center">
                            <BarChart2 size={11} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-[#8C8578]">SwytchAnalytics</span>
                    </div>
                    <p className="text-xs text-[#8C8578]">Open source · Built with SwytchCode CLI</p>
                </div>
            </footer>

        </main>
    );
}
import React from "react";
import { Link } from "react-router-dom";
import {
	Compass,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { useApp } from "../core/context/AppContext";

export const Footer = ({ startQuiz, addToast }) => {
	const { wishlist, addToast: appAddToast } = useApp();
	const activeAddToast = addToast || appAddToast;

	const handleWishlistClick = () => {
		if (typeof activeAddToast === "function") {
			activeAddToast(
				`You have ${wishlist?.length || 0} item(s) in your private vanity wishlist. Check the catalog or shop to review.`,
				"info",
			);
		}
	};

	return (
		<footer
			id="main-footer"
			className="bg-black border-t border-gold/15 text-zinc-400 pt-16 pb-8 font-sans"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
				{/* Brand Column */}
				<div className="space-y-4 text-left">
					<h3 className="text-sm font-serif font-light tracking-[0.35em] text-gold uppercase">
						Decantre
					</h3>
					<p className="text-[11px] font-sans font-light leading-relaxed text-zinc-400">
						Crafting persistent, hand-formulated, sovereign amber fragrances
						since the dawn of memory. Each formulation is recorded inside our
						master ledger in Paris.
					</p>
					<div className="flex items-center gap-2.5 pt-1 text-gold">
						<Compass className="w-4 h-4" />
						<span className="text-[9px] uppercase tracking-[0.25em] font-medium text-gold font-sans">
							Pure Gold Authenticity
						</span>
					</div>
				</div>

				{/* Contact Info */}
				<div className="space-y-4 text-left">
					<h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">
						Contact Info
					</h4>
					<div className="space-y-5 pt-1">
						{/* Address */}
						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold text-black shrink-0">
								<MapPin className="w-4.5 h-4.5" />
							</div>
							<div className="space-y-0.5">
								<h5 className="text-[11px] font-sans font-semibold uppercase tracking-wider text-gold">
									Address
								</h5>
								<p className="text-[11px] font-sans font-light text-zinc-400 leading-relaxed">
									Ground Floor, House 20,
									<br />
									Road 10, Sector 13,
									<br />
									Uttara, Dhaka
								</p>
							</div>
						</div>

						{/* Phone */}
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold text-black shrink-0">
								<Phone className="w-4.5 h-4.5" />
							</div>
							<div className="space-y-0.5">
								<h5 className="text-[11px] font-sans font-semibold uppercase tracking-wider text-gold">
									Phone
								</h5>
								<p className="text-[11px] font-sans font-light text-zinc-400">
									+880 1869-151550
								</p>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold text-black shrink-0">
								<Mail className="w-4.5 h-4.5" />
							</div>
							<div className="space-y-0.5">
								<h5 className="text-[11px] font-sans font-semibold uppercase tracking-wider text-gold">
									Email
								</h5>
								<p className="text-[11px] font-sans font-light text-zinc-400 break-all">
									support@decantrebd.com
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Courier & Services */}
				<div className="space-y-4 text-left">
					<h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">
						Client Services
					</h4>
					<ul className="space-y-2 text-[11px] font-sans font-light text-zinc-400">
						<li>
							<Link
								to="/privacy-policy"
								className="hover:text-gold transition-colors"
							>
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link
								to="/terms-and-condition"
								className="hover:text-gold transition-colors"
							>
								Terms and Conditions
							</Link>
						</li>
						<li>
							<Link
								to="/return-policy"
								className="hover:text-gold transition-colors"
							>
								Return & Refund Policy
							</Link>
						</li>
						<li>
							<Link
								to="/contact-us"
								className="hover:text-gold transition-colors"
							>
								Contact Us
							</Link>
						</li>
					</ul>
				</div>

				{/* Quick Links Column (Updated matching 2nd ss layout) */}
				<div className="space-y-4 text-left">
					<h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">
						Quick Links
					</h4>
					<ul className="space-y-2.5 text-[11px] font-sans font-light text-zinc-400">
						<li>
							<Link
								to="/about-us"
								className="hover:text-gold transition-colors block"
							>
								About us
							</Link>
						</li>
						<li>
							<Link
								to="/faq"
								className="hover:text-gold transition-colors block"
							>
								FAQ
							</Link>
						</li>
						<li>
							<button
								onClick={handleWishlistClick}
								className="hover:text-gold transition-colors block text-left cursor-pointer focus:outline-none"
							>
								Wishlist
							</button>
						</li>
					</ul>
				</div>
			</div>

			{/* Giant Outline Brand Display */}
			<div className="hidden sm:block select-none mt-14 mb-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
				<span
					className="font-serif block w-full font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase 
    text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.75)] sm:[-webkit-text-stroke:1.2px_rgba(255,255,255,0.75)] 
    text-4xl sm:text-6xl md:text-8xl lg:text-[8.5rem] xl:text-[10.5rem] leading-none whitespace-nowrap"
				>
					DECANTRE
				</span>
			</div>

			{/* Bottom copyright row */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-[9px] text-zinc-500 tracking-wider">
					© 2026 Decantre. All Rights Reserved.
				</p>
				<div className="flex items-center gap-4">
					<span className="text-[9px] text-zinc-500 tracking-widest uppercase hidden sm:inline">
						Connect with us
					</span>
					<div className="flex items-center gap-3">
						<button
							className="text-zinc-400 hover:text-gold transition-colors cursor-pointer"
							aria-label="Facebook"
						>
							<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</button>
						<button
							className="text-zinc-400 hover:text-gold transition-colors cursor-pointer"
							aria-label="Email"
						>
							<Mail className="w-4 h-4" />
						</button>
						<button
							className="text-zinc-400 hover:text-gold transition-colors cursor-pointer"
							aria-label="Instagram"
						>
							<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

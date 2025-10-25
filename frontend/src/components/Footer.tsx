export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t mt-10">
            <div className="container mx-auto py-10 px-6 grid md:grid-cols-3 gap-10 text-sm text-gray-700">
                {/* Colonne 1 : À propos */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-brand-700">StoreZ</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Your trusted marketplace for smart shopping — fast, simple, and secure.
                        Join thousands of buyers and suppliers who trust StoreZ daily.
                    </p>
                </div>

                {/* Colonne 2 : Navigation */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-brand-700">Explore</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-brand-600">Home</a></li>
                        <li><a href="/about" className="hover:text-brand-600">About</a></li>
                        <li><a href="/contact" className="hover:text-brand-600">Contact</a></li>
                        <li><a href="/help" className="hover:text-brand-600">Help</a></li>
                        <li><a href="/terms-privacy" className="hover:text-brand-600">Terms & Privacy</a></li>
                    </ul>
                </div>

                {/* Colonne 3 : Contact */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-brand-700">Contact</h3>
                    <p>
                        Email: <a href="mailto:zaksab98@gmail.com" className="text-brand-700 hover:underline">zaksab98@gmail.com</a><br />
                        Phone: +49 176 20827199<br />
                        Address: Aachen 52072, Germany
                    </p>
                </div>
            </div>

            {/* Ligne du bas */}
            <div className="border-t py-4 text-center text-xs text-gray-500 bg-white">
                © {new Date().getFullYear()} <span className="font-semibold text-brand-700">StoreZ</span> — Fast. Simple. Secure.
                <span className="block md:inline"> | All rights reserved.</span>
            </div>
        </footer>
    )
}

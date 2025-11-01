export default function Help() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 leading-relaxed">
            <section className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">Help & Support</h1>
                <p className="text-gray-600 text-lg">
                    Need help? Our team in Aachen is ready to assist you anytime. 💡
                </p>
            </section>

            <section className="card p-8 space-y-4 border border-slate-200 hover:border-gold-300 hover:shadow-md transition-all">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">🧠 Frequently Asked Questions</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>How do I track my order? — You'll receive tracking info by email.</li>
                    <li>Can I return a product? — Yes, within 14 days if unused and sealed.</li>
                    <li>How do I become a supplier? — Apply via <em>Register Supplier</em>.</li>
                    <li>Is StoreZ secure? — 100 % encrypted and protected.</li>
                </ul>
                <p className="text-gray-500 italic">More FAQs coming soon…</p>
            </section>

            <section className="card p-8 bg-gradient-to-r from-brand-50 to-gold-50 text-center space-y-3 border border-gold-200 hover:border-gold-300 hover:shadow-md transition-all">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">💬 Still Need Help?</h2>
                <p>
                    📧 <a href="mailto:zaksab98@gmail.com" className="text-brand-700 hover:text-gold-600 underline transition-colors">zaksab98@gmail.com</a><br />
                    📞 +49 176 20827199<br />
                    📍 Aachen 52072, Germany
                </p>
            </section>
        </div>
    )
}

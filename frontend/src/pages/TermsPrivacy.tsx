import { useNavigate } from "react-router-dom";

export default function TermsPrivacy() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-10 leading-relaxed">
            {/* Header */}
            <section className="text-center space-y-3">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Terms & Privacy</h1>
                <p className="text-gray-600 text-lg">
                    Please read these terms carefully before using <strong>StoreZ</strong>.
                    By accessing or using our platform, you agree to these conditions.
                </p>
            </section>

            {/* Terms of Service */}
            <section className="card p-8 space-y-4 border border-slate-200 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10 transition-all">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">📜 Terms of Service</h2>
                <p>
                    Welcome to <strong>StoreZ</strong>. By using our website and services, you agree to comply with our terms and policies.
                    These conditions apply to all users — including buyers, suppliers, and administrators.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password.</li>
                    <li><strong>Product Authenticity:</strong> Suppliers must ensure all listed products are genuine and accurately described.</li>
                    <li><strong>Prohibited Activities:</strong> Misuse of the platform, fraud, or illegal activity is strictly forbidden and may result in permanent suspension.</li>
                    <li><strong>Changes to Service:</strong> StoreZ reserves the right to modify or discontinue any feature with prior notice when possible.</li>
                </ul>
                <p>
                    Violation of these terms may lead to suspension or termination of your account.
                    We aim to maintain a safe, fair, and transparent shopping environment for all.
                </p>
            </section>

            {/* Privacy Policy */}
            <section className="card p-8 space-y-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10 transition-all">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">🔒 Privacy Policy</h2>
                <p>
                    At <strong>StoreZ</strong>, we value your privacy and are committed to protecting your personal information.
                    We collect data only to improve your experience and never sell or share it with third parties without consent.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><strong>Data Collected:</strong> We collect basic information such as name, email, and purchase history to process orders efficiently.</li>
                    <li><strong>Cookies:</strong> Our site uses cookies to enhance user experience and analytics. You can disable them in your browser settings.</li>
                    <li><strong>Security:</strong> All sensitive data is encrypted using modern standards (HTTPS, AES-256, secure payment gateways).</li>
                    <li><strong>Data Access:</strong> You can request to view, edit, or delete your account information at any time.</li>
                </ul>
                <p>
                    For any privacy-related question, contact us at{" "}
                    <a href="mailto:zaksab98@gmail.com" className="text-purple-700 hover:text-purple-600 underline transition-colors">zaksab98@gmail.com</a>
                    or visit our HQ in Aachen 52072, Germany.
                    Phone: +49 176 20827199
                </p>
            </section>

            {/* Updates */}
            <section className="card p-8 text-center space-y-3 border border-slate-200 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10 transition-all">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">🕒 Updates & Revisions</h2>
                <p className="text-gray-700">
                    StoreZ may update these Terms & Privacy policies from time to time.
                    Any changes will be posted on this page with the updated date.
                </p>
                <p className="italic text-gray-500">Last updated: October 2025</p>
            </section>

            {/* Footer CTA */}
            <section className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white text-center rounded-2xl shadow-2xl shadow-purple-500/20 py-10 space-y-3 border border-purple-300">
                <h2 className="text-3xl font-bold">Transparency. Trust. Security.</h2>
                <p className="text-purple-50 text-lg max-w-2xl mx-auto">
                    At StoreZ, your trust means everything. We continuously improve our systems
                    to keep your shopping experience safe, fair, and enjoyable.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="btn bg-white text-purple-700 font-semibold mt-4 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                >
                    Back to Home
                </button>
            </section>
        </div>
    );
}

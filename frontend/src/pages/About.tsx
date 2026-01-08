import { useAuth } from "@/contexts/AuthContext";

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
      <div className="card p-8 md:p-12 space-y-8 leading-relaxed bg-gradient-to-b from-white via-brand-50/30 to-gold-50/30">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">About StoreZ</h1>
          <p className="text-gray-600 text-lg">
            ✨ Fast. Simple. Secure. Your trusted place to buy and sell with
            confidence.
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4 text-gray-700 text-lg">
          <p>
            Welcome to{" "}
            <strong className="text-purple-700">StoreZ</strong>, the modern
            all-in-one marketplace where
            <span className="font-semibold text-purple-600"> users, suppliers,</span>{" "}
            and
            <span className="font-semibold text-purple-600"> admins</span> connect
            seamlessly. We believe that online shopping should be fast, enjoyable,
            and safe — empowering everyone to buy and sell with confidence.
          </p>
          <p>
            Whether you're exploring <em>the latest tech gadgets</em>, redecorating
            your home, or discovering new fashion trends, StoreZ brings together
            the best of online shopping — smart filters, instant checkout, and an
            experience designed just for you.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">🚀 Our Mission</h2>
            <p>
              To simplify online commerce through{" "}
              <strong>intuitive design</strong>,
              <strong> reliable services</strong>, and{" "}
              <strong>genuine human connection</strong>. Every click on StoreZ
              should feel effortless — from browsing to checkout.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">💎 Our Values</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <strong>Transparency</strong> — honesty in every transaction.
              </li>
              <li>
                <strong>Innovation</strong> — continuous improvement through
                technology.
              </li>
              <li>
                <strong>Trust</strong> — your data and purchases are always
                protected.
              </li>
              <li>
                <strong>Community</strong> — empowering small businesses and global
                brands alike.
              </li>
            </ul>
          </div>
        </section>

        {/* Why Choose StoreZ */}
        <section className="space-y-4 text-lg">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent text-center">
            Why Choose StoreZ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-2 border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
              <span className="text-4xl">⚡</span>
              <h3 className="font-semibold text-xl text-purple-700">Fast & Seamless</h3>
              <p className="text-gray-600">
                Optimized experience with quick loading, instant search, and
                smooth checkout.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-2 border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
              <span className="text-4xl">🛡️</span>
              <h3 className="font-semibold text-xl text-purple-700">Secure & Reliable</h3>
              <p className="text-gray-600">
                End-to-end encryption and trusted payments for total peace of mind.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-2 border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
              <span className="text-4xl">🌍</span>
              <h3 className="font-semibold text-xl text-purple-700">Global Community</h3>
              <p className="text-gray-600">
                Join thousands of users and suppliers from around the world in one
                trusted marketplace.
              </p>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="text-center py-8">
          <blockquote className="italic text-xl text-gray-700 max-w-3xl mx-auto">
            “At StoreZ, we don’t just sell products — we build connections,
            empower businesses, and create shopping experiences that people love.”
          </blockquote>
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
            <section className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white rounded-2xl shadow-2xl shadow-purple-500/20 text-center py-10 space-y-3 border border-purple-300">
              <h2 className="text-3xl font-bold">Join the StoreZ Experience</h2>
              <p className="text-purple-50 text-lg max-w-2xl mx-auto">
                Be part of the future of e-commerce — faster, simpler, and safer than
                ever before. Discover what makes StoreZ the preferred destination for
                smart shoppers worldwide.
              </p>
              <a
                  href="/register-user"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl mt-4"
              >
                Get Started Today
              </a>
            </section>
        )}
      </div>
  );
}

export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <section className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold text-brand-700">Contact Us</h1>
                <p className="text-gray-600 text-lg">
                    We’d love to hear from you! Whether you have questions, feedback, or partnership ideas — our team is here to help. 💬
                </p>
            </section>

            {/* Info + Form */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-6 space-y-4 text-gray-700">
                    <h2 className="text-2xl font-semibold text-brand-700">📍 Our Office</h2>
                    <p>
                        <strong>StoreZ HQ</strong><br />
                        Lousbergstr 52072<br />
                         Aachen, Germany
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-700">📧 Get in Touch</h2>
                    <p>
                        <strong>Email:</strong>  zaksab98@gmail.com<br />
                        <strong>Phone:</strong> +49 176 20827199 <br />
                        <strong>Hours:</strong> Mon–Fri, 9 AM – 6 PM
                    </p>

                    <p className="italic text-gray-500">
                        Response time: within 24 hours during business days.
                    </p>
                </div>

                <form
                    className="card p-6 space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault()
                        alert("Thank you for reaching out! Your message has been sent (mock).")
                    }}
                >
                    <h2 className="text-2xl font-semibold text-brand-700">✉️ Send us a message</h2>
                    <input className="input" placeholder="Your Name" required />
                    <input className="input" placeholder="Your Email" type="email" required />
                    <input className="input" placeholder="Subject" required />
                    <textarea className="input" placeholder="Your Message..." rows={5} required />
                    <button className="btn btn-primary w-full font-semibold">Send Message</button>
                </form>
            </div>

            {/* Map or CTA */}
            <section className="card p-6 bg-brand-50 text-center space-y-2">
                <h3 className="text-xl font-bold text-brand-700">🌍 Visit us at our HQ or reach us online anytime.</h3>
                <p className="text-gray-600">We’re expanding globally — new regional offices opening soon!</p>
            </section>
        </div>
    )
}

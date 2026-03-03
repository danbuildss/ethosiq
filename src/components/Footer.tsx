export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-serif text-xl tracking-tight text-white">
              Ethos<span className="text-gradient"> IQ</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              AI-powered reputation coaching for web3. Built on Base.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Ecosystem
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-500">Ethos Network</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Bankr</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Base</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Ethos IQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

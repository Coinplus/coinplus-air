import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center sm:justify-center p-4 selection:bg-[#FB6D40] selection:text-white">
      <Head>
        <title>Air - Coinplus</title>
        <meta name="description" content="Coinplus QuickCheck for your crypto address." />
        <link rel="icon" href="favicon.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="favicon-apple.png" />
      </Head>

      <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md mt-8 sm:mt-0">
        <section className="border-b pb-4 mb-6">
          <h1 className="font-bold text-2xl text-gray-800 flex items-center justify-between">
            <a
              href="https://coinplus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[100px] h-[39px]">
              <Image src="/img/logo.svg" alt="Coinplus Logo" fill className="object-contain" />
            </a>
            <span>QuickCheck</span> <div className="w-[100px]" />
          </h1>
        </section>

        <section className="text-center py-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-[#FB6D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Address Provided</h2>
            <p className="text-gray-600 mb-4">
              Scan a Coinplus card QR code to check your crypto balance instantly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-500 mb-3">Expected URL format:</p>
            <code className="block bg-white rounded px-3 py-2 text-xs text-gray-700 font-mono break-all">
              /[currency]/[address]
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Example: <span className="font-semibold">/btc/1A1zP1eP...</span>
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">Supported currencies:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['BTC', 'ETH', 'BCH', 'LTC', 'XTZ'].map((currency) => (
                <span
                  key={currency}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                  {currency}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-md text-center mx-auto mt-8 pb-4">
        <div className="mb-6">
          <div className="font-bold text-sm text-gray-600 mb-4">Download Coinplus app</div>
          <div className="flex justify-center space-x-4">
            <a
              href="https://apps.apple.com/us/app/coinplus-wallet/id6466606575?uo=2"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-105 transition-transform">
              <Image src="/img/appstore.svg" alt="App Store" width={120} height={40} />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.coinplus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-105 transition-transform">
              <Image src="/img/googleplay.svg" alt="Google Play" width={120} height={40} />
            </a>
          </div>
        </div>
        <div>
          <div className="font-bold text-sm text-gray-600 mb-3">Join our community</div>
          <div className="flex justify-center space-x-3">
            <a
              href="https://x.com/coinplus"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors transform hover:scale-110">
              <Image src="/img/x.svg" alt="X (Twitter)" width={18} height={18} />
            </a>
            <a
              href="https://www.facebook.com/coin.plus/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors transform hover:scale-110">
              <Image src="/img/fb.svg" alt="Facebook" width={18} height={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/coinplus"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors transform hover:scale-110">
              <Image src="/img/in.svg" alt="LinkedIn" width={18} height={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

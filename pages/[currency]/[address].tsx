'use client';

import { useEffect, useState, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { ToastContainer, toast } from 'react-toastify';

const Air: NextPage = () => {
  const [balance, setBalance] = useState('');
  // const [history, setHistory] = useState<Response>();
  // const [transList, setTransList] = useState('');

  const router = useRouter();

  type RouterParams = {
    currency: string;
    address: string;
  };

  const { currency, address } = router.query as RouterParams;

  const showToast = () => {
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const addressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      showToast();
    }
  };

  const currencyResources = {
    eth: {
      balance: `https://api.etherscan.io/api?module=account&action=balance&address=${address}`,
      history: `https://etherscan.io/address/${address}`,
      tokens: `https://etherscan.io/tokenholdings?a=${address}`,
      ratio: 0.000000000000000001,
    },
    btc: {
      balance: `https://blockchain.info/balance?active=${address}&cors=true`,
      // history: `https://chain.api.btc.com/v3/address/${address}/tx`,
      history: `/api/history?address=${address}`,
      transaction: `/api/transaction?hash=`,
      ratio: 0.00000001,
    },
    bch: {
      balance: `https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}`,
      history: `https://blockchair.com/bitcoin-cash/address/${address}`,
      ratio: 0.00000001,
    },
    ltc: {
      balance: `https://api.blockchair.com/litecoin/dashboards/address/${address}`,
      history: `https://blockchair.com/litecoin/address/${address}`,
      ratio: 0.00000001,
    },
    xtz: {
      balance: `https://api.tzkt.io/v1/accounts/${address}`,
      history: `https://tezos.id/${address}`,
      ratio: 0.000001,
    },
  };

  const cl = currency?.toLowerCase() as keyof typeof currencyResources;

  const getBalance = useCallback(() => {
    if (!cl || !currencyResources[cl]) return;

    const { balance: balanceUrl, ratio } = currencyResources[cl];

    fetch(balanceUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        if (cl === 'btc') {
          setBalance((responseJson[address].final_balance * ratio).toFixed(4));
        } else if (cl === 'eth') {
          setBalance((responseJson.result * ratio).toFixed(4));
        } else if (cl === 'ltc' || cl === 'bch') {
          setBalance((responseJson.data[address].address.balance * ratio).toFixed(4));
        } else if (cl === 'xtz') {
          if (responseJson.type === 'empty') {
            setBalance('0.0000');
          } else {
            setBalance((responseJson.balance * ratio).toFixed(4));
          }
        }
      })
      .catch(() => {
        setBalance('N/A');
      });
  }, [address, cl]);

  // const getHistory = async () => {
  //   const { history } =
  //     currencyResources[cl as keyof typeof currencyResources] ||
  //     ({} as (typeof currencyResources)[keyof typeof currencyResources]);
  //   // console.log("history -", await history);
  //   // console.log("cl -", cl);
  //   const res = cl && (await fetch(history));
  //   setHistory(await res.json());
  //   console.log(history);
  // };

  const format = (address: string) => {
    const firstFive = address?.substring(0, 5);
    const lastFive = address?.substring(address.length - 5);

    return `${firstFive}...${lastFive}`;
  };

  useEffect(() => {
    if (address && !balance) {
      getBalance();
    }
    // address && getHistory();
  }, [address, balance, getBalance]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#FB6D40] selection:text-white">
      <Head>
        <title>Air - Coinplus</title>
        <meta name="description" content="Coinplus QuickCheck for your crypto address." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <ToastContainer />

      <header className="mb-6 text-center">
        <a href="https://coinplus.com" target="_blank" rel="noopener noreferrer">
          <Image src="/img/logo.svg" alt="Coinplus Logo" width={118} height={46} />
        </a>
      </header>

      <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <section className="text-center border-b pb-4 mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Coinplus QuickCheck</h1>
        </section>

        {address ? (
          <>
            <section className="grid grid-cols-2 gap-4 text-left mb-6">
              {/* <div>
                <div className="text-sm font-semibold text-gray-500">Condition</div>
                <div className="flex items-center bg-gray-100 rounded-lg py-1 px-3 mt-1 w-fit">
                  <span className="text-gray-800 text-sm">New</span>
                  <Image src="/img/new.svg" alt="new" width={12} height={12} className="ml-2" />
                </div>
              </div> */}
              <div>
                <div className="text-sm font-semibold text-gray-500">Balance</div>
                <div className="px-3 py-1 bg-gray-100 font-normal rounded-lg mt-1 w-fit min-h-[28px]">
                  <span className="font-bold text-gray-800">{balance || '...'}</span>
                  <span className="text-gray-600 ml-1 text-sm">{cl?.toUpperCase()}</span>
                </div>
              </div>
            </section>

            <section className="my-6">
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                <QRCodeSVG value={address} size={192} bgColor="#f9fafb" fgColor="#1f2937" />
              </div>
            </section>

            <section>
              <label htmlFor="address-display" className="block text-left text-sm font-semibold text-gray-500 mb-1">
                Your address
              </label>
              <div onClick={addressToClipboard} className="relative flex items-center cursor-pointer group">
                <input
                  id="address-display"
                  readOnly
                  value={address}
                  className="w-full bg-gray-100 rounded-lg p-3 pr-12 font-mono text-sm text-gray-700 border-transparent focus:border-orange-500 focus:ring-0 pointer-events-none"
                />
                <div
                  className="absolute right-0 h-full px-4 flex items-center justify-center text-gray-500 group-hover:text-gray-800 transition-colors"
                  aria-label="Copy address">
                  <Image src="/img/copy.svg" alt="copy" width={20} height={20} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading address data...</p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-md mt-8 text-center">
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
            {/* <a
              className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
              href="https://coinplus.com"
              target="_blank"
              rel="noopener noreferrer">
              <Image src="/img/reddit.svg" alt="App Store" width={17} height={17} />
            </a> */}
            {/* <a
              className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
              href="https://coinplus.com"
              target="_blank"
              rel="noopener noreferrer">
              <Image src="/img/greenstar.svg" alt="Google Play" width={17} height={17} />
            </a> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Air;

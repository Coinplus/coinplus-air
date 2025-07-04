'use client';

import { useEffect, useState } from 'react';
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
    navigator.clipboard.writeText(address);
    showToast();
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

  const getBalance = () => {
    const { balance, ratio } =
      currencyResources[cl as keyof typeof currencyResources] ||
      ({} as (typeof currencyResources)[keyof typeof currencyResources]);

    fetch(balance)
      .then(function (response) {
        return response.json();
      })
      .then(function (responseJson) {
        // console.log(responseJson);
        if (cl === 'btc') {
          setBalance((responseJson[address].final_balance * ratio).toFixed(4)); //wei to eth
        }
        if (cl === 'eth') {
          setBalance((responseJson.result * ratio).toFixed(4)); //wei to eth
        }
        if (cl === 'ltc' || cl === 'bch') {
          setBalance((responseJson.data[address].address.balance * ratio).toFixed(4)); //wei to eth
        }
        if (cl === 'xtz') {
          // console.log(responseJson);
          if (responseJson.type == 'empty') {
            setBalance('0');
          } else {
            setBalance((responseJson.balance * ratio).toFixed(4)); //wei to eth
          }
        }
      })
      .catch(function (e) {
        setBalance('Not Available');
      });
  };
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
    !balance && cl && getBalance();
    // address && getHistory();
  }, [cl, address]);

  return (
    <div className="flex max-w-86 min-h-screen h-full flex-col items-center justify-center py-2 sm:overflow-y-auto overflow-y-auto">
      <Head>
        <title>Air - Coinplus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <a className="flex items-center justify-center" href="https://coinplus.com" target="_blank">
        <Image src="/img/logo.svg" alt="Coinplus Logo" width={118} height={46} />
      </a>
      <main className="flex sm:w-86 lg:w-86 w-86 flex-1 flex-col items-center text-center mb-1 pt-5">
        <ToastContainer />
        <section className="flex justify-between">
          <div className="w-1/2 font-bold text-3xl text-left align-text-bottom my-auto border-b-4 rounded border-[#FB6D40]">
            Coinplus QuickCheck
          </div>
          <div className="">
            <Image src="/img/card.svg" alt="Coinplus Card" width={138} height={128} />
            {/* <Image
              src="/img/bar.svg"
              alt="Coinplus Bar"
              width={138}
              height={128}
            /> */}
          </div>
        </section>
        <section className="text-left flex w-full">
          <div className="flex-col pr-6">
            <div className="flex">
              <div className="flex text-sm mr-1 font-bold">Condition</div>
              {/* <Image src="/img/info.svg" alt="info" width={20} height={20} /> */}
            </div>
            <div className="flex w-16 bg-slate-100 rounded-lg justify-between py-1 px-2">
              <div>New</div>
              <Image src="/img/new.svg" alt="info" width={10} height={10} />
              {/* <div>Used</div>
              <Image src="/img/used.svg" alt="info" width={10} height={10} /> */}
            </div>
          </div>
          {/* <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Type</div>
            <div className="px-1 py-1 bg-slate-100 rounded-lg">Card</div>
          </div>
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Color</div>
            <div className="px-1 py-1 bg-slate-100 rounded-lg">Orange</div>
          </div> */}
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Balance</div>
            <div className="px-1 py-1 bg-slate-100 font-normal rounded-lg">{`${balance} ${cl}`}</div>
          </div>
        </section>
        {/* <section className="text-left flex w-full my-2">
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Balance</div>
            <div className="px-1 py-1 bg-slate-100 font-normal rounded-lg">{`${balance} ${cl}`}</div>
          </div>
        </section> */}
        <section className="flex flex-col w-full my-2">
          <div className="px-4 py-4 bg-slate-100 h-68 rounded-xl flex-col justify-items-center">
            <QRCodeSVG value={address} className="flex self-center mx-auto w-44 h-44" />
            <button
              onClick={addressToClipboard}
              className="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 h-14 max-w-72 w-72 rounded-lg mt-4">
              <div className="flex">
                <Image src="/img/copy.svg" alt="info" width={24} height={24} />
                <div className="flex flex-col mx-2">
                  <div className="text-left text-base font-semibold">Your address</div>
                  <span id="address" className="max-w-40 w-40 text-left address text-sm text-[#4F6486]">
                    {format(address)}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="history h-14 w-full">
          {/* <button
            onClick={() => window.open('https://apps.apple.com/us/app/coinplus-wallet/id6466606575?uo=2')}
            className="bg-blueGray hover:bg-slate-200 text-black font-bold py-1 px-4 h-14 w-full rounded-lg mt-4">
            <div className="flex justify-between">
              <Image src="/img/history.svg" alt="History" width={24} height={24} />
              <div className="flex flex-col mx-2">
                <div className="text-left text-base font-medium">History</div>
                <span id="address" className="address font-normal text-sm text-[#4F6486]">
                  Check the list of your transactions
                </span>
              </div>
              <Image src="/img/arrowright.svg" alt="Open history" width={24} height={24} />
            </div>
          </button> */}
          <section className="flex flex-col my-7">
            <div className="font-bold text-sm text-left mb-3">Download Coinplus app</div>
            <div className="flex w-56 justify-between">
              <a
                className="flex items-center justify-center"
                href="https://apps.apple.com/us/app/coinplus-wallet/id6466606575?uo=2"
                target="_blank"
                rel="noopener noreferrer">
                <Image src="/img/appstore.svg" alt="App Store" width={100} height={28.9} />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://play.google.com/store/apps/details?id=com.coinplus.app"
                target="_blank"
                rel="noopener noreferrer">
                <Image src="/img/googleplay.svg" alt="Google Play" width={100} height={28.9} />
              </a>
            </div>
          </section>
          <section className="flex flex-col mt-7 mb-2">
            <div className="font-bold text-sm text-left mb-3">Join community</div>
            <div className="flex w-64 justify-left">
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://x.com/coinplus"
                target="_blank"
                rel="noopener noreferrer">
                <Image src="/img/x.svg" alt="twitter" width={17} height={17} />
              </a>
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://www.facebook.com/coin.plus/"
                target="_blank"
                rel="noopener noreferrer">
                <Image src="/img/fb.svg" alt="facebook" width={17} height={17} />
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
          </section>
        </section>
      </main>
    </div>
  );
};

export default Air;

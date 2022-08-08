import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

const Air: NextPage = () => {
  const [balance, setBalance] = useState("");

  const router = useRouter();

  type RouterParams = {
    currency: string;
    address: string;
  };

  const { currency, address } = router.query as RouterParams;

  const addressToClipboard = () => {
    navigator.clipboard.writeText(address as string);
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
      history: `https://www.blockchain.com/btc/address/${address}?sort=0`,
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
      ({} as typeof currencyResources[keyof typeof currencyResources]);

    fetch(balance)
      .then(function (response) {
        return response.json();
      })
      .then(function (responseJson) {
        console.log(responseJson);
        if (cl === "btc") {
          setBalance((responseJson[address].final_balance * ratio).toFixed(4)); //wei to eth
        }
        if (cl === "eth") {
          setBalance((responseJson.result * ratio).toFixed(4)); //wei to eth
        }
        if (cl === "ltc" || cl === "bch") {
          setBalance(
            (responseJson.data[address].address.balance * ratio).toFixed(4)
          ); //wei to eth
        }
        if (cl === "xtz") {
          console.log(responseJson);
          if (responseJson.type == "empty") {
            setBalance("0");
          } else {
            setBalance((responseJson.balance * ratio).toFixed(4)); //wei to eth
          }
        }
      })
      .catch(function (e) {
        setBalance("Not Available");
      });
  };

  getBalance();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Air - Coinplus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <section className="flex flex-col">
          <h1 id="title" className="title">
            {cl}
          </h1>
          <Image id="qrcode" className="qrcode" src="" alt="" />
          <span id="address" className="address text-[#d81e5b]">
            {address}
          </span>
          <button
            onClick={addressToClipboard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            COPY ADDRESS
          </button>
        </section>

        <section className="balance">
          <div>
            <span id="balance_total" className="balance-total">
              {balance}
            </span>
            <span id="balance_unconfirmed"></span>
            <span className="balance-token" id="token"></span>
          </div>
          <div className="flex flex-col">
            <a
              href={currencyResources[cl]?.history}
              id="balance_history"
              className="balance-history underline text-sky-700 hover:text-purple-700"
              target="_blank"
            >
              History of transactions
            </a>
            <a
              href="#"
              id="balance_tokens"
              className="balance-tokens underline text-sky-700 hover:text-purple-700"
              target="_blank"
            >
              View my tokens
            </a>
          </div>
        </section>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://coinplus.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image
            src="/img/logo.png"
            alt="Coinplus Logo"
            width={16.658227848}
            height={16}
          />
        </a>
      </footer>
    </div>
  );
};

export default Air;

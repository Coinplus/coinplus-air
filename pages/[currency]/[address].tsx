import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const Air: NextPage = () => {
  const [balance, setBalance] = useState("");
  const [history, setHistory] = useState<Response>();
  const [transList, setTransList] = useState("");

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
          // console.log(responseJson);
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
  const getHistory = async () => {
    const { history } =
      currencyResources[cl as keyof typeof currencyResources] ||
      ({} as (typeof currencyResources)[keyof typeof currencyResources]);
    // console.log("history -", await history);
    // console.log("cl -", cl);
    const res = cl && (await fetch(history));
    setHistory(await res.json());
    // console.log(history);
  };

  useEffect(() => {
    !balance && cl && getBalance();
    address && getHistory();
  }, [cl, address]);

  return (
    <div className="flex max-w-86 min-h-screen h-full flex-col items-center justify-center py-2 px-4">
      <Head>
        <title>Air - Coinplus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <a
        className="flex items-center justify-center"
        href="https://coinplus.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/img/logo.svg"
          alt="Coinplus Logo"
          width={118}
          height={46}
        />
      </a>
      <main className="flex sm:w-86 lg:w-86 w-86 flex-1 flex-col items-center justify-center text-center mb-1 sm:overflow-y-auto overflow-y-auto">
        <section className="flex justify-between">
          <div className="w-1/2 font-bold text-3xl text-left align-text-bottom my-auto border-b-4 rounded border-[#FB6D40]">
            Coinplus QuickCheck
          </div>
          <div className="">
            <Image
              src="/img/card.svg"
              alt="Coinplus Card"
              width={138}
              height={128}
            />
          </div>
        </section>
        <section className="text-left flex w-full">
          <div className="flex-col pr-6">
            <div className="flex">
              <div className="flex text-sm mr-1 font-bold">Condition</div>
              <Image src="/img/info.svg" alt="info" width={20} height={20} />
            </div>
            <div className="flex w-16 bg-slate-100 rounded-lg justify-between py-1 px-2">
              <div>New</div>
              <Image src="/img/new.svg" alt="info" width={10} height={10} />
            </div>
          </div>
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Type</div>
            <div className="px-1 py-1 bg-slate-100 rounded-lg">Card</div>
          </div>
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Color</div>
            <div className="px-1 py-1 bg-slate-100 rounded-lg">Orange</div>
          </div>
        </section>
        <section className="text-left flex w-full my-2">
          <div className="flex-col pr-6">
            <div className="flex text-sm font-bold">Balance</div>
            <div className="px-1 py-1 bg-slate-100 font-normal rounded-lg">
              {`${balance} ${cl}`}
            </div>
          </div>
        </section>
        <section className="flex flex-col w-full my-2">
          <div className="px-4 py-4 bg-slate-100 h-68 rounded-xl flex-col justify-items-center">
            <QRCodeSVG
              value={address}
              className="flex self-center mx-auto w-44 h-44"
            />
            <button
              onClick={addressToClipboard}
              className="bg-white hover:bg-slate-200 text-black font-bold py-2 px-4 h-14 max-w-72 w-72 rounded-lg mt-4 text-ellipsis overflow-hidden"
            >
              <div className="flex">
                <Image src="/img/copy.svg" alt="info" width={24} height={24} />
                <div className="flex flex-col mx-2">
                  <div className="text-left text-base font-semibold">
                    Your address
                  </div>
                  <span
                    id="address"
                    className="max-w-40 w-40 text-ellipsis text-left overflow-hidden address text-sm text-[#4F6486]"
                  >
                    {address}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="history h-14 w-full">
          <button
            onClick={addressToClipboard}
            className="bg-blueGray hover:bg-slate-200 text-black font-bold py-1 px-4 h-14 w-full rounded-lg mt-4"
          >
            <div className="flex justify-between">
              <Image
                src="/img/history.svg"
                alt="History"
                width={24}
                height={24}
              />
              <div className="flex flex-col mx-2">
                <div className="text-left text-base font-medium">History</div>
                <span
                  id="address"
                  className="address font-normal text-sm text-[#4F6486]"
                >
                  Check the list of your transactions
                </span>
              </div>
              <Image
                src="/img/arrowright.svg"
                alt="Open history"
                width={24}
                height={24}
              />
            </div>
          </button>
          <section className="flex flex-col my-7">
            <div className="font-bold text-sm text-left mb-3">
              Download Coinplus app
            </div>
            <div className="flex w-56 justify-between">
              <a
                className="flex items-center justify-center"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/appstore.svg"
                  alt="App Store"
                  width={100}
                  height={28.9}
                />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/googleplay.svg"
                  alt="Google Play"
                  width={100}
                  height={28.9}
                />
              </a>
            </div>
          </section>
          <section className="flex flex-col mt-7 mb-2">
            <div className="font-bold text-sm text-left mb-3">
              Join community
            </div>
            <div className="flex w-52 justify-between">
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/img/x.svg" alt="twitter" width={17} height={17} />
              </a>
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/dc.svg"
                  alt="Google Play"
                  width={17}
                  height={17}
                />
              </a>
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/reddit.svg"
                  alt="App Store"
                  width={17}
                  height={17}
                />
              </a>
              <a
                className="flex items-center bg-blueGray hover:bg-slate-200 justify-center w-8 h-8 rounded-full"
                href="https://coinplus.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/greenstar.svg"
                  alt="Google Play"
                  width={17}
                  height={17}
                />
              </a>
            </div>
          </section>
          {/* <div>
            <span id="balance_total" className="balance-total">
              {`${balance} ${cl}`}
            </span>
            <span id="balance_unconfirmed"></span>
            <span className="balance-token" id="token"></span>
          </div>
          <div className="flex flex-col"> */}
          {/* <div>
              {history?.txs?.map((item) => {
                return (
                  <div key={item.hash}>
                    <div>{`hash   ${item.hash}   ${new Date(
                      item.time * 1000
                    )}`}</div>
                    <div className="my-4 border flex flex-row justify-between	">
                      <div className="flex flex-col">
                        {item.inputs.map((i) => {
                          return (
                            <span
                              className={`bg-lime-600 ${
                                address == i.prev_out.addr && "text-sky-700"
                              }`}
                            >
                              {`${i.prev_out.addr} ${
                                i.prev_out.value * currencyResources[cl]?.ratio
                              } ${cl}`}
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex flex-col">
                        {item.out.map((i) => {
                          return (
                            <span
                              className={`bg-red-500  ${
                                address == i.addr && "text-sky-700"
                              }`}
                            >{`${i.addr} ${
                              i.value * currencyResources[cl]?.ratio
                            } ${cl}`}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          {/* <a
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
          </div> */}
        </section>
      </main>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">
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
      </footer> */}
    </div>
  );
};

export default Air;

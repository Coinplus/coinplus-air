import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorProps } from "next/error";
import historyJson from "./15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew.json";

type Data = Promise<{
  address: string;
}>;

const getHistory = async (address: NextApiRequest["query"]["key"]) => {
  try {
    // const res = await fetch(`https://blockchain.info/rawaddr/${address}`);
    // const data = await res.json();
    // console.log(res);
    // const data = await res;
    // console.log("data - ", historyJson);
    return historyJson;
  } catch (e: any) {
    console.error("ERROR", e.message);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getHistory(req.query.address);
  console.log(response);
  res.status(200).json(response);
}

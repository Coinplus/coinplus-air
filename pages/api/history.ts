import type { NextApiRequest, NextApiResponse } from 'next';

const getHistory = async (address: NextApiRequest['query']['key']) => {
  try {
    const res = await fetch(`https://blockchain.info/rawaddr/${address}`);
    const historyJson = await res.json();
    console.log('data - ', historyJson);
    return historyJson;
  } catch (e: any) {
    console.error('ERROR', e.message);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getHistory(req.query.address);
  console.log(response);
  res.status(200).json(response);
}

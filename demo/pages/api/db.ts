import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { SqlanaStore } from "sqlana-store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const { address } = req.query;
  const payer = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(process.env.WALLET!))
  );
  const network = process.env.NETWORK!;
  const client = new SqlanaStore({
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
    payer,
    network: network,
  });
  await client.getDrive();
  //   await client.initClient();
  const db = await client.createDatabase({
    name: "solana_quotes",
    size: 1,
    unit: "MB",
  });
  res.status(200).json({ db });
}

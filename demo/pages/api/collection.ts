import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { SqlanaStore } from "sqlana-store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { address } = req.query;
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
  await client.initClient("7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q");
  if (req.method === "GET") {
    const collection = await client.createCollection(
      "7ihYQdkxeWcJEGJwb1wc7mYhJho2bdGE6D7x6RE3Nq4Q",
      "quotes"
    );
    res.status(200).json({ collection });
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}

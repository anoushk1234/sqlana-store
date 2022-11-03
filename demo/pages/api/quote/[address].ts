import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import SqlanaStore from "sqlana-store/core/sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
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
  if (req.method === "POST") {
  }
  if (req.method === "GET") {
    if (address) {
      //get one
    } else {
      //get all
    }
  }
  if (req.method === "PUT") {
  }
  if (req.method === "DELETE") {
  }
}

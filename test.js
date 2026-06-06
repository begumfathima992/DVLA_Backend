import {
  Connection,
  Transaction,
  TransactionInstruction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  PublicKey,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";
import bs58 from "bs58";
import anchor from "@coral-xyz/anchor";
import crypto from "crypto";
// ====================== CONFIG ======================
const PROGRAM_ID = new PublicKey(
  "B8V8HUXReH9b5xeyD3CP6e1exBz1ZRKh75r6ZtJ1zeZG",
);
const AUTHORIZED_SECRET_KEY = bs58.decode(
  "UjtQmef2WqS6AnE3Jjb7LkPt9eLACT76JNJ54EW2Md6tKqUQmM9kjujhjfgTjFWheYuc4BQ8a3PEjYJgEPHXfEX",
); // ← Replace

import nacl from "tweetnacl";
import idl from "./ideals";

// ====================== CONFIG ======================

// const PROGRAM_ID = new PublicKey("B8V8HUXReH9b5xeyD3CP6e1exBz1ZRKh75r6ZtJ1zeZG");

// Replace with your actual base58 private key

// const AUTHORIZED_SECRET_KEY = bs58.decode("YOUR_PRIVATE_KEY_BASE58_HERE");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// ====================================================

// import idl from "./signationature.js"; // ← Update path if needed

const program = new anchor.Program(idl, PROGRAM_ID);
// ====================================================

async function sendSecureNonceTransaction(baseValue = 123, baseValue2 = 456) {
  const signer = Keypair.fromSecretKey(AUTHORIZED_SECRET_KEY);
  const timestamp = Math.floor(Date.now() / 1000);

  console.log("📌 Timestamp:", timestamp);
  console.log("📌 Base1:", baseValue, "Base2:", baseValue2);

  // 1. Build message exactly as Rust program expects
  const message = Buffer.concat([
    Buffer.from(new Uint32Array([baseValue]).buffer),
    Buffer.from(new Uint32Array([baseValue2]).buffer),
    Buffer.from(new BigInt64Array([BigInt(timestamp)]).buffer),
  ]);

  // 2. Create Ed25519 signature
  const signature = nacl.sign.detached(message, signer.secretKey);

  // 3. Create Ed25519 Program Instruction
  const ed25519Ix = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
    publicKey: signer.publicKey.toBytes(),
    message: message,
    signature: signature,
  });

  // 4. Create Program Instruction (with correct discriminator)
  const discriminator = crypto
    .createHash("sha256")
    .update("global:process_with_nonce")
    .digest()
    .slice(0, 8);

  const ix = await program.methods
    .processWithNonce(baseValue, baseValue2, timestamp)
    .accounts({
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .instruction();

  // Override the data with correct discriminator + args (in case IDL mismatch)
  ix.data = Buffer.concat([
    discriminator,
    Buffer.from(new Uint32Array([baseValue]).buffer),
    Buffer.from(new Uint32Array([baseValue2]).buffer),
    Buffer.from(new BigInt64Array([BigInt(timestamp)]).buffer),
  ]);

  // 5. Build Transaction
  const tx = new anchor.web3.Transaction().add(ed25519Ix).add(ix);

  tx.feePayer = signer.publicKey;
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("finalized");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  tx.sign(signer);

  console.log("🚀 Sending transaction...");

  try {
    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: true,
      maxRetries: 3,
    });

    console.log("📨 Tx Signature:", signature);
    console.log(`🔗 https://solscan.io/tx/${signature}?cluster=devnet`);

    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed",
    );

    if (confirmation.value.err) {
      console.error("❌ Transaction failed:", confirmation.value.err);
    } else {
      console.log("🎉 SUCCESS! Transaction confirmed on Devnet.");
    }
  } catch (err) {
    console.error("❌ Error:", err.logs ? err.logs.join("\n") : err.message);
  }
}

// Run
sendSecureNonceTransaction().catch(console.error);

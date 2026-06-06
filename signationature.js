export const IDL = {
  version: "0.1.0",
  name: "secure_nonce",
  instructions: [
    {
      name: "processWithNonce",
      accounts: [
        {
          name: "ixSysvar",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "baseValue",
          type: "u32",
        },
        {
          name: "baseValue2",
          type: "u32",
        },
        {
          name: "timestamp",
          type: "i64",
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidNonce",
      msg: "Timestamp is too old or too far in the future",
    },
    {
      code: 6001,
      name: "MissingEd25519Instruction",
      msg: "Ed25519 instruction must be the first instruction",
    },
    {
      code: 6002,
      name: "UnauthorizedSigner",
      msg: "Signature was not made by the authorized private key",
    },
    {
      code: 6003,
      name: "MessageMismatch",
      msg: "Signed message does not match expected payload",
    },
  ],
};

const HOST = "oast.fun";

class KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;

  constructor(publicKey: CryptoKey, privateKey: CryptoKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}

class KeyGenerator {
  publicKey: CryptoKey | null = null;
  privateKey: CryptoKey | null = null;

  async generateKeys(): Promise<void> {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      throw new Error("Public key not generated yet.");
    }

    const exportedKey = await crypto.subtle.exportKey("spki", this.publicKey);
    const exportedAsString = String.fromCharCode.apply(
      null,
      new Uint8Array(exportedKey)
    );
    const base64Encoded = btoa(exportedAsString);

    const chunks = this.splitStringEveryN(base64Encoded, 64);
    let pubKey = "-----BEGIN PUBLIC KEY-----\n";
    for (const chunk of chunks) {
      pubKey += chunk + "\n";
    }
    pubKey += "-----END PUBLIC KEY-----\n";
    return pubKey;
  }

  private splitStringEveryN(str: string, n: number): string[] {
    const result = [];
    for (let i = 0; i < str.length; i += n) {
      result.push(str.substr(i, n));
    }
    return result;
  }
}

const xid = (len: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let xid = "";
  for (let i = 0; i < len; i++) {
    xid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return xid;
};

export const register = async () => {
  const keyGenerator = new KeyGenerator();
  await keyGenerator.generateKeys();
  const publicKey = await keyGenerator.getPublicKey();
  const privateKey = keyGenerator.privateKey;
  const secretKey = crypto.randomUUID();
  const correlationId = xid(20);

  const data = {
    "public-key": btoa(publicKey),
    "secret-key": secretKey,
    "correlation-id": correlationId,
  };

  return fetch(`https://${HOST}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return {
      secretKey,
      correlationId,
      privateKey,
      responseStatusCode: response.status,
      hostname: correlationId + xid(13) + "." + HOST,
    };
  });
};

interface InteractSHResponse {
  protocol: string;
  uniqueId: string;
  rawRequest: string;
  timestamp: string;
  remoteAddress: string;
}

export const poll = async (
  secretKey: string,
  correlationId: string,
  privateKey: CryptoKey
) => {
  return fetch(`https://${HOST}/poll?id=${correlationId}&secret=${secretKey}`)
    .then((response) => response.json())
    .then(async (data) => {
      if (data["data"] == null) return;

      const aesKey = data["aes_key"];
      const decryptedAesKey = await decryptAesKey(aesKey, privateKey);
      const dataArr = data["data"];

      let decodedData: InteractSHResponse[] = []
      dataArr.forEach((item: any) => {
        const decryptedData = JSON.parse(processData(item,  btoa(decryptedAesKey)));
        decodedData.push({
          protocol: decryptedData["protocol"],
          uniqueId: decryptedData["unique-id"],
          rawRequest: decryptedData["raw-request"],
          timestamp: decryptedData["timestamp"],
          remoteAddress: decryptedData["remote-address"],
        });
      });

      return {
        decodedData
      };
    });
};

const decryptAesKey = (
  encrypted: string,
  privateKey: CryptoKey
): Promise<string> => {
  const encryptedArray = Uint8Array.from(atob(encrypted), (c) =>
    c.charCodeAt(0)
  );
  return crypto.subtle
    .decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedArray
    )
    .then((decrypted) => {
      return new TextDecoder().decode(decrypted);
    });
};


// yeah, i also hate this. but it works..... I've spent 10 hours to get it working 😭 if anyone knows how to do it without crypto library let me know
import * as _crypto from "crypto";
const processData = (item: string, aesKey: string) => {
  const iv = Buffer.from(item, "base64").slice(0, 16);
  const key = Buffer.from(aesKey, "base64");
  // @ts-ignore
  const decipher: any = _crypto.default.createDecipheriv("aes-256-cfb", key, iv);
  let mystr = decipher.update(Buffer.from(item, "base64").slice(16));
  mystr += decipher.final("utf8");
  const test = mystr.toString();
  return test;
}
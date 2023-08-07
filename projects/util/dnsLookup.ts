import dns from "dns";

type dnsLookup = {
  address: string;
  family: number;
};

const dnsLookup = (hostname: string): Promise<dnsLookup> => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address, family) => {
      if (err) reject(err);
      else resolve({ address, family });
    });
  });
};

export default dnsLookup;

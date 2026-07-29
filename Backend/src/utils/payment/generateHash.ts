import crypto from "crypto";

export const generateSecureHash = (
  data: Record<string, string | number | undefined>
): string => {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;

  const sortedKeys = Object.keys(data)
    .filter(
      (key) =>
        key.startsWith("pp_") &&
        key !== "pp_SecureHash" &&
        data[key] !== undefined &&
        data[key] !== ""
    )
    .sort();

  const values = sortedKeys.map((key) => String(data[key]));

  const hashString = `${integritySalt}&${values.join("&")}`;

  return crypto
    .createHmac("sha256", integritySalt)
    .update(hashString, "utf8")
    .digest("hex")
    .toUpperCase();
};
export default function generateLinkDownload(req) {
  let chars = "123456789abcdefghijklmnopqrstuvwxyz";
  let randomChars = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomChars += chars[randomIndex];
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const linkId = `${baseUrl}/download/${randomChars}`;

  return linkId;
}

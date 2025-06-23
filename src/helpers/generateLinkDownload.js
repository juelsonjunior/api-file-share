export default function generateLinkDownload(req) {
  let chars = "123456789abcdefghijklmnopqrstuvwxyz";
  let linkId = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    linkId += chars[randomIndex];
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const downloadUrl = `${baseUrl}/files/${linkId}`;

  return { linkId, downloadUrl };
}

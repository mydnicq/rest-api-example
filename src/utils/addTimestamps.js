export default function({ input, type = "both" }) {
  const data = input;
  const now = new Date().toUTCString();
  switch (type) {
    case "both":
      data.created_at = now;
      data.updated_at = now;
      break;
    case "created":
      data.created_at = now;
      break;
    case "updated":
      data.updated_at = now;
      break;

    default:
      break;
  }
}

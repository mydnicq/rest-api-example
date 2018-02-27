/* eslint no-console: 0 */
import Server from "./core/Server";

(async () => {
  const status = await new Server().start();
  console.log(status);
})().catch(err => {
  console.error("ERROR:", err);
});

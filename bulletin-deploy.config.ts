import { defineConfig } from "bulletin-deploy";

// Product manifest written on every deploy. The CLI aborts when `domain` differs
// from the name being deployed, so deploy-dotns.yml exports DEPLOY_DOMAIN to
// keep production and staging in agreement with it.
export default defineConfig({
  domain: process.env.DEPLOY_DOMAIN ?? "onchain-arcade.paseo",
  displayName: "Onchain Arcade",
  description:
    "Turn-based multiplayer games on Polkadot. Moves sync peer-to-peer through the Statement Store.",
  icon: {
    path: "./public/arcade-icon.png",
    format: "png",
  },
  executables: [
    {
      kind: "app",
      path: "./dist",
      appVersion: [0, 1, 0],
    },
  ],
});

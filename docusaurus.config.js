// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Quinn Dougherty",
  staticDirectories: ["static"],
  tagline: "Software etc. He/him. Philadelphia.",
  url: "https://quinnd.net",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "quinn-dougherty", // Usually your GitHub org/user name.
  projectName: "quinnd.net", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/quinn-dougherty/quinnd.net",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Quinn Dougherty",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.png",
        },
        items: [{ to: "/cv", label: "CV", position: "left" }],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Socials",
            items: [
              {
                label: "LessWrong",
                href: "https://lesswrong.com/users/quinn-dougherty",
              },
              {
                label: "Effective Altruism Forum",
                href: "https://forum.effectivealtruism.org/users/quinn",
              },
              {
                label: "Manifold",
                href: "https://manifold.markets/Quinn",
              },
              {
                label: "GitHub",
                href: "https://github.com/quinn-dougherty",
              },
            ],
          },
        ],
        copyright: `Site built at ${new Date()}.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

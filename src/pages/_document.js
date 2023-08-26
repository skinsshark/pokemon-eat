import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Pokémon Eat</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/icon-192.png" />
        <meta name="theme-color" content="#fefeee" />

        <meta property="og:title" content="Pokémon Eat" />
        <meta
          property="og:description"
          content="Meal planning for Snorlax using your ingredients in Pokemon Sleep"
        />
        <meta property="og:image" content="/assets/preview.png" />

        {/* Twitter meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pokémon Eat" />
        <meta
          name="twitter:description"
          content="Meal planning for Snorlax using your ingredients in Pokemon Sleep"
        />
        <meta name="twitter:image" content="/assets/preview.png" />
        <meta name="twitter:creator" content="@skinsshark" />
      </Head>
      <body className="flex justify-center items-center xl:px-10">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

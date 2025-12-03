import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>InnKeeper</span>,
  project: {
    link: 'https://github.com/yourusername/innkeeper',
  },
  docsRepositoryBase: 'https://github.com/yourusername/innkeeper/tree/main/apps/web/docs',
  footer: {
    text: 'InnKeeper Documentation © 2025',
  },
  primaryHue: 30, // Brown/orange theme to match game aesthetic
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – InnKeeper',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="InnKeeper - A blockchain-based dungeon crawler game with AI agents" />
      <meta name="theme-color" content="#2a1d17" />
    </>
  ),
};

export default config;

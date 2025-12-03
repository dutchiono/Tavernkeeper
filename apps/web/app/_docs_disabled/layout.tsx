import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import themeConfig from '../../docs/theme.config';

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        {themeConfig.head}
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar
              logo={themeConfig.logo}
              project={themeConfig.project}
            />
          }
          pageMap={pageMap}
          docsRepositoryBase={themeConfig.docsRepositoryBase}
          footer={<Footer>{themeConfig.footer?.text || 'InnKeeper Documentation'}</Footer>}
          sidebar={themeConfig.sidebar}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}

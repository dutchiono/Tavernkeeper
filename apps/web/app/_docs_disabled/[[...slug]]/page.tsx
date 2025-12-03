import { generateStaticParamsFor, importPage } from 'nextra/pages';

export const generateStaticParams = generateStaticParamsFor('slug');

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const { metadata } = await importPage(params.slug || []);
  return metadata;
}

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const { default: MDXContent } = await importPage(params.slug || []);
  return <MDXContent {...props} params={params} />;
}

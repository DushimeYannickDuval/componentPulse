import type { Metadata } from 'next';

import { ProductDetailsView } from 'src/sections/shop/view';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: 'Product Details - componentPulse',
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <ProductDetailsView slug={slug} />;
}

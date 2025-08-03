// pages/deals/bundles/[slug].tsx
import { GetServerSideProps } from "next";
import Image from "next/image";

export default function BundleDetail({ bundle }: any) {
  if (!bundle) return <div className="p-8">Bundle not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{bundle.title}</h1>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${bundle.image}`}
        alt={bundle.title}
        width={600}
        height={400}
        className="rounded shadow mb-6"
      />
      <ul className="list-disc text-gray-700 pl-5 mb-4">
        {Array.isArray(bundle.items) ? bundle.items.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        )) : <li>No items listed</li>}
      </ul>
      <p className="text-blue-600 text-2xl font-bold">
        UGX {parseFloat(bundle.price).toLocaleString()}
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/bundles/${slug}/`);
    if (!res.ok) return { props: { bundle: null } };
    const bundle = await res.json();
    return { props: { bundle } };
  } catch (err) {
    return { props: { bundle: null } };
  }
};

// pages/deals/packages/[slug].tsx
import { GetServerSideProps } from "next";
import Image from "next/image";

export default function PackageDetail({ pack }: any) {
  if (!pack) return <div className="p-8">Package not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{pack.title}</h1>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${pack.image}`}
        alt={pack.title}
        width={600}
        height={400}
        className="rounded shadow mb-6"
      />
      <p className="text-gray-700 mb-4">{pack.description}</p>
      <p className="text-blue-600 text-2xl font-bold">
        UGX {parseFloat(pack.price).toLocaleString()}
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/packages/${slug}/`);
    if (!res.ok) return { props: { pack: null } };
    const pack = await res.json();
    return { props: { pack } };
  } catch (err) {
    return { props: { pack: null } };
  }
};

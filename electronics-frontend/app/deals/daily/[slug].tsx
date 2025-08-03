// pages/deals/daily/[slug].tsx
import { GetServerSideProps } from "next";
import Image from "next/image";

export default function DailyDealDetail({ deal }: any) {
  if (!deal) return <div className="p-8">Deal not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{deal.title}</h1>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${deal.image}`}
        alt={deal.title}
        width={600}
        height={400}
        className="rounded shadow mb-6"
      />
      <p className="text-lg text-gray-700 mb-4">{deal.description}</p>
      <p className="text-green-600 text-2xl font-bold">
        UGX {parseFloat(deal.price).toLocaleString()}
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/daily-deals/${slug}/`);
    if (!res.ok) return { props: { deal: null } };
    const deal = await res.json();
    return { props: { deal } };
  } catch (err) {
    return { props: { deal: null } };
  }
};

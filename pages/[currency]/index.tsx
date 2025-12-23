import type { NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next';

const Currency: NextPage = () => {
  return (
    <div>
      <p>No currency provided</p>
    </div>
  );
};

export default Currency;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { currency } = context.query;

  // temporary hack to fix the issue if the address is provided instead of currency
  if (!['eth', 'btc', 'bch', 'ltc', 'xtz'].includes(currency as string)) {
    return {
      redirect: {
        permanent: false,
        destination: `/btc/${currency}`,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

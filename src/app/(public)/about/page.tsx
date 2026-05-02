import type { Metadata } from 'next';

import { AboutView } from 'src/sections/about/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'About Us - componentPulse',
  description:
    "Learn about componentPulse, Uganda's leading supplier of electronic components and solar solutions.",
};

export default function Page() {
  return <AboutView />;
}

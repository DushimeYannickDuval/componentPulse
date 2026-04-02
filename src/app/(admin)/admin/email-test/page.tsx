import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { EmailTestView } from 'src/sections/admin/email-test/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Email Testing - ${CONFIG.appName}` };

export default function Page() {
  return <EmailTestView />;
}

import { Resend } from 'resend';

// ----------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Only initialize Resend if API key is available
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM_EMAIL = 'ComponentPulse <orders@componentpulseug.com>';

// ----------------------------------------------------------------------

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    pesapal: 'Online Payment (Pesapal)',
    cash_on_delivery: 'Cash on Delivery',
  };
  return labels[method] || method;
}

// ----------------------------------------------------------------------

export function buildEmailLayout(content: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 16px;"><tr><td align="center"><table cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,167,111,0.10);"><tr><td style="background:#00A76F;padding:28px 40px;text-align:center;"><span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">ComponentPulse</span></td></tr><tr><td style="padding:40px;">${content}</td></tr><tr><td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;"><p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Questions? <a href="mailto:support@componentpulseug.com" style="color:#00A76F;text-decoration:none;">support@componentpulseug.com</a></p><p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${new Date().getFullYear()} ComponentPulse. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;
}

// ----------------------------------------------------------------------

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.totalPrice)}</td>
        </tr>
      `
      )
      .join('');

    const html = buildEmailLayout(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Order Confirmed!</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Thank you, ${data.customerName}! Your order has been received and is being processed.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;color:#374151;font-size:14px;"><strong>Order #${data.orderNumber}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead><tr style="background:#f9fafb;">
          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#374151;border-bottom:2px solid #e5e7eb;">Product</th>
          <th style="padding:10px 8px;text-align:center;font-size:13px;color:#374151;border-bottom:2px solid #e5e7eb;">Qty</th>
          <th style="padding:10px 8px;text-align:right;font-size:13px;color:#374151;border-bottom:2px solid #e5e7eb;">Price</th>
          <th style="padding:10px 8px;text-align:right;font-size:13px;color:#374151;border-bottom:2px solid #e5e7eb;">Total</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr style="background:#f9fafb;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;border-radius:8px 8px 0 0;">Subtotal</td><td style="padding:10px 16px;text-align:right;font-size:14px;color:#374151;">${formatCurrency(data.subtotal)}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:10px 16px;color:#6b7280;font-size:14px;">Delivery</td><td style="padding:10px 16px;text-align:right;font-size:14px;color:#374151;">${data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee)}</td></tr>
        ${data.discount > 0 ? `<tr style="background:#f9fafb;"><td style="padding:10px 16px;color:#d32f2f;font-size:14px;">Discount</td><td style="padding:10px 16px;text-align:right;font-size:14px;color:#d32f2f;">-${formatCurrency(data.discount)}</td></tr>` : ''}
        <tr style="border-top:2px solid #e5e7eb;"><td style="padding:12px 16px;font-weight:700;font-size:16px;color:#111827;">Total</td><td style="padding:12px 16px;text-align:right;font-weight:700;font-size:16px;color:#00A76F;">${formatCurrency(data.total)}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="vertical-align:top;padding-right:16px;width:50%;">
            <p style="margin:0 0 8px;font-weight:600;font-size:14px;color:#111827;">Shipping Address</p>
            <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">${data.shippingAddress.fullName}<br>${data.shippingAddress.addressLine1}<br>${data.shippingAddress.city}<br>${data.shippingAddress.phone}</p>
          </td>
          <td style="vertical-align:top;width:50%;">
            <p style="margin:0 0 8px;font-weight:600;font-size:14px;color:#111827;">Payment Method</p>
            <p style="margin:0;color:#6b7280;font-size:14px;">${getPaymentMethodLabel(data.paymentMethod)}</p>
          </td>
        </tr>
      </table>
      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">View Your Order</a>
      </div>
    `);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmed - #${data.orderNumber}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  newStatus: string,
  statusNote?: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const statusLabels: Record<string, { label: string; description: string; color: string }> = {
      confirmed: {
        label: 'Confirmed',
        description: 'Your order has been confirmed and is being prepared.',
        color: '#2196f3',
      },
      processing: {
        label: 'Processing',
        description: 'Your order is being processed and prepared for shipping.',
        color: '#ff9800',
      },
      ready_for_pickup: {
        label: 'Ready for Pickup',
        description: 'Your order is ready and waiting for the delivery partner.',
        color: '#9c27b0',
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        description: 'Your order is on its way! Our delivery partner will contact you shortly.',
        color: '#1976d2',
      },
      delivered: {
        label: 'Delivered',
        description: 'Your order has been delivered. Thank you for shopping with us!',
        color: '#4caf50',
      },
      cancelled: {
        label: 'Cancelled',
        description:
          'Your order has been cancelled. If you have any questions, please contact support.',
        color: '#f44336',
      },
    };

    const statusInfo = statusLabels[newStatus] || {
      label: newStatus,
      description: 'Your order status has been updated.',
      color: '#666',
    };

    const html = buildEmailLayout(`
      <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111827;text-align:center;">Order Status Update</h2>
      <div style="text-align:center;margin-bottom:24px;">
        <span style="display:inline-block;background:${statusInfo.color};color:#ffffff;padding:8px 20px;border-radius:20px;font-weight:600;font-size:14px;">${statusInfo.label}</span>
      </div>
      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:28px;text-align:center;">
        <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111827;">Order #${orderNumber}</p>
        <p style="margin:0;color:#6b7280;font-size:15px;">Hi ${customerName}, ${statusInfo.description}</p>
        ${statusNote ? `<p style="margin:12px 0 0;color:#6b7280;font-size:14px;font-style:italic;">"${statusNote}"</p>` : ''}
      </div>
      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Track Your Order</a>
      </div>
    `);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Update - #${orderNumber} is ${statusInfo.label}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send order status update email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function sendTicketReplyEmail(
  customerEmail: string,
  customerName: string,
  ticketNumber: string,
  ticketSubject: string,
  replyContent: string,
  ticketUrl: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const html = buildEmailLayout(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Support Reply</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${customerName}, our support team has replied to your ticket.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Ticket: ${ticketNumber}</p>
        <p style="margin:0;font-weight:600;color:#111827;font-size:15px;">${ticketSubject}</p>
      </div>
      <div style="background:#f9fafb;border-left:4px solid #00A76F;padding:16px 20px;border-radius:0 4px 4px 0;margin-bottom:28px;">
        <p style="margin:0;color:#374151;font-size:15px;white-space:pre-wrap;line-height:1.6;">${replyContent}</p>
      </div>
      <div style="text-align:center;">
        <a href="${ticketUrl}" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">View Ticket &amp; Reply</a>
      </div>
    `);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Re: [${ticketNumber}] ${ticketSubject}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send ticket reply email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function sendTicketConfirmationEmail(
  customerEmail: string,
  customerName: string,
  ticketSubject: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping email.');
    return false;
  }

  try {
    const html = buildEmailLayout(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">We've Received Your Request</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${customerName}, your support request has been successfully submitted.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Subject</p>
        <p style="margin:0;font-weight:600;color:#111827;font-size:15px;">${ticketSubject}</p>
      </div>
      <p style="color:#6b7280;font-size:15px;margin:0 0 8px;line-height:1.6;">Our support team is reviewing your request and will get back to you as soon as possible.</p>
    `);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Support Request Received: ${ticketSubject}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send ticket confirmation email:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export type TrainingUpdateType = 'launched' | 'updated' | 'coming_soon';

export async function sendTrainingUpdateEmail(
  recipientEmail: string,
  recipientName: string,
  moduleTitle: string,
  updateType: TrainingUpdateType,
  moduleUrl: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Skipping training email.');
    return false;
  }

  const updateConfig: Record<
    TrainingUpdateType,
    { subject: string; heading: string; description: string; color: string; buttonLabel: string }
  > = {
    launched: {
      subject: `🚀 "${moduleTitle}" is now live!`,
      heading: 'Your training module is now live!',
      description: `Great news! The training module <strong>${moduleTitle}</strong> that you subscribed to has officially launched. It&apos;s now available for you to access.`,
      color: '#4caf50',
      buttonLabel: 'Start Learning Now',
    },
    updated: {
      subject: `📚 "${moduleTitle}" has been updated`,
      heading: 'Training module updated',
      description: `The training module <strong>${moduleTitle}</strong> has been updated with new content. Check out the latest materials and improvements.`,
      color: '#1976d2',
      buttonLabel: 'View Updates',
    },
    coming_soon: {
      subject: `Coming Soon: "${moduleTitle}"`,
      heading: 'A new training module is coming soon!',
      description: `We wanted to let you know that <strong>${moduleTitle}</strong> is coming soon. We&apos;ll send you another email as soon as it launches.`,
      color: '#ff9800',
      buttonLabel: 'Preview Module',
    },
  };

  const config = updateConfig[updateType];

  const html = buildEmailLayout(`
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;background:${config.color};color:#ffffff;padding:7px 18px;border-radius:20px;font-weight:600;font-size:13px;">${config.heading}</span>
    </div>
    <div style="background:#f9fafb;border-radius:8px;padding:24px;margin-bottom:20px;">
      <p style="margin:0 0 12px;color:#374151;font-size:15px;">Hi ${recipientName || 'there'},</p>
      <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.6;">${config.description}</p>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;color:#374151;"><strong>Module:</strong> ${moduleTitle}</p>
    </div>
    <div style="text-align:center;">
      <a href="${moduleUrl}" style="display:inline-block;background:#00A76F;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${config.buttonLabel}</a>
    </div>
    <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;text-align:center;">You received this email because you subscribed to updates for this training module.</p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: config.subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send training update email:', error);
    return false;
  }
}

export async function sendProductReviewRequestEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  items: { id: string; name: string }[]
): Promise<boolean> {
  if (!resend) return false;

  const html = buildEmailLayout(`
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">How did we do?</h2>
    <p style="margin:0 0 8px;color:#6b7280;font-size:15px;">Hi ${customerName},</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Your order <strong style="color:#111827;">#${orderNumber}</strong> has been delivered! We hope you love your new components. Could you take a moment to share your feedback?</p>
    <div style="margin-bottom:28px;">
      ${items.map((item) => `
        <div style="margin-bottom:12px;padding:14px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;"><tr>
            <td style="vertical-align:middle;font-weight:500;color:#374151;font-size:14px;">${item.name}</td>
            <td style="vertical-align:middle;text-align:right;"><a href="${process.env.NEXT_PUBLIC_APP_URL}/products/${item.id}" style="display:inline-block;background:#00A76F;color:#ffffff;text-decoration:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:600;">Leave Review</a></td>
          </tr></table>
        </div>
      `).join('')}
    </div>
    <p style="margin:0;color:#6b7280;font-size:14px;text-align:center;">Thank you for shopping with ComponentPulse!</p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Tell us what you think! ⭐',
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send product review email:', error);
    return false;
  }
}

/**
 * Contact Form API Route
 * ======================
 * Handles contact form submissions and sends notifications to Slack
 */

import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'partnership' | 'support' | 'booking';
}

// Slack webhook URL - set this in your environment variables
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Emoji mapping for inquiry types
const inquiryEmojis: Record<string, string> = {
  general: '💬',
  partnership: '🤝',
  support: '🛠️',
  booking: '🎫',
};

// Color mapping for Slack attachment
const inquiryColors: Record<string, string> = {
  general: '#6B46C1',
  partnership: '#22c55e',
  support: '#f97316',
  booking: '#0066CC',
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!body[field as keyof ContactFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Format the inquiry type label
    const inquiryTypeLabels: Record<string, string> = {
      general: 'General Inquiry',
      partnership: 'Corporate Partnership',
      support: 'Support Request',
      booking: 'Booking Help',
    };

    // Send to Slack
    if (SLACK_WEBHOOK_URL) {
      const slackPayload = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${inquiryEmojis[body.inquiryType] || '📩'} New Contact Form Submission`,
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Name:*\n${body.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*Type:*\n${inquiryTypeLabels[body.inquiryType] || body.inquiryType}`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Email:*\n<mailto:${body.email}|${body.email}>`,
              },
              {
                type: 'mrkdwn',
                text: `*Phone:*\n<tel:${body.phone.replace(/\s/g, '')}|${body.phone}>`,
              },
            ],
          },
          ...(body.company
            ? [
                {
                  type: 'section',
                  fields: [
                    {
                      type: 'mrkdwn',
                      text: `*Company:*\n${body.company}`,
                    },
                  ],
                },
              ]
            : []),
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Subject:*\n${body.subject}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${body.message}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `📍 *Source:* BLR Transit Contact Form | 🕐 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
              },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '📧 Reply via Email',
                  emoji: true,
                },
                url: `mailto:${body.email}?subject=Re: ${encodeURIComponent(body.subject)}`,
                style: 'primary',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '📞 Call',
                  emoji: true,
                },
                url: `tel:${body.phone.replace(/\s/g, '')}`,
              },
            ],
          },
        ],
        attachments: [
          {
            color: inquiryColors[body.inquiryType] || '#6B46C1',
            fallback: `New contact from ${body.name}: ${body.subject}`,
          },
        ],
      };

      const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload),
      });

      if (!slackResponse.ok) {
        console.error('[Contact] Slack notification failed:', await slackResponse.text());
        // Don't fail the request if Slack fails - just log it
      } else {
        console.log('[Contact] Slack notification sent successfully');
      }
    } else {
      console.warn('[Contact] SLACK_WEBHOOK_URL not configured - skipping Slack notification');
      // Log the contact submission for debugging
      console.log('[Contact] Form submission:', {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        subject: body.subject,
        inquiryType: body.inquiryType,
        messageLength: body.message.length,
      });
    }

    // TODO: Optionally save to database here
    // await prisma.contactSubmission.create({ data: body });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('[Contact] Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}

// Rate limiting helper (simple in-memory, replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

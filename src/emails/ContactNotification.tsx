import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type Props = {
  name: string;
  email: string;
  organization?: string;
  topic: string;
  message: string;
  ip?: string;
  userAgent?: string;
};

export default function ContactNotification({
  name,
  email,
  organization,
  topic,
  message,
  ip,
  userAgent,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`New enquiry from ${name} — ${topic}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>New enquiry on reyadhasnain.com</Heading>
          <Text style={lead}>
            <strong>{name}</strong> just sent a message via the contact form.
          </Text>

          <Hr style={hr} />

          <Section>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name} &lt;{email}&gt;
              {organization ? ` · ${organization}` : ''}
            </Text>

            <Text style={label}>Topic</Text>
            <Text style={value}>{topic}</Text>

            <Text style={label}>Message</Text>
            <Text style={message_}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={meta}>
              {ip ? `IP: ${ip} · ` : ''}
              {userAgent ? `UA: ${userAgent}` : ''}
            </Text>
            <Text style={meta}>
              Reply directly to this email — it goes back to {name}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#0d1224',
  color: '#fafaf7',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  margin: 0,
  padding: '32px 0',
};
const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '32px',
  maxWidth: '560px',
  borderRadius: '20px',
  background: '#171b30',
  border: '1px solid rgba(255,255,255,0.08)',
};
const h1: React.CSSProperties = {
  margin: 0,
  fontSize: '22px',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: '#fafaf7',
};
const lead: React.CSSProperties = {
  marginTop: '8px',
  color: 'rgba(250,250,247,0.7)',
  fontSize: '15px',
};
const hr: React.CSSProperties = { borderColor: 'rgba(255,255,255,0.08)', margin: '24px 0' };
const label: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: '#6cd4ff',
  margin: '0 0 4px',
};
const value: React.CSSProperties = {
  fontSize: '16px',
  margin: '0 0 18px',
  color: '#fafaf7',
};
const message_: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.65',
  whiteSpace: 'pre-wrap',
  color: '#fafaf7',
  margin: '0 0 18px',
};
const meta: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(250,250,247,0.5)',
  margin: '4px 0',
};

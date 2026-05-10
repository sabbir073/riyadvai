import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components';

type Props = {
  name: string;
};

export default function ContactAutoReply({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks — Reyad has received your message.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Thanks, {name.split(' ')[0]}.</Heading>
          <Text style={lead}>Your message just landed in Reyad's inbox.</Text>

          <Hr style={hr} />

          <Text style={p}>
            Reyad reads every enquiry personally and typically replies within 48 hours. If your
            request is time-sensitive, feel free to reply to this email and add the urgency in the
            subject line.
          </Text>

          <Text style={p}>
            In the meantime, you can browse his selected op-eds and television commentary at{' '}
            <a href="https://reyadhasnain.com/thought-leadership" style={link}>
              reyadhasnain.com/thought-leadership
            </a>
            .
          </Text>

          <Hr style={hr} />

          <Text style={signoff}>— Smart Lab</Text>
          <Text style={small}>
            Reyad Hasnain · Smart Lab Bangladesh ·{' '}
            <a href="https://reyadhasnain.com" style={link}>reyadhasnain.com</a>
          </Text>
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
  fontSize: '24px',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: '#fafaf7',
};
const lead: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '17px',
  color: 'rgba(250,250,247,0.85)',
};
const p: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.65',
  color: 'rgba(250,250,247,0.85)',
};
const link: React.CSSProperties = {
  color: '#6cd4ff',
  textDecoration: 'underline',
};
const hr: React.CSSProperties = { borderColor: 'rgba(255,255,255,0.08)', margin: '24px 0' };
const signoff: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '17px',
  color: '#fafaf7',
};
const small: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(250,250,247,0.5)',
};

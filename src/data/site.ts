// Single source of truth for site-wide identity, contact, and metadata.
// Copy here is editable in one place; pages and JSON-LD draw from it.

export const SITE = {
  name: 'Reyad Hasnain',
  shortName: 'Reyad Hasnain',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://reyadhasnain.com',
  locale: 'en-US',
  language: 'en',
  description:
    'Reyad Hasnain is an ICT Policy Advocate, Telecom Strategist, and Digital Economy Thought Leader with 20+ years of global executive experience across Asia, Africa, Europe, and North America.',
  tagline: 'ICT Policy Advocate · Telecom Strategist · Digital Economy Thought Leader',
} as const;

export const PERSON = {
  givenName: 'Reyad',
  familyName: 'Hasnain',
  fullName: 'Reyad Hasnain',
  headline: 'ICT Policy Advocate · Telecom Strategist · Digital Economy Thought Leader',
  shortBio:
    'A seasoned ICT and telecommunications leader with 20+ years of global executive experience across Asia, Africa, Europe and North America. Reyad combines hands-on industry delivery with active public advocacy to champion Bangladesh’s digital economy, youth empowerment, and technology-driven inclusive growth.',
  longBio:
    'Reyad Hasnain is the Managing Director of Smart Lab and SUBARU Bangladesh, and one of South Asia’s most articulate public voices on ICT policy and the digital economy. Across two decades, he has led nationwide mobile financial service expansions, negotiated and executed €11.2M+ telecom infrastructure deals, and delivered 100% YoY revenue growth across emerging-market portfolios at Mahindra Comviva, Nokia Siemens Networks, and Siemens. Today he writes and speaks on the policy reforms required for Bangladesh to make ICT and IT-enabled services the next RMG — the next great export engine for the country.',
  oneLineBio:
    'ICT Policy Advocate, Telecom Strategist, and MD of Smart Lab Bangladesh — making the case that ICT can be the next RMG.',
  conviction:
    'ICT and IT-enabled services can be the next RMG for Bangladesh.',
  email: 'reyad@smart-lab.biz',
  phone: '+880 1912 100 700',
  phoneHref: 'tel:+8801912100700',
  city: 'Dhaka',
  country: 'Bangladesh',
  address: 'Dhaka, Bangladesh',
  jobTitle: 'Managing Director, Smart Lab & SUBARU Bangladesh',
  worksFor: 'Smart Lab & SUBARU Bangladesh',
  alumniOf: [
    { name: 'North South University', degree: 'MBA' },
    { name: 'Michigan Technological University', degree: 'BSc Electrical Engineering' },
    { name: 'Faujderhat Cadet College', degree: 'SSC & HSC' },
  ],
  affiliations: [
    'Former Joint Secretary General, Cadet College Club',
    'Permanent Member, Chittagong Club',
    'Permanent Member, Banani Club',
  ],
  socials: {
    linkedin: 'https://www.linkedin.com/in/reyad-hasnain', // PLACEHOLDER — replace
    x: 'https://twitter.com/reyadhasnain',                 // PLACEHOLDER — replace
    email: 'mailto:reyad@smart-lab.biz',
  },
} as const;

export const STATS = [
  { value: '20+', label: 'Years global executive experience', sub: 'Asia · Africa · Europe · North America' },
  { value: '€11.2M+', label: 'Telecom infrastructure deals closed', sub: 'Negotiated and executed at NSN' },
  { value: '100%', label: 'YoY revenue growth delivered', sub: 'Across emerging-market portfolios' },
  { value: '4', label: 'Global telecom companies led', sub: 'Smart Lab · Comviva · NSN · Siemens' },
] as const;

export const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Policy', href: '/policy' },
  { label: 'Thought Leadership', href: '/thought-leadership' },
  { label: 'Insights', href: '/insights' },
  { label: 'Speaking', href: '/speaking' },
  { label: 'Media Kit', href: '/media-kit' },
  { label: 'Contact', href: '/contact' },
] as const;

export const OUTLETS = [
  'The Daily Star',
  'The Financial Express',
  'Daily Sun',
  'Dhaka Tribune',
  'Daily Independent',
  'Daily Kalbela',
  'Daily Ittefaq',
  'Jago News',
  'Channel 24',
  'ETV',
  'Independent TV',
  '71 TV',
] as const;

export const PRESS_QUOTES = [
  {
    quote:
      'ICT and IT-enabled services can be the next RMG for Bangladesh — the next great export engine.',
    source: 'Reyad Hasnain',
    context: 'Op-Ed, Daily Sun, May 2025',
  },
  {
    quote:
      'Two-thirds of Bangladeshis are under 35. The demographic dividend will not wait for our policy to catch up.',
    source: 'Reyad Hasnain',
    context: 'Public commentary',
  },
  {
    quote:
      'Modernising telecom and digital policy is the only way to unlock investment, scale ICT exports, and attract global technology capital.',
    source: 'Reyad Hasnain',
    context: 'Policy brief',
  },
] as const;

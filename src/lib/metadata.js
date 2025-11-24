/**
 * SEO Metadata Configuration for MPCPCT
 * Centralized metadata configuration for consistent SEO across all pages
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mpcpct.com';
const siteName = 'MPCPCT - MPCPCT.com | Best CPCT, RSCIT, CCC Exam Practice Platform in Indore';
const defaultDescription = 'MPCPCT - The leading online platform for CPCT, RSCIT, and CCC exam preparation in Indore, Madhya Pradesh. MPCPCT offers comprehensive typing practice in Hindi & English, real-time results, expert guidance, and government job exam preparation. Join thousands of students using MPCPCT to master typing skills for Data Entry Operator, IT Operator, Assistant Grade 3, Shorthand, and Typist positions. Visit MPCPCT.com today!';
const defaultKeywords = 'MPCPCT, MPCPCT.com, MPCPCT Indore, MPCPCT login, MPCPCT signup, MPCPCT exam, MPCPCT practice, MPCPCT typing, MPCPCT CPCT, MPCPCT RSCIT, MPCPCT CCC, CPCT exam Indore, RSCIT exam Indore, CCC exam Indore, CPCT coaching Indore, RSCIT classes Indore, CCC classes Indore, computer proficiency certificate test Indore, typing practice Indore, Hindi typing Indore, English typing Indore, government exam preparation Indore, online exam practice Indore, Madhya Pradesh CPCT, data entry operator Indore, IT operator Indore, assistant grade 3 Indore, shorthand Indore, typist Indore, government job preparation Indore, CPCT practice test Indore, RSCIT online exam Indore, CCC mock test Indore, typing speed test Indore, Hindi typing practice Indore, English typing practice Indore, government job typing test Indore, best typing institute Indore, CPCT training center Indore';

export const defaultMetadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | MPCPCT`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: 'MPCPCT Team', url: siteUrl }],
  creator: 'MPCPCT',
  publisher: 'MPCPCT',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'MPCPCT - MPCPCT.com',
    title: siteName,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/logo2.png`,
        width: 1200,
        height: 630,
        alt: 'MPCPCT - MPCPCT.com | Best CPCT, RSCIT, CCC Exam Practice Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription,
    images: [`${siteUrl}/logo2.png`],
    creator: '@mpcpct',
    site: '@mpcpct',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-IN': `${siteUrl}`,
      'hi-IN': `${siteUrl}/hi`,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'Education',
};

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '',
  image,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | MPCPCT` : defaultMetadata.title.default;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;
  const fullPath = path ? `${siteUrl}${path}` : siteUrl;
  const ogImage = image || `${siteUrl}/logo2.png`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    robots: noindex
      ? { index: false, follow: false }
      : defaultMetadata.robots,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: fullTitle,
      description: fullDescription,
      url: fullPath,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: fullPath,
    },
  };
}

export const pageMetadata = {
  home: generatePageMetadata({
    title: 'MPCPCT - MPCPCT.com | Best CPCT, RSCIT, CCC Exam Practice Platform in Indore',
    description: 'MPCPCT - The #1 platform for CPCT, RSCIT, and CCC exam preparation. Master typing in Hindi & English with MPCPCT. Practice typing tests, skill assessments, and government job exam preparation. Join thousands of students using MPCPCT in Indore, Madhya Pradesh. Visit MPCPCT.com now!',
    keywords: 'MPCPCT, MPCPCT.com, MPCPCT Indore, MPCPCT login, MPCPCT signup, MPCPCT exam, MPCPCT practice, MPCPCT typing, CPCT practice Indore, RSCIT online exam Indore, CCC preparation Indore, typing speed test Indore, Hindi typing practice Indore, government job typing test Indore, best CPCT coaching Indore, RSCIT classes Indore, CCC training Indore',
    path: '/',
  }),
  about: generatePageMetadata({
    title: 'About Us - MPCPCT Team & Mission',
    description: 'Learn about MPCPCT - your trusted partner for CPCT, RSCIT, and CCC exam preparation. Founded by Captain Nadeem, we help you master typing and computer proficiency skills.',
    keywords: 'about MPCPCT, MPCPCT founder, Captain Nadeem, typing tutor, computer proficiency training',
    path: '/about-us',
  }),
  contact: generatePageMetadata({
    title: 'Contact Us - MPCPCT Support Team',
    description: 'Get in touch with MPCPCT support team. Email: Mpcpct111@gmail.com | Phone: 8989966753. We respond within 24 hours.',
    keywords: 'contact MPCPCT, MPCPCT support, customer service, help desk',
    path: '/contact-us',
  }),
  learning: generatePageMetadata({
    title: 'Learning Mode - Practice Typing & Computer Skills',
    description: 'Learn typing and computer proficiency skills at your own pace. Practice with interactive lessons, bilingual support (Hindi & English), and track your progress.',
    keywords: 'typing practice, computer skills learning, Hindi typing tutorial, English typing practice, interactive learning',
    path: '/learning',
  }),
  skillTest: generatePageMetadata({
    title: 'Skill Test - Test Your Typing Speed & Accuracy',
    description: 'Test your typing speed and accuracy with MPCPCT skill tests. Get instant results, detailed analytics, and improve your performance for CPCT, RSCIT, and CCC exams.',
    keywords: 'typing speed test, typing accuracy test, WPM test, skill assessment, typing test online',
    path: '/skill_test',
  }),
  exam: generatePageMetadata({
    title: 'Exam Mode - CPCT, RSCIT, CCC Practice Exams',
    description: 'Practice real exam scenarios for CPCT, RSCIT, and CCC. Simulate actual exam conditions, get detailed results, and boost your confidence for government job exams.',
    keywords: 'CPCT exam practice, RSCIT mock test, CCC practice exam, government exam preparation, online exam simulator',
    path: '/exam',
  }),
  pricing: generatePageMetadata({
    title: 'Pricing Plans - MPCPCT Subscription',
    description: 'Choose the perfect subscription plan for your exam preparation. Affordable pricing with access to all features, practice tests, and learning materials.',
    keywords: 'MPCPCT pricing, subscription plans, exam preparation cost, affordable typing course',
    path: '/price',
  }),
  login: generatePageMetadata({
    title: 'Login - Access Your MPCPCT Account',
    description: 'Login to your MPCPCT account to access practice tests, learning materials, and track your progress.',
    keywords: 'MPCPCT login, user login, account access',
    path: '/login',
    noindex: true,
  }),
  signup: generatePageMetadata({
    title: 'Sign Up - Create Your MPCPCT Account',
    description: 'Create a free MPCPCT account and start your journey to master typing and computer proficiency skills for government job exams.',
    keywords: 'MPCPCT signup, create account, free registration',
    path: '/signup',
  }),
  profile: generatePageMetadata({
    title: 'Profile - Your MPCPCT Dashboard',
    description: 'View your profile, subscription status, exam history, and performance analytics on your MPCPCT dashboard.',
    path: '/profile',
    noindex: true,
  }),
  privacy: generatePageMetadata({
    title: 'Privacy Policy - MPCPCT',
    description: 'Read MPCPCT privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, user privacy',
    path: '/privacy',
  }),
  terms: generatePageMetadata({
    title: 'Terms and Conditions - MPCPCT',
    description: 'Read MPCPCT terms and conditions for using our platform, services, and content.',
    keywords: 'terms and conditions, user agreement, service terms',
    path: '/terms',
  }),
  refund: generatePageMetadata({
    title: 'Refund Policy - MPCPCT',
    description: 'Learn about MPCPCT refund and cancellation policy. 7-day money-back guarantee for unsatisfied customers.',
    keywords: 'refund policy, cancellation policy, money back guarantee',
    path: '/refund',
  }),
  faq: generatePageMetadata({
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to frequently asked questions about MPCPCT, CPCT, RSCIT, and CCC exam preparation. Learn about typing practice, exam formats, and platform features.',
    keywords: 'MPCPCT FAQ, CPCT exam questions, RSCIT exam FAQ, CCC exam help, typing practice questions, computer proficiency FAQ',
    path: '/faq',
  }),
};


import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://hotelclubresortmistico.com.br'
const SITE_TITLE = 'Hotel Club Resort Místico | Coroaci/MG — Natureza, Conforto e Tranquilidade'
const DEFAULT_DESCRIPTION = 'Localizado em Coroaci/MG, o Hotel Club Resort Místico é um refúgio cercado pela beleza natural de Minas Gerais. Suítes para casais, famílias e grupos, piscina, churrasqueira, café da manhã incluso e lazer para todas as idades. Reserve pelo WhatsApp!'

export default function SEO({ title, description, url, image, article, datePublished, authorName }) {
  const fullTitle = title ? `${title} | Hotel Club Resort Místico` : SITE_TITLE
  const metaDescription = description || DEFAULT_DESCRIPTION
  const currUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || `${SITE_URL}/logo.png`

  // Structured Data (JSON-LD)
  const schemaOrgJSONLD = [
    {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      url: SITE_URL,
      name: 'Hotel Club Resort Místico',
      description: DEFAULT_DESCRIPTION,
      telephone: '+55-31-987954136',
      email: 'resortmistico@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Coroaci',
        addressRegion: 'MG',
        addressCountry: 'BR',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Estacionamento', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Churrasqueira', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bar', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Café da manhã', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Área de exercícios', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Ducha externa', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Sinuca', value: true },
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
      sameAs: [],
    },
  ]

  if (article) {
    schemaOrgJSONLD.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      image: image ? [image] : [],
      datePublished: datePublished || '',
      author: {
        '@type': 'Organization',
        name: authorName || 'Hotel Club Resort Místico',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Hotel Club Resort Místico',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
      },
      description: metaDescription,
    })
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Hotel Club Resort Místico" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  )
}

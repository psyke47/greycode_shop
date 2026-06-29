import { Head } from '@inertiajs/react'

export default function PageHead({ title, meta = [], children }) {
  const fullTitle = title ? `${title} | Greycode Shop` : 'Greycode Shop'

  return (
    <Head title={fullTitle}>
      {/* Default fallback meta */}
      {meta.length === 0 && (
        <>
          <meta name="description" content="Greycode Shop – Buy electronic components, DIY kits, sensors, and smart home devices. Fast delivery across South Africa." />
          <meta name="keywords" content="electronics, DIY kits, Arduino, Raspberry Pi, sensors, South Africa" />
        </>
      )}
      
      {/* Custom meta tags passed per page */}
      {meta.map((m, i) => (
        <meta key={i} {...m} />
      ))}

      {/* Allow pages to inject extra head elements (JSON‑LD, canonical, etc.) */}
      {children}
    </Head>
  )
}
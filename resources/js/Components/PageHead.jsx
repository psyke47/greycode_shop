import { Head } from '@inertiajs/react'

export default function PageHead({ title }) {
  const fullTitle = title ? `${title} | Greycode Shop` : 'Greycode Shop'
  
  return <Head title={fullTitle} />
}
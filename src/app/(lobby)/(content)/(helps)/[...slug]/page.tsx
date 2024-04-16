interface PageProps {
  params: {
    slug: string[]
  }
}

export default function Page({ params }: PageProps) {
  return <div>{params.slug}</div>
}

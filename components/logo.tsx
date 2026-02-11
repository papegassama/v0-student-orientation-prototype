import Image from "next/image"

export function Logo({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const dimensions = {
    sm: { container: "h-9 w-9", img: 36 },
    default: { container: "h-10 w-10", img: 40 },
    lg: { container: "h-12 w-12", img: 48 },
  }

  const { container, img } = dimensions[size]

  return (
    <div className={`${container} rounded-xl overflow-hidden shrink-0`}>
      <Image
        src="/logo.jpeg"
        alt="MonOrienta"
        width={img}
        height={img}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  )
}

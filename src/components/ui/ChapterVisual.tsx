import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  /** Modifier class, e.g. "chapter-visual--time". */
  variant: string;
  sizes: string;
  children?: ReactNode;
};

/** Leaf-shaped chapter illustration (3:2). Source images are 1536×1024. */
export function ChapterVisual({ src, alt, variant, sizes, children }: Props) {
  return (
    <figure className={`chapter-visual ${variant}`}>
      <Image src={src} alt={alt} width={1536} height={1024} sizes={sizes} />
      {children}
    </figure>
  );
}

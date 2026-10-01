import Image from "next/image";
import { getProviderInfo, type StorageProvider } from "@/utils/storageConfig";

function logoClassName(invertInDarkMode?: boolean) {
  return `rounded shrink-0 object-contain${
    invertInDarkMode !== false
      ? " dark:invert-[.85] dark:brightness-200"
      : ""
  }`;
}

export default function StorageProviderIcon({
  provider,
  size = 28,
}: {
  provider: StorageProvider;
  size?: number;
}) {
  const info = getProviderInfo(provider);

  return (
    <Image
      src={info.logo}
      alt={info.name}
      width={size}
      height={size}
      className={logoClassName(info.invertInDarkMode)}
    />
  );
}

export function ProviderLogo({
  src,
  alt,
  size = 28,
  invertInDarkMode = true,
}: {
  src: string;
  alt: string;
  size?: number;
  invertInDarkMode?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={logoClassName(invertInDarkMode)}
    />
  );
}

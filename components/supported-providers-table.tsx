import { ProviderLogo } from "@/components/storage-provider-icon";
import {
  getProviderInfo,
  SUPPORTED_PROVIDERS,
  type StorageProvider,
} from "@/utils/storageConfig";

export default function SupportedProvidersTable({
  activeProvider,
}: {
  activeProvider: StorageProvider;
}) {
  return (
    <div className="w-full px-2 lg:px-4 mt-6">
      <h2 className="my-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
        Supported Storage Providers
      </h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 dark:bg-neutral-900/50">
              <th className="text-left py-2.5 px-3 font-medium w-16">Logo</th>
              <th className="text-left py-2.5 px-3 font-medium">Provider</th>
              <th className="text-left py-2.5 px-3 font-medium hidden sm:table-cell">
                Details
              </th>
              <th className="text-left py-2.5 px-3 font-medium w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {SUPPORTED_PROVIDERS.map((providerId) => {
              const provider = getProviderInfo(providerId);
              const isActive = providerId === activeProvider;

              return (
                <tr
                  key={providerId}
                  className={`border-b last:border-b-0 ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-950/30"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                  }`}
                >
                  <td className="py-3 px-3">
                    {provider.includes ? (
                      <div className="flex items-center gap-1">
                        {provider.includes.map((logo) => (
                          <ProviderLogo
                            key={logo}
                            src={logo}
                            alt=""
                            size={22}
                          />
                        ))}
                      </div>
                    ) : (
                      <ProviderLogo
                        src={provider.logo}
                        alt={provider.name}
                        size={28}
                        invertInDarkMode={provider.invertInDarkMode}
                      />
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium">{provider.name}</p>
                    {providerId === "s3-compatible" && (
                      <p className="text-xs text-neutral-500 mt-0.5 sm:hidden">
                        DO Spaces, Backblaze B2, Wasabi, etc.
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 hidden sm:table-cell">
                    {providerId === "s3-compatible" ? (
                      <span>
                        {provider.description} Includes DigitalOcean Spaces,
                        Backblaze B2, Wasabi, and more.
                      </span>
                    ) : (
                      provider.description
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

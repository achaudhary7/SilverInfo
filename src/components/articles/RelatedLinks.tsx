import Link from "next/link";

interface RelatedLink {
  href: string;
  title: string;
  description?: string;
  type?: "article" | "tool" | "guide";
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
}

/**
 * RelatedLinks - Internal link suggestions for articles
 * 
 * Shows related articles, tools, and guides to improve internal linking.
 */
export default function RelatedLinks({ links, title = "Related Resources" }: RelatedLinksProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "tool":
        return "🧮";
      case "guide":
        return "📚";
      case "article":
      default:
        return "📰";
    }
  };

  return (
    <div className="my-6 p-4 sm:p-5 bg-blue-50 rounded-xl border border-blue-200">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>🔗</span>
        {title}
      </h3>
      
      <div className="grid gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
          >
            <span className="text-xl flex-shrink-0">{getIcon(link.type)}</span>
            <div>
              <p className="font-medium text-gray-800 group-hover:text-[#1e3a5f] transition-colors">
                {link.title}
              </p>
              {link.description && (
                <p className="text-sm text-gray-500 mt-0.5">{link.description}</p>
              )}
            </div>
            <span className="ml-auto text-gray-400 group-hover:text-[#1e3a5f] transition-colors">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface SitemapProps {
  setCurrentPage: (page: string) => void;
}

export default function Sitemap({ setCurrentPage }: SitemapProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

      <ul className="list-disc pl-6 space-y-2 text-blue-600">

        <li>
          <button onClick={() => setCurrentPage("home")} className="hover:underline">
            Home
          </button>
        </li>

        <li>
          <button onClick={() => setCurrentPage("services")} className="hover:underline">
            Services
          </button>
        </li>

        <li>
          <button onClick={() => setCurrentPage("about")} className="hover:underline">
            About
          </button>
        </li>

        <li>
          <button onClick={() => setCurrentPage("contact")} className="hover:underline">
            Contact
          </button>
        </li>

        <li>
          <button onClick={() => setCurrentPage("privacy")} className="hover:underline">
            Privacy Policy
          </button>
        </li>

        <li>
          <button onClick={() => setCurrentPage("terms")} className="hover:underline">
            Terms of Service
          </button>
        </li>

      </ul>
    </div>
  );
}

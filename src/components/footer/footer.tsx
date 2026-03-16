import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-gray-400">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-gray-400">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

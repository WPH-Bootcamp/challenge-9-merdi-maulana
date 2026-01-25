import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logo from "../../assets/Logo (1).svg";
import { FaTiktok, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

export function Footer() {
  return (
    <footer className=" from-background bg-black border-t text-left text-white border-white/10  py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl justify-center">
                <img src={logo} alt="Foody Logo" />
              </div>
              <div>
                <h3 className="font-extrabold text-4xl text-white">Foody</h3>
              </div>
            </div>
            <p className="text-sm text-[#FDFDFD] font-normal tracking-tight leading-6">
              Enjoy homemade flavors & chef's signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-sm tracking-tight">
                Follow on Social Media
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 border rounded-full border-neutral-800 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <FaFacebookF className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-neutral-800 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-neutral-800 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <FaLinkedinIn className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-neutral-800 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <FaTiktok className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:col-span-2 md:justify-around md:w-full">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm tracking-wider mb-8">
                Explore
              </h4>
              <ul className="space-y-8 text-sm text-white">
                <li>
                  <Link
                    to="/?category=makanan-utama"
                    className="hover:text-foreground transition-colors"
                  >
                    All Food
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=minuman"
                    className="hover:text-foreground transition-colors"
                  >
                    Nearby
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=snack"
                    className="hover:text-foreground transition-colors"
                  >
                    Discount
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Best Seller
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Lunch
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm tracking-wider mb-8">
                Help
              </h4>
              <ul className="space-y-8 text-sm text-white">
                <li className="flex items-center gap-2">
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    How to Order
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Payment Method
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Track My Order
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link
                    to="/?category=dessert"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

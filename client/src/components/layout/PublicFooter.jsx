import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiBriefcaseLine, RiTeamLine, RiBarChartBoxLine, RiPhoneLine } from 'react-icons/ri';
import logo from '../../assets/logo.png';

const PublicFooter = () => {
  return (
    <footer className="border-t border-gray-200 py-12 px-4 bg-white relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
        <div className="w-full lg:w-1/4">
          <Link to="/" className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
            <img src={logo} alt="HRMS Logo" className="h-10 w-auto opacity-90" />
            <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">HRmanager</span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            All-in-one HR management solution to streamline your processes and empower your people.
          </p>
        </div>

        <div className="w-full lg:w-2/4 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li><Link to="/features" className="hover:text-gray-900">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-gray-900">Pricing</Link></li>
              <li><Link to="/solutions" className="hover:text-gray-900">Solutions</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Updates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Resources</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li><Link to="/resources" className="hover:text-gray-900">Blog</Link></li>
              <li><Link to="/resources" className="hover:text-gray-900">Guides</Link></li>
              <li><Link to="/resources" className="hover:text-gray-900">Help Center</Link></li>
              <li><Link to="/resources" className="hover:text-gray-900">Webinars</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li><Link to="/about" className="hover:text-gray-900">About Us</Link></li>
              <li><Link to="/about" className="hover:text-gray-900">Careers</Link></li>
              <li><Link to="/about" className="hover:text-gray-900">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <h4 className="font-bold text-gray-900 text-sm mb-4">Stay Connected</h4>
          <p className="text-xs text-gray-500 mb-4 font-medium">Subscribe to our newsletter</p>
          <div className="flex mb-6">
            <input type="email" placeholder="Enter your email" className="bg-gray-100 border border-gray-200 rounded-l-full px-4 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#1EB952]" />
            <button className="bg-[#1EB952] text-white px-4 py-2 rounded-r-full flex items-center justify-center hover:bg-[#1AA348] transition-colors border border-[#1EB952]">
              <RiArrowRightLine />
            </button>
          </div>
          {/* Social links placeholder */}
          <div className="flex gap-4 text-gray-400 text-lg">
            <RiBriefcaseLine className="cursor-pointer hover:text-gray-600 transition-colors" />
            <RiTeamLine className="cursor-pointer hover:text-gray-600 transition-colors" />
            <RiBarChartBoxLine className="cursor-pointer hover:text-gray-600 transition-colors" />
            <RiPhoneLine className="cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

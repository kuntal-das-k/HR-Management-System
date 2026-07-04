import { motion } from 'framer-motion';
import { RiBuilding2Line, RiCalendarCheckLine, RiFileTextLine, RiMoneyDollarCircleLine, RiStarFill, RiBarChartBoxLine, RiShieldCheckLine, RiSmartphoneLine } from 'react-icons/ri';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const featuresList = [
  { icon: RiBuilding2Line, title: 'Employee Management', desc: 'Store and manage employee information, documents, roles, and more securely.', color: 'bg-indigo-50 text-indigo-500' },
  { icon: RiCalendarCheckLine, title: 'Attendance Tracking', desc: 'Track attendance, work hours, and overtime with detailed reports and insights.', color: 'bg-green-50 text-green-500' },
  { icon: RiFileTextLine, title: 'Leave Management', desc: 'Employees can apply for leaves and managers can approve with ease.', color: 'bg-orange-50 text-orange-500' },
  { icon: RiMoneyDollarCircleLine, title: 'Payroll Management', desc: 'Automate salary processing, tax calculations, and generate payslips in just a few clicks.', color: 'bg-purple-50 text-purple-500' },
  { icon: RiStarFill, title: 'Performance Management', desc: 'Set goals, review performance, and help employees grow with continuous feedback.', color: 'bg-yellow-50 text-yellow-500' },
  { icon: RiBarChartBoxLine, title: 'Reports & Analytics', desc: 'Get actionable insights with powerful reports and custom dashboards.', color: 'bg-blue-50 text-blue-500' },
  { icon: RiShieldCheckLine, title: 'Secure & Compliant', desc: 'Ensure data security and stay compliant with the latest regulations.', color: 'bg-emerald-50 text-emerald-500' },
  { icon: RiSmartphoneLine, title: 'Mobile Access', desc: 'Access HRMS anytime, anywhere with our mobile-friendly platform.', color: 'bg-pink-50 text-pink-500' },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden text-gray-900 bg-white flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#FDF8F3] via-[#FDF8F3] to-white -z-10" />
      
      <PublicNavbar />

      <main className="flex-grow pt-16 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 dela-gothic-one-regular">
                Powerful <span className="text-[#B58A59]">Features</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your HR operations efficiently, all in one place.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuresList.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mb-6 ${feature.color}`}>
                  <feature.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default FeaturesPage;

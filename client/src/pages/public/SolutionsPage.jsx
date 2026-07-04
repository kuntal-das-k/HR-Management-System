import { motion } from 'framer-motion';
import { RiBuilding2Line, RiTeamLine, RiUser3Line } from 'react-icons/ri';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const solutions = [
  {
    title: 'For Organizations',
    desc: 'Automate HR processes, reduce manual work, ensure compliance, and focus on what matters - your people and growth.',
    icon: RiBuilding2Line,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'For HR Teams',
    desc: 'Simplify employee management, track performance, manage attendance, leaves, payroll, and more in one place.',
    icon: RiTeamLine,
    color: 'text-[#B58A59]',
    bg: 'bg-[#FDF8F3]'
  },
  {
    title: 'For Employees',
    desc: 'Access your information, apply leaves, track attendance, view payslips, and stay updated - anytime, anywhere.',
    icon: RiUser3Line,
    color: 'text-green-600',
    bg: 'bg-green-50'
  }
];

const SolutionsPage = () => {
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
                Solutions for <span className="text-[#1EB952]">Every Team</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how HRmanager caters to the unique needs of your organization, HR professionals, and employees.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${solution.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className={`text-5xl ${solution.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed">{solution.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default SolutionsPage;

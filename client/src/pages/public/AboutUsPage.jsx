import { motion } from 'framer-motion';
import { RiTeamLine, RiHeartPulseLine, RiLightbulbFlashLine, RiGlobalLine } from 'react-icons/ri';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const values = [
  { icon: RiHeartPulseLine, title: 'People First', desc: 'We believe that organizations thrive when their people thrive. Empathy is at the core of everything we build.' },
  { icon: RiLightbulbFlashLine, title: 'Innovation', desc: 'We constantly push boundaries to build modern, intuitive solutions that make HR processes effortless.' },
  { icon: RiTeamLine, title: 'Collaboration', desc: 'Great work happens together. We foster teamwork both within our company and for our customers.' },
  { icon: RiGlobalLine, title: 'Diversity', desc: 'We celebrate diverse perspectives and build tools that help companies create inclusive cultures.' }
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden text-gray-900 bg-white flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#FDF8F3] via-[#FDF8F3] to-white -z-10" />
      
      <PublicNavbar />

      <main className="flex-grow pt-16 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 dela-gothic-one-regular">
                About <span className="text-[#B58A59]">HRmanager</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We are on a mission to revolutionize how organizations manage, engage, and empower their people. HRmanager was built to take the friction out of human resources, so you can focus on building a thriving workplace.
              </p>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#FDF8F3] p-10 rounded-3xl border border-[#E8D5BC]"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To simplify HR operations for businesses of all sizes, making it easier to hire, manage, and retain top talent through smart, accessible technology.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#F4F9F6] p-10 rounded-3xl border border-[#CDEAE0]"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become the global standard for workplace management, empowering millions of professionals to do their best work in a supportive environment.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500">The principles that guide our product and our team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                  <val.icon className="text-3xl text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUsPage;

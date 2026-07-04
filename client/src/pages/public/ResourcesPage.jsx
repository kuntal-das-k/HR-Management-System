import { motion } from 'framer-motion';
import { RiBookOpenLine, RiArticleLine, RiVideoLine, RiQuestionAnswerLine } from 'react-icons/ri';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const resources = [
  { icon: RiArticleLine, title: 'Blog', desc: 'Read the latest news, tips, and insights on HR management and workplace culture.', link: 'Explore Articles' },
  { icon: RiBookOpenLine, title: 'Guides & E-books', desc: 'In-depth guides to help you master HR practices and scale your team.', link: 'Download Guides' },
  { icon: RiVideoLine, title: 'Webinars', desc: 'Watch on-demand webinars from industry experts and HR leaders.', link: 'Watch Now' },
  { icon: RiQuestionAnswerLine, title: 'Help Center', desc: 'Find answers to common questions and learn how to use HRmanager effectively.', link: 'Visit Help Center' },
];

const ResourcesPage = () => {
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
                Helpful <span className="text-[#1EB952]">Resources</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about HR management, product updates, and best practices.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex items-start gap-6 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FDF8F3] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1EB952] group-hover:text-white transition-colors duration-300">
                  <resource.icon className="text-3xl text-[#B58A59] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{resource.desc}</p>
                  <span className="text-[#1EB952] font-semibold text-sm group-hover:underline">{resource.link} &rarr;</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ResourcesPage;

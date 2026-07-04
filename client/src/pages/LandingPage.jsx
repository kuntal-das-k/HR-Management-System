import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiTeamLine, RiCalendarCheckLine, RiFileTextLine,
  RiMoneyDollarCircleLine, RiBarChartBoxLine, RiShieldCheckLine,
  RiArrowRightLine, RiBriefcaseLine, RiPhoneLine, RiArrowDownSLine,
  RiBuilding2Line, RiUser3Line, RiSmartphoneLine, RiAddLine, RiSubtractLine,
  RiStarFill
} from 'react-icons/ri';

import video from "../assets/employee2.mp4";
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';

const teamCards = [
  {
    title: 'For Organizations',
    desc: 'Automate HR processes, reduce manual work, ensure compliance, and focus on what matters - your people and growth.',
    icon: RiBuilding2Line
  },
  {
    title: 'For HR Teams',
    desc: 'Simplify employee management, track performance, manage attendance, leaves, payroll, and more in one place.',
    icon: RiTeamLine
  },
  {
    title: 'For Employees',
    desc: 'Access your information, apply leaves, track attendance, view payslips, and stay updated - anytime, anywhere.',
    icon: RiUser3Line
  }
];

const features = [
  { icon: RiBuilding2Line, title: 'Employee Management', desc: 'Store and manage employee information, documents, roles, and more securely.', color: 'bg-indigo-50 text-indigo-500' },
  { icon: RiCalendarCheckLine, title: 'Attendance Tracking', desc: 'Track attendance, work hours, and overtime with detailed reports and insights.', color: 'bg-green-50 text-green-500' },
  { icon: RiFileTextLine, title: 'Leave Management', desc: 'Employees can apply for leaves and managers can approve with ease.', color: 'bg-orange-50 text-orange-500' },
  { icon: RiMoneyDollarCircleLine, title: 'Payroll Management', desc: 'Automate salary processing, tax calculations, and generate payslips in just a few clicks.', color: 'bg-purple-50 text-purple-500' },
  { icon: RiStarFill, title: 'Performance Management', desc: 'Set goals, review performance, and help employees grow with continuous feedback.', color: 'bg-yellow-50 text-yellow-500' },
  { icon: RiBarChartBoxLine, title: 'Reports & Analytics', desc: 'Get actionable insights with powerful reports and custom dashboards.', color: 'bg-blue-50 text-blue-500' },
  { icon: RiShieldCheckLine, title: 'Secure & Compliant', desc: 'Ensure data security and stay compliant with the latest regulations.', color: 'bg-emerald-50 text-emerald-500' },
  { icon: RiSmartphoneLine, title: 'Mobile Access', desc: 'Access HRMS anytime, anywhere with our mobile-friendly platform.', color: 'bg-pink-50 text-pink-500' },
];

const faqs = [
  { q: 'What features does HRMS include?', a: 'HRMS includes employee management, attendance tracking, payroll processing, leave management, performance evaluations, and comprehensive reporting.' },
  { q: 'Is my data secure with HRMS?', a: 'Yes, we use enterprise-grade encryption and comply with global data protection regulations to ensure your data is always safe.' },
  { q: 'Can employees access their data?', a: 'Absolutely. We provide a self-service portal for employees to view their payslips, apply for leaves, and update their personal information.' },
  { q: 'Is there a mobile app available?', a: 'Yes, HRMS is fully responsive and we offer dedicated mobile apps for both iOS and Android platforms.' },
  { q: 'Can HRMS integrate with other tools?', a: 'Yes, we offer seamless integrations with popular accounting, communication, and productivity tools.' },
  { q: 'Do you offer customer support?', a: 'We offer 24/7 customer support via chat, email, and phone for all our enterprise customers.' }
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen font-sans overflow-x-hidden text-gray-900 bg-white">
      {/* Background gradient at the top */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-[#FDF8F3] via-[#FDF8F3] to-white -z-10" />

      {/* ---- NAV ---- */}
      <PublicNavbar />

      {/* ---- HERO ---- */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-6"
          >
            <div className="flex items-center justify-center gap-4 text-5xl md:text-7xl lg:text-[7.5rem] font-bold tracking-tight leading-none text-gray-900 dela-gothic-one-regular">
              <span>People</span>
              <div className="w-32 h-16 md:w-64 md:h-24 lg:w-80 lg:h-32 rounded-full overflow-hidden mx-1 md:mx-3 flex-shrink-0 bg-gray-200">
                <video autoPlay loop muted src={video} alt="Team collaborating" className="w-full h-full object-cover object-center" />
              </div>
              <span>Matter.</span>
            </div>
            <div className="text-4xl md:text-5xl lg:text-[6rem] font-bold tracking-tight leading-none dela-gothic-one-regular mt-4 md:mt-8">
              <span className="text-gray-900">We Manage, </span>
              <span className="text-[#B58A59]">You Empower.</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Streamline HR operations, manage people, and build a thriving workplace<br className="hidden md:block" />
            with our all-in-one HR management solution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-20"
          >
            <Link to="/register" className="bg-[#1EB952] hover:bg-[#1AA348] text-white px-8 py-3.5 rounded-full font-semibold transition-colors text-sm shadow-sm">
              Get Started Free
            </Link>
            <div className="flex items-center gap-3 cursor-pointer group bg-white px-6 py-2.5 rounded-full border border-[#E8D5BC] hover:bg-[#FDF8F3] transition-colors">
              <span className="font-semibold text-gray-900 text-sm">Take a Tour</span>
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <RiArrowRightLine className="text-gray-900 text-xs" />
              </div>
            </div>
          </motion.div>

          {/* Trusted By Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto bg-[#F4EBE0]/80 border border-[#E8D5BC]/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 md:pr-8 md:border-r border-[#E8D5BC]">
              <RiShieldCheckLine className="text-lg" />
              <span>Trusted by 1000+ companies</span>
            </div>

            <div className="flex-1 flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-90 mix-blend-multiply">
              <span className="font-bold text-2xl tracking-tighter text-[#714B67]">odoo</span>
              <span className="font-bold text-2xl tracking-tight text-[#2B79A6]">greytHR</span>
              <span className="font-bold text-2xl tracking-tighter text-[#C82A2E]">ZOHO</span>
              <span className="font-bold text-2xl tracking-tight text-[#0066CC]">darwin<span className="text-[#333]">box</span></span>
              <span className="font-bold text-2xl tracking-tight text-[#1D1D1D]">keka<span className="text-[#F1C40F]">"</span></span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 md:pl-4">
              <span>and many more</span>
              <div className="w-6 h-6 rounded-full border border-[#E8D5BC] bg-transparent flex items-center justify-center">
                <RiArrowRightLine className="text-[10px]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- BUILT FOR EVERY TEAM ---- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FDF8F3] border border-[#E8D5BC] text-xs font-semibold text-gray-600 mb-8">
            Built for Every Team
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {teamCards.map((card, i) => (
              <div key={i} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-[300px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[85%] relative z-10">{card.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors mt-auto relative z-10">
                  Learn More <RiArrowRightLine />
                </div>

                {/* Simulated person image bottom right */}
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#FDF8F3] rounded-full flex items-center justify-center opacity-90 border-8 border-white">
                  <card.icon className="text-4xl text-[#B58A59]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- POWERFUL FEATURES ---- */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#FDF8F3]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#E8D5BC] text-xs font-semibold text-gray-600 mb-6">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to manage HR, in one place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                    <feature.icon className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 mt-1">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{feature.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors mt-auto">
                  Learn More <RiArrowRightLine />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- STATS & TESTIMONIAL ---- */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-y-12 gap-x-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <RiTeamLine className="text-3xl text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm font-semibold text-gray-500">Happy Users</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <RiBuilding2Line className="text-3xl text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm font-semibold text-gray-500">Companies</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <RiShieldCheckLine className="text-3xl text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm font-semibold text-gray-500">Uptime</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <RiUser3Line className="text-3xl text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm font-semibold text-gray-500">Support</div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-[#FDF8F3] rounded-3xl p-10 border border-[#E8D5BC]">
              <div className="text-5xl text-[#B58A59] font-serif mb-4 leading-none">"</div>
              <p className="text-lg font-medium text-gray-800 mb-8 leading-relaxed">
                HRMS has transformed the way we manage our workforce. It's intuitive, reliable, and has saved us countless hours of manual work.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                    {/* Placeholder for avatar */}
                    <div className="w-full h-full bg-[#B58A59] flex items-center justify-center text-white font-bold text-xl">P</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Priya Sharma</h4>
                    <p className="text-sm text-gray-500">HR Manager, TechSolutions</p>
                  </div>
                </div>
                <div className="flex gap-1 text-yellow-400 text-lg">
                  <RiStarFill /><RiStarFill /><RiStarFill /><RiStarFill /><RiStarFill />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-[#1EB952]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FAQs ---- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FDF8F3] border border-[#E8D5BC] text-xs font-semibold text-gray-600 mb-6">
              FAQs
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Quick Answers to Common Questions</h2>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 py-4">
                <button
                  className="w-full flex items-center justify-between text-left font-semibold text-gray-800 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <RiSubtractLine className="text-gray-500 flex-shrink-0" /> : <RiAddLine className="text-gray-500 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-12 px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#4F7A6A] rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 md:p-14">

            {/* Woman Image Placeholder */}
            <div className="hidden md:block absolute left-8 bottom-0 w-48 h-56 bg-white/10 rounded-t-full border border-white/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <RiUser3Line className="text-6xl text-white/50" />
              </div>
            </div>

            <div className="relative z-10 md:ml-64 text-white text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-3">Ready to Simplify Your HR?</h2>
              <p className="text-white/80 text-sm max-w-md mx-auto md:mx-0">Join thousands of organizations building better workplaces with HRMS.</p>
            </div>

            <div className="relative z-10">
              <Link to="/register" className="inline-flex items-center justify-between bg-white text-gray-900 font-semibold px-8 py-4 rounded-full transition-colors text-sm min-w-[200px] hover:bg-gray-50">
                Get Started Free <RiArrowRightLine />
              </Link>
            </div>

            {/* Squiggly line decoration */}
            <svg className="absolute right-[20%] top-1/2 -translate-y-1/2 opacity-30" width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20C20 20 20 0 40 0C60 0 60 40 80 40C100 40 100 20 120 20" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;

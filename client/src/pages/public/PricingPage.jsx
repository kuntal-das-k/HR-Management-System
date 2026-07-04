import { motion } from 'framer-motion';
import { RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Perfect for small teams just getting started with HR processes.',
    features: [
      { name: 'Up to 10 employees', included: true },
      { name: 'Basic employee directory', included: true },
      { name: 'Leave management', included: true },
      { name: 'Attendance tracking', included: false },
      { name: 'Payroll processing', included: false },
      { name: 'Custom reports', included: false },
    ],
    button: 'Get Started for Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    desc: 'Everything you need to manage growing teams efficiently.',
    features: [
      { name: 'Up to 50 employees', included: true },
      { name: 'Advanced employee directory', included: true },
      { name: 'Leave & attendance management', included: true },
      { name: 'Basic payroll processing', included: true },
      { name: 'Standard reports', included: true },
      { name: 'Dedicated support', included: false },
    ],
    button: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Advanced features and support for large organizations.',
    features: [
      { name: 'Unlimited employees', included: true },
      { name: 'Full HRIS suite', included: true },
      { name: 'Advanced payroll & tax', included: true },
      { name: 'Custom reporting & analytics', included: true },
      { name: 'API access & integrations', included: true },
      { name: '24/7 priority support', included: true },
    ],
    button: 'Contact Sales',
    popular: false,
  }
];

const PricingPage = () => {
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
                Simple, transparent <span className="text-[#1EB952]">pricing</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                No hidden fees. No surprise charges. Pick the plan that best fits your growing team.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-[#1EB952] shadow-lg relative transform md:-translate-y-4' : 'border-gray-200 shadow-sm'} flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1EB952] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6 h-10">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm font-medium">{plan.period}</span>}
                </div>
                
                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        {feature.included ? (
                          <RiCheckLine className="text-[#1EB952] text-xl flex-shrink-0" />
                        ) : (
                          <RiCloseLine className="text-gray-300 text-xl flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  className={`w-full py-3 rounded-full text-center font-bold text-sm transition-colors ${
                    plan.popular
                      ? 'bg-[#1EB952] hover:bg-[#1AA348] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.button}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PricingPage;

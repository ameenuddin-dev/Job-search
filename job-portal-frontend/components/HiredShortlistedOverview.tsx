import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Star } from 'lucide-react';

interface OverviewProps {
  totalApplicants: number;
  shortlisted: number;
  hired: number;
}

const HiredShortlistedOverview: React.FC<OverviewProps> = ({
  totalApplicants,
  shortlisted,
  hired,
}) => {
  const cards = [
    {
      title: 'People view jobs',
      value: totalApplicants,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Shortlisted',
      value: shortlisted,
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      title: 'Hired',
      value: hired,
      icon: CheckCircle,
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  return (
    <div className="grid h grid-rows-1-1 sm:grid-cols-3 gap-6 w-full ">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all flex flex-col h-[250px] items-center"
          >
            {/* Icon on top */}
            <div
              className={`p-4 rounded-full ${card.color} flex items-center justify-center mb-4`}
            >
              <Icon size={32} />
            </div>

            {/* Text below */}
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              <CountUp end={card.value} duration={1.5} separator="," />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HiredShortlistedOverview;

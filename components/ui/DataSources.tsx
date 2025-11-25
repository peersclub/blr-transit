'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, Database, FileText } from 'lucide-react';

interface DataSource {
  name: string;
  url: string;
  metrics?: string[];
  description?: string;
  lastUpdated?: string;
}

const dataSources: DataSource[] = [
  {
    name: 'TomTom Traffic Index 2024',
    url: 'https://www.tomtom.com/traffic-index/',
    metrics: ['Global traffic ranking', 'Average speed', 'Congestion levels', 'Time lost in traffic'],
    description: 'Annual global traffic congestion analysis',
    lastUpdated: '2024',
  },
  {
    name: 'B.PAC Bengaluru Commuter Study',
    url: 'https://bpac.in/bengaluru-commuter-study/',
    metrics: ['Modal split data', 'Personal vehicle usage (60%)', 'Commuter preferences'],
    description: 'Survey of 3,855 Bangalore commuters',
    lastUpdated: '2024',
  },
  {
    name: 'Namma Metro / BMRCL',
    url: 'https://en.wikipedia.org/wiki/Namma_Metro',
    metrics: ['Daily ridership (636K avg)', 'Network length (96.1 km)', 'Station count'],
    description: 'Official metro operational data',
    lastUpdated: 'August 2025',
  },
  {
    name: 'BMTC Official Reports',
    url: 'https://mybmtc.karnataka.gov.in/',
    metrics: ['Fleet size (6,340 buses)', 'Daily ridership (35.8 lakh)', 'Route coverage'],
    description: 'Bangalore Metropolitan Transport Corporation data',
    lastUpdated: '2024',
  },
  {
    name: 'MoveInSync (Tracxn)',
    url: 'https://tracxn.com/d/companies/moveinsync/',
    metrics: ['1M+ daily users', '7,200+ vehicles', '₹438 Cr revenue'],
    description: 'Corporate shuttle market leader data',
    lastUpdated: 'March 2024',
  },
  {
    name: 'Mordor Intelligence Market Report',
    url: 'https://www.mordorintelligence.com/industry-reports/corporate-employee-transportation-service-market',
    metrics: ['Global market: $38B (2024)', 'Projected: $52B (2030)', '5.34% CAGR'],
    description: 'Corporate Employee Transportation Service Market analysis',
    lastUpdated: '2024',
  },
];

export default function DataSources() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <Database className="w-4 h-4" />
        <span>Data Sources & Citations</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-tech-purple" />
                <h4 className="text-lg font-semibold text-white">
                  Data Sources & Methodology
                </h4>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                All statistics presented are sourced from verified public reports and official data.
                Last comprehensive update: November 2025.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataSources.map((source, index) => (
                  <motion.a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-white text-sm group-hover:text-tech-purple transition-colors">
                        {source.name}
                      </h5>
                      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-tech-purple transition-colors" />
                    </div>

                    <p className="text-xs text-gray-500 mb-2">
                      {source.description}
                    </p>

                    {source.metrics && (
                      <div className="flex flex-wrap gap-1">
                        {source.metrics.slice(0, 2).map((metric, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300"
                          >
                            {metric}
                          </span>
                        ))}
                        {source.metrics.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-400">
                            +{source.metrics.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Updated: {source.lastUpdated}
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  <strong className="text-gray-400">Disclaimer:</strong> Commuter flow estimates and some operational
                  projections are based on modeling and may vary from actual figures. For the most current data,
                  please refer to the original sources linked above.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

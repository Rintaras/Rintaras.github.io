import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

const viewport = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' } as const;

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  image?: string;
  links?: Array<{ url: string; label: string }>;
}

export default function TimelineItem({
  year,
  title,
  description,
  image,
  links,
}: TimelineItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="flex gap-8 items-start pl-4 relative"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex-none relative z-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-20 h-20 rounded-full bg-[#111] border-2 border-white/20 flex items-center justify-center text-white overflow-hidden shadow-lg"
        >
          {image && !imageError ? (
            <img
              key={image}
              src={image}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={() => {
                console.warn(`Failed to load image: ${image}`);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
              <span className="text-sm font-medium text-gray-400 tracking-wider">{year}</span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewport}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 pt-4"
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-[#0a0a0a] p-8 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20"
        >
          <div className="text-sm text-gray-400 tracking-widest mb-3 uppercase">{year}</div>
          <h3 className="text-2xl font-medium mb-4 text-white tracking-tight">{title}</h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            {description.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {links.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-white hover:text-gray-300 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={14} className="mr-2" />
                  {link.label}
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
import React, { useRef, useEffect, useState } from 'react';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Code from 'lucide-react/dist/esm/icons/code';
import Server from 'lucide-react/dist/esm/icons/server';
import Tool from 'lucide-react/dist/esm/icons/pen-tool';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { skills, timelineEvents, projects } from './data';

import TimelineItem from './components/TimelineItem';
import ProfileImage from './components/ProfileImage';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Grass from './components/Grass';
import { Terrain } from './components/Terrain';
import { DirectionalLight } from './components/DirectionalLight';
import { Leva } from 'leva';


function App() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsNavVisible(currentScrollY <= lastScrollY.current || currentScrollY <= 0);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => new Set(prev).add(projectId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await emailjs.sendForm(
        'MyPortfolio',
        'template_fczkhe9',
        formRef.current,
        't_tULzA6vcI3QWaRR'
      );

      if (result.text === 'OK') {
        setSubmitStatus('success');
        formRef.current.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh min-h-[100dvh] bg-[#030303] text-gray-100 relative overflow-hidden">
      <nav className={`fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md z-50 border-b border-white/10 transition-all duration-300 pt-[env(safe-area-inset-top)] ${isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.span
                className="text-xl font-bold tracking-tight text-white"
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                Portfolio
              </motion.span>
            </div>
            <div className="flex items-center space-x-8">
              {['Profile', 'Projects', 'Contact'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(
                    item === 'Profile' ? profileRef :
                      item === 'Projects' ? projectsRef :
                        contactRef
                  )}
                  className="relative text-gray-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-px bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 軽量化のためのCSSバックグラウンド */}
      <div className="fixed -z-10 bg-[#050505] top-[calc(-1*env(safe-area-inset-top))] bottom-[calc(-1*env(safe-area-inset-bottom))] left-[calc(-1*env(safe-area-inset-left))] right-[calc(-1*env(safe-area-inset-right))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_120%)]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        {/* Top/Bottom glowing lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-40" />
      </div>

      <Leva hidden={true} />
      <div className="fixed -z-5 pointer-events-none opacity-60 top-[calc(-1*env(safe-area-inset-top))] bottom-[calc(-1*env(safe-area-inset-bottom))] left-[calc(-1*env(safe-area-inset-left))] right-[calc(-1*env(safe-area-inset-right))]">
        <Canvas camera={{ position: [0, 2, 8], fov: 60 }} dpr={[1, 1]} gl={{ powerPreference: "high-performance", antialias: false }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <DirectionalLight />
            <Grass patchSize={30} />
            <Terrain patchSize={30} />
          </Suspense>
        </Canvas>
      </div>

      <main ref={mainRef} className="relative pt-24 pb-[env(safe-area-inset-bottom)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-[90vh] flex flex-col items-center justify-center relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8"
          >
            <ProfileImage className="mb-8" />
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-white"
              whileHover={{ scale: 1.02 }}
            >
              Rio Sato
            </motion.h1>
            <motion.p
              className="text-2xl text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Student Engineer | Web & IoT | M1 at Nihon Univ Graduate School.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-10 w-full flex justify-center"
          >
            <motion.button
              onClick={() => scrollToSection(profileRef)}
              className="text-gray-400 flex flex-col items-center"
              whileHover={{ y: -5 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="mb-2">Scroll to explore</span>
              <ChevronDown size={24} />
            </motion.button>
          </motion.div>
        </motion.div>

        <section ref={profileRef} className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: <Code className="w-5 h-5 text-gray-400" />, title: 'Language', category: 'language' },
                { icon: <Server className="w-5 h-5 text-gray-400" />, title: 'Framework', category: 'framework' },
                { icon: <Tool className="w-5 h-5 text-gray-400" />, title: 'Tool', category: 'tool' }
              ].map((section, index) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-[#0a0a0a] rounded-xl p-8 border border-white/5 hover:border-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center mb-6 text-gray-200">
                    {section.icon}
                    <h3 className="text-lg font-medium ml-3 uppercase tracking-wider">{section.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => skill.category === section.category)
                      .map(skill => (
                        <motion.span
                          key={skill.name}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-gray-300 transition-colors border border-white/5"
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-light mb-16 text-center text-white tracking-widest uppercase">
                Timeline
              </h2>
              <div className="relative space-y-12">
                <div
                  className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-white/20"
                  aria-hidden
                />
                {timelineEvents.map((event, index) => (
                  <TimelineItem
                    key={index}
                    year={event.year}
                    title={event.title}
                    description={event.description}
                    image={event.image}
                    links={event.links}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section ref={projectsRef} className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-light mb-16 text-center text-white tracking-widest uppercase"
            >
              Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-[#0a0a0a] rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/5 hover:border-white/20">
                      <div className="aspect-video relative overflow-hidden">
                        {!imageErrors.has(project.id) ? (
                          <img
                            key={project.image}
                            src={project.image}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={() => {
                              console.warn(`Failed to load project image: ${project.image}`);
                              handleImageError(project.id);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <div className="text-4xl mb-2">📁</div>
                              <div className="text-sm">{project.title}</div>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <span className="text-white font-medium">
                            {project.description}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-sm bg-gray-800 rounded-md text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={contactRef} className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-light mb-16 text-center text-white tracking-widest uppercase"
            >
              Contact
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0a0a0a] rounded-xl p-8 border border-white/5"
              >
                <h3 className="text-xl font-light mb-8 text-white uppercase tracking-wider">Connect</h3>
                <div className="space-y-4">
                  {[
                    { name: 'GitHub', href: 'https://github.com/Rintaras' },
                    { name: 'Twitter', href: 'https://twitter.com/Rintaras' }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="flex items-center text-gray-400 hover:text-white transition-colors py-2"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0a0a0a] rounded-xl p-8 border border-white/5"
              >
                <h3 className="text-xl font-light mb-8 text-white uppercase tracking-wider">Send a Message</h3>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-2 text-gray-400 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="user_name"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-lg focus:ring-1 focus:ring-white focus:border-white transition-all duration-300 text-gray-100 disabled:opacity-50 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-2 text-gray-400 uppercase tracking-wider">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="user_email"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-lg focus:ring-1 focus:ring-white focus:border-white transition-all duration-300 text-gray-100 disabled:opacity-50 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-medium mb-2 text-gray-400 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-lg focus:ring-1 focus:ring-white focus:border-white transition-all duration-300 text-gray-100 disabled:opacity-50 outline-none resize-none"
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full px-4 py-4 bg-white text-black font-medium tracking-wide uppercase text-sm rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? '送信中...' : '送信する'}
                  </motion.button>

                  {submitStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-emerald-400 text-center"
                    >
                      メッセージを送信しました。
                    </motion.p>
                  )}

                  {submitStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-center"
                    >
                      エラーが発生しました。もう一度お試しください。
                    </motion.p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
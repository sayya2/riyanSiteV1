import React from 'react';
import Link from 'next/link';
import { AboutSection as AboutContent } from '@/data/Data';

const galleryImages = [
  'http://beta.riyan.com.mv/wp-content/uploads/2022/06/hd-1800x900-1.png',
  'http://beta.riyan.com.mv/wp-content/uploads/2025/07/MEdhfushi-Masterplan.jpg',
  'http://beta.riyan.com.mv/wp-content/uploads/2025/07/Ooredoo.jpg',
  'http://beta.riyan.com.mv/wp-content/uploads/2025/07/Infra-WTE.jpg',
  'http://beta.riyan.com.mv/wp-content/uploads/2025/07/Planning-Fulidhoo.jpg',
  'http://beta.riyan.com.mv/wp-content/uploads/2025/07/EN_Maldives_Guidance_for_Resilient_Housing_131124_Digital.jpg',
];

const AboutSection = () => {
  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <h6 className='text-sm uppercase tracking-wider text-primary font-semibold mb-4'>
              About Riyan
            </h6>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
              {AboutContent.title}
            </h2>
            <p className='text-lg text-gray-600 leading-relaxed mb-6'>
              {AboutContent.paragraphs[0] || "Riyan provides comprehensive professional services tailored to meet the unique needs of our clients. With years of experience and a commitment to excellence, we deliver results that exceed expectations."}
            </p>
            <Link
              href='/firm'
              className='inline-block text-primary hover:text-primary/80 font-medium'
            >
              Learn More
            </Link>
          </div>

          <div className='relative h-96 overflow-hidden rounded-lg'>
            <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none' />
            <div className='absolute inset-0 flex flex-col gap-4 animate-vertical-scroll'>
              {[...galleryImages, ...galleryImages].map((src, idx) => (
                <div
                  key={${src}-}
                  className='relative w-full flex-1 min-h-[30%] overflow-hidden rounded-lg'
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt='Riyan project'
                    className='w-full h-full object-cover'
                    loading={idx > 2 ? 'lazy' : 'eager'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


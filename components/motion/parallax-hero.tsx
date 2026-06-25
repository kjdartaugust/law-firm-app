'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Full-bleed hero: an editorial photo with a charcoal overlay that drifts
 * (parallax) as the page scrolls, with content layered on top.
 */
export function ParallaxHero({ image, children }: { image: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref} className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-charcoal-950">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={image}
          alt="Lexara Legal offices"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-charcoal-950" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-charcoal-950/60" />
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full items-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

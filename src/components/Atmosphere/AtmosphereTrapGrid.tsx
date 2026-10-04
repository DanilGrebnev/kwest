import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { features } from '../../data/features';
import styles from './AtmosphereTrapGrid.module.scss';

const MD_MIN_WIDTH = 768;

type Edge = 'left' | 'right';

function useMobileGrid() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${MD_MIN_WIDTH - 1}px)`).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MD_MIN_WIDTH - 1}px)`);
    const update = () => setIsMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function getTravelPx(isMobile: boolean) {
  if (typeof window === 'undefined') {
    return isMobile ? 140 : 320;
  }

  const w = window.innerWidth;
  if (isMobile) {
    return Math.round(Math.min(w * 0.4, 168));
  }

  return Math.round(w * 0.55);
}

/** Край сайта: колонка сетки → слева или справа. */
function getEdge(index: number, isMobile: boolean): Edge {
  if (isMobile) {
    return index % 2 === 1 ? 'right' : 'left';
  }

  const col = index % 3;
  if (col === 0) return 'left';
  if (col === 2) return 'right';

  const row = Math.floor(index / 3);
  return row % 2 === 0 ? 'left' : 'right';
}

function getOffset(edge: Edge, travelPx: number, visible: boolean) {
  if (visible) return { x: 0, y: 0, opacity: 1 };
  const x = edge === 'right' ? travelPx : -travelPx;
  return { x, y: 0, opacity: 0 };
}

export default function AtmosphereTrapGrid() {
  const reduceMotion = useReducedMotion();
  const isMobile = useMobileGrid();
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.08, margin: '0px 0px 12% 0px' });
  const travelPx = useMemo(() => getTravelPx(isMobile), [isMobile]);

  const show = reduceMotion || inView;

  return (
    <ul
      ref={listRef}
      className={styles.grid}
      aria-label="Особенности атмосферы"
    >
      {features.map((feature, index) => {
        const edge = getEdge(index, isMobile);
        const target = getOffset(edge, travelPx, show);

        return (
          <motion.li
            key={feature.title}
            className={styles.cell}
            initial={reduceMotion ? { opacity: 1, x: 0, y: 0 } : getOffset(edge, travelPx, false)}
            animate={target}
            transition={{
              duration: reduceMotion ? 0 : 1.15,
              delay: reduceMotion ? 0 : index * 0.14,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <span className={styles.cellLabel}>{feature.title}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}

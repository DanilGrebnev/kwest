import { motion, useReducedMotion } from 'motion/react';
import { features } from '../../data/features';
import styles from './AtmosphereTrapGrid.module.scss';

function getInitialOffset(index: number) {
  const col = index % 3;
  if (col === 0) return { x: -36, y: 0 };
  if (col === 1) return { x: 0, y: 20 };
  return { x: 36, y: 0 };
}

export default function AtmosphereTrapGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={styles.grid} aria-label="Особенности атмосферы">
      {features.map((feature, index) => {
        const initialOffset = getInitialOffset(index);

        return (
          <motion.li
            key={feature.title}
            className={styles.cell}
            initial={
              reduceMotion
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, ...initialOffset }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35, margin: '0px 0px -5% 0px' }}
            transition={{
              duration: 1.15,
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

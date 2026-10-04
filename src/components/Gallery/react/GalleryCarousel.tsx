import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { gallery } from '../../../data/gallery';
import styles from './GalleryCarousel.module.scss';

const autoScrollPlugins = [
  AutoScroll({
    speed: 1,
    startDelay: 0,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  }),
];

export default function GalleryCarousel() {
  const reduceMotion = useReducedMotion() === true;

  // Стабильная ссылка: иначе смена null→false у useReducedMotion пересоздаёт плагин и сбрасывает ленту.
  const plugins = useMemo(
    () => (reduceMotion ? [] : autoScrollPlugins),
    [reduceMotion],
  );

  const options = useMemo(
    () => ({
      loop: true,
      align: 'start' as const,
      dragFree: true,
      containScroll: false as const,
      // На мобиле scroll дергает visualViewport → Embla reInit → прыжок к 1 кадру.
      watchResize: false,
      watchSlides: false,
    }),
    [],
  );

  const [emblaRef] = useEmblaCarousel(options, plugins);

  if (reduceMotion) {
    return (
      <ul className={styles.staticGrid} aria-label="Галерея кадров">
        {gallery.map((item) => (
          <li key={item.src} className={styles.slide}>
            <img
              className={styles.image}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.viewport} ref={emblaRef}>
      <ul className={styles.track} aria-label="Галерея кадров">
        {gallery.map((item) => (
          <li key={item.src} className={styles.slide}>
            <img
              className={styles.image}
              src={item.src}
              alt={item.alt}
              loading="eager"
              decoding="async"
              width={800}
              height={1000}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

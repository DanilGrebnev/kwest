export const site = {
  name: 'И гаснет свет',
  title: 'И гаснет свет — хоррор-квест с актёрами',
  description:
    'Хоррор-квест «И гаснет свет»: 60 минут в темноте, актёры, зеркала и то, что не должно отражаться. 2–6 игроков, 18+. Забронируйте игру.',
  url: 'https://example.com',
  ogImage: '/poster-1.png',
  locale: 'ru_RU',
  year: new Date().getFullYear(),
};

export const booking = {
  href: '/booking',
  label: 'Забронировать игру',
  secondaryLabel: 'Узнать свободные даты',
  finalLabel: 'Войти в темноту',
  chooseTimeLabel: 'Выбрать время',
};

export const contacts = {
  phone: '+7 (900) 000-00-00',
  phoneHref: 'tel:+79000000000',
  email: 'book@lightsout.quest',
  emailHref: 'mailto:book@lightsout.quest',
  address: 'Адрес уточняется при бронировании',
};

export const hero = {
  slogan: 'Свет погас. Зеркало лжёт. Узнай, кто стоит за твоим плечом.',
  lead: 'Перформанс-квест, где темнота — не декорация, а правило. Вы входите в чужой дом. Выходите — другими.',
  videoSrc: '/diana.mp4',
  posterSrc: '/poster-1.png',
};

export const stats = [
  { label: '18+', description: 'Только взрослые' },
  { label: '2–6', description: 'Игроков' },
  { label: '60 мин', description: 'В полной темноте' },
  { label: 'Horror', description: 'Высокий уровень страха' },
] as const;

export const about = {
  title: 'О квесте',
  eyebrow: 'Сюжет',
  paragraphs: [
    'В доме давно не горит свет. Хозяева исчезли — или так кажется, пока вы смотрите в зеркало. Каждое отражение чуть запаздывает. Каждый звук приходит не оттуда, откуда вы ждёте.',
    '«И гаснет свет» — это не классический побег из комнаты. Здесь нет подсказок на стенах и «очевидных» замков. Есть актёры, живой звук, управляемый свет — и ощущение, что вы уже не одни.',
    'За шестьдесят минут вы узнаете, что темнота умеет выбирать, кого оставить наедине с собой.',
  ],
};

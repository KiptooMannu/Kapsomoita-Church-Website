/**
 * Placeholder content for sections whose admin module has not been built yet.
 *
 * Everything here is destined to come from the API — announcements, events,
 * sermons, testimonials and the pastor's message each have a planned CMS module.
 * Until those land, the homepage renders from this file so the sections are real
 * and reviewable rather than empty.
 *
 * **This is sample copy.** Replace it with the church's own before launch, or wait
 * for the corresponding admin module and delete the entry from here.
 */

export interface Announcement {
  id: string
  title: string
  body: string
  date: string
  tone: 'info' | 'success' | 'warning'
  /** Optional call to action. */
  link?: { label: string; to: string }
}

export interface ChurchEvent {
  id: string
  title: string
  description: string
  /** ISO 8601. Drives the countdown, so it must be a real future date. */
  startsAt: string
  venue: string
  /** Null when attendance is open and uncounted. */
  capacity: number | null
  registered: number
  /** Path under the repo, resolved through the media manifest. */
  imageLocalPath: string
}

export interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  series: string
  topic: string
  bibleReference: string
  durationMinutes: number
  /** YouTube watch URL, or empty until the media module is wired. */
  videoUrl: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
}

export interface Ministry {
  name: string
  slug: string
  description: string
  /** Present only for ministries that already have a page. */
  to?: string
  imageLocalPath?: string
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Sunday School resumes',
    body: 'Children’s classes run during the second service. Please register your child at the welcome desk.',
    date: 'Every Sunday',
    tone: 'info',
  },
  {
    id: 'a2',
    title: 'Baptism service',
    body: 'Our next baptism service is being planned. Speak to a pastor if you would like to take this step.',
    date: 'Date to be confirmed',
    tone: 'success',
    link: { label: 'Talk to us', to: '/contact' },
  },
  {
    id: 'a3',
    title: 'Building fund update',
    body: 'Thank you for your continued generosity toward the sanctuary project. Progress updates are shared monthly.',
    date: 'Ongoing',
    tone: 'warning',
    link: { label: 'Give toward it', to: '/give' },
  },
]

// ---------------------------------------------------------------------------
// Events
//
// Dates are set relative to a fixed reference so the countdown demonstrates
// correctly. Replace with real dates — a countdown to a made-up date is worse
// than no countdown once the church starts using this.
// ---------------------------------------------------------------------------

export const upcomingEvents: ChurchEvent[] = [
  {
    id: 'e1',
    title: 'Youth Camp',
    description:
      'Three days of worship, teaching and games for teenagers and young adults. Transport provided from the church.',
    startsAt: '2026-08-14T08:00:00+03:00',
    venue: 'Church Grounds',
    capacity: 120,
    registered: 78,
    imageLocalPath: 'src/assets/events/youth-camp.jpg',
  },
  {
    id: 'e2',
    title: 'Women’s Retreat',
    description:
      'A weekend set apart for rest, prayer and fellowship among the women of the church.',
    startsAt: '2026-09-05T07:30:00+03:00',
    venue: 'Fellowship Hall',
    capacity: 80,
    registered: 41,
    imageLocalPath: 'src/assets/events/women-retreat.jpg',
  },
  {
    id: 'e3',
    title: 'Annual Conference',
    description:
      'Our yearly gathering with invited speakers, worship nights and seminars for the whole church.',
    startsAt: '2026-10-17T09:00:00+03:00',
    venue: 'Main Sanctuary',
    capacity: 400,
    registered: 156,
    imageLocalPath: 'src/assets/events/conference.jpg',
  },
]

// ---------------------------------------------------------------------------
// Sermons
// ---------------------------------------------------------------------------

export const latestSermons: Sermon[] = [
  {
    id: 's1',
    title: 'The Good Shepherd',
    speaker: 'Senior Pastor',
    date: '2026-07-19',
    series: 'Knowing Jesus',
    topic: 'Assurance',
    bibleReference: 'John 10:1–18',
    durationMinutes: 42,
    videoUrl: '',
  },
  {
    id: 's2',
    title: 'Faith That Works',
    speaker: 'Associate Pastor',
    date: '2026-07-12',
    series: 'Letters of James',
    topic: 'Obedience',
    bibleReference: 'James 2:14–26',
    durationMinutes: 38,
    videoUrl: '',
  },
  {
    id: 's3',
    title: 'A Heart of Worship',
    speaker: 'Guest Speaker',
    date: '2026-07-05',
    series: 'Psalms for the Journey',
    topic: 'Worship',
    bibleReference: 'Psalm 95:1–7',
    durationMinutes: 45,
    videoUrl: '',
  },
]

// ---------------------------------------------------------------------------
// Pastor's message
// ---------------------------------------------------------------------------

export const pastorsMessage = {
  name: 'Senior Pastor',
  role: `Senior Pastor, Kapsomoita AGC`,
  greeting: 'A word from our Pastor',
  body: [
    'Whether you have walked with Christ for decades or are only beginning to wonder who He is, there is a place for you at Kapsomoita AGC. We are an ordinary family of believers learning together what it means to follow Jesus faithfully.',
    'Come and sit with us on a Sunday. Bring your questions, your doubts and your burdens. You will find people who will pray with you, and a God who is far kinder than you expect.',
  ],
  /** Replace with a real photograph once the leadership module lands. */
  imageLocalPath: 'src/assets/leaders/youth-leader1.jpg',
} as const

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I came for one Sunday and stayed. The people here walked with my family through the hardest year of our lives.',
    name: 'Church member',
    role: 'Member since 2019',
  },
  {
    id: 't2',
    quote:
      'The youth ministry gave my son a place to belong and friends who point him toward Christ.',
    name: 'Parent',
    role: 'Youth ministry parent',
  },
  {
    id: 't3',
    quote:
      'I learned to pray here. Not the polished kind — the honest kind, in a room full of people doing the same.',
    name: 'Church member',
    role: 'Prayer team',
  },
]

// ---------------------------------------------------------------------------
// Ministries
//
// The four with a `to` have existing pages. The rest are listed because they are
// part of the church's life and the specification names them, but they have no
// page yet, so they are rendered without a link rather than pointing nowhere.
// ---------------------------------------------------------------------------

export const ministries: Ministry[] = [
  {
    name: 'Youth Ministry',
    slug: 'youth',
    description: 'Teenagers and young adults growing in faith together.',
    to: '/ministries/youth',
    imageLocalPath: 'src/assets/youth-ministry.jpg',
  },
  {
    name: "Women's Ministry",
    slug: 'women',
    description: 'Bible study, prayer and fellowship for the women of the church.',
    to: '/ministries/women',
    imageLocalPath: 'src/assets/women-ministry.jpg',
  },
  {
    name: "Men's Ministry",
    slug: 'men',
    description: 'Discipleship, accountability and service for men.',
    to: '/ministries/men',
    imageLocalPath: 'src/assets/men-ministry.jpg',
  },
  {
    name: 'Kids Ministry',
    slug: 'kids',
    description: 'A safe, joyful place for children to meet Jesus.',
    to: '/ministries/kids',
    imageLocalPath: 'src/assets/kids-ministry.jpg',
  },
  { name: 'Choir', slug: 'choir', description: 'Leading the congregation in sung worship.' },
  { name: 'Praise Team', slug: 'praise', description: 'Musicians and singers serving each Sunday.' },
  { name: 'Sunday School', slug: 'sunday-school', description: 'Teaching the Bible to every age group.' },
  { name: 'Media', slug: 'media', description: 'Sound, streaming and photography for the church.' },
  { name: 'Prayer', slug: 'prayer', description: 'Intercession for the church and community.' },
  { name: 'Evangelism', slug: 'evangelism', description: 'Sharing the Gospel beyond our walls.' },
  { name: 'Missions', slug: 'missions', description: 'Supporting the work of the Gospel further afield.' },
]

// ---------------------------------------------------------------------------
// Bible verse of the day
//
// A fixed list rotated by day-of-year. Deterministic, so every visitor sees the
// same verse on the same day, and it needs no API and cannot fail.
// ---------------------------------------------------------------------------

export const dailyVerses: ReadonlyArray<{ text: string; reference: string }> = [
  {
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    reference: 'Proverbs 3:5–6',
  },
  {
    text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    reference: 'Psalm 23:1–3',
  },
  {
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    reference: 'Matthew 11:28',
  },
  {
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    reference: 'Jeremiah 29:11',
  },
  {
    text: 'I can do all this through him who gives me strength.',
    reference: 'Philippians 4:13',
  },
  {
    text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    reference: 'Joshua 1:9',
  },
  {
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    reference: 'Romans 8:28',
  },
  {
    text: 'Your word is a lamp for my feet, a light on my path.',
    reference: 'Psalm 119:105',
  },
  {
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary.',
    reference: 'Isaiah 40:31',
  },
  {
    text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    reference: 'Galatians 6:9',
  },
  {
    text: 'The Lord is gracious and compassionate, slow to anger and rich in love.',
    reference: 'Psalm 145:8',
  },
  {
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    reference: 'John 3:16',
  },
  {
    text: 'Cast all your anxiety on him because he cares for you.',
    reference: '1 Peter 5:7',
  },
  {
    text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    reference: '1 Corinthians 13:4',
  },
]

/**
 * The verse for a given date.
 *
 * Indexed by day-of-year so it advances once per day and is identical for every
 * visitor — a random pick would change on each render and re-mount.
 */
export function verseOfTheDay(date: Date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000)
  const index = dayOfYear % dailyVerses.length
  // Non-null: the modulo above is always within bounds for a non-empty list.
  return dailyVerses[index]!
}

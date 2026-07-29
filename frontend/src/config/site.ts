/**
 * Single source of truth for the church's public details.
 *
 * Every section reads from here, so correcting a phone number or a service time is
 * a one-line change rather than a search across a dozen components.
 *
 * These values are the placeholders carried over from the original site. They are
 * marked below where they are obviously sample data and need replacing with the
 * real details before launch. Once the Church Settings admin module lands, this
 * file becomes the fallback used while that data loads.
 */

export interface ServiceTime {
  name: string
  day: string
  time: string
  location: string
  /** Who normally leads. Empty string when it rotates. */
  leader: string
  description: string
}

export interface NavChild {
  label: string
  to: string
  description?: string
}

export interface NavItem {
  label: string
  to?: string
  /** Present for a dropdown / mega-menu entry. */
  children?: NavChild[]
}

export const site = {
  name: 'Kapsomoita AGC',
  fullName: 'Kapsomoita Africa Gospel Church',
  shortName: 'Kapsomoita Church',
  tagline: 'A welcoming family of faith',

  /**
   * Church-level vision and mission.
   *
   * NOTE: the original footer showed the Men's Ministry vision ("raise godly men
   * who lead with integrity") as the whole church's vision. That copy now lives
   * on the Men's Ministry page where it belongs; these are church-wide.
   * Please confirm this wording with your leadership.
   */
  vision:
    'To be a Christ-centred church that transforms lives and communities through the power of the Gospel.',
  mission:
    'To make disciples of Jesus Christ by evangelising the lost, establishing believers, edifying the church, equipping the saints for service, and showing compassion to those in need.',

  contact: {
    addressLines: ['Kapsomoita, Nairobi', 'P.O. Box 12345-00100'],
    phone: '+254 712 345 678',
    /** Digits only, for tel: links. */
    phoneHref: '+254712345678',
    email: 'info@kapsomoitaagc.org',
  },

  /**
   * Map location.
   *
   * TODO: replace with the church's actual coordinates. These point at Nairobi
   * city centre, so the map renders rather than showing an error, but they are
   * not the church's real position.
   */
  location: {
    latitude: -1.2921,
    longitude: 36.8219,
    /** Used for the "Open in Google Maps" and directions links. */
    searchQuery: 'Kapsomoita Africa Gospel Church, Nairobi, Kenya',
    parkingNote: 'Free parking is available on the church compound.',
    landmarkNote: 'We are a short walk from the main stage, opposite the shopping centre.',
  },

  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },

  /** Giving details. Verify these against the church's actual accounts. */
  giving: {
    mpesa: {
      paybill: '123456',
      accountName: 'Kapsomoita AGC',
    },
    bank: {
      name: 'KCB',
      accountNumber: '0123456789',
      branch: 'Nairobi West',
    },
  },
} as const

/**
 * Weekly gatherings, in the order they appear on the homepage.
 *
 * Times come from the original footer (Sunday, Tuesday, Friday). The fellowship
 * entries below carry their day and time from those same slots; confirm the
 * specifics with the church office.
 */
export const serviceTimes: ServiceTime[] = [
  {
    name: 'Sunday Worship',
    day: 'Sunday',
    time: '8:00 AM – 12:00 PM',
    location: 'Main Sanctuary',
    leader: 'Senior Pastor',
    description: 'Our main gathering — worship, the Word, and fellowship for the whole family.',
  },
  {
    name: 'Midweek Prayer',
    day: 'Tuesday',
    time: '5:30 PM – 7:00 PM',
    location: 'Main Sanctuary',
    leader: 'Prayer Team',
    description: 'A focused hour of intercession for the church, the nation and one another.',
  },
  {
    name: 'Youth Service',
    day: 'Friday',
    time: '5:30 PM – 8:00 PM',
    location: 'Youth Hall',
    leader: 'Youth Pastor',
    description: 'Worship, teaching and community for teenagers and young adults.',
  },
  {
    name: "Women's Fellowship",
    day: 'Wednesday',
    time: '10:00 AM – 12:00 PM',
    location: 'Fellowship Hall',
    leader: "Women's Ministry Leader",
    description: 'Bible study, prayer and mutual encouragement for the women of the church.',
  },
  {
    name: "Men's Fellowship",
    day: 'Saturday',
    time: '7:00 AM – 9:00 AM',
    location: 'Fellowship Hall',
    leader: "Men's Ministry Leader",
    description: 'Teaching, accountability and service for the men of the church.',
  },
]

/** Primary navigation, including the mega-menu groupings. */
export const navigation: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Ministries',
    children: [
      {
        label: 'Youth Ministry',
        to: '/ministries/youth',
        description: 'Teenagers and young adults growing in faith together.',
      },
      {
        label: "Women's Ministry",
        to: '/ministries/women',
        description: 'Bible study, prayer and fellowship for women.',
      },
      {
        label: "Men's Ministry",
        to: '/ministries/men',
        description: 'Discipleship and accountability for men.',
      },
      {
        label: 'Kids Ministry',
        to: '/ministries/kids',
        description: 'A safe, joyful place for children to meet Jesus.',
      },
    ],
  },
  {
    label: 'Our Strategy',
    children: [
      {
        label: 'Evangelizing',
        to: '/strategies/evangelizing',
        description: 'Sharing the Gospel with those who have not heard.',
      },
      {
        label: 'Establishing',
        to: '/strategies/establishing',
        description: 'Grounding new believers in the faith.',
      },
      {
        label: 'Edifying',
        to: '/strategies/edifying',
        description: 'Building up the body of Christ together.',
      },
      {
        label: 'Equipping',
        to: '/strategies/equipping',
        description: 'Preparing every member for works of service.',
      },
      {
        label: 'Compassion',
        to: '/strategies/compassion',
        description: 'Caring practically for those in need.',
      },
    ],
  },
  { label: 'Sermons', to: '/sermons' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

/** Footer link groups. */
export const footerLinks = {
  main: [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Sermons', to: '/sermons' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Give', to: '/give' },
    { label: 'Contact', to: '/contact' },
  ],
  ministries: [
    { label: 'Youth Ministry', to: '/ministries/youth' },
    { label: "Women's Ministry", to: '/ministries/women' },
    { label: "Men's Ministry", to: '/ministries/men' },
    { label: 'Kids Ministry', to: '/ministries/kids' },
  ],
  strategies: [
    { label: 'Evangelizing', to: '/strategies/evangelizing' },
    { label: 'Establishing', to: '/strategies/establishing' },
    { label: 'Edifying', to: '/strategies/edifying' },
    { label: 'Equipping', to: '/strategies/equipping' },
    { label: 'Compassion', to: '/strategies/compassion' },
  ],
} as const

/**
 * Every ministry in the church, with the content its page needs.
 *
 * One record per ministry drives one generic page component, so all eleven get a
 * complete page from a single implementation — rather than four hand-written pages
 * and seven ministries with nowhere to go.
 *
 * `galleryCategory` ties a ministry to the gallery categories used at upload, so a
 * photo filed under "Youth" appears on the Youth ministry page automatically.
 */

export interface MinistryMeeting {
  day: string
  time: string
  location: string
}

export interface MinistryDetail {
  /** URL segment: /ministries/{slug}. */
  slug: string
  name: string
  /** One-line summary, used on cards and in metadata. */
  tagline: string
  /** Two or three paragraphs of introduction. */
  description: string[]
  /** Who leads it. Names come from config/leadership.ts once confirmed. */
  leaderRole: string
  /** Who the ministry is for. */
  audience: string
  meetings: MinistryMeeting[]
  /** What the ministry actually does, week to week. */
  activities: string[]
  /** A verse that anchors the ministry's purpose. */
  verse?: { text: string; reference: string }
  /** Gallery category slug whose photos belong to this ministry. */
  galleryCategory?: string
  /** Hero image, resolved through the media manifest. */
  imageLocalPath?: string
  /** Set false for a ministry that is not currently recruiting. */
  acceptingApplications: boolean
}

export const ministryDetails: MinistryDetail[] = [
  // -----------------------------------------------------------------------
  {
    slug: 'youth',
    name: 'Youth Ministry',
    tagline: 'Teenagers and young adults growing in faith together.',
    description: [
      'Our Youth Ministry exists to help young people meet Jesus and follow Him seriously in a world that often pulls the other way. We gather weekly for worship, honest teaching from the Bible, and the kind of friendship that lasts.',
      'We take questions seriously. Nobody here is expected to have it all worked out, and doubt is not treated as failure. If you are a teenager or young adult in Kapsomoita, you are welcome exactly as you are.',
    ],
    leaderRole: 'Youth Ministry Leader',
    audience: 'Ages 13–30',
    meetings: [
      { day: 'Friday', time: '5:30 PM – 8:00 PM', location: 'Youth Hall' },
      { day: 'Sunday', time: 'After second service', location: 'Youth Hall' },
    ],
    activities: [
      'Weekly worship and Bible teaching',
      'Small groups for accountability',
      'Annual youth camp',
      'Sports and social events',
      'Mentoring by older members',
      'Community outreach projects',
    ],
    verse: {
      text: 'Don’t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.',
      reference: '1 Timothy 4:12',
    },
    galleryCategory: 'youth',
    imageLocalPath: 'src/assets/youth-ministry.jpg',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'women',
    name: "Women's Ministry",
    tagline: 'Bible study, prayer and genuine fellowship for women.',
    description: [
      'The Women’s Ministry is a place for women of every age and season to study Scripture together, pray for one another, and build friendships that hold up under real life.',
      'Whether you are newly married, raising children, working, widowed or single, you will find women here who understand and who will walk with you.',
    ],
    leaderRole: "Women's Ministry Leader",
    audience: 'Women of all ages',
    meetings: [{ day: 'Wednesday', time: '10:00 AM – 12:00 PM', location: 'Fellowship Hall' }],
    activities: [
      'Weekly Bible study',
      'Prayer and intercession',
      'Annual women’s retreat',
      'Mentoring younger women',
      'Hospital and home visitation',
      'Practical support for families in need',
    ],
    verse: {
      text: 'She is clothed with strength and dignity; she can laugh at the days to come.',
      reference: 'Proverbs 31:25',
    },
    galleryCategory: 'women',
    imageLocalPath: 'src/assets/women-ministry.jpg',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'men',
    name: "Men's Ministry",
    tagline: 'Raising godly men who lead with integrity.',
    description: [
      'Our Men’s Ministry exists to raise godly men who lead with integrity in their homes, their church and their community. We meet to study Scripture, to be honest with each other, and to serve.',
      'This is not a place for performance. It is a place where men can admit they are struggling and find brothers who will pray with them and hold them to what they say they believe.',
    ],
    leaderRole: "Men's Ministry Leader",
    audience: 'Men of all ages',
    meetings: [{ day: 'Saturday', time: '7:00 AM – 9:00 AM', location: 'Fellowship Hall' }],
    activities: [
      'Bible study and discussion',
      'Accountability groups',
      'Annual men’s retreat',
      'Practical projects around the church',
      'Fatherhood and marriage teaching',
      'Community service',
    ],
    verse: {
      text: 'Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.',
      reference: '1 Corinthians 16:13–14',
    },
    galleryCategory: 'men',
    imageLocalPath: 'src/assets/men-ministry.jpg',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'kids',
    name: 'Kids Ministry',
    tagline: 'A safe, joyful place for children to meet Jesus.',
    description: [
      'Kids Ministry is where the youngest members of our church family learn that God loves them, in ways they can actually understand. We teach the Bible through story, song, craft and play.',
      'Every volunteer who serves with children is known to us and screened. Parents can drop their children off on a Sunday with confidence and collect them at the end of the service.',
    ],
    leaderRole: 'Kids Ministry Leader',
    audience: 'Ages 3–12',
    meetings: [{ day: 'Sunday', time: 'During the second service', location: "Children's Hall" }],
    activities: [
      'Age-appropriate Bible teaching',
      'Worship through song',
      'Craft and creative activities',
      'Memory verse challenges',
      'Christmas and Easter presentations',
      'Holiday Bible club',
    ],
    verse: {
      text: 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.',
      reference: 'Matthew 19:14',
    },
    galleryCategory: 'children',
    imageLocalPath: 'src/assets/kids-ministry.jpg',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'sunday-school',
    name: 'Sunday School',
    tagline: 'Teaching the Bible clearly, to every age group.',
    description: [
      'Sunday School runs alongside our main services, with classes grouped by age so that everyone — from the youngest child to the oldest member — is taught at a level that makes sense to them.',
      'Our teachers work through Scripture systematically rather than jumping between favourite passages, so that over time every class gains a real grasp of the whole Bible story.',
    ],
    leaderRole: 'Sunday School Superintendent',
    audience: 'All ages, in graded classes',
    meetings: [{ day: 'Sunday', time: '8:00 AM – 9:15 AM', location: 'Classrooms' }],
    activities: [
      'Graded classes for every age group',
      'Systematic Bible teaching',
      'Teacher training and preparation',
      'Quarterly memory verse review',
      'Annual Sunday School Sunday',
      'Take-home material for families',
    ],
    verse: {
      text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
      reference: 'Proverbs 22:6',
    },
    galleryCategory: 'children',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'choir',
    name: 'Choir',
    tagline: 'Leading the congregation in sung worship.',
    description: [
      'The Choir leads our congregation in singing, week by week and at every special service. We sing hymns and contemporary songs in English and Kiswahili.',
      'You do not need formal training to join — you need a willing heart, a reasonable ear, and the commitment to turn up for rehearsal.',
    ],
    leaderRole: 'Choir Director',
    audience: 'Anyone who can hold a tune',
    meetings: [
      { day: 'Thursday', time: '5:30 PM – 7:00 PM', location: 'Main Sanctuary' },
      { day: 'Sunday', time: '7:00 AM (warm-up)', location: 'Main Sanctuary' },
    ],
    activities: [
      'Weekly rehearsal',
      'Leading Sunday worship',
      'Christmas and Easter cantatas',
      'Voice training',
      'Ministering at weddings and funerals',
    ],
    verse: {
      text: 'Sing to the Lord a new song; sing to the Lord, all the earth.',
      reference: 'Psalm 96:1',
    },
    galleryCategory: 'choir',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'praise-team',
    name: 'Praise Team',
    tagline: 'Musicians and singers serving every Sunday.',
    description: [
      'The Praise Team leads the congregation into worship with instruments and voices. We serve on a rotation so that no one carries the load alone.',
      'We are always glad to hear from musicians — keyboard, guitar, bass, drums — and from singers who want to serve rather than perform.',
    ],
    leaderRole: 'Worship Leader',
    audience: 'Musicians and vocalists',
    meetings: [
      { day: 'Wednesday', time: '5:30 PM – 7:00 PM', location: 'Main Sanctuary' },
      { day: 'Sunday', time: '7:00 AM (sound check)', location: 'Main Sanctuary' },
    ],
    activities: [
      'Weekly rehearsal and song selection',
      'Leading Sunday worship',
      'Youth and midweek services',
      'Mentoring new musicians',
      'Worship nights',
    ],
    verse: {
      text: 'Praise him with the sounding of the trumpet, praise him with the harp and lyre.',
      reference: 'Psalm 150:3',
    },
    galleryCategory: 'sunday-services',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'prayer',
    name: 'Prayer Ministry',
    tagline: 'Intercession for the church, the community and the nation.',
    description: [
      'The Prayer Ministry carries the church before God. We meet midweek to intercede for our congregation, our community and our nation, and we pray over every request that comes to us.',
      'If you have a burden to pray, this is where it belongs. No experience is needed — only a willingness to show up and ask God to act.',
    ],
    leaderRole: 'Prayer Coordinator',
    audience: 'Anyone with a heart to pray',
    meetings: [
      { day: 'Tuesday', time: '5:30 PM – 7:00 PM', location: 'Main Sanctuary' },
      { day: 'Saturday', time: '6:00 AM – 7:00 AM', location: 'Prayer Room' },
    ],
    activities: [
      'Midweek intercession',
      'Early morning prayer',
      'Praying over submitted requests',
      'Prayer chains during crises',
      'Fasting weeks',
      'Praying with people after services',
    ],
    verse: {
      text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
      reference: 'Philippians 4:6',
    },
    galleryCategory: 'prayer',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'evangelism',
    name: 'Evangelism',
    tagline: 'Sharing the Gospel beyond our walls.',
    description: [
      'Evangelism takes the good news about Jesus to people who have not heard it, or who have heard it and not understood. We go out into our own community, on foot, to talk with our neighbours.',
      'We will train you. Most people who join have never done this before and are nervous about it — that is normal, and it is not a barrier.',
    ],
    leaderRole: 'Evangelism Coordinator',
    audience: 'Adults and older youth',
    meetings: [{ day: 'Saturday', time: '9:00 AM – 12:00 PM', location: 'Meet at the church' }],
    activities: [
      'Door-to-door visitation',
      'Open-air meetings',
      'Follow-up with new believers',
      'Tract distribution',
      'Personal evangelism training',
      'Crusades and special missions',
    ],
    verse: {
      text: 'Therefore go and make disciples of all nations, baptising them in the name of the Father and of the Son and of the Holy Spirit.',
      reference: 'Matthew 28:19',
    },
    galleryCategory: 'evangelism',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'missions',
    name: 'Missions',
    tagline: 'Supporting the Gospel further afield.',
    description: [
      'Missions supports the work of the Gospel beyond Kapsomoita — through prayer, giving and sending. We partner with missionaries and with churches in areas where the Gospel is barely known.',
      'We also run short-term mission trips, so members can see the work first-hand and return with a clearer sense of what God is doing.',
    ],
    leaderRole: 'Missions Coordinator',
    audience: 'The whole church',
    meetings: [{ day: 'First Sunday monthly', time: 'After service', location: 'Fellowship Hall' }],
    activities: [
      'Supporting partner missionaries',
      'Short-term mission trips',
      'Missions prayer meetings',
      'Annual missions Sunday',
      'Raising and managing missions giving',
      'Hosting visiting missionaries',
    ],
    verse: {
      text: 'How, then, can they call on the one they have not believed in? And how can they believe in the one of whom they have not heard?',
      reference: 'Romans 10:14',
    },
    galleryCategory: 'missions',
    acceptingApplications: true,
  },
  // -----------------------------------------------------------------------
  {
    slug: 'media',
    name: 'Media Ministry',
    tagline: 'Sound, streaming and photography for the church.',
    description: [
      'The Media Ministry makes sure the congregation can hear the preaching, that those at home can watch, and that the life of the church is recorded well.',
      'We need people on sound, on camera, on projection and on photography. If you have technical skill — or the patience to learn it — there is a place for you here.',
    ],
    leaderRole: 'Media Team Leader',
    audience: 'Anyone with technical interest',
    meetings: [
      { day: 'Saturday', time: '4:00 PM – 5:30 PM', location: 'Media Room' },
      { day: 'Sunday', time: '7:00 AM (setup)', location: 'Main Sanctuary' },
    ],
    activities: [
      'Sound engineering for all services',
      'Live streaming',
      'Photography and videography',
      'Projection and lyrics',
      'Recording and editing sermons',
      'Maintaining equipment',
    ],
    verse: {
      text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.',
      reference: 'Colossians 3:23',
    },
    galleryCategory: 'sunday-services',
    acceptingApplications: true,
  },
]

/** Lookup by URL slug. */
export function findMinistry(slug: string | undefined): MinistryDetail | undefined {
  if (!slug) return undefined
  return ministryDetails.find((ministry) => ministry.slug === slug)
}

/** Options for the "Preferred Ministry" select on the join form. */
export const ministryOptions = ministryDetails
  .filter((ministry) => ministry.acceptingApplications)
  .map((ministry) => ({ value: ministry.slug, label: ministry.name }))

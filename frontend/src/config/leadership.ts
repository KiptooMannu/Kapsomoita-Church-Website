/**
 * Church leadership.
 *
 * **Names are deliberately left blank.** Publishing invented names and biographies
 * for a real church's pastors would be worse than publishing nothing, so each entry
 * carries only its role until you fill in the person. The UI falls back to showing
 * the role as the heading, which reads correctly either way.
 *
 * Fill in `name`, `bio` and `imageLocalPath` for each, or delete the entries you do
 * not want shown. This becomes the fallback once the Leadership admin module lands.
 */

export interface LeadershipMember {
  id: string
  /** Position held. Always present. */
  role: string
  /** Person's name. Empty until confirmed by the church. */
  name: string
  /** Short biography. Empty entries render without a description. */
  bio: string
  /** Repository path to a photograph, resolved through the media manifest. */
  imageLocalPath?: string
  /** Which ministry they lead, where applicable. */
  ministry?: string
  email?: string
}

/** Pastoral team — shown first on the landing page. */
export const pastoralTeam: LeadershipMember[] = [
  {
    id: 'senior-pastor',
    role: 'Senior Pastor',
    name: '',
    bio: 'Oversees the preaching, teaching and pastoral care of the whole congregation.',
  },
  {
    id: 'associate-pastor',
    role: 'Associate Pastor',
    name: '',
    bio: 'Supports the preaching ministry and leads discipleship across the church.',
  },
  {
    id: 'church-elder',
    role: 'Church Elder',
    name: '',
    bio: 'Shares in the spiritual oversight and governance of the church.',
  },
]

/**
 * Ministry leaders.
 *
 * The four photographs available in the repository are ministry-leader images, so
 * they are attached here rather than to the pastoral team, where they would
 * misrepresent who is who.
 */
export const ministryLeaders: LeadershipMember[] = [
  {
    id: 'youth-leader',
    role: 'Youth Ministry Leader',
    name: '',
    bio: 'Leads worship, teaching and discipleship for teenagers and young adults.',
    ministry: 'Youth Ministry',
    imageLocalPath: 'src/assets/leaders/youth-leader1.jpg',
  },
  {
    id: 'youth-coordinator',
    role: 'Youth Coordinator',
    name: '',
    bio: 'Coordinates youth events, camps and small groups.',
    ministry: 'Youth Ministry',
    imageLocalPath: 'src/assets/leaders/youth-leader2.jpg',
  },
  {
    id: 'women-leader',
    role: "Women's Ministry Leader",
    name: '',
    bio: 'Leads Bible study, prayer and fellowship among the women of the church.',
    ministry: "Women's Ministry",
    imageLocalPath: 'src/assets/leaders/women-leader1.jpg',
  },
  {
    id: 'women-coordinator',
    role: "Women's Ministry Coordinator",
    name: '',
    bio: 'Coordinates retreats, outreach and mentoring for women.',
    ministry: "Women's Ministry",
    imageLocalPath: 'src/assets/leaders/women-leader2.jpg',
  },
  {
    id: 'men-leader',
    role: "Men's Ministry Leader",
    name: '',
    bio: 'Leads teaching, accountability and service among the men of the church.',
    ministry: "Men's Ministry",
  },
  {
    id: 'kids-leader',
    role: 'Kids Ministry Leader',
    name: '',
    bio: 'Oversees Sunday School and children’s ministry across all age groups.',
    ministry: 'Kids Ministry',
  },
]

/** Everyone, for the About page's leadership section. */
export const allLeadership: LeadershipMember[] = [...pastoralTeam, ...ministryLeaders]

/** True once at least one leader has a confirmed name, so the UI can adapt. */
export const hasNamedLeaders = allLeadership.some((member) => member.name.trim().length > 0)

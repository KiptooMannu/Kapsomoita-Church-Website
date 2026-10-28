-- Photographs the public site displays, edited from Admin → Website photos.
-- Starting URLs are stand-ins. Replacing one in the admin overwrites image_url.

CREATE TABLE site_images (
    slot_key   VARCHAR(64)  PRIMARY KEY,
    label      VARCHAR(160) NOT NULL,
    group_name VARCHAR(64)  NOT NULL,
    image_url  VARCHAR(1024),
    alt_text   VARCHAR(300) NOT NULL DEFAULT '',
    sort_order INTEGER      NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT site_images_key_not_blank CHECK (length(btrim(slot_key)) > 0),
    CONSTRAINT site_images_label_not_blank CHECK (length(btrim(label)) > 0)
);

CREATE INDEX ix_site_images_group ON site_images (group_name, sort_order);

INSERT INTO site_images (slot_key, label, group_name, image_url, alt_text, sort_order) VALUES
('hero1', 'Hero photo 1', 'Homepage heroes', 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=2400&h=1350&q=80', '', 1),
('hero2', 'Hero photo 2', 'Homepage heroes', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2400&h=1350&q=80', '', 2),
('hero3', 'Hero photo 3', 'Homepage heroes', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2400&h=1350&q=80', '', 3),
('hero4', 'Hero photo 4', 'Homepage heroes', 'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=2400&h=1350&q=80', '', 4),
('hero5', 'Hero photo 5', 'Homepage heroes', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2400&h=1350&q=80', '', 5),
('aboutHeader', 'About page banner', 'Page banners', 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=2400&h=1000&q=80', '', 1),
('giveHeader', 'Give page banner', 'Page banners', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=2400&h=1000&q=80', '', 2),
('galleryHeader', 'Gallery page banner', 'Page banners', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2400&h=1000&q=80', '', 3),
('sermonsHeader', 'Sermons page banner', 'Page banners', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=2400&h=1000&q=80', '', 4),
('contactHeader', 'Contact page banner', 'Page banners', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2400&h=1000&q=80', '', 5),
('serveHeader', 'Serve page banner', 'Page banners', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=2400&h=1000&q=80', '', 6),
('ministriesHeader', 'Ministries page banner', 'Page banners', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2400&h=1000&q=80', '', 7),
('serviceSunday', 'Sunday service', 'Weekly services', 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&h=800&q=80', 'Sunday worship in the sanctuary', 1),
('servicePrayer', 'Prayer meeting', 'Weekly services', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&h=800&q=80', 'A midweek prayer gathering', 2),
('serviceYouth', 'Youth service', 'Weekly services', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&h=800&q=80', 'Young people at a youth service', 3),
('serviceWomen', 'Women''s fellowship', 'Weekly services', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&h=800&q=80', 'Women''s fellowship', 4),
('serviceMen', 'Men''s fellowship', 'Weekly services', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&h=800&q=80', 'Men''s fellowship', 5),
('serviceKids', 'Children''s ministry', 'Weekly services', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&h=800&q=80', 'Children''s ministry', 6),
('ministryYouth', 'Youth Ministry', 'Ministries', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=900&q=80', 'Young people gathered for youth ministry', 1),
('ministryWomen', 'Women''s Ministry', 'Ministries', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&h=900&q=80', 'Women meeting together for Bible study', 2),
('ministryMen', 'Men''s Ministry', 'Ministries', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&h=900&q=80', 'Men meeting together for fellowship', 3),
('ministryKids', 'Kids Ministry', 'Ministries', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&h=900&q=80', 'Children in a Sunday School class', 4),
('ministrySundaySchool', 'Sunday School', 'Ministries', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=900&q=80', 'A Sunday School class in progress', 5),
('ministryChoir', 'Choir', 'Ministries', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&h=900&q=80', 'The church choir singing', 6),
('ministryPraise', 'Praise team', 'Ministries', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&h=900&q=80', 'Musicians leading worship', 7),
('ministryPrayer', 'Prayer ministry', 'Ministries', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&h=900&q=80', 'People praying together', 8),
('ministryEvangelism', 'Evangelism', 'Ministries', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&h=900&q=80', 'Church members sharing the Gospel in the community', 9),
('ministryMissions', 'Missions', 'Ministries', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=900&q=80', 'Mission work in the field', 10),
('ministryMedia', 'Media ministry', 'Ministries', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&h=900&q=80', 'The media team operating sound and cameras', 11),
('sermonScene', 'Sermon artwork', 'Sermons', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1280&h=720&q=80', '', 1),
('aboutGathering', 'About — congregation', 'About', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&h=1000&q=80', 'The congregation gathered together', 1),
('aboutScripture', 'About — scripture', 'About', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&h=1000&q=80', 'An open Bible during a service', 2),
('strategyEvangelizing', 'Evangelizing', 'Strategies', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&h=1000&q=80', 'Sharing the Gospel in the community', 1),
('strategyEstablishing', 'Establishing', 'Strategies', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&h=1000&q=80', 'A congregation learning together', 2),
('strategyEdifying', 'Edifying', 'Strategies', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&h=1000&q=80', 'Worship that builds up the church', 3),
('strategyEquipping', 'Equipping', 'Strategies', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&h=1000&q=80', 'Musicians and teachers serving the church', 4),
('strategyCompassion', 'Compassion', 'Strategies', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&h=1000&q=80', 'Practical care for people in need', 5),
('gallery1', 'Gallery photo 1', 'Gallery', 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&h=900&q=80', 'Worship in the sanctuary', 1),
('gallery2', 'Gallery photo 2', 'Gallery', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&h=900&q=80', 'People gathered after a service', 2),
('gallery3', 'Gallery photo 3', 'Gallery', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&h=900&q=80', 'Sung worship', 3),
('gallery4', 'Gallery photo 4', 'Gallery', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&h=900&q=80', 'Children at church', 4),
('gallery5', 'Gallery photo 5', 'Gallery', 'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=900&h=900&q=80', 'A church celebration', 5),
('gallery6', 'Gallery photo 6', 'Gallery', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&h=900&q=80', 'Prayer together', 6),
('eventYouthCamp', 'Event photo — youth', 'Events', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=750&q=80', 'Youth camp', 1),
('eventWomensRetreat', 'Event photo — women', 'Events', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&h=750&q=80', 'Women''s retreat', 2),
('eventConference', 'Event photo — conference', 'Events', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&h=750&q=80', 'Annual conference', 3);

-- Role cards only, and only when the directory is still empty.
-- Portraits are uploaded later from Admin → Leadership. No stock faces.
INSERT INTO leaders (role_title, bio, ministry, team, published, sort_order)
SELECT v.role_title, v.bio, v.ministry, v.team, TRUE, v.sort_order
FROM (VALUES
    ('Senior Pastor', 'Oversees the preaching, teaching and pastoral care of the whole congregation.', NULL::varchar, 'PASTORAL', 1),
    ('Associate Pastor', 'Supports the preaching ministry and leads discipleship across the church.', NULL::varchar, 'PASTORAL', 2),
    ('Church Elder', 'Shares in the spiritual oversight and governance of the church.', NULL::varchar, 'PASTORAL', 3),
    ('Youth Ministry Leader', 'Leads worship, teaching and discipleship for teenagers and young adults.', 'Youth Ministry', 'MINISTRY', 4),
    ('Youth Coordinator', 'Coordinates youth events, camps and small groups.', 'Youth Ministry', 'MINISTRY', 5),
    ('Women''s Ministry Leader', 'Leads Bible study, prayer and fellowship among the women of the church.', 'Women''s Ministry', 'MINISTRY', 6),
    ('Women''s Ministry Coordinator', 'Coordinates retreats, outreach and mentoring for women.', 'Women''s Ministry', 'MINISTRY', 7),
    ('Men''s Ministry Leader', 'Leads teaching, accountability and service among the men of the church.', 'Men''s Ministry', 'MINISTRY', 8),
    ('Kids Ministry Leader', 'Oversees Sunday School and children''s ministry across all age groups.', 'Kids Ministry', 'MINISTRY', 9)
) AS v(role_title, bio, ministry, team, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM leaders);

/**
 * Player reviews shown on the home page, above Meet the Staff.
 * Text is kept exactly as the players wrote it. Only add real reviews from real players.
 */
export interface Review {
  /** Name as the player signed the review, or an alias when they asked to stay anonymous. */
  name: string;
  /** true = `name` is an alias we chose because the reviewer asked not to be named. */
  alias?: boolean;
  /** Minecraft username, only when the player gave it; used for their head avatar. */
  ign?: string;
  /** Out of 5; decimals allowed (e.g. 4.9). Omit when the player didn't give one. */
  rating?: number;
  /** Optional headline the player wrote. */
  title?: string;
  /** Review body; separate paragraphs with a blank line. */
  text: string;
  /** "wide" = featured tile spanning 2 columns (use for one review). */
  size?: "wide";
}

export const REVIEWS: Review[] = [
  {
    name: "Kratos | クラトス",
    size: "wide",
    rating: 4.9,
    title: "ScytheMC Network – 4.9/5",
    text: `Honestly, ScytheMC is one of the best Minecraft networks I've played on. The community is great, the gameplay is enjoyable, and the staff team is helpful and friendly. You can clearly see the effort put into making the server a better place for everyone. Whether you're into PvP or just want to enjoy playing with others, ScytheMC is definitely worth trying.

I'd give it a 4.9/5 because, let's be real, nothing is perfect, and there's always a little room for improvement. Still, ScytheMC is an amazing network, and I genuinely enjoy being a part of it!`,
  },
  {
    name: "Starvos",
    rating: 5,
    title: "5-Star Review for ScytheMC",
    text: `ScytheMC delivers an enjoyable Minecraft experience with smooth gameplay, exciting features, and a welcoming community. From its unique gameplay to its focus on performance and reliability, it offers a great experience for players looking for something different. Highly recommended for anyone searching for a fun and reliable Minecraft server!`,
  },
  {
    name: "Yash",
    rating: 5,
    title: "An Amazing Minecraft Server! ❤️🔥",
    text: `SyctheMC is genuinely one of the best servers I've had the pleasure of playing on! The player base is really good, friendly, and supportive. The owner and higher staff members are extremely helpful and always ready to support the community.

A special shoutout to Founder Nagesh for being so supportive and dedicated towards the server! 👑❤️

I absolutely love playing on this server because of its lag-free gameplay, supportive staff team, and amazing player base. The overall experience is fantastic, and the community makes it even more enjoyable.

Keep up the amazing work, SyctheMC! Wishing the server more growth and success ahead! 🚀💯

Highly recommended! 5/5 stars! ⭐⭐⭐⭐⭐`,
  },
  {
    name: "1THE_GAMING_FUN1",
    ign: "1THE_GAMING_FUN1",
    rating: 5,
    title: "SCYTHE MC Review",
    text: `Bro very nice server, staff also very geniune and very fast support

Every week there is a event for players to enjoy

In my opinion its a 5 star server everyone must play it regularly to experince a competitve and peaceful environment`,
  },
  {
    name: "Slasher_x7",
    rating: 4.8,
    title: "Overall Experience: Excellent! 🌟",
    text: `My experience with SCHTHE MC has been very positive. I appreciate the quality of service, professionalism, and dedication shown by the team. The organization has great potential and delivers a commendable experience. 👏

🔹 Areas for Improvement:
There is still some room for improvement in staff management, internal coordination, and overall teamwork. Strengthening communication, collaboration, and team management would significantly improve efficiency and create an even better experience. 🤝

🚀 Keep up the excellent work! Looking forward to seeing continued growth, better coordination, and further improvements.`,
  },
  {
    name: "IMMORTAL",
    rating: 5,
    title: "An Amazing Minecraft Server! ❤️🔥",
    text: `Scythe MC is genuinely one of the best servers I’ve had the pleasure of playing on! With around 50ms ping for Indian players and a rock-solid 20 TPS, the gameplay is completely lag-free and super responsive.

Whether you are grinding in the balanced Economy mode or sharpening your skills in Practice PvP, everything runs smoothly and feels fair thanks to the reliable anti-cheat. The community is welcoming, and the active staff team always keeps things fun with regular events and giveaways!

Keep up the amazing work, Scythe MC! Wishing the server more growth and success ahead! 🚀❤️

Highly recommended! 5/5 stars! ⭐⭐⭐⭐⭐`,
  },
  {
    name: "Aivinx",
    rating: 5,
    title: "One of the Best Minecraft Servers! ❤️🔥",
    text: `SyctheMC is truly an amazing Minecraft server! The gameplay is smooth, the community is friendly, and the staff team is always helpful and supportive.

A special shoutout to Founder Nagesh for creating such an incredible server and making the community enjoyable! 👑❤️

I really enjoy playing on this server because of its awesome features, friendly players, active staff, and amazing overall experience.

Keep growing, SyctheMC! Wishing the entire team more success and an even bigger community! 🚀🔥

Highly Recommended! 5/5 Stars! ⭐⭐⭐⭐⭐`,
  },
  {
    name: "Dark_Hardik",
    rating: 5,
    title: "SCYTHE MC – Server Review",
    text: `ScytheMC is a Minecraft server worth checking out! 👑

I've had a great time exploring the server, enjoying its different game modes, participating in PvP fights, and experiencing the public server.

The server offers plenty of opportunities for competitive gameplay, survival, and fun with other players.

If you're a Minecraft player who enjoys PvP and multiplayer adventures, give ScytheMC a try!

⚔️ Overall: A server worth experiencing!

🌐 Server IP: scythemc.fun

See you in-game! 🔥`,
  },
  {
    name: "PvP_Wanderer",
    alias: true,
    rating: 5,
    title: "Scythe MC – Server Review",
    text: `Scythe MC is an amazing Minecraft server with an exciting gaming experience. The server offers enjoyable gameplay, a competitive environment, and a great community for Minecraft players.

The server's performance, unique features, and engaging gameplay make it a fun place to play with friends. Whether you enjoy PvP or exploring different game modes, Scythe MC offers an entertaining experience.

Final Verdict: Highly recommended for Minecraft players looking for fun, competition, and an enjoyable multiplayer experience!

🔥 GG Scythe MC! Keep Growing!`,
  },
  {
    name: "NightOwl_Miner",
    alias: true,
    text: `SyctheMC is honestly one of the best Minecraft servers I've played on! ❤️ The player base is amazing, friendly, and very supportive. The owner and higher staff members are extremely helpful and supportive, especially the founder Nagesh. 👑

I genuinely enjoy playing on this server because of its lag-free gameplay, supportive staff team, and awesome community. Everyone makes the experience even better! 💯

If you're looking for a server with great performance, helpful staff, and an amazing player base, SyctheMC is definitely worth joining! 🚀`,
  },
  {
    name: "HARRY",
    rating: 5,
    title: "10/10 Server! Don't sleep on SyctheMC 🔥",
    text: `Been playing here for a while and honestly, it’s unmatched. Zero lag, chill players, and an active staff team that actually listens to the community.

Huge W to Nagesh for putting so much effort into making this server run this smoothly. 👑

If you're looking for a solid Minecraft server to grind and vibe on, this is the spot. Definitely worth joining! ⚔️✨`,
  },
];

/** What players highlight about the server (from a player-submitted list). */
export const HIGHLIGHTS: { emoji: string; label: string; detail: string }[] = [
  { emoji: "⚡", label: "Low ping", detail: "Target around 50ms for Indian players" },
  { emoji: "🚀", label: "Performance", detail: "Stable 20 TPS, optimized Paper settings" },
  { emoji: "⚔️", label: "Gamemodes", detail: "Practice and Economy" },
  { emoji: "🛡️", label: "Anti-cheat", detail: "Fair gameplay for everyone" },
  { emoji: "🌍", label: "Community", detail: "Active staff, events, giveaways" },
  { emoji: "💎", label: "Quality", detail: "Smooth PvP, balanced economy" },
];

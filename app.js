'use strict';

const _CFG = {
  SP_CLIENT_ID: 'ccc86d1c9b6942ed9629a72638b27527',
  get SP_REDIRECT(){ return localStorage.getItem('sp_redirect') || location.origin + '/callback'; },
  SP_SCOPES: 'streaming user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-library-modify user-top-read playlist-read-private playlist-read-collaborative user-read-recently-played',
};

// Games are loaded dynamically from cinesteam — see _loadGameData()
let RACCOON_GAMES = [];
const _gurl = (id, name) => `https://www.raccoongame.com/wap/dist/#/platform/cloudgame/gamedetail?gid=${id}&name=${encodeURIComponent(name)}`;
const _FALLBACK_GAMES = [
  {id:117, name:'Cyberpunk 2077',                    genre:'RPG',           url:_gurl(117,'Cyberpunk 2077'),                    desc:'Open-world RPG set in the neon-soaked Night City. Play as V, a mercenary chasing a one-of-a-kind implant.'},
  {id:209, name:'Grand Theft Auto V',                genre:'Open World',    url:_gurl(209,'Grand Theft Auto V'),                desc:'An open world crime game set in Los Santos. Complete missions, explore freely, and live the criminal life.'},
  {id:598, name:'Elden Ring',                        genre:'Action RPG',    url:_gurl(598,'Elden Ring'),                        desc:'FromSoftware\'s open-world masterpiece. Explore the Lands Between and claim the Elden Ring.'},
  {id:1021,name:'Little Nightmares III',             genre:'Horror',        url:_gurl(1021,'Little Nightmares III'),            desc:'Survive the terrifying world of Nowhere in this dark puzzle platformer.'},
  {id:1013,name:'Clair Obscur: Expedition 33',       genre:'RPG',           url:_gurl(1013,'Clair Obscur: Expedition 33'),      desc:'A turn-based RPG with stunning visuals and a rich narrative set in a dying world.'},
  {id:1003,name:'JDM: Japanese Drift Master',        genre:'Racing',        url:_gurl(1003,'JDM: Japanese Drift Master'),       desc:'Master the art of Japanese drift racing on mountain passes and city circuits.'},
  {id:1002,name:'The First Berserker: Khazan',       genre:'Action',        url:_gurl(1002,'The First Berserker: Khazan'),      desc:'A brutal action RPG following the legendary warrior Khazan.'},
  {id:1001,name:'Blue Prince',                       genre:'Puzzle',        url:_gurl(1001,'Blue Prince'),                     desc:'A roguelike puzzle game where you explore a manor that rearranges itself each visit.'},
  {id:999, name:'Only Up',                           genre:'Platformer',    url:_gurl(999,'Only Up'),                          desc:'Climb ever higher through a surreal world with no way to go but up.'},
  {id:998, name:'Schedule 1',                       genre:'Simulation',    url:_gurl(998,'Schedule 1'),                       desc:'Run your own underground operation in this darkly comic business simulator.'},
  {id:996, name:'RuneScape: Dragonwilds',            genre:'MMORPG',        url:_gurl(996,'RuneScape: Dragonwilds'),            desc:'Explore a new survival open world set in the RuneScape universe.'},
  {id:975, name:'Poppy Playtime: Chapter 4',         genre:'Horror',        url:_gurl(975,'Poppy Playtime: Chapter 4'),         desc:'The latest chapter in the terrifying Poppy Playtime horror series.'},
  {id:974, name:'Raft',                              genre:'Survival',      url:_gurl(974,'Raft'),                             desc:'Survive on a raft in the middle of the ocean, collecting resources and fending off sharks.'},
  {id:970, name:'Uncharted 4',                       genre:'Adventure',     url:_gurl(970,'Uncharted 4'),                      desc:'Nathan Drake\'s final adventure across the globe hunting for pirate treasure.'},
  {id:995, name:'Cities: Skylines 2',                genre:'City Builder',  url:_gurl(995,'Cities: Skylines 2'),               desc:'Build and manage the city of your dreams in this deep urban planning sequel.'},
  {id:992, name:'Frostpunk 2',                       genre:'Strategy',      url:_gurl(992,'Frostpunk 2'),                      desc:'Lead society through a new ice age as you manage a city in the frozen apocalypse.'},
  {id:966, name:'Poppy Playtime: Chapter 2',         genre:'Horror',        url:_gurl(966,'Poppy Playtime: Chapter 2'),         desc:'Delve deeper into the abandoned toy factory and face Mommy Long Legs.'},
  {id:965, name:'Poppy Playtime: Chapter 1',         genre:'Horror',        url:_gurl(965,'Poppy Playtime: Chapter 1'),         desc:'Return to the abandoned Playtime Co. factory and face Huggy Wuggy.'},
  {id:958, name:'Poppy Playtime: Chapter 3',         genre:'Horror',        url:_gurl(958,'Poppy Playtime: Chapter 3'),         desc:'Explore the Playcare orphanage in the depths of the factory.'},
  {id:973, name:'Mafia III: Definitive Edition',     genre:'Action',        url:_gurl(973,'Mafia III: Definitive Edition'),     desc:'Lincoln Clay seeks revenge in 1960s New Bordeaux in this open-world crime story.'},
  {id:972, name:'Mafia II: Definitive Edition',      genre:'Action',        url:_gurl(972,'Mafia II: Definitive Edition'),      desc:'Rise through the ranks of the mob in 1940s–50s Empire Bay.'},
  {id:969, name:'Undertale',                         genre:'RPG',           url:_gurl(969,'Undertale'),                        desc:'A friendly RPG where nobody has to get hurt — every enemy can be reasoned with.'},
  {id:1022,name:'Counter-Strike 2',                  genre:'FPS',           url:_gurl(1022,'Counter-Strike 2'),                desc:'The legendary tactical shooter, rebuilt with Source 2. Buy, plant, defuse.'},
  {id:963, name:'God of War: Ragnarök',              genre:'Action RPG',    url:_gurl(963,'God of War: Ragnarök'),              desc:'Kratos and Atreus must navigate the Norse realms as Fimbulwinter begins.'},
  {id:952, name:'Supermarket Simulator',             genre:'Simulation',    url:_gurl(952,'Supermarket Simulator'),            desc:'Build and manage your own supermarket from the ground up.'},
  {id:946, name:'Brotato',                           genre:'Roguelite',     url:_gurl(946,'Brotato'),                          desc:'A top-down arena shooter where you play as a potato wielding up to 6 weapons at once.'},
  {id:587, name:'God of War 4',                      genre:'Action RPG',    url:_gurl(587,'God of War 4'),                     desc:'Kratos reinvents himself in the realm of Norse mythology alongside his son Atreus.'},
  {id:890, name:'Halo: The Master Chief Collection', genre:'FPS',           url:_gurl(890,'Halo: The Master Chief Collection'),'desc':'Six Halo games remastered and bundled together.'},
  {id:791, name:'Ratchet & Clank: Rift Apart',       genre:'Platformer',    url:_gurl(791,'Ratchet & Clank: Rift Apart'),       desc:'Blast across dimensions with Ratchet, Clank, and a new Lombax hero.'},
  {id:765, name:'The Last of Us Part I',             genre:'Survival',      url:_gurl(765,'The Last of Us Part I'),             desc:'Joel escorts Ellie across a post-apocalyptic United States overrun by infected.'},
  {id:2,   name:'Hollow Knight',                     genre:'Metroidvania',  url:_gurl(2,'Hollow Knight'),                      desc:'Explore a vast underground kingdom of insects and heroes in this precise action platformer.'},
  {id:723, name:'Need for Speed: Payback',           genre:'Racing',        url:_gurl(723,'Need for Speed: Payback'),           desc:'Pull off heists and street races in this blockbuster racing action story.'},
  {id:697, name:'Hogwarts Legacy',                   genre:'RPG',           url:_gurl(697,'Hogwarts Legacy'),                   desc:'Live the unwritten — attend Hogwarts and uncover a hidden magical secret.'},
  {id:676, name:'Drift Racing Online',               genre:'Racing',        url:_gurl(676,'Drift Racing Online'),               desc:'Compete in online drift events across a variety of tracks and cars.'},
  {id:669, name:'Choo-Choo Charles',                 genre:'Horror',        url:_gurl(669,'Choo-Choo Charles'),                 desc:'Survive a demonic spider-train while exploring an island by your own train.'},
  {id:633, name:'NBA 2K23',                          genre:'Sports',        url:_gurl(633,'NBA 2K23'),                         desc:'The definitive basketball experience with deep MyCareer and online modes.'},
  {id:625, name:'Marvel\'s Spider-Man Remastered',   genre:'Action',        url:_gurl(625,'Marvel\'s Spider-Man Remastered'),   desc:'Swing through New York City as Peter Parker in this acclaimed superhero game.'},
  {id:620, name:'Stray',                             genre:'Adventure',     url:_gurl(620,'Stray'),                            desc:'Play as a stray cat navigating a neon-lit cybercity full of robots and danger.'},
  {id:612, name:'Subnautica: Below Zero',            genre:'Survival',      url:_gurl(612,'Subnautica: Below Zero'),            desc:'Dive into an alien ocean world and uncover the secrets buried beneath the ice.'},
  {id:590, name:'Watch Dogs: Legion',                genre:'Action',        url:_gurl(590,'Watch Dogs: Legion'),                desc:'Recruit anyone in a hacked near-future London and build your resistance.'},
  {id:581, name:'FIFA 19',                           genre:'Sports',        url:_gurl(581,'FIFA 19'),                          desc:'Authentic football simulation with Champions League and full team management.'},
  {id:515, name:'Arma 3',                            genre:'FPS',           url:_gurl(515,'Arma 3'),                           desc:'A massive military sandbox with realistic combat across land, sea, and air.'},
  {id:513, name:'Assassin\'s Creed: Brotherhood',    genre:'Action',        url:_gurl(513,'Assassin\'s Creed: Brotherhood'),    desc:'Ezio builds a Brotherhood of Assassins to take down the Templars in Rome.'},
  {id:509, name:'Assassin\'s Creed: Black Flag',     genre:'Action',        url:_gurl(509,'Assassin\'s Creed: Black Flag'),     desc:'Sail the Caribbean as pirate-assassin Edward Kenway in a golden age of piracy.'},
  {id:465, name:'Assassin\'s Creed: Syndicate',      genre:'Action',        url:_gurl(465,'Assassin\'s Creed: Syndicate'),      desc:'Take back Victorian London from Templar control with Jacob and Evie Frye.'},
  {id:458, name:'A Way Out',                         genre:'Co-op',         url:_gurl(458,'A Way Out'),                        desc:'A co-op only adventure where two prisoners must break out and go on the run.'},
  {id:449, name:'Days Gone',                         genre:'Survival',      url:_gurl(449,'Days Gone'),                        desc:'Ride through a post-apocalyptic Oregon on a motorcycle, surviving zombie hordes.'},
  {id:445, name:'Forza Horizon 4',                   genre:'Racing',        url:_gurl(445,'Forza Horizon 4'),                   desc:'Race across a shared open-world Britain with dynamic seasons in this acclaimed racer.'},
  {id:421, name:'My Friend Pedro',                   genre:'Action',        url:_gurl(421,'My Friend Pedro'),                  desc:'A violent ballet of chaos where a sentient banana guides you through gun-fu mayhem.'},
  {id:398, name:'Control',                           genre:'Action',        url:_gurl(398,'Control'),                          desc:'Navigate a brutalist government building warped by supernatural forces as Jesse Faden.'},
  {id:314, name:'Fallout 4',                         genre:'RPG',           url:_gurl(314,'Fallout 4'),                        desc:'Build settlements and uncover the secrets of the Commonwealth in post-nuclear Boston.'},
  {id:305, name:'It Takes Two',                      genre:'Co-op',         url:_gurl(305,'It Takes Two'),                     desc:'A married couple on the brink of divorce must work together through a magical adventure.'},
  {id:301, name:'Minecraft: Dungeons',               genre:'Action RPG',    url:_gurl(301,'Minecraft: Dungeons'),              desc:'A dungeon crawler set in the Minecraft universe for up to 4 players.'},
  {id:1024,name:'Destiny 2',                         genre:'FPS',           url:_gurl(1024,'Destiny 2'),                       desc:'Free-to-play FPS where Guardians defend humanity from alien threats across the solar system.'},
  {id:1023,name:'War Thunder',                       genre:'Action',        url:_gurl(1023,'War Thunder'),                     desc:'Free-to-play MMO combat with aircraft, tanks, and ships from WWII to the Cold War.'},
  {id:991, name:'Manor Lords',                       genre:'City Builder',  url:_gurl(991,'Manor Lords'),                      desc:'Build a medieval settlement, manage resources, and command battles in this strategy game.'},
  {id:990, name:'inZOI',                             genre:'Simulation',    url:_gurl(990,'inZOI'),                            desc:'A next-gen life simulation game where you control every aspect of your characters\' lives.'},
  {id:988, name:'Horizon Zero Dawn',                 genre:'Action RPG',    url:_gurl(988,'Horizon Zero Dawn'),                desc:'Hunt robotic dinosaurs across a post-apocalyptic wilderness as Aloy.'},
  {id:987, name:'Dead Space 3',                      genre:'Horror',        url:_gurl(987,'Dead Space 3'),                     desc:'Isaac Clarke battles Necromorphs on a frozen planet with optional co-op.'},
  {id:986, name:'Deathloop',                         genre:'FPS',           url:_gurl(986,'Deathloop'),                        desc:'Break a time loop by assassinating eight targets in one day on Blackreef island.'},
  {id:984, name:'Dead Space 2',                      genre:'Horror',        url:_gurl(984,'Dead Space 2'),                     desc:'Isaac Clarke fights Necromorphs on the Sprawl space station in this intense horror sequel.'},
  {id:977, name:'The Callisto Protocol',             genre:'Horror',        url:_gurl(977,'The Callisto Protocol'),            desc:'A sci-fi survival horror game set on a maximum security prison on Jupiter\'s moon.'},
  {id:976, name:'ARK: Survival Ascended',            genre:'Survival',      url:_gurl(976,'ARK: Survival Ascended'),           desc:'Tame dinosaurs, build bases, and survive on a mysterious island in this remastered ARK.'},
  {id:968, name:'Yandere Simulator',                 genre:'Simulation',    url:_gurl(968,'Yandere Simulator'),                desc:'Eliminate rivals who have a crush on your Senpai without getting caught.'},
  {id:74,  name:'Watch Dogs 2',                      genre:'Action',        url:_gurl(74,'Watch Dogs 2'),                      desc:'Hack San Francisco as Marcus Holloway, taking down ctOS with the DedSec crew.'},
  {id:415, name:'Doom Eternal',                      genre:'FPS',           url:_gurl(415,'Doom Eternal'),                     desc:'Rip and tear through demonic hordes at breakneck speed as the Doom Slayer.'},
  {id:66,  name:'Cuphead',                           genre:'Action',        url:_gurl(66,'Cuphead'),                           desc:'A hand-drawn run-and-gun with brutally challenging boss fights in 1930s cartoon style.'},
  {id:735, name:'Minecraft: Legends',                genre:'Action',        url:_gurl(735,'Minecraft: Legends'),               desc:'Rally allies and lead them into battle against the Piglins in this Minecraft strategy game.'},
  {id:943, name:'Wobbly Life',                       genre:'Sandbox',       url:_gurl(943,'Wobbly Life'),                      desc:'A physics sandbox life game where you work wacky jobs and explore a colorful open world.'},
  {id:196, name:'Overcooked 2',                      genre:'Co-op',         url:_gurl(196,'Overcooked 2'),                     desc:'Cook meals and serve customers in increasingly chaotic kitchens with up to 4 players.'},
  {id:25,  name:'Resident Evil 2: Remake',           genre:'Horror',        url:_gurl(25,'Resident Evil 2: Remake'),           desc:'Leon and Claire fight through Raccoon City in this terrifying modern remake.'},
  {id:49,  name:'Ori and the Will of the Wisps',     genre:'Platformer',    url:_gurl(49,'Ori and the Will of the Wisps'),     desc:'A breathtaking precision platformer following Ori through a beautiful dangerous forest.'},
  {id:914, name:'Sniper Ghost Warrior Contracts 2',  genre:'FPS',           url:_gurl(914,'Sniper Ghost Warrior Contracts 2'), desc:'Long-range sniping across extreme-range targets in challenging open missions.'},
  {id:714, name:'SpongeBob: Battle for Bikini Bottom',genre:'Platformer',   url:_gurl(714,'SpongeBob: Battle for Bikini Bottom'),'desc':'The classic SpongeBob platformer rehydrated with all-new visuals.'},
  {id:687, name:'SpongeBob: The Cosmic Shake',       genre:'Platformer',    url:_gurl(687,'SpongeBob: The Cosmic Shake'),      desc:'SpongeBob must rescue his friends from wish-granting jelly that warped Bikini Bottom.'},
  {id:630, name:'Ranch Simulator',                   genre:'Simulation',    url:_gurl(630,'Ranch Simulator'),                  desc:'Build and manage a working ranch in the Canadian wilderness.'},
  {id:610, name:'GhostWire: Tokyo',                  genre:'Action',        url:_gurl(610,'GhostWire: Tokyo'),                 desc:'Use paranormal abilities to unravel the mystery behind Tokyo\'s vanished population.'},
  {id:602, name:'Nintendo Star Brawl',               genre:'Fighting',      url:_gurl(602,'Nintendo Star Brawl'),              desc:'A platform fighter bringing together iconic Nintendo characters in epic battles.'},
  {id:597, name:'LEGO The Incredibles',              genre:'Platformer',    url:_gurl(597,'LEGO The Incredibles'),             desc:'Play through both Incredibles films in classic LEGO co-op style.'},
  {id:585, name:'Cooking Simulator',                 genre:'Simulation',    url:_gurl(585,'Cooking Simulator'),                desc:'Master cooking in a realistic kitchen physics simulator.'},
  {id:512, name:'Assassin\'s Creed: Revelations',    genre:'Action',        url:_gurl(512,'Assassin\'s Creed: Revelations'),   desc:'Ezio uncovers the secrets of Altaïr in this epic conclusion to the Ezio trilogy.'},
  {id:462, name:'Football: PES 2021',                genre:'Sports',        url:_gurl(462,'Football: PES 2021'),               desc:'Authentic football simulation featuring licensed clubs and competitions.'},
  {id:390, name:'Halo: Reach',                       genre:'FPS',           url:_gurl(390,'Halo: Reach'),                      desc:'The prequel to Halo — Noble Team\'s last stand defending planet Reach.'},
  {id:96,  name:'Attack On Titan 2',                 genre:'Action',        url:_gurl(96,'Attack On Titan 2'),                 desc:'Relive the anime story and fight Titans with 3D maneuver gear.'},
  {id:201, name:'ONE PIECE: PIRATE WARRIORS 4',      genre:'Action',        url:_gurl(201,'ONE PIECE: PIRATE WARRIORS 4'),     desc:'Play through One Piece\'s greatest moments in this explosive musou action game.'},
  {id:50,  name:'One Piece: Burning Blood',          genre:'Fighting',      url:_gurl(50,'One Piece: Burning Blood'),          desc:'A One Piece fighting game featuring iconic Devil Fruit powers and Haki.'},
  {id:451, name:'Alba: A Wildlife Adventure',        genre:'Adventure',     url:_gurl(451,'Alba: A Wildlife Adventure'),       desc:'Save a nature reserve with a young girl who helps animals and fights to protect wildlife.'},
  {id:102, name:'Resident Evil: Revelations 2',      genre:'Horror',        url:_gurl(102,'Resident Evil: Revelations 2'),     desc:'Claire Redfield and Moira Burton survive a mysterious island prison.'},
  {id:411, name:'Party Hard 2',                      genre:'Strategy',      url:_gurl(411,'Party Hard 2'),                     desc:'Silently eliminate noisy partygoers without getting caught in this stealth strategy game.'},
  {id:994, name:'Crashlands 2',                      genre:'RPG',           url:_gurl(994,'Crashlands 2'),                     desc:'Crash-land on an alien planet and craft your way to survival in this action RPG.'},
  {id:993, name:'Mandragora',                        genre:'Action RPG',    url:_gurl(993,'Mandragora'),                       desc:'A gothic dark fantasy action RPG with tight soulslike combat.'},
  {id:815, name:'Neon Abyss',                        genre:'Roguelite',     url:_gurl(815,'Neon Abyss'),                       desc:'Dive into a neon underworld in this frantic roguelite action platformer.'},
  {id:979, name:'Five Hearts Under One Roof',        genre:'Simulation',    url:_gurl(979,'Five Hearts Under One Roof'),       desc:'A cozy life sim about living together with five housemates and building relationships.'},
  {id:982, name:'Inside the Backrooms',              genre:'Horror',        url:_gurl(982,'Inside the Backrooms'),             desc:'Explore the liminal horror of the Backrooms and find a way to escape.'},
  {id:967, name:'Amanda the Adventurer',             genre:'Horror',        url:_gurl(967,'Amanda the Adventurer'),            desc:'Watch old VHS tapes featuring Amanda — but something is watching back.'},
  {id:1011,name:'Wolf Mate',                         genre:'Simulation',    url:_gurl(1011,'Wolf Mate'),                       desc:'Live life as a wolf in a vast open wilderness, hunting and surviving in a wolf pack.'},
  {id:989, name:'AI LIMIT',                          genre:'Action RPG',    url:_gurl(989,'AI LIMIT'),                         desc:'A post-apocalyptic soulslike set in a world where humans coexist with androids.'},
  {id:1014,name:'Sim Racing Telemetry - F1 22',      genre:'Racing',        url:_gurl(1014,'Sim Racing Telemetry - F1 22'),    desc:'Race as an F1 driver with full telemetry and realistic simulation.'},
  {id:1016,name:'X-Plane 11',                        genre:'Simulation',    url:_gurl(1016,'X-Plane 11'),                      desc:'The most advanced flight simulator available with real-world aircraft physics.'},
  {id:1015,name:'GUILTY GEAR -STRIVE-',              genre:'Fighting',      url:_gurl(1015,'GUILTY GEAR -STRIVE-'),            desc:'A breathtaking anime fighter with stunning visuals and deep combat mechanics.'},
  {id:1012,name:'Easy Red 2',                        genre:'FPS',           url:_gurl(1012,'Easy Red 2'),                      desc:'A realistic WWII tactical shooter with large multiplayer battles.'},
  {id:1018,name:'SAND LAND', genre:'Action RPG', url:'https://www.raccoongame.com/wap/dist/#/platform/cloudgame/gamedetail?gid=1018&name=SAND%20LAND', desc:'Based on Akira Toriyama\'s manga — explore a desert world in mechs and vehicles.'},
];

// Load full game data from cinesteam
async function _loadGameData() {
  try {
    await new Promise((res, rej) => {
      if (typeof G_DATA !== 'undefined') { res(); return; }
      const s = document.createElement('script');
      s.src = 'https://cinesteam.cine-softwares.workers.dev/random/gamelayout.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    if (typeof G_DATA !== 'undefined' && G_DATA.length) {
      RACCOON_GAMES = G_DATA.map(g => ({
        id: parseInt(g.id),
        name: g.n,
        genre: (g.tags && g.tags[0]) || 'Game',
        tags: g.tags || [],
        url: g.url,
        img: g.img || '',
        bg: g.bg || '',
        dev: g.dev || '',
        desc: g.desc || '',
        ach: g.ach || 0,
      }));
      _allGames = [...RACCOON_GAMES];
      _buildGames();
      return;
    }
  } catch(e) {}
  // Fallback to embedded data
  RACCOON_GAMES = _FALLBACK_GAMES.map(g => ({...g, img:'', bg:'', dev:'', ach:0, tags:[g.genre]}));
  _allGames = [...RACCOON_GAMES];
  _buildGames();
}

const QK = [
  {name:'Google',    url:'https://google.com',     svg:'<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M17 12h-5v3h3a4 4 0 1 1-1-4.24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>'},
  {name:'YouTube',   url:'https://youtube.com',    svg:'<rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><polygon points="10,9 16,12 10,15" fill="currentColor"/>'},
  {name:'Reddit',    url:'https://reddit.com',     svg:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9.5 16s.8 1.5 2.5 1.5 2.5-1.5 2.5-1.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="16.5" cy="7" r=".8" fill="currentColor"/><path d="M12 7.5c0-1.5 3-1.3 3 .5M9 10c.8-.8 2-.6 2.5.2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>'},
  {name:'Discord',   url:'https://discord.com',    svg:'<path d="M20.32 4.37A19.8 19.8 0 0 0 15.42 3c-.22.4-.48.93-.66 1.36a18.3 18.3 0 0 0-5.52 0A13.5 13.5 0 0 0 8.58 3 19.8 19.8 0 0 0 3.68 4.37C.52 8.76-.32 13.04.1 17.26A19.87 19.87 0 0 0 6.14 21c.49-.67.92-1.38 1.3-2.12a13 13 0 0 1-2.05-1 14.1 14.1 0 0 0 12.22 0 13 13 0 0 1-2.06 1c.37.74.81 1.45 1.3 2.12A19.82 19.82 0 0 0 23.9 17.26c.5-5.05-.85-9.3-3.58-12.9zM8.02 14.6c-1.18 0-2.16-1.1-2.16-2.44 0-1.35.96-2.45 2.16-2.45 1.21 0 2.18 1.1 2.16 2.45 0 1.35-.95 2.44-2.16 2.44zm7.96 0c-1.18 0-2.16-1.1-2.16-2.44 0-1.35.95-2.45 2.16-2.45 1.2 0 2.17 1.1 2.16 2.45 0 1.35-.94 2.44-2.16 2.44z" fill="currentColor"/>'},
  {name:'GitHub',    url:'https://github.com',     svg:'<path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" fill="currentColor"/>'},
  {name:'TempMail',  url:'https://temp-mail.org',  svg:'<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m2 7 10 7 10-7" stroke="currentColor" stroke-width="1.5" fill="none"/>'},
  {name:'Gmail',     url:'https://mail.google.com',svg:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M22 6 12 13 2 6" stroke="currentColor" stroke-width="1.5" fill="none"/>'},
  {name:'Wikipedia', url:'https://wikipedia.org',  svg:'<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor">W</text>'},
];

const APPS = [
  {name:'Google Docs',   url:'https://docs.google.com'},
  {name:'Google Slides', url:'https://slides.google.com'},
  {name:'Kahoot',        url:'https://kahoot.it'},
  {name:'Quizlet',       url:'https://quizlet.com'},
  {name:'Desmos',        url:'https://desmos.com/calculator'},
  {name:'GeoGebra',      url:'https://geogebra.org'},
  {name:'Scratch',       url:'https://scratch.mit.edu'},
  {name:'CodePen',       url:'https://codepen.io'},
];

// STATE
let _activeTab = 'browse';
let _seEngine = 'https://www.google.com/search?q=';
let _hosts = [];
let _activeServer = 0;
let _ibHistory = [];
let _ibHi = -1;

// BOOT
(function(){
  // migrate old panic key setting — Escape caused accidental redirects
  try {
    const s = JSON.parse(localStorage.getItem('zsett')||'{}');
    if (s.panicKey === 'Escape') { s.panicKey = 'F1'; localStorage.setItem('zsett', JSON.stringify(s)); }
  } catch {}
  _loadSettings();
  setTimeout(() => {
    document.getElementById('school').classList.add('gone');
    if (!localStorage.getItem('zdisc')) {
      document.getElementById('disc').classList.remove('gone');
    } else {
      _checkAuth();
    }
  }, 500);
})();

// DISCLAIMER
let _discChecked = false;
function _toggleDiscCheck() {
  _discChecked = !_discChecked;
  const box = document.getElementById('disc-box-visual');
  const btn = document.getElementById('disc-btn');
  box.classList.toggle('checked', _discChecked);
  btn.disabled = !_discChecked;
  btn.classList.toggle('ok', _discChecked);
}
document.getElementById('disc-btn').addEventListener('click', () => {
  if (!_discChecked) return;
  localStorage.setItem('zdisc', '1');
  document.getElementById('disc').classList.add('gone');
  _checkAuth();
});

// AUTH — no gate, open to all
function _checkAuth() { _showApp(); }
function _clearSession() { _toast('Session cleared'); }
function _logout() { location.reload(); }

// APP
function _showApp() {
  document.getElementById('app').classList.remove('gone');
  _buildQK();
  _buildApps();
  _buildGames();
  _buildFeaturedVideos();
  _loadMovies();
  _loadProfile();
  _loadStats();
  _loadHosts();
  _pingServers();
  _incStat('sessions');
  _spCheckCallback();
  _loadXH();
  const rd = document.getElementById('sp-redirect-display');
  if (rd) rd.textContent = _CFG.SP_REDIRECT;
  const ri = document.getElementById('sp-redirect-inp');
  if (ri && localStorage.getItem('sp_redirect')) ri.value = localStorage.getItem('sp_redirect');
}

// TABS
function _tab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('nb-' + name).classList.add('active');
  _activeTab = name;
  _playSound('click');
  if (name === 'settings') _loadApiKeyDisplay();
}

// BROWSE
function _buildQK() {
  document.getElementById('qk-grid').innerHTML = QK.map(q =>
    `<div class="qk-item" onclick="_go('${q.url}')"><svg viewBox="0 0 24 24" fill="currentColor">${q.svg}</svg><span>${q.name}</span></div>`
  ).join('');
}

function _buildApps() {
  const appSvg = {
    'Google Docs':   '<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    'Google Slides': '<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="7" width="14" height="8" fill="none" stroke="currentColor" stroke-width="1" rx="1"/>',
    'Kahoot':        '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 6 8 14h8z" fill="currentColor"/>',
    'Quizlet':       '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    'Desmos':        '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 17V7M17 12H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    'GeoGebra':      '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    'Scratch':       '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12a4 4 0 0 1 8 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    'CodePen':       '<polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="2,8 12,14 22,8" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="14" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/>',
  };
  document.getElementById('app-grid').innerHTML = APPS.map(a =>
    `<div class="app-card" onclick="_go('${a.url}')"><svg viewBox="0 0 24 24" fill="currentColor">${appSvg[a.name]||''}</svg><span>${a.name}</span></div>`
  ).join('');
}

function _browseGo() {
  const val = document.getElementById('browse-input').value.trim();
  if (!val) return;
  let url;
  if (/^https?:\/\//i.test(val)) url = val;
  else if (/\.\w{2,}/.test(val) && !/\s/.test(val)) url = 'https://' + val;
  else url = _seEngine + encodeURIComponent(val);
  _go(url);
}

function _uvUrl(url) {
  try {
    return __uv$config.prefix + __uv$config.encodeUrl(url);
  } catch {
    return url;
  }
}

function _go(url) {
  const frame = document.getElementById('browse-frame');
  const home  = document.getElementById('browse-home');
  frame.src = _uvUrl(url);
  frame.style.display = 'block';
  home.style.display = 'none';
  document.getElementById('browse-input').value = url;
  if (_activeTab !== 'browse') _tab('browse');
}

let _bhEngine = 'https://www.google.com/search?q=';
function _bhSearch(q) {
  if (!q.trim()) return;
  let url;
  if (/^https?:\/\//i.test(q)) url = q;
  else if (/\.\w{2,}/.test(q) && !/\s/.test(q)) url = 'https://' + q;
  else url = _bhEngine + encodeURIComponent(q);
  document.getElementById('browse-input').value = url;
  _go(url);
}
function _setBhEngine(btn) {
  document.querySelectorAll('.bh-eng').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _bhEngine = btn.dataset.url;
}
function _browseHome() {
  const frame = document.getElementById('browse-frame');
  const home  = document.getElementById('browse-home');
  frame.src = 'about:blank';
  frame.style.display = 'none';
  home.style.display = 'flex';
  home.style.flexDirection = 'column';
  document.getElementById('browse-input').value = '';
}
function _browseBack() { try { document.getElementById('browse-frame').contentWindow.history.back(); } catch(e) {} }
function _browseFwd()  { try { document.getElementById('browse-frame').contentWindow.history.forward(); } catch(e) {} }

// VIDEOS
let _vidCurrentId = null;
function _vidSearch() {
  const q = document.getElementById('vid-search').value.trim();
  if (!q) return;
  let ytId = null;
  const m = q.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) ytId = m[1];
  else if (/^[a-zA-Z0-9_-]{11}$/.test(q)) ytId = q;
  if (ytId) _vidPlay(ytId, q);
  else _vidPlayUrl(/^https?:\/\//i.test(q) ? q : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q), q);
}
function _vidPlay(id, title) {
  _vidCurrentId = id;
  document.getElementById('vid-embed-frame').src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
  document.getElementById('vid-now-title').textContent = title || id;
  document.getElementById('vid-player-wrap').style.display = 'flex';
  document.getElementById('vid-home').style.display = 'none';
}
function _vidPlayUrl(url, title) {
  _vidCurrentId = null;
  document.getElementById('vid-embed-frame').src = url;
  document.getElementById('vid-now-title').textContent = title || url;
  document.getElementById('vid-player-wrap').style.display = 'flex';
  document.getElementById('vid-home').style.display = 'none';
}
function _vidClose() {
  document.getElementById('vid-embed-frame').src = 'about:blank';
  document.getElementById('vid-player-wrap').style.display = 'none';
  document.getElementById('vid-home').style.display = 'block';
  _vidCurrentId = null;
}
function _vidExternal() {
  if (_vidCurrentId) window.open('https://www.youtube.com/watch?v=' + _vidCurrentId, '_blank');
}
function _buildFeaturedVideos() {
  const featured = [
    {title:'Lofi Hip Hop',    channel:'Lofi Girl',          id:'jfKfPfyJRdk'},
    {title:'Nature Sounds',   channel:'Relaxing White Noise',id:'eKFTSSKCzWA'},
    {title:'Coding Music',    channel:'No Copyright Sounds', id:'36YnV9STBqc'},
    {title:'Dark Ambient',    channel:'Study Music',         id:'n61ULEU7CO0'},
    {title:'Lo-Fi Beats',     channel:'ChilledCow',          id:'5qap5aO4i9A'},
    {title:'Jazz Vibes',      channel:'Café Music',          id:'Dx5qFachd3A'},
  ];
  const el = document.getElementById('vid-featured-grid');
  if (!el) return;
  el.innerHTML = featured.map(v =>
    `<div class="vid-feat-card" onclick="_vidPlay('${v.id}','${v.title}')">
      <img class="vid-feat-thumb" src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" onerror="this.style.display='none'">
      <div class="vid-feat-info"><h4>${v.title}</h4><span>${v.channel}</span></div>
    </div>`
  ).join('');
}

// CLOUD
let _allGames = [];
let _activeGenre = 'All';
let _currentCloudGame = null;

const _GENRE_COLORS = {
  'RPG':'#1a0d2e','Action RPG':'#1a0d2e','Action':'#1a1010','FPS':'#0d1a0d',
  'Horror':'#1a0808','Survival':'#0d1a10','Racing':'#0d0d1a','Sports':'#0a1a0a',
  'Platformer':'#0d1520','Metroidvania':'#0d1520','Simulation':'#101a10',
  'Strategy':'#1a150d','City Builder':'#0d1a15','Adventure':'#0a0f1a',
  'Co-op':'#101018','Roguelite':'#1a0d15','Fighting':'#1a0808','Puzzle':'#0d1520',
  'MMORPG':'#0d1a1a','Sandbox':'#0f1a0d','MOBA':'#0d1020',
};

function _buildGames() {
  if (!RACCOON_GAMES.length) {
    document.getElementById('game-grid').innerHTML = '<div style="color:var(--t3);text-align:center;padding:60px;font-size:13px">Loading games...</div>';
    _loadGameData();
    return;
  }
  _allGames = [...RACCOON_GAMES];
  _rebuildGenreMenu();
  _renderGames(_allGames);
}

function _rebuildGenreMenu() {
  const genres = ['All', ...new Set(RACCOON_GAMES.map(g => g.genre))];
  const menu = document.getElementById('cloud-genre-menu');
  menu.innerHTML = genres.map(g =>
    `<button class="cgm-item${g===_activeGenre?' active':''}" onclick="_setGenre('${g.replace(/'/g,"\\'")}',event)">${g}</button>`
  ).join('');
}

function _toggleGenreMenu(e) {
  const btn = document.getElementById('cloud-filter-btn');
  const menu = document.getElementById('cloud-genre-menu');
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

document.addEventListener('click', e => {
  const wrap = document.getElementById('cloud-filter-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('cloud-genre-menu')?.classList.remove('open');
    document.getElementById('cloud-filter-btn')?.classList.remove('open');
  }
});

function _setGenre(g, e) {
  if (e) e.stopPropagation();
  _activeGenre = g;
  const lq = document.getElementById('game-search').value.toLowerCase();
  let list = g === 'All' ? [...RACCOON_GAMES] : RACCOON_GAMES.filter(x => x.genre === g);
  if (lq) list = list.filter(x => x.name.toLowerCase().includes(lq));
  document.getElementById('cloud-filter-label').textContent = g === 'All' ? 'All Genres' : g;
  document.querySelectorAll('.cgm-item').forEach(b => b.classList.toggle('active', b.textContent.trim() === g));
  document.getElementById('cloud-genre-menu').classList.remove('open');
  document.getElementById('cloud-filter-btn').classList.remove('open');
  _renderGames(list);
}

function _renderGames(list) {
  document.getElementById('game-grid').innerHTML = list.map(gm => {
    const c = _GENRE_COLORS[gm.genre] || '#141414';
    const letter = gm.name[0].toUpperCase();
    const coverHtml = gm.img
      ? `<img class="game-cover" src="${gm.img}" alt="${gm.name.replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="game-cover-grad" style="display:none;background:linear-gradient(135deg,${c},#080808)"><span style="font-size:28px;font-weight:700;color:rgba(255,255,255,.15)">${letter}</span></div>`
      : `<div class="game-cover-grad" style="background:linear-gradient(135deg,${c},#080808)"><span style="font-size:28px;font-weight:700;color:rgba(255,255,255,.15)">${letter}</span></div>`;
    return `<div class="game-card" onclick="_openGame(${gm.id})">${coverHtml}<div class="game-info"><h3>${gm.name}</h3><span>${gm.genre}</span></div></div>`;
  }).join('') || '<div style="color:var(--t3);text-align:center;padding:40px;font-size:13px">No games found</div>';
}

function _filterGames(q) {
  const lq = q.toLowerCase();
  let list = _activeGenre === 'All' ? [...RACCOON_GAMES] : RACCOON_GAMES.filter(x => x.genre === _activeGenre);
  if (lq) list = list.filter(g => g.name.toLowerCase().includes(lq) || g.genre.toLowerCase().includes(lq));
  _renderGames(list);
}

function _openGame(id) {
  const gm = RACCOON_GAMES.find(g => g.id === id);
  if (!gm) return;
  _currentCloudGame = gm;

  const detail = document.getElementById('gm-detail');
  const bg = document.getElementById('gmd-bg');
  const poster = document.getElementById('gmd-poster');
  const posterFb = document.getElementById('gmd-poster-fb');
  const posterLetter = document.getElementById('gmd-poster-letter');

  // Hero background
  const heroUrl = gm.bg || gm.img || '';
  bg.style.backgroundImage = heroUrl ? `url('${heroUrl}')` : 'none';
  if (!heroUrl) bg.style.background = _GENRE_COLORS[gm.genre] || '#141414';

  // Poster
  if (gm.img) {
    poster.src = gm.img;
    poster.style.display = 'block';
    posterFb.style.display = 'none';
    poster.onerror = () => { poster.style.display='none'; posterFb.style.display='flex'; posterLetter.textContent=gm.name[0]; };
  } else {
    poster.style.display = 'none';
    posterFb.style.display = 'flex';
    posterLetter.textContent = gm.name[0];
  }

  // Info
  document.getElementById('gmd-title').textContent = gm.name;
  document.getElementById('gmd-dev').textContent = gm.dev || '';
  document.getElementById('gmd-desc').textContent = gm.desc || 'No description available.';

  // Tags
  const tags = gm.tags && gm.tags.length ? gm.tags : [gm.genre];
  document.getElementById('gmd-tags').innerHTML = tags.map(t => `<span class="gmd-tag">${t}</span>`).join('');

  // Requirements
  const reqEl = document.getElementById('gmd-req');
  if (gm.rm && Object.keys(gm.rm).length) {
    const fmtReq = r => Object.entries(r).map(([k,v])=>`<div><span style="color:var(--t3);font-size:10px;text-transform:uppercase;letter-spacing:.5px">${k}</span><div style="font-size:12px;color:var(--t1);margin-top:2px">${v}</div></div>`).join('');
    reqEl.innerHTML = `<div class="gmd-req-title">System Requirements</div><div class="gmd-req-cols"><div><div class="gmd-req-label">Minimum</div>${fmtReq(gm.rm)}</div>${gm.rr?`<div><div class="gmd-req-label">Recommended</div>${fmtReq(gm.rr)}</div>`:''}</div>`;
    reqEl.style.display = 'block';
  } else {
    reqEl.style.display = 'none';
  }

  // Play button
  document.getElementById('gmd-play-btn').onclick = () => _launchCloudGame(gm);

  detail.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _closeGameDetail() {
  document.getElementById('gm-detail').classList.remove('open');
  document.body.style.overflow = '';
}

function _openLoginSetup(tab) {
  const urls = {
    mail: 'https://temp-mail.org',
    login: 'https://www.raccoongame.com/wap/dist/#/platform/login',
  };
  document.getElementById('login-setup').classList.add('open');
  _lsTab(tab || 'mail', urls);
}

function _lsTab(tab, urls) {
  const u = urls || { mail:'https://temp-mail.org', login:'https://www.raccoongame.com/wap/dist/#/platform/login' };
  document.getElementById('lst-mail').classList.toggle('active', tab==='mail');
  document.getElementById('lst-login').classList.toggle('active', tab==='login');
  const raw = u[tab];
  document.getElementById('ls-frame').src = raw ? '/search?q=' + encodeURIComponent(raw) : 'about:blank';
}

function _closeLoginSetup() {
  document.getElementById('login-setup').classList.remove('open');
  setTimeout(() => { document.getElementById('ls-frame').src = 'about:blank'; }, 300);
}

function _launchCloudGame(gm) {
  _currentCloudGame = gm;
  _closeGameDetail();
  document.getElementById('cloud-game-title').textContent = gm.name;
  document.getElementById('cloud-frame').src = gm.url;
  document.getElementById('cloud-library').style.display = 'none';
  document.getElementById('cloud-player').style.display = 'flex';
  _incStat('games');
  _notify('Launching', gm.name + ' is loading...', 'ok');
  _playSound('success');
}

function _closeCloudGame() {
  document.getElementById('cloud-frame').src = 'about:blank';
  document.getElementById('cloud-player').style.display = 'none';
  document.getElementById('cloud-library').style.display = 'flex';
  _currentCloudGame = null;
}

function _openCloudExternal() {
  if (_currentCloudGame) window.open(_currentCloudGame.url, '_blank');
}

// MOVIES
const _SRCS = [
  {label:'VidSrc.to', base:'https://vidsrc.to/embed/movie/'},
  {label:'VidSrc.cc', base:'https://vidsrc.cc/v2/embed/movie/'},
  {label:'SuperEmbed',base:'https://multiembed.mov/directstream.php?video_id=', suffix:'&tmdb=1'},
  {label:'Embed.su',  base:'https://embed.su/embed/movie/'},
  {label:'2Embed',    base:'https://www.2embed.cc/embed/'},
];
let _mpSrc = 0, _mpId = null;

async function _tmdb(path) {
  const key = localStorage.getItem('ztmdb_key') || 'c4553a8a607744e346be50c1c33da705';
  if (key) {
    const sep = path.includes('?') ? '&' : '?';
    const r = await fetch('https://api.themoviedb.org/3' + path + sep + 'api_key=' + key);
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }
  const r = await fetch('/api/tmdb?path=' + encodeURIComponent(path));
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function _loadMovies() {
  const rows = [
    {title:'Trending This Week', path:'/trending/movie/week'},
    {title:'Top Rated',          path:'/movie/top_rated'},
    {title:'Now Playing',        path:'/movie/now_playing'},
    {title:'Action',             path:'/discover/movie?with_genres=28&sort_by=popularity.desc'},
  ];
  const el = document.getElementById('movie-rows');
  el.innerHTML = '<div style="color:var(--t3);padding:24px;text-align:center;font-size:13px">Loading movies...</div>';
  const parts = [];
  for (const row of rows) {
    try {
      const d = await _tmdb(row.path);
      if (!d.results || !d.results.length) continue;
      parts.push(`<div class="row-title">${row.title}</div><div class="movie-row">`);
      for (const m of d.results.slice(0,12)) {
        const poster = m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : '';
        const safe = (m.title||'').replace(/'/g, '&#39;');
        parts.push(`<div class="movie-card" onclick="_openMovie(${m.id},'${safe}')"><img src="${poster}" alt="${safe}" loading="lazy"><div class="movie-card-title">${m.title}</div></div>`);
      }
      parts.push('</div>');
    } catch {}
  }
  el.innerHTML = parts.join('') || '<div style="color:var(--t3);padding:24px;text-align:center;font-size:13px">Could not load movies</div>';
}

async function _movieSearch(q) {
  if (!q.trim()) return;
  try {
    const d = await _tmdb('/search/movie?query=' + encodeURIComponent(q));
    const el = document.getElementById('movie-rows');
    if (!d.results || !d.results.length) { el.innerHTML = '<div style="color:var(--t3);padding:24px;text-align:center">No results found</div>'; return; }
    const parts = [`<div class="row-title">Results for "${q}"</div><div class="movie-row">`];
    for (const m of d.results.slice(0,20)) {
      const poster = m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : '';
      const safe = (m.title||'').replace(/'/g, '&#39;');
      parts.push(`<div class="movie-card" onclick="_openMovie(${m.id},'${safe}')"><img src="${poster}" alt="${safe}" loading="lazy"><div class="movie-card-title">${m.title}</div></div>`);
    }
    parts.push('</div>');
    el.innerHTML = parts.join('');
  } catch {}
}

function _openMovie(id, title) {
  _mpId = id; _mpSrc = 0;
  document.getElementById('mp-title').textContent = title;
  _buildMpSrc();
  _loadMpFrame();
  document.getElementById('movie-player').classList.add('open');
  _incStat('movies');
  _notify('Now Playing', title, 'info');
}

function _buildMpSrc() {
  document.getElementById('mp-sources').innerHTML = _SRCS.map((s,i) =>
    `<button class="mp-src-btn${i===_mpSrc?' active':''}" onclick="_switchSrc(${i})">${s.label}</button>`
  ).join('');
}

function _switchSrc(i) { _mpSrc = i; _buildMpSrc(); _loadMpFrame(); }
function _loadMpFrame() { const s = _SRCS[_mpSrc]; document.getElementById('mp-frame').src = s.base + _mpId + (s.suffix||''); }
function _closeMovie() { document.getElementById('mp-frame').src = 'about:blank'; document.getElementById('movie-player').classList.remove('open'); }

// SPOTIFY
let _sp = {
  token: null, playing: false,
  shuffle: false, repeat: 'off',
  currentUri: null, currentId: null,
  deviceId: null, player: null,
  position: 0, duration: 0,
  liked: new Set(),
  queue: [], qi: 0,
  vol: 65, mutedVol: 65,
  contextUri: null,
};

function _spVerifier(n) {
  const a = new Uint8Array(n); crypto.getRandomValues(a);
  return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function _spChallenge(v) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
  return btoa(String.fromCharCode(...new Uint8Array(d))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

function _spLogin() {
  const verifier = _spVerifier(64);
  sessionStorage.setItem('sp_cv', verifier);
  _spChallenge(verifier).then(challenge => {
    const q = new URLSearchParams({
      response_type:'code', client_id:_CFG.SP_CLIENT_ID,
      scope:_CFG.SP_SCOPES, redirect_uri:_CFG.SP_REDIRECT,
      code_challenge_method:'S256', code_challenge:challenge,
    });
    window.open('https://accounts.spotify.com/authorize?'+q, '_blank');
    _toast('Log in to Spotify in the new tab, then return here');
  });
}

async function _spCheckCallback() {
  const p = new URLSearchParams(location.search);
  const code = p.get('code');
  if (!code) {
    const tok = localStorage.getItem('sp_token');
    const exp = +(localStorage.getItem('sp_token_exp')||0);
    if (tok && Date.now() < exp) { _sp.token = tok; _spReady(); }
    return;
  }
  history.replaceState({}, '', '/');
  const verifier = sessionStorage.getItem('sp_cv');
  if (!verifier) return;
  try {
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:_CFG.SP_REDIRECT,client_id:_CFG.SP_CLIENT_ID,code_verifier:verifier}),
    });
    const d = await r.json();
    if (d.access_token) {
      _sp.token = d.access_token;
      localStorage.setItem('sp_token', d.access_token);
      localStorage.setItem('sp_token_exp', Date.now() + d.expires_in * 1000);
      if (d.refresh_token) localStorage.setItem('sp_refresh', d.refresh_token);
      _spReady(); _tab('music');
    }
  } catch {}
}

function _spReady() {
  document.getElementById('sp-auth').style.display = 'none';
  document.getElementById('sp-player').style.display = 'flex';
  _spInitSDK();
  _spBuildLibrary();
  _spLoadTop();
  _notify('Spotify Connected', 'Library loading…', 'ok');
  _playSound('success');
}

async function _spApi(path, opts={}) {
  if (!_sp.token) return null;
  const r = await fetch('https://api.spotify.com/v1' + path, {
    ...opts, headers:{Authorization:'Bearer '+_sp.token,'Content-Type':'application/json',...(opts.headers||{})},
  });
  if (r.status === 401) { _sp.token = null; localStorage.removeItem('sp_token'); return null; }
  if (r.status === 204 || r.status === 202) return {};
  return r.json().catch(()=>({}));
}

// Web Playback SDK (Spotify Premium)
function _spInitSDK() {
  if (document.getElementById('sp-sdk')) return;
  window.onSpotifyWebPlaybackSDKReady = _spSDKReady;
  const s = document.createElement('script');
  s.id = 'sp-sdk'; s.src = 'https://sdk.scdn.co/spotify-player.js';
  document.head.appendChild(s);
}

function _spSDKReady() {
  _sp.player = new Spotify.Player({
    name: 'Zero',
    getOAuthToken: cb => cb(_sp.token),
    volume: _sp.vol / 100,
  });
  _sp.player.addListener('ready', ({device_id}) => {
    _sp.deviceId = device_id;
    _toast('Spotify Premium player ready');
  });
  _sp.player.addListener('not_ready', () => { _sp.deviceId = null; });
  _sp.player.addListener('player_state_changed', state => {
    if (!state) return;
    _spApplyState(state);
  });
  _sp.player.connect();
}

function _spApplyState(state) {
  const t = state.track_window?.current_track;
  if (!t) return;
  _sp.playing = !state.paused;
  _sp.position = state.position;
  _sp.duration = state.duration;
  _sp.shuffle = state.shuffle;
  _sp.repeat = ['off','context','track'][state.repeat_mode] || 'off';
  _sp.currentUri = t.uri;
  _sp.currentId = t.id;
  // Update bar
  document.getElementById('sp-now-title').textContent = t.name;
  document.getElementById('sp-now-artist').textContent = t.artists?.map(a=>a.name).join(', ') || '';
  document.getElementById('sp-now-art').src = t.album?.images?.[0]?.url || '';
  document.getElementById('sp-bar').classList.add('visible');
  document.getElementById('sp-dur').textContent = _spFmt(_sp.duration);
  document.getElementById('sp-seek').max = _sp.duration || 1000;
  document.getElementById('sp-shuffle-btn').classList.toggle('active', _sp.shuffle);
  document.getElementById('sp-repeat-btn').classList.toggle('active', _sp.repeat !== 'off');
  _spSyncBtn();
  _spHighlight(t.uri);
  _spCheckLiked(t.id);
  _spStartProgress();
}

let _spProgIv;
function _spStartProgress() {
  clearInterval(_spProgIv);
  _spProgIv = setInterval(() => {
    if (!_sp.playing) return;
    _sp.position = Math.min(_sp.position + 500, _sp.duration);
    const seek = document.getElementById('sp-seek');
    seek.value = _sp.position;
    document.getElementById('sp-pos').textContent = _spFmt(_sp.position);
  }, 500);
}

function _spFmt(ms) {
  if (!ms || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
}

function _spHighlight(uri) {
  document.querySelectorAll('.sp-track').forEach(el => {
    const isPlaying = el.dataset.uri === uri;
    el.classList.toggle('playing', isPlaying);
    const num = el.querySelector('.sp-track-num');
    if (num) num.textContent = isPlaying ? '▶' : (el.dataset.idx || '');
  });
}

// Library sidebar
async function _spBuildLibrary() {
  const el = document.getElementById('sp-lib-list');
  const statics = [
    {id:'top',    icon:'⭐', name:'Top Tracks',      sub:'Your most played'},
    {id:'liked',  icon:'💚', name:'Liked Songs',      sub:'Your saved tracks'},
    {id:'recent', icon:'🕐', name:'Recently Played',  sub:'Listening history'},
  ];
  el.innerHTML = statics.map(s =>
    `<div class="sp-lib-item" data-sid="${s.id}" onclick="_spLibSelect('${s.id}')">
      <div class="sp-lib-art">${s.icon}</div>
      <div><div class="sp-lib-name">${s.name}</div><div class="sp-lib-sub">${s.sub}</div></div>
    </div>`
  ).join('') + '<div style="height:1px;background:rgba(255,255,255,.05);margin:5px 0"></div>';
  // Load playlists
  const d = await _spApi('/me/playlists?limit=50');
  if (d?.items) {
    d.items.forEach(pl => {
      const div = document.createElement('div');
      div.className = 'sp-lib-item'; div.dataset.sid = pl.id;
      const img = pl.images?.[0]?.url || '';
      div.innerHTML = `<div class="sp-lib-art">${img ? `<img src="${img}" style="width:34px;height:34px;border-radius:5px;object-fit:cover">` : '🎵'}</div><div><div class="sp-lib-name">${pl.name}</div><div class="sp-lib-sub">${pl.tracks?.total||''} tracks</div></div>`;
      div.onclick = () => _spLoadPlaylist(pl.id, pl.name, pl.uri);
      el.appendChild(div);
    });
  }
}

function _spLibSelect(id) {
  document.querySelectorAll('.sp-lib-item').forEach(el => el.classList.toggle('active', el.dataset.sid === id));
  if (id === 'top') _spLoadTop();
  else if (id === 'liked') _spLoadLiked();
  else if (id === 'recent') _spLoadRecent();
}

async function _spLoadTop() {
  document.getElementById('sp-content-title').textContent = 'Top Tracks';
  const d = await _spApi('/me/top/tracks?limit=50');
  if (d?.items?.length) {
    _sp.queue = d.items; _sp.contextUri = null;
    document.getElementById('sp-content').innerHTML = d.items.map((t,i) => _spTrackHTML(t,i,null)).join('');
  } else {
    document.getElementById('sp-content').innerHTML = '<div style="color:var(--t3);padding:24px;text-align:center;font-size:13px">Search for music above to get started</div>';
  }
}

async function _spLoadLiked() {
  document.getElementById('sp-content-title').textContent = 'Liked Songs';
  document.querySelectorAll('.sp-lib-item').forEach(el => el.classList.toggle('active', el.dataset.sid === 'liked'));
  const d = await _spApi('/me/tracks?limit=50');
  if (d?.items) {
    const tracks = d.items.map(i => i.track).filter(Boolean);
    _sp.queue = tracks; _sp.contextUri = 'spotify:collection:tracks';
    document.getElementById('sp-content').innerHTML = tracks.map((t,i) => _spTrackHTML(t,i,null)).join('');
  }
}

async function _spLoadRecent() {
  document.getElementById('sp-content-title').textContent = 'Recently Played';
  document.querySelectorAll('.sp-lib-item').forEach(el => el.classList.toggle('active', el.dataset.sid === 'recent'));
  const d = await _spApi('/me/player/recently-played?limit=50');
  if (d?.items) {
    const tracks = d.items.map(i => i.track).filter(Boolean);
    _sp.queue = tracks; _sp.contextUri = null;
    document.getElementById('sp-content').innerHTML = tracks.map((t,i) => _spTrackHTML(t,i,null)).join('');
  }
}

async function _spLoadPlaylist(id, name, uri) {
  document.getElementById('sp-content-title').textContent = name || 'Playlist';
  document.querySelectorAll('.sp-lib-item').forEach(el => el.classList.toggle('active', el.dataset.sid === id));
  const d = await _spApi('/playlists/'+id+'/tracks?limit=100');
  if (d?.items) {
    const tracks = d.items.map(i => i.track).filter(Boolean);
    _sp.queue = tracks; _sp.contextUri = uri;
    document.getElementById('sp-content').innerHTML = tracks.map((t,i) => _spTrackHTML(t,i,uri)).join('');
  }
}

function _spTrackHTML(t, i, ctxUri) {
  if (!t) return '';
  const art = t.album?.images?.[0]?.url || '';
  const artist = t.artists?.map(a=>a.name).join(', ') || '';
  const uri = t.uri || '';
  const ctx = ctxUri || '';
  return `<div class="sp-track" data-uri="${uri}" data-idx="${i+1}" onclick="_spPlayByUri('${uri.replace(/'/g,"\\'")}','${ctx.replace(/'/g,"\\'")}')">
    <span class="sp-track-num">${i+1}</span>
    <img class="sp-track-art" src="${art}" alt="" loading="lazy">
    <div class="sp-track-info"><div class="sp-track-name">${t.name}</div><div class="sp-track-artist">${artist}</div></div>
    <div class="sp-track-dur">${_spFmt(t.duration_ms)}</div>
    <button class="sp-track-like${_sp.liked.has(t.id)?' liked':''}" onclick="event.stopPropagation();_spLikeTrack('${t.id}',this)" title="Save"><svg width="13" height="13" viewBox="0 0 24 24" fill="${_sp.liked.has(t.id)?'#1db954':'none'}" stroke="${_sp.liked.has(t.id)?'#1db954':'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
    <button class="sp-track-add" onclick="event.stopPropagation();_spAddQueue('${uri.replace(/'/g,"\\'")}',this)" title="Add to queue"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
  </div>`;
}

async function _spPlayByUri(uri, ctxUri) {
  if (!_sp.token) return;
  // Find in queue for fallback
  const qi = _sp.queue.findIndex(t => t.uri === uri);
  if (_sp.deviceId) {
    const body = ctxUri ? {context_uri:ctxUri, offset:{uri}} : {uris:[uri]};
    await _spApi('/me/player/play?device_id='+_sp.deviceId, {method:'PUT', body:JSON.stringify(body)});
    _sp.playing = true; _spSyncBtn(); _spHideEmbed();
  } else {
    // Preview fallback
    if (qi >= 0) _spPlayPreview(qi);
    else _toast('Spotify Premium required for full playback');
  }
}

function _spPlayPreview(i) {
  _sp.qi = i;
  const t = _sp.queue[i]; if (!t) return;
  _sp.currentUri = t.uri; _sp.currentId = t.id;
  _sp.duration = t.duration_ms || 30000;
  document.getElementById('sp-now-title').textContent = t.name;
  document.getElementById('sp-now-artist').textContent = t.artists?.map(a=>a.name).join(', ') || '';
  document.getElementById('sp-now-art').src = t.album?.images?.[0]?.url || '';
  document.getElementById('sp-bar').classList.add('visible');
  document.getElementById('sp-dur').textContent = _spFmt(_sp.duration);
  document.getElementById('sp-seek').max = _sp.duration;
  _spHighlight(t.uri); _spCheckLiked(t.id);
  if (window._spAudio) { window._spAudio.pause(); window._spAudio = null; }
  if (t.preview_url) {
    window._spAudio = new Audio(t.preview_url);
    window._spAudio.volume = _sp.vol / 100;
    window._spAudio.play().catch(()=>{});
    window._spAudio.ontimeupdate = () => {
      _sp.position = (window._spAudio.currentTime * 1000)|0;
      document.getElementById('sp-seek').value = _sp.position;
      document.getElementById('sp-pos').textContent = _spFmt(_sp.position);
    };
    window._spAudio.onended = () => {
      if (_sp.shuffle) _spPlayPreview(Math.floor(Math.random()*_sp.queue.length));
      else if (_sp.repeat === 'track') _spPlayPreview(i);
      else _spPlayPreview((_sp.qi+1)%Math.max(_sp.queue.length,1));
    };
    _sp.playing = true; _spSyncBtn();
    _spStartProgress();
    _spHideEmbed();
  } else {
    // Spotify removed preview_url for most tracks — use Spotify embed player
    _spShowEmbed(t.id);
    _sp.playing = true; _spSyncBtn();
  }
}

async function _spCtrl(action) {
  if (_sp.player && _sp.deviceId) {
    if (action === 'toggle') await _sp.player.togglePlay();
    else if (action === 'next') { clearInterval(_spProgIv); await _sp.player.nextTrack(); }
    else if (action === 'prev') { clearInterval(_spProgIv); await _sp.player.previousTrack(); }
  } else {
    if (action === 'toggle') {
      if (!window._spAudio) { if (_sp.queue.length) _spPlayPreview(_sp.qi); return; }
      _sp.playing ? window._spAudio.pause() : window._spAudio.play().catch(()=>{});
      _sp.playing = !_sp.playing; _spSyncBtn();
    } else if (action === 'next') {
      const next = _sp.shuffle
        ? Math.floor(Math.random()*_sp.queue.length)
        : (_sp.qi+1)%Math.max(_sp.queue.length,1);
      _spPlayPreview(next);
    } else if (action === 'prev') {
      if (_sp.position > 3000) { _spSeek(0); return; }
      _spPlayPreview((_sp.qi-1+Math.max(_sp.queue.length,1))%Math.max(_sp.queue.length,1));
    }
  }
}

function _spPlayAll(shuffle) {
  if (!_sp.queue.length) return;
  _sp.shuffle = shuffle;
  document.getElementById('sp-shuffle-btn').classList.toggle('active', shuffle);
  const idx = shuffle ? Math.floor(Math.random() * _sp.queue.length) : 0;
  if (_sp.deviceId && _sp.contextUri) {
    _spPlayByUri(_sp.queue[idx].uri, _sp.contextUri);
  } else {
    _spPlayPreview(idx);
  }
}

async function _spShuffle() {
  _sp.shuffle = !_sp.shuffle;
  document.getElementById('sp-shuffle-btn').classList.toggle('active', _sp.shuffle);
  if (_sp.deviceId) await _spApi('/me/player/shuffle?state='+_sp.shuffle, {method:'PUT'});
  _toast(_sp.shuffle ? 'Shuffle on' : 'Shuffle off');
}

async function _spRepeat() {
  const modes = ['off','context','track'];
  _sp.repeat = modes[(modes.indexOf(_sp.repeat)+1)%3];
  const btn = document.getElementById('sp-repeat-btn');
  btn.classList.toggle('active', _sp.repeat !== 'off');
  btn.classList.toggle('sp-repeat-1', _sp.repeat === 'track');
  if (_sp.deviceId) await _spApi('/me/player/repeat?state='+_sp.repeat, {method:'PUT'});
  _toast('Repeat: ' + _sp.repeat);
}

async function _spSeek(v) {
  const ms = parseInt(v);
  _sp.position = ms;
  document.getElementById('sp-pos').textContent = _spFmt(ms);
  if (_sp.player && _sp.deviceId) await _sp.player.seek(ms);
  else if (window._spAudio) window._spAudio.currentTime = ms / 1000;
}

async function _spVol(v) {
  _sp.vol = parseInt(v);
  if (_sp.player) await _sp.player.setVolume(_sp.vol / 100);
  if (window._spAudio) window._spAudio.volume = _sp.vol / 100;
  const icon = document.getElementById('sp-vol-icon');
  if (_sp.vol === 0) icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>';
  else icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>';
}

function _spMute() {
  if (_sp.vol > 0) { _sp.mutedVol = _sp.vol; _spVol(0); document.getElementById('sp-vol').value = 0; }
  else { _spVol(_sp.mutedVol); document.getElementById('sp-vol').value = _sp.mutedVol; }
}

async function _spCheckLiked(id) {
  if (!id) return;
  const d = await _spApi('/me/tracks/contains?ids='+id);
  const isLiked = d && d[0];
  if (isLiked) _sp.liked.add(id); else _sp.liked.delete(id);
  document.getElementById('sp-like-btn').classList.toggle('liked', !!isLiked);
}

async function _spToggleLike() {
  const id = _sp.currentId; if (!id) return;
  const isLiked = _sp.liked.has(id);
  if (isLiked) { await _spApi('/me/tracks?ids='+id, {method:'DELETE'}); _sp.liked.delete(id); }
  else { await _spApi('/me/tracks', {method:'PUT', body:JSON.stringify({ids:[id]})}); _sp.liked.add(id); }
  document.getElementById('sp-like-btn').classList.toggle('liked', !isLiked);
  _toast(isLiked ? 'Removed from Liked Songs' : 'Saved to Liked Songs');
}

async function _spLikeTrack(id, btn) {
  const isLiked = _sp.liked.has(id);
  if (isLiked) { await _spApi('/me/tracks?ids='+id, {method:'DELETE'}); _sp.liked.delete(id); btn.classList.remove('liked'); }
  else { await _spApi('/me/tracks', {method:'PUT', body:JSON.stringify({ids:[id]})}); _sp.liked.add(id); btn.classList.add('liked'); }
  _toast(isLiked ? 'Removed from Liked Songs' : 'Saved to Liked Songs');
}

async function _spAddQueue(uri, btn) {
  if (_sp.deviceId) {
    await _spApi('/me/player/queue?uri='+encodeURIComponent(uri), {method:'POST'});
    _toast('Added to queue');
  } else {
    const idx = _sp.queue.findIndex(t => t.uri === uri);
    if (idx >= 0) { const t = _sp.queue.splice(idx,1)[0]; _sp.queue.splice(_sp.qi+1,0,t); _toast('Added next in queue'); }
  }
}

async function _spSearch(q) {
  if (!q.trim()) return;
  document.getElementById('sp-content-title').textContent = 'Search: ' + q;
  document.querySelectorAll('.sp-lib-item').forEach(el => el.classList.remove('active'));
  const d = await _spApi('/search?q='+encodeURIComponent(q)+'&type=track&limit=30');
  if (!d?.tracks?.items) return;
  _sp.queue = d.tracks.items; _sp.contextUri = null;
  document.getElementById('sp-content').innerHTML = d.tracks.items.map((t,i) => _spTrackHTML(t,i,null)).join('');
}

function _spSyncBtn() {
  document.getElementById('sp-play-icon').innerHTML = _sp.playing
    ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
}

function _spShowEmbed(trackId) {
  const bar = document.getElementById('sp-embed-bar');
  const frame = document.getElementById('sp-embed-frame');
  frame.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1`;
  bar.style.display = 'block';
}

function _spHideEmbed() {
  const bar = document.getElementById('sp-embed-bar');
  if (bar) { bar.style.display = 'none'; document.getElementById('sp-embed-frame').src = 'about:blank'; }
}

// INNER BROWSER
function _openInApp(url) {
  document.getElementById('ib-frame').src = _uvUrl(url);
  document.getElementById('ib-url-bar').textContent = url;
  document.getElementById('inner-browser').classList.add('open');
  _ibHistory = _ibHistory.slice(0, _ibHi + 1);
  _ibHistory.push(url);
  _ibHi = _ibHistory.length - 1;
}

function _ibBack() {
  if (_ibHi > 0) { _ibHi--; const u = _ibHistory[_ibHi]; document.getElementById('ib-frame').src = _uvUrl(u); document.getElementById('ib-url-bar').textContent = u; }
}
function _ibFwd() {
  if (_ibHi < _ibHistory.length - 1) { _ibHi++; const u = _ibHistory[_ibHi]; document.getElementById('ib-frame').src = _uvUrl(u); document.getElementById('ib-url-bar').textContent = u; }
}
function _ibReload() { const f = document.getElementById('ib-frame'); const s = f.src; f.src = 'about:blank'; setTimeout(()=>{ f.src = s; }, 50); }
function _ibClose() { document.getElementById('ib-frame').src = 'about:blank'; document.getElementById('inner-browser').classList.remove('open'); }

// ── SOUND ENGINE ─────────────────────────────────────────────────────────────
let _audioCtx;
function _ac() { if (!_audioCtx) _audioCtx = new (window.AudioContext||window.webkitAudioContext)(); return _audioCtx; }

function _playSound(type) {
  try {
    const ac = _ac();
    const g = ac.createGain();
    g.connect(ac.destination);
    const o = ac.createOscillator();
    o.connect(g);
    if (type === 'notif') {
      g.gain.setValueAtTime(0.18, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
      o.frequency.setValueAtTime(880, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(1100, ac.currentTime + 0.1);
      o.type = 'sine';
      o.start(ac.currentTime); o.stop(ac.currentTime + 0.4);
    } else if (type === 'success') {
      g.gain.setValueAtTime(0.15, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
      o.frequency.setValueAtTime(660, ac.currentTime);
      o.frequency.setValueAtTime(880, ac.currentTime + 0.15);
      o.frequency.setValueAtTime(1100, ac.currentTime + 0.3);
      o.type = 'sine';
      o.start(ac.currentTime); o.stop(ac.currentTime + 0.5);
    } else if (type === 'error') {
      g.gain.setValueAtTime(0.2, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
      o.frequency.setValueAtTime(200, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(100, ac.currentTime + 0.3);
      o.type = 'sawtooth';
      o.start(ac.currentTime); o.stop(ac.currentTime + 0.3);
    } else if (type === 'click') {
      g.gain.setValueAtTime(0.08, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
      o.frequency.setValueAtTime(1400, ac.currentTime);
      o.type = 'square';
      o.start(ac.currentTime); o.stop(ac.currentTime + 0.1);
    }
  } catch {}
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
let _notifs = [];

function _toggleNotif() {
  const p = document.getElementById('notif-panel');
  const isOpen = p.classList.contains('open');
  if (isOpen) {
    p.classList.remove('open');
  } else {
    p.classList.add('open');
    document.getElementById('notif-badge').classList.remove('show');
  }
}

document.addEventListener('click', e => {
  const p = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (p.classList.contains('open') && !p.contains(e.target) && !btn.contains(e.target)) {
    p.classList.remove('open');
  }
});

function _notify(title, msg, type='info') {
  const ts = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const n = {title, msg, type, ts, id: Date.now()};
  _notifs.unshift(n);
  if (_notifs.length > 20) _notifs.pop();
  _renderNotifs();
  document.getElementById('notif-badge').classList.add('show');
  _playSound('notif');
  _toast(title + ' — ' + msg);
}

function _clearNotifs() {
  _notifs = [];
  _renderNotifs();
  document.getElementById('notif-badge').classList.remove('show');
}

const _notifIcons = {
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  ok:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  err:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
};

function _renderNotifs() {
  const list = document.getElementById('notif-list');
  if (!_notifs.length) { list.innerHTML = '<div id="notif-empty">No notifications</div>'; return; }
  list.innerHTML = _notifs.map(n => `
    <div class="notif-item">
      <div class="notif-icon ${n.type}">${_notifIcons[n.type]||_notifIcons.info}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-time">${n.ts}</div>
      </div>
    </div>`).join('');
}

// ── HOSTING / PROXY MANAGER ───────────────────────────────────────────────────

function _loadHosts() {
  try { _hosts = JSON.parse(localStorage.getItem('zhosts') || '[]'); } catch { _hosts = []; }
  if (!_hosts.find(h => h.id === 'direct')) {
    _hosts.unshift({id:'direct', name:'Direct Connection', url:'', ping:0});
  }
}

function _saveHosts() {
  const toSave = _hosts.filter(h => h.id !== 'direct');
  localStorage.setItem('zhosts', JSON.stringify(toSave));
}

function _openHostModal() {
  _loadHosts();
  _renderHostList();
  document.getElementById('host-modal').classList.add('open');
}

function _closeHostModal() { document.getElementById('host-modal').classList.remove('open'); }

document.getElementById('host-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('host-modal')) _closeHostModal();
});

function _renderHostList() {
  const el = document.getElementById('host-list');
  el.innerHTML = _hosts.map((h, i) => {
    const col = h.ping === 0 ? '#4caf50' : h.ping < 150 ? '#4caf50' : h.ping < 400 ? '#ff9800' : '#f44336';
    const isActive = _activeServer === i;
    return `<div class="host-item${isActive?' active-host':''}">
      <div class="host-dot" style="background:${col}"></div>
      <div class="host-info">
        <div class="host-name">${h.name}</div>
        <div class="host-url">${h.url || 'No proxy — direct'}</div>
      </div>
      <div class="host-ping">${h.ping > 0 ? h.ping+'ms' : '—'}</div>
      <div class="host-actions">
        ${!isActive ? `<button class="host-use-btn" onclick="_useHost(${i})">Use</button>` : '<span style="font-size:11px;color:var(--t2)">Active</span>'}
        <button class="host-test-btn" onclick="_testHost(${i})">Test</button>
        ${h.id !== 'direct' ? `<button class="host-del-btn" onclick="_delHost(${i})">&#10005;</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function _useHost(i) {
  _activeServer = i;
  const h = _hosts[i];
  document.getElementById('srv-label').textContent = h.name.split(' ')[0];
  _renderHostList();
  _updateSrvDot();
  _notify('Server Changed', 'Now using ' + h.name, 'ok');
  _playSound('success');
  _closeHostModal();
}

async function _testHost(i) {
  const h = _hosts[i];
  const btn = document.querySelectorAll('.host-test-btn')[i];
  if (btn) btn.textContent = '...';
  try {
    const t0 = Date.now();
    if (h.url) {
      await fetch('/api/status', {headers:{'X-Api-Key':'changeme-secret'}});
    } else {
      await fetch('/api/status', {headers:{'X-Api-Key':'changeme-secret'}});
    }
    h.ping = Date.now() - t0;
    _notify('Ping Result', h.name + ': ' + h.ping + 'ms', h.ping < 200 ? 'ok' : 'warn');
  } catch {
    h.ping = 9999;
    _notify('Ping Failed', h.name + ' is unreachable', 'err');
    _playSound('error');
  }
  _saveHosts();
  _renderHostList();
  _updateSrvDot();
}

function _addHost() {
  const name = document.getElementById('host-add-name').value.trim();
  const url  = document.getElementById('host-add-url').value.trim();
  if (!url) { _toast('Enter a URL'); return; }
  if (!/^https?:\/\//i.test(url)) { _toast('URL must start with http:// or https://'); return; }
  _hosts.push({id: 'h' + Date.now(), name: name || new URL(url).hostname, url, ping: 0});
  _saveHosts();
  document.getElementById('host-add-name').value = '';
  document.getElementById('host-add-url').value = '';
  _renderHostList();
  _notify('Server Added', (name || url) + ' added to your list', 'ok');
}

function _delHost(i) {
  const h = _hosts[i];
  if (h.id === 'direct') return;
  if (_activeServer === i) _activeServer = 0;
  _hosts.splice(i, 1);
  _saveHosts();
  _renderHostList();
  _toast('Removed ' + h.name);
}

function _bulkImportHosts() {
  const raw = document.getElementById('host-bulk').value.trim();
  if (!raw) return;
  let added = 0;
  raw.split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    let name = '', url = '';
    if (line.includes('|')) { [name, url] = line.split('|').map(s => s.trim()); }
    else { url = line; }
    if (!/^https?:\/\//i.test(url)) return;
    _hosts.push({id: 'h' + Date.now() + Math.random(), name: name || new URL(url).hostname, url, ping: 0});
    added++;
  });
  _saveHosts();
  document.getElementById('host-bulk').value = '';
  _renderHostList();
  _notify('Import Complete', added + ' server' + (added===1?'':'s') + ' imported', 'ok');
}

async function _pingServers() {
  _loadHosts();
  try {
    const t0 = Date.now();
    await fetch('https://balanced-amazement-production-c715.up.railway.app/', {mode: 'no-cors'});
    const ping = Date.now() - t0;
    document.getElementById('srv-dot').className = 'srv-dot' + (ping < 300 ? '' : ping < 700 ? ' mid' : ' bad');
    document.getElementById('srv-label').textContent = ping + 'ms';
    return;
  } catch {}
  document.getElementById('srv-dot').className = 'srv-dot bad';
  document.getElementById('srv-label').textContent = 'Offline';
}

function _updateSrvDot() {
  const h = _hosts[_activeServer] || _hosts[0];
  const p = h ? h.ping : 0;
  const dot = document.getElementById('srv-dot');
  dot.className = 'srv-dot' + (p === 0 || p < 200 ? '' : p < 500 ? ' mid' : ' bad');
}

// PROFILE
function _getProf() { try { return JSON.parse(localStorage.getItem('zprof')||'{}'); } catch { return {}; } }
function _saveProf(p) { localStorage.setItem('zprof', JSON.stringify(p)); }

function _loadProfile() {
  const p = _getProf();
  document.getElementById('prof-name-display').textContent = p.name || 'Anonymous';
  document.getElementById('prof-handle-display').textContent = p.handle || '@user';
  document.getElementById('prof-name-inp').value = p.name || '';
  document.getElementById('prof-handle-inp').value = p.handle || '';
  document.getElementById('prof-bio-inp').value = p.bio || '';
  if (p.avatar) document.getElementById('prof-avatar-img').src = p.avatar;
  if (p.banner) { const img = document.getElementById('prof-banner-img'); img.src = p.banner; img.style.display = 'block'; }
}

function _saveProfile() {
  const p = _getProf();
  p.name   = document.getElementById('prof-name-inp').value.trim() || p.name;
  p.handle = document.getElementById('prof-handle-inp').value.trim() || p.handle;
  p.bio    = document.getElementById('prof-bio-inp').value.trim();
  _saveProf(p); _loadProfile(); _toast('Profile saved');
}

function _pickAvatar() {
  const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { const p = _getProf(); p.avatar = ev.target.result; _saveProf(p); document.getElementById('prof-avatar-img').src = p.avatar; };
    r.readAsDataURL(f);
  }; inp.click();
}

function _pickBanner() {
  const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const p = _getProf(); p.banner = ev.target.result; _saveProf(p);
      const img = document.getElementById('prof-banner-img'); img.src = p.banner; img.style.display = 'block';
    }; r.readAsDataURL(f);
  }; inp.click();
}

// STATS
function _getStats() { try { return JSON.parse(localStorage.getItem('zstats')||'{}'); } catch { return {}; } }
function _incStat(k) { const s = _getStats(); s[k] = (s[k]||0) + 1; localStorage.setItem('zstats', JSON.stringify(s)); }
function _loadStats() {
  const s = _getStats();
  document.getElementById('stat-sess').textContent   = s.sessions||0;
  document.getElementById('stat-movies').textContent = s.movies||0;
  document.getElementById('stat-games').textContent  = s.games||0;
}

// SETTINGS
function _loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('zsett')||'{}');
    if (s.se) _seEngine = s.se;
    if (s.cloakEnabled && s.cloakTitle) document.title = s.cloakTitle;
    // defer DOM updates since DOM may not be ready yet
    requestAnimationFrame(() => {
      if (s.cloakEnabled) document.getElementById('tog-cloak')?.classList.add('on');
      if (s.cloakTitle) { const e = document.getElementById('cloak-title'); if(e) e.value = s.cloakTitle; }
      if (s.panicKey) { const e = document.getElementById('panic-key'); if(e) e.value = s.panicKey; }
      if (s.panicUrl) { const e = document.getElementById('panic-url'); if(e) e.value = s.panicUrl; }
      if (s.se) { const e = document.getElementById('se-pick'); if(e) e.value = s.se; }
      if (s.xhEnabled) document.getElementById('tog-xh')?.classList.add('on');
      if (s.xhStyle) { const e = document.getElementById('xh-style'); if(e) e.value = s.xhStyle; }
      if (s.xhColor) { const e = document.getElementById('xh-color'); if(e) e.value = s.xhColor; }
      if (s.xhSize) { const e = document.getElementById('xh-size'); if(e) e.value = s.xhSize; }
      // API keys
      const tmdbKey = localStorage.getItem('ztmdb_key');
      const tmdbEl = document.getElementById('tmdb-key-inp'); if(tmdbEl && tmdbKey) tmdbEl.value = tmdbKey;
      const spRed = localStorage.getItem('sp_redirect');
      const spEl = document.getElementById('sp-redirect'); if(spEl && spRed) spEl.value = spRed;
      else if (spEl) spEl.placeholder = location.origin + '/callback';
      // Accent / blur
      const acc = localStorage.getItem('zaccent'); if(acc){ document.documentElement.style.setProperty('--t0',acc); const ae=document.getElementById('accent-color'); if(ae)ae.value=acc; }
      const blr = localStorage.getItem('zblur'); if(blr){ document.documentElement.style.setProperty('--blur',blr+'px'); const be=document.getElementById('blur-amount'); if(be)be.value=blr; }
    });
  } catch {}
}

function _readSett() {
  return {
    cloakEnabled: document.getElementById('tog-cloak').classList.contains('on'),
    cloakTitle: document.getElementById('cloak-title').value,
    panicKey: document.getElementById('panic-key').value,
    panicUrl: document.getElementById('panic-url').value,
    se: document.getElementById('se-pick').value,
    xhEnabled: document.getElementById('tog-xh').classList.contains('on'),
    xhStyle: document.getElementById('xh-style').value,
    xhColor: document.getElementById('xh-color').value,
    xhSize: document.getElementById('xh-size').value,
  };
}

function _togCloak(btn) { btn.classList.toggle('on'); _applyCloak(); }
function _applyCloak() {
  const s = _readSett(); localStorage.setItem('zsett', JSON.stringify(s));
  document.title = (s.cloakEnabled && s.cloakTitle) ? s.cloakTitle : 'Zero';
}
function _savePanic() { localStorage.setItem('zsett', JSON.stringify(_readSett())); }
function _saveSE() {
  _seEngine = document.getElementById('se-pick').value;
  localStorage.setItem('zsett', JSON.stringify(_readSett()));
}
function _saveTmdbKey() {
  const v = document.getElementById('tmdb-key-inp').value.trim();
  if (v) { localStorage.setItem('ztmdb_key', v); _loadMovies(); _toast('TMDB key saved — loading movies'); }
  else localStorage.removeItem('ztmdb_key');
}
function _saveSPRedirect() {
  const v = document.getElementById('sp-redirect').value.trim();
  if (v) localStorage.setItem('sp_redirect', v);
  else localStorage.removeItem('sp_redirect');
  const cur = document.getElementById('sp-redirect-cur');
  if (cur) cur.textContent = localStorage.getItem('sp_redirect') || (location.origin + '/callback');
}
function _saveAccent() {
  const v = document.getElementById('accent-color').value;
  document.documentElement.style.setProperty('--t0', v);
  localStorage.setItem('zaccent', v);
}
function _saveBlur() {
  const v = document.getElementById('blur-amount').value;
  document.documentElement.style.setProperty('--blur', v + 'px');
  localStorage.setItem('zblur', v);
}

// API KEY
function _getApiKey() { return localStorage.getItem('z_api_key') || 'changeme-secret'; }
function _rotateApiKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const key = Array.from({length:32}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
  localStorage.setItem('z_api_key', key);
  const el = document.getElementById('set-api-key-display');
  if (el) el.textContent = key.slice(0,8) + '••••••••••••••••' + key.slice(-4);
  _toast('API key rotated — update server botconfig.json');
}
function _copyApiKey() {
  navigator.clipboard.writeText(_getApiKey()).then(() => _toast('API key copied'));
}
function _loadApiKeyDisplay() {
  const k = _getApiKey();
  const el = document.getElementById('set-api-key-display');
  if (el) el.textContent = k.slice(0,8) + '••••••••••••••••' + k.slice(-4);
}

// CROSSHAIR
let _xhTracking = false;
function _xhMove(e) {
  document.getElementById('crosshair').style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
}
function _applyXH() {
  const xh = document.getElementById('crosshair');
  const s = JSON.parse(localStorage.getItem('zsett')||'{}');
  if (!s.xhEnabled) {
    xh.style.display = 'none';
    document.body.classList.remove('xh-active');
    if (_xhTracking) { document.removeEventListener('mousemove', _xhMove); _xhTracking = false; }
    return;
  }
  xh.style.display = 'block';
  xh.className = s.xhStyle || '';
  xh.style.setProperty('--xh-color', s.xhColor || 'rgba(255,255,255,.9)');
  xh.style.setProperty('--xh-size', (s.xhSize || 14) + 'px');
  document.body.classList.add('xh-active');
  if (!_xhTracking) { document.addEventListener('mousemove', _xhMove, {passive:true}); _xhTracking = true; }
}
function _togXH(btn) { btn.classList.toggle('on'); _saveXH(); }
function _saveXH() {
  const s = _readSett();
  localStorage.setItem('zsett', JSON.stringify(s));
  _applyXH();
}
function _loadXH() {
  const s = JSON.parse(localStorage.getItem('zsett')||'{}');
  if (s.xhEnabled) document.getElementById('tog-xh').classList.add('on');
  if (s.xhStyle) document.getElementById('xh-style').value = s.xhStyle;
  if (s.xhColor) document.getElementById('xh-color').value = s.xhColor;
  if (s.xhSize) document.getElementById('xh-size').value = s.xhSize;
  _applyXH();
}

// PANIC + ANTI-DEVTOOLS
document.addEventListener('keydown', e => {
  try {
    const s = JSON.parse(localStorage.getItem('zsett')||'{}');
    const pk = s.panicKey || 'F1';
    if (e.key === pk && pk !== 'Escape') location.replace(s.panicUrl || 'https://classroom.google.com');
  } catch {}
  if (e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key))||(e.ctrlKey&&e.key==='U')) e.preventDefault();
});
document.addEventListener('contextmenu', e => e.preventDefault());

// TOAST
let _toastTimer;
function _toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

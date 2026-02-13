export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  fav?: boolean;
  cover: string;
  lyrics: string[];
}

export const playlist: Song[] = [
  { id: 1, title: "Hard to Love", artist: "Crying City", album: "Hard to Love", genre: "Alternative", duration: "3:08", fav: true, cover: "🎸", lyrics: ["I know I'm hard to love", "But you keep coming back", "Every time I push away", "You pull me closer still"] },
  { id: 2, title: "Nervous", artist: "Crying City", album: "Nervous", genre: "Rock", duration: "2:10", cover: "🎤", lyrics: ["I get so nervous", "When you're around", "My heart is racing", "Can't slow it down"] },
  { id: 3, title: "Buy My Lies", artist: "Crying City", album: "Buy My Lies", genre: "Alternative", duration: "3:32", fav: true, cover: "🌙", lyrics: ["Would you buy my lies", "If I sold them cheap", "Would you close your eyes", "And fall asleep"] },
  { id: 4, title: "Cologne", artist: "beabadoobee", album: "Our Extended Play", genre: "Alternative", duration: "2:45", fav: true, cover: "🌸", lyrics: ["I still smell your cologne", "On my pillowcase", "Every memory of you", "I can't erase"] },
  { id: 5, title: "Sienna", artist: "The Marías", album: "Submarine", genre: "Alternative", duration: "3:45", fav: true, cover: "🚗", lyrics: ["Sienna, you're a dream", "Floating through my mind", "Colors I have never seen", "Leaving me behind"] },
  { id: 6, title: "might start singing", artist: "sheldon charlot", album: "might start singing", genre: "R&B/Soul", duration: "2:07", cover: "🎵", lyrics: ["I might start singing", "Out of the blue", "Can't help this feeling", "When I'm with you"] },
  { id: 7, title: "I Hear a Symphony", artist: "Cody Fry", album: "Flying", genre: "Singer/Songwriter", duration: "3:05", cover: "🎻", lyrics: ["I hear a symphony", "Every time you speak", "A melody so beautiful", "It makes me weak"] },
  { id: 8, title: "My Love Mine All Mine", artist: "Mitski", album: "The Land Is Inhospitable", genre: "Alternative", duration: "2:18", cover: "💫", lyrics: ["My love mine all mine", "Nothing in this world belongs to me", "But my love mine all mine", "All mine"] },
  { id: 9, title: "Glue Song", artist: "beabadoobee", album: "Glue Song", genre: "Alternative", duration: "2:15", cover: "🩹", lyrics: ["You're the one", "That I want at the end", "You're the one", "My forever friend"] },
  { id: 10, title: "Urn", artist: "Crying City", album: "You're Still The Light", genre: "Alternative", duration: "3:23", fav: true, cover: "✨", lyrics: ["You're still the light", "When everything goes dark", "You're still the fire", "That burns within my heart"] },
  { id: 11, title: "505", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", genre: "Alternative", duration: "4:14", cover: "🌃", lyrics: ["I'm going back to 505", "If it's a seven hour flight", "Or a forty-five minute drive", "In my imagination"] },
  { id: 12, title: "Song on the Beach", artist: "Arcade Fire", album: "Her (Score)", genre: "Soundtrack", duration: "3:36", fav: true, cover: "🏖️", lyrics: ["~instrumental~", "The waves crash softly", "On the shore tonight", "Everything feels right"] },
  { id: 13, title: "Line Without a Hook", artist: "Ricky Montgomery", album: "Montgomery Ricky", genre: "Pop", duration: "4:10", cover: "🎣", lyrics: ["Oh baby I am a wreck", "When I'm without you", "I need you here to stay", "I broke all my bones that day"] },
  { id: 14, title: "anything", artist: "Adrianne Lenker", album: "songs", genre: "Alternative", duration: "3:22", cover: "🍂", lyrics: ["I wanna walk with you", "Through the leaves falling", "I wanna be with you", "Through anything at all"] },
  { id: 15, title: "Instagram", artist: "DEAN", album: "Instagram", genre: "Alternative", duration: "4:16", fav: true, cover: "📱", lyrics: ["인스타그램", "스크롤을 내려", "Everyone looks happy", "But I'm feeling lonely"] },
  { id: 16, title: "Worship", artist: "Ari Abdul", album: "Worship", genre: "Alternative", duration: "2:43", cover: "🕯️", lyrics: ["I would worship you", "If you let me", "Fall down at your feet", "Please don't forget me"] },
  { id: 17, title: "Kicking Cars", artist: "Panchiko", album: "D>E>A>T>H>M>E>T>A>L", genre: "Alternative", duration: "3:12", cover: "🚙", lyrics: ["Kicking cars", "In the parking lot", "Under stars", "Feeling lost"] },
  { id: 18, title: "The Beach", artist: "The Neighbourhood", album: "Wiped Out!", genre: "Alternative", duration: "4:02", cover: "🌊", lyrics: ["If I told you that I loved you", "Tell me what would you say", "If I told you that I hated this", "Would you go away"] },
  { id: 19, title: "See you soon", artist: "Wisp", album: "Pandora", genre: "Alternative", duration: "2:48", cover: "👋", lyrics: ["See you soon", "Under the moon", "In my dreams", "Nothing's as it seems"] },
  { id: 20, title: "Pandora", artist: "Wisp", album: "Pandora", genre: "Alternative", duration: "3:15", cover: "📦", lyrics: ["Open up the box", "Let the demons free", "Pandora's curse", "Is haunting me"] },
  { id: 21, title: "Flatline", artist: "Justin Bieber", album: "Journals", genre: "Pop", duration: "3:01", cover: "💔", lyrics: ["My heart goes flatline", "When you walk away", "Bring me back to life", "Please don't leave me this way"] },
  { id: 22, title: "What You Need", artist: "The Weeknd", album: "House Of Balloons", genre: "R&B/Soul", duration: "3:30", cover: "🎈", lyrics: ["I got what you need", "Baby come to me", "Let me be the one", "To set your heart free"] },
  { id: 23, title: "Cry", artist: "Cigarettes After Sex", album: "Cry", genre: "Alternative", duration: "4:17", cover: "🥀", lyrics: ["I just wanna be yours", "I just want to feel you close", "Hold me while I cry", "Don't let me go"] },
  { id: 24, title: "Avalon", artist: "Zeruel", album: "Avalon", genre: "Alternative", duration: "3:44", cover: "⚔️", lyrics: ["Take me to Avalon", "Where the legends sleep", "In the mist and fog", "Secrets we will keep"] },
];

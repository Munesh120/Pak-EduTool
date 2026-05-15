(function() {
    console.log('Chatbot widget initializing...');


function levenshteinDistance(a, b) {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j-1] === b[i-1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i-1][j] + 1,        // deletion
                matrix[i][j-1] + 1,        // insertion
                matrix[i-1][j-1] + cost    // substitution
            );
        }
    }
    return matrix[b.length][a.length];
}

// Check if two strings are similar within a tolerance (max allowed edits)
function isSimilar(original, possibleTypo, maxEdits = 2) {
    // First try exact substring match (case-insensitive) – if found, quick match
    if (original.toLowerCase().includes(possibleTypo.toLowerCase()) ||
        possibleTypo.toLowerCase().includes(original.toLowerCase())) {
        return true;
    }
    // Otherwise, compare edit distance (only if words are not extremely short)
    const len = Math.max(original.length, possibleTypo.length);
    const allowed = Math.min(maxEdits, Math.floor(len / 3) + 1); // adaptive threshold
    return levenshteinDistance(original, possibleTypo) <= allowed;
}
    // Yahan apne sawaal aur jawab daalein
    const knowledgeBase = [
        {
            keywords: ['hello', 'hi', 'hey', 'greetings'],
            answer: '👋 Hello! I am your educational assistant. Ask me anything about our courses, learning paths, or how to get started!'
        },
        {
            keywords: ['Assalam-alikum', 'salam', 'peace'],
            answer: '🌙 Wa Alaikum Assalam! How can I assist you with your learning journey today?'
        },
        {
            keywords: ['namsate', 'namaste', 'greetings'],
            answer: `Namaste! 🙌

            Yeh platform Munesh ne banaya hai – ek full-stack developer jo chahta hai ke aap asaan aur project-based tareeqay se seekhein.
            Main Edutool AI Assistant hoon, Pak eduTool ka aapka maddagar.

            
            Chahe aapko React.js ka “state” samajhna ho, cybersecurity mein ethical hacking ke raaz jaanne hon, ya career ki koi uljhan ho – main yahan hoon, thoda wit aur thoda empathy ke saath.
            Bus ek shart: seekhna serious lekin mazaak ke saath hona chahiye. 😄
            Aap sawaal kariye Roman Urdu/Hindi mein ya English mein. Main dono mein fluent hoon.

            Toh boliye, kis cheez mein help chahiye? 🚀`
        },
    {
        keywords : ["homework", "homework not done", "forgot homework"],
        answer : "🐶 Sorry teacher, my dog ate my homework! But seriously, next time set a reminder. Want me to help you finish it now?"
    },
    {
        keywords: ["exam pass", "pass without study", "fail exam"],
        answer: "📚 Exam mantra: 'Jo raat mein nahi parha, wo subah kaam aaya?' Nahi yaar. 2 ghanta parh lo, warna teacher ke samne 'next time pakka' bolna parhega 😅"
    },
    {
        keywords: ["late for class", "school late", "alarm missed"],
        answer: "⏰ 5 more minutes… oh no! You're late again? Next time put your alarm across the room so you have to get up. Or just bribe your mom with chai ☕"
    },
    {
        keywords: ["absent today", "skip class", "bunk school"],
        answer: "🤧 *cough cough* Mom, I think I have 'board fever' — wait, it's just Monday. Just go to class, you'll survive. Bring chocolate for friends 😉"
    },
    {
        keywords: ["assignment last minute", "due tomorrow", "assignment deadline"],
        answer: "⏳ Why do today what you can do tomorrow? Oh wait, tomorrow is the deadline! 😱 Open ChatGPT (me!) and let's finish this in 1 hour. Coffee ready?"
    },
    {
        keywords: ["teacher angry", "mad teacher", "shouted in class"],
        answer: "👩‍🏫 Teacher: 'Where's your notebook?' You: 'Sir, notebook is on leave today.' Result: stand outside class for 30 min. Lesson learned? Probably not 🤣"
    },
    {
        keywords: ["forgot pen", "no pen in exam", "borrow pen"],
        answer: "✒️ Exam hall mein pen bhool gaye? Aise lagta hai jaise bhookhe ho aur khana bhool gaye. Next time ek extra pen apni ammi ke purse se utha lo 😜"
    },
    {
        keywords: ["science practical", "experiment fail", "chemistry blast"],
        answer: "🧪 Lab rule #1: don't sniff directly. Rule #2: teacher ka chehra na jalayein. Agar experiment fail ho jaye toh bol dena 'Sir, humein Einstein banna hai, ek baar aur try' 😂"
    },
    {
        keywords: ["math phobia", "math is hard", "hate math"],
        answer: "📐 Maths: Jab teacher puchhe 'What is x?', aur aap kahen 'Variable? Nahi yaar, unknown mystery!' Solution? Practice ya phir calculator ki dua maango 🧮"
    },
    {
        keywords: ["school lunch", "tiffin funny", "boring food"],
        answer: "🍱 Aaj tiffin mein daal chawal? Swap with friend who has pizza rolls. Ya phir pretend karo 'intermittent fasting' kar rahe ho. Teacher samajh jayegi 😆"
    },
    {
        keywords: ["copy paste", "cheating in exam", "copy from friend"],
        answer: "👀 Exam mein copying? Friend ka answer 'Option C' hai toh tum 'Option B' likh doge. Phir dono fail. Moral: khud parho warna life mein 'copy-paste' kaam nahi karta 🖨️"
    },
    {
        keywords: ["teacher calling parents", "parents meeting", "father angry"],
        answer: "📞 'Beta, aaj teri teacher ne phone kiya tha.' 'Oh? Kya bola?' 'Keh rahi thi tu class ka joker hai.' 'Maa, main toh entertainer hoon!' 😎"
    },
    {
        keywords: ["principal office", "sent to principal", "punishment"],
        answer: "🏫 Principal: 'Why are you here?' You: 'Sir, teacher ne kaha main zyada intelligent hoon, aap se milne bheja.' Principal: 'Really?' You: 'Nahi, actually main ne school ki ghanti bajai thi' 🔔"
    },
    {
        keywords: ["last bench", "backbencher", "back bench student"],
        answer: "🪑 Backbencher superpower: teacher ko pata hi nahi chalta ke aap class mein ho. Weakness: exam mein sab kuch 'pichhe' reh jata hai. Aage aa jao bhai 📖"
    },
    {
        keywords: ["uniform", "school uniform dirty", "no uniform"],
        answer: "👔 'Sir, meri uniform dryer mein hai?' 'Toh pehen ke kyun nahi aaya?' 'Sir, dryer band tha, aur main nahi janta tha ke kapde nahi sukhenge.' Excuse rejected 🚫"
    },
    {
        keywords: ["holiday tomorrow", "no school", "school closed"],
        answer: "🎉 'Holiday!' Ki khushi mein raat 2 baje tak games kheli. Subah pata chala 'teacher training' hai, students ke liye nahi. Ro dene ka man karta hai 😭"
    },
    {
        keywords: ["surprise test", "unexpected exam", "quiz"],
        answer: "📝 Teacher: 'Open your notebooks, surprise test!' Students: 'Surprise? Hum toh exam ki tayari ko bhi surprise samajhte hain!' Bas ab kismat bharose 🤞"
    },
    {
        keywords: ["marks low", "fail exam", "poor result"],
        answer: "📉 Marks: 10/100. Father: 'Beta, tu fail ho gaya?' You: 'Papa, main 'minimalist' approach follow kar raha hoon — minimum marks, maximum chill!' Father chappal le kar aaya 🩴"
    },
    {
        keywords: ["top student", "topper", "high marks"],
        answer: "🏆 Topper ka secret: woh raat ko 3 baje tak parhta hai. Aap ka secret: woh raat ko 3 baje tak reels dekhta hai. Fark samajh aaya? 😅 Ab padh lo!"
    },
    {
        keywords: ["group study", "study together", "friends study"],
        answer: "👥 Group study = 10% padhai + 20% gossip + 30% snacks + 40% phone. Result: marks same. Better study alone then call friends for 'doubt session' (read: chai session) ☕"
    },
    {
        keywords: ["online class", "zoom class", "virtual school"],
        answer: "💻 Online class: Camera off, mic mute, snack on, game in background. Teacher: 'Rohan, answer karo!' Rohan: 'Sorry mam, internet slow tha...' Every. Single. Day."
    },
    {
        keywords: ["presentation", "class presentation", "speech fear"],
        answer: "🎤 Presentation ke waqt haath kaanp rahe, awaaz phat rahi, teacher ne puchha 'Are you okay?' Aapne kaha 'Yes, just nervous... mera topic hai 'How to fake confidence' 🤥"
    },
    {
        keywords: ["sick leave application", "leave for school", "fake sickness"],
        answer: "📝 Application: 'Respected teacher, kal main bimar tha. Fever 200°F, cough tiger jaisi, doctor ne dua di. Aaj theek hoon. Please mark present.' Teacher: 'Nice try, zero attendance' 😂"
    },
    {
        keywords: ["best friend in school", "partner in crime", "school buddy"],
        answer: "👬 Best friend woh hai jo exam mein apna answer tumhe de de, aur woh galat ho. Phin dono fail. Friendship forever! 💔"
    },
    {
        keywords : ["canteen food", "school canteen", "samosa chat"],
        answer : "🍟 School canteen ka samosa: undercooked andar se, jaleya hua bahar se. Phir bhi tum khaate ho kyunki 'designer' lunch box boring hai. Canteen waala ameer ho gaya 😅"
    },
    {
        keywords: ["school bus", "bus late", "bus driver"],
        answer: "🚌 Bus driver uncle ko lagta hai woh Formula 1 driver hain. Phir bhi school late pahunchte ho. Magic? Woh 'shortcut' lete hain jo 2 ghanta lamba ho 🥴"
    },
    {
        keywords: ["assembly", "morning assembly", "prayer time"],
        answer: "🎙️ Assembly mein principal ke speeches ka translation: 'Beta, discipline rakho, warna tumhari life mein bhi assembly line lag jayegi (sarkari office ki)' 😆"
    },
    {
        keywords: ["library period", "library silence", "books"],
        answer: "📖 Library mein 'Complete silence' ka matlab hai: ek dost dusre ko 'chup' keh raha hai, aur librarian 'SHHHHHH' kar rahi hai. Asli noise toh library mein hoti hai 🤫"
    },
    {
        keywords : ["sports day", "race competition", "pta sports"],
        answer : "🏃 Sports day: 100m race – bachpan ka bhaagta hua cheetah. Lekin school race mein neeche gir jaate ho. Gold medal? Nahi. Best 'comedy act' award milta hai 🎭"
    },
    {
        keywords: ["computer class", "CS period", "typing"],
        answer : "💻 Computer teacher: 'Open Notepad.' You: Open Google. Teacher: 'I said Notepad!' You: 'Sir, Google bhi notepad hai, bas zyada smart hai' 🤓"
    },
    {
        keywords: ["home economics", "cooking class", "sewing"],
        answer: "🧵 Home economics: Sewing button – aapne kapde ko button se sil diya. Cooking – anda jala diya. Teacher: 'Beta, future mein maid rakhna' 😅"
    },
    {
        keywords: ["school elections", "head boy", "class monitor"],
        answer: "🗳️ Election campaign: 'Vote for me, mein assembly mein chai ki machine lagwaunga.' Votes milte hain? 3 (khud, best friend, aur woh jo confuse ho) 🫠"
    },
    {
        keywords: ["punishment writing", "lines writing", "I will not talk"],
        answer: "✍️ Punishment: 'I will not talk in class' likho 100 times. After 50 times, you start writing 'I will talk in class' by mistake. Start again 😩"
    },
    {
        keywords: ["period 1 maths", "first period", "sleepy class"],
        answer: "😴 Period 1 Maths: Teacher draws a circle. You draw a face. Teacher draws 'x' and 'y'. You see 'sleep' and 'dream'. ZZZ... Teacher wakes you: 'Beta, answer kya hai?' 'Sir, 42?' (Kuch bhi 🤣)"
    },
    {
        keywords: ["last period", "final period", "school ending"],
        answer: "⌛ Last period: 5 minutes before bell – students start packing, teacher starts 'important announcement' which takes 20 min. Bell bajti hai? Nahi, teacher ki awaaz bajti hai 🙉"
    },
    {
        keywords: ["school bag weight", "heavy bag", "books load"],
        answer: "🎒 Mera school bag itna bhaari ke gym jaane ki zaroorat nahi. Ek din bag mein kitaabein kam, snacks zyada the. Teacher: 'Tum school aate ho ya picnic?' 😂"
    },
    {
        keywords : ["water bottle", "lose water bottle", "same bottle"],
        answer: "💧 Every class has 10 'same-looking' water bottles. Sabka bottle sab le jaate hain. End of day: apne paas do bottle, ek kisi aur ki, aur ek missing. Bottle swap game 🫙"
    },
    {
        keywords: ["dusty chalk", "chalk piece", "teacher aims"],
        answer: "🎯 Teacher agar aap par chalk fekta hai, toh aap bohot special ho. Matlab: uski aankh mein aap hi ho. Aim better than Olympic shooter. Duck! 🦆"
    },
    {
        keywords: ["eraser fight", "rubber war", "classroom battle"],
        answer: "🧽 Eraser fight: rules – no crying, no hitting teacher. Winner gets... a broken eraser and a note in the 'bad book'. But worth it! 🏅"
    },
    {
        keywords: ["substitute teacher", "sub teacher", "guest teacher"],
        answer: "👨‍🏫 Substitute teacher: 'I'll teach you maths.' Students: 'We'll teach you how to survive 40 minutes.' Substitute cries internally. Everyone wins? 😆"
    },
    {
        keywords: ["school field trip", "picnic", "educational tour"],
        answer: "🚌 Field trip: 'Educational' matlab museum dekha 10 min, rest 5 hours – bus mein antakshari, phone charging race, aur bheek maangne wale chips. Success 💯"
    },
    {
        keywords: ["lost my notebook", "notebook missing", "where is my copy"],
        answer: "📓 'Meri notebook kahan hai?' Answer: Teacher ke paas (for checking). Ya phir uss dost ke paas jisne 2 mahine pehle 'ek din ke liye' li thi. RIP notebook 🪦"
    },
    {
        keywords: ["school closing bell", "last bell", "home time"],
        answer: "🔔 School closing bell – music to ears. Suddenly teacher: 'One more sum.' Students: 'But bell...' Teacher: 'I am the bell inside this room.' 🥲"
    },
    {
        keywords: ["friend sleeping in class", "dost so raha", "sleepy friend"],
        answer: "😴 Friend sleeping, teacher approaches. You poke friend. Friend wakes up loudly: 'Haan, kya hua?! Lunch mil gaya?' Teacher: 'Lunch? No, detention.' Guilty by proximity 🫂"
    },
    {
        keywords: ["phone in school", "mobile phone confiscated", "phone caught"],
        answer: "📱 Phone pakda gaya. Teacher: 'Give me.' You: 'But ma'am, it's my emotional support device.' Teacher: 'Your emotions can wait after school.' Bye bye phone 👋"
    },
    {
        keywords: ["school diary", "dairy notes", "reminder"],
        answer: "📔 School diary mein likha hai: 'Parents signature required.' Aapne khud sign kar diya. Next day teacher: 'Yeh signature tumhare father ke hain ya tumhare?' You: 'Jeb ke uncle ne kiye' 🕵️"
    },
    {
        keywords: ["subject teacher absent", "teacher on leave", "free period"],
        answer: "🎉 Teacher absent = party period. Class monitor: 'Silence!' Class: 'You be silent!' Then principal walks in. Party over 🎈💥"
    },
    {
        keywords: ["practical exam", "viva", "oral test"],
        answer: "🗣️ Viva: Teacher: 'Define gravity.' You: 'Woh jo mera rank neeche karta hai.' Teacher: 'Explain.' You: 'Sir, explanation ke liye extra marks?' Result: 1/10 😂"
    },
    {
        keywords: ["quiz competition", "interclass quiz", "buzz round"],
        answer: "🔔 Quiz: 'Name the national animal of Pakistan.' You press buzzer: 'Markhor!' Teacher: 'Correct!' Next: 'Markhor ka baby kya kehte hain?' You: '...Markhor jr.?' No points 🙈"
    },
    {
        keywords: ["school fee", "fee pending", "reminder fee"],
        answer: "💰 School fee reminder: 'Beta, kal fee le aao, warna tumhari seat kisi aur ko de denge.' You: 'Maa, please kal loan le do, warna bench pe seedha na bethunga' 🛌"
    },
    {
        keywords: ["parent teacher meeting", "PTM", "father teacher meet"],
        answer: "👨‍👧 PTM day: Father enters, teacher: 'Aapka beta bohot intelligent hai... jab soota nahi hai.' Father looks at you. You look at floor. Rest is history 📜"
    },
    {
        keywords: ["school photo", "class picture", "group photo"],
        answer: "📸 Class photo: Sab smile kar rahe hain. Aapki aankh band. Photographer: 'One more!' Aapki aankh khuli but hair weird. Photo goes to yearbook. Immortal embarrassment 🖼️"
    },
    {
        keywords: ["school trophy", "prize distribution", "award"],
        answer: "🏆 Prize: 'Best handwriting' – trophy milegi? Nahi, ek pen (which will be lost in 2 days). 'Best attendance' – certificate jisse almarah mein dhool khayegi. Humara prize hai 'best excuse' 🥇"
    },
    {
        keywords : ["whiteboard marker", "dry marker", "no ink"],
        answer : "🖊️ Teacher picks marker – dry. Another marker – dry. Class helps: 'Sir, aise karo, jor se hilao!' Teacher: 'Jaanti hoon.' Finally writes with permanent marker. Blackboard ruined 😶"
    },
    {
        keywords : ["class pet", "fish tank", "school aquarium"],
        answer : "🐠 Class fish – name 'Goldie'. One day, Goldie gets overfed by 20 students. Goldie floats. Next day, new fish – same name. Goldie jr. Cycle continues 🔄"
    },
    {
        keywords: ["school play", "drama club", "annual function"],
        answer: "🎭 School play: Aapko 'tree' ka role milega (no dialogues). Aap 2 hours stand like a tree. At end, principal says: 'Our best tree ever!' Achievement unlocked 🌳"
    },
    {
        keywords: ["cleaning duty", "class monitor duty", "sweeping class"],
        answer: "🧹 Cleaning duty: Aap dust kar rahe ho, dost naach raha hai. Teacher aati hai, sirf aap pakde jaate ho. 'Why are you laughing?' 'Sir, dust ne mera funny face dikhaya' 🥴"
    },
    {
        keywords: ["school notice board", "circular", "announcement"],
        answer: "📌 Notice board: 'All students must bring parents for PTM' – aap notice board ke saamne se guzre, dekha but ignored. Next day detention. Always blame 'mere dost ne nahi bataya' 🤥"
    },
    {
        keywords: ["competition registration", "olympiad", "contest"],
        answer: "📝 'Maths Olympiad registration – last date tomorrow.' Aap: 'Haan, kar lenge.' One year later: same circular. Olympiad cycle continues, you never register. Classic 🌀"
    },
    {
        keywords: ["school magazine", "article writing", "submit essay"],
        answer: "📰 School magazine: Submit 500 words on 'My School'. You copy from internet, change school name. Teacher: 'Yeh paragraph mein Delhi kyun likha hai?' Oops wrong copy 🇮🇳"
    },
    {
        keywords: ["lost and found", "lost items", "school lost box"],
        answer: "🧦 Lost and found box: Ek sock, 3 pens, mysterious keys, aur 2015 ka school diary. Sweater missing? Box mein nahi, lekin classmate pe pehna hua mil sakta hai 😬"
    },
    {
        keywords: ["school bell not working", "bell problem", "no bell"],
        answer: "🔕 Bell kharab. Teacher: 'Jab tak bell nahi baja, class nahi chodega.' 20 min extra padhayi. Finally bell baja? Nahi, watchman ne ghanti bajai. Modern problems 🕰️"
    },
    {
        keywords : ["winter uniform", "school sweater", "blazer"],
        answer : "🧥 Winter uniform: Sweater bohot bara – sleeves half meter extra. Blazer tight because last year ka hai. And scarf? Bhool gaye. Thand mein kaanpe, teacher kahe: 'Style over warmth?' 🥶"
    },
    {
        keywords: ["sports period cancelled", "pe class cancelled", "rain sports"],
        answer: "🏀 Sports period cancelled due to 'teacher meeting'. Students: 'But sun bahar hai!' Teacher: 'Meeting andar hai.' Inside: teachers chai pe rahe hain. Conspiracy ☕"
    },
    {
        keywords: ["school prayer", "morning dua", "assembly prayer"],
        answer: "🕌 Assembly prayer: Sab aankhen band – except woh student jo so raha hai khada hokar. End pe 'Ameen' – jor se chillaya, teacher shock. Day made 😇"
    },
    {
        keywords: ["syllabus completion", "course covered", "remaining chapters"],
        answer: "📚 Syllabus: 10 chapters, last day pe teacher: 'Chapters 5-10 ab aap khud parho. Exam mein aayenge.' Aap: 'Sir, humein toh aadat hai, har saal hota hai' 😌"
    },
    {
        keywords: ["school peon", "class attendant", "bhaiya"],
        answer: "🧑‍💼 Peon bhaiya: Multitasker – chalk laana, paani lana, principal ka order lana, aur aapki slip lana. Lunch time pe peon bhaiya hi sabse busy. Superhero without cape 🦸"
    },
    {
        keywords: ["blackboard cleaning", "dustboard", "eraser dust"],
        answer: "🧽 Blackboard clean karte waqt dust urti hai. First bench students sneeze. Teacher: 'Bless you.' Whole class: 'Bless you chain' shuru. Teacher: 'Enough! Now chapter 7.' 😂"
    },
    {
        keywords: ["geometry box", "compass box", "math instrument"],
        answer: "📐 Geometry box: Compass missing, scale broken, sharpener chhota, aur eraser pet jaisa. Phir bhi 'complete' bolte ho. Exam hall mein pata chalta 'protector uncle kahan hai?' 🤦"
    },
    {
        keywords: ["school id card", "badge", "name tag"],
        answer: "🪪 ID card photo – aapki expression jaise police ne pakda ho. Lanyard pe old chewing gum ka nishaan. Metal clip kabhi kaam nahi karta. Iconic 🔖"
    },
    {
        keywords: ["coffee in school", "tea break", "staff room"],
        answer: "☕ Staff room se aati hai coffee ki khushbu. Students ko sirf 'paani' milta hai. Double standard? School democracy? Nahi, staff supremacy 😤"
    },
    {
        keywords: ["pencil vs pen", "ink vs lead", "writing tool"],
        answer: "✏️ Pencil: mistakes erase kar sakte ho. Pen: permanent mistakes. School teaches: life mein pen se likho, par exam mein pencil allowed nahi. Confusion level 100 🌀"
    },
    {
        keywords: ["sticky notes", "post it", "reminder notes"],
        answer: "📝 Sticky notes on table: 'Homework due' – ignore. 'Test tomorrow' – ignore. 'Your life is a mess' – 'Yeh note kisne lagaya?!' Probably yourself 🤡"
    },
    {
        keywords: ["bookmark", "page mark", "reading marker"],
        answer: "🔖 Bookmark = old bus ticket, chocolate wrapper, ya folded page corner. Agar corner fold kiya toh teacher: 'Beta, kitaab ki izzat karo.' Aap: 'Ma'am, yeh vintage look hai.' 😎"
    },
    {
        keywords: ["highlighters", "mark text", "color pens"],
        answer: "🟡 Highlighter: Entire book is yellow. You: 'Important sab kuch hai.' Teacher: 'Toh fir kya unimportant hai?' You: 'Mera dimaag.' Relatable 🧠"
    },
    {
        keywords: ["study table", "desk setup", "home study"],
        answer: "🪑 Study table: Laptop, phone, charger, snacks, water bottle, and a small corner for one book. 'Main padh raha hoon' – actually Netflix chal raha hai 📺"
    },
    {
        keywords: ["night before exam", "exam eve", "last night study"],
        answer: "🌙 Exam night: 10 chapters in 4 hours. Red bull, coffee, prayers. Subah exam hall mein sleep paralysis. Teacher: 'Answer likho!' Brain: '404 not found' 🖥️"
    },
    {
        keywords: ["morning exam", "early exam", "7am paper"],
        answer: "⏰ 7am exam: Alarm set for 5am. Actually wake up at 6:45am. Brush, run, reach exam hall half asleep. Question paper dikhta hai blur. 'Section A – Attempt all' – Good luck 😴"
    },
    {
        keywords: ["exam hall rules", "no phones", "no talking"],
        answer: "📵 Exam hall rules: 'No talking, no sharing, no looking around.' As a result, you look around more, friend smiles, you both smile. Invigilator: 'Both out.' Friendship goals? 🤝"
    },
    {
        keywords: ["extra sheet", "additional paper", "more pages"],
        answer: "📄 Extra sheet manga? Matlab answer lamba hai. But actually sirf 2 lines likhi hain, baaki drawing. Invigilator: 'Yeh tiger kyun banaya?' You: 'Sir, stress relief.' 🐯"
    },
    {
        keywords: ["rough work", "working column", "margin"],
        answer: "📝 Maths exam mein rough work margin mein karte ho. End mein margin full of hearts and 'I love maths' (lie). Teacher sees, gives 0 for comedy ✍️❤️"
    },
    {
        keywords: ["superstitious exam", "lucky pen", "rubber band"],
        answer: "🍀 Lucky pen use kiya – fail. Next exam, 'unlucky' pen use kiya – pass. Conclusion: pen kuch nahi karta, aapko padhna padta hai. But still carry that 'lucky' eraser 🧽"
    },
    {
        keywords: ["exam result day", "result announcement", "marksheet"],
        answer: "📊 Result day: Heart rate 120. Teacher: 'Top 3: Ali, Sara...' Tumhara naam? 30th. Parents: 'Beta, agle saal achhe se padhna.' You: 'Haan, seedha 31st ka target hai' 🎯"
    },
    {
        keywords: ["supplementary exam", "retest", "fail improvement"],
        answer: "🔄 'Fail' kehna mana hai. 'Supplementary' kehte hain. Supplementary exam = doosra mauka fail karne ka. But iss baar you pass, because paper easy tha. Thank you, board! 🙏"
    },
    {
        keywords: ["school farewell", "last day", "goodbye school"],
        answer: "🎓 Farewell day: Sab ro rahe hain, hugs, autographs. Aap: 'Finally freedom!' Then teacher: 'Tum college mein aur zyada padhoge.' Aapki smile: gone. Goodbye innocence 👋"
    },
    {
        keywords: ["school alumni", "old student", "reunion"],
        answer: "👥 Alumni come to school: 'Mere time mein...' Current students: 'Uncle aapko kaun hai?' Alumni cries inside. But free chai milti hai, so worth it 🍵"
    },
    {
        keywords: ["school fees discount", "scholarship", "fee concession"],
        answer: "💰 Scholarship: 'Write an essay on why you deserve.' You write 'Because my father says I'm expensive.' Committee laughs, gives 10% off. Success? Partial 😁"
    },
    {
        keywords: ["race for rank", "position competition", "first rank stress"],
        answer: "🏁 Rank 1 ke piche pagalpan. Rank 2 wala rota hai. Rank 30 wala khush hai kyunki 'pass' hai. Moral: rank se acha, pass hona better hai. Perspective 🧘"
    },
    {
        keywords: ["teacher's pet", "goody goody", "favorite student"],
        answer: "🐱 Teacher's pet woh jo har answer jaanta hai. Aap woh jo puchta hai: 'Ma'am, yeh exam mein aayega?' Teacher: 'Shut up, beta.' Different energies 🐕"
    },
    {
        keywords: ["class clown", "joker student", "funny student"],
        answer: "🤡 Class clown: Ek joke mara, sab hanse. Teacher: 'Outside.' Dost: 'Legend.' Detention mila, lekin instagram story ban gayi. Worth it? Doubtful 😅"
    },
    {
        keywords: ["school secrets", "hide from teacher", "student underground"],
        answer: "🤫 Secret handshake, hidden phone in shoe, snacks in pencil case. Teacher knows everything. Still you think you're spy. Reality: teacher ko chai break pe hasi aati hai 🤣"
    },
    {
        keywords: ["school library card", "library membership", "borrow books"],
        answer: "📇 Library card: Issued in class 6, lost in class 7. New card – lost again. Finally you remember issue number by heart. Librarian impressed: 'Tumhara future librarian mein hai' 🤓"
    },
    {
        keywords: ["school garden", "eco club", "planting"],
        answer: "🌱 School garden mein aapne plant lagaya. Next week plant dead. Teacher: 'Beta, paani dena padta hai.' Aap: 'Maine roj dekh liya, par paani kon dalega?' 🙈"
    },
    {
        keywords: ["computer lab rules", "no games", "only study"],
        answer: "🖥️ Computer lab: 'No games, only typing practice.' Reality: Sab ne 'Space Pinball' khol rakha hai. Teacher aati hai, ek click – desktop dikhta hai. Professional gamers 🎮"
    },
    {
        keywords: ["school project", "model making", "science exhibition"],
        answer: "📦 Science project: Volcano banao – baking soda + vinegar. Aapne ghar par test kiya, carpet kharab. Exhibition mein volcano fail. 'Solar system' banana tha 🌀"
    },
    {
        keywords: ["chart paper", "poster making", "presentation board"],
        answer: "📉 Chart paper: Title fancy, border beautiful, content 2 lines baaki. Teacher: 'Explain karo.' Aap: 'Ma'am, simplicity is key.' Teacher: 'Fail bhi simplicity hai?' 😶"
    },
    {
        keywords: ["school dance", "annual day dance", "performance"],
        answer: "💃 Dance performance: Step bhool gaye. Dost prompt karta hai. End mein aap step 2 pe ho, sab step 4 pe. Audience: 'Intentional comedy?' You: 'Yes... totally' 🕺"
    },
    {
        keywords: ["school choir", "singing group", "music class"],
        answer: "🎤 Choir mein aap 'background singer' ho. Matlab: Moon ho toh background mein, solo nahi. Ek bar mic pakda, awaaz phat gayi. Now permanent background. Just nodding 🎵"
    },
    {
        keywords: ["handwriting competition", "beautiful writing", "calligraphy"],
        answer: "✍️ Handwriting competition: Aapne socha 'mujhe koi chance nahi' – phir bhi participate kiya. Judge ne aapki sheet dekhte hee 'Next' bol diya. Chaar lines bhi nahi padhi 🏃"
    },
    {
        keywords: ["school debate", "arguing competition", "speech contest"],
        answer: "🗣️ Debate topic: 'Social media is bad.' Aap affirmative side. Phir aapka phone notification aaya – Instagram. Everyone laughs. You lose. Irony win 🏆"
    },
    {
        keywords: ["school elections voting", "student council", "cast vote"],
        answer: "🗳️ Student council vote – aap candidate se milna: 'Kya doge?' 'Chocolate!' Vote for chocolate. Next day: chocolate nahi, 'environment day' pledge. Betrayal 😭"
    },
    {
        keywords: ["last bench love", "pyaar class mein", "crush school"],
        answer: "💖 Last bench: Crush aage baithe hai. Aap pura period unhe dekhte rahe. Teacher: 'Rohan, answer!' Aap: 'Haan? (kya hua?)' Teacher: 'Tumhara naam bhi bhool gaye?' 😍"
    },
    {
        keywords: ["school suspension", "expelled", "banned"],
        answer: "🚫 Suspension – mili kyunki teacher ko uncle bola. 3 din ghar pe 'vacation'. Parents: 'Beta, tum genius ho ya fool?' You: 'Dono, maa, dono.' 🥲"
    },
    {
        keywords: ["school transfer", "move school", "change school"],
        answer: "🚚 Transfer ho gaya. Naye school mein pehla dost banana – you offer him chips. He accepts. Friendship made. Old school ke dost ab 'seen' par 'hmm' karte hain 🥹"
    },
    {
        keywords: ["school fake friends", "toxic friend", "backstabber"],
        answer: "🤝 Fake friend: 'Bhai, notes de de.' Tum dete ho. Exam mein woh top karta hai, tum fail. Next day: 'Tune notes galat diye.' You: 'Tune likhe galat.' End of friendship 💔"
    },
    {
        keywords: ["school achievement", "proud moment", "win award"],
        answer : "🏅 School mein kuch acha kiya (rare). Principal ne stage pe bulaya. Aap khushi se bhage, par neeche gir gaye. Sab hanse. Aap ne uthkar 'Thank you' bola. Achievement unlocked: humility 💪"
    },
    {
        keywords : ["last day of exams", "exam khatam", "holiday starts"],
        answer : "🎉 Last exam khatam. Bahar aake chillaya 'Azaadi!' Friends hug. Plan: 'Kal cinema chalenge?' Reality: kal pata chala 'homework submission hai' next week. Back to life 📚"
    },
        {
            keywords: ['python', 'what is python', 'python language'],
            answer: '🐍 Python is a high-level, interpreted programming language known for its simplicity and readability. It’s widely used in web development, data science, AI, automation, and more.'
        },
        {
            keywords: ['web development', 'become web developer', 'html css js'],
            answer: '🌐 Web development involves building websites and web apps. Start with HTML (structure), CSS (styling), then JavaScript (interactivity). Later learn React, Node.js, and databases.'
        },
        {
            keywords: ['ai', 'artificial intelligence', 'what is ai'],
            answer: '🤖 Artificial Intelligence (AI) is the simulation of human intelligence in machines. It includes machine learning, deep learning, NLP, computer vision, and more.'
        },
        {
            keywords: ['data science', 'what is data science', 'data scientist'],
            answer: '📊 Data Science combines statistics, programming, and domain knowledge to extract insights from data. It uses Python, pandas, numpy, and machine learning.'
        },
        {
            keywords: ['digital marketing', 'seo', 'social media marketing'],
            answer: '📢 Digital marketing promotes products online using SEO, social media, email, Google Ads, and content marketing. It’s a great career with high demand.'
        },
        {
            keywords: ['pak edutool', 'platform', 'what is pak edutool', 'about pak edutool'],
            answer: '🎓 Pak eduTool is an online learning platform offering courses in programming, web development, AI, data science, digital marketing, cybersecurity, and more. It provides free and paid courses, certificates, and a student dashboard to track progress.'
        },
        {
            keywords: ['pak edutool courses', 'courses offered', 'what courses', 'subjects'],
            answer: '📚 Pak eduTool offers: Python Programming, Web Development (HTML/CSS/JS/React), AI & Machine Learning, Data Science, Digital Marketing, Cybersecurity, Graphic Design, and Mobile App Development.'
        },
        {
            keywords: ['free courses', 'free', 'cost', 'price', 'paid courses', 'how much'],
            answer: '💰 Pak eduTool has both free courses (e.g., Python Basics) and paid courses (e.g., Web Development Bootcamp PKR 4,999, AI/ML PKR 7,999). Many free courses also offer certificates upon completion.'
        },
        {
            keywords: ['certificate', 'certification', 'get certificate', 'certificate download'],
            answer: '📜 After completing 100% of a course (all lessons and quizzes), you can download a verified certificate. It is recognized by employers and can be shared on LinkedIn.'
        },
        {
            keywords: ['instructor', 'teachers', 'who teaches', 'instructors'],
            answer: '👨‍🏫 Our instructors: Dr. Angela Yu (Web Development), Dr. Sarah Ahmed (Python), Dr. Fatima Ali (AI/ML), Ahmed Raza (Digital Marketing), and Col. Raza Malik (Cybersecurity).'
        },
        {
            keywords: ['login', 'signup', 'register', 'account', 'create account'],
            answer: '🔐 You can create a free account using the "Sign Up" button. After logging in, you can enroll in courses, track progress, and access your dashboard. Demo: student@test.com / 123456'
        },  
        {
            keywords: ['dashboard', 'student dashboard', 'my learning'],
            answer: '📊 The student dashboard shows your enrolled courses, progress percentage, certificates earned, and recommended courses. You can continue learning from where you left off.'
        },
        {
            keywords: ['refund', 'money back', 'guarantee'],
            answer: '💵 Pak eduTool offers a 30-day money-back guarantee for all paid courses. If you are not satisfied, contact support for a full refund.'
        },
        {
            keywords: ['web development', 'become web developer', 'web dev roadmap', 'web developer'],
            answer: '🌐 Web development involves building websites and web apps. Start with HTML (structure), CSS (styling), then JavaScript (interactivity). Next, learn a framework like React, and backend with Node.js/Express and databases (MongoDB).'
        },
        {
            keywords: ['html', 'what is html', 'html basics'],
            answer: '📄 HTML (HyperText Markup Language) is the standard markup language for creating web pages. It uses tags like <h1>, <p>, <a> to structure content.'
        },
        {
            keywords: ['css', 'what is css', 'css styling'],
            answer: '🎨 CSS (Cascading Style Sheets) controls the look and feel of a webpage – colors, fonts, layout. It can be inline, internal, or external using a .css file.'
        },
        {
            keywords: ['javascript', 'js', 'what is javascript'],
            answer: '📜 JavaScript is a programming language that makes websites interactive. It runs in the browser and can manipulate the DOM, handle events, fetch data, and much more.'
        },
        {
            keywords: ['react', 'react js', 'what is react', 'react framework'],
            answer: '⚛️ React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM for efficient updates. It is maintained by Meta.'
        },
        {
            keywords: ['responsive design', 'mobile friendly', 'media query', 'flexbox', 'grid'],
            answer: '📱 Responsive design ensures websites look good on all devices. Techniques include fluid grids, flexible images, and CSS media queries. Flexbox and Grid are powerful layout tools.'
        },
        {
            keywords: ['api', 'rest api', 'what is api'],
            answer: '🔌 API (Application Programming Interface) allows different software applications to communicate. REST APIs use HTTP methods (GET, POST, PUT, DELETE) and return data often in JSON format.'
        },
        {
            keywords: ['python', 'what is python', 'python language'],
            answer: '🐍 Python is a high-level, interpreted programming language known for its simplicity and readability. It is widely used in web development (Django), data science, AI, automation, and more.'
        },
        {
            keywords: ['javascript vs python', 'python or javascript'],
            answer: '📊 Both are great. Python is often used for backend, data science, AI. JavaScript is essential for frontend (browsers) and also backend with Node.js. Choose based on your goal.'
        },
        {
            keywords: ['data types in python', 'python data types'],
            answer: '🔢 Python data types include int, float, str, bool, list, tuple, dict, set. You can use type() to check the type of a variable.'
        },
        {
            keywords: ['loop in python', 'for loop', 'while loop'],
            answer: '🔄 Loops repeat code. `for` iterates over a sequence (list, range). `while` repeats as long as a condition is true. Example: `for i in range(5): print(i)`'
        },
        {
            keywords: ['function in python', 'define function', 'def'],
            answer: '📦 Functions are reusable blocks of code. Use `def function_name(parameters):` and `return` to output a value. Example: `def add(a,b): return a+b`'
        },
        {
            keywords: ['list vs tuple', 'python list', 'python tuple'],
            answer: '📋 Lists are mutable (changeable) and use square brackets `[ ]`. Tuples are immutable (cannot change) and use parentheses `( )`.'
        },
        {
            keywords: ['ai', 'artificial intelligence', 'what is ai'],
            answer: '🤖 Artificial Intelligence (AI) is the simulation of human intelligence in machines. It includes machine learning, deep learning, NLP, computer vision, and robotics.'
        },
        {
            keywords: ['machine learning', 'ml', 'what is ml'],
            answer: '📈 Machine Learning is a subset of AI where algorithms learn from data to make predictions or decisions without being explicitly programmed. Types: supervised, unsupervised, reinforcement.'
        },
        {
            keywords: ['deep learning', 'neural networks', 'what is deep learning'],
            answer: '🧠 Deep Learning uses multi-layered neural networks to model complex patterns. It powers image recognition, speech recognition, and language models like GPT.'
        },
        {
            keywords: ['tensorflow', 'pytorch', 'ai frameworks'],
            answer: '🔧 TensorFlow (by Google) and PyTorch (by Meta) are popular open-source libraries for building and training deep learning models.'
        },
        {
            keywords: ['nlp', 'natural language processing', 'what is nlp'],
            answer: '📝 NLP (Natural Language Processing) enables computers to understand, interpret, and generate human language. Applications include chatbots, translation, sentiment analysis.'
        },
        {
            keywords: ['computer vision', 'cv', 'what is computer vision'],
            answer: '👁️ Computer Vision allows machines to interpret and analyze visual data (images/videos). Used in facial recognition, object detection, autonomous vehicles.'
        },
        {
            keywords: ['data science', 'what is data science', 'data scientist'],
            answer: '📊 Data Science combines statistics, programming, and domain knowledge to extract insights from data. It involves data cleaning, exploration, visualization, and machine learning.'
        },
        {
            keywords: ['pandas', 'numpy', 'python data libraries'],
            answer: '📚 Pandas is used for data manipulation (DataFrame). NumPy handles numerical operations and arrays. Matplotlib and Seaborn are for visualization.'
        },
        {
            keywords: ['sql', 'structured query language', 'what is sql'],
            answer: '🗄️ SQL (Structured Query Language) is used to manage relational databases. Commands include SELECT, INSERT, UPDATE, DELETE, JOIN.'
        },
        {
            keywords: ['digital marketing', 'seo', 'social media marketing', 'google ads', 'content marketing'],
            answer: '📢 Digital marketing promotes products or brands online using channels like SEO (search engine optimization), social media (Facebook, Instagram, LinkedIn), Google Ads, email marketing, and content marketing. It is a high-demand career.'
        },
        {
            keywords: ['seo', 'search engine optimization', 'what is seo'],
            answer: '🔍 SEO improves website visibility in search engine results (like Google). It includes keyword research, on-page optimization, backlinks, and technical SEO.'
        },
        {
            keywords: ['google ads', 'ppc', 'pay per click'],
            answer: '💰 Google Ads is an online advertising platform where advertisers bid on keywords and pay per click (PPC). Ads appear on search results and websites.'
        },
        {
            keywords: ['email marketing', 'newsletter'],
            answer: '📧 Email marketing involves sending targeted emails to a list of subscribers to promote products, share news, or build relationships. Tools: Mailchimp, Sendinblue.'
        },
        {
            keywords: ['cybersecurity', 'information security', 'what is cybersecurity'],
            answer: '🔒 Cybersecurity protects systems, networks, and data from digital attacks. Core principles: confidentiality, integrity, availability (CIA triad).'
        },
        {
            keywords: ['phishing', 'what is phishing'],
            answer: '🎣 Phishing is a social engineering attack where attackers send fraudulent emails or messages to trick victims into revealing sensitive information (passwords, credit cards).'
        },
        {
            keywords: ['malware', 'virus', 'trojan', 'ransomware'],
            answer: '🦠 Malware (malicious software) includes viruses, worms, Trojans, ransomware, spyware. Ransomware encrypts files and demands payment for decryption.'
        },
        {
            keywords: ['firewall', 'what is firewall'],
            answer: '🔥 A firewall monitors and filters incoming/outgoing network traffic based on security rules. It acts as a barrier between trusted internal networks and untrusted external networks.'
        },
        {
            keywords: ['encryption', 'symmetric', 'asymmetric', 'aes', 'rsa'],
            answer: '🔐 Encryption converts plaintext into ciphertext using an algorithm and key. Symmetric (same key for encryption/decryption, e.g., AES) and asymmetric (public/private key, e.g., RSA).'
        },
        {
            keywords: ['2fa', 'two factor authentication', 'mfa'],
            answer: '🔑 Two-factor authentication adds a second layer of security (e.g., SMS code, authenticator app) in addition to password. It significantly reduces account compromise risk.'
        },
        {
            keywords: ['ai ethics', 'ethical ai', 'responsible ai'],
            answer: '⚖️ AI Ethics deals with moral principles in designing and deploying AI systems. Key issues: bias, fairness, transparency, accountability, privacy, and non-maleficence (do no harm).'
        },
        {
            keywords: ['algorithmic bias', 'ai bias', 'discrimination'],
            answer: '🎯 Algorithmic bias occurs when AI models produce systematically prejudiced results due to biased training data or design flaws. This can lead to unfair treatment of certain groups.'
        },
        {
            keywords: ['explainability', 'black box', 'interpretability'],
            answer: '🔍 Explainability means AI decisions should be understandable to humans. "Black box" models (e.g., deep neural networks) are often hard to explain, which limits trust and accountability.'
        },
        {
            keywords: ['data privacy', 'consent', 'gdpr', 'informed consent'],
            answer: '🔏 Data privacy in AI requires that personal data is collected and used only with user consent, and that users are informed how their data will be used (informed consent). GDPR is a major regulation.'
        },
        {
        keywords: ['deepfake', 'ai synthetic media'],
        answer: '🎭 Deepfakes are AI-generated synthetic media where a person’s likeness is replaced with another’s. They raise serious ethical concerns about misinformation, identity theft, and fraud.'
        },
        {
            keywords: ['surveillance capitalism', 'data commodification'],
            answer: '📱 Surveillance capitalism refers to the commodification of personal data by companies (often without meaningful consent), using it for behavioral prediction and profit.'
        },
        {
            keywords: ['robustness', 'adversarial attack', 'ai safety'],
            answer: '🛡️ Robustness means AI systems should be reliable and resist adversarial attacks (small input perturbations that cause misclassification). Ensuring safety is critical for autonomous systems.'
        },
        {
            keywords: ['agile', 'scrum', 'sprint', 'agile methodology'],
            answer: '🔄 Agile is an iterative software development approach emphasizing collaboration, flexibility, and customer feedback. Scrum is a popular Agile framework with roles (Scrum Master, Product Owner), sprints (1-4 week cycles), and ceremonies (daily stand-up, sprint review, retrospective).'
        },
        {
            keywords: ['git', 'version control', 'github', 'what is git'],
            answer: '📂 Git is a distributed version control system that tracks changes in source code. GitHub is a hosting service for Git repositories, enabling collaboration, pull requests, and code review.'
        },
        {
            keywords: ['code review', 'pull request', 'code quality'],
            answer: '👀 Code review is the practice of having other developers examine code changes before merging. It improves code quality, catches bugs, ensures standards, and spreads knowledge.'
        },
        {
            keywords: ['technical debt', 'tech debt', 'what is technical debt'],
            answer: '🏗️ Technical debt is the implied cost of future rework caused by choosing an easy (short-term) solution instead of a better but more time-consuming approach. It can slow down development and increase maintenance costs.'
        },
        {
            keywords: ['ci/cd', 'continuous integration', 'continuous deployment', 'devops'],
            answer: '⚙️ CI/CD automates building, testing, and deploying software. Continuous Integration merges code frequently, running automated tests. Continuous Delivery/Deployment automatically deploys to staging/production after passing tests.'
        },
        {
            keywords: ['code of conduct', 'professional ethics', 'team behaviour'],
            answer: '📜 A code of conduct outlines expected behavior in a professional setting, promoting respect, inclusion, and preventing harassment. It is essential for healthy team culture.'
        },
        {
            keywords: ['refactoring', 'code refactoring'],
            answer: '🧹 Refactoring is restructuring existing code without changing its external behavior. It improves readability, reduces complexity, and makes the code easier to maintain.'
        },
        {
            keywords: ['software license', 'open source license', 'mit', 'gpl'],
            answer: '📄 A software license defines how software can be used, modified, and distributed. MIT license is permissive (can be used in proprietary software). GPL requires derivative works to also be open source (copyleft).'
        },
        {
            keywords: ['stand up', 'daily scrum', 'agile meeting'],
            answer: '🚀 Daily stand-up is a short (15-min) meeting where team members answer: what did I do yesterday, what will I do today, any blockers? It keeps the team aligned.'
        },
        {
            keywords: ['retrospective', 'sprint retrospective', 'agile retrospective'],
            answer: '📝 A retrospective is a meeting at the end of a sprint where the team reflects on what went well, what didn’t, and identifies actionable improvements for the next sprint.'
        },
        {
            keywords: ['product backlog', 'backlog grooming', 'user story'],
            answer: '📋 Product backlog is an ordered list of features, bug fixes, and tasks needed for the product. User stories are short descriptions of functionality from an end-user perspective (e.g., "As a user, I want to login so I can access my account").'
        },
        {
            keywords: ['career', 'job opportunities', 'after course', 'get job'],
            answer: '💼 Completing Pak eduTool courses can help you build skills for roles like web developer, data analyst, AI engineer, digital marketer, etc. We also provide career guidance, interview prep, and freelancing tips.'
        },
        {
            keywords: ['freelancing', 'upwork', 'fiverr', 'start freelancing'],
            answer: '🖥️ Freelancing platforms like Upwork and Fiverr allow you to offer services (web development, design, marketing). Build a portfolio, create a strong profile, and start with small projects to gain reviews.'
        },
        {
            keywords: ['resume', 'cv', 'build resume', 'portfolio'],
            answer: '📄 Highlight projects completed during courses, list skills, and include links to your GitHub or live demos. Our courses include real-world projects that you can showcase in your portfolio.'
        },
        {
            keywords: ['interview', 'technical interview', 'coding interview'],
            answer: '🎯 Prepare by practicing coding problems (LeetCode, HackerRank), reviewing core concepts (data structures, algorithms), and doing mock interviews. Pak eduTool courses include interview preparation modules.'
        },
        {
            keywords: ['github', 'portfolio projects', 'showcase work'],
            answer: '🐙 GitHub is an excellent place to host your code, collaborate, and demonstrate your skills. Upload your course projects, keep repositories organized, and write clear README files.'
        },
        {   
            keywords: ['study tips', 'learning advice', 'how to learn programming'],
            answer: '🧠 Practice consistently, build projects, break down problems, use documentation, join communities (Stack Overflow, Discord), and don’t be afraid to ask for help. Consistency beats intensity.'
        },
        {
            keywords: ['motivation', 'keep learning', 'stay motivated'],
            answer: '💪 Set small achievable goals, celebrate progress, connect with fellow learners, and remember why you started. Learning is a journey – every step forward counts!'
        },
        {
            keywords: ['course', 'pak edutool courses', 'what courses'],
            answer: '🎓 Pak eduTool offers courses in Python, Web Development, AI/ML, Data Science, Digital Marketing, Cybersecurity, and Graphic Design. Most are free to start!'
        },
        {
            keywords: ['certificate', 'get certificate', 'certification'],
            answer: '📜 Upon completing a course (100% progress), you can download a verified certificate. It’s recognized by employers and can be shared on LinkedIn.'
        },
        {
            keywords: ['price', 'paid courses', 'how much', 'cost'],
            answer: '💰 Pak eduTool has both free and paid courses. Paid courses range from PKR 3,999 to 7,999. Many free courses also offer certificates.'
        },
        {
            keywords: ['login', 'signup', 'account', 'register'],
            answer: '🔐 You can create a free account using the "Sign Up" button. After login, you can enroll in courses and track your progress from the dashboard.'
        },
        {
            keywords: ['instructor', 'who teaches', 'teachers'],
            answer: '👨‍🏫 Our instructors are industry experts: Dr. Angela Yu (Web Dev), Dr. Sarah Ahmed (Python), Dr. Fatima Ali (AI/ML), Ahmed Raza (Digital Marketing), and more.'
        },
        {
        keywords : ["time", "current time", "what time is it"],
         answer : '⏰ The current time depends on your location. Please enable location access or tell me your timezone. For UTC, use "time UTC".'
  },
  {
    keywords : ["date", "today's date", "what is the date"],
    answer : "📅 Today's date is [current date]. To get precise date, ask with your timezone."
  },
  {
    keywords : ["day", "what day is today", "day of week"],
    answer : "📆 Today is [current day]. For example, Monday."
  },
  {
    keywords : ["alarm", "set alarm", "remind me"],
    answer : "🔔 I can help you set reminders. Please say 'remind me at [time] to [task]'."
  },
  {
    keywords : ["weather", "temperature", "rain", "forecast"],
    answer : "🌤️ Please provide your city name for weather updates. Example: 'weather in Lahore'."
  },
  {
    keywords : ["news", "headlines", "top news", "latest news"],
    answer : "📰 Latest headlines: [Please specify country/category]. Try 'news Pakistan' or 'tech news'."
  },
  {
    keywords : ["sports", "cricket score", "match result", "football"],
    answer : "🏏 For live sports scores, please specify the match. Example: 'Pakistan vs India cricket score'."
  },
  {
    keywords : ["recipe", "cooking", "how to cook", "make food"],
    answer : "🍳 Here's a simple recipe: [Dish name]. Need ingredients? Tell me what food you want."
  },
  {
    keywords : ["breakfast ideas", "what to eat in morning"],
    answer : "🥞 Healthy breakfast ideas: oatmeal with fruits, eggs with toast, yogurt parfait, or smoothie."
  },
  {
    keywords : ["lunch ideas", "quick lunch", "packed lunch"],
    answer : "🥗 Quick lunch: chicken wrap, quinoa salad, leftover curry with rice, or sandwich with veggies."
  },
  {
    keywords : ["dinner ideas", "dinner recipe", "easy dinner"],
    answer : "🍛 Easy dinner: pasta with tomato sauce, stir-fry vegetables, lentil soup, or grilled fish with rice."
  },
  {
    keywords : ["workout", "exercise", "fitness routine", "home workout"],
    answer : "💪 15-min home workout: 30 sec jumping jacks, 30 sec squats, 30 sec push-ups, 30 sec rest, repeat 3 times."
  },
  {
    keywords : ["weight loss tips", "how to lose weight"],
    answer : "⚖️ Weight loss tips: eat more protein, drink water before meals, reduce sugar, walk 10k steps daily, sleep 7-8 hours."
  },
  {
    keywords : ["calories in", "food calories", "how many calories"],
    answer : "🍎 Calorie count depends on food. Example: 1 apple ~95 cal, 1 egg ~70 cal, 1 chapati ~120 cal."
  },
  {
    keywords : ["water reminder", "drink water", "hydration"],
    answer : "💧 Stay hydrated! Drink 8 glasses (2 liters) daily. Set hourly reminders with 'remind me every hour to drink water'."
  },
  {
    keywords : ["sleep", "how to sleep better", "insomnia"],
    answer : "😴 Sleep tips: avoid screens 1hr before bed, keep room dark, same bedtime daily, no caffeine after 4pm."
  },
  {
    keywords : ["to-do list", "tasks", "what to do today"],
    answer : "📝 To create a to-do list, tell me your tasks. Example: 'Add task: buy groceries, finish report, call mom'."
  },
  {
    keywords : ["schedule", "plan my day", "daily plan"],
    answer : "📅 Let's plan: 8am wake up, 9am work, 12pm lunch, 1pm meetings, 5pm exercise, 7pm dinner, 10pm sleep. Customize as needed."
  },
  {
    keywords : ["morning routine", "what to do in morning"],
    answer : "🌅 Morning routine: wake up, drink water, stretch, brush teeth, shower, breakfast, review day plan. Start at 6-7am."
  },
  {
    keywords : ["evening routine", "night routine"],
    answer : "🌙 Evening routine: finish work by 6pm, dinner at 7pm, family time, prepare for tomorrow, relax, sleep by 10pm."
  },
  {
    keywords : ["motivation", "motivational quote", "inspire me"],
    answer : "🌟 'The secret of getting ahead is getting started.' – Mark Twain. You've got this!"
  },
  {
    keywords : ["stress", "how to relax", "anxiety"],
    answer : "🧘 Relaxation tips: deep breathing (4 sec inhale, 4 hold, 6 exhale), meditation, walk outside, listen to music."
  },
  {
    keywords : ["learn a language", "language learning", "how to learn English"],
    answer : "🗣️ To learn English: practice 15 min daily, use flashcards, watch movies with subtitles, speak with others."
  },
  {
    keywords : ["study tips", "how to study effectively", "exam preparation"],
    answer : "📚 Study tips: Pomodoro (25 min study, 5 min break), active recall, summarize in own words, no phone nearby."
  },
  {
    keywords : ["math problem", "solve equation", "calculate"],
    answer : "🧮 Give me the math problem. Example: 'What is 25*14?' or 'Solve x+5=12'."
  },
  {
    keywords : ["spelling", "how to spell", "correct spelling"],
    answer : "🔤 Tell me the word. Example: 'spell necessary' -> N-E-C-E-S-S-A-R-Y."
  },
  {
    keywords : ["meaning", "definition", "what does * mean"],
    answer : "📖 Please provide the word. Example: 'meaning of pragmatic' -> dealing with things sensibly."
  },
  {
    keywords : ["synonym", "similar word", "another word for"],
    answer : "🔁 Give me the word. Example: 'synonym for happy' -> joyful, cheerful, delighted."
  },
  {
    keywords : ["translation", "translate to Urdu", "English to Urdu"],
    answer : "🌐 Translate: Send text. Example: 'translate hello to Urdu' -> السلام علیکم / Hello."
  },
  {
    keywords : ["currency convert", "USD to PKR", "exchange rate"],
    answer : "💱 Current exchange rates change daily. As of recent, 1 USD ≈ 280 PKR. For live rate, check a financial site."
  },
  {
    keywords : ["unit converter", "kg to pounds", "cm to inches"],
    answer : "📏 Conversion: 1 kg = 2.205 lbs, 1 cm = 0.394 inches. Tell me value: 'convert 10 kg to lbs'."
  },
  {
    keywords : ["time difference", "time zone", "what time in New York"],
    answer : "🕒 Time difference: Example: New York is UTC-5, London UTC+0, Dubai UTC+4, Karachi UTC+5. For exact, tell cities."
  },
  {
    keywords : ["distance", "how far", "distance between cities"],
    answer : "📍 Give two cities. Example: 'Distance Lahore to Islamabad' ~ 380 km by road."
  },
  {
    keywords : ["traffic", "road conditions", "jam"],
    answer : "🚗 Real-time traffic: Please enable location or specify city. General tip: avoid 8-9am and 5-7pm peak hours."
  },
  {
    keywords : ["public transport", "bus timing", "metro schedule"],
    answer : "🚌 Public transport schedules vary by city. Please specify city and route. Example: 'bus route 12 Lahore timing'."
  },
  {
    keywords : ["flight status", "plane delay", "airport"],
    answer : "✈️ For flight status, provide airline and flight number. Example: 'PK 301 status'."
  },
  {
    keywords : ["hotel near me", "accommodation", "place to stay"],
    answer : "🏨 To find hotels, please share your current location or city. Example: 'hotels in Islamabad'."
  },
  {
    keywords : ["restaurant near me", "food nearby", "best eatery"],
    answer : "🍽️ For restaurant recommendations, tell me your cuisine preference and city. Example: 'best biryani in Karachi'."
  },
  {
    keywords : ["movie recommendations", "what to watch", "good film"],
    answer : "🎬 Movie recommendations: Based on genre. Action: 'John Wick', Comedy: 'The Hangover', Drama: 'The Shawshank Redemption'. Tell me genre."
  },
  {
    keywords : ["tv series", "binge watch", "netflix show"],
    answer : "📺 Popular series: 'Stranger Things', 'The Crown', 'Money Heist', 'Wednesday'. Tell me your preference."
  },
  {
    keywords : ["song lyrics", "find lyrics", "song words"],
    answer : "🎵 Give me song name and artist. Example: 'lyrics of Shape of You Ed Sheeran'."
  },
  {
    keywords : ["music", "play song", "listen to"],
    answer : "🎧 I can't play music directly, but you can search on YouTube/Spotify. Tell me song name to suggest link."
  },
  {
    keywords : ["news about technology", "tech news", "gadgets"],
    answer : "📱 Tech news: Latest iPhone released, AI advancements, Samsung new foldable. For specific, ask 'tech news today'."
  },
  {
    keywords : ["stock market", "share price", "stock update"],
    answer : "📈 Stock prices fluctuate. Example: 'PSX index' or 'stock price for TELE'. For live data, use finance app."
  },
  {
    keywords : ["cryptocurrency", "bitcoin price", "ethereum"],
    answer : "₿ Crypto prices vary. Bitcoin ~$50-70k range typically. For live, ask 'bitcoin price now' but I need internet search."
  },
  {
    keywords : ["budget", "monthly expense", "save money"],
    answer : "💰 Budget tip: 50/30/20 rule – 50% needs, 30% wants, 20% savings. Track expenses with app."
  },
  {
    keywords : ["loan", "interest rate", "borrow money"],
    answer : "🏦 Interest rates vary by bank. Personal loan rates in Pakistan ~15-22% per year. Consult your bank."
  },
  {
    keywords : ["tax", "income tax calculation", "file tax"],
    answer : "🧾 Tax calculation: For Pakistan, income up to 600k PKR is exempt. Use FBR portal for exact. Not financial advice."
  },
  {
    keywords : ["recipe for biryani", "how to make biryani"],
    answer : "🍚 Biryani recipe: marinate chicken with yogurt & spices, partially cook rice, layer with fried onions, dum cook for 20 min. Detailed steps?"
  },
  {
    keywords : ["recipe for tea", "chai recipe", "how to make tea"],
    answer : "☕ Chai: boil water + milk (1:1), add sugar, tea leaves, cardamom, ginger. Simmer 5 min, strain, serve."
  },
  {
    keywords : ["recipe for coffee", "how to make coffee"],
    answer : "☕ Coffee: add 1 tsp coffee powder + sugar to cup, pour hot water/milk, stir. For espresso, use machine."
  },
  {
    keywords : ["cleaning tips", "house cleaning", "remove stains"],
    answer : "🧹 Cleaning: vinegar+baking soda for tough stains, lemon for shine, microfiber cloth for dust. For specific stain, tell me."
  },
  {
    keywords : ["laundry", "wash clothes", "remove stain from shirt"],
    answer : "👕 Laundry: separate colors, cold water for delicates, use detergent. For stain: rub with detergent immediately."
  },
  {
    keywords : ["gardening", "plant care", "water plants"],
    answer : "🌱 Gardening: water morning or evening, check soil moisture, provide sunlight. For specific plant, tell name."
  },
  {
    keywords : ["pet care", "dog feeding", "cat health"],
    answer : "🐕 Pet care: feed twice daily, fresh water, daily walk, vet checkup yearly. For specific breed, ask."
  },
  {
    keywords : ["child education", "homework help", "teach kid"],
    answer : "👧 For child homework, provide subject and grade. Example: '5th grade math fraction problem'."
  },
  {
    keywords : ["parenting tips", "raise child", "baby care"],
    answer : "👶 Parenting: set routines, positive reinforcement, read daily, limit screen time. Need specific age?"
  },
  {
    keywords : ["relationship advice", "partner conflict", "communication"],
    answer : "💑 Relationship tip: listen actively, use 'I feel' statements, take breaks when angry. For specific issue, describe."
  },
  {
    keywords : ["friendship", "make friends", "lonely"],
    answer : "🤝 To make friends: join clubs, volunteer, attend events, smile and start small talk. Be yourself."
  },
  {
    keywords : ["job interview", "interview questions", "how to prepare"],
    answer : "💼 Interview prep: research company, practice 'tell me about yourself', prepare questions, dress professionally."
  },
  {
    keywords : ["resume", "CV", "write resume"],
    answer : "📄 Resume: include contact, summary, experience (reverse chronological), skills, education. Use action verbs."
  },
  {
    keywords : ["email writing", "professional email", "how to write email"],
    answer : "📧 Formal email: Subject line, greeting (Dear Name), body (clear purpose), closing (Best regards), signature."
  },
  {
    keywords : ["cover letter", "job application letter"],
    answer : "✉️ Cover letter: introduce yourself, explain why you're suitable, mention one achievement, request interview."
  },
  {
    keywords : ["linkedin", "improve linkedin profile", "networking"],
    answer : "🔗 LinkedIn: professional photo, headline with keywords, detailed experience, skills endorsements, post regularly."
  },
  {
    keywords : ["freelancing", "upwork", "fiverr", "online work"],
    answer : "💻 Freelancing: create profile on Upwork/Fiverr, offer a skill (writing, design, dev), start with small gigs."
  },
  {
    keywords : ["productivity apps", "best to-do app", "time management"],
    answer : "📱 Productivity apps: Todoist, Trello, Notion, Google Keep, Forest (focus timer). Choose based on need."
  },
  {
    keywords : ["password", "forgot password", "reset password"],
    answer : "🔑 To reset password, use 'forgot password' link on login page. Use password manager like Bitwarden."
  },
  {
    keywords : ["virus", "computer slow", "malware"],
    answer : "🦠 Run antivirus scan (Windows Defender, Malwarebytes), clear temporary files, update system, restart."
  },
  {
    keywords : ["wifi not working", "internet down", "no connection"],
    answer : "📡 Troubleshoot: restart router, forget and reconnect, check cables, contact ISP. Need more details?"
  },
  {
    keywords : ["printer not printing", "printer error"],
    answer : "🖨️ Check: paper jam, ink levels, printer online, restart spooler. Tell me error message."
  },
  {
    keywords : ["phone battery draining", "battery health"],
    answer : "📱 Battery tips: reduce brightness, turn off Bluetooth/GPS, close background apps, avoid extreme temps."
  },
  {
    keywords : ["backup data", "backup photos", "icloud", "google drive"],
    answer : "☁️ Backup: use Google Photos for photos, Google Drive for files, iCloud for Apple, or external hard drive."
  },
  {
    keywords : ["what is AI", "artificial intelligence", "define AI"],
    answer : "🤖 AI is machines simulating human intelligence: learning, reasoning, problem-solving. I am an AI assistant."
  },
  {
    keywords : ["who created you", "your creator", "what company"],
    answer : "🏢 I was created by DeepSeek, a Chinese AI company. My knowledge cutoff is May 2025."
  },
  {
    keywords : ["capabilities", "what can you do", "help me"],
    answer : "✨ I can answer questions, translate, summarize, write code, solve math, give advice, and more. Ask anything!"
  },
  {
    keywords : ["limitations", "what you cannot do", "can you browse"],
    answer : "⚠️ I cannot browse the internet unless Web/App search is enabled. I have no real-time data. I don't remember past chats."
  },
  {
    keywords : ["joke", "tell me a joke", "funny"],
    answer : "😂 Why don't scientists trust atoms? Because they make up everything!"
  },
  {
    keywords : ["fun fact", "interesting fact", "did you know"],
    answer : "🧠 Did you know? Octopuses have three hearts and blue blood."
  },
  {
    keywords : ["riddle", "solve riddle", "puzzle"],
    answer : "🤔 Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Answer: Echo)"
  },
  {
    keywords : ["quote of the day", "daily quote"],
    answer : "📜 Quote: 'Believe you can and you're halfway there.' – Theodore Roosevelt"
  },
  {
    keywords : ["horoscope", "astrology", "zodiac sign"],
    answer : "♈ For horoscope, tell me your zodiac sign (e.g., 'Aries today'). Note: for entertainment only."
  },
  {
    keywords : ["lucky number", "fortune", "tell my fortune"],
    answer : "🍀 Your lucky number today is 7. (Just for fun!)"
  },
  {
    keywords : ["what to wear", "dress code", "clothing advice"],
    answer : "👗 Check weather. If sunny: light clothes, hat. Rainy: jacket, umbrella. Formal: suit or business casual."
  },
  {
    keywords : ["gift ideas", "what gift to buy", "present for friend"],
    answer : "🎁 Gift ideas: book, perfume, personalized mug, plant, chocolates, or gift card. Tell me about the person."
  },
  {
    keywords : ["birthday wishes", "happy birthday message"],
    answer : "🎂 'Happy Birthday! Wishing you joy, health, and success. May your day be as special as you are!'"
  },
  {
    keywords : ["anniversary wishes", "wedding anniversary"],
    answer : "💍 'Happy Anniversary! May your love continue to grow stronger each passing year.'"
  },
  {
    keywords : ["condolence message", "sorry for loss", "sympathy"],
    answer : "🕊️ 'I am deeply sorry for your loss. May you find peace and comfort during this difficult time.'"
  },
  {
    keywords : ["thank you message", "appreciation", "gratitude"],
    answer : "🙏 'Thank you so much for your help! I truly appreciate it.'"
  },
  {
    keywords : ["apology", "how to say sorry", "i'm sorry"],
    answer : "❤️ Sincere apology: 'I'm sorry for my mistake. I will do better next time. Please forgive me.'"
  },
  {
    keywords : ["first date tips", "what to do on date"],
    answer : "💕 First date: choose a casual place (coffee shop), listen actively, avoid controversial topics, smile."
  },
  {
    keywords : ["confidence", "how to be confident", "self esteem"],
    answer : "💪 Confidence: practice positive self-talk, set small goals, maintain good posture, accept failures as learning."
  },
  {
    keywords : ["procrastination", "stop procrastinating", "get things done"],
    answer : "⏳ Beat procrastination: break task into 5-min chunks, use Pomodoro, remove distractions, reward progress."
  },
  {
    keywords : ["public speaking", "stage fear", "speech tips"],
    answer : "🎤 Public speaking: prepare well, practice in mirror, deep breaths, focus on message not audience, start with a story."
  },
  {
    keywords : ["memory improvement", "remember things", "better memory"],
    answer : "🧠 Memory tips: use mnemonics, spaced repetition, get enough sleep, teach others, visualize information."
  },
  {
    keywords : ["critical thinking", "improve reasoning", "think better"],
    answer : "🤔 Critical thinking: question assumptions, seek evidence, consider alternatives, avoid logical fallacies."
  },
  {
    keywords : ["decision making", "how to decide", "choose between"],
    answer : "🎯 Decision making: list pros/cons, set priorities, limit options, sleep on it, trust intuition."
  },
  {
    keywords : ["time management", "manage time", "effective schedule"],
    answer : "⏲️ Time management: Eisenhower matrix (urgent/important), batch similar tasks, delegate, say no to low priorities."
  },
  {
    keywords : ["learn coding", "programming for beginners", "start coding"],
    answer : "💻 Start coding with Python: easy syntax. Free resources: Codecademy, freeCodeCamp, YouTube tutorials."
  },
  {
    keywords : ["html", "learn html", "web development basics"],
    answer : "🌐 HTML: structure web pages. Tags: <h1> heading, <p> paragraph, <a> link. Practice on W3Schools."
  },
  {
    keywords : ["css", "learn css", "style website"],
    answer : "🎨 CSS: style colors, fonts, layout. Example: 'color: blue; font-size: 16px;' Use Flexbox/Grid for layout."
  },
  {
    keywords : ["javascript", "learn js", "javascript basics"],
    answer : "📜 JavaScript: adds interactivity. Variables: let x = 5; Functions: function hello() { alert('Hi'); }"
  },
  {
    keywords : ["python", "python basics", "learn python"],
    answer : "🐍 Python: print('Hello'), if condition:, for loop, lists. Great for beginners."
  },
  {
    keywords : ["data science", "what is data science", "learn data science"],
    answer : "📊 Data science: analyze data using Python (pandas, numpy), statistics, machine learning. Start with Kaggle."
  },
  {
    keywords : ["machine learning", "ML basics", "AI vs ML"],
    answer : "🤖 Machine Learning: algorithms learn from data. Types: supervised, unsupervised, reinforcement. Use scikit-learn."
  },
  {
    keywords : ["chatgpt", "what is chatgpt", "openai"],
    answer : "💬 ChatGPT is an AI chatbot by OpenAI. I am DeepSeek, a different model."
  },
  {
    keywords : ["internet safety", "online security", "avoid scams"],
    answer : "🔒 Internet safety: use strong passwords, enable 2FA, don't share OTP, avoid suspicious links, verify before paying."
  },
  {
    keywords : ["online shopping", "buy from daraz", "amazon"],
    answer : "🛒 Online shopping: compare prices, read reviews, check return policy, use credit card for fraud protection."
  },
  {
    keywords : ["bank account", "open bank account", "best bank in Pakistan"],
    answer : "🏦 Popular banks in Pakistan: HBL, UBL, MCB, Alfalah, Faysal. Compare fees, digital app, branch access."
  },
  {
    keywords : ["credit card", "apply for credit card", "credit score"],
    answer : "💳 Credit card tips: pay full balance monthly, avoid high utilization (below 30%), check annual fees."
  },
  {
    keywords : ["loan calculator", "emi calculator", "monthly installment"],
    answer : "🧮 EMI = P * r * (1+r)^n / ((1+r)^n -1). Example: 100,000 loan at 12% for 1 year = EMI ~8,885. Tell me numbers."
  },
  {
    keywords : ["investment", "where to invest", "stock market for beginners"],
    answer : "📈 Investment: start with mutual funds or ETFs, diversify, long-term horizon. Consult financial advisor."
  },
  {
    keywords : ["saving account", "best saving account", "profit rate"],
    answer : "💰 Savings account profit rates in Pakistan ~5-9% p.a. for Islamic banks? Check current rates."
  },
  {
    keywords : ["remittance", "send money abroad", "exchange"],
    answer : "💸 Send money via Wise, Western Union, bank transfer. Compare fees and exchange rates."
  },
  {
    keywords : ["travel tips", "packing list", "travel essentials"],
    answer : "🧳 Packing: passport, tickets, charger, power bank, medicines, clothes for climate, toiletries, snacks."
  },
  {
    keywords : ["visa", "travel visa", "how to get visa"],
    answer : "🛂 Visa: apply at embassy, provide itinerary, bank statements, invitation letter. Process time varies."
  },
  {
    keywords : ["passport renewal", "lost passport", "passport application"],
    answer : "📘 For Pakistan: apply through online passport portal or regional office. Fees and timeline 2-6 weeks."
  },
  {
    keywords : ["health symptom", "fever", "cough", "headache"],
    answer : "🏥 I'm not a doctor. For fever: rest, hydrate, paracetamol. If severe or persistent, see a doctor."
  },
  {
    keywords : ["first aid", "cut", "burn", "injury"],
    answer : "🩹 First aid: cut – clean with water, apply antiseptic, bandage. Burn – cool under running water, cover loosely."
  },
  {
    keywords : ["medicine", "dosage", "take medicine"],
    answer : "💊 Always follow doctor's prescription. Never self-medicate. For over-the-counter, read label carefully."
  },
  {
    keywords : ["pregnancy", "baby development", "expecting"],
    answer : "🤰 Pregnancy: take folic acid, avoid alcohol/smoking, attend prenatal checkups. Consult OB-GYN."
  },
  {
    keywords : ["vaccination", "vaccine schedule", "covid vaccine"],
    answer : "💉 Vaccination schedules: for children, follow EPI Pakistan. For adults, tetanus booster every 10 years."
  },
  {
    keywords : ["mental health", "depression", "sad"],
    answer : "🧠 Mental health matters. Talk to a friend, therapist, or helpline (e.g., Umang 1166 in PK). You're not alone."
  },
  {
    keywords : ["nutrition", "balanced diet", "healthy eating"],
    answer : "🥦 Balanced diet: half plate veggies, quarter protein, quarter carbs. Drink water, limit processed food."
  },
  {
    keywords : ["vitamins", "vitamin D", "supplements"],
    answer : "💊 Vitamin D: sunlight 15 min daily. For supplements, consult doctor. Excess can be harmful."
  },
  {
    keywords : ["home remedy", "natural remedy", "cold remedy"],
    answer : "🌿 For cold: ginger tea with honey, steam inhalation, gargle salt water, rest. Not a substitute for medicine."
  },
  {
    keywords : ["yoga", "yoga poses", "morning yoga"],
    answer : "🧘 Morning yoga: Cat-Cow, Downward Dog, Sun Salutation. Hold each for 5 breaths. Great for flexibility."
  },
  {
    keywords : ["meditation", "how to meditate", "mindfulness"],
    answer : "🧎 Meditation: sit comfortably, focus on breath, thoughts come and go. Start 5 minutes daily. Use apps like Headspace."
  },
  {
    keywords : ["quit smoking", "stop smoking", "smoking addiction"],
    answer : "🚭 Quit smoking: set quit date, use nicotine patches, avoid triggers, seek support. Benefit: health improves within days."
  },
  {
    keywords : ["reduce sugar intake", "no sugar", "sugar free diet"],
    answer : "🍬 Reduce sugar: cut sodas, choose whole fruits, read labels, use stevia. Gradual reduction works best."
  },
  {
    keywords : ["gluten free", "gluten allergy", "celiac disease"],
    answer : "🌾 Gluten-free: avoid wheat, barley, rye. Eat rice, corn, quinoa, potatoes. Consult dietitian."
  },
  {
    keywords : ["keto diet", "ketogenic", "low carb diet"],
    answer : "🥑 Keto: high fat (70%), moderate protein (25%), low carb (5%). Eat meat, eggs, cheese, nuts, leafy greens."
  },
  {
    keywords : ["intermittent fasting", "IF", "fasting benefits"],
    answer : "⏰ Intermittent fasting: 16:8 method (fast 16h, eat 8h window). Drink water/black coffee. Consult doctor if health issues."
  },
  {
    keywords : ["vegan", "vegan diet", "plant based"],
    answer : "🌱 Vegan: no animal products. Get protein from beans, lentils, tofu, nuts. Supplement B12."
  },
  {
    keywords : ["energy boost", "tired", "fatigue"],
    answer : "⚡ Boost energy: drink water, take a walk, eat a banana, nap 10-20 min, reduce caffeine after 2pm."
  },
  {
    keywords : ["focus", "concentration", "avoid distraction"],
    answer : "🎯 Improve focus: work in quiet space, use noise-cancelling headphones, turn off phone notifications, take breaks."
  },
  {
    keywords : ["creativity", "be more creative", "creative block"],
    answer : "🎨 Creativity: brainstorm without judgment, change environment, listen to music, try mind mapping, take a shower."
  },
  {
    keywords : ["problem solving", "solve a problem", "find solution"],
    answer : "🔧 Problem solving: define problem clearly, list possible solutions, evaluate pros/cons, implement, review."
  },
  {
    keywords : ["negotiation", "how to negotiate", "salary negotiation"],
    answer : "🤝 Negotiation: research market rate, know your value, be confident, ask open-ended questions, aim for win-win."
  },
  {
    keywords : ["leadership", "be a good leader", "leader qualities"],
    answer : "👑 Leadership: listen actively, inspire vision, delegate, take responsibility, give credit, stay calm under pressure."
  },
  {
    keywords : ["teamwork", "collaboration", "work with others"],
    answer : "🤝 Teamwork: communicate clearly, respect opinions, share credit, help others, resolve conflicts constructively."
  },
  {
    keywords : ["presentation skills", "powerpoint", "slide design"],
    answer : "📽️ Presentation: less text, more visuals, practice out loud, eye contact, handle Q&A with confidence."
  },
  {
    keywords : ["writing skills", "improve writing", "write better"],
    answer : "✍️ Writing tips: read daily, write daily, use active voice, avoid jargon, edit ruthlessly, get feedback."
  },
  {
    keywords : ["grammar check", "correct grammar", "sentence correction"],
    answer : "📝 Provide your sentence. Example: 'He go to school' -> 'He goes to school'."
  },
  {
    keywords : ["punctuation", "comma usage", "semicolon"],
    answer : "🔖 Punctuation: comma for lists, period for end, semicolon for related clauses. Example: 'I have apples, oranges, and bananas.'"
  },
  {
    keywords : ["essay", "write an essay", "essay topic"],
    answer : "📄 Give me topic and length. Example: 'Write 500-word essay on climate change'."
  },
  {
    keywords : ["story", "write a story", "short story"],
    answer : "📖 Give a prompt, e.g., 'Write a story about a lost cat'. I'll create a short story."
  },
  {
    keywords : ["poem", "write a poem", "poetry"],
    answer : "📜 Give theme (love, nature, etc.) or rhyme scheme. Example: 'Write a haiku about spring'."
  },
  {
    keywords : ["resignation letter", "quit job", "resign email"],
    answer : "📧 Resignation: 'Dear Manager, Please accept this letter as my resignation effective [date]. Thank you for opportunities. Sincerely, [Name]'"
  },
  {
    keywords : ["apology letter", "sorry letter", "formal apology"],
    answer : "💌 Apology letter: 'Dear [Name], I'm sorry for [action]. I understand it caused [impact]. I will [corrective action]. Please forgive me.'"
  },
  {
    keywords : ["recommendation letter", "reference letter", "letter of recommendation"],
    answer : "📜 Recommendation: 'To whom it may concern, I highly recommend [Name] who worked as [role]. He/she demonstrated [skills]. Sincerely, [Referee]'"
  },
  {
    keywords : ["leave application", "sick leave", "vacation request"],
    answer : "🏖️ Leave email: 'Subject: Leave request from [date] to [date]. Dear [Manager], I request leave due to [reason]. Thank you.'"
  },
  {
    keywords : ["meeting agenda", "schedule meeting", "meeting minutes"],
    answer : "📋 Meeting agenda: 1) Welcome, 2) Review previous action items, 3) Topic A (10 min), 4) Topic B (15 min), 5) Next steps."
  },
  {
    keywords : ["zoom", "how to use zoom", "join meeting"],
    answer : "🎥 Zoom: download app, click join link or enter meeting ID & passcode. Test audio/video before meeting."
  },
  {
    keywords : ["google meet", "hangouts", "video call"],
    answer : "📞 Google Meet: use Gmail or Calendar. Create meeting, share link. No installation needed, works in browser."
  },
  {
    keywords : ["whatsapp web", "use whatsapp on pc"],
    answer : "💬 WhatsApp Web: open web.whatsapp.com, scan QR code from phone app (Linked Devices). Keep phone connected."
  },
  {
    keywords : ["facebook", "social media", "fb tips"],
    answer : "📘 Facebook: adjust privacy settings, unfollow annoying pages, use groups for communities, limit daily usage."
  },
  {
    keywords : ["instagram", "ig tips", "instagram growth"],
    answer : "📸 Instagram: post high-quality photos, use hashtags (5-10), engage with comments, use Stories daily."
  },
  {
    keywords : ["tiktok", "short video", "tiktok tips"],
    answer : "🎵 TikTok: trending sounds, hooks in first 3 seconds, use effects, post at peak hours (6-9pm), interact with comments."
  },
  {
    keywords : ["youtube", "youtube tips", "grow youtube channel"],
    answer : "▶️ YouTube: consistent niche, clickable thumbnails, SEO titles, engage comments, collaborate, upload weekly."
  },
  {
    keywords : ["email to professor", "write to teacher", "academic email"],
    answer : "📧 'Dear Professor [Name], I am [name] from your [class]. I have a question about [topic]. Thank you. Sincerely, [Your name]'"
  },
  {
    keywords : ["scholarship", "apply for scholarship", "study abroad"],
    answer : "🎓 Scholarships: check local (HEC Pakistan) and international (Fulbright, Commonwealth). Prepare essays and recommendation letters."
  },
  {
    keywords : ["university admission", "college application", "how to apply"],
    answer : "🏛️ University admission: research deadlines, prepare transcripts, write personal statement, take entry tests (SAT, ECAT, MDCAT)."
  },
  {
    keywords : ["school homework", "homework help", "solve homework"],
    answer : "📚 Give me subject and question. Example: 'Solve 5x+3=18' or 'Explain photosynthesis'."
  },
  {
    keywords : ["physics question", "physics help", "force formula"],
    answer : "⚛️ Physics question? Example: F=ma (force = mass × acceleration). Provide specifics."
  },
  {
    keywords : ["chemistry", "chemical equation", "periodic table"],
    answer : "🧪 Chemistry: H2O is water. Balance equation? Example: H2 + O2 -> H2O becomes 2H2 + O2 -> 2H2O."
  },
  {
    "keywords": ["biology", "human body", "cell structure"],
    "answer": "🧬 Biology: cell has nucleus, mitochondria, ribosomes. Need specific topic (e.g., photosynthesis, DNA)."
  },
  {
    keywords : ["history", "historical event", "world war 2"],
    answer : "📜 History: WWII lasted 1939-1945, main Allied powers: US, UK, USSR; Axis: Germany, Italy, Japan. More details?"
  },
  {
    keywords : ["geography", "capital of", "country facts"],
    answer : "🌍 Capital of Pakistan is Islamabad. Capital of France is Paris. Ask for any country."
  },
  {
    keywords : ["general knowledge", "gk question", "quiz"],
    answer : "🧠 GK: What is the largest ocean? Pacific. Who painted Mona Lisa? Da Vinci. Want more quiz questions?"
  },
  {
    keywords : ["current affairs", "today's current affairs", "latest happenings"],
    answer : "📰 For current affairs, please enable web search or specify a date. I can tell known events up to May 2025."
  },
  {
    keywords : ["pakistan", "information about pakistan", "pakistan history"],
    answer : "🇵🇰 Pakistan: independence 1947, capital Islamabad, language Urdu, currency PKR. Famous for K2 mountain, Indus River."
  },
  {
    keywords : ["india", "india facts", "neighbor country"],
    answer : "🇮🇳 India: capital New Delhi, population over 1.4B, currency INR, famous for Taj Mahal, Bollywood."
  },
  {
    keywords : ["usa", "america", "united states facts"],
    answer : "🇺🇸 USA: capital Washington D.C., 50 states, currency USD, famous for Grand Canyon, Statue of Liberty."
  },
  {
    keywords : ["uk", "united kingdom", "britain"],
    answer : "🇬🇧 UK: composed of England, Scotland, Wales, Northern Ireland. Capital London, currency GBP. Famous for monarchy."
  },
  {
    keywords : ["china", "china facts", "great wall"],
    answer : "🇨🇳 China: capital Beijing, population 1.4B, currency Renminbi, famous for Great Wall, pandas, technology."
  },
  {
    keywords : ["uae", "dubai", "abu dhabi"],
    answer : "🇦🇪 UAE: seven emirates, capital Abu Dhabi, Dubai known for Burj Khalifa. Currency AED (dirham)."
  },
  {
    keywords : ["saudi arabia", "saudi", "mecca"],
    answer : "🇸🇦 Saudi Arabia: capital Riyadh, currency SAR. Home to Mecca and Medina, important for Muslims."
  },
  {
    keywords : ["turkey", "istanbul", "turkish"],
    answer : "🇹🇷 Turkey: capital Ankara, Istanbul largest city, currency Lira, famous for Hagia Sophia, kebabs."
  },
  {
    keywords : ["canada", "canada facts", "toronto"],
    answer : "🇨🇦 Canada: capital Ottawa, currency CAD, known for Niagara Falls, maple syrup, cold winters."
  },
  {
    keywords : ["australia", "australia facts", "sydney"],
    answer : "🇦🇺 Australia: capital Canberra, currency AUD, famous for Sydney Opera House, kangaroos, Great Barrier Reef."
  },
  {
    keywords : ["europe", "countries in europe", "eu"],
    answer : "🇪🇺 Europe has 44+ countries. Major: Germany, France, Italy, Spain. EU uses Euro for many."
  },
  {
    keywords : ["africa", "african countries", "sahara"],
    answer : "🌍 Africa: 54 countries, largest Nigeria, famous for Sahara desert, Nile river, wildlife safaris."
  },
  {
    keywords : ["science news", "new invention", "space news"],
    answer : "🚀 Science news: NASA's Artemis missions, James Webb discoveries, AI breakthroughs. For specific, ask 'latest science'."
  },
  {
    keywords : ["space", "solar system", "planets"],
    answer : "🪐 Solar system: Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Pluto is dwarf planet."
  },
  {
    keywords : ["moon", "lunar phases", "moon today"],
    answer : "🌙 Moon phases: new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, third quarter, waning crescent."
  },
  {
    keywords : ["sun", "solar flare", "sun facts"],
    answer : "☀️ Sun: a star, 4.6 billion years old, surface temp 5500°C, provides Earth with light and energy."
  },
  {
    keywords : ["black hole", "what is black hole", "event horizon"],
    answer : "⚫ Black hole: region with extreme gravity, nothing escapes, detected by gravitational waves. Sagittarius A* in Milky Way."
  },
  {
    keywords : ["climate change", "global warming", "carbon footprint"],
    answer : "🌎 Climate change: caused by greenhouse gases. Effects: rising seas, extreme weather. Solutions: renewable energy, reduce waste."
  },
  {
    keywords : ["recycling", "how to recycle", "waste management"],
    answer : "♻️ Recycling: separate paper, plastic, glass, metal. Clean items before recycling. Compost organic waste."
  },
  {
    keywords : ["electric car", "ev", "tesla"],
    answer : "🔋 Electric car: battery powered, zero tailpipe emissions. Popular models: Tesla, Nissan Leaf, BYD. Charging at home or station."
  },
  {
    keywords : ["solar panel", "solar energy", "renewable"],
    answer : "☀️ Solar panels convert sunlight to electricity. Save on bills, but upfront cost. Federal and provincial subsidies may apply."
  },
  {
    keywords : ["electricity bill", "save electricity", "reduce bill"],
    answer : "💡 Save electricity: use LED bulbs, turn off idle devices, adjust AC to 24°C, unplug chargers."
  },
  {
    keywords : ["water saving", "conserve water", "reduce water usage"],
    answer : "💧 Save water: fix leaks, take shorter showers, use bucket not hose, turn off tap while brushing."
  },
  {
    keywords : ["politics", "prime minister", "government"],
    answer : "🏛️ For current political info, enable web search. As of my knowledge, general structures exist (presidential vs parliamentary)."
  },
  {
    keywords : ["election", "voting", "how to vote"],
    answer : "🗳️ To vote, register in your constituency. Bring CNIC to polling station. Exercise your right."
  },
  {
    keywords : ["law", "legal advice", "lawyer"],
    answer : "⚖️ I cannot give legal advice. Consult a qualified lawyer for specific legal matters."
  },
  {
    keywords : ["police", "file complaint", "report crime"],
    answer : "👮 For emergencies, call 15 (Pakistan). To file complaint, visit nearest police station or use online portal."
  },
  {
    keywords : ["passing away", "death", "funeral"],
    answer : "🕊️ Sorry for your loss. In Islam, burial as soon as possible. In other faiths, follow traditions. Seek support from loved ones."
  },
  {
    keywords : ["marriage", "nikah", "wedding planning"],
    answer : "💒 Nikah (Islamic marriage) requires bride, groom, two witnesses, wali (guardian), and mahr (dower). Register with union council."
  },
  {
    keywords : ["divorce", "talaq", "separation"],
    answer : "📜 Divorce in Pakistan: talaq pronouncement, arbitration period (90 days), registration with union council. Seek legal counsel."
  },
  {
    keywords : ["child custody", "children after divorce", "guardianship"],
    answer : "👨‍👧 Child custody in Pakistan: generally mother has custody until certain age (7 for boy, puberty for girl), father as guardian. Court decides."
  },
  {
    keywords : ["property", "buy house", "real estate"],
    answer : "🏠 Buying property: verify ownership via Fard/registry, check no dues, hire lawyer, register at sub-registrar."
  },
  {
    keywords : ["rent agreement", "lease", "tenant rights"],
    answer : "📄 Rent agreement: include rent amount, deposit, duration, maintenance terms. Both parties sign. Stamped paper recommended."
  },
  {
    keywords : ["car purchase", "buy used car", "car loan"],
    answer : "🚗 Used car: check chassis number, service history, test drive, get mechanic inspection. Financing available via banks."
  },
  {
    keywords : ["driving license", "learn driving", "license test"],
    answer : "📘 Driving license in Pakistan: learner permit (valid 6 months), then driving test at excise office. Bring CNIC and fee."
  },
  {
    keywords : ["vehicle registration", "number plate", "excise"],
    answer : "🚙 Vehicle registration: submit invoice, CNIC, insurance to excise department. Pay tax and get registration book."
  },
  {
    keywords : ["insurance", "car insurance", "health insurance"],
    answer : "🛡️ Insurance types: car (third-party or comprehensive), health (individual/family), life. Compare policies online."
  },
  {
    keywords : ["job in Pakistan", "find job", "employment"],
    answer : "💼 Job portals: Rozee.pk, Mustakbil.com, LinkedIn. Also check newspaper classifieds (Jang, Dawn)."
  },
  {
    keywords : ["salary in Pakistan", "average salary", "minimum wage"],
    answer : "💰 Minimum wage in Punjab (2024) is 32,000 PKR. Average salary varies by field: IT ~50-150k, teaching ~30-60k."
  },
  {
    keywords : ["business idea", "start business", "small business"],
    answer : "💡 Business ideas: online tutoring, food delivery, freelancing, e-commerce (Daraz), boutique, home bakery."
  },
  {
    keywords : ["loan for business", "bank loan", "small business loan"],
    answer : "🏦 Business loan: visit bank with business plan, collateral, and financials. SMEDA offers support for SMEs."
  },
  {
    keywords : ["tax filing", "file income tax", "FBR"],
    answer : "📑 File tax via FBR's IRIS portal. Deadlines: December 15 for individuals. Late filing incurs penalty."
  },
  {
    keywords : ["national identity card", "CNIC", "NADRA"],
    answer : "🪪 CNIC: apply at NADRA office, bring B-form (if child) or old CNIC, pay fee, get slip. Delivery in 2 weeks."
  },
  {
    keywords : ["passport", "passport application", "renew passport"],
    answer : "📕 Apply online at DGIP or regional passport office. Fee and processing varies. Normal ~2 weeks, urgent ~3 days."
  },
  {
    keywords : ["electricity bill duplicate", "loss of bill", "bill copy"],
    answer : "⚡ Get duplicate bill from LESCO/K-Electric/IESCO website using reference number. Or visit customer service."
  },
  {
    keywords : ["gas bill", "sui gas", "sngepl"],
    answer : "🔥 Sui gas bill duplicate available at SNGEPl website. Enter consumer number or reference number."
  },
  {
    keywords : ["water bill", "wasa", "water supply"],
    answer : "💧 Water bill: for WASA cities (Lahore, etc.), check online using account number or visit WASA office."
  },
  {
    keywords : ["internet packages", "broadband", "PTCL", "StormFiber"],
    answer : "🌐 Internet packages in Pakistan: PTCL (Flash Fiber), StormFiber, Nayatel, Transworld. Speeds from 15 Mbps to 100+ Mbps."
  },
  {
    keywords : ["mobile packages", "jazz", "zong", "ufone", "telenor"],
    answer : "📱 Mobile packages: Jazz offers daily/weekly bundles. Zong 4G has social media packages. Check apps for current offers."
  },
  {
    keywords : ["load shedding", "power outage", "electricity schedule"],
    answer : "💡 Load shedding schedule available on distribution company's app (e.g., LESCO). Or SMS your reference number."
  },
  {
    keywords : ["weather today", "karachi weather", "lahore weather"],
    answer : "🌡️ For weather in Karachi: typically warm/humid. Tell me city for precise forecast (requires search)."
  },
  {
    keywords : ["air quality", "AQI", "pollution"],
    answer : "😷 Air quality in Lahore is often unhealthy (AQI 150-300). Use masks, air purifier. Check IQAir for live data."
  },
  {
    keywords : ["emergency number", "police helpline", "ambulance"],
    answer : "🚨 Pakistan emergency numbers: Police 15, Rescue 1122, Fire 16, Ambulance 115 (some cities)."
  },
  {
    keywords : ["road accident", "car crash", "report accident"],
    answer : "🚑 Call 1122 for medical and 15 for police. Take photos, exchange information, file FIR at nearest police station."
  },
  {
    keywords : ["lost phone", "stolen phone", "block SIM"],
    answer : "📱 Lost phone: call operator to block SIM (e.g., Jazz 111), file report at police station, block IMEI via PTA website."
  },
  {
    keywords : ["dowry", "jahez", "islamic perspective"],
    answer : "📿 In Islam, dowry (jahez) is discouraged; mahr (gift from husband to wife) is mandatory. Dowry demands are unlawful."
  },
  {
    keywords : ["haram", "halal", "islamic ruling"],
    answer : "🕌 For Islamic rulings, consult a qualified scholar. Generally, halal is permitted, haram is forbidden (e.g., alcohol, pork, interest)."
  },
  {
    keywords : ["prayer times", "namaz timing", "salah schedule"],
    answer : "🕋 Prayer times depend on city. Example for Lahore: Fajr ~4:30am, Zuhr ~12:00pm, Asr ~4:00pm, Maghrib ~6:30pm, Isha ~8:00pm. Use app for accurate."
  },
  {
    keywords : ["qibla direction", "find qibla", "which way to pray"],
    answer : "🧭 Qibla direction from Pakistan is towards West-Southwest (approx 260°). Use compass app or mosque indicator."
  },
  {
    keywords : ["ramadan", "roza", "fasting hours"],
    answer : "🌙 Ramadan fasting from dawn to sunset. Pre-dawn meal (sehri), break fast (iftar) with dates and water. Duration ~13-15 hours based on season."
  },
  {
    keywords : ["eid", "eid ul fitr", "eid prayers"],
    answer : "🎉 Eid ul Fitr marks end of Ramadan. Eid prayer followed by sermons, charity (fitrana), family visits."
  },
  {
    keywords : ["hajj", "umrah", "pilgrimage"],
    answer : "🕋 Hajj is mandatory once in lifetime for those able. Umrah is optional. Both performed in Mecca. Requires visa and arrangements."
  },
  {
    keywords : ["zakat", "calculate zakat", "zakat nisab"],
    answer : "💰 Zakat is 2.5% of savings exceeding nisab (value of 87.48g gold or 612.36g silver). Payable after one lunar year."
  },
  {
    keywords : ["quran", "read quran", "quran translation"],
    answer : "📖 The Holy Quran has 114 surahs. Translations available in Urdu (e.g., by Maulana Maududi). Online at Quran.com."
  },
  {
    keywords : ["hadith", "prophet sayings", "sunnah"],
    answer : "📚 Hadith collections: Sahih Bukhari, Muslim. Example: 'Seeking knowledge is obligation on every Muslim.'"
  },
  {
    keywords : ["birthday in islam", "celebrate birthday", "is birthday haram"],
    answer : "🕋 Many scholars say birthday celebrations are not from Sunnah but not strictly haram if no impermissible acts. Differing opinions."
  },
  {
    keywords : ["music in islam", "is music haram", "singing"],
    answer : "🎵 Scholarly opinions differ. Some say musical instruments are haram except duff; others allow if lyrics are clean. Consult your scholar."
  },
  {
    keywords : ["beard in islam", "keep beard", "shaving beard"],
    answer : "🧔 Majority scholars say keeping beard (fist-length) is sunnah and recommended, shaving is discouraged. Varying views."
  },
  {
    keywords : ["hijab", "headscarf", "veil"],
    answer : "🧕 Hijab is mandatory for Muslim women (Quran 24:31). Covers hair, neck, chest except face and hands per many scholars."
  },
  {
    keywords : ["interest", "riba", "bank interest haram"],
    answer : "💸 Riba (interest) is strictly haram in Islam. Muslims should avoid conventional loans/accounts. Use Islamic banking."
  },
  {
    keywords : ["Islamic banking", "halal banking", "murabaha"],
    answer : "🏦 Islamic banks (Meezan, HBL Islamic) use profit-sharing (Mudarabah) or cost-plus (Murabaha) instead of interest."
  },
  {
    keywords : ["nikah procedure", "marriage in islam", "nikah conditions"],
    answer : "💍 Nikah requires: consent of bride & groom, wali (guardian), two male witnesses, mahr (dower). Khutbah and contract."
  },
  {
    keywords : ["talaq in islam", "divorce", "three divorces"],
    answer : "📜 Talaq: pronounce once during tuhr, then waiting period (iddah 3 months). Triple talaq in one sitting is major sin per many scholars."
  },
  {
    keywords : ["halal food", "halal meat", "zabiha"],
    answer : "🍗 Halal meat: animal slaughtered in Allah's name with sharp knife, draining blood. Avoid pork, carnivores, carrion."
  },
  {
    keywords : ["fasting monday thursday", "sunnah fast", "nafl fast"],
    answer : "🥗 Fasting on Mondays and Thursdays is sunnah. Also white days (13th,14th,15th of lunar month)."
  },
  {
    keywords : ["tahajjud", "night prayer", "qiyam ul layl"],
    answer : "🌙 Tahajjud prayer after Isha before Fajr, minimum 2 rakats. Highly recommended for forgiveness."
  },
  {
    keywords : ["istikhara", "prayer for decision", "guidance"],
    answer : "🤲 Istikhara: 2 rakats non-obligatory prayer, then supplication for guidance on any decision. Not a dream necessarily."
  },
  {
    keywords : ["darood sharif", "salawat", "blessings on prophet"],
    answer : "🕊️ Darood: 'Allahumma salli ala Muhammad...' Reciting brings blessings. Recommended after prayers."
  },
  {
    keywords : ["asma ul husna", "99 names of Allah", "Allah names"],
    answer : "🕋 99 Names: Ar-Rahman (The Merciful), Al-Malik (The King), Al-Quddus (The Holy), etc. Recited for blessings."
  },
  {
    keywords : ["jummah", "friday prayer", "congregational prayer"],
    answer : "🕌 Jummah replaces Zuhr on Friday. Requires khutbah (sermon), two rakats. Important to attend."
  },
  {
    keywords : ["sunnah prayers", "rawatib", "optional prayers"],
    answer : "🕋 Rawatib: 2 before Fajr, 4 before Zuhr + 2 after, 2 after Maghrib, 2 after Isha. Highly rewarded."
  },
  {
    keywords : ["wudu", "ablution", "how to do wudu"],
    answer : "💧 Wudu: wash hands (3x), mouth (3x), nose (3x), face (3x), arms to elbows (3x), wipe head, ears, wash feet (3x)."
  },
  {
    keywords : ["ghusl", "full bath", "ritual purification"],
    answer : "🛁 Ghusl: intention, wash private parts, perform wudu, pour water over head 3x, wash right side then left, ensure every part."
  },
  {
    keywords : ["tayammum", "dry ablution", "no water"],
    answer : "🏜️ Tayammum: strike palms on clean earth/stone, wipe face, then wipe hands up to wrists. Replaces wudu when water unavailable or harmful."
  },
  {
    keywords : ["islamic calendar", "hijri date", "islamic month"],
    answer : "📅 Islamic calendar: 12 lunar months. Today's Hijri date? Example: 15 Shawwal 1445. Use app for current."
  },
  {
    keywords : ["muharram", "ashura", "10th muharram"],
    answer : "📆 Muharram first month. Ashura (10th) - Sunni fast; Shia commemorate Karbala martyrdom. Differing practices."
  },
  {
    keywords : ["rabi ul awwal", "milad un nabi", "prophet birth"],
    answer : "🕋 12th Rabi ul Awwal: birth of Prophet Muhammad (PBUH). Celebrations vary; some consider bid'ah, others permissible as remembrance."
  },
  {
    keywords : ["shab e barat", "night of forgiveness", "15th shaban"],
    answer : "🌙 15th Shaban: Laylat al-Bara'ah. Some pray and seek forgiveness; some consider it not established from authentic hadith."
  },
    ];

    // Helper function to find answer from local knowledge base
 function getLocalAnswer(question) {
    const lowerQ = question.toLowerCase();
    // First try exact keyword inclusion (fast)
    for (let item of knowledgeBase) {
        for (let kw of item.keywords) {
            if (lowerQ.includes(kw.toLowerCase())) {
                return item.answer;
            }
        }
    }
    // If no exact match, try fuzzy matching on tokens
    const words = lowerQ.split(/\s+/);
    let bestMatch = null;
    let highestScore = 0;
    for (let item of knowledgeBase) {
        for (let kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            // Check if any word in query matches keyword fuzzily
            for (let w of words) {
                if (isSimilar(kwLower, w, 2)) {
                    // Give preference to longer keyword matches
                    const score = kwLower.length / Math.max(1, Math.abs(kwLower.length - w.length));
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = item.answer;
                    }
                }
            }
        }
    }
    return bestMatch;
}

    // ==================== UI Elements ====================
    const API_URL = '/api/chatbot';  // OpenAI backend endpoint (optional)

    // Floating button
    const btn = document.createElement('button');
    btn.textContent = '💬';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.borderRadius = '50%';
    btn.style.backgroundColor = '#1e3c72';
    btn.style.color = 'white';
    btn.style.fontSize = '28px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '999999';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    btn.style.transition = 'transform 0.2s';
    btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';
    document.body.appendChild(btn);

    let chatWindow = null;
    let messagesContainer = null;

    function createChatWindow() {
        const win = document.createElement('div');
        win.style.position = 'fixed';
        win.style.bottom = '90px';
        win.style.right = '20px';
        win.style.width = '350px';
        win.style.height = '500px';
        win.style.backgroundColor = 'white';
        win.style.borderRadius = '16px';
        win.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        win.style.display = 'none';
        win.style.flexDirection = 'column';
        win.style.overflow = 'hidden';
        win.style.zIndex = '999999';
        win.style.border = '1px solid #e2e8f0';

        // Header
        const header = document.createElement('div');
        header.style.backgroundColor = '#1e3c72';
        header.style.color = 'white';
        header.style.padding = '12px 16px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.fontWeight = 'bold';
        header.innerHTML = '<span>🎓 Pak EduTool Assistant</span><button id="closeChatBtn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">✕</button>';

        // Messages container
        messagesContainer = document.createElement('div');
        messagesContainer.style.flex = '1';
        messagesContainer.style.overflowY = 'auto';
        messagesContainer.style.padding = '12px';
        messagesContainer.style.display = 'flex';
        messagesContainer.style.flexDirection = 'column';
        messagesContainer.style.gap = '8px';
        messagesContainer.style.backgroundColor = '#f9fafb';

        // Input area
        const inputArea = document.createElement('div');
        inputArea.style.borderTop = '1px solid #e2e8f0';
        inputArea.style.padding = '12px';
        inputArea.style.display = 'flex';
        inputArea.style.gap = '8px';
        inputArea.style.backgroundColor = 'white';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ask a question?';
        input.style.flex = '1';
        input.style.padding = '10px';
        input.style.border = '1px solid #cbd5e1';
        input.style.borderRadius = '24px';
        input.style.outline = 'none';
        input.style.fontSize = '14px';

        const sendBtn = document.createElement('button');
        sendBtn.textContent = 'Send';
        sendBtn.style.backgroundColor = '#1e3c72';
        sendBtn.style.color = 'white';
        sendBtn.style.border = 'none';
        sendBtn.style.padding = '8px 16px';
        sendBtn.style.borderRadius = '24px';
        sendBtn.style.cursor = 'pointer';
        sendBtn.style.fontWeight = '500';

        inputArea.appendChild(input);
        inputArea.appendChild(sendBtn);
        win.appendChild(header);
        win.appendChild(messagesContainer);
        win.appendChild(inputArea);
        document.body.appendChild(win);

        header.querySelector('#closeChatBtn').onclick = () => {
            win.style.display = 'none';
        };

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;
            addMessage('user', message);
            input.value = '';

            // First try local knowledge base
            let reply = getLocalAnswer(message);
            if (reply) {
                addMessage('bot', reply);
                return;
            }

            // If no local match, try OpenAI (if backend available)
            const typingId = showTyping();
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                if (response.ok) {
                    const data = await response.json();
                    removeTyping(typingId);
                    addMessage('bot', data.reply);
                } else {
                    throw new Error('API not available');
                }
            } catch (err) {
                console.warn('OpenAI backend not available, using fallback.', err);
                removeTyping(typingId);
                addMessage('bot', '😊 I’m still learning! For now, please contact support or check our course pages. You can ask me about Python, Web Dev, AI, Data Science, Digital Marketing, certificates, pricing, etc.');
            }
        }

        sendBtn.onclick = sendMessage;
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
        return win;
    }

    function addMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.padding = '8px 14px';
        msgDiv.style.borderRadius = '18px';
        msgDiv.style.wordWrap = 'break-word';
        if (role === 'user') {
            msgDiv.style.backgroundColor = '#1e3c72';
            msgDiv.style.color = 'white';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.borderBottomRightRadius = '4px';
        } else {
            msgDiv.style.backgroundColor = '#e2e8f0';
            msgDiv.style.color = '#1e293b';
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.borderBottomLeftRadius = '4px';
        }
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    let typingElement = null;
    function showTyping() {
        if (typingElement) typingElement.remove();
        typingElement = document.createElement('div');
        typingElement.style.backgroundColor = '#e2e8f0';
        typingElement.style.padding = '6px 12px';
        typingElement.style.borderRadius = '16px';
        typingElement.style.alignSelf = 'flex-start';
        typingElement.style.fontSize = '13px';
        typingElement.style.color = '#475569';
        typingElement.textContent = 'Typing...';
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingElement;
    }
    function removeTyping(el) {
        if (el && el.remove) el.remove();
        else if (typingElement) typingElement.remove();
        typingElement = null;
    }

    btn.onclick = () => {
        if (!chatWindow) {
            chatWindow = createChatWindow();
        }
        chatWindow.style.display = 'flex';
        if (messagesContainer.children.length === 0) {
            addMessage('bot', '👋 Hi! I’m your AI tutor. Ask me anything about courses, Python, web development, AI, data science, digital marketing, certificates, pricing, or registration!');
        }
    };
})();
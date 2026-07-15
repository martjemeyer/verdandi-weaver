// ─── Verdandi Weaver · Self-Scan engine ────────────────────────────────────
// Each scan has: title, dims[], questions[], dimParagraphs{}, dimNeeds{}, pathways[]
// Each option:  { text, tone, dims } where dims is "key:n,key:n" string

var SCANS = {

  // 1 · Nervous System Self-Scan ─────────────────────────────────────────────
  nervous: {
    title: "Nervous System Self-Scan",
    dims: ['activation','adaptation','overwhelm','shutdown','disconnection','fragmentation','longing','regulation'],
    questions: [
      {
        q: "When you think about resting lately, what happens inside you first?",
        opts: [
          { text: "A softening — my body wants it",              tone: "regulation", dims: "regulation:2" },
          { text: "A tightening — there is too much to do",      tone: "activation", dims: "activation:2,overwhelm:1" },
          { text: "Numbness — I can't really feel much",         tone: "numbness",   dims: "shutdown:2,disconnection:1" },
          { text: "Rest feels unfamiliar or unsafe",             tone: "withdrawal", dims: "adaptation:2,activation:1" },
          { text: "I don't know what I need anymore",            tone: "tender",     dims: "disconnection:2,longing:1" }
        ]
      },
      {
        q: "Lately, your inner pace has felt more like —",
        opts: [
          { text: "Constant movement",                           tone: "activation", dims: "activation:2,adaptation:1" },
          { text: "Quiet exhaustion",                            tone: "tender",     dims: "overwhelm:2,longing:1" },
          { text: "Emotional heaviness",                         tone: "tender",     dims: "overwhelm:1,longing:1" },
          { text: "Disconnection from myself",                   tone: "withdrawal", dims: "disconnection:2,fragmentation:1" },
          { text: "Small moments of breathing between things",   tone: "regulation", dims: "regulation:2" }
        ]
      },
      {
        q: "When life becomes overwhelming, your system most often tends to —",
        opts: [
          { text: "Speed up and try to manage everything",       tone: "activation", dims: "activation:2,adaptation:1" },
          { text: "Withdraw and go inward",                      tone: "withdrawal", dims: "shutdown:1,disconnection:1" },
          { text: "Disconnect or numb out",                      tone: "numbness",   dims: "shutdown:2,disconnection:1" },
          { text: "Reach for comfort or grounding",              tone: "regulation", dims: "regulation:2" },
          { text: "Keep functioning while feeling far away inside", tone: "tender",  dims: "fragmentation:2,adaptation:1" }
        ]
      },
      {
        q: "How easy has it felt recently to simply exist — without needing to perform, explain, or hold everything together?",
        opts: [
          { text: "Fairly easy",                                 tone: "regulation", dims: "regulation:2" },
          { text: "Sometimes possible",                          tone: "regulation", dims: "regulation:1" },
          { text: "Rarely",                                      tone: "tender",     dims: "adaptation:2,overwhelm:1" },
          { text: "I honestly don't remember",                   tone: "numbness",   dims: "disconnection:2,shutdown:1" },
          { text: "I feel like I am always \"on\"",              tone: "activation", dims: "activation:2,adaptation:1" }
        ]
      },
      {
        q: "What has your body been asking for lately, even quietly?",
        opts: [
          { text: "More rest",                                   tone: "tender",     dims: "longing:2,overwhelm:1" },
          { text: "More softness",                               tone: "tender",     dims: "longing:2" },
          { text: "More movement",                               tone: "regulation", dims: "regulation:1,longing:1" },
          { text: "More safety",                                 tone: "withdrawal", dims: "longing:2,adaptation:1" },
          { text: "More space to feel",                          tone: "tender",     dims: "longing:1,fragmentation:1" },
          { text: "Less pressure",                               tone: "activation", dims: "overwhelm:2,longing:1" },
          { text: "More connection",                             tone: "regulation", dims: "longing:2,regulation:1" },
          { text: "I'm not sure yet",                            tone: "numbness",   dims: "disconnection:2" }
        ]
      },
      {
        q: "Right now, which sentence feels closest to where you are?",
        opts: [
          { text: "I think I've been carrying too much for too long",  tone: "tender",     dims: "overwhelm:2,adaptation:1" },
          { text: "I keep adapting, even when I'm tired",              tone: "activation", dims: "adaptation:2,activation:1" },
          { text: "I feel disconnected from myself lately",            tone: "withdrawal", dims: "disconnection:2,fragmentation:1" },
          { text: "I want to feel more whole again",                   tone: "tender",     dims: "longing:2,fragmentation:1" },
          { text: "I think my system needs gentleness",                tone: "regulation", dims: "longing:1,regulation:1" },
          { text: "I'm beginning to notice myself again",              tone: "regulation", dims: "regulation:2" }
        ]
      }
    ],
    dimParagraphs: {
      activation:    "It feels like parts of you may have been carrying responsibility for a long time. Your answers suggest a nervous system that has learned to stay alert, moving, managing, continuing — even when the system itself is quietly asking for stillness.",
      adaptation:    "You may still be functioning outwardly while inwardly carrying quiet exhaustion. Not weakness. Not failure. Adaptation. A careful intelligence that learned, somewhere along the way, that staying in motion was the safest thing to do.",
      overwhelm:     "Your responses suggest your system may have been holding more than was ever meant to be held by one person alone. When pressure continues without enough recovery, the body keeps showing up — but quietly, the inner world begins asking for permission to put something down.",
      shutdown:      "Your answers may suggest your system has gone quiet for a while. Not peaceful quiet. More the kind that sometimes arrives after carrying too much for too long. When overwhelm continues without enough safety or recovery, some systems stop speeding up and begin pulling away instead.",
      disconnection: "Your responses may reflect a quiet distance — from feeling, from the body, sometimes even from the sense of self. When the inner world becomes too much to hold all at once, the system sometimes steps back to keep you safe. This is rarely the absence of feeling. More often, it is feeling held under careful guard.",
      fragmentation: "Parts of you may feel scattered across too many places at once — split between what is asked of you outwardly and what waits, unattended, inside. This is not a failure of focus. It is what the self does when it is asked to be in too many rooms at the same time.",
      longing:       "And perhaps beneath all of that, there is also a longing — for softness, for safety, for permission to simply exist without holding everything together. The longing itself is a form of intelligence. It is the part of you that has not forgotten what it needs.",
      regulation:    "Something inside you may already be turning gently back toward itself. A soft return is happening, even if it is small, even if it is uneven. Slow returnings are still real returnings."
    },
    dimNeeds: {
      activation:    ["permission to slow down without earning it"],
      adaptation:    ["quiet, without performance", "spaces where you do not have to keep functioning"],
      overwhelm:     ["space to put something down, even briefly", "rest that is allowed to be unproductive"],
      shutdown:      ["gentleness, not pressure", "warmth that does not ask anything of you yet"],
      disconnection: ["small contact with the body — a hand on the chest, a slow breath", "a few minutes near something living"],
      fragmentation: ["a few minutes of being in only one room of yourself", "fewer demands on your attention, even briefly"],
      longing:       ["permission to want what you want", "softness — toward yourself, first"],
      regulation:    ["to let the small returning stay small for now"]
    },
    pathways: [
      { href: "/self-scans.html",   title: "Burnout & Fragmentation",       blurb: "Notice the quiet ways the self learns to split itself across too many demands.",            tags: ["fragmentation","adaptation","overwhelm","activation"] },
      { href: "/framework-05.html", title: "Protection vs Presence",         blurb: "The protective patterns we build when life asks us to stay guarded too long.",             tags: ["adaptation","shutdown","disconnection","activation"] },
      { href: "/framework-02.html", title: "The Living System Model",        blurb: "How a nervous system holds, releases, and slowly returns toward itself.",                  tags: ["regulation","disconnection","shutdown","longing"] },
      { href: "/framework-07.html", title: "Society as a Nervous System",    blurb: "Why so many of us are carrying things that were never ours alone to hold.",                tags: ["overwhelm","activation","adaptation","fragmentation"] },
      { href: "/self-scans.html",   title: "Emotional Capacity Reflection",  blurb: "A quiet noticing of how much your system can hold right now — without judgement.",         tags: ["overwhelm","shutdown","disconnection","longing"] },
      { href: "/articles.html",     title: "A reflection on rest",           blurb: "Why rest can feel difficult for dysregulated systems — and what helps it become possible again.", tags: ["activation","adaptation","overwhelm","longing"] },
      { href: "/books.html",        title: "Grounded Wholeness",             blurb: "A slower return toward feeling fully inside your own life again.",                         tags: ["regulation","longing","disconnection","fragmentation"] },
      { href: "/books.html",        title: "When Staying Begins to Hurt",    blurb: "On the cost of holding ground we were never meant to hold alone.",                        tags: ["adaptation","overwhelm","longing"] }
    ]
  },

  // 2 · Grounded Wholeness Reflection ───────────────────────────────────────
  wholeness: {
    title: "Grounded Wholeness Reflection",
    dims: ['split','unfamiliar','longing','returning','embodied','home'],
    questions: [
      {
        q: "When you think about feeling whole, which sentence feels closest?",
        opts: [
          { text: "It feels familiar — something I touch often",          tone: "regulation", dims: "home:2" },
          { text: "It feels possible — something I am moving toward",     tone: "regulation", dims: "home:1,returning:1" },
          { text: "It feels distant — something I remember",              tone: "tender",     dims: "returning:1,longing:1" },
          { text: "It feels like a longing more than a place",            tone: "tender",     dims: "longing:2,split:1" },
          { text: "I don't think I've ever fully known what it feels like", tone: "numbness", dims: "unfamiliar:2" }
        ]
      },
      {
        q: "How present do you feel inside your own body these days?",
        opts: [
          { text: "Mostly present — I can feel myself here",             tone: "regulation", dims: "embodied:2" },
          { text: "In and out — sometimes in, sometimes far",            tone: "regulation", dims: "embodied:1,returning:1" },
          { text: "Mostly in my head, less in my body",                  tone: "withdrawal", dims: "split:2" },
          { text: "My body sometimes feels foreign",                     tone: "numbness",   dims: "unfamiliar:1,split:1" },
          { text: "I want to be more in my body but don't always know how", tone: "tender", dims: "longing:1,split:1" }
        ]
      },
      {
        q: "Which part of yourself do you most often hide from others?",
        opts: [
          { text: "My tiredness",                                        tone: "tender",     dims: "split:2" },
          { text: "My sadness",                                          tone: "tender",     dims: "split:2,longing:1" },
          { text: "My anger",                                            tone: "withdrawal", dims: "split:1,unfamiliar:1" },
          { text: "The parts of me that still need things",              tone: "tender",     dims: "split:2,longing:1" },
          { text: "The softer parts of me",                              tone: "tender",     dims: "longing:2" },
          { text: "I try not to hide much anymore",                      tone: "regulation", dims: "home:1" }
        ]
      },
      {
        q: "When you imagine being fully yourself — nothing performed, nothing held back — what arrives first?",
        opts: [
          { text: "Warmth, or relief",                                   tone: "regulation", dims: "home:2" },
          { text: "A small fear",                                        tone: "activation", dims: "split:2" },
          { text: "Tears, or tenderness",                                tone: "tender",     dims: "longing:2,returning:1" },
          { text: "Not much — I'm not sure what that would feel like",   tone: "numbness",   dims: "unfamiliar:2" },
          { text: "Something already quietly returning",                 tone: "regulation", dims: "returning:2" }
        ]
      },
      {
        q: "Where in your life right now do you feel most like yourself?",
        opts: [
          { text: "In nature",                                           tone: "regulation", dims: "home:2,embodied:1" },
          { text: "When I'm alone",                                      tone: "regulation", dims: "home:2" },
          { text: "With one or two trusted people",                      tone: "regulation", dims: "home:2,embodied:1" },
          { text: "In something creative",                               tone: "regulation", dims: "home:2" },
          { text: "In small, ordinary moments",                          tone: "regulation", dims: "home:1,embodied:1" },
          { text: "Honestly, not many places lately",                    tone: "tender",     dims: "longing:2,split:1" }
        ]
      },
      {
        q: "How does your body usually receive softness lately?",
        opts: [
          { text: "It opens to it",                                      tone: "regulation", dims: "embodied:2,home:1" },
          { text: "It hesitates, then receives a little",                tone: "tender",     dims: "returning:1,longing:1" },
          { text: "It tenses or flinches at first",                      tone: "activation", dims: "split:2" },
          { text: "It doesn't quite know what to do with it",            tone: "numbness",   dims: "unfamiliar:2" },
          { text: "I want it to receive more than it does",              tone: "tender",     dims: "longing:2,returning:1" }
        ]
      },
      {
        q: "What part of you still feels left behind somewhere?",
        opts: [
          { text: "A younger version of myself",                         tone: "tender",     dims: "split:2,longing:1" },
          { text: "My capacity for play, or joy",                        tone: "tender",     dims: "longing:2" },
          { text: "My body, fully felt",                                 tone: "withdrawal", dims: "split:2,embodied:1" },
          { text: "My ability to trust softness",                        tone: "tender",     dims: "longing:1,returning:1" },
          { text: "The version of me that hadn't learned to perform yet", tone: "tender",    dims: "split:1,longing:1" },
          { text: "I think most of me is finding its way back",          tone: "regulation", dims: "returning:1,home:1" }
        ]
      },
      {
        q: "What does wholeness look like to you now — not in theory, but in your life?",
        opts: [
          { text: "Being present in my own body",                        tone: "regulation", dims: "embodied:2" },
          { text: "Allowing all of myself, not just the acceptable parts", tone: "regulation", dims: "home:2" },
          { text: "Slower rhythms and gentler days",                     tone: "regulation", dims: "home:1,embodied:1" },
          { text: "Relationships where I do not perform",                tone: "regulation", dims: "home:2,returning:1" },
          { text: "Feeling fully alive inside small moments",            tone: "regulation", dims: "embodied:2,home:1" },
          { text: "I'm still figuring out what it looks like",           tone: "tender",     dims: "longing:2,returning:1" }
        ]
      },
      {
        q: "Right now, which feels closest to your truth?",
        opts: [
          { text: "I want to feel whole again",                          tone: "tender",     dims: "longing:2,split:1" },
          { text: "I'm slowly returning to myself",                      tone: "regulation", dims: "returning:2" },
          { text: "I am more home in myself than I used to be",          tone: "regulation", dims: "home:2" },
          { text: "I'm tired but I haven't lost the longing",            tone: "tender",     dims: "longing:1,returning:1" },
          { text: "I am where I am, and that is okay",                   tone: "regulation", dims: "embodied:1,home:1" }
        ]
      }
    ],
    dimParagraphs: {
      split:       "Parts of you may have learned to live a little apart from the rest of yourself — holding back what is tender, what is tired, what still needs things, in order to keep moving. This was not betrayal. It was protection. The pieces you set aside have not gone anywhere. They are still close, still yours, still waiting.",
      unfamiliar:  "Your answers suggest that wholeness may feel less like a return and more like an unfamiliar country. Sometimes the body has not been given the conditions to know what fully arriving inside itself even feels like. That is not a failing. That is information. Wholeness, when unfamiliar, is not learned through striving. It is learned through small, slow, repeated experiences of safety.",
      longing:     "There is a longing inside your responses — a wish for more aliveness, more softness, more of yourself, fully home. The longing itself is precious. It is the part of you that has not forgotten what it is moving toward, even when the path forward is unclear.",
      returning:   "Something inside you is already moving back toward itself. The returning may be slow, uneven, easily interrupted — but it is real. Pieces of you that had been gone for a while are quietly coming back into the room.",
      embodied:    "Your answers reflect someone in real contact with the body — not always perfectly, but truthfully. The body is one of the places wholeness lives. To be inside it, even imperfectly, is to be closer to home than the world often allows.",
      home:        "There's a quiet sense of home in your answers — not perfect, not finished, but present. You are more inside yourself than you may give yourself credit for. Wholeness does not arrive complete. It arrives as a place you keep returning to, and you are already returning."
    },
    dimNeeds: {
      split:      ["to welcome back one small part of yourself today", "permission for the tender pieces to take up space again"],
      unfamiliar: ["small, repeated experiences of safety in the body", "to let wholeness be learned slowly, not performed"],
      longing:    ["permission to want what you want", "to trust the longing as guidance, not lack"],
      returning:  ["to let the returning happen at its own pace", "to notice the small ways you are already coming home"],
      embodied:   ["a few minutes of being inside your body without an agenda", "to trust the body as a place, not only a vehicle"],
      home:       ["to let yourself rest in the home you've built inside", "to share a little more of this with someone safe"]
    },
    pathways: [
      { href: "/books.html",        title: "Grounded Wholeness",            blurb: "The book at the heart of this slow returning toward an unsplit self.",                      tags: ["returning","home","embodied","longing"] },
      { href: "/framework-04.html", title: "Fragmentation vs Wholeness",    blurb: "How humans slowly separate from themselves in order to survive — and the long path back.", tags: ["split","unfamiliar","returning"] },
      { href: "/framework-06.html", title: "The Returning Spiral",          blurb: "Wholeness is not linear. It is a slow, repeating return to the same gentle ground.",       tags: ["returning","home","longing"] },
      { href: "/articles.html",     title: "On the long way home",          blurb: "A reflection on what it means to come back to yourself, slowly, in your own time.",        tags: ["returning","home","longing"] },
      { href: "/self-scans.html",   title: "Burnout & Fragmentation",       blurb: "Notice the quiet ways the self learns to split itself across too many demands.",            tags: ["split","unfamiliar"] },
      { href: "/self-scans.html",   title: "Nervous System Self-Scan",      blurb: "A slower noticing of how your system has been holding, adapting, returning.",              tags: ["embodied","returning"] },
      { href: "/books.html",        title: "When Staying Begins to Hurt",   blurb: "On the cost of holding ground we were never meant to hold alone.",                        tags: ["split","longing"] }
    ]
  },

  // 3 · Social Awakening vs Soul Awareness ──────────────────────────────────
  awakening: {
    title: "Social · Soul · Human Awakening",
    dims: ['seeing','spiritual','isolation','embodied','grounding','integration'],
    questions: [
      {
        q: "When something in society feels deeply wrong, your first reaction is usually —",
        opts: [
          { text: "Anger or urgency",                                    tone: "activation", dims: "seeing:2" },
          { text: "Deep sadness",                                        tone: "tender",     dims: "embodied:1,isolation:1" },
          { text: "Wanting to understand what shaped it",                tone: "regulation", dims: "seeing:1,embodied:1" },
          { text: "Pulling away from the world entirely",                tone: "withdrawal", dims: "isolation:2" },
          { text: "Both overwhelmed and connected at the same time",     tone: "regulation", dims: "embodied:2,integration:1" }
        ]
      },
      {
        q: "What has \"awakening\" most felt like for you lately?",
        opts: [
          { text: "Seeing through systems and manipulation",             tone: "activation", dims: "seeing:2" },
          { text: "Becoming more spiritually aware",                     tone: "regulation", dims: "spiritual:2" },
          { text: "Feeling emotionally raw and exposed",                 tone: "tender",     dims: "grounding:1,embodied:1" },
          { text: "Becoming more compassionate toward people",           tone: "regulation", dims: "embodied:2" },
          { text: "Trying to reconnect fragmented parts of myself",      tone: "tender",     dims: "integration:2" }
        ]
      },
      {
        q: "When people disagree with your perspective, what tends to happen inside you?",
        opts: [
          { text: "I feel frustrated they cannot see it",               tone: "activation", dims: "seeing:2,isolation:1" },
          { text: "I withdraw inward",                                   tone: "withdrawal", dims: "isolation:2" },
          { text: "I become protective of what I know",                  tone: "activation", dims: "seeing:1,isolation:1" },
          { text: "I try to understand their experience too",            tone: "regulation", dims: "embodied:2" },
          { text: "It depends on my emotional capacity that day",        tone: "tender",     dims: "integration:1,grounding:1" }
        ]
      },
      {
        q: "Which sentence feels closest to your experience?",
        opts: [
          { text: "I have become more aware, but not necessarily more peaceful", tone: "tender",     dims: "seeing:1,grounding:2" },
          { text: "I sometimes feel disconnected from people around me",          tone: "withdrawal", dims: "isolation:2" },
          { text: "I feel caught between insight and loneliness",                 tone: "tender",     dims: "seeing:1,isolation:2" },
          { text: "I want truth without losing tenderness",                       tone: "regulation", dims: "integration:2,embodied:1" },
          { text: "I think awakening should include the body and relationships too", tone: "regulation", dims: "embodied:2,integration:1" }
        ]
      },
      {
        q: "What feels most difficult lately?",
        opts: [
          { text: "Feeling emotionally safe in the world",              tone: "tender",     dims: "grounding:2" },
          { text: "Staying open without becoming overwhelmed",          tone: "tender",     dims: "grounding:1,integration:1" },
          { text: "Feeling connected to people who think differently",  tone: "withdrawal", dims: "embodied:2,isolation:1" },
          { text: "Staying grounded while questioning everything",      tone: "activation", dims: "grounding:2,seeing:1" },
          { text: "Bringing my awareness into everyday life",           tone: "regulation", dims: "integration:2" }
        ]
      },
      {
        q: "When you imagine becoming \"fully awake,\" what feels most true?",
        opts: [
          { text: "Seeing reality clearly",                             tone: "activation", dims: "seeing:2" },
          { text: "Feeling spiritually connected",                      tone: "regulation", dims: "spiritual:2" },
          { text: "Living with compassion and presence",                tone: "regulation", dims: "embodied:2" },
          { text: "Feeling whole inside myself",                        tone: "regulation", dims: "integration:2" },
          { text: "I no longer think awakening is about transcendence alone", tone: "regulation", dims: "integration:2,embodied:1" }
        ]
      },
      {
        q: "Right now, what do you think your system may be longing for most?",
        opts: [
          { text: "Clarity",                                            tone: "activation", dims: "seeing:2" },
          { text: "Grounding",                                          tone: "tender",     dims: "grounding:2" },
          { text: "Connection",                                         tone: "regulation", dims: "embodied:2" },
          { text: "Meaning",                                            tone: "regulation", dims: "spiritual:2" },
          { text: "Rest",                                               tone: "tender",     dims: "grounding:2" },
          { text: "Integration",                                        tone: "regulation", dims: "integration:2" },
          { text: "A softer way of being human",                        tone: "regulation", dims: "embodied:2,integration:1" }
        ]
      }
    ],
    dimParagraphs: {
      seeing:      "There's a clarity in your responses — an awareness of systems, patterns, and the things many people do not yet see. Insight can be a real gift. It can also create urgency, anger, or distance when the nervous system has not yet found enough grounding inside what is now visible. Awareness alone is rarely enough for peace.",
      spiritual:   "There's a sense in your answers of an awareness that reaches beyond the visible — toward meaning, intuition, or something larger holding it all. This kind of knowing can be quietly sustaining. It can also become subtly disembodied, drifting above the daily textures of being human. The deepest spiritual awareness usually finds its way back into a body, a relationship, an ordinary life.",
      isolation:   "There may be a quiet loneliness inside what you've come to see. When awareness outpaces the people around you — or outpaces your own capacity to integrate it — the world can begin to feel further away. This is not a failure of relationship. It is what the system does when insight arrives faster than it can be metabolized together with others.",
      embodied:    "Your responses suggest an awareness reaching toward warmth — toward people, toward compassion, toward staying tender even inside what you now see. This is not a less serious form of awakening. Often, it is the harder one. Staying soft while seeing clearly is one of the quieter forms of integration.",
      grounding:   "Beneath the awareness, there may be a system that hasn't quite found its footing inside what it now knows. Awakening can sometimes outpace the body's sense of safety. The longing here may not be for more insight — but for stability, for rest, for the ground beneath the seeing.",
      integration: "Your answers may reflect someone beginning to sense that awakening is not escape from humanity, but deeper participation in it. Not transcendence above life, but a quieter return into it — into body, into relationship, into the ordinary textures of being a person. That is a slower kind of awakening. Often a deeper one."
    },
    dimNeeds: {
      seeing:      ["space to feel what you've seen, not only know it", "to let insight settle before acting on it"],
      spiritual:   ["small embodied practices — feet on the floor, breath in the chest", "ways to bring meaning into ordinary moments"],
      isolation:   ["one slow conversation with someone who can meet a piece of this", "permission to not need to be understood by everyone"],
      embodied:    ["to trust the warmth as real intelligence", "rest inside the softness, not only the seeing"],
      grounding:   ["something steady beneath your feet, even briefly", "rest that is allowed to be unspectacular"],
      integration: ["to let the awakening become slower, more ordinary", "permission for the small return into daily life"]
    },
    pathways: [
      { href: "/framework-08.html", title: "Social vs Soul vs Human Awakening", blurb: "A visual framework exploring the differences — and relationships — between these thresholds.", tags: ["seeing","spiritual","embodied","integration"] },
      { href: "/framework-05.html", title: "Protection vs Presence",             blurb: "How insight sometimes becomes armor when the nervous system is overwhelmed.",            tags: ["seeing","isolation","grounding"] },
      { href: "/framework-04.html", title: "Fragmentation vs Wholeness",         blurb: "What happens when awareness expands faster than integration.",                           tags: ["isolation","integration","grounding"] },
      { href: "/books.html",        title: "Grounded Wholeness",                 blurb: "A slower return toward living fully inside both truth and humanity.",                    tags: ["integration","embodied","grounding"] },
      { href: "/articles.html",     title: "Why Rest Can Feel Unsafe",           blurb: "On nervous systems, responsibility, and hypervigilance — and the slow return to ground.", tags: ["grounding","seeing","isolation"] },
      { href: "/self-scans.html",   title: "Burnout & Fragmentation",            blurb: "Notice the quiet ways the self learns to split itself across too many demands.",         tags: ["isolation","integration"] },
      { href: "/self-scans.html",   title: "Nervous System Self-Scan",           blurb: "A slower noticing of how your system has been holding, adapting, returning.",           tags: ["grounding","embodied"] }
    ]
  },

  // 4 · Emotional Capacity Reflection ───────────────────────────────────────
  capacity: {
    title: "Emotional Capacity Reflection",
    dims: ['carrying','strained','overstimulated','shutdown','recovery','listening'],
    questions: [
      {
        q: "Lately, small things have been feeling —",
        opts: [
          { text: "Easy to hold",                                        tone: "regulation", dims: "listening:1" },
          { text: "Slightly heavier than usual",                         tone: "tender",     dims: "strained:1,carrying:1" },
          { text: "Emotionally draining",                                tone: "tender",     dims: "carrying:2" },
          { text: "Overwhelming more quickly than before",               tone: "activation", dims: "overstimulated:2" },
          { text: "Different every day",                                 tone: "withdrawal", dims: "strained:1" }
        ]
      },
      {
        q: "When someone needs something from you right now, what happens inside first?",
        opts: [
          { text: "Openness",                                            tone: "regulation", dims: "listening:2" },
          { text: "Mild tension",                                        tone: "tender",     dims: "strained:1" },
          { text: "Pressure",                                            tone: "activation", dims: "carrying:2" },
          { text: "Exhaustion",                                          tone: "tender",     dims: "carrying:2,recovery:1" },
          { text: "Guilt if I cannot give it",                           tone: "activation", dims: "carrying:2,strained:1" }
        ]
      },
      {
        q: "How much space has there been lately for your own emotions?",
        opts: [
          { text: "Plenty",                                              tone: "regulation", dims: "listening:2" },
          { text: "Some",                                                tone: "regulation", dims: "listening:1" },
          { text: "Very little",                                         tone: "tender",     dims: "carrying:2,recovery:1" },
          { text: "Mostly I keep going",                                 tone: "activation", dims: "carrying:2,shutdown:1" },
          { text: "I'm not fully sure what I feel anymore",              tone: "numbness",   dims: "shutdown:2" }
        ]
      },
      {
        q: "When life becomes emotionally intense, your system most often tends to —",
        opts: [
          { text: "Stay fairly grounded",                                tone: "regulation", dims: "listening:2" },
          { text: "Become overstimulated",                               tone: "activation", dims: "overstimulated:2" },
          { text: "Shut down or go quiet",                               tone: "numbness",   dims: "shutdown:2" },
          { text: "Push through anyway",                                 tone: "activation", dims: "carrying:2" },
          { text: "Need more space and recovery than before",            tone: "tender",     dims: "recovery:2,listening:1" }
        ]
      },
      {
        q: "Which sentence feels most true lately?",
        opts: [
          { text: "I've been carrying a lot quietly",                    tone: "tender",     dims: "carrying:2" },
          { text: "I need more recovery than I allow myself",            tone: "tender",     dims: "recovery:2,carrying:1" },
          { text: "I'm functioning, but stretched thin",                 tone: "activation", dims: "strained:2" },
          { text: "I feel emotionally overloaded",                       tone: "activation", dims: "overstimulated:2,strained:1" },
          { text: "I think I've stopped noticing my own limits",         tone: "numbness",   dims: "shutdown:1,carrying:1" },
          { text: "I'm learning to listen to myself more honestly",      tone: "regulation", dims: "listening:2" }
        ]
      },
      {
        q: "Right now, what do you think your system may be needing most?",
        opts: [
          { text: "Rest",                                                tone: "tender",     dims: "recovery:2" },
          { text: "Softness",                                            tone: "tender",     dims: "recovery:2" },
          { text: "Emotional support",                                   tone: "tender",     dims: "recovery:1,carrying:1" },
          { text: "Space",                                               tone: "tender",     dims: "recovery:2" },
          { text: "Slower pacing",                                       tone: "regulation", dims: "recovery:2,strained:1" },
          { text: "Safety",                                              tone: "withdrawal", dims: "recovery:1,shutdown:1" },
          { text: "Less pressure",                                       tone: "activation", dims: "recovery:2,strained:1" },
          { text: "Permission to not hold everything",                   tone: "tender",     dims: "recovery:2,carrying:1" }
        ]
      }
    ],
    dimParagraphs: {
      carrying:       "Your responses suggest someone who has been carrying a great deal — quietly, dutifully, often without much space to set anything down. Carrying is not the same as being okay. It is what a careful, responsible system does when it has not been given enough permission to rest. Your capacity is not failing. It may simply be honoring how much you've been holding.",
      strained:       "There may be a fine, near-edge feeling running underneath your days — still functioning, still responding, but with less spaciousness inside than there used to be. This is not weakness. It is what happens when a system is asked to hold close to its limits for a long time without enough recovery. Stretched thin is still a real signal worth listening to.",
      overstimulated: "Things may be landing with more intensity than they used to — small things feeling heavier, ordinary moments arriving with more weight. When the nervous system has been holding a lot for a long time, the threshold for overwhelm naturally lowers. This is not over-sensitivity. It is honest information about where your capacity currently is.",
      shutdown:       "Your answers may suggest a system that has gone a little quiet — not from peace, but from carrying past what could be felt. When emotional load exceeds what can be metabolized, some of the feeling steps back to make continuing possible. Not numbness as failure. Numbness as care, holding something for you until there is more room.",
      recovery:       "There is a longing for recovery in your responses — for rest, softness, space, slower pacing, less pressure. The longing is not a sign you cannot cope. It is a sign your system is still in honest contact with what it actually needs. Listening to that longing is part of how capacity returns.",
      listening:      "Something inside you is beginning to listen more honestly — to limits, to needs, to the quieter signals your system has been sending. This is not weakness arriving. It is integrity arriving. Capacity that is honored can begin, slowly, to come back."
    },
    dimNeeds: {
      carrying:       ["permission to put one thing down, even briefly", "a small no without an explanation"],
      strained:       ["space that is not asked to lead anywhere", "a slower pace, even just for today"],
      overstimulated: ["fewer inputs, even briefly — quieter rooms, slower screens", "one thing at a time, instead of many"],
      shutdown:       ["gentleness, not pressure", "warmth that does not ask anything of you yet"],
      recovery:       ["rest that isn't asked to fix anything", "softness without earning it"],
      listening:      ["to trust the signals you're noticing", "to let the new honesty stay small for now"]
    },
    pathways: [
      { href: "/self-scans.html",   title: "Burnout & Fragmentation",    blurb: "Notice the quiet ways the self learns to split itself across too many demands.", tags: ["carrying","strained","shutdown"] },
      { href: "/self-scans.html",   title: "Nervous System Self-Scan",   blurb: "A softer check-in with regulation, overwhelm, and emotional pacing.",           tags: ["overstimulated","shutdown","recovery"] },
      { href: "/framework-05.html", title: "Protection vs Presence",     blurb: "How survival patterns shape emotional availability and connection.",             tags: ["carrying","shutdown","strained"] },
      { href: "/articles.html",     title: "Why Rest Can Feel Unsafe",   blurb: "On nervous systems, responsibility, and hypervigilance — and the slow return to ground.", tags: ["carrying","recovery","listening"] },
      { href: "/books.html",        title: "Grounded Wholeness",         blurb: "A slower return toward feeling fully inside your own life again.",               tags: ["recovery","listening","shutdown"] }
    ]
  },

  // 5 · Burnout & Fragmentation ──────────────────────────────────────────────
  burnout: {
    title: "Burnout & Fragmentation",
    dims: ['functioning','absence','exhaustion','fragmentation','longing','returning'],
    questions: [
      {
        q: "Lately, life has mostly felt like —",
        opts: [
          { text: "Moving from task to task",                            tone: "activation", dims: "functioning:2" },
          { text: "Holding things together for others",                  tone: "activation", dims: "functioning:1,fragmentation:1" },
          { text: "Trying not to fall behind",                           tone: "activation", dims: "functioning:2,exhaustion:1" },
          { text: "Existing in a kind of fog",                           tone: "numbness",   dims: "absence:2" },
          { text: "Moments of presence between exhaustion",              tone: "regulation", dims: "returning:1,exhaustion:1" }
        ]
      },
      {
        q: "How often do you feel fully present inside your own life lately?",
        opts: [
          { text: "Often",                                               tone: "regulation", dims: "returning:2" },
          { text: "Sometimes",                                           tone: "regulation", dims: "returning:1" },
          { text: "Rarely",                                              tone: "tender",     dims: "absence:1,longing:1" },
          { text: "Mostly I just continue",                              tone: "activation", dims: "functioning:2,absence:1" },
          { text: "I'm not sure anymore",                                tone: "numbness",   dims: "absence:2" }
        ]
      },
      {
        q: "Which sentence feels most familiar?",
        opts: [
          { text: "I keep going even when I'm exhausted",                tone: "activation", dims: "functioning:2,exhaustion:1" },
          { text: "Rest makes me feel guilty or behind",                 tone: "tender",     dims: "functioning:2,longing:1" },
          { text: "I don't know what I actually need anymore",           tone: "numbness",   dims: "absence:2,longing:1" },
          { text: "I feel emotionally far away from myself",             tone: "withdrawal", dims: "fragmentation:2,absence:1" },
          { text: "I miss feeling fully alive inside things",            tone: "tender",     dims: "longing:2,absence:1" }
        ]
      },
      {
        q: "When you imagine slowing down, what happens inside you?",
        opts: [
          { text: "Relief",                                              tone: "regulation", dims: "returning:2" },
          { text: "Anxiety",                                             tone: "activation", dims: "functioning:2" },
          { text: "Emptiness",                                           tone: "numbness",   dims: "absence:2" },
          { text: "Resistance",                                          tone: "withdrawal", dims: "functioning:1,fragmentation:1" },
          { text: "Longing",                                             tone: "tender",     dims: "longing:2" },
          { text: "I honestly don't know",                               tone: "numbness",   dims: "absence:2" }
        ]
      },
      {
        q: "What part of yourself feels most distant lately?",
        opts: [
          { text: "My body",                                             tone: "withdrawal", dims: "fragmentation:2" },
          { text: "My emotions",                                         tone: "withdrawal", dims: "fragmentation:2,absence:1" },
          { text: "My joy",                                              tone: "tender",     dims: "fragmentation:1,longing:2" },
          { text: "My relationships",                                    tone: "withdrawal", dims: "fragmentation:2" },
          { text: "My creativity",                                       tone: "tender",     dims: "fragmentation:1,longing:1" },
          { text: "My sense of meaning",                                 tone: "numbness",   dims: "absence:2,longing:1" },
          { text: "My ability to rest",                                  tone: "tender",     dims: "exhaustion:1,longing:2" },
          { text: "Myself as a whole",                                   tone: "withdrawal", dims: "fragmentation:2,longing:1" }
        ]
      },
      {
        q: "How often do you move through days without really arriving inside them?",
        opts: [
          { text: "Rarely",                                              tone: "regulation", dims: "returning:2" },
          { text: "Sometimes",                                           tone: "regulation", dims: "returning:1" },
          { text: "Often",                                               tone: "numbness",   dims: "absence:2" },
          { text: "Almost always",                                       tone: "numbness",   dims: "absence:2,fragmentation:1" },
          { text: "I didn't realize I was doing that",                   tone: "tender",     dims: "absence:1,returning:1" }
        ]
      },
      {
        q: "If your exhaustion could speak honestly, what might it say?",
        opts: [
          { text: "I need rest",                                         tone: "tender",     dims: "exhaustion:2,longing:1" },
          { text: "I need help",                                         tone: "tender",     dims: "exhaustion:1,longing:2" },
          { text: "I need softness",                                     tone: "tender",     dims: "longing:2" },
          { text: "I need space",                                        tone: "tender",     dims: "longing:1,exhaustion:1" },
          { text: "I need to stop carrying everything alone",            tone: "tender",     dims: "exhaustion:2,fragmentation:1" },
          { text: "I need to feel like a person again",                  tone: "withdrawal", dims: "fragmentation:2,longing:1" },
          { text: "I don't know how to slow down anymore",               tone: "activation", dims: "functioning:2,exhaustion:1" }
        ]
      },
      {
        q: "Right now, what feels most true?",
        opts: [
          { text: "I think I've adapted to too much for too long",       tone: "activation", dims: "functioning:2,exhaustion:1" },
          { text: "I miss feeling connected to myself",                  tone: "tender",     dims: "fragmentation:2,longing:1" },
          { text: "I feel split between roles and responsibilities",     tone: "withdrawal", dims: "fragmentation:2" },
          { text: "I want to feel whole again",                          tone: "tender",     dims: "longing:2,returning:1" },
          { text: "I think I need gentleness more than pressure",        tone: "regulation", dims: "longing:1,returning:1" },
          { text: "I'm beginning to notice myself again",                tone: "regulation", dims: "returning:2" }
        ]
      }
    ],
    dimParagraphs: {
      functioning:  "Your responses suggest a self that has learned to keep going — to respond, to manage, to continue functioning even when something quieter inside has been asking for rest. This is not weakness. It is the careful intelligence of a system that adapted, somewhere along the way, to keep you safe by staying in motion.",
      absence:      "There may be a quiet fog you've been moving through — present in your days without fully arriving inside them. When too much is held for too long, the system sometimes steps slightly outside the self to make continuation possible. You are not gone. Only at a small distance from yourself for now.",
      exhaustion:   "Underneath the functioning, there may be an exhaustion that ordinary rest has not quite reached. The kind that gathers slowly, one adaptation at a time, until carrying becomes the default shape of being. You may have been holding more than was ever meant to be held by one person alone.",
      fragmentation:"Parts of you may feel scattered across too many roles, responsibilities, and quiet expectations. This is not a failure of focus. It is what the self does when it is asked to be in too many rooms at the same time. Pieces of you are still here — only spread thinner than feels comfortable.",
      longing:      "There is a longing inside your answers — soft, but real. A wish for rest, for softness, for the feeling of being fully alive inside your own life again. Longing is not lack. It is the part of you that has not forgotten what it needs.",
      returning:    "Something inside you is already beginning to notice. A small returning is happening, even if it is uneven, even if it is slow. The first moment of returning is often simply seeing where you have been."
    },
    dimNeeds: {
      functioning:   ["permission to be unproductive without earning it", "small pauses that don't have to lead anywhere"],
      absence:       ["one slow breath, fully arrived inside it", "a few minutes of being only here, only now"],
      exhaustion:    ["rest that isn't asked to fix anything", "to put one thing down, even briefly"],
      fragmentation: ["a few minutes of being in only one room of yourself", "fewer demands on your attention, even briefly"],
      longing:       ["permission to want what you want", "softness — toward yourself, first"],
      returning:     ["to let the small returning stay small for now", "to trust the noticing itself"]
    },
    pathways: [
      { href: "/framework-04.html", title: "Fragmentation vs Wholeness",    blurb: "A visual framework about how humans slowly separate from themselves in order to survive.", tags: ["fragmentation","absence","functioning"] },
      { href: "/framework-05.html", title: "Protection vs Presence",        blurb: "The protective patterns that help us continue functioning when life becomes too much.",   tags: ["functioning","fragmentation","absence"] },
      { href: "/articles.html",     title: "Why Rest Can Feel Unsafe",      blurb: "A gentle exploration of nervous systems, responsibility, and hypervigilance.",           tags: ["functioning","exhaustion","longing"] },
      { href: "/books.html",        title: "Grounded Wholeness",            blurb: "A quieter path toward reconnecting with the parts of yourself left behind along the way.", tags: ["returning","longing","fragmentation"] },
      { href: "/articles.html",     title: "On the quiet kind of tired",    blurb: "Notes on the exhaustion that rest alone cannot quite reach.",                            tags: ["exhaustion","functioning","absence"] },
      { href: "/self-scans.html",   title: "Nervous System Self-Scan",      blurb: "A slower noticing of how your system has been holding, adapting, returning.",            tags: ["functioning","exhaustion","returning"] },
      { href: "/books.html",        title: "When Staying Begins to Hurt",   blurb: "On the cost of holding ground we were never meant to hold alone.",                      tags: ["exhaustion","functioning","longing"] }
    ]
  },

  // 6 · Relationship Safety Reflection ──────────────────────────────────────
  safety: {
    title: "Relationship Safety Reflection",
    dims: ['carrying','strained','overstimulated','shutdown','recovery','listening'],
    questions: [
      {
        q: "When you think of the people closest to you, your body most often —",
        opts: [
          { text: "Softens — there is room to be myself",                tone: "regulation", dims: "listening:2" },
          { text: "Holds a little — depending on who",                   tone: "tender",     dims: "strained:1,carrying:1" },
          { text: "Tightens quietly",                                    tone: "tender",     dims: "carrying:2" },
          { text: "Braces — I prepare myself before showing up",         tone: "activation", dims: "overstimulated:2,strained:1" },
          { text: "Goes a little numb",                                  tone: "withdrawal", dims: "shutdown:1,strained:1" }
        ]
      },
      {
        q: "When someone close to you is upset, what happens inside you first?",
        opts: [
          { text: "I can stay with them and with myself",                tone: "regulation", dims: "listening:2" },
          { text: "A small bracing, then I steady",                      tone: "tender",     dims: "strained:1" },
          { text: "An urge to fix it quickly so it eases",               tone: "activation", dims: "carrying:2" },
          { text: "Heaviness — I want to help and I'm tired",            tone: "tender",     dims: "carrying:2,recovery:1" },
          { text: "Guilt, as if their feelings are somehow mine to manage", tone: "activation", dims: "carrying:2,strained:1" }
        ]
      },
      {
        q: "How much room is there, in your relationships right now, for your honest feelings?",
        opts: [
          { text: "Plenty — I can be tender or messy and still be met",  tone: "regulation", dims: "listening:2" },
          { text: "Some — with a few people",                            tone: "regulation", dims: "listening:1" },
          { text: "Very little — I edit myself before speaking",         tone: "tender",     dims: "carrying:2,recovery:1" },
          { text: "I keep most of it inside",                            tone: "activation", dims: "carrying:2,shutdown:1" },
          { text: "I'm not always sure what I feel anymore",             tone: "numbness",   dims: "shutdown:2" }
        ]
      },
      {
        q: "When a relationship becomes uncertain or strained, your system most often tends to —",
        opts: [
          { text: "Stay fairly grounded, with care for both of us",      tone: "regulation", dims: "listening:2" },
          { text: "Spin — overthink, re-read messages, prepare",         tone: "activation", dims: "overstimulated:2" },
          { text: "Go quiet, pull inward, become hard to reach",         tone: "numbness",   dims: "shutdown:2" },
          { text: "Try harder — over-explain, over-give, over-help",     tone: "activation", dims: "carrying:2" },
          { text: "Need much more space and recovery than I used to",    tone: "tender",     dims: "recovery:2,listening:1" }
        ]
      },
      {
        q: "Which sentence feels closest to your relational life lately?",
        opts: [
          { text: "I'm holding a lot for people I love",                 tone: "tender",     dims: "carrying:2" },
          { text: "I give more than I am asked to, and tire of it",      tone: "tender",     dims: "recovery:2,carrying:1" },
          { text: "I feel safer in some relationships than I do in others", tone: "activation", dims: "strained:2" },
          { text: "I'm becoming unsure who I am safe to be honest around", tone: "activation", dims: "overstimulated:2,strained:1" },
          { text: "I think I've stopped expecting to be fully met",      tone: "numbness",   dims: "shutdown:1,carrying:1" },
          { text: "I'm learning to ask for what I need, slowly",         tone: "regulation", dims: "listening:2" }
        ]
      },
      {
        q: "If your nervous system could ask one thing of the people around you, it would be —",
        opts: [
          { text: "Slower presence",                                     tone: "tender",     dims: "recovery:2" },
          { text: "Less correction, more listening",                     tone: "tender",     dims: "recovery:2" },
          { text: "To not have to manage their feelings about mine",     tone: "tender",     dims: "recovery:1,carrying:1" },
          { text: "Space — without it being taken as distance",          tone: "tender",     dims: "recovery:2" },
          { text: "Steadier rhythm — less unpredictability",             tone: "regulation", dims: "recovery:2,strained:1" },
          { text: "Reliable safety — to know I'm safe to be honest",     tone: "withdrawal", dims: "recovery:1,shutdown:1" },
          { text: "Less performance, more rest",                         tone: "activation", dims: "recovery:2,strained:1" },
          { text: "Permission to take up a little more room",            tone: "tender",     dims: "recovery:2,carrying:1" }
        ]
      }
    ],
    dimParagraphs: {
      carrying:       "Your responses suggest someone who has been quietly carrying a great deal inside their relationships — holding feelings, managing other people's reactions, often without much room to set anything down. Carrying is not the same as being okay. It is what a careful, responsible nervous system does when it has not been given enough permission to take up its own space.",
      strained:       "There may be a fine, near-edge feeling running underneath some of your relationships — still showing up, still responding, but with less spaciousness inside than there used to be. This is not weakness. It is what happens when a system is asked to stay close to its limits for a long time, with people who may not have the capacity to meet it back.",
      overstimulated: "Things may be landing with more intensity than they used to — small interactions feeling heavier, ordinary moments arriving with more weight. When a nervous system has been holding relational uncertainty for a long time, the threshold for overwhelm naturally lowers. This is not over-sensitivity. It is honest information about where your relational capacity currently is.",
      shutdown:       "Your answers may suggest a system that has gone a little quiet inside its relationships — not from peace, but from carrying past what could be felt. When relational asking exceeds what can be met, some of the feeling steps back to make staying possible. Not numbness as failure. Numbness as protection, holding something for you until there is more room.",
      recovery:       "There is a longing in your responses — for slower presence, less correction, more listening, more space. The longing is not a sign that anything is wrong with you. It is a sign your system is still in honest contact with what it needs in order to feel safe with another human being. Listening to that longing is part of how relational ease begins to return.",
      listening:      "Something inside you is beginning to listen more honestly — to which relationships regulate you, which ones quietly ask too much, and what you are actually willing to keep carrying. This is not weakness arriving. This is integrity arriving. Relational capacity that is honored can begin, slowly, to come home."
    },
    dimNeeds: {
      carrying:       ["permission to set one thing down inside a relationship, even briefly", "a small no, without an apology trailing behind it"],
      strained:       ["company that is not asked to be earned", "a slower pace inside conversations, even just for today"],
      overstimulated: ["fewer relational inputs for a moment — quieter rooms, slower replies", "one person at a time, instead of many"],
      shutdown:       ["gentleness without pressure to perform connection", "warmth that does not ask anything of you yet"],
      recovery:       ["rest that isn't asked to fix anything", "softness that doesn't have to be earned"],
      listening:      ["to trust the signals you're noticing about who feels safe", "to let the new honesty stay small for now"]
    },
    pathways: [
      { href: "/framework-05.html", title: "Protection vs Presence",          blurb: "The shells we build to stay safe in relationships, and the slow softening when we're ready to be met.", tags: ["carrying","shutdown","strained"] },
      { href: "/self-scans.html",   title: "Nervous System Self-Scan",        blurb: "A softer check-in with regulation and the rhythms your body uses to stay safe.",                      tags: ["overstimulated","shutdown","recovery"] },
      { href: "/self-scans.html",   title: "Burnout & Fragmentation",         blurb: "On the quiet ways the self splits itself across too many people, too many demands.",                   tags: ["carrying","strained","shutdown"] },
      { href: "/books.html",        title: "When Staying Begins to Hurt",     blurb: "A book on the moment a relationship begins asking more than it returns.",                              tags: ["carrying","strained","recovery"] },
      { href: "/circles.html",      title: "Relational Spaces",               blurb: "Slower rooms for meeting yourself and others — one-to-one and small circles.",                        tags: ["listening","recovery"] }
    ]
  }

};

// ─── State ──────────────────────────────────────────────────────────────────
var scanState = { key: null, i: 0, dimCounts: {} };

function el(id) { return document.getElementById(id); }
function setBar(p) { var b = el('scan-bar'); if (b) b.style.width = p + '%'; }

// ─── Start / reset ──────────────────────────────────────────────────────────
function startScan(key) {
  var s = SCANS[key]; if (!s) return;
  var counts = {};
  s.dims.forEach(function(d) { counts[d] = 0; });
  scanState = { key: key, i: 0, dimCounts: counts };
  renderQ();
  var startEl = document.getElementById('start');
  if (startEl) startEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scanReset() {
  scanState = { key: null, i: 0, dimCounts: {} };
  renderIntro();
}

// ─── Render helpers ─────────────────────────────────────────────────────────
function renderIntro() {
  setBar(0);
  var cnt = el('scan-count'); if (cnt) cnt.textContent = 'Intro';
  var step = el('scan-step'); if (!step) return;
  step.innerHTML =
    '<p class="t-eyebrow" style="margin-bottom: var(--sp-3);">A note before we begin</p>' +
    '<p class="scan__q t-balance">There are no right answers.</p>' +
    '<p class="scan__hint">Take your time. Pick a scan above when you\'re ready.</p>';
}

function renderQ() {
  var s = SCANS[scanState.key]; if (!s) return renderIntro();
  var q = s.questions[scanState.i];
  if (!q) return renderReflection();
  var total = s.questions.length;
  setBar((scanState.i / total) * 100);
  var cnt = el('scan-count');
  if (cnt) cnt.textContent = s.title + ' · ' + (scanState.i + 1) + ' of ' + total;
  var step = el('scan-step');
  if (!step) return;
  step.className = 'scan__step';
  void step.offsetWidth;
  step.innerHTML =
    '<p class="scan__q t-balance">' + q.q + '</p>' +
    (q.hint ? '<p class="scan__hint">' + q.hint + '</p>' : '') +
    '<div class="scan__opts">' +
    q.opts.map(function(o, idx) {
      return '<button class="scan__opt" data-idx="' + idx + '">' + o.text + '</button>';
    }).join('') +
    '</div>';

  // Attach click handlers
  var btns = step.querySelectorAll('.scan__opt');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx = parseInt(btn.getAttribute('data-idx'), 10);
      var opt = s.questions[scanState.i].opts[idx];
      // Score dimensions
      if (opt.dims) {
        opt.dims.split(',').forEach(function(pair) {
          var parts = pair.trim().split(':');
          var k = parts[0], v = parseInt(parts[1], 10) || 1;
          if (k && scanState.dimCounts.hasOwnProperty(k)) {
            scanState.dimCounts[k] += v;
          }
        });
      }
      scanState.i++;
      setTimeout(function() {
        if (scanState.i >= s.questions.length) renderReflection();
        else renderQ();
      }, 250);
    });
  });
}

// ─── Reflection ─────────────────────────────────────────────────────────────
function topDims(n) {
  return Object.entries(scanState.dimCounts)
    .filter(function(e) { return e[1] > 0; })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, n)
    .map(function(e) { return e[0]; });
}

function renderReflection() {
  var s = SCANS[scanState.key]; if (!s) return;
  setBar(100);
  var cnt = el('scan-count');
  if (cnt) cnt.textContent = s.title + ' · a reflection';

  var top = topDims(3);
  var dims = top.length ? top : [s.dims[0]];

  // Holding paragraphs (top 2 dims)
  var holdingHTML = dims.slice(0, 2).map(function(d) {
    return '<p class="scan__reflect-p">' + (s.dimParagraphs[d] || '') + '</p>';
  }).join('');

  // Needs (top 3 dims, dedupe, cap 4)
  var seen = {};
  var needs = [];
  dims.forEach(function(d) {
    (s.dimNeeds[d] || []).forEach(function(n) {
      if (!seen[n]) { seen[n] = true; needs.push(n); }
    });
  });
  var needsHTML = needs.slice(0, 4).map(function(n) {
    return '<li class="scan__need">' + n + '</li>';
  }).join('');

  // Pathways (score by tag overlap, take 3)
  var scored = s.pathways.map(function(p) {
    var score = 0;
    p.tags.forEach(function(t) {
      var i = dims.indexOf(t);
      if (i !== -1) score += (dims.length - i);
    });
    return { p: p, score: score };
  }).sort(function(a, b) { return b.score - a.score; }).slice(0, 3);

  var pathwaysHTML = scored.map(function(item) {
    return '<a class="scan__pathway" href="' + item.p.href + '">' +
      '<span class="scan__pathway-title">' + item.p.title + '</span>' +
      '<span class="scan__pathway-blurb">' + item.p.blurb + '</span>' +
      '</a>';
  }).join('');

  var step = el('scan-step');
  if (!step) return;
  step.innerHTML =
    '<div class="scan__reflection">' +
      '<p class="scan__reflect-label">— a mirror, not a verdict —</p>' +
      '<h3 class="scan__reflect-title">A gentle reflection</h3>' +
      '<p class="scan__reflect-sub">These scans are not here to tell you who you are. Only to help you notice where you may be standing right now.</p>' +

      '<div class="scan__reflect-section">' +
        '<p class="scan__reflect-eyebrow">What your system may be holding</p>' +
        holdingHTML +
      '</div>' +

      '<div class="scan__reflect-section">' +
        '<p class="scan__reflect-eyebrow">What may be needed right now</p>' +
        '<ul class="scan__needs">' + needsHTML + '</ul>' +
        '<p class="scan__needs-foot">Not as a task. Just a quiet possibility to leave near you.</p>' +
      '</div>' +

      '<p class="scan__reflect-closing">Nothing needed to be solved here today. Only noticed. Even noticing is a form of returning.</p>' +
      '<p class="scan__reflect-sig">— with care</p>' +

      '<div class="scan__reflect-section scan__pathways-section">' +
        '<p class="scan__reflect-eyebrow">What may help to explore next</p>' +
        '<p class="scan__pathways-intro">A few quiet doorways from here.</p>' +
        '<div class="scan__pathways">' + pathwaysHTML + '</div>' +
      '</div>' +
    '</div>';
}

// ─── Legacy stub (the old intro button called scanNext) ─────────────────────
function scanNext() { renderIntro(); }

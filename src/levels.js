const levels = [
    {
        e:20, // enemies
        sn:2, // snakes
        sq:1, //squids
        p: { // player modifications
            fr:0.1,
            l:3,
            y:600,
            dy:-2,
            h:1
        },
        hideUpdates: true, // show upgrade-buttons?
        d:"Day 13 of the invasion, the final battle!",
        m:"LAUNCH",
        failure:"Yep, that's me!\nYou are probably wondering, how I ended up in this situation.\nIt all began 13 days ago, when the first scouts of the aliens, now known as 'Triskaideka', entered earths atmosphere.\nThe arrival of them triggered a global mass hysteria:\n\nTRISKAIDEKA-PHOBIA"
            + "\n\nMy experimental Jet, the A.I.R.W.O.L.F.\n(Advanced Intercept Rocket, Worlds Only and Last hope for Future)\nwas the only capable craft to defend earth against the intruders."
            + "\n\nBut lets have a look at all the events from the beginning...",
        success:"",
        adv:true, // advance level even if failed
        respawn:Infinity // number of enemies to respawn
    },
    {
        e:3,
        d:"Day 0 of the invasion, the first scouts appear.",
        m:"LAUNCH!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!",
        respawn:3
    },
    {
        e:10,
        d:"Day 2 of the invasion, more scouts.",
        m:"LETS GO!",
        success:"If that's all they have, this invasion will be over tomorrow!\n\nAnd the parts of their crashed ships still look promising.\nLets salvage some more parts...",
        failure:"Ouch!\n\nThat hurt!\n\nBut the rocket is still in relative good shape.\n\nI'll just add some bolts, and return to battle!"
    },
    {
        e:10,
        sn:2,
        d:"Day 5 of the invasion, what's that? Snakes?",
        m:"EAT THAT, SNAKE!",
        success:"Snakes?!?! Well, they didn't like my lasers.\n\nLet's see what they come up with next...",
        failure:"AH!!! I hate snakes!\n\nWhere is my repair-hammer?\n\nAh! Here! Ok, just some taps here and there will do the trick.\n\n*BANG* ... *BOINK*\n\nAs good as new! Here we go again..."
    },
    {
        e:15,
        sn:4,
        d:"Day 7 of the invasion, they keep coming",
        m:"I HATE SNAKES!",
        success:"Ok, how creative. They just keep sending more snakes.\n\nWell, i've sent them more rounds of laser-bolts in return.\n\nBRING IT ON!",
        failure:"Indy, i feel you.\n\n Oh boy, do i hate snakes...\n\nLets try again!"
    },
    {
        e:10,
        sn:2,
        sq:1,
        d:"Day 8 of the invasion, dawn of the squids. WHAT?!?! SQUIDS?!?! AAAAHHH!!!",
        m:"FOR FRODO!",
        success:"Squids.\n\nThat was a surprise.\nEspecially that they split into snakes.\n\nBut still: no match for my A.I.R.W.O.L.F., ha!",
        failure:"Squids?!?! What the heck? They took me by surprise. Let's check them out again!"
    },
    {
        e:20,
        sn:4,
        sq:2,
        d:"Day 10 of the invasion, will there be an end?",
        m:"GO GO GO GO!",
        success:"Ok, they doubled their attacking crafts and... creatures.\n\nSo, i should also increase my firepower.\nLet's search the crashed aliens for upgrades...",
        failure:"Oh. That rapid unplanned disassembly was unfortunate.\n\nWhere is my duct tape?\n\n*covers rocket in grey tape*\n\nThat should work..."
    },
    {
        e:30,
        sn:5,
        sq:3,
        d:"Day 13 of the invasion, no end in sight",
        m:"THERE IS NO TRY!",
        success:"Hu? How did that happen?\n\nYou are not supposed to win this game... ;-)\n\nHowever: congratulations, and thanks for playing!",
        failure:"ARGHL!\n\nThat cant be true!\nHow many of these TRISKAIDEKA is out there?!?!\nFeels like there is no end!\n\n\n\nWell. In fact: there is no happy end.\nThats the worst day in earth's history.\nYou can try again, but...\nTRISKAIDEKAPHOBIA is real.\nThere is no escape...\n\nThanks for playing ;-)",
        respawn:Infinity
    }
];
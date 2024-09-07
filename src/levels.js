const levels = [
    {
        e:40, // enemies
        sn:2, // snakes
        sq:2, //squids
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
        adv:true // advance level even if failed
    },
    {
        e:3,
        d:"Day 0 of the invasion, the first scouts appear.",
        m:"LAUNCH!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!"
    },
    {
        e:10,
        d:"Day 1 of the invasion, more scouts.",
        m:"LETS GO!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!"
    },
    {
        e:10,
        sn:2,
        d:"Day 2 of the invasion, what's that? Snakes?",
        m:"EAT THAT, SNAKE!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!"
    },
    {
        e:15,
        sn:4,
        d:"Day 3 of the invasion, they keep coming",
        m:"I HATE SNAKES!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!"
    },
    {
        e:10,
        sn:2,
        sq:1,
        d:"Day 4 of the invasion, dawn of the squids.\nWHAT?!?! SQUIDS?!?! AAAAHHH!!!",
        m:"FOR FRODO!",
        success:"HA HA HA!\n\nThose filthy scout ships had no chance against me and my rocket!\n\nAnd from the scrap parts they left behind,\nI might be able to upgrade some systems...",
        failure:"Those scouts were tough!\n\nSo, after a quick repair of my craft, I launched again!"
    }
];
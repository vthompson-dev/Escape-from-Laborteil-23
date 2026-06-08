// -----------------------------
// Simple text-adventure template
// -----------------------------
const state = {
    isGameOver: false,
    roomId: "start",
    inventory: new Set(),
    doorLocked: {
        lp: true,
        eass: true,
        ak: false,
        ta: false,
        hallForward: false,
        centerRoom: true,
        eavp: false,
        tp: true,
        ks: true,
        eats: true
    },
    dialsReady: false,
    password: null,
    trapTriggered: false,
    wireIsLooped: true,
    soldatenInert: false,
    elfDead: false,
    elfHeld: false,
    knowButtonCode: false
};

const hallImg = '<p><img src="https://cdn2.inkarnate.com/782746-564edd38-ef1d-11f0-b676-92150f3039f7" width="600"></p>'

const inRoom = (...rooms) => rooms.includes(state.roomId);

const rooms = {
    start: {
        name: "Brightly-lit Hallway",
        describe() {
            return [
                "You are in a long hallway. The walls are made of pale grey bricks. Overhead, glass jars refract faerie lights withing, casting a cool white glow throughout.",
                "To your left, there is one door on the left side and two doors to your right.",
                "In front of you is a set of large, metal double doors.",
                "To your right, there are two doors on the left side and one door on the right.",
                "Behind you is a short vestibule, its other end collapsed into a pile of rubble. To the left of the entry area is a placard reading 'Laborteil 23'."
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Grosshalle' (Main Hall) on the map."
            ].join(" ");
        }
    },
    hallForward: {
        name: "Middle Doors",
        describe() {
            return [
                "The double doors reflect the faerie light in their serene, silvery surfaces. They appear to be unlocked.",
                "Do you want to try and open the doors? (use 'open door')"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Mittenweg' (Center Path) on the map."
            ].join(" ");
        }
    },
    centerRoom: {
        name: "Center Room",
        describe() {
            return [
                "The doors open without even a squeak of hinges. The interior appears to be a cramped room with a high ceiling.",
                "On the other end of the room is a large circular door. It appears to have some sort of mechanism built into it."
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Auswegstor' (Exit Gate) on the map."
            ].join(" ");
        }
    },
    leftWing: {
        name: "Hallway Left Wing",
        describe() {
            return [
                "The left wing of the hall has one door on the left. This door appears to be made from thick steel, and it has a placard next to it that reads, 'E. A. V. P.'.",
                "The right wall of this wing has two doors. The closer of the two doors is small and made of steel, with a label of 'E.A.T.S.'. The one at the end of the hall is a wide bay door with a placard that reads, 'A.K.'.",
                "Will you try to open the left door ('open eavp door'), open the closer right door ('open eats door'), open the farther right door ('open ak door'), or turn back ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Linker Fluegel' (Left Wing) on the map."
            ].join(" ");
        }
    },
    rightWing: {
        name: "Hallway Right Wing",
        describe() {
            return [
                "The right wing of the hall has two doors on the left. The closer of the two doors is made of thick steel, and there appears to be a layer of oiled wool surrounding the cracks. The placard next to the door reads, 'K.S.'.",
                "The farther left door is a wooden door painted black with gold accents. The placard next to it reads, 'L.P.'.",
                "The right wall of this wing has a single open doorway. Its placard reads, 'T.A.'.",
                "Will you enter the right doorway ('go ta room'), open the closer left door ('open ks door'), open the farther left door ('open lp door'), or turn back ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Rechter Fluegel' (Right Wing) on the map."
            ].join(" ");
        }
    },
    eavpRoom: {
        name: "E.A.V.P. Room",
        describe() {
            return [
                "The door opens at a touch; it is not locked.",
                "This room appears to be a series of connected halls, lined with brick walls and tiled floors. Faerie lights are fixed in regular intervals. Each hall is segmented with an open doorway, seemingly without doors.",
                "At the end of this room, a heavy brass lever juts out of the wall. Do you pull the lever ('pull lever') or turn back ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Elektrumarmee Verteidigung Pruefungskammer' (Electrum Army Defense Testing Chamber) on the map."
            ].join(" ");
        }
    },
    eatsRoom: {
        name: "E.A.T.S. Room",
        describe() {
            return [
                "The door shimmers with a dangerous heat. Looking at the handle, it is clear that it and the mechanism it is attached to are both partially melted. You wisely conclude that opening, let alone touching it, would be a bad idea.",
                "You should probably turn back and try a different door."
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Elektrumarmee Teilenschmiede' (Electrum Army Parts Forge) on the map."
            ].join(" ");
        }
    },
    akRoom: {
        name: "A.K. Room",
        describe() {
            return [
                "The metal bay door is shut, but you turn a winch on it which gradually raises it to reveal an area is covered in shelves with all manner of magical and arcanic objects. Potions, mechanical parts, crystals, and other materials litter the place.",
                "At the end of the room, there is a wooden door, leading to another room. Do you want to try and open the door ('open door'), check for supplies ('check supplies'), or turn back ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Ausruestungskammer' (Equipment Chamber) on the map."
            ].join(" ");
        }
    },
    taRoom: {
        name: "T.A. Room",
        describe() {
            return [
                "Walking into the open doorway, you see a small, narrow room lined wtih shelves. They are all filled end-to-end with technical documents and scholarly tomes.",
                "At the end of the room, there is a wooden desk with a single drawer. On the desk's surface, there is a book entitled 'Laborteil 23 User Manual'. On the wall to the right of the desk, there appears to be a simple map of the area.",
                "Do you want to open the manual ('open manual'), open the drawer, ('open drawer'), take map ('take map'), or return to the right wing ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Technische Archiven' (Technical Library) on the map."
            ].join(" ");
        }
    },
    ksRoom: {
        name: "K.S. Room",
        describe() {
            return [
                "A thin layer of ice appears to coat this door. Trying the handle, you find that it is frozen shut.",
                "You need to forcibly pull your hand from the icy door, causing a layer of your skin to part. Cursing, you decide that this door isn't worth your time."
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Kalter Schrank' (Cold Room) on the map."
            ].join(" ");
        }
    },
    lpDoor: {
        name: "L.P. Door",
        describe() {
            return [
                "The expensive wooden door has a silvery knob and keyhole. Trying the door, it appears to be locked. It seems that you need a key to enter('use key')."
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Laborant Privatkammer' (Lab Proprietor's Private Chambers) on the map."
            ].join(" ");
        }
    },
    lpRoom: {
        name: "L.P. Room",
        describe() {
            return [
                "This room is vast, with a furnace-like hearth, floor-to-ceiling bookshelves, and an enormous piano. However, there is no sitting furniture.",
                "There are two sub-rooms at the far end. One is a bedroom with an enormous bed and a tall armoire. The other appears to be a washroom, complete with a water pump and gargantuan basin.",
                "Do you want to look around the room ('look'), play the piano ('play piano'), open the armoire ('open armoire'), or turn back ('turn back')?"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Laborant Privatkammer' (Lab Proprietor's Private Chambers) on the map."
            ].join(" ");
        }
    },
    eassRoom: {
        name: "E.A.S.S. Room",
        describe() {
            return [
                "This is a fairly empty tiled room, with some tools and parts on shelves. In the center are four consoles that appear to house something large."].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Elektrumarmee Soldatenschutz' (Electrum Army Soldier Containment) on the map."
            ].join(" ");
        }
    },
    tpRoom: {
        name: "Teleporter Room",
        describe() {
            return [
                "Pushing open the large, circular door, you enter into a a wide chamber consisting of a stone console with glowing ley lines which connect to an inscribed circle in the floor.",
                "As you enter, the circle on the floor erupts in a jet of light, from which steps a tall male elf. He is dressed in fine dark blue robes, which contrast with the grey of his hair and eyes. His face contorts into a grimace as he makes eye contact with you.",
                "Pulling a metal rod from an inner pocket, he shouts, 'Elektrum Soldaten, bringt diese Ratte um!'"
            ].join(" ");
        },
        lookMap() {
            return [
                "This area is labeled 'Fernreiserdienst' (Teleportation Services) on the map."
            ].join(" ");
        }
    }
};

// UI helpers
const $log = document.querySelector("#log");
const $cmd = document.querySelector("#cmd");
const $go = document.querySelector("#go");
const $restart = document.querySelector("#restart");
const $status = document.querySelector("#status");

const escapeHtml = (s) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const writeLine = (text, cls = "system") => {
    const p = document.createElement("p");
    p.className = `line ${cls}`;
    p.innerHTML = escapeHtml(text);
    $log.appendChild(p);
    $log.scrollTop = $log.scrollHeight;
};

const writeLetter = (text, cls = "letter") => {
    const p = document.createElement("p");
    p.className = `line ${cls}`;
    p.innerHTML = escapeHtml(text);
    $log.appendChild(p);
    $log.scrollTop = $log.scrollHeight;
};

const renderStatus = () => {
    const inv = [...state.inventory].join(", ") || "empty";
    $status.textContent =
        `Area: ${rooms[state.roomId].name} | Inventory: ${inv}`;
};

const resetGame = () => {
    state.isGameOver = false;
    state.roomId = "start";
    state.inventory = new Set();
    state.doorLocked = {
        lp: true,
        eass: true,
        ak: false,
        ta: false,
        hallForward: false,
        centerRoom: true,
        eavp: false,
        tp: true,
        ks: true,
        eats: true
    };
    state.dialsReady = false;
    state.password = false;
    state.wireIsLooped = true;
    state.soldatenInert = false;
    state.elfDead = false;
    state.elfHeld = false;
    state.knowButtonCode = false;

    $log.innerHTML = "";
    writeLine("It's all a blur --- the trip down the lift, the dark cavern system, and your dive through the doorway as the ceiling collapsed into rubble. Now you're in an unfamiliar place, and it's up to you to find your way out.", "system");
    writeLine("Type 'help' for commands. Your adventure begins.", "system");
    renderStatus();

    $cmd.value = "";
    $cmd.focus();
    $go.disabled = false;
};

// Parsing helpers
const normalize = (input) =>
    input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")  // drop punctuation
        .replace(/\s+/g, " ");    // collapse spaces

const has = (item) => state.inventory.has(item);

// Game actions
const doLook = () => {
    if (inRoom("start")) {
        writeLine(rooms[state.roomId].describe(), "event");
        writeLine("Will you go left, go right, or go forward?");
    }
    else if (inRoom("centerRoom")) {
        writeLine("The door has five dials on it, with a large button underneath them. Each dial has a white arrow on it, and around it are painted each letter of the alphabet. Overhead, there appears to be some sort of nozzle aimed down toward the dials. Do you want to turn the dials to spell a word ('turn dials') or turn back ('turn back')?", "system")
    }
    else if (inRoom("tpRoom")) {
        writeLine("Looking in front of you, the circle behind the elf continues to beam a jet of white light. Behind you, one of the ley lines connecting the circle to the console also glows white. You get the impression that the circle is still active, but you can't say for how long.", "system")
        writeLine("In the distance, you hear the clanking sounds of something heavy and metallic moving over the tiled floor. Whatever it is, it will be upon you soon. Do you want to go into the light ('go white light')?", "system")
    } else if (inRoom('eassRoom')) {
        writeLine("Looking into the window port of the consoles, you see that two of them are empty. The other two appear to contain massive humanoid constructs made from a silvery-golden alloy.", "system")
        writeLine("The shelves and cupboards of the room are strewn with parts and supplies, presumably for maintaining the constructs. You also see a glass case at the far end of the room, framed with brass. It contains a hook holding a ring of keys.", "system")
        writeLine("Do you want to open the consoles ('open consoles'), open the glass case ('open glass case'), or turn back (turn back')?", "system")
    } else if (inRoom('lpRoom')) {
        writeLine("Everything in this room, from the bed to the books, is colossal. Whoever uses this room is far larger than you.", "system")
        writeLine("There are hundreds of books on the shelves in a range of topics like literature, history, engineering, and magic. Some are in a language you can read, but most aren't.", "system")
        writeLine("Looking more closely at the armoire, it does not appear locked. However, there is a very fine wire looped over one of the handles, with the other end slipping between the cabinet doors. Do you want to unloop the wire ('unloop')?", "system")
    } else {
        writeLine(rooms[state.roomId].describe(), "event");
    }
};

const doNoExit = () => {
    writeLine("The entire cave has crumbled beyond the entrance. Your only way out is through.", "system")
}

const doGoForward = () => {
    if (inRoom("start")) {
        state.roomId = "hallForward";
        enterRoom("hallForward");
    }
}

const doGoLeft = () => {
    if (inRoom("start")) {
        state.roomId = "leftWing";
        enterRoom("leftWing");
    }
}

const doGoRight = () => {
    if (inRoom("start")) {
        state.roomId = "rightWing";
        enterRoom("rightWing");
    }
}

const doTurnBack = () => {
    if (inRoom("centerRoom", "hallForward", "leftWing", "rightWing")) {
        writeLine("You re-orient yourself by returning to the collapsed entrance in the center of the hallway.", "system");
        state.roomId = "start";
        enterRoom("start");
    } else if (inRoom("eavpRoom", "eatsRoom", "akRoom")) {
        writeLine("You leave the room and return to the left wing of the main hall.", "system");
        state.roomId = "leftWing";
        enterRoom("leftWing");
    } else if (inRoom("eassRoom")) {
        writeLine("You leave the room and return to the room labeled as 'AK'.", "system");
        state.roomId = "akRoom";
        enterRoom("akRoom");
    } else if (inRoom("taRoom", "ksRoom", "lpRoom", "lpDoor")) {
        writeLine("You leave the room and return to the right wing of the main hall.", "system");
        state.roomId = "rightWing";
        enterRoom("rightWing");
    }
}

// pull eavp lever

const doPullLever = () => {
    writeLine("Pulling the lever, the tile under your feet sinks down into a small cart, and metal manacles clasp your ankles. The cart begins rolling backward as the room whirs to life.", "system");
    writeLine(" Each hall segment subjects you to a different agony. You are pelted with rocks, shot full of arrows, sliced by flying knives, doused in acid, struck by a bolt of lightning, and finally, bathed in fire.", "system");
    writeLine("By the end, naught remains of your carcass but a smoking heap.", "system")
    gameOver();
}

// turn center room dials

const doTurnDials = () => {
    writeLine("Type a five-letter code and hit Enter to turn the dials and press the center button.", "system");
    state.dialsReady = true;
}

const enterDialsWord = () => {
    if (state.password === true) {
        writeLine("You carefully turn each dial to spell out 'olala' and then press the button. You hear a series of satisfying creaks as the door's locking mechanisms disengage. Do you open the door ('open center door') or turn back ('turn back')?", "system");
        return;
    } else {
        writeLine("As you press the button on the door, you hear a faint hissing sound overhead. The nozzle above you jets forth a stream of boiling oil as you are fried to a crisp.", "system");
        gameOver();
    }
}

const doInventory = () => {
    const items = [...state.inventory];
    if (!items.length) return writeLine("Your inventory is empty.", "system");
    writeLine(`You are carrying: ${items.join(", ")}.`, "system");
};

// take functions

const doTake = (what) => {

    if (what === "drawer key" && inRoom("taRoom")) {
        if (has("drawer key")) return writeLine("You already picked up the drawer key.", "system");
        state.inventory.add("drawer key");
        writeLine("You pick up the small brass key. It looks like it could go with a small chest or cabinet.", "event");
        renderStatus();
        return;
    }

    else if (what === "map" && inRoom("taRoom")) {
        if (has("map")) return writeLine("You already picked up the map.", "system");
        state.inventory.add("map");
        writeLine("You take the map from the wall and have a good look at it before rolling it up. Use 'look map' to see where you are on the map.", "event");
        $log.insertAdjacentHTML('beforeend', hallImg);
        writeLine("Now that you have the map, do you want to open the manual ('open manual'), open the drawer, ('open drawer'), or return to the right wing ('turn back')?")
        renderStatus();
        return;

    }

    else if (what === "black iron key" && inRoom("akRoom")) {
        if (has("black iron key")) return writeLine("You already picked up the black iron key.", "system");
        state.inventory.add("black iron key");
        writeLine("You pick up the heavy iron key. It looks like it pairs with a similarly heavy lock.", "event");
        renderStatus();
        return;
    } else if (what === "key ring" && inRoom("eassRoom")) {
        if (state.trapTriggered === false) {
            state.inventory.add("key ring");
            writeLine("You pick up the key ring. You see pairs to the keys you have already picked up, as well as a few others you haven't seen before.", "event");
            renderStatus();
        } else {
            consoleCondition();
        }
        return;
    } else if (what === "tuning fork" && inRoom("lpRoom")) {
        state.inventory.add("tuning fork");
        writeLine("You pick up the rod. It is small enough to fit comfortably in your hand. You have no clue what it is for, though.", "event");
    } else { writeLine("You don't see that here.", "system"); }
};

const doLookMap = () => {
    writeLine(rooms[state.roomId].lookMap(), "event");
    $log.insertAdjacentHTML('beforeend', hallImg);
}

const doOpenDrawer = () => {
    if (!has("drawer key")) {
        writeLine("A series of ledgers and contracts are organized by date inside the drawer. Underneath the stack of papers, you find a small envelope, in which rests a small brass key. Do you take the key ('take drawer key')?")
    } else {
        writeLine("You've already looked in the drawer. You find nothing new.")
    }
}

const doOpenManual = () => {
    writeLine("The user manual turns out to be an empty journal with a rectangular space cut into all of the pages. Inside is a folded-up letter which reads:", "system");
    writeLetter("Dear intruder,", "letter")
    writeLetter("Welcome to Laboratory Division 23. I see that you've at least a scrap of cunning; perhaps more if this is not the first room you've entered. Assuming that you haven't collapsed the tunnel on your way in, I kindly request that you see yourself out and forget about this place. No one will believe you if you tell them, anyway.", "letter")
    writeLetter("There are no valuables for you here; certainly none worth your life, anyway. If I return and find even a scrap of paper missing, you can rest assured that I will come looking for it.", "letter")
    writeLetter("So, there you have it. I am willing to look the other way, as long as you see yourself out. Choose wisely.", "letter")
    writeLetter("Yours sincerely, The Proprietor of Laboratory Division 23", "letter")

}

const consoleCondition = () => {
    if (!has("tuning fork")) {
        writeLine("You begin to hear the sound of turning gears and feel the temperature begin to rise as the constructs whir to life. In seconds, they have detached themselves from the consoles' housing and are standing before you, with steam puffing out from their joints. Do you stand your ground ('stand ground'), attempt to flee ('run away'), or try to fight them ('fight')?")
    } else {
        writeLine("Shortly after uncovering them, you begin to hear the sound of turning gears and feel the temperature begin to rise as the constructs whir to life. In seconds, they have detached themselves from the consoles' housing and are standing before you, with steam puffing out from their joints. Do you stand your ground ('stand ground'), attempt to flee ('run away'), try to fight them ('fight'), or use the tuning fork ('use tuning fork')?")
    }
}

const doOpenConsoles = () => {
    writeLine("You pull the lever next to each console to retract the front cover, getting a closer look at the constructs. They are nearly eight feet tall, with wide frames and turtle-like heads that tuck into the main chassis. Their arms appear to have large blades retracted into them, as well as other, unfamiliar devices.")
    consoleCondition();
}

const doOpenCase = () => {
    if (!has("drawer key")) {
        writeLine("Although there is a lock on the door, it opens without a key. The ring of keys is yours for the taking. Do you take it ('take key ring')?");
        state.trapTriggered = true;
    } else {
        state.trapTriggered = false;
        writeLine("The brass key fits perfectly into the case's lock. The ring of keys is yours for the taking. Do you take it ('take key ring')?");
    }
}

// Elektrumarmee interaction functions

const doStandGround = () => {
    if (inRoom("eassRoom")) {
        writeLine("You stand where you are, unsure of the constructs' intentions as they exit their consoles. They face you, and you hear, 'Verbrecher erwischt', in a pair of metallic voices.", "system");
        writeLine("Before you can interpret the meaning, each construct extends its armblades and swings at you. They cut you to ribbons in a matter of seconds. ", "system");
        gameOver();
    } else {
        writeLine("You stand where you are, unsure of the constructs' intentions as they approach. They face you, and you hear, 'Verbrecher erwischt', in a pair of metallic voices.", "system");
        writeLine("Before you can interpret the meaning, each construct extends its armblades and swings at you. They cut you to ribbons in a matter of seconds. ", "system");
        gameOver();
    }
}

const doFight = () => {
    writeLine("Suddenly aware of the danger you are in, you grasp for a nearby wrench and swing it down on the head unit of the nearest construct.", "system");
    writeLine("Crunch", "Letter");
    writeLine("There is now a small dent on the construct's head, but the impact has bent your wrench into an L shape. The affected construct points its arm at you and unleashes a jet of blue flame, while the other extends its arm blade and decapitates you. Maybe you needed a bigger wrench.", "system");
    gameOver();
}

const doRunAway = () => {
    writeLine("Suddenly aware of the danger you are in, you turn tail and bolt out of the room. Before you can shut the door behind you, you are hit square in the back with a gout of white-hot steam. It isn't long before you are boiled and red like a lobster.", "system");
    gameOver();
}

const doUseFork = () => {
    writeLine("In desperation, you take out the tuning fork you found and point it at the constructs. To your shock and relief, they stop moving toward you and stand quiescent.", "system");
    writeLine("'Erklaeren Sie bitte Ihren Befehl', they emit in unison. They appear to be awaiting your response.", "system");
    if (inRoom("tpRoom")) {
        writeLine("You get the feeling that they are awaiting a command. Do you tell them to attack the elf ('attack elf') or hold him back ('hold back')?", "system");
    } else {
        writeLine("Not sure what to do, you tell them to return to their consoles. They return wordlessly, closing the glass door behind them. This could come in handy.", "system");
    }
}

// LP Room functions

const doPlayPiano = () => {
    writeLine("You have to climb up the bench to reach the piano. Each key is as wide as your thigh.", "system");
    writeLine("You have to push down each key with both hands to make a sound. You start playing a tune, you are quickly worn out by the effort.", "system");
}

const doUnloop = () => {
    state.wireIsLooped = false;
    writeLine("You carefully pull the loop around the handle. As the wire grows taut, you hear several thumps, as if several object careened agains the inside of the cabinet door.", "system");
}

const doOpenArmoire = () => {
    if (state.wireIsLooped === true) {
        writeLine("You pull open an armoire door with both hands. Before you have a chance to examime its contents, your chest is filled with feathered darts.", "system");
        writeLine("Your muscles begin to lock up as you fall forward. You have just enough time to lament your curiosity before the paralytic poison reaches your diaphragm.", "system");
        gameOver();
    } else {
        writeLine("Opening an armoire door, you see that several feathered darts are stuck into the inside. Good thing you unlooped the wire.", "system");
        writeLine("Inside, you find a rolled-up scroll and a device resting on a cushion of crushed green velvet. The device is a rod with a similar appearance to a tuning fork.", "system");
        writeLine("Do you want to read the scroll ('read scroll'), take the tuning fork ('take tuning fork'), or turn back ('turn back')?", "system");
    }
}

const doReadScroll = () => {
    writeLine("Unrolling the scroll, you reveal what appears to be a letter, dry with age. It is written in a language you don't know.", "system");
    writeLetter("Lieber Harwathien,", "letter")
    writeLetter("Ich weiss genau, dass du die Herbstvolk nicht vertraust. Dennoch muss Luvitja ihnen Hilfe anbieten, ehe die Sonnensucher ihren grellen Lichtgott in die Welt rufen.", "letter")
    writeLetter("Da du stets misstrauisch bist, schicke ich dir einen wichtigen Befehl. Verkleid dich als Elb und schliess ihren Armee an. Fueg ein, beobacht, und erstatt Bericht.", "letter")
    writeLetter("Nachdem ich die Tierengesteine abliefere und den Feuergeneral niederschlage, schick ich dir eine Nachricht. Danach werden wir wiedersehen.", "letter")
    writeLetter("Immer deine, Olala", "letter")
}

// Escaping from the teleporter room

const doRunLight = () => {
    writeLine("You step into the light. For a few seconds, you feel nothing... until you experience a sensation of lightness. Before you lift off the ground, the feeling suddenly dissipates.", "system");
    writeLine("Looking around, you see that the elf has approached to the console and is pressing buttons. Moments later, two massive humanoid constructs made from a silvery-golden alloy burst into the room.", "system")
    if (has('tuning fork')) {
        writeLine("The rod in the elf's free hand gives you an idea. Do you want to use your tuning fork ('use tuning fork'), run away ('run away'), or stand your ground ('stand ground')?", "system")
    } else {
        writeLine("You are uncertain how to proceed. Do you want to  run away ('run away') or stand your ground ('stand ground')?", "system")
    }
}

const doAttackElf = () => {
    writeLine("Before the elf can process what happened, the automatons descend upon him, knives extended. You turn away and close your ears against the carnage.", "system");
    writeLine("Once again, the constructs return to an inert state. The console is now free to use. Do you want to use it ('approach console')?", "system");
    state.elfDead = true;
}

const doHoldBack = () => {
    writeLine("Before the elf can process what happened, the automatons descend upon him, seizing his arms and twisting the rod from his grasp.", "system");
    writeLine("The console is now free to use. Do you want to use it ('approach console')?", "system");
    state.elfHeld = true;
}

const doApproachConsole = () => {
    writeLine("Approaching the console, you find a series of buttons and switches, all incomprehensible to you.", "system");
    if (state.elfDead === false) {
        if (state.elfHeld === true) {
            writeLine("Do you want to ask the elf ('ask elf') or try to figure it out yourself ('press buttons')?", "system");
        } else {
            writeLine("The elf, unfettered, speaks a magic word. Your body erupts into searing white flames.", "system");
            gameOver();
        }
    } else {
        writeLine("The only person who knows how to use it is now dead. Do you want to try and figure it out yourself ('press buttons')?", "system");
    }

}

const doPressButtons = () => {
    if (state.knowButtonCode === true) {
        writeLine("You use the console controls as instructed by the elf, and the white light returns on the platform. Do you want to step into the light ('step into light')?", "system");
    } else {
        writeLine("Taking a guess, you flip a few choice switches and push some unthreatening buttons. The platform begins to glow with a yellow light. Do you want to step into the light ('step into light')?", "system");
    }
}

const doAskElf = () => {
    writeLine("The elf scoffs at you, spitting on the ground. With a command, the automatons slowly start to twists his arms back until he screams, 'Ich gehorche! Ich gehorche!", "system");
    writeLine("You order the constructs to bring him forward, and he shows you the buttons to press. Assuming he has told the truth, you now know how to use the console. Do you want to follow his instructions ('press buttons') or try and figure it out yourself ('wing it')?", "system");
    state.knowButtonCode = true;
}

const doWingIt = () => {
    writeLine("Taking a guess, you flip a few choice switches and push some unthreatening buttons. The platform begins to glow with a white light. Do you want to step into the light ('step into light')?", "system");
}

const doStepLight = () => {
    const luck = Math.random();
    if (state.knowButtonCode === true) {
        writeLine("You step away from the console and walk into the yellow light. Your body is tugged upward as the teleportation magic takes hold and fills your eyes with blinding colors.", "system");
        writeLine("In a few brief moments, your vision clears. You find yourself under a tree on a low hill. Looking to the right you see the walls of your city stretch outward. Well, you'll be getting free drinks at the pub off of this story for a while.", "system");
        gameFinished();
    } else {
        writeLine("You step away from the console and walk into the white light. Your body is tugged upward as the teleportation magic takes hold and fills your eyes with blinding colors.", "system");
        if (luck <= 0.25) {
            writeLine("In a few brief moments, your vision clears. You are blasted by a wave of heat as you find yourself standing before the mouth of a seething volcano. It belches out smoke and noxious gas, with the soft sound of boiling rock coming from within. Well, at least you don't have to guess where to go.", "system");
            gameFinished();
        } else if (luck > 0.25 && luck <= 0.5) {
            writeLine("In a few brief moments, your vision clears, if only just. In this dark space, only distant candlelight is there to betray the shining iron bars of a dark cell. Squinting, you see a placard on the opposite wall: 'Laborteil 15'.", "system");
            gameFinished();
        } else if (luck > 0.5 && luck <= 0.75) {
            writeLine("In a few brief moments, your vision clears. Your ears are briefly swarmed with a cacophany of sound until it gets dead silent. Looking around, you see a tavern full of unwashed, scarred sailors, all looking at you. Hopefully they enjoy a good story.", "system");
            gameFinished();
        } else {
            writeLine("In a few brief moments, your vision clears. You find yourself under a tree on a low hill. Looking to the right you see the walls of your city stretch outward. Well, you'll be getting free drinks at the pub off of this story for a while.", "system");
            gameFinished();
        }
    }
}

// General

const doCheckSupplies = () => {
    writeLine("The room is filled with all manner of magical bric-a-brac, but the main item that catches your eye is a heavy black iron key.", "system");
    writeLine("Do you take the black iron key ('take black iron key') or turn back ('turn back')?", "system")
}

const doOpenDoor = () => {
    if (inRoom("hallForward")) {
        enterRoom("centerRoom");
    }

    else if (inRoom("akRoom")) {
        if (!has("black iron key") && state.doorLocked.eass === true) {
            return writeLine("You try the door, but it is locked. The locking mechanism is made of hard black iron. You'll need a key.", "system");
        }
        // Unlock with key (keep key in inventory, simple demo)
        else {
            state.doorLocked.eass = false;
            writeLine("You insert the key. With a satisfying click, the lock opens.", "event");
            state.roomId = "eassRoom";
            enterRoom("eassRoom");
        }
    }

    else if (inRoom("lpDoor") && state.doorLocked.lp === true) {
        if (!has("key ring")) {
            return writeLine("You try the door, but it is locked. The locking mechanism is a finely-crafted work of gilded steel. You'll need a key.", "system");
        } else {
            // Unlock with key (keep key in inventory, simple demo)
            state.doorLocked.lp = false;
            writeLine("You insert the key. With a satisfying click, the lock opens.", "event");
            enterRoom("lpRoom");
        }
    } else {
        writeLine("The door is already unlocked.", "system");
    }
};

// left doors

const doOpenEAVPDoor = () => {
    enterRoom("eavpRoom");
    state.doorLocked.eavp = false;
}

const doOpenEATSDoor = () => {
    enterRoom("eatsRoom");
}

const doOpenAKDoor = () => {
    enterRoom("akRoom");
    state.doorLocked.eass = true;
}

// right doors

const doGoTARoom = () => {
    enterRoom("taRoom");
    state.doorLocked.ta = false;
}

const doOpenKSDoor = () => {
    enterRoom("ksRoom");
}

const doOpenLPDoor = () => {
    if (!has("key ring") && state.doorLocked.lp === true) {
        return writeLine("You try the door, but it is locked. The locking mechanism is a finely-crafted work of gilded steel. You'll need a key.", "system");
    } else if (has("key ring") && state.doorLocked.lp === true) {
        writeLine("You try the gilded key, matching the door's lock. With a satisfying click, the lock opens.", "event");
        enterRoom("lpRoom");
        state.doorLocked.lp = false;
    } else {
        writeLine("The door is already unlocked.", "system");
        enterRoom("lpRoom");
    }
}

//general functions

const enterRoom = (roomId) => {
    state.roomId = roomId;
    renderStatus();
    writeLine(rooms[roomId].describe(), "event");
};

const gameOver = () => {
    state.isGameOver = true;
    renderStatus();
    $go.disabled = true;
    writeLine("GAME OVER. Press Restart to try again.", "bad");
};

const gameFinished = () => {
    state.isGameOver = true;
    renderStatus();
    $go.disabled = true;
    writeLine("You successfully escaped from Laborteil 23! Thanks for playing. Press Restart to try again and get a different ending.", "good");
}

// Command routing
const handleCommand = (raw) => {
    if (!raw.trim()) return;

    if (state.isGameOver) {
        writeLine("The story is over. Hit Restart to begin again.", "system");
        return;
    }

    const input = normalize(raw);
    writeLine(`> ${raw}`, "player");

    // small command alias map
    if (input === "help") {
        writeLine("Try: look, inventory, take (item), open door, turn back.", "system");
        return;
    }
    if (input === "clear") {
        $log.innerHTML = "";
        renderStatus();
        return;
    }
    if (input === "look" || input === "l") return doLook();
    if (input === "go forward") return doGoForward();
    if (input === "inventory" || input === "i") return doInventory();

    // take/get
    if (input.startsWith("take ") || input.startsWith("get ") || input.startsWith("pick up ")) {
        const what = input.replace(/^take |^get |^pick up /, "").trim();
        return doTake(what);
    }

    // pull eavp lever

    if (input === "pull lever") {
        if (inRoom("eavpRoom")) {
            return doPullLever();
        }
    }

    // open drawer

    if (input === "open drawer") {
        if (inRoom("taRoom")) {
            return doOpenDrawer();
        }
    }

    // open manual

    if (input === "open manual") {
        if (inRoom("taRoom")) {
            return doOpenManual();
        }
    }

    // open consoles

    if (input === "open consoles") {
        if (inRoom("eassRoom")) {
            return doOpenConsoles();
        }
    }

    // stand ground

    if (input === "stand ground") {
        if (inRoom("eassRoom", "tpRoom")) {
            return doStandGround();
        }
    }

    // fight back

    if (input === "fight") {
        if (inRoom("eassRoom")) {
            return doFight();
        }
    }

    // run away

    if (input === "run away") {
        if (inRoom("eassRoom", "tpRoom")) {
            return doRunAway();
        }
    }

    // use tuning fork

    if (input === "use tuning fork") {
        if (inRoom("eassRoom", "tpRoom")) {
            return doUseFork();
        }
    }

    //look at map

    if (input === "look map") {
        if (has("map")) {
            return doLookMap();
        }
    }

    //checking supplies

    if (input === "check supplies") {
        if (inRoom("akRoom")) {
            return doCheckSupplies();
        }
    }

    //opening glass case

    if (input === "open glass case") {
        if (inRoom("eassRoom")) {
            return doOpenCase();
        }
    }

    // LP Room-specific actions
    if (input === "play piano") {
        if (inRoom("lpRoom")) {
            return doPlayPiano();
        }
    }

    if (input === "open armoire") {
        if (inRoom("lpRoom")) {
            return doOpenArmoire();
        }
    }

    if (input === "unloop") {
        if (inRoom("lpRoom")) {
            return doUnloop();
        }
    }

    if (input === "read scroll") {
        if (inRoom("lpRoom")) {
            return doReadScroll();
        }
    }

    // going out the way you came in

    if (input === "clear rubble" || input === "move rubble" || input === "leave") {
        if (inRoom("start")) {
            return doNoExit();
        }
    }

    // door movement general
    if (input === "open door" || input === "unlock door" || input === "go door" || input === "go through door") {
        return doOpenDoor();
    }

    // go left or right from hallway

    if (input === "go left" || input === "turn left") {
        if (inRoom("start")) { return doGoLeft(); }
    }

    if (input === "go right" || input === "turn right") {
        if (inRoom("start")) { return doGoRight(); }
    }

    // door movement left wing eavp

    if (input === "open eavp door") {
        if (inRoom("leftWing")) {
            return doOpenEAVPDoor();
        }
    }

    // door movement left wing eats

    if (input === "open eats door") {
        if (inRoom("leftWing")) {
            return doOpenEATSDoor();
        }
    }

    // door movement left wing ak

    if (input === "open ak door") {
        if (inRoom("leftWing")) {
            return doOpenAKDoor();
        }
    }

    // door movement right wing ta

    if (input === "go ta room") {
        if (inRoom("rightWing")) {
            return doGoTARoom();
        }
    }

    // door movement right wing ks

    if (input === "open ks door") {
        if (inRoom("rightWing")) {
            return doOpenKSDoor();
        }
    }

    // door movement right wing lp

    if (input === "open lp door") {
        if (inRoom("rightWing")) {
            return doOpenLPDoor();
        }
    }

    // turning back
    if (input === 'turn back') {
        return doTurnBack();
    }

    // center room dials

    if (input === "turn dials") {
        if (inRoom("centerRoom")) {
            return doTurnDials();
        }
    }
    // unlock center door
    if (input === "olala" && state.doorLocked.centerRoom === true) {
        if (inRoom("centerRoom") && state.dialsReady === true) {
            console.log('correct password');
            state.password = true;
            state.doorLocked.centerRoom = false;
            return enterDialsWord();
        } else {
            writeLine("That doesn't seem to work here.", "system");
        }
    } else if (input === "olala" && state.doorLocked.centerRoom === false) {
        state.password = true;
        return writeLine("You have already entered the correct password.")
    }

    if (input === "open center door" && state.doorLocked.centerRoom === false) {
        if (inRoom("centerRoom") && state.password === true) {
            return enterRoom("tpRoom");
        } else if (inRoom("centerRoom") && state.password === false) {
            return enterDialsWord();
        }
    } else if (input === "open center door" && state.doorLocked.centerRoom === true) {
        if (inRoom("centerRoom") && state.dialsReady === true) {
            console.log('incorrect password');
            state.password = false;
            return enterDialsWord();
        }
    }

    //Teleporter room commands

    if (input === "go white light" && inRoom("tpRoom")) {
        return doRunLight();
    }

    if (input === "attack elf" && inRoom("tpRoom")) {
        if (has("tuning fork")) {
            return doAttackElf();
        } else {
            writeLine("That doesn't seem to work here.", "system");
        }
    }

    if (input === "hold back" && inRoom("tpRoom")) {
        if (has("tuning fork")) {
            return doHoldBack();
        } else {
            writeLine("That doesn't seem to work here.", "system");
        }
    }

    if (input === "approach console" && inRoom("tpRoom")) {
        if (has("tuning fork")) {
            return doApproachConsole();
        } else {
            writeLine("You walk toward the console, but the automatons get there first. You are carried away, kicking and screaming, never to be heard from again.", "system");
            gameOver();
        }
    }

    if (input === "press buttons" && inRoom("tpRoom")) {
        if (has("tuning fork")) {
            return doPressButtons();
        } else {
            writeLine("That doesn't seem to work here.", "system");
        }
    }

    if (input === "ask elf") {
        if (state.elfHeld === true && state.elfDead === false) {
            return doAskElf();
        } else if (state.elfDead === true) {
            return writeLine("The elf is dead.", "system");
        } else {
            return writeLine("The elf refuses to respond.", "system");
        }
    }

    if (input === "wing it" && inRoom("tpRoom")) {
        state.knowButtonCode = false;
        return doWingIt();
    }

    if (input === "step into light" && (state.elfHeld === true || state.elfDead === true)) {
        return doStepLight(); // This needs a function written
    }

    writeLine("That doesn't seem to work here.", "system");

};

// Wire up UI
$go.addEventListener("click", () => {
    const text = $cmd.value;
    $cmd.value = "";
    handleCommand(text);
    $cmd.focus();
});

$cmd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $go.click();
});

$restart.addEventListener("click", resetGame);

// Start
resetGame();
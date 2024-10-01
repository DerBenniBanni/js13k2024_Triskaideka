# Making of "Aargh! Triskaideka attacks!" for the js13kgames.com Jam
WORK IN PROGRESS!
## The theme was announced! "Triskaidekaphobia"

**"Triskaidekaphobia" ?!?!?** What the fraggle?

My first reactions were like this:

* looking at the screen in disbelief
* hit [F5]
* stare again at the screen
* mumble a very slow "What..... the..... fraggle ?"
* google the word
* read wikipedia entry
* stare at the screen
* mumble an even slower "What..... the..... fraggle ?"
* look at the white wall behind my monitor... (quite some time)
* mumble "oh my... this sadistic end3r... ! I bet he is still laughing..."

## Theme-brainstorming-result

Aliens. The "Triskaideka" are an alien race everyone is afraid of. [End]
Yep. thats it. :-)

## The first player character
The first iteration of gameplay featured a snake-like creature as player to be controlled by gamepad or keyboard.

### Idea and concept prototypes
I wanted to add a procedurally generated creature, so i played a bit with a bunch of circles following the mouse in different distances. Which looked nice when the mouse was in movement, but it streched to much when the mouse was too fast, and collapsed into one point when the mouse stopped.

So i came up with the idea, that one circle should follow the previous one in a defines distance, and only the first is controlled by keyboard.
![basic snake with circles](img/snake_01.png)

So the position of the "head" of the "snake" was now directly updated (each frame) depending on keyboard-inputs and the segments of the tail were updated to move in the directon of the previous segment until the desired distance is reached (essentiall i calculation the vector between the two midpoints of the segment, then clamping that vector to the distance of the segment and setting the child-segment to this new position). This looked pretty organic.

Then i added a hull for the creature by calculation the 90° positions left and right and connecting them by an outline.

![outlined snake](img/snake_02.png)


### Gamepad

At this stage i added gamepad-support for the player character, which was quite easy using the Gamepad API.

Only one problem occured, when my headphones (which also have buttons) registered themself also as gamepad. But thats easy: only a check for mapping == "standard" was needed to ignore headphones.

### Recognizing that its "Prior art" on YouTube...
During research, for some angle-depending problems with the creature (it folded into itself and looked akward) i stumbled upon the very same methoid of procedural generation of fish-like creatures. So, i invented nothing at all... (not that i thought that, but i was very proud of myself at this point)

Here is the youtube-video that EXACTLY describes, what i was doing up to that point... haha: <a href="https://www.youtube.com/watch?v=qlfh_rv6khY" target="_blank">argonaut - A simple procedural animation technique (YouTube)</a>

## create a different player character
While the creature was looking really nice, and it ok to move it across the screen, i decided, that this alien should be the enemy. 

So i added a simple Asteroids-like spaceship (triangle) as player character and some lasers to shoot at the alien invader. This instantly made the game more fun to play. 

## Music. Soundbox to the rescue!

At this stage (player shooting at snake) there was one thing missing: music and SFX

### SFX

## Add other enemies
Components for huge variation

### Prerendering for performance


## Add bigger enemies

## Add another even bigger enemytype

## Reaching the 13k Limit - Roadroller to the rescue!

## Add a Story and Levels

## Add polish

### HUD

### Height-limitation

### Water reflection

### Horde-Mode

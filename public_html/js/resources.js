game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
        
        
        //calls all of the png's we need for character's etc.
        {name: "background-tiles", type:"image", src: "data/img/background-tiles.png"},
        {name: "meta-tiles", type:"image", src: "data/img/meta-tiles.png"},
        {name: "mario", type:"image", src: "data/img/aragon.png"},
        {name: "title-screen", type:"image", src: "data/img/title-screen.png"},
        {name: "slime", type:"image", src: "data/img/slime-spritesheet.png"},
        {name: "mushroom", type:"image", src: "data/img/mushroom.png"},
	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
        
        
        //calls upon level's
	 {name: "RogerLevel01", type: "tmx", src: "data/map/RogerLevel01.tmx"},
         {name: "RogerLevel02", type: "tmx", src: "data/map/RogerLevel02.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
];
